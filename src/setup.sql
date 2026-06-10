-- =====================================================
-- DROP EVERYTHING (CLEAN RESET - SAFE FOR DEV)
-- =====================================================
DROP TABLE IF EXISTS project_volunteers CASCADE;
DROP TABLE IF EXISTS project_categories CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS organization CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS roles CASCADE;


-- =====================================================
-- ROLES TABLE
-- =====================================================
CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    role_description TEXT
);

INSERT INTO roles (role_name, role_description) VALUES 
('user', 'Standard user with basic access'),
('admin', 'Administrator with full system access');


-- =====================================================
-- USERS TABLE
-- =====================================================
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (role_id) REFERENCES roles(role_id)
);

-- Admin test user (CHANGE PASSWORD IN APP LATER)
INSERT INTO users (name, email, password_hash, role_id)
VALUES ('Admin User', 'admin@example.com', 'placeholder_hash', 2);


-- =====================================================
-- ORGANIZATION TABLE
-- =====================================================
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
('BrightFuture Builders', 'Community infrastructure projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'Urban farming and food sustainability.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'Volunteer coordination group.', 'hello@unityserve.org', 'unityserve-logo.png');


-- =====================================================
-- PROJECTS TABLE
-- =====================================================
CREATE TABLE projects (
    project_id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(150) NOT NULL,
    project_date DATE NOT NULL,

    FOREIGN KEY (organization_id)
        REFERENCES organization(organization_id)
        ON DELETE CASCADE
);

INSERT INTO projects (organization_id, title, description, location, project_date)
VALUES
(1, 'Park Cleanup', 'Clean local parks.', 'New York Park', '2026-05-13'),
(2, 'Food Drive', 'Distribute food to families.', 'Church Center', '2026-05-16'),
(3, 'Community Tutoring', 'Tutor students.', 'BYUI Center', '2026-05-15'),
(1, 'Senior Visit', 'Visit elderly residents.', 'Care Home', '2026-05-18'),
(2, 'Beach Restoration', 'Clean beaches.', 'Coastal Marina', '2026-05-20');


-- =====================================================
-- CATEGORIES TABLE
-- =====================================================
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

INSERT INTO categories (name)
VALUES
('Environmental'),
('Educational'),
('Community Service'),
('Health and Wellness'),
('Animal Welfare');


-- =====================================================
-- PROJECT CATEGORIES (MANY TO MANY)
-- =====================================================
CREATE TABLE project_categories (
    project_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,

    PRIMARY KEY (project_id, category_id),

    FOREIGN KEY (project_id)
        REFERENCES projects(project_id)
        ON DELETE CASCADE,

    FOREIGN KEY (category_id)
        REFERENCES categories(category_id)
        ON DELETE CASCADE
);

INSERT INTO project_categories (project_id, category_id)
VALUES
(1, 1),
(1, 2),
(2, 2),
(3, 3),
(4, 2),
(5, 1);


-- =====================================================
-- PROJECT VOLUNTEERS (USERS ↔ PROJECTS)
-- =====================================================
CREATE TABLE project_volunteers (
    user_id INTEGER NOT NULL,
    project_id INTEGER NOT NULL,

    PRIMARY KEY (user_id, project_id),

    FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    FOREIGN KEY (project_id)
        REFERENCES projects(project_id)
        ON DELETE CASCADE
);


-- =====================================================
-- LOGIN SUPPORT QUERY (IMPORTANT FOR NODE.JS)
-- =====================================================
-- Use this in authenticateUser()

SELECT 
    u.user_id,
    u.name,
    u.email,
    u.password_hash,
    r.role_name
FROM users u
JOIN roles r ON u.role_id = r.role_id;