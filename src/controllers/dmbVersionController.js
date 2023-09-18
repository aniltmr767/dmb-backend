const httpStatus = require('http-status');
const { DmbVersion } = require('../models');

const catchAsync = require('../utils/catchAsync');

const { convertToUTC } = require('../utils/commonFunctions');


const createVersion = catchAsync(async (req, res, next) => {

  const inputBody = req.body
  console.log('inside scheduling :', inputBody.scheduledOn)

  const dateResult = convertToUTC(inputBody.scheduledOn);
  const insertData = {
    ...inputBody,
    scheduledOn: dateResult.utcTimeStamp,
    scheduledDate: dateResult.utcDateInNumbers,
    hours: dateResult.hours,
    minutes: dateResult.minutes,
    timeInMinutes: dateResult.timeInMinutes
  }

  const versionResult = await DmbVersion.findOne({
    storeId: inputBody.storeId,
    versionId: inputBody.versionId
  });

  if (versionResult) {
    console.log('version alreday exist')
    res.status(httpStatus.UNPROCESSABLE_ENTITY).send({ success: false, message: "Please send a unique version id" });

  } else {
    const result = await DmbVersion.create(insertData);
    res.status(httpStatus.CREATED)

    req.query.syncToPwa = true
    req.outputData = result

  }
  next()

});


const getCurrentDmbVersion = (async (input) => {
  try {
    console.log('getCurrentDmbVersion: ', input)

    const dateResult = convertToUTC(input.terminalTime);
    console.log('dateResult', dateResult)
    // const result1 = await DmbVersion.aggregate([
    //   {
    //     $group: { "_id": "$storeId" }
    //   }
    // ])
    // return result1
    const result = await DmbVersion.findOne({
      // timeInMinutes:{$lte:dateResult.timeInMinutes},
      storeId: input.storeId
    }, [], {
      sort: {
        scheduledOn: -1 //Sort by scheduledTime  DESC
      }
    });
    console.log("afasfasf -----result", result)
    return result;

  } catch (error) {
    console.log('error:', error)
  }
});


const getUpcommingSchedule = (async (input) => {
  try {
    console.log('getUpcommingSchedule:---- ', input)

    const dateResult = convertToUTC(input.terminalTime);
    console.log('dateResult----', dateResult)

    const result = await DmbVersion.find({
      scheduledOn: { $gte: dateResult.utcTimeStamp },
      // timeInMinutes:{$gte:dateResult.timeInMinutes},
      storeId: input.storeId
    }, ['scheduledOn', 'versionId', 'storeId'], {
      sort: {
        scheduledOn: 1 //Sort by scheduledTime  ASC
      }
    });
    return result;

  } catch (error) {
    console.log('error:', error)
  }
});

const getScheduleByVersionId = (async (input) => {
  try {
    console.log('getScheduleByVersionId: ', input)

    const result = await DmbVersion.findOne({
      versionId: input.versionId,
      storeId: input.storeId
    });

    return result;

  } catch (error) {
    console.log('error:', error)
  }
});

module.exports = {
  createVersion,
  getCurrentDmbVersion,
  getUpcommingSchedule,
  getScheduleByVersionId
};



