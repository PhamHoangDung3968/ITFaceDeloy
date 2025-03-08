const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubjectSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    subjectCode: { type: String, required: true, unique: true},
    subjectName: { type: String, required: true},
    credit: { type: Number, required: true},
    major: { type: Schema.Types.ObjectId, ref: 'Major', default: null },
    // term: { type: Schema.Types.ObjectId, ref: 'Term', default: null }
});

const Subject = mongoose.model('Subject', SubjectSchema);
module.exports = Subject;