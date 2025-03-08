const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubjectTermSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    subjectTermCode: { type: String, required: true, unique: true},
    subjectID: { type: Schema.Types.ObjectId, ref: 'Subject', default: null },
    termID: { type: Schema.Types.ObjectId, ref: 'Term', default: null }
});

const SubjectTerm = mongoose.model('SubjectTerm', SubjectTermSchema);
module.exports = SubjectTerm;
