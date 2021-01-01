const express = require('express');
const db = require('../db');
const router = express.Router();

router.use(express.json());

router.get('/', async(req,res,next) => {
    try{
        let results = await db.users();
        res.send(results);
    }catch(e){
        res.status(500).send("Something wrong in the server");
    }
});

module.exports = router;
