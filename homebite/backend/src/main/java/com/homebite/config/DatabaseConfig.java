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
import java.net.URI;

@Configuration
public class DatabaseConfig {

    private static final Logger log = LoggerFactory.getLogger(DatabaseConfig.class);

    @Value("${spring.datasource.url:}")
    private String configuredUrl;

    @Value("${spring.datasource.username:}")
    private String configuredUser;

    @Value("${spring.datasource.password:}")
    private String configuredPassword;

    @Value("${spring.datasource.driver-class-name:org.postgresql.Driver}")
    private String driverClassName;

    @Bean
    @Primary
    public DataSource dataSource() {
        HikariConfig hikariConfig = new HikariConfig();
        hikariConfig.setDriverClassName(driverClassName);

        // Check if an environment variable DATABASE_URL exists (standard on Render / Cloud providers)
        String envDatabaseUrl = System.getenv("DATABASE_URL");
        if (envDatabaseUrl == null || envDatabaseUrl.isBlank()) {
            envDatabaseUrl = System.getenv("SPRING_DATASOURCE_URL");
        }
        if (envDatabaseUrl == null || envDatabaseUrl.isBlank()) {
            envDatabaseUrl = configuredUrl;
        }

        if (envDatabaseUrl != null && !envDatabaseUrl.isBlank()) {
            String urlToUse = envDatabaseUrl.trim();
            // Render PostgreSQL URLs typically look like: postgres://user:password@host:port/dbname
            // or postgresql://user:password@host:port/dbname
            if (urlToUse.startsWith("postgres://") || urlToUse.startsWith("postgresql://")) {
                try {
                    URI uri = new URI(urlToUse);
                    String host = uri.getHost();
                    int port = uri.getPort() == -1 ? 5432 : uri.getPort();
                    String path = uri.getPath();
                    String jdbcUrl = "jdbc:postgresql://" + host + ":" + port + path;

                    String userInfo = uri.getUserInfo();
                    if (userInfo != null && userInfo.contains(":")) {
                        String[] creds = userInfo.split(":", 2);
                        hikariConfig.setUsername(creds[0]);
                        hikariConfig.setPassword(creds[1]);
                    } else if (userInfo != null) {
                        hikariConfig.setUsername(userInfo);
                        hikariConfig.setPassword(configuredPassword);
                    }

                    hikariConfig.setJdbcUrl(jdbcUrl);
                    log.info("Initialized PostgreSQL DataSource from cloud URL: jdbc:postgresql://{}:{}{}", host, port, path);
                    return new HikariDataSource(hikariConfig);
                } catch (Exception e) {
                    log.warn("Could not parse URI '{}', falling back to raw string check: {}", urlToUse, e.getMessage());
                }
            } else if (!urlToUse.startsWith("jdbc:")) {
                urlToUse = "jdbc:" + urlToUse;
            }

            hikariConfig.setJdbcUrl(urlToUse);
            hikariConfig.setUsername(configuredUser);
            hikariConfig.setPassword(configuredPassword);
        } else {
            hikariConfig.setJdbcUrl(configuredUrl);
            hikariConfig.setUsername(configuredUser);
            hikariConfig.setPassword(configuredPassword);
        }

        return new HikariDataSource(hikariConfig);
    }
}
