const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();
const util = require('util');

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306
});

db.connect(function(err){
    if(err) throw err;
});

if(db) {
    console.log("Database connected");
}else{
    console.log("Database not connected");
}
// console.log("ENV USER:", process.env.DB_USER);
// console.log("ENV DB:", process.env.DB_NAME);
db.query = util.promisify(db.query);

module.exports = db;