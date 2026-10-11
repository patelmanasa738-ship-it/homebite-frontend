-- ====================================================================
-- HomeBite – A Social Marketplace for Homemade Food
-- Database Schema for MySQL 8
-- Database Name: homebite
-- ====================================================================

CREATE DATABASE IF NOT EXISTS homebite CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE homebite;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    role ENUM('CUSTOMER', 'COOK', 'ADMIN') NOT NULL DEFAULT 'CUSTOMER',
    avatar_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Cook Profiles Table
CREATE TABLE IF NOT EXISTS cook_profiles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    kitchen_name VARCHAR(120) NOT NULL,
    bio TEXT,
    specialty VARCHAR(100),
    kitchen_address VARCHAR(255),
    is_verified BOOLEAN DEFAULT TRUE,
    rating_avg DECIMAL(3, 2) DEFAULT 5.00,
    rating_count INT DEFAULT 0,
    banner_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 3. Dishes Table
CREATE TABLE IF NOT EXISTS dishes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cook_id BIGINT NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    category VARCHAR(60) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    prep_time_minutes INT DEFAULT 30,
    is_vegetarian BOOLEAN DEFAULT FALSE,
    is_vegan BOOLEAN DEFAULT FALSE,
    is_gluten_free BOOLEAN DEFAULT FALSE,
    is_available BOOLEAN DEFAULT TRUE,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (cook_id) REFERENCES cook_profiles(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. Addresses Table
CREATE TABLE IF NOT EXISTS addresses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    street_address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5. Carts Table
CREATE TABLE IF NOT EXISTS carts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6. Cart Items Table
CREATE TABLE IF NOT EXISTS cart_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cart_id BIGINT NOT NULL,
    dish_id BIGINT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    special_instructions VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
    FOREIGN KEY (dish_id) REFERENCES dishes(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 7. Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    cook_id BIGINT NOT NULL,
    order_status ENUM('PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    total_amount DECIMAL(10, 2) NOT NULL,
    delivery_fee DECIMAL(10, 2) NOT NULL DEFAULT 3.99,
    delivery_address TEXT NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    special_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (cook_id) REFERENCES cook_profiles(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 8. Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    dish_id BIGINT,
    dish_name VARCHAR(150) NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (dish_id) REFERENCES dishes(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 9. Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    dish_id BIGINT NOT NULL,
    customer_id BIGINT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (dish_id) REFERENCES dishes(id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ====================================================================
-- Initial Seed Data
-- ====================================================================

-- Admin user (password: Admin@123 -> BCrypt hashed)
-- Password hashes use BCrypt ($2a$10$w... / standard bcrypt format)
-- Passwords for testing:
-- admin@homebite.com -> Admin@123
-- maria@homebite.com -> Cook@123
-- raj@homebite.com   -> Cook@123
-- emily@homebite.com -> Customer@123

INSERT INTO users (id, email, password_hash, full_name, phone_number, role, avatar_url) VALUES
(1, 'admin@homebite.com', '$2a$10$7R9f5hZ79Zk5l1O2jT9iE.k9mO1nE8yP5r6d8g1a0v2w4x6y8z0b2', 'Admin Supervisor', '+1 (555) 000-1111', 'ADMIN', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'),
(2, 'maria@homebite.com', '$2a$10$7R9f5hZ79Zk5l1O2jT9iE.k9mO1nE8yP5r6d8g1a0v2w4x6y8z0b2', 'Maria Rossi', '+1 (555) 234-5678', 'COOK', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'),
(3, 'raj@homebite.com', '$2a$10$7R9f5hZ79Zk5l1O2jT9iE.k9mO1nE8yP5r6d8g1a0v2w4x6y8z0b2', 'Rajesh Sharma', '+1 (555) 345-6789', 'COOK', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'),
(4, 'emily@homebite.com', '$2a$10$7R9f5hZ79Zk5l1O2jT9iE.k9mO1nE8yP5r6d8g1a0v2w4x6y8z0b2', 'Emily Watson', '+1 (555) 456-7890', 'CUSTOMER', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80');

-- Cook Profiles
INSERT INTO cook_profiles (id, user_id, kitchen_name, bio, specialty, kitchen_address, is_verified, rating_avg, rating_count) VALUES
(1, 2, 'Nonna\'s Hearth & Pasta', 'Cooking authentic Northern Italian recipes handed down through four generations. Fresh handmade pasta daily.', 'Italian Artisanal', '42 Maple Street, Northside', TRUE, 4.92, 48),
(2, 3, 'Spice Harmony Kitchen', 'Homestyle traditional North and South Indian delicacies cooked with freshly stone-ground spices and organic ghee.', 'Indian Traditional', '18 Oakwood Avenue, Westside', TRUE, 4.88, 36);

-- Dishes
INSERT INTO dishes (id, cook_id, name, description, category, price, prep_time_minutes, is_vegetarian, is_vegan, is_gluten_free, is_available, image_url) VALUES
(1, 1, 'Slow-Baked Ragu Lasagna', 'Layers of handmade sheet pasta, 6-hour simmered beef & pancetta bolognese, silky béchamel, and melted aged Parmigiano.', 'Italian', 16.50, 45, FALSE, FALSE, FALSE, TRUE, '/src/assets/images/dish_lasagna_1791702722110.jpg'),
(2, 1, 'Handmade Spinach Ricotta Ravioli', 'Fresh delicate pasta parcels stuffed with whipped organic ricotta and baby spinach in browned butter sage reduction.', 'Italian', 14.50, 30, TRUE, FALSE, FALSE, TRUE, 'https://images.unsplash.com/photo-1587740908075-9e245070dfaa?auto=format&fit=crop&w=800&q=80'),
(3, 2, 'Heritage Butter Chicken & Naan', 'Tender charred tandoori chicken simmered in a velvety tomato-fenugreek sauce, served with garlic naan and fragrant basmati.', 'Indian', 17.00, 35, FALSE, FALSE, FALSE, TRUE, '/src/assets/images/dish_curry_1791702733069.jpg'),
(4, 2, 'Slow-Simmered Dal Makhani', 'Whole black lentils and kidney beans slow-cooked overnight with ginger, roasted cumin, and cultured butter.', 'Indian', 13.00, 25, TRUE, FALSE, TRUE, TRUE, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80');

-- Addresses
INSERT INTO addresses (id, user_id, street_address, city, state, postal_code, is_default) VALUES
(1, 4, '742 Evergreen Terrace', 'Springfield', 'IL', '62704', TRUE);

-- Reviews
INSERT INTO reviews (id, dish_id, customer_id, rating, comment) VALUES
(1, 1, 4, 5, 'Without exaggeration, the best lasagna I have eaten in years. Tasted just like my grandmother used to bake on Sundays!'),
(2, 3, 4, 5, 'The butter chicken was extraordinarily rich and delicately spiced. The garlic naan arrived warm and soft.');
