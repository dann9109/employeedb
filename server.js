// Import required packages
const inquirer = require('inquirer');
const mysql = require('mysql2');
//const db = require('./db/connection');
//const express = require('express');
//const fs = require('fs');
//const { updateEmployeeManager } = require('./db/functions');



// const PORT = 3355; // Specify the port number you want to listen on

// // Create an instance of the Express application
// const app = express();
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'employee_db',
    // connectionLimit: 10,
    // multipleStatements: true
});

// Get a connection from the pool
connection.connect(function (err) {
    if (err) throw err
    console.log('Connected to the employee database.');
});
console.log(connection.threadId)


// Execute queries from db/query.sql
// executeQueriesFromFile(connection);
// Function to start the application
async function startApp() {
    // try {
    // Create a connection pool to the MySQL database


    // Prompt the user for the desired action
    const answer = inquirer.prompt([
        // ...
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
                'Update an employee manager',         // Added option
                'View employees by manager',         // Added option
                'View employees by department',       // Added option
                'Delete a department',                // Added option
                'Delete a role',                      // Added option
                'Delete an employee',                 // Added option
                "View the total utilized budget of a department",  // Added option
                'Exit',
            ],
        },
    ]).then(answer => {
        switch (answer.action) {
            // ...
            case 'Update an employee manager':      // Added case
                updateEmployeeManager();
                break;
            case 'View employees by manager':       // Added case
                viewEmployeesByManager();
                break;
            case 'View employees by department':    // Added case
                viewEmployeesByDepartment();
                break;
            case 'Delete a department':             // Added case
                deleteDepartment();
                break;
            case 'Delete a role':                   // Added case
                deleteRole();
                break;
            case 'Delete an employee':              // Added case
                deleteEmployee();
                break;
            case 'View the total utilized budget of a department':  // Added case
                viewDepartmentBudget();
                break;
            case 'View all departments':
                viewAllDepartments()
                break
            case 'View all roles':
                viewAllRoles()
                break
            case 'View all employees':
                viewAllEmployees()
                break
            // ...
        }
    });


    // } catch (error) {
    //     console.error('Error:', error.message);
    // }
}

function viewAllDepartments() {
    connection.query("SELECT * FROM department", (err, res) => {
        if (err) throw err
        console.table(res)
        startApp()
    })
}

function viewAllRoles() {
    connection.query("SELECT * FROM role", (err, res) => {
        if (err) throw err
        console.table(res)
        startApp()
    })
}

function viewAllEmployees() {
    connection.query("SELECT * FROM employee", (err, res) => {
        if (err) throw err
        console.table(res)
        startApp()
    })
}

// Function to execute queries from db/query.sql
// async function executeQueriesFromFile(connection) {
//     try {
//         const queryFileContent = fs.readFileSync('./db/query.sql', 'utf8');
//         //const queries = queryFileContent.split(';').map((query) => query.trim());

//         for (const query of queries) {
//             if (query) {
//                 connection.query(query);
//                 console.log('Query executed successfully:', query);
//             }
//         }
//     } catch (error) {
//         console.error('Error:', error.message);
//     }
// }

// Function to view all departments
// async function viewAllDepartments(connection) {
//     try {
//         // Implement the database query to retrieve all departments
//         const [rows] = connection.query('SELECT * FROM department');

//         // Display the department names and IDs in a formatted table
//         console.table(rows);
//     } catch (error) {
//         console.error('Error:', error.message);
//     }
// }

// Function to add a role
// async function addRole(connection) {
//     try {
//         // Prompt the user to enter the name, salary, and department of the role
//         const answer = inquirer.prompt([
//             {
//                 name: 'title',
//                 type: 'input',
//                 message: 'Enter the title of the role:',
//             },
//             {
//                 name: 'salary',
//                 type: 'input',
//                 message: 'Enter the salary of the role:',
//             },
//             {
//                 name: 'department_id',
//                 type: 'input',
//                 message: 'Enter the department ID of the role:',
//             },
//         ]);

//         // Insert the role into the database
//         connection.query('INSERT INTO role SET ?', answer);

//         console.log('Role added successfully.');
//     } catch (error) {
//         console.error('Error:', error.message);
//     }
// }

// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });

startApp();