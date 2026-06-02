-- =========================
-- RESET TABLES
-- =========================
DROP TABLE IF EXISTS project_category;
DROP TABLE IF EXISTS project;
DROP TABLE IF EXISTS category;
DROP TABLE IF EXISTS organization;

-- =========================
-- ORGANIZATION TABLE
-- =========================
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

-- =========================
-- CATEGORY TABLE
-- =========================
CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- =========================
-- PROJECT TABLE
-- =========================
CREATE TABLE project (
    project_id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    start_date DATE,
    status VARCHAR(50),
    organization_id INT REFERENCES organization(organization_id) ON DELETE CASCADE
);

-- =========================
-- MANY-TO-MANY JOIN TABLE
-- =========================
CREATE TABLE project_category (
    project_id INT REFERENCES project(project_id) ON DELETE CASCADE,
    category_id INT REFERENCES category(category_id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, category_id)
);

-- =========================
-- SEED DATA
-- =========================
INSERT INTO organization (name, description, contact_email, logo_filename) VALUES 
('BrightFuture Builder', 'A nonprofit focused on infrastructure projects.', 'info@brightfuture.org', 'brightfuture.png'),
('GreenHarvest Grower', 'Urban farming collective.', 'hello@greenharvest.org', 'greenharvest.png'),
('UnityServe Volunteers', 'Volunteer coordination group.', 'contact@unityserve.org', 'unityserve.png');

INSERT INTO category (name) VALUES 
('Infrastructure'), 
('Agriculture'), 
('Community Service');

INSERT INTO project (title, description, start_date, status, organization_id) VALUES 
('Community Center Repair', 'Renovating building structure.', '2026-01-10', 'active', 1),
('Neighborhood Greenhouse', 'Hydroponic dome project.', '2026-02-01', 'planning', 2),
('Weekly Food Drive', 'Food distribution initiative.', '2026-03-15', 'active', 3);