const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  microsoftId: { type: String},
  displayName: { type: String},
  email: { type: String, required: true, unique: true },
  accessToken: { type: String },
  lastLogin: { type: Date, default: null },
  role: { type: Schema.Types.ObjectId, ref: 'Role', default: null },
  status: { type: Number, default: 0 },
  phone: { type: String, default: null },
  personalEmail: { type: String, default: null },
  fullName: { type: String, default: null },
  typeLecturer: { type: String, default: null },
  userCode: { type: String, default: null }
});

const User = mongoose.model('User', UserSchema);
module.exports = User;