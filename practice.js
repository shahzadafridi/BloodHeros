const Joi = require('joi'); // validation fileds npm package. npm i joi
const mysql = require("mysql");

const courses = [
   {id: 1, name: 'course1', cost: '100$'},
   {id: 2, name: 'course2', cost: '150$'},
   {id: 3, name: 'course3', cost: '111$'},
   {id: 4, name: 'course4', cost: '125$'},
   {id: 5, name: 'course5', cost: '140$'},
]


/*
   MEHTOD: GET -> ALL COURSES
*/
app.get('/api/courses', (req, res) => {
   res.send(JSON.stringify(courses));
});

/*
   MEHTOD: POST -> ADD COURSE
*/
app.post('/api/course/add', (req, res) => {

   const {error} = validateName(req.body.name);

   if(error){
      var errorJson = {
         "status":400,
         "message":error.details[0].message
      }
      res.status(400).send(errorJson);
      return;
   }

   const course = {
      id: courses.length + 1,
      name: req.body.name,
      cost: req.body.cost
   };

   courses.push(course);

   var resultJson = {
      "status":200,
      "data": courses
   }
   res.status(200).send(resultJson);

});

/*
   MEHTOD: GET -> FIND COURSE
*/
app.get('/api/courses/:id', (req, res) => {
   var course = courses.find(course => course.id === parseInt(req.params.id))
   if(!course){
      var errorJson = {
         "status":400,
         "message": "The course with give ID was not found"
      }
      res.status(400).send(errorJson);
   }else{
      var resultJson = {
         "status":200,
         "data": course
      }
      res.status(200).send(resultJson);
   }
});


/*
   MEHTOD: validateName -> VALIDATION FIELDS
*/

function validateName(courseName) {
   const schema = Joi.object({
      name: Joi.string()
          .min(3)
          .required(),
   });
    return schema.validate({ name: courseName});
}

//MYSQL

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
app.get('/api/users', (req, res) => {
   pool.getConnection((err,connection) => {
      if(err) throw err
      console.log('connection id as '+connection.threadId);
      connection.query('SELECT * from users', (err, results) => {
         connection.release();
         if(err) throw err;
         res.send(results)
      })      
   })
});