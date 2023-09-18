const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const dmbVersionController = require('../controllers/dmbVersionController')

const createStoreIdConnection = catchAsync(async (req, res, next) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
  res.flushHeaders();
  const { store_id } = req.params;
  const { terminalTime } = req?.query

  if (!store_id) {
    res.write("data: " + "CLOSE" + "\n\n");
    // res.end();
  }

  if (req.query.syncToPwa) {
    emitSSE(res, req.outputData)
  } else {
    const currentVersion = setInterval(async function () {
      const result = await getCurrentVersion(res, { storeId: store_id, terminalTime: terminalTime })
    }, 1000 * 10)


    const upcomingSchedules = setInterval(async function () {
      const result = await getUpcomingSchedule(res, { storeId: store_id, terminalTime: terminalTime })
    }, 1000 * 20)
  }

  res.on("close", () => {
    console.log("connection closed");
    // res.end();
  });

})


const getDmbData = catchAsync(async (res, input) => {
  const result = await dmbVersionController
})

const getCurrentVersion = catchAsync(async (res, input) => {
  const data = await dmbVersionController.getCurrentDmbVersion(input)
  const dataObj = {
    event: "current-version-received",
    data: data,
    storeId: input.storeId
  }
  emitSSE(res, dataObj)
})

const getUpcomingSchedule = catchAsync(async (res, input) => {
  const result = await dmbVersionController.getUpcommingSchedule(input)
  const dataObj = {
    event: "upcomming-schedule-list-received",
    data: result,
    storeId: input.storeId
  }
  emitSSE(res, dataObj)
})


const emitSSE = (res, data) => {
  res.write("data: " + JSON.stringify(data) + "\n\n");
  // res.end()
};

module.exports = {
  createStoreIdConnection,
}