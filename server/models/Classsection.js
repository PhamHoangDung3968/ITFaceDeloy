const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClassSectionSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    classCode: { type: String, required: true, unique: true },
    classType: { type: Number, default: 0 },
    schoolDay: { type: [String], required: true }, // Sử dụng mảng để lưu nhiều giá trị
    lesson: { type: [Number], required: true }, // Sử dụng mảng để lưu nhiều giá trị
    subjecttermID: { type: Schema.Types.ObjectId, ref: 'SubjectTerm', default: null }
});

// Create a unique index on classCode
ClassSectionSchema.index({ classCode: 1 }, { unique: true });

const classsection = mongoose.model('classsection', ClassSectionSchema);
module.exports = classsection;