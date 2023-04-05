const mongoose = require('mongoose');

const dmbVersionSchema = mongoose.Schema(
  {
    versionId: {
      type: String,
      unique: true,
      dropDups: true ,
      required: true,
      trim: true,
    }, 
    storeId: {
        type: String,        
        required: false,
        trim: true,
      },
      scheduledOn: {
        type: Date,
        required: true,
        trim: true,
      }, 
      scheduledDate: {
        type: Number,
        required: true,
        trim: true,
      }, 
     hours: {
        type: Number,        
        required: true,
        trim: true,
      },
      minutes: {
        type: Number,        
        required: true,
        trim: true,
      },
      timeInMinutes: {
        type: Number,        
        required: true,
        trim: true,
      },
      terminalData:{
        type: Object,
        required: true,
     },   
     jobStatus: {
        type: String,
        enum: ['Pending','Notified','Downloaded','Published'],
        default: 'Pending',
      },
      recordStatus: {
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
 * @typedef DmbVersion
 */
const DmbVersion = mongoose.model('DmbVersion', dmbVersionSchema);

module.exports = DmbVersion;



 