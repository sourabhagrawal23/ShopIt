const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'ShopIt',
    password: 'Password'
});

module.exports = pool.promise();
