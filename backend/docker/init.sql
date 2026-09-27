-- init.sql
CREATE DATABASE IF NOT EXISTS db;
CREATE USER IF NOT EXISTS 'tda_user'@'%' IDENTIFIED BY 'strongPassword?';
GRANT ALL PRIVILEGES ON db.* TO 'tda_user'@'%';
FLUSH PRIVILEGES;

USE db;

CREATE TABLE IF NOT EXISTS product (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    cost INT NOT NULL
);

CREATE TABLE IF NOT EXISTS team_name (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS team_members(
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS stops (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    image_url VARCHAR(255) GENERATED ALWAYS AS (
        CONCAT('',
            LOWER(SUBSTRING_INDEX(name, ' ', 1)),
            UPPER(LEFT(SUBSTRING_INDEX(name, ' ', -1), 1)),
            SUBSTRING(SUBSTRING_INDEX(name, ' ', -1),2), '.png'
        )
    ) STORED,
    UNIQUE(image_url),
    is_transfer BOOLEAN,
    x FLOAT,
    y FLOAT,
    wheelchair_accessible BOOLEAN,
    has_shelter BOOLEAN,
    has_bench BOOLEAN,
    has_ticket_machine BOOLEAN,
    has_display BOOLEAN
);

LOAD DATA INFILE '/var/lib/mysql-files/stops.csv'
INTO TABLE stops
FIELDS TERMINATED BY ','
ENCLOSED BY ''
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(name, is_transfer, x, y, wheelchair_accessible, has_shelter, has_bench, has_ticket_machine, has_display);

INSERT IGNORE INTO team_name
(name)
VALUES
('IudicesDivini');

INSERT IGNORE INTO team_members
(name)
VALUES
('Ad4lb3rt'),
('vojtaiguess'),
('Dxs7y');