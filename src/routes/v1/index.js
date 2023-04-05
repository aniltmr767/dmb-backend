const express = require('express');
const terminalRoute = require('./TerminalRoute');
const dmbVersionRoute = require('./dmbVersionRoute');
const seedRoute = require('./seedingRoutes');
 

const router = express.Router();

const defaultRoutes = [
  // {
  //   path: '/auth',
  //   route: authRoute,
  // },
  // {
  //   path: '/socket',
  //   route: socketRoute,
  // },
  {
    path: '/dmb',
    route: dmbVersionRoute,
  },
  {
    path: '/terminal',
    route: terminalRoute,
  },
  {
    path: '/seed',
    route: seedRoute,
  },
];

// const devRoutes = [
//   // routes available only in development mode
//   {
//     path: '/docs',
//     route: docsRoute,
//   },
// ];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
// if (config.env === 'development') {
//   devRoutes.forEach((route) => {
//     router.use(route.path, route.route);
//   });
// }
 
module.exports = router;
