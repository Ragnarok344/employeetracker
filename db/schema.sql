DROP DATABASE IF EXISTS `employee_db`;
CREATE DATABASE `employee_db`;

USE `employee_db`;

CREATE TABLE `department` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(25) NOT NULL,
  `budget` DECIMAL(10, 2)
);

CREATE TABLE `role` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(25) NOT NULL,
  `salary` DECIMAL(10, 2) NOT NULL,
  `department_id` INT NOT NULL,
  FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE `employee` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `first_name` VARCHAR(25) NOT NULL,
  `last_name` VARCHAR(25) NOT NULL,
  `role_id` INT NOT NULL,
  `manager_id` INT,
  FOREIGN KEY (role_id) REFERENCES role(id),
  FOREIGN KEY (manager_id) REFERENCES employee(id)
);