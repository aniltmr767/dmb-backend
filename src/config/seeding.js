const defaultConfigsData=[
    {             
      prefix: 'TERMINAL',
      counter: 1000       
    }    
  ]
 

const httpStatus = require('http-status');
const { Config,Menu } = require('../models'); 
const catchAsync = require('../utils/catchAsync'); 

const insertDefaultConfigsData = catchAsync(async (req, res) => {   
    // console.log('insertData:',insertData)

    let result=await Config.findOne();
 
    console.log('result:',result)
   if(!result) {
       
    result=await Config.insertMany(defaultConfigsData);  
         
    }
    
    res.status(httpStatus.CREATED).send(result);
  }); 

  module.exports = {
    insertDefaultConfigsData 
  };

