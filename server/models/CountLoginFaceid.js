const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CountLoginFaceidSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    totalLoginFaceID: { type: Number, default: 0 },
});

const countloginfaceid = mongoose.model('countloginfaceid', CountLoginFaceidSchema);
module.exports = countloginfaceid;