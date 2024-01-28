
const mysql = require('mysql2/promise');
const fs = require('fs');

const sqlFile = fs.readFileSync('./db/schema.sql', 'utf8');
const seedFile = fs.readFileSync('./db/seed.sql', 'utf8');
const queryFile = fs.readFileSync('./db/query.sql', 'utf8');
const sqlStatements = sqlFile.split(';').map((statement) => statement.trim());

// Create a connection pool to the MySQL database
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'employee_db'
});

// Execute the SQL statements
async function executeSQLStatements() {
    try {
        for (const statement of sqlStatements) {
            await pool.query(statement);
            console.log('SQL statement executed successfully');
        }
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        pool.end();
    }
}

executeSQLStatements();