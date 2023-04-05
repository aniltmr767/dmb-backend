const mongoose = require('mongoose');
 
const configSchema = mongoose.Schema(
   {     
    prefix: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    counter: {
      type: Number,
      required: true,
      trim: true,
    }     
  },
  {
    timestamps: true,
  }
);

const Config = mongoose.model('Config', configSchema);
module.exports = Config;