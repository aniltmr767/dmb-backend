const mongoose = require('mongoose');
const {app} = require('./server');
const config = require('./config/config');
// const logger = require('./config/logger');

let server;
mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  console.log('Connected to MongoDB');
//   server = app.listen(config.port, () => {
//     console.log(`Listening to port ${config.port}`);
//   });
}).catch(e=>{console.log('data base connectiity error:',e)});


mongoose.set('debug', true);

const exitHandler = () => {
  if (server) {
    server.close(() => {
      console.log('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  console.log(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  console.log('SIGTERM received');
  if (server) {
    server.close();
  }
});
