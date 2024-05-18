INSERT INTO department (name)
VALUES  ("Sales"),
        ("Engineering"),
        ("Finance"),
        ("Legal");

INSERT INTO role (title, salary, department_id)
VALUES  ("Sales Lead", 105000, 1),
        ("Salesperson", 80000, 1),
        ("Lead Engineer", 150000, 2),
        ("Software Engineer", 120000, 2),
        ("Account Manager", 160000, 3),
        ("Accountant", 125000, 3),
        ("Legal Team Lead", 250000, 4),
        ("Lawyer", 190000, 4);

        SET FOREIGN_KEY_CHECKS=0;

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ("John", "Doe", 1, null),        -- id 1, no manager
        ("Ashley", "Ortega", 3, null),   -- id 2, no manager
        ("Kindrick", "Lamar", 5, null),  -- id 3, no manager
        ("Sarah", "Betty", 7, null),     -- id 4, no manager
        ("Mike", "Chi", 2, 1),           -- id 5, manager is John Doe
        ("Benny", "Bones", 4, 2),        -- id 6, manager is Ashley Ortega
        ("Malia", "Brown", 6, 3),        -- id 7, manager is Kindrick Lamar
        ("Ted", "Crow", 8, 4);           -- id 8, manager is Sarah Betty
SET FOREIGN_KEY_CHECKS=1;


        