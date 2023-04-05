const express = require('express');
const seeds = require('../../config/seeding'); 
const router = express.Router();

router.get( '/config' , seeds.insertDefaultConfigsData); 

module.exports = router;