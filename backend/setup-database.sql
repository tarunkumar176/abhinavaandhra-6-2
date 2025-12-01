-- Telugu E-Paper Database Setup
-- Run this script in PostgreSQL to create the database and user

-- Create database (run as postgres superuser)
CREATE DATABASE telugu_epaper;

-- Create user (optional - you can use existing postgres user)
-- CREATE USER telugu_admin WITH PASSWORD 'your_secure_password';
-- GRANT ALL PRIVILEGES ON DATABASE telugu_epaper TO telugu_admin;

-- Connect to the telugu_epaper database and run the following:

\c telugu_epaper;

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- The tables will be created automatically by the application
-- when it starts up for the first time.

-- Verify setup
SELECT version();
SELECT current_database();
SELECT current_user;