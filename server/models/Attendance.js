const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AttendanceSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    studentclasssection: { type: Schema.Types.ObjectId, ref: 'studentClass', required: true },
    attendanceRecords: [{
        date: { type: Date, required: true },
        time: { type: String, default: null }, // Cho phép null
        status: { type: String, enum: ['Có mặt', 'Vắng có phép', 'Đi trễ', 'Hỗ trợ', null], default: null } // Thêm trạng thái mới và cho phép null
    }]
});

const Attendance = mongoose.model('Attendance', AttendanceSchema);
module.exports = Attendance;