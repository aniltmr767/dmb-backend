const express = require('express');
const DmbVersionController = require('../../controllers/dmbVersionController');  
const router = express.Router();
 
router.post( '/' , DmbVersionController.createVersion);
 

module.exports = router;