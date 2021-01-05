require('dotenv').config();
const Joi = require('joi'); // validation fileds npm package. npm i joi
const express = require('express');
const db = require('../db');
const jwt = require('jsonwebtoken');
const { ref } = require('joi');
const router = express.Router();

router.use(express.json());
let refreshTokens = [];

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
   authenticateToken (midleware to check token)
*/
router.get('/:id',authenticateToken, async(req,res,next) => {
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
   MEHTOD: POST -> USER LOGIN
*/
router.post('/login', async(req,res,next) => {

    var user = {
        email: req.body.email
    };

    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(user,process.env.REFRESH_TOKEN_SCRETE);
    refreshTokens.push(refreshToken);
    res.json({ 
        accessToken: accessToken,
        refreshToken: refreshToken
    });

});

/*
   MEHTOD: POST -> TOKEN
*/
router.post('/token', async(req,res,next) => {

    const refreshToken = req.body.token

    if(refreshToken == null){
        res.status(401).json({
            "status": "failed",
            "message": "Token can't be null."
        });
    }

    if(!refreshTokens.includes(refreshToken)){
        res.status(403).json({
            "status": "failed",
            "message": "Invalid token."
        });
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SCRETE, (error, user) => {

        if(error){
            res.status(403).json({
                "status": "failed",
                "message": "Invalid or expired token."
            });
        }

        const accessToken = generateAccessToken({email: user.email});

        res.json({ 
            accessToken: accessToken
        })
    })
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
 

/*
   MEHTOD: MIDDLEWARES - AUTHENTICATE USER
*/ 
function authenticateToken(req,res,next){
    
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if(token == null){
        res.status(401).json({
            "status": "failed",
            "message": "Token can't be null."
        });
    }

    jwt.verify(token,process.env.ACCESS_TOKEN_SCRETE, (error,user) => {
        
        if(error){
            res.status(403).json({
                "status": "failed",
                "message": "Invalid or expired token."
            });
        }

        req.user = user
        next()
    })
}

/*
   MEHTOD: GENERATE ACCESS TOKEN
*/ 
function generateAccessToken(user){
    return jwt.sign(user,process.env.ACCESS_TOKEN_SCRETE, {expiresIn: '60s'});
}

module.exports = router;
