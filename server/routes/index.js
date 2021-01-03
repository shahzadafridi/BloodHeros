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
            "status":404,
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
            "status":404,
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
            "status":404,
            "message":"user not found."
        }
        res.status(500).send(error);
    }
});

module.exports = router;
