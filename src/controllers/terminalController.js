const httpStatus = require('http-status');
const { Terminal,Config } = require('../models');
// const pick = require('../utils/pick');
// const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const axios = require("axios");
const { cmsEndPoint}=require('../config/constants')

const createTerminal = catchAsync(async (req, res) => {
  console.log('== Inside createTerminal ==') 
  const inputBody=req.body
  const id=await generateTerminalId();
  console.log('id:',id)
  inputBody.terminalId=id
   const terminalResult=await Terminal.create(inputBody);

   console.log('terminalResult:',terminalResult)

  //  const options = { headers: { Authorization: process.env.TOKEN } }
  //  const result = await axios.post(url, {action:action,channelId:channel_id,contentOwnerId:content_owner_id,data:epgDataToSend,jobId:jobId}, options)
  const url=process.env.CMS_URL+cmsEndPoint.syncTerminal
  console.log('url:',url)
  const cmsResult=await axios.post(url, terminalResult, {})
  console.log('cmsResult:',cmsResult.status)
  if(cmsResult.status===200){
    const updateResult= await Terminal.updateOne({terminalId:id},{syncToCms:'1' },{})
    console.log('updateResult:',updateResult)
  }

  res.status(httpStatus.CREATED).send(terminalResult);
});

const getTerminals = catchAsync(async (req, res) => {
  console.log('== Inside getTerminals ==',req.body)  
  const result=await Terminal.find();  

  res.status(httpStatus.OK).send(result);   
 });


 const updateTerminal = catchAsync(async (req, res) => { 
 
 const terminalId=req.body.terminalId

  if(terminalId){
    const result=await Terminal.find({terminalId});
    console.log('result:',result)

    const updateResult= await Terminal.updateOne({terminalId},{...req.body})
    console.log('updateResult:',updateResult)
    res.status(httpStatus.OK).send(updateResult);

  }else{
    res.status(httpStatus.UNPROCESSABLE_ENTITY).send({message:"terminalId not found"});

  }
});

const generateTerminalId = async function () { 
  const result=await Config.findOne(); 
  let terminalId
  if(result){
      const incrementCounter=result.counter+1
      terminalId = result.prefix+'-'+incrementCounter
    await Config.updateOne({_id:result._id},{counter:incrementCounter})     
  }
  console.log('generated terminalId:',terminalId)
 return  terminalId
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



const updateCurrentDisplayingVersion= (async (input) => {
  try{
      console.log('updateCurrentDisplayingVersion: ',input)

     const currentVersionId=input.versionId
      
      const updateResult= await Terminal.updateOne({terminalId:input.terminalId},{currentVersionId:currentVersionId,
        currentVersionPublishedOn:new Date()})
        console.log('updateResult:',updateResult)  
      
      
      return updateResult;
      
  }catch(error){
      console.log('error:',error)
  }     
 });

module.exports = {
  createTerminal,
  getTerminals,
  updateTerminal,
  
  updateCurrentDisplayingVersion
};


 
 