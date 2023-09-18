const express = require('express');
const ServerSentEventsController = require('../../controllers/serverSentEventsController');
const router = express.Router();

router.get('/:store_id', ServerSentEventsController.createStoreIdConnection);


module.exports = router;