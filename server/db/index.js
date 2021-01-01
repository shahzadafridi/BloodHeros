const mysql = require('mysql');

//CONNECTION POOL
const pool = mysql.createPool({
    connectTimeout: 10,
    host: 'localhost',
    user:'root',
    password: '',
    database: 'tournament_app'
 });

 /*
   MEHTOD: GET -> ALL USERS
*/

 let dataDB = {};

 dataDB.users = () =>{
     return new Promise((resolve, reject) => {
        pool.query('SELECT * from users', (err, results) => {
            if(err){
                return reject(err)
            }
            return resolve(results)
         });
     });
 };
 
 module.exports = dataDB;

