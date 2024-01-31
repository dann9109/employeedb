# Employee Tracker


## Table of Contents

Description
Walkthrough Video
Installation
Usage
Technologies Used
Roadmap

## Description

This command-line application allows you to manage a company's employee database. You can view and manipulate departments, roles, and employees. It's built using Node.js, Inquirer, and MySQL.

## Walkthrough Video

[Video Link](https://drive.google.com/file/d/1Tfmfd_K4hnltRN6PqS7m_GVBVKgZn1nx/view)

## Installation

To install the application, follow these steps:

Clone the repository to your local machine.
Navigate to the project directory in the command line.
Run npm install to install the required dependencies.
Set up your MySQL database and update the connection details in the connection.js file.
Run npm start to start the application.

## Usage 

Once the application is running, you will be presented with a menu of options. Use the arrow keys to navigate through the menu and press Enter to select an option. Here are the available options:

View all departments: Displays a table with department names and IDs.
View all roles: Displays a table with job titles, role IDs, departments, and salaries.
View all employees: Displays a table with employee data including IDs, names, job titles, departments, salaries, and managers.
Add a department: Allows you to add a new department to the database.
Add a role: Allows you to add a new role to the database.
Add an employee: Allows you to add a new employee to the database.
Update an employee role: Allows you to update the role of an existing employee.
Exit: Exits the application.

## Technologies Used

Node.js
Inquirer
MySQL

## Roadmap

As a future enhancement, we plan to add more functionality such as:

Deleting departments, roles, and employees.
Viewing employees by manager or department.
Calculating and displaying the total utilized budget of a department.

