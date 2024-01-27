// Import required packages
const inquirer = require('inquirer');
const mysql = require('mysql2/promise');

// Function to start the application
async function startApp() {
    try {
        // Create a connection pool to the MySQL database
        const pool = mysql.createPool({
            host: 'localhost',
            port: 3306,
            user: 'root',
            password: '',
            database: 'employee_db',
            connectionLimit: 10,
        });

        // Get a connection from the pool
        const connection = await pool.getConnection();

        console.log('Connected to the employee database.');

        // Prompt the user for the desired action
        const answer = await inquirer.prompt([
            {
                name: 'action',
                type: 'list',
                message: 'What would you like to do?',
                choices: [
                    'View all departments',
                    'View all roles',
                    'View all employees',
                    'Add a department',
                    'Add a role',
                    'Add an employee',
                    'Update an employee role',
                    'Exit',
                ],
            },
        ]);

        // Call the corresponding function based on the user's choice
        switch (answer.action) {
            case 'View all departments':
                await viewAllDepartments(connection);
                break;
            case 'View all roles':
                await viewAllRoles(connection);
                break;
            case 'View all employees':
                await viewAllEmployees(connection);
                break;
            case 'Add a department':
                await addDepartment(connection);
                break;
            case 'Add a role':
                await addRole(connection);
                break;
            case 'Add an employee':
                await addEmployee(connection);
                break;
            case 'Update an employee role':
                await updateEmployeeRole(connection);
                break;
            case 'Exit':
                connection.release();
                console.log('Disconnected from the employee database.');
                break;
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Function to view all departments
async function viewAllDepartments(connection) {
    try {
        // Implement the database query to retrieve all departments
        const [rows] = await connection.query('SELECT * FROM department');

        // Display the department names and IDs in a formatted table
        console.table(rows);
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        connection.release();
    }
}

// Function to view all roles
async function viewAllRoles(connection) {
    try {
        // Implement the database query to retrieve all roles
        const [rows] = await connection.query('SELECT * FROM role');

        // Display the job titles, role IDs, department names, and salaries in a formatted table
        console.table(rows);
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        connection.release();
    }
}

// Function to view all employees
async function viewAllEmployees(connection) {
    try {
        // Implement the database query to retrieve all employees
        const [rows] = await connection.query('SELECT * FROM employee');

        // Display the employee data in a formatted table
        console.table(rows);
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        connection.release();
    }
}

// Function to add a department
async function addDepartment(connection) {
    try {
        // Prompt the user to enter the name of the department
        const answer = await inquirer.prompt([
            {
                name: 'name',
                type: 'input',
                message: 'Enter the name of the department:',
            },
        ]);

        // Insert the department into the database
        await connection.query('INSERT INTO department SET ?', answer);

        console.log('Department added successfully.');
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        connection.release();
    }
}

// Function to add a role
async function addRole(connection) {
    try {
        // Prompt the user to enter the name, salary, and department of the role
        const answer = await inquirer.prompt([
            {
                name: 'title',
                type: 'input',
                message: 'Enter the title of the role:',
            },
            {
                name: 'salary',
                type: 'input',
                message: 'Enter the salary of the role:',
            },
            {
                name: 'department_id',
                type: 'input',
                message: 'Enter the department ID of the role:',
            },
        ]);

        // Insert the role into the database
        await connection.query('INSERT INTO role SET ?', answer);

        console.log('Role added successfully.');
    } catch (error) {
        console.error(err)
    }
}