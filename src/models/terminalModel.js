const mongoose = require('mongoose');

const terminalSchema = mongoose.Schema(
  {
    terminalId: {
      type: String,
      unique: true,
      dropDups: true ,   
      required: true,
      trim: true,
    },    
    storeId: {
      type: String,   
      required: true,
      trim: true,
    },  
    brand: {
      type: String,   
      required: true,
      trim: true,
    },
    countryId: {
      type: String,     
      required: true,
      trim: true,
    },  
    macAddress: {
      type: String,
      required: true,
      trim: true,
    },
    cityId: {
      type: String,     
      required: true,
      trim: true,
    }, 
    manager: {
      type: String,     
      required: true,
      trim: true,
    }, 
    fcmToken: {
      type: String,
      required: false,
      trim: true,
    },
    syncToCms: {
      type: String,
      enum: ['0','1'],
      default: '0',
    },    
    currentVersionId: {
      type: String,
      required: false,
      trim: true,
    },   
    currentVersionPublishedOn: {
      type: Date,
      required: false,
      trim: true,
    }    ,
    terminalStatus: {
      type: String,
      enum: ['0','1'],
      default: '1',
    },
  },
  {
    timestamps: true,
  }
);


/**
 * @typedef Terminal
 */
const Terminal = mongoose.model('Terminal', terminalSchema);

module.exports = Terminal;


// {
//   "terminalId": "text",
//   "macAdress": "text",
//   "fcmToken": "text",
//   "terminalStatus": "text",
//   "publishedVersion": "text",
//   "publishedOn": "text",
//   "lastVerifiedOn": "text",
// brandKey:'KFC'
// }

