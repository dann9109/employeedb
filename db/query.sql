-- Query to view all departments
SELECT * FROM department;

-- Query to view all roles
SELECT role.id, role.title, role.salary, department.name AS department_name
FROM role
INNER JOIN department ON role.department_id = department.id;

-- Query to view all employees
SELECT employee.id, employee.first_name, employee.last_name, role.title AS job_title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
FROM employee
INNER JOIN role ON employee.role_id = role.id
INNER JOIN department ON role.department_id = department.id
LEFT JOIN employee AS manager ON employee.manager_id = manager.id;

-- Query to add a department
INSERT INTO department (id, name)
VALUES (1, 'Sales');

-- Query to add a role
INSERT INTO role (id, title, salary, department_id)
VALUES (1, 'Sales Manager', 50000, 1);

-- Query to add an employee
INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (1, 'John', 'Doe', 1, NULL);

-- Query to update an employee's role
UPDATE employee
SET role_id = 2
WHERE id = 1;