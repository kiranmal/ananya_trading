-- =====================================================
-- ANANYA TRADING COMPANY — DATABASE SCHEMA
-- Database: ananya_trading
-- =====================================================
--
-- Import karne ke tareeke:
--   1. phpMyAdmin → Import tab → ye file select karo → Go
--   2. Command line:
--      C:\xampp1\mysql\bin\mysql.exe -u root < schema.sql
--
-- =====================================================

CREATE DATABASE IF NOT EXISTS `ananya_trading`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;

USE `ananya_trading`;

-- =====================================================
-- USERS TABLE
-- Signup / Login / Profile / Admin users list
-- =====================================================

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `address` text DEFAULT NULL,
  `photo` text DEFAULT NULL,
  `role` varchar(20) DEFAULT 'user',
  `status` varchar(20) NOT NULL DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =====================================================
-- PRODUCTS TABLE
-- (Abhi products localStorage mein hain — DB shift
--  karne ke liye ye table ready hai)
-- =====================================================

CREATE TABLE IF NOT EXISTS `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `category` varchar(100) DEFAULT 'General',
  `subcategory` varchar(100) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT 0,
  `old_price` decimal(10,2) DEFAULT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  `status` varchar(20) NOT NULL DEFAULT 'Active',
  `badge` varchar(50) DEFAULT NULL,
  `rating` decimal(2,1) DEFAULT 4.8,
  `reviews` int(11) DEFAULT 0,
  `discount` varchar(20) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `images` longtext DEFAULT NULL,
  `paper_types` text DEFAULT NULL,
  `sizes` text DEFAULT NULL,
  `features` text DEFAULT NULL,
  `weight_grams` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =====================================================
-- ORDERS TABLE
-- (Abhi orders localStorage mein hain — DB shift
--  karne ke liye ye table ready hai)
-- =====================================================

CREATE TABLE IF NOT EXISTS `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` varchar(50) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `customer_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `items` text DEFAULT NULL,
  `total_price` decimal(10,2) NOT NULL DEFAULT 0,
  `payment_method` varchar(50) DEFAULT NULL,
  `payment_status` varchar(20) NOT NULL DEFAULT 'Pending',
  `status` varchar(20) NOT NULL DEFAULT 'Pending',
  `address` text DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `pincode` varchar(10) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =====================================================
-- FEEDBACK TABLE
-- Customer messages, reviews and complaints
-- =====================================================

CREATE TABLE IF NOT EXISTS `feedback` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `message` text NOT NULL,
  `type` enum('contact','review','complaint') DEFAULT 'contact',
  `product_id` int(11) DEFAULT NULL,
  `rating` int(11) DEFAULT NULL,
  `status` enum('Pending','Reviewed','Resolved') DEFAULT 'Pending',
  `admin_reply` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =====================================================
-- DELIVERY CHARGES TABLE
-- Admin-configured per-pincode shipping charge.
-- charge = 0 is an explicit free-delivery config;
-- a missing/inactive row means the pincode is NOT
-- serviceable (enforced at order time � Step 2).
-- =====================================================

CREATE TABLE IF NOT EXISTS `delivery_charges` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `pincode` char(6) NOT NULL,
  `city` varchar(100) NOT NULL,
  `state` varchar(100) NOT NULL,
  `charge` decimal(10,2) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_delivery_pincode` (`pincode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
