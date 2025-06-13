const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LoginQueueSchema = new Schema({
  image: { type: String, required: true },
  status: { type: String, default: 'pending' }, // Trạng thái: pending, processing, success, failed
  createdAt: { type: Date, default: Date.now }
}, { versionKey: false });

const LoginQueue = mongoose.model('LoginQueue', LoginQueueSchema);

module.exports = LoginQueue;