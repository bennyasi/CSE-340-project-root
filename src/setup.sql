-- ========================================================
-- Database Setup Script (CSE 340 Assignment)
-- ========================================================

-- Drop dependent tables first to avoid foreign key violations during resetting
DROP TABLE IF EXISTS project;
DROP TABLE IF EXISTS category;
DROP TABLE IF EXISTS organization;

-- ========================================================
-- Table Structures
-- ========================================================

-- 1. Create Organization Table
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

-- 2. Create Categories Table
CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- 3. Create Projects Table (Acts as the bridge table)
CREATE TABLE project (
    project_id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    category_id INT REFERENCES category(category_id) ON DELETE CASCADE,
    organization_id INT REFERENCES organization(organization_id) ON DELETE CASCADE
);

-- ========================================================
-- Seed Data Insertion (Must be executed in this order)
-- ========================================================

-- Step 1: Insert Parent Organizations
INSERT INTO organization (name, description, contact_email, logo_filename) VALUES 
('BrightFuture Builder', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuture.org', 'brightfuture.png'),
('GreenHarvest Grower', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'hello@greenharvest.org', 'greenharvest.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'contact@unityserve.org', 'unityserve.png');

-- Step 2: Insert Parent Categories
INSERT INTO category (name) VALUES 
('Infrastructure'), 
('Agriculture'), 
('Community Service');

-- Step 3: Insert Projects (Linked safely via verified IDs 1, 2, and 3)
INSERT INTO project (title, description, category_id, organization_id) VALUES 
('Community Center Repair', 'Renovating the local center roof and structural beams.', 1, 1),
('Neighborhood Greenhouse', 'Building a hydroponic dome for sustainable winter crops.', 2, 2),
('Weekly Food Drive', 'Sorting and distributing non-perishable goods to local families.', 3, 3);

-- ========================================================
-- Verification Block (Optional checks)
-- ========================================================
-- SELECT * FROM organization;
-- SELECT * FROM category;
-- SELECT * FROM project;