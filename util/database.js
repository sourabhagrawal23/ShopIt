// const mysql = require('mysql2');

// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     database: 'ShopIt',
//     password: 'Password'
// });

// module.exports = pool.promise();


const Sequelize = require('sequelize');

const sequelize = new Sequelize('ShopIt', 'root', 'Password', {dialect: 'mysql', host: 'localhost'});

module.exports = sequelize;