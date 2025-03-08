const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const teachingAssignmentSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    teacherID: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    subjecttermID: { type: Schema.Types.ObjectId, ref: 'SubjectTerm', default: null },
    classsectionID: [{ type: Schema.Types.ObjectId, ref: 'classsection', default: null }],
});

const teachingAssignment = mongoose.model('teachingAssignment', teachingAssignmentSchema);
module.exports = teachingAssignment;
