-- init.sql
CREATE DATABASE IF NOT EXISTS buffet;
CREATE USER IF NOT EXISTS 'tda_user'@'%' IDENTIFIED BY 'strongPassword?';
GRANT ALL PRIVILEGES ON buffet.* TO 'tda_user'@'%';
FLUSH PRIVILEGES;

USE buffet;

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

INSERT INTO team_name
(name)
VALUES
("IudicesDivini");

INSERT INTO team_members
(name)
VALUES
("Ad4lb3rt"),
("vojtaiguess"),
("Dxs7y");