const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const registrationImageSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    studentID: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    images: [{ type: String }],
});

const registrationImage = mongoose.model('registrationImage', registrationImageSchema);
module.exports = registrationImage;
