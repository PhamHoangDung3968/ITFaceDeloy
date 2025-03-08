const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TermSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  term: { type: Number, required: true, unique: true },
  startYear: { type: Number, required: true },
  endYear: { type: Number, required: true },
  startDate: { type: Date, required: true },
  status: { type: Number, default: 0 },
  endDate: { type: Date, required: true },

}, { versionKey: false });

TermSchema.index({ term: 1 }, { unique: true }); // Đảm bảo tạo chỉ mục

const Term = mongoose.model('Term', TermSchema);
Term.createIndexes(); // Tạo chỉ mục

module.exports = Term;