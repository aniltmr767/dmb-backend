const mongoose = require('mongoose');

const sseEventsSchema = mongoose.Schema(
  {
    lastEventId: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    }
  },
  {
    timestamps: true,
  }
);

const SseEvents = mongoose.model('SseEvents', sseEventsSchema);
module.exports = SseEvents;