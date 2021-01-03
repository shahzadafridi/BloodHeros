const mysql = require('mysql');

//CONNECTION POOL
const pool = mysql.createPool({
    connectTimeout: 10,
    host: 'localhost',
    user:'root',
    password: '',
    database: 'bloodheros'
 });

 /*
   MEHTOD: GET -> ALL USERS
*/

 let dataDB = {};

 dataDB.users = () =>{
     return new Promise((resolve, reject) => {
        pool.query('SELECT * from user', (err, results) => {
            if(err){
                return reject(err)
            }
            return resolve(results)
         });
     });
 };

 dataDB.findUserById = (id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * from user where id = ?', id, (err, results) => {
            if(err){
                return reject(err)
            }
            let result = {
                "status":"success",
                "data": results
            }
            return resolve(result)
         });
     });
 }

 dataDB.findUser = (column,value) => {
    return new Promise((resolve, reject) => {
        var searchQuery = `SELECT * from user where ${column} = '${value}'`;
        pool.query(searchQuery, (err, results) => {
            if(err){
                return reject(err)
            }
            let result = {
                "status":"success",
                "data": results
            }
            return resolve(result)
         });
     });
 }

 dataDB.addUser = (requestBody) => {
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO user SET ?', requestBody, (err, results) => {
            if(err){
                return reject(err)
            }
            let result = {
                "status":"success",
                "data": "user successfully added."
            }
            return resolve(result)
         });
     });
 }
 
 module.exports = dataDB;

