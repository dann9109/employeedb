// Import required packages
const inquirer = require('inquirer');
const connection = require('./db/connection');

// Function to start the application
function startApp() {
    // try {
    // Create a connection pool to the MySQL database

    // Prompt the user for the desired action
    inquirer.prompt([
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
        console.log("helllloooooo", answer)
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
            case 'Add a role':
                addRole()
                break
            case 'Add a department':
                addDepartment()
                break
            case 'Add an employee':
                addEmployee()
                break
            case 'Select an employee':
                selectEmployee()
                break
            case 'Remove employee':
                removeEmployee()
                break
            case 'Remove department':
                removeDepartment()
                break
            case 'Remove role':
                removeRole()
                break
            // ...
        }
    });

}

// Add a function to update an employee's manager
function updateEmployeeManager() {
    // Prompt the user to select an employee to update
    connection.query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee', function (err, employees) {
        if (err) {
            console.error('Error:', err.message);
            connection.release();
            return;
        }

        const employeeChoices = employees.map((employee) => ({
            name: employee.name,
            value: employee.id,
        }));

        inquirer.prompt({
            name: 'employeeId',
            type: 'list',
            message: 'Select an employee to update their manager:',
            choices: employeeChoices,
        }).then(function ({ employeeId }) {
            // Prompt the user to select a manager for the employee
            connection.query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee', function (err, managers) {
                if (err) {
                    console.error('Error:', err.message);
                    connection.release();
                    return;
                }

                const managerChoices = managers.map((manager) => ({
                    name: manager.name,
                    value: manager.id,
                }));

                inquirer.prompt({
                    name: 'managerId',
                    type: 'list',
                    message: 'Select a new manager for the employee:',
                    choices: managerChoices,
                }).then(function ({ managerId }) {
                    // Update the employee's manager in the database
                    connection.query('UPDATE employee SET manager_id = ? WHERE id = ?', [managerId, employeeId], function (err) {
                        if (err) {
                            console.error('Error:', err.message);
                        } else {
                            console.log('Employee manager updated successfully.');
                        }
                        connection.release();
                        startApp();
                    });
                });
            });
        });
    });
}

// Add a function to view employees by manager
async function viewEmployeesByManager() {
    try {
        // Prompt the user to select a manager
        const managers = await connection.query('SELECT DISTINCT manager_id, CONCAT(m.first_name, " ", m.last_name) AS manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id');
        const managerChoices = managers[0].map((manager) => ({
            name: manager.manager ? manager.manager : 'No Manager',
            value: manager.manager_id,
        }));

        const { managerId } = await inquirer.prompt({
            name: 'managerId',
            type: 'list',
            message: 'Select a manager to view their employees:',
            choices: managerChoices,
        });

        // Fetch employees by selected manager
        const [rows] = await connection.query(
            'SELECT e.id, e.first_name, e.last_name, r.title AS job_title, d.name AS department, r.salary, CONCAT(m.first_name, " ", m.last_name) AS manager FROM employee e ' +
            'JOIN role r ON e.role_id = r.id ' +
            'JOIN department d ON r.department_id = d.id ' +
            'LEFT JOIN employee m ON e.manager_id = m.id ' +
            'WHERE e.manager_id = ?',
            [managerId]
        );

        // Display the employee data in a formatted table
        console.table(rows);
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        connection.release();
    }
}

// Add a function to view employees by department
async function viewEmployeesByDepartment() {
    try {
        // Prompt the user to select a department
        const departments = await connection.query('SELECT * FROM department');
        const departmentChoices = departments[0].map((department) => ({
            name: department.name,
            value: department.id,
        }));

        const { departmentId } = await inquirer.prompt({
            name: 'departmentId',
            type: 'list',
            message: 'Select a department to view its employees:',
            choices: departmentChoices,
        });

        // Fetch employees by selected department
        const [rows] = await connection.query(
            'SELECT e.id, e.first_name, e.last_name, r.title AS job_title, d.name AS department, r.salary, CONCAT(m.first_name, " ", m.last_name) AS manager FROM employee e ' +
            'JOIN role r ON e.role_id = r.id ' +
            'JOIN department d ON r.department_id = d.id ' +
            'LEFT JOIN employee m ON e.manager_id = m.id ' +
            'WHERE d.id = ?',
            [departmentId]
        );

        // Display the employee data in a formatted table
        console.table(rows);
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        connection.release();
    }
}

// Add a function to delete a department
async function deleteDepartment() {
    try {
        // Prompt the user to select a department to delete
        const departments = await connection.query('SELECT * FROM department');
        const departmentChoices = departments[0].map((department) => ({
            name: department.name,
            value: department.id,
        }));

        const { departmentId } = await inquirer.prompt({
            name: 'departmentId',
            type: 'list',
            message: 'Select a department to delete:',
            choices: departmentChoices,
        });

        // Delete the selected department from the database
        await connection.query('DELETE FROM department WHERE id = ?', [departmentId]);

        console.log('Department deleted successfully.');
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        connection.release();
    }
}

// ... Implement deleteRole and deleteEmployee functions similarly ...

// Add a function to calculate and display the total utilized budget of a department
async function viewDepartmentBudget() {
    try {
        // Prompt the user to select a department
        const departments = await connection.query('SELECT * FROM department');
        const departmentChoices = departments[0].map((department) => ({
            name: department.name,
            value: department.id,
        }));

        const { departmentId } = await inquirer.prompt({
            name: 'departmentId',
            type: 'list',
            message: 'Select a department to view its total utilized budget:',
            choices: departmentChoices,
        });

        // Fetch the total utilized budget by selected department
        const [result] = await connection.query('SELECT SUM(r.salary) AS total_budget FROM employee e JOIN role r ON e.role_id = r.id WHERE r.department_id = ?', [departmentId]);
        const { total_budget } = result[0];

        // Display the total utilized budget
        console.log(`Total utilized budget for the department: $${total_budget}`);
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        connection.release();
    }
}
//called in addContent function if selected dept
function addDepartment() {
    inquirer.prompt([
        {
            name: "addDept",
            message: "What is the name of the new department?"
        }
    ]).then(function (answer) {
        connection.query(
            "INSERT INTO department SET ?", {
            name: answer.addDept
        },
            function (err, res) {
                if (err) throw err;
                console.log(" Department Added!\n");
                startApp();
            }
        );
    });
}

//called in addContent function if selected role
function addRole() {
    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;
        //asking for the three properties on the roles table      
        inquirer.prompt([
            {
                name: "title",
                type: "input",
                message: "What is the title of the new role?"
            },
            {
                name: "salary",
                type: "number",
                message: "What is the salary of this position?",
            },
            {
                name: "deptId",
                type: "rawlist",
                message: "Select a department for this role",
                choices: res.map(item => item.name)
            }
        ]).then(function (answers) {
            const selectedDept = res.find(dept => dept.name === answers.deptId);
            connection.query("INSERT INTO role SET ?",
                {
                    title: answers.title,
                    salary: answers.salary,
                    department_id: selectedDept.id
                },
                function (err, res) {
                    if (err) throw err;
                    console.log("New role added!\n");
                    startApp();
                }
            );
        });
    })
};

function addEmployee() {
    connection.query("SELECT * FROM role", function (err, results) {
        if (err) throw err;
        inquirer.prompt([
            {
                name: "firstName",
                type: "input",
                message: "What is the new employee's first name?"
            },
            {
                name: "lastName",
                type: "input",
                message: "What is the new employee's last name?"
            },
            {
                name: "roleId",
                type: "rawlist",
                choices: results.map(item => item.title),
                message: "Select a role for the employee"
            }
        ]).then(function (answers) {
            const selectedRole = results.find(item => item.title === answers.roleId);
            connection.query("INSERT INTO employee SET ?",
                {
                    first_name: answers.firstName,
                    last_name: answers.lastName,
                    role_id: selectedRole.id
                }, function (err, res) {
                    if (err) throw err;
                    console.log("Added new employee named " + answers.firstName + " " + answers.lastName + "\n");
                    startApp();
                })
        })
    })
};
function selectEmployee() {
    connection.query("SELECT * FROM employees", function (err, res) {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "rawlist",
                name: "selectEmp",
                message: "Select the employee who is changing roles",
                choices: res.map(emp => emp.first_name)
            }
        ]).then(function (answer) {
            const selectedEmp = res.find(emp => emp.first_name === answer.selectEmp);
            connection.query("SELECT * FROM roles", function (err, res) {
                inquirer.prompt([
                    {
                        type: "rawlist",
                        name: "newRole",
                        message: "Select the new role for this employee",
                        choices: res.map(item => item.title)
                    }
                ]).then(function (answer) {
                    const selectedRole = res.find(role => role.title === answer.newRole);

                    connection.query("UPDATE employees SET role_id = ? WHERE id = ?", [selectedRole.id, selectedEmp.id],
                        function (error) {
                            if (error) throw err;
                            startApp();
                        }
                    );
                })
            })
        })
    })
};

function removeEmployee() {
    connection.query("SELECT * FROM employees", function (err, res) {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "rawlist",
                name: "removeEmp",
                message: "Select the employee who will be removed",
                choices: res.map(emp => emp.id && emp.first_name)
            }
        ]).then(function (answer) {
            const selectedEmp = res.find(emp => emp.id && emp.first_name === answer.removeEmp);
            connection.query("DELETE FROM employees WHERE ?",
                [{
                    id: selectedEmp.id
                }],
                function (err, res) {
                    if (err) throw err;
                    console.log("Employee Removed\n");
                    startApp();
                }
            );
        });
    })
};

function removeRole() {
    connection.query("SELECT * FROM roles", function (err, res) {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "rawlist",
                name: "removeRole",
                message: "Select the role that will be removed",
                choices: res.map(role => role.id && role.title)
            }
        ]).then(function (answer) {
            const selectedRole = res.find(role => role.id && role.title === answer.removeRole);
            connection.query("DELETE FROM roles WHERE ?",
                [{
                    id: selectedRole.id
                }],
                function (err, res) {
                    if (err) throw err;
                    console.log("Role Removed\n");
                    startApp();
                }
            );
        });
    })
};

function removeDepartment() {
    connection.query("SELECT * FROM departments", function (err, res) {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "rawlist",
                name: "removeDept",
                message: "Select the department that will be removed",
                choices: res.map(item => item.id && item.name)
            }
        ]).then(function (answer) {
            const selectedDept = res.find(item => item.id && item.name === answer.removeDept);
            connection.query("DELETE FROM roles WHERE ?",
                [{
                    id: selectedDept.id
                }],
                function (err, res) {
                    if (err) throw err;
                    console.log("Department Removed\n");
                    startApp();
                }
            );
        });
    })
};
function viewAllDepartments() {
    connection.query("SELECT * FROM department", (err, res) => {
        console.log(res)
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
};


startApp();
