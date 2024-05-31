const { createPool } = require("mysql");

const pool = createPool({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  connectionLimit: 10
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to the database: ', err);
    return;
  }

  console.log('Successfully connected to the database!');

  // You can release the connection back to the pool after you're done with it
  connection.release();
});

module.exports = pool;