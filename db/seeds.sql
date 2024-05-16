INSERT INTO department (name)
VALUES ('Engineering'),
       ('Finance'),
       ('Legal'),
       ('Sales');

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Lead", 55000, 1),
         ("Engineer", 75000, 2),
         ("Legal Team Lead", 120000, 3),
         ("Accountant", 80000, 4),
         ("Salesperson", 45000, 1),
         ("Lawyer", 150000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Doe", 1, NULL),
       ("Mike", "Lee", 2, 1),
       ("Ashley", "Ortega", 3, NULL),
       ("Ben", "Tupik", 4, 3),
       ("Benito", "Colon", 5, 3),
       ("Sydney", "Todd", 6, 3),
         ("Sarah", "Lacy", 7, null);
         ("Brandon", "dubbie", 8, NULL);