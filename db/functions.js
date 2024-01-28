// Add a function to update an employee's manager
async function updateEmployeeManager(connection) {
    try {
        // Prompt the user to select an employee to update
        const employees = await connection.query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee');
        const employeeChoices = employees[0].map((employee) => ({
            name: employee.name,
            value: employee.id,
        }));

        const { employeeId } = await inquirer.prompt({
            name: 'employeeId',
            type: 'list',
            message: 'Select an employee to update their manager:',
            choices: employeeChoices,
        });

        // Prompt the user to select a manager for the employee
        const managers = await connection.query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee');
        const managerChoices = managers[0].map((manager) => ({
            name: manager.name,
            value: manager.id,
        }));

        const { managerId } = await inquirer.prompt({
            name: 'managerId',
            type: 'list',
            message: 'Select a new manager for the employee:',
            choices: managerChoices,
        });

        // Update the employee's manager in the database
        await connection.query('UPDATE employee SET manager_id = ? WHERE id = ?', [managerId, employeeId]);

        console.log('Employee manager updated successfully.');
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        connection.release();
    }
}

// Add a function to view employees by manager
async function viewEmployeesByManager(connection) {
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
async function viewEmployeesByDepartment(connection) {
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
async function deleteDepartment(connection) {
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
async function viewDepartmentBudget(connection) {
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

module.exports = {
    updateEmployeeManager,
    viewEmployeesByManager,
    viewEmployeesByDepartment,
    deleteDepartment,
    viewDepartmentBudget,

};