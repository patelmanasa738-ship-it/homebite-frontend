package com.homebite.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

@Configuration
public class DatabaseConfig {

    private static final Logger log = LoggerFactory.getLogger(DatabaseConfig.class);

    @Value("${spring.datasource.url:}")
    private String configuredUrl;

    @Value("${spring.datasource.username:postgres}")
    private String configuredUser;

    @Value("${spring.datasource.password:postgres}")
    private String configuredPassword;

    @Value("${spring.datasource.driver-class-name:org.postgresql.Driver}")
    private String driverClassName;

    @Bean
    @Primary
    public DataSource dataSource() {
        HikariConfig hikariConfig = new HikariConfig();

        // Check environment variables in priority order
        String rawDatabaseUrl = getFirstNonBlank(
                System.getenv("DATABASE_URL"),
                System.getenv("SPRING_DATASOURCE_URL"),
                configuredUrl
        );

        String username = getFirstNonBlank(
                System.getenv("SPRING_DATASOURCE_USERNAME"),
                System.getenv("DB_USER"),
                System.getenv("DB_USERNAME"),
                configuredUser
        );

        String password = getFirstNonBlank(
                System.getenv("SPRING_DATASOURCE_PASSWORD"),
                System.getenv("DB_PASSWORD"),
                configuredPassword
        );

        // 1. In-memory / Test database (e.g. H2 during tests)
        if (rawDatabaseUrl != null && rawDatabaseUrl.startsWith("jdbc:h2:")) {
            log.info("Configuring in-memory H2 DataSource for testing");
            hikariConfig.setDriverClassName("org.h2.Driver");
            hikariConfig.setJdbcUrl(rawDatabaseUrl);
            hikariConfig.setUsername(username != null ? username : "sa");
            hikariConfig.setPassword(password != null ? password : "");
            return new HikariDataSource(hikariConfig);
        }

        hikariConfig.setDriverClassName(driverClassName);

        String finalJdbcUrl;
        String finalUsername = username;
        String finalPassword = password;

        if (rawDatabaseUrl != null && !rawDatabaseUrl.isBlank()) {
            String trimmedUrl = rawDatabaseUrl.trim();

            if (trimmedUrl.startsWith("postgres://") || trimmedUrl.startsWith("postgresql://")) {
                // Parse Render/Cloud style postgres URI
                ParsedDbUri parsed = parsePostgresUri(trimmedUrl);
                finalJdbcUrl = parsed.jdbcUrl;
                if (parsed.username != null && !parsed.username.isBlank()) {
                    finalUsername = parsed.username;
                }
                if (parsed.password != null) {
                    finalPassword = parsed.password;
                }
                log.info("Detected cloud PostgreSQL URI, translated to JDBC: {}", sanitizeJdbcUrl(finalJdbcUrl));
            } else if (trimmedUrl.startsWith("jdbc:")) {
                finalJdbcUrl = trimmedUrl;
            } else {
                finalJdbcUrl = "jdbc:" + trimmedUrl;
            }
        } else {
            finalJdbcUrl = "jdbc:postgresql://localhost:5432/homebite";
        }

        // Diagnostic validation for Render / Cloud deployment
        boolean isRunningOnRender = System.getenv("RENDER") != null;
        boolean isLocalhost = finalJdbcUrl.contains("localhost") || finalJdbcUrl.contains("127.0.0.1");

        if (isRunningOnRender && isLocalhost) {
            log.error("\n" +
                "====================================================================================\n" +
                "[RENDER DEPLOYMENT ERROR] No PostgreSQL database connection configured!\n" +
                "The application is running inside Render, but no remote database environment variable\n" +
                "was found. The backend defaulted to 'localhost:5432', where no database is running.\n" +
                "\n" +
                "HOW TO FIX:\n" +
                "1. Go to your Render Dashboard (https://dashboard.render.com).\n" +
                "2. Create a PostgreSQL Database (or select your existing one).\n" +
                "3. In the database details, copy the 'Internal Database URL'.\n" +
                "4. Open this Web Service ('homebite-backend') -> Go to 'Environment' tab.\n" +
                "5. Add an environment variable:\n" +
                "     Key:   DATABASE_URL\n" +
                "     Value: <paste your Internal Database URL>\n" +
                "6. Click 'Save Changes' to redeploy.\n" +
                "====================================================================================");

            throw new IllegalStateException(
                "Render deployment failed: Missing DATABASE_URL environment variable. " +
                "Configure DATABASE_URL in your Render Web Service settings."
            );
        }

        hikariConfig.setJdbcUrl(finalJdbcUrl);
        hikariConfig.setUsername(finalUsername);
        hikariConfig.setPassword(finalPassword);

        // Connection pool stability tuning for cloud deployment
        hikariConfig.setMaximumPoolSize(10);
        hikariConfig.setMinimumIdle(2);
        hikariConfig.setConnectionTimeout(30000);
        hikariConfig.setIdleTimeout(600000);
        hikariConfig.setMaxLifetime(1800000);

        log.info("Connecting to database: {}", sanitizeJdbcUrl(finalJdbcUrl));
        return new HikariDataSource(hikariConfig);
    }

    private static String getFirstNonBlank(String... values) {
        if (values == null) return null;
        for (String v : values) {
            if (v != null && !v.isBlank()) return v.trim();
        }
        return null;
    }

    private static String sanitizeJdbcUrl(String url) {
        if (url == null) return null;
        return url.replaceAll(":[^/@:]+@", ":***@");
    }

    private static ParsedDbUri parsePostgresUri(String rawUrl) {
        String remaining = rawUrl;
        if (remaining.startsWith("postgres://")) {
            remaining = remaining.substring("postgres://".length());
        } else if (remaining.startsWith("postgresql://")) {
            remaining = remaining.substring("postgresql://".length());
        }

        String query = "";
        int queryIdx = remaining.indexOf('?');
        if (queryIdx != -1) {
            query = remaining.substring(queryIdx);
            remaining = remaining.substring(0, queryIdx);
        }

        String username = null;
        String password = null;
        String hostPart = remaining;

        int atIdx = remaining.lastIndexOf('@');
        if (atIdx != -1) {
            String userInfo = remaining.substring(0, atIdx);
            hostPart = remaining.substring(atIdx + 1);
            int colonIdx = userInfo.indexOf(':');
            try {
                if (colonIdx != -1) {
                    username = URLDecoder.decode(userInfo.substring(0, colonIdx), StandardCharsets.UTF_8);
                    password = URLDecoder.decode(userInfo.substring(colonIdx + 1), StandardCharsets.UTF_8);
                } else {
                    username = URLDecoder.decode(userInfo, StandardCharsets.UTF_8);
                }
            } catch (Exception e) {
                if (colonIdx != -1) {
                    username = userInfo.substring(0, colonIdx);
                    password = userInfo.substring(colonIdx + 1);
                } else {
                    username = userInfo;
                }
            }
        }

        String hostAndPort = hostPart;
        String dbName = "";
        int slashIdx = hostPart.indexOf('/');
        if (slashIdx != -1) {
            hostAndPort = hostPart.substring(0, slashIdx);
            dbName = hostPart.substring(slashIdx + 1);
        }

        String host = hostAndPort;
        String port = "5432";
        int colonIdx = hostAndPort.indexOf(':');
        if (colonIdx != -1) {
            host = hostAndPort.substring(0, colonIdx);
            port = hostAndPort.substring(colonIdx + 1);
        }

        String jdbcUrl = "jdbc:postgresql://" + host + ":" + port + "/" + dbName + query;
        return new ParsedDbUri(jdbcUrl, username, password);
    }

    private static class ParsedDbUri {
        final String jdbcUrl;
        final String username;
        final String password;

        ParsedDbUri(String jdbcUrl, String username, String password) {
            this.jdbcUrl = jdbcUrl;
            this.username = username;
            this.password = password;
        }
    }
}
