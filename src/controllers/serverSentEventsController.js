const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const dmbVersionController = require('../controllers/dmbVersionController');
const { SseEvents } = require('../models');



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
  }

  if (req.query.syncToPwa) {
    emitSSE(res, req.outputData)
  } else {
    const currentVersion = setInterval(async function () {
      let time = parseInt(terminalTime);
      time += 20000;
      const result = await getCurrentVersion(res, { storeId: store_id, terminalTime: time })
    }, 2000 * 10)


    const upcomingSchedules = setInterval(async function () {
      let time = parseInt(terminalTime);
      time += 40000;
      const result = await getUpcomingSchedule(res, { storeId: store_id, terminalTime: time })
    }, 4000 * 10)

    res.on("close", () => {
      console.log("connection closed");
      res.end();
      clearInterval(currentVersion)
      clearInterval(upcomingSchedules)
    });
  }

  res.on("close", () => {
    console.log("connection closed");
    res.end();
  });

})


const customSSE =  (req, res, next) => {
  const { lastEventId } = req?.query
  const headers = {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache",
    "X-Accel-Buffering": "no"
  };


  res.writeHead(200, headers);
  res.flushHeaders();

  console.log("----------------------- last event id ----------------------")
  console.log(req.headers["last-event-id"])
  const lastEventIdHeader = req.headers["last-event-id"];
   if (lastEventIdHeader) {
    setTimeout(async () => {
      const result_ = await SseEvents.find({
        lastEventId: { $gt: req.headers["last-event-id"], $lt: Date.now() },
      })

      const deleteResult = await SseEvents.deleteMany({
        lastEventId: { $lt: req.headers["last-event-id"] },
      })

      if (result_) {
        const lostResult = {
          type: "lost",
          data: result_
        }
        res.write("data: " + JSON.stringify(lostResult) + "\n\n");
      }
    }, 1000 * 20)

  }

  const interval = setInterval(async () => {
    const data = Math.floor(100000 + Math.random() * 900000)
    const id = Date.now();
    res.write('id: ' + id + '\n');
    res.write("data: " + JSON.stringify(data) + "\n\n");
    const body = {
      lastEventId: id,
      message: data
    }
    if(lastEventIdHeader){
      const sseResult = await SseEvents.create(body);
    }
    
  }, 1000 * 15)

  res.on("close", () => {
    clearInterval(interval);
    console.log("connection closed ", req?.headers);
    res.end();
  })
}

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
  console.log("-----------------------emit SSE----------------------------------")
  const id = (new Date()).toLocaleTimeString();
  res.write('id: ' + id + '\n');
  res.write("data: " + JSON.stringify(data) + "\n\n");
  // res.end();
};

module.exports = {
  createStoreIdConnection,
  customSSE
}
