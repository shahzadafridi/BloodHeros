const Joi = require('joi'); // validation fileds npm package. npm i joi
const express = require('express');
const db = require('../db');
const router = express.Router();

router.use(express.json());

/*
   MEHTOD: GET -> ALL USERS
*/
router.get('/', async(req,res,next) => {
    try{
        let results = await db.users();
        res.send(results);
    }catch(e){
        let error = {
            "status":"failed",
            "message":"users not found."
        }
        res.status(500).send(error);
    }
});

/*
   MEHTOD: GET -> USER by ID
*/
router.get('/:id', async(req,res,next) => {
    try{
        let results = await db.findUserById(req.params.id);
        res.send(results);
    }catch(e){
        let error = {
            "status":"failed",
            "message":"user not found."
        }
        res.status(500).send(error);
    }
});

/*
   MEHTOD: GET -> GENERIC SEARCH for USER
*/
router.post('/search', async(req,res,next) => {
    try{
        let results = await db.findUser(req.body.column,req.body.value);
        res.send(results);
    }catch(e){
        let error = {
            "status":"failed",
            "message":"user not found."
        }
        res.status(500).send(error);
    }
});

/*
   MEHTOD: GET -> GENERIC SEARCH for USER
*/
router.post('/add', async(req,res,next) => {
    try{
        const {error} = validateFields(req.body);
        if(error){
            var errorJson = {
                "status":"failed",
                "message":error.details[0].message
            }
            res.status(400).send(errorJson);
            return;
        }else{
            let results = await db.addUser(req.body);
            res.send(results);
        }
    }catch(e){
        let error = {
            "status":"failed",
            "message":"user not added."
        }
        res.status(500).send(error);
    }
});

/*
   MEHTOD: validateName -> VALIDATION FIELDS
*/
function validateFields(requestBody) {
    console.log(requestBody);
    const schema = Joi.object({
        name: Joi.string()
            .min(3)
            .max(30)
            .required(),
                
        birth_year: Joi.number()
            .integer()
            .min(1900)
            .max(2013),

        phone: Joi.string()
            .min(5),
    
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    });

     return schema.validate({ 
        name: requestBody.name, 
        email: requestBody.email,
        phone: requestBody.phone});
 }
 

module.exports = router;
