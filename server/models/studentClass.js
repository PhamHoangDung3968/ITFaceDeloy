const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentClassSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    studentID: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    classsectionID: { type: Schema.Types.ObjectId, ref: 'classsection', default: null },
});

const studentClass = mongoose.model('studentClass', studentClassSchema);
module.exports = studentClass;
