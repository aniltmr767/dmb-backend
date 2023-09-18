require('dotenv').config()
const express = require('express');
const app = express();
const http = require('http').Server(app);
// const io = require('socket.io')(http);
const io = require('socket.io')(http, { cors: { origin: '*', } });
const socketNamespace = io.of('/socket')
const PORT = process.env.PORT || 3000;
const httpStatus = require('http-status');

const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const cors = require('cors');
const routes = require('./routes/v1');
const SSEController = require('./controllers/serverSentEventsController')

// const routes = require('./routes/v1');
const { errorConverter, errorHandler } = require('./middlewares/error');
const { socketHandler } = require('./sockets');
// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());


// enable cors
app.use(cors());
app.options('*', cors());


// v1 api routes
app.use('/v1', routes, (req, res, next) => {
  console.log('req:----------', req.query)

  if (req.query.syncToPwa) {
    const storeId = req.outputData.storeId
    console.log('storeId:-------------', storeId)
    // SSEController.createStoreIdConnection(req, res, next)
    // socketNamespace.to(storeId).emit('dmb-version-added', req.outputData);
    res.status(httpStatus.OK).send(req.outputData)
  }
  next()
});



http.listen(PORT, () => {
  console.log(`DMB server running at http://localhost:${PORT}/`);
});



socketNamespace.on('connection', (client) => {

  console.log('connected', client.id)
  socketHandler(client)
})



module.exports = { app, io };
