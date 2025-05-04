const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NoticeWarningSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    studentID: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    classsectionID: { type: Schema.Types.ObjectId, ref: 'classsection', default: null },
    numberNotifications: { type: Number, default: 0 },
});

const NoticeWarning = mongoose.model('NoticeWarning', NoticeWarningSchema);
module.exports = NoticeWarning;
