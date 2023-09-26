const express = require('express');
const ServerSentEventsController = require('../../controllers/serverSentEventsController');
const router = express.Router();

router.get('/', ServerSentEventsController.customSSE);


module.exports = router;