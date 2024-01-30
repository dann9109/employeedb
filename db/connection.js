const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'employee_db',
    // connectionLimit: 10,
    // multipleStatements: true
});

connection.connect(function (err) {
    if (err) throw err
    console.log('Connected to the employee database.');
});


module.exports = connection;