const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'hospital_finder',
    port: '3000'
});

db.connect(err=>{
    if(!err){
        console.log('Database is Connected');
    }
    else{
        console.log('Database is not connected');
    }
});
module.exports = db;