const httpStatus = require('http-status');
const { Terminal, Config } = require('../models');
// const pick = require('../utils/pick');
// const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const axios = require("axios");
const { cmsEndPoint } = require('../config/constants')
var fetch = require("node-fetch")
let options = { json: true };

const createTerminal = catchAsync(async (req, res) => {
  console.log('== Inside createTerminal ==')
  const InputParams = req.params
  const inputBody = req.body
  const dataExist = await Terminal.findOne({ macAddress: inputBody.macAddress });
  console.log(dataExist)

  if (dataExist) {
    res.status(httpStatus.OK).send(dataExist);
  } else {
    console.log('req params', req.params)
    console.log('req body', JSON.stringify(inputBody))

    let storeUrl = process.env.FETCH_STORE_URL

    const storeParams = {
      'addressSubType': 'DELIVERY',
      'lat': '24.4638305',
      'lng': '54.67403110000001',
      'screen': 'LOCATION',
      'areaId': 161,
      'storeId': 3844
    }

    const headers = {
      'brand': 'KFC',
      'appversion': '7.16.1',
      'devicetype': 'IOS',
      'deviceid': '6DF53C3C-DC8F-4CFA-B13A-EC8908243859',
      'language': 'En',
      'timezone': 'Asia/Kolkata',
      'devicemodel': 'DMB',
      'country': 'UAE',
      'osversion': '15.7.3',
    }

    if (inputBody.isLocation) {
      storeParams.addressSubType = 'DELIVERY'
    } else {
      storeParams.addressSubType = 'DINEIN'
    }

    if (inputBody.areaId) {
      storeParams.areaId = inputBody.areaId
    }

    if (inputBody.storeId) {
      storeParams.storeId = inputBody.storeId
    }

    if (inputBody.lat) {
      storeParams.lat = inputBody.lat
    }
    if (inputBody.lng) {
      storeParams.lng = inputBody.lng
    }


    if (InputParams.country) {
      headers.country = InputParams.country
    }

    if (InputParams.brand) {
      headers.brand = InputParams.brand
    }

    if (inputBody.timezone) {
      headers.timezone = inputBody.timezone
    }

    switch (InputParams.brand) {
      case 'KFC':
        storeUrl = process.env.FETCH_KFC_STORE_URL
        break;
      case 'HRD':
        storeUrl = process.env.FETCH_HRD_STORE_URL
        break;
      default:
        break;
    }
    const paramString = `?addressSubType=${storeParams.addressSubType}&lat=${storeParams.lat}&lng=${storeParams.lng}&screen=${storeParams.screen}&areaId=${storeParams.areaId}&storeId=${storeParams.storeId}`

    console.log('store url:', storeUrl + paramString)
    console.log('headers:', headers)
    const storeResult = await axios.get(storeUrl + paramString, { headers: headers })


    console.log('fetching store data :', storeResult.status)
    if (storeResult.status === 200) {
      const { countryId, cityId, storeId, name_en } = storeResult.data.data.store
      console.log('storeDetails:', storeResult.data.data.store)


      const id = await generateTerminalId();
      console.log('id:', id)
      inputBody.terminalId = id

      inputBody.brand = InputParams.brand
      inputBody.manager = InputParams.manager
      inputBody.countryId = countryId
      inputBody.cityId = cityId
      inputBody.storeId = storeId
      inputBody.storeName = name_en
      const terminalResult = await Terminal.create(inputBody);

      console.log('terminalResult:', terminalResult)

      const url = process.env.CMS_URL + cmsEndPoint.syncTerminal
      let cmsResult
      console.log('url:', url)

      try {
        const cmsTerminalData = {
          data: {
            storeId: terminalResult.storeId,
            countryId: terminalResult.countryId,
            cityId: terminalResult.cityId,
            brand: terminalResult.brand,
            terminalId: terminalResult.terminalId,
            macAddress: terminalResult.macAddress,
            fcmToken: 'text',
            manager: terminalResult.manager,
            storeName: terminalResult.storeName,
          }
        }
        console.log('cmsTerminalData:', cmsTerminalData)
        // cmsResult=await axios.post(url, cmsTerminalData, {})
      } catch (e) {
        console.log('terminal sync errr  :', e)

      }

      if (cmsResult.data.success) {
        const updateResult = await Terminal.updateOne({ terminalId: id }, { syncToCms: '1' }, {})
        console.log('updateResult:', updateResult)
      }

      res.status(httpStatus.CREATED).send(terminalResult);
    } else {
      res.status(httpStatus.UNPROCESSABLE_ENTITY).send({ success: false, message: "Please send valida parameters" });
    }
  }
});

const getTerminals = catchAsync(async (req, res) => {
  console.log('== Inside getTerminals ==', req.body)
  const result = await Terminal.find();

  res.status(httpStatus.OK).send(result);
});


const updateTerminal = catchAsync(async (req, res) => {

  const terminalId = req.body.terminalId

  if (terminalId) {
    const result = await Terminal.find({ terminalId });
    console.log('result:', result)

    const updateResult = await Terminal.updateOne({ terminalId }, { ...req.body })
    console.log('updateResult:', updateResult)
    res.status(httpStatus.OK).send(updateResult);

  } else {
    res.status(httpStatus.UNPROCESSABLE_ENTITY).send({ message: "terminalId not found" });

  }
});

const generateTerminalId = async function () {
  const result = await Config.findOne();
  let terminalId
  if (result) {
    const incrementCounter = result.counter + 1
    terminalId = result.prefix + '-' + incrementCounter
    await Config.updateOne({ _id: result._id }, { counter: incrementCounter })
  }
  console.log('generated terminalId:', terminalId)
  return terminalId
};



// const updateCurentVersion = catchAsync(async (data) => {

// const terminalId=data.terminalId

//  const terminalResult=await Terminal.find({terminalId:terminalId});

//  if(terminalResult){
//   const publishedMenuId=data.curentVersion

//   const updateResult= await Terminal.updateOne({terminalId},{publishedMenuId})
//   return updateResult
//  }
// return false
// });



const updateCurrentDisplayingVersion = (async (input) => {
  try {
    console.log('updateCurrentDisplayingVersion: ', input)

    const currentVersionId = input.versionId

    const updateResult = await Terminal.updateOne({ terminalId: input.terminalId }, {
      currentVersionId: currentVersionId,
      currentVersionPublishedOn: new Date()
    })
    console.log('updateResult:', updateResult)


    return updateResult;

  } catch (error) {
    console.log('error:', error)
  }
});

const getPickupStore = catchAsync(async (req, res) => {
  console.log('== req.params ==', req.params)
  let baseUrl, key;
  switch (req.params.brand) {
    case 'KFC':
      console.log('------------KFC')
      baseUrl = process.env.KFC_CDN_BASE_URL
      key = process.env.KFC_CDN_KEY
      break;
    case 'HRD':
      console.log('------------HRD')
      baseUrl = process.env.HRD_CDN_BASE_URL
      key = process.env.HRD_CDN_KEY
      break;
    default:
      break;
  }
  let url = `${baseUrl}pickup_${req.params.country.toLowerCase()}.json${key}`
  console.log(url)
  try {
    let response = await axios.get(url).then(res => res.data)
    if (response && response.length > 0) {
      res.status(httpStatus.OK).send({ 'message': 'success', 'data': response });
    } else {
      res.status(httpStatus.OK).send({ 'message': 'error', 'data': 'Data not found' });
    }
  } catch (err) {
    res.status(httpStatus.OK).send({ 'message': 'error', 'data': 'Pickup Json not found' });
  }
});

const convertUrlToBlob = catchAsync(async (req, res, next) => {
  const { url } = req.body;
  console.log("------", req)
  try {
    if (url) {
      const data = await fetch(url);
      const buffer = await data.buffer();
      const contentType = await data.headers.get("Content-Type")
      const base64 = await buffer.toString('base64');
      res.status(httpStatus.OK).send({ 'message': 'success', 'data': "data:" + contentType + ';base64,' + base64 });
    } else {
      res.status(httpStatus.OK).send({ 'message': 'error', 'data': "parameter missing." });
    }

  } catch (error) {
    console.log("error ", error)
    res.status(httpStatus.OK).send({ 'message': 'error', 'data': 'Error' });
  }
})

// function blobToBase64(blob) {
//   return new Promise((resolve, _) => {
//     const reader = new FileReader();
//     reader.onloadend = () => resolve(reader.result);
//     reader.readAsDataURL(blob);
//   });
// }

module.exports = {
  createTerminal,
  getTerminals,
  updateTerminal,
  updateCurrentDisplayingVersion,
  getPickupStore,
  convertUrlToBlob
};



