const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MajorSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  majorName: { type: String, required: true, unique: true },
  subMajorName: { type: String },
  status: { type: Number, default: 0 },
  majorCode: { type: String, required: true, unique: true }, // Thêm mã ngành
}, { versionKey: false });

MajorSchema.index({ majorCode: 1 }, { unique: true }); // Đảm bảo tạo chỉ mục duy nhất cho majorCode
MajorSchema.index({ majorName: 1 }, { unique: true }); // Đảm bảo tạo chỉ mục duy nhất cho majorName

const Major = mongoose.model('Major', MajorSchema);
Major.createIndexes(); // Tạo chỉ mục

module.exports = Major;
