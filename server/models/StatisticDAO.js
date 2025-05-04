const mongoose = require('mongoose');
const studentClass = require('./studentClass');
const Classsection = require('./Classsection'); // Import mô hình Classsection
const Attendance = require('./Attendance');
const User = require('./User'); // Import mô hình User
const xlsx = require('xlsx'); // Import the xlsx library
const ExcelJS = require('exceljs'); // Import the exceljs library
const SubjectTerm = require('./SubjectTerm');
const Term = require('./Term'); // Import mô hình Role
const classsection = require('./Classsection'); // Import mô hình Classsection
const CountLoginFaceID = require('./CountLoginFaceid');
const path = require('path'); // Import thư viện path



const StatisticDAO = {
    async getClassSectionsAndTotalDatesByStudentID(studentID) {
        try {
            if (!mongoose.Types.ObjectId.isValid(studentID)) {
                throw new Error('Invalid studentID format');
            }
            const assignments = await studentClass.find({ studentID: studentID })
                .populate({
                    path: 'classsectionID',
                    select: 'classCode classType schoolDay lesson subjecttermID',
                    populate: {
                        path: 'subjecttermID',
                        select: 'subjectID termID',
                        populate: {
                            path: 'subjectID',
                            select: 'subjectName'
                        }
                    }
                });
            const classSections = assignments.map(assignment => assignment.classsectionID);
            const totalStudyDays = await Promise.all(classSections.map(async (classSection) => {
                const studentClassRecord = await studentClass.findOne({
                    studentID: studentID,
                    classsectionID: classSection._id
                });
                if (!studentClassRecord) {
                    return {
                        _id: classSection._id,
                        classCode: classSection.classCode,
                        classType: classSection.classType,
                        schoolDay: classSection.schoolDay,
                        lesson: classSection.lesson,
                        subjecttermID: classSection.subjecttermID,
                        subjectID: classSection.subjecttermID ? classSection.subjecttermID.subjectID : null,
                        subjectName: classSection.subjecttermID && classSection.subjecttermID.subjectID ? classSection.subjecttermID.subjectID.subjectName : null,
                        totalDays: null,
                        totalDaysWithNullTime: null,
                        totalDaysWithExcusedAbsence: null
                    };
                }
                const attendanceRecords = await Attendance.find({
                    studentclasssection: studentClassRecord._id
                });
                const totalDays = attendanceRecords.reduce((total, record) => {
                    return total + record.attendanceRecords.length;
                }, 0);
                const totalDaysWithNullTime = attendanceRecords.reduce((total, record) => {
                    const nullTimeDates = record.attendanceRecords.filter(attendance => attendance.time === null).length;
                    return total + nullTimeDates;
                }, 0);
                const totalDaysWithExcusedAbsence = attendanceRecords.reduce((total, record) => {
                    const excusedAbsenceDates = record.attendanceRecords.filter(attendance => attendance.status === 'Vắng có phép').length;
                    return total + excusedAbsenceDates;
                }, 0);

                return {
                    _id: classSection._id,
                    classCode: classSection.classCode,
                    classType: classSection.classType,
                    schoolDay: classSection.schoolDay,
                    lesson: classSection.lesson,
                    subjecttermID: classSection.subjecttermID,
                    subjectID: classSection.subjecttermID ? classSection.subjecttermID.subjectID : null,
                    subjectName: classSection.subjecttermID && classSection.subjecttermID.subjectID ? classSection.subjecttermID.subjectID.subjectName : null,
                    totalDays: totalDays,
                    totalDaysWithNullTime: totalDaysWithNullTime,
                    totalDaysWithExcusedAbsence: totalDaysWithExcusedAbsence
                };
            }));

            return totalStudyDays;
        } catch (error) {
            console.error('Error fetching class sections and total dates by studentID:', error);
            throw error;
        }
    },

      async exportTKAverageAbsentExcel(filePath) {
        try {
          const classSections = await this.getAllClassSectionsAndTotalDates();
    
          const workbook = new ExcelJS.Workbook();
          const worksheet = workbook.addWorksheet('AverageAbsenteeism');
    
          // Add the column headers
          const columnHeaders = [
            'Mã lớp học phần', 'Tên lớp học phần', 'Số lượng sinh viên vắng trung bình', 'Tổng số sinh viên'
            // 'Total Days With Excused Absence', 
            // 'Total Null Times', 'Total Students', 'Total Days', 'Total Non-Null Times'
          ];
          const headerRow = worksheet.addRow(columnHeaders);
          headerRow.eachCell((cell) => {
            cell.font = { bold: true }; // Make the column headers bold
          });
    
          // Add the class section data
          classSections.forEach(classSection => {
            const nullTimesPerStudent = (classSection.totalStudents === 0 || classSection.totalNullTimes === 0) 
          ? 'Chưa có dữ liệu' 
          : (classSection.totalNullTimes / classSection.totalStudents).toFixed(2);
            worksheet.addRow([
              classSection.classCode,
              classSection.subjectName,
              nullTimesPerStudent,
            //   classSection.totalDaysWithExcusedAbsence,
            //   classSection.totalNullTimes,
              classSection.totalStudents,
            //   classSection.totalDays,
            //   classSection.totalNonNullTimes
            ]);
          });
          const buffer = await workbook.xlsx.writeBuffer();
          return buffer;
        } catch (error) {
          console.error('Error exporting class sections to Excel:', error);
          throw error;
        }
      },

    async getClassSectionsAndTotalDatesByTeacherID(teacherID) {
        try {
            const students = await User.aggregate([
                {
                    $lookup: {
                        from: 'studentclasses',
                        localField: '_id',
                        foreignField: 'studentID',
                        as: 'studentClasses'
                    }
                },
                { $unwind: '$studentClasses' },
                {
                    $lookup: {
                        from: 'classsections',
                        localField: 'studentClasses.classsectionID',
                        foreignField: '_id',
                        as: 'classSection'
                    }
                },
                { $unwind: '$classSection' },
                {
                    $lookup: {
                        from: 'teachingassignments',
                        localField: 'classSection._id',
                        foreignField: 'classsectionID',
                        as: 'teachingAssignments'
                    }
                },
                {
                    $match: {
                        'teachingAssignments.teacherID': new mongoose.Types.ObjectId(teacherID)
                    }
                },
                {
                    $lookup: {
                        from: 'subjectterms',
                        localField: 'classSection.subjecttermID',
                        foreignField: '_id',
                        as: 'subjectterm'
                    }
                },
                { $unwind: '$subjectterm' },
                {
                    $lookup: {
                        from: 'subjects',
                        localField: 'subjectterm.subjectID',
                        foreignField: '_id',
                        as: 'subject'
                    }
                },
                { $unwind: '$subject' },
                {
                    $lookup: {
                        from: 'terms',
                        localField: 'subjectterm.termID',
                        foreignField: '_id',
                        as: 'term'
                    }
                },
                { $unwind: '$term' },
                {
                    $lookup: {
                        from: 'attendances',
                        localField: 'studentClasses._id',
                        foreignField: 'studentclasssection',
                        as: 'attendances'
                    }
                },
                {
                    $addFields: {
                        totalNullTimes: {
                            $sum: {
                                $map: {
                                    input: {
                                        $filter: {
                                            input: '$attendances',
                                            as: 'attendance',
                                            cond: { $eq: ['$$attendance.studentclasssection', '$studentClasses._id'] }
                                        }
                                    },
                                    as: 'attendance',
                                    in: {
                                        $size: {
                                            $filter: {
                                                input: '$$attendance.attendanceRecords',
                                                as: 'record',
                                                cond: {
                                                    $and: [
                                                        { $eq: ['$$record.time', null] },
                                                        { $lte: ['$$record.date', new Date()] }
                                                    ]
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        email: 1,
                        userCode: 1,
                        fullName: 1,
                        totalNullTimes: 1,
                        classSection: {
                            _id: 1,
                            classCode: 1,
                            classType: 1,
                            schoolDay: 1,
                            lesson: 1,
                            subjecttermID: '$subjectterm._id',
                            subjectID: '$subject._id',
                            subjectName: '$subject.subjectName',
                            termID: '$term._id',
                            totalDays: {
                                $sum: {
                                    $map: {
                                        input: {
                                            $filter: {
                                                input: '$attendances',
                                                as: 'attendance',
                                                cond: { $eq: ['$$attendance.studentclasssection', '$studentClasses._id'] }
                                            }
                                        },
                                        as: 'attendance',
                                        in: { $size: '$$attendance.attendanceRecords' }
                                    }
                                }
                            }
                        }
                    }
                },
                {
                    $match: {
                        'classSection._id': { $ne: null }
                    }
                }
            ]);
    
            return students;
        } catch (error) {
            console.error('Error fetching students and class sections by teacherID:', error);
            throw error;
        }
    },

    //Xuất trang DSSV vắng nhiều của role Giảng viên
    async exportTKClassSectionsToExcel(teacherID, termID, totalNullTimesStart, totalNullTimesEnd) {
        try {
            // Truy vấn termID để lấy thông tin term
            const term = await Term.findById(termID).select('term').lean();
            if (!term) {
                throw new Error('Term not found');
            }

            //cái getClassSectionsAndTotalDatesByTeacherID là lấy hàm phía trên
            const classSections = await this.getClassSectionsAndTotalDatesByTeacherID(teacherID);

            // Lọc dữ liệu theo termID và khoảng totalNullTimes
            const filteredClassSections = classSections.filter(classSection => 
                classSection.classSection && classSection.classSection.termID && classSection.classSection.termID.toString() === termID &&
                classSection.totalNullTimes >= totalNullTimesStart && classSection.totalNullTimes <= totalNullTimesEnd
            );

            if (filteredClassSections.length === 0) {
                console.log('No data found for the given criteria');
                return null;
            }

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('ClassSection');

            // === LOGO ===
            const logoPath = path.join(__dirname, '../uploads/logovanlang1.png');
            const logo = workbook.addImage({
                filename: logoPath,
                extension: 'png',
            });
            worksheet.addImage(logo, {
                tl: { col: 1.6, row: 0 }, // B1 là col: 1 (0-indexed)
                ext: { width: 60, height: 53 }, // Tùy chỉnh theo kích thước logo thật tế
            });

            // === TÊN TRƯỜNG ===
            worksheet.mergeCells('A4:H4');
            worksheet.getCell('A4').value = 'TRƯỜNG ĐẠI HỌC VĂN LANG';
            worksheet.getCell('A4').font = { bold: true, size: 16 };
            worksheet.getCell('A4').alignment = { vertical: 'middle', horizontal: 'left' };

            // === TÊN KHOA ===
            worksheet.mergeCells('A5:H5');
            worksheet.getCell('A5').value = 'KHOA CÔNG NGHỆ THÔNG TIN';
            worksheet.getCell('A5').font = { bold: true, size: 16 };
            worksheet.getCell('A5').alignment = { vertical: 'middle', horizontal: 'left' };

            // === DÒNG TRỐNG ===
            worksheet.addRow([null]);

            // === TIÊU ĐỀ DANH SÁCH ===
            worksheet.mergeCells('A7:H7');
            worksheet.getCell('A7').value = 'DANH SÁCH SINH VIÊN VẮNG NHIỀU';
            worksheet.getCell('A7').font = { bold: true, size: 14 };
            worksheet.getCell('A7').alignment = { vertical: 'middle', horizontal: 'center' };

            // === HỌC KỲ ===
            worksheet.mergeCells('A8:H8');
            worksheet.getCell('A8').value = `HỌC KỲ: ${term.term}`;
            worksheet.getCell('A8').font = { bold: true, size: 12 };
            worksheet.getCell('A8').alignment = { vertical: 'middle', horizontal: 'center' };
            worksheet.mergeCells('A9:H9');
            worksheet.getCell('A9').value = `VẮNG TỪ ${totalNullTimesStart} BUỔI ĐẾN ${totalNullTimesEnd} BUỔI`;
            worksheet.getCell('A9').font = { bold: true, size: 12 };
            worksheet.getCell('A9').alignment = { vertical: 'middle', horizontal: 'center' };
            const columnHeaders = ['STT', 'Mã lớp', 'Tên môn học', 'Email', 'Mã số SV', 'Họ và tên', 'Số buổi vắng', 'Tổng số buổi học'];
            const headerRow = worksheet.addRow(columnHeaders);
            headerRow.eachCell((cell) => {
                // cell.font = { bold: true};
                cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FF2400' }, // Red background
                };
                cell.alignment = { vertical: 'middle', horizontal: 'center' };
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            });

            // Set column widths
            worksheet.getColumn(1).width = 5; // STT
            worksheet.getColumn(2).width = 22; // Mã lớp
            worksheet.getColumn(3).width = 45; // Tên môn học
            worksheet.getColumn(4).width = 35; // Email
            worksheet.getColumn(5).width = 15; // Mã số SV
            worksheet.getColumn(6).width = 30; // Họ và tên
            worksheet.getColumn(7).width = 20; // Số buổi vắng
            worksheet.getColumn(8).width = 20; // Tổng số buổi học

            // Add the student data with index
            let rowIndex = 1;
            filteredClassSections.forEach(student => {
                if (student.classSection) {
                    worksheet.addRow([
                        rowIndex++, // STT
                        student.classSection.classCode,
                        student.classSection.subjectName,
                        student.email,
                        student.userCode,
                        student.fullName,
                        student.totalNullTimes,
                        student.classSection.totalDays
                    ]);
                }
            });

            // Add the final rows with the date and signature
            const finalRow1 = worksheet.addRow(['TP.Hồ Chí Minh, ngày   tháng    năm 2025']);
            finalRow1.font = { italic: true };
            finalRow1.alignment = { horizontal: 'right' };
            worksheet.mergeCells(`A${finalRow1.number}:H${finalRow1.number}`);

            const finalRow2 = worksheet.addRow(['Người lập danh sách                ']);
            finalRow2.font = { italic: true };
            finalRow2.alignment = { horizontal: 'right' };
            worksheet.mergeCells(`A${finalRow2.number}:H${finalRow2.number}`);

            const buffer = await workbook.xlsx.writeBuffer();
            return buffer;
        } catch (error) {
            console.error('Error exporting class sections to Excel:', error);
            throw error;
        }
    },
    
    async getClassSectionsAndTotalDates() {
        try {
            const students = await User.aggregate([
                {
                    $lookup: {
                        from: 'studentclasses',
                        localField: '_id',
                        foreignField: 'studentID',
                        as: 'studentClasses'
                    }
                },
                { $unwind: '$studentClasses' },
                {
                    $lookup: {
                        from: 'classsections',
                        localField: 'studentClasses.classsectionID',
                        foreignField: '_id',
                        as: 'classSection'
                    }
                },
                { $unwind: '$classSection' },
                {
                    $lookup: {
                        from: 'subjectterms',
                        localField: 'classSection.subjecttermID',
                        foreignField: '_id',
                        as: 'subjectterm'
                    }
                },
                { $unwind: '$subjectterm' },
                {
                    $lookup: {
                        from: 'subjects',
                        localField: 'subjectterm.subjectID',
                        foreignField: '_id',
                        as: 'subject'
                    }
                },
                { $unwind: '$subject' },
                {
                    $lookup: {
                        from: 'terms',
                        localField: 'subjectterm.termID',
                        foreignField: '_id',
                        as: 'term'
                    }
                },
                { $unwind: '$term' },
                {
                    $lookup: {
                        from: 'attendances',
                        localField: 'studentClasses._id',
                        foreignField: 'studentclasssection',
                        as: 'attendances'
                    }
                },
                {
                    $addFields: {
                        totalNullTimes: {
                            $sum: {
                                $map: {
                                    input: {
                                        $filter: {
                                            input: '$attendances',
                                            as: 'attendance',
                                            cond: { $eq: ['$$attendance.studentclasssection', '$studentClasses._id'] }
                                        }
                                    },
                                    as: 'attendance',
                                    in: {
                                        $size: {
                                            $filter: {
                                                input: '$$attendance.attendanceRecords',
                                                as: 'record',
                                                cond: {
                                                    $and: [
                                                        { $eq: ['$$record.time', null] },
                                                        { $lte: ['$$record.date', new Date()] }
                                                    ]
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        email: 1,
                        userCode: 1,
                        fullName: 1,
                        totalNullTimes: 1,
                        classSection: {
                            _id: 1,
                            classCode: 1,
                            classType: 1,
                            schoolDay: 1,
                            lesson: 1,
                            subjecttermID: '$subjectterm._id',
                            subjectID: '$subject._id',
                            subjectName: '$subject.subjectName',
                            termID: '$term._id',
                            totalDays: {
                                $sum: {
                                    $map: {
                                        input: {
                                            $filter: {
                                                input: '$attendances',
                                                as: 'attendance',
                                                cond: { $eq: ['$$attendance.studentclasssection', '$studentClasses._id'] }
                                            }
                                        },
                                        as: 'attendance',
                                        in: { $size: '$$attendance.attendanceRecords' }
                                    }
                                }
                            }
                        }
                    }
                },
                {
                    $match: {
                        'classSection._id': { $ne: null }
                    }
                }
            ]);
    
            return students;
        } catch (error) {
            console.error('Error fetching students and class sections:', error);
            throw error;
        }
    },

    //Xuất excel trang DSSV vắng nhiều của Ban chủ nhiệm khoa
    async exportTKClassSectionsToExcelWithoutTeacherID(termID, totalNullTimesStart, totalNullTimesEnd) {
        try {
            // Truy vấn termID để lấy thông tin term
            const term = await Term.findById(termID).select('term').lean();
            if (!term) {
                throw new Error('Term not found');
            }

            //cái getClassSectionsAndTotalDates là lấy hàm phía trên
            const classSections = await this.getClassSectionsAndTotalDates();

            // Lọc dữ liệu theo termID và khoảng totalNullTimes
            const filteredClassSections = classSections.filter(classSection => 
                classSection.classSection && classSection.classSection.termID && classSection.classSection.termID.toString() === termID &&
                classSection.totalNullTimes >= totalNullTimesStart && classSection.totalNullTimes <= totalNullTimesEnd
            );

            if (filteredClassSections.length === 0) {
                console.log('No data found for the given criteria');
                return null;
            }

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('ClassSection');
            // === THÊM LOGO ===
            // === LOGO ===
            const logoPath = path.join(__dirname, '../uploads/logovanlang1.png');
            const logo = workbook.addImage({
            filename: logoPath,
            extension: 'png',
            });

            worksheet.addImage(logo, {
                tl: { col: 1.6, row: 0 }, // B1 là col: 1 (0-indexed)
                ext: { width: 60, height: 53 }, // Tùy chỉnh theo kích thước logo thật tế
            });

            // === TÊN TRƯỜNG ===
            worksheet.mergeCells('A4:H4');
            worksheet.getCell('A4').value = 'TRƯỜNG ĐẠI HỌC VĂN LANG';
            worksheet.getCell('A4').font = { bold: true, size: 16 };
            worksheet.getCell('A4').alignment = { vertical: 'middle', horizontal: 'left' };

            // === TÊN KHOA ===
            worksheet.mergeCells('A5:H5');
            worksheet.getCell('A5').value = 'KHOA CÔNG NGHỆ THÔNG TIN';
            worksheet.getCell('A5').font = { bold: true, size: 16 };
            worksheet.getCell('A5').alignment = { vertical: 'middle', horizontal: 'left' };

            // === DÒNG TRỐNG ===
            worksheet.addRow([null]); // Thêm dòng trống với một giá trị null thay vì mảng trống.

            // === TIÊU ĐỀ DANH SÁCH ===
            worksheet.mergeCells('A7:H7');
            worksheet.getCell('A7').value = 'DANH SÁCH SINH VIÊN VẮNG NHIỀU';
            worksheet.getCell('A7').font = { bold: true, size: 14 };
            worksheet.getCell('A7').alignment = { vertical: 'middle', horizontal: 'center' };

            // === HỌC KỲ ===
            worksheet.mergeCells('A8:H8');
            worksheet.getCell('A8').value = `HỌC KỲ: ${term.term}`;
            worksheet.getCell('A8').font = { bold: true, size: 12 };
            worksheet.getCell('A8').alignment = { vertical: 'middle', horizontal: 'center' };
            worksheet.mergeCells('A9:H9');
            worksheet.getCell('A9').value = `VẮNG TỪ ${totalNullTimesStart} BUỔI ĐẾN ${totalNullTimesEnd} BUỔI`;
            worksheet.getCell('A9').font = { bold: true, size: 12 };
            worksheet.getCell('A9').alignment = { vertical: 'middle', horizontal: 'center' };
            const columnHeaders = ['STT', 'Mã lớp', 'Tên môn học', 'Email', 'Mã số SV', 'Họ và tên', 'Số buổi vắng', 'Tổng số buổi học'];
            const headerRow = worksheet.addRow(columnHeaders);

            headerRow.eachCell((cell) => {
                // cell.font = { bold: true };
                cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FF2400' } // Màu đỏ (ARGB: Alpha-Red-Green-Blue)
                };
            });

            // Set column widths
            worksheet.getColumn(1).width = 5; // STT
            worksheet.getColumn(2).width = 22; // Mã lớp
            worksheet.getColumn(3).width = 45; // Tên môn học
            worksheet.getColumn(4).width = 35; // Email
            worksheet.getColumn(5).width = 15; // Mã số SV
            worksheet.getColumn(6).width = 30; // Họ và tên
            worksheet.getColumn(7).width = 20; // Số buổi vắng
            worksheet.getColumn(8).width = 20; // Tổng số buổi học

            // Add the student data with index
            let rowIndex = 1;
            filteredClassSections.forEach(student => {
                if (student.classSection) {
                    worksheet.addRow([
                        rowIndex++, // STT
                        student.classSection.classCode,
                        student.classSection.subjectName,
                        student.email,
                        student.userCode,
                        student.fullName,
                        student.totalNullTimes,
                        student.classSection.totalDays
                    ]);
                }
            });

            // Add the final rows with the date and signature
            const finalRow1 = worksheet.addRow(['TP.Hồ Chí Minh, ngày   tháng    năm 2025']);
            finalRow1.font = { italic: true };
            finalRow1.alignment = { horizontal: 'right' };
            worksheet.mergeCells(`A${finalRow1.number}:H${finalRow1.number}`);

            const finalRow2 = worksheet.addRow(['Người lập danh sách                ']);
            finalRow2.font = { italic: true };
            finalRow2.alignment = { horizontal: 'right' };
            worksheet.mergeCells(`A${finalRow2.number}:H${finalRow2.number}`);

            const buffer = await workbook.xlsx.writeBuffer();
            return buffer;
        } catch (error) {
            console.error('Error exporting class sections to Excel:', error);
            throw error;
        }
    },
    async getClassSectionsAndDatesWithNonNullTimesByTeacherID(teacherID) {
        try {
            // Tính totalStudents cho mỗi lớp
            const totalStudentsPerClass = await studentClass.aggregate([
                {
                    $group: {
                        _id: '$classsectionID',
                        totalStudents: { $sum: 1 }
                    }
                }
            ]);

            // Tạo một map để dễ dàng tra cứu totalStudents
            const totalStudentsMap = new Map();
            totalStudentsPerClass.forEach(item => {
                totalStudentsMap.set(item._id.toString(), item.totalStudents);
            });

            // Tính subjectName cho mỗi lớp
            const subjectNamesPerClass = await Classsection.aggregate([
                {
                    $lookup: {
                        from: 'subjectterms',
                        localField: 'subjecttermID',
                        foreignField: '_id',
                        as: 'subjectterm'
                    }
                },
                { $unwind: '$subjectterm' },
                {
                    $lookup: {
                        from: 'subjects',
                        localField: 'subjectterm.subjectID',
                        foreignField: '_id',
                        as: 'subject'
                    }
                },
                { $unwind: '$subject' },
                {
                    $project: {
                        _id: '$_id',
                        subjectName: '$subject.subjectName'
                    }
                }
            ]);

            // Tạo một map để dễ dàng tra cứu subjectName
            const subjectNamesMap = new Map();
            subjectNamesPerClass.forEach(item => {
                subjectNamesMap.set(item._id.toString(), item.subjectName);
            });

            // Tính termID cho mỗi lớp
            const termIDsPerClass = await Classsection.aggregate([
                {
                    $lookup: {
                        from: 'subjectterms',
                        localField: 'subjecttermID',
                        foreignField: '_id',
                        as: 'subjectterm'
                    }
                },
                { $unwind: '$subjectterm' },
                {
                    $lookup: {
                        from: 'terms',
                        localField: 'subjectterm.termID',
                        foreignField: '_id',
                        as: 'term'
                    }
                },
                { $unwind: '$term' },
                {
                    $project: {
                        _id: '$_id',
                        termID: '$term._id'
                    }
                }
            ]);

            // Tạo một map để dễ dàng tra cứu termID
            const termIDsMap = new Map();
            termIDsPerClass.forEach(item => {
                termIDsMap.set(item._id.toString(), item.termID);
            });

            const classSections = await Classsection.aggregate([
                {
                    $lookup: {
                        from: 'teachingassignments',
                        localField: '_id',
                        foreignField: 'classsectionID',
                        as: 'teachingAssignments'
                    }
                },
                {
                    $match: {
                        'teachingAssignments.teacherID': new mongoose.Types.ObjectId(teacherID)
                    }
                },
                {
                    $lookup: {
                        from: 'subjectterms',
                        localField: 'subjecttermID',
                        foreignField: '_id',
                        as: 'subjectterm'
                    }
                },
                { $unwind: '$subjectterm' },
                {
                    $lookup: {
                        from: 'subjects',
                        localField: 'subjectterm.subjectID',
                        foreignField: '_id',
                        as: 'subject'
                    }
                },
                { $unwind: '$subject' },
                {
                    $lookup: {
                        from: 'terms',
                        localField: 'subjectterm.termID',
                        foreignField: '_id',
                        as: 'term'
                    }
                },
                { $unwind: '$term' },
                {
                    $lookup: {
                        from: 'studentclasses',
                        localField: '_id',
                        foreignField: 'classsectionID',
                        as: 'studentClasses'
                    }
                },
                {
                    $lookup: {
                        from: 'attendances',
                        localField: 'studentClasses._id',
                        foreignField: 'studentclasssection',
                        as: 'attendances'
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'studentClasses.studentID',
                        foreignField: '_id',
                        as: 'students'
                    }
                },
                {
                    $addFields: {
                        totalDays: {
                            $sum: {
                                $map: {
                                    input: '$attendances',
                                    as: 'attendance',
                                    in: { $size: '$$attendance.attendanceRecords' }
                                }
                            }
                        },
                        datesWithNonNullTimes: {
                            $reduce: {
                                input: '$attendances',
                                initialValue: [],
                                in: {
                                    $concatArrays: [
                                        '$$value',
                                        {
                                            $map: {
                                                input: '$$this.attendanceRecords',
                                                as: 'record',
                                                in: {
                                                    date: '$$record.date',
                                                    nonNullTimesCount: {
                                                        $cond: {
                                                            if: { $ne: ['$$record.time', null] },
                                                            then: 1,
                                                            else: 0
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    ]
                                }
                            }
                        }
                    }
                },
                {
                    $unwind: '$datesWithNonNullTimes'
                },
                {
                    $group: {
                        _id: {
                            classCode: '$classCode',
                            date: '$datesWithNonNullTimes.date'
                        },
                        nonNullTimesCount: { $sum: '$datesWithNonNullTimes.nonNullTimesCount' }
                    }
                },
                {
                    $sort: {
                        '_id.date': 1
                    }
                },
                {
                    $group: {
                        _id: '$_id.classCode',
                        datesWithNonNullTimes: {
                            $push: {
                                date: '$_id.date',
                                nonNullTimesCount: '$nonNullTimesCount'
                            }
                        }
                    }
                },
                {
                    $lookup: {
                        from: 'classsections',
                        localField: '_id',
                        foreignField: 'classCode',
                        as: 'classSection'
                    }
                },
                {
                    $unwind: '$classSection'
                },
                {
                    $project: {
                        _id: '$classSection._id',
                        classCode: '$_id',
                        classType: '$classSection.classType',
                        schoolDay: '$classSection.schoolDay',
                        lesson: '$classSection.lesson',
                        subjecttermID: '$classSection.subjecttermID',
                        subjectID: '$classSection.subjectID',
                        totalDays: '$classSection.totalDays',
                        datesWithNonNullTimes: 1,
                        totalStudents: { $literal: 0 }, // Placeholder để thêm totalStudents sau
                        subjectName: { $literal: '' }, // Placeholder để thêm subjectName sau
                        termID: { $literal: '' } // Placeholder để thêm termID sau
                    }
                }
            ]);

            // Thêm totalStudents, subjectName và termID vào kết quả cuối cùng
            classSections.forEach(classSection => {
                classSection.totalStudents = totalStudentsMap.get(classSection._id.toString()) || 0;
                classSection.subjectName = subjectNamesMap.get(classSection._id.toString()) || '';
                classSection.termID = termIDsMap.get(classSection._id.toString()) || '';
            });

            // Sắp xếp lại các ngày theo thứ tự tăng dần
            classSections.forEach(classSection => {
                classSection.datesWithNonNullTimes.sort((a, b) => new Date(a.date) - new Date(b.date));
            });

            return classSections;
        } catch (error) {
            console.error('Error fetching class sections and dates with non-null times by teacherID:', error);
            throw error;
        }
    },

    //Xuất trang Thống kê tình hình học theo LHP của giảng viên
    async exportClassSectionsAndDatesWithNonNullTimesToExcel(teacherID, termID) {
        try {
            // Truy vấn termID để lấy thông tin term
            const term = await Term.findById(termID).select('term').lean();
            if (!term) {
                throw new Error('Term not found');
            }
    
            // Lấy dữ liệu các lớp học phần theo teacherID
            const classSections = await this.getClassSectionsAndDatesWithNonNullTimesByTeacherID(teacherID);
    
            // Lọc dữ liệu theo termID
            const filteredClassSections = classSections.filter(classSection => classSection.termID.toString() === termID);
    
            if (filteredClassSections.length === 0) {
                console.log('No data found for the given termID');
                return null;
            }
    
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('ClassSections');
    
            // === TÊN TRƯỜNG ===
            worksheet.mergeCells('A4:H4');
            worksheet.getCell('A4').value = 'TRƯỜNG ĐẠI HỌC VĂN LANG';
            worksheet.getCell('A4').font = { bold: true, size: 16 };
            worksheet.getCell('A4').alignment = { vertical: 'middle', horizontal: 'left' };

            // === TÊN KHOA ===
            worksheet.mergeCells('A5:H5');
            worksheet.getCell('A5').value = 'KHOA CÔNG NGHỆ THÔNG TIN';
            worksheet.getCell('A5').font = { bold: true, size: 16 };
            worksheet.getCell('A5').alignment = { vertical: 'middle', horizontal: 'left' };

            // === LOGO ===
            const logoPath = path.join(__dirname, '../uploads/logovanlang1.png');
            const logo = workbook.addImage({
                filename: logoPath,
                extension: 'png',
            });
            worksheet.addImage(logo, {
                tl: { col: 1.6, row: 0 }, // B1 là col: 1 (0-indexed)
                ext: { width: 60, height: 53 }, // Tùy chỉnh theo kích thước logo thật tế
            });

            // === TIÊU ĐỀ THỐNG KÊ ===
            worksheet.mergeCells('A7:S7');
            worksheet.getCell('A7').value = 'SỐ LƯỢNG SINH VIÊN TỪNG BUỔI';
            worksheet.getCell('A7').font = { bold: true, size: 14 };
            worksheet.getCell('A7').alignment = { vertical: 'middle', horizontal: 'center' };

            // === HỌC KỲ ===
            worksheet.mergeCells('A8:S8');
            worksheet.getCell('A8').value = `Học kỳ: ${term.term}`;
            worksheet.getCell('A8').font = { bold: true, size: 14 };
            worksheet.getCell('A8').alignment = { vertical: 'middle', horizontal: 'center' };

            // Add the column headers
            const columnHeaders = [
                'STT', 'Mã lớp học phần', 'Tên lớp học phần', 
                ...Array.from({ length: 15 }, (_, i) => `Buổi ${i + 1}`), 
                'Tổng số sinh viên'
            ];
            const headerRow = worksheet.addRow(columnHeaders);
            
            headerRow.eachCell((cell) => {
                // cell.font = { bold: true};
                cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FF2400' } // Nền đỏ
                };
                cell.alignment = { vertical: 'middle', horizontal: 'center' };
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            });
            
    
            // Set column widths
            const columnWidths = [10, 22, 50, ...Array(15).fill(7), 20];
            worksheet.columns.forEach((column, index) => {
                column.width = columnWidths[index];
            });
    
            // Add the class section data
            filteredClassSections.forEach((classSection, index) => {
                const rowData = [
                    index + 1, // STT
                    classSection.classCode,
                    classSection.subjectName,
                    ...Array.from({ length: 15 }, (_, i) => {
                        const dateWithNonNullTimes = classSection.datesWithNonNullTimes[i];
                        return dateWithNonNullTimes ? dateWithNonNullTimes.nonNullTimesCount : '';
                    }),
                    classSection.totalStudents
                ];
                worksheet.addRow(rowData);
            });
    
            // Add the final rows with the date and signature
            const finalRow1 = worksheet.addRow(['TP.Hồ Chí Minh, ngày   tháng    năm 2025']);
            finalRow1.font = { italic: true };
            finalRow1.alignment = { horizontal: 'right' };
            worksheet.mergeCells(`A${finalRow1.number}:S${finalRow1.number}`);
    
            const finalRow2 = worksheet.addRow(['Người lập danh sách                ']);
            finalRow2.font = { italic: true };
            finalRow2.alignment = { horizontal: 'right' };
            worksheet.mergeCells(`A${finalRow2.number}:S${finalRow2.number}`);
    
            const buffer = await workbook.xlsx.writeBuffer();
            return buffer;
        } catch (error) {
            console.error('Error exporting class sections and dates with non-null times to Excel:', error);
            throw error;
        }
    },

    async getAllClassSectionsAndDatesWithNonNullTimes() {
        try {
            const totalStudentsPerClass = await studentClass.aggregate([
                {
                    $group: {
                        _id: '$classsectionID',
                        totalStudents: { $sum: 1 }
                    }
                }
            ]);
            const totalStudentsMap = new Map();
            totalStudentsPerClass.forEach(item => {
                totalStudentsMap.set(item._id.toString(), item.totalStudents);
            });
            const subjectNamesPerClass = await Classsection.aggregate([
                {
                    $lookup: {
                        from: 'subjectterms',
                        localField: 'subjecttermID',
                        foreignField: '_id',
                        as: 'subjectterm'
                    }
                },
                { $unwind: '$subjectterm' },
                {
                    $lookup: {
                        from: 'subjects',
                        localField: 'subjectterm.subjectID',
                        foreignField: '_id',
                        as: 'subject'
                    }
                },
                { $unwind: '$subject' },
                {
                    $project: {
                        _id: '$_id',
                        subjectName: '$subject.subjectName'
                    }
                }
            ]);
            const subjectNamesMap = new Map();
            subjectNamesPerClass.forEach(item => {
                subjectNamesMap.set(item._id.toString(), item.subjectName);
            });
            const termIDsPerClass = await Classsection.aggregate([
                {
                    $lookup: {
                        from: 'subjectterms',
                        localField: 'subjecttermID',
                        foreignField: '_id',
                        as: 'subjectterm'
                    }
                },
                { $unwind: '$subjectterm' },
                {
                    $lookup: {
                        from: 'terms',
                        localField: 'subjectterm.termID',
                        foreignField: '_id',
                        as: 'term'
                    }
                },
                { $unwind: '$term' },
                {
                    $project: {
                        _id: '$_id',
                        termID: '$term._id'
                    }
                }
            ]);
            const termIDsMap = new Map();
            termIDsPerClass.forEach(item => {
                termIDsMap.set(item._id.toString(), item.termID);
            });
            const classSections = await Classsection.aggregate([
                {
                    $lookup: {
                        from: 'subjectterms',
                        localField: 'subjecttermID',
                        foreignField: '_id',
                        as: 'subjectterm'
                    }
                },
                { $unwind: '$subjectterm' },
                {
                    $lookup: {
                        from: 'subjects',
                        localField: 'subjectterm.subjectID',
                        foreignField: '_id',
                        as: 'subject'
                    }
                },
                { $unwind: '$subject' },
                {
                    $lookup: {
                        from: 'terms',
                        localField: 'subjectterm.termID',
                        foreignField: '_id',
                        as: 'term'
                    }
                },
                { $unwind: '$term' },
                {
                    $lookup: {
                        from: 'studentclasses',
                        localField: '_id',
                        foreignField: 'classsectionID',
                        as: 'studentClasses'
                    }
                },
                {
                    $lookup: {
                        from: 'attendances',
                        localField: 'studentClasses._id',
                        foreignField: 'studentclasssection',
                        as: 'attendances'
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'studentClasses.studentID',
                        foreignField: '_id',
                        as: 'students'
                    }
                },
                {
                    $addFields: {
                        totalDays: {
                            $sum: {
                                $map: {
                                    input: '$attendances',
                                    as: 'attendance',
                                    in: { $size: '$$attendance.attendanceRecords' }
                                }
                            }
                        },
                        datesWithNonNullTimes: {
                            $reduce: {
                                input: '$attendances',
                                initialValue: [],
                                in: {
                                    $concatArrays: [
                                        '$$value',
                                        {
                                            $map: {
                                                input: '$$this.attendanceRecords',
                                                as: 'record',
                                                in: {
                                                    date: '$$record.date',
                                                    nonNullTimesCount: {
                                                        $cond: {
                                                            if: { $ne: ['$$record.time', null] },
                                                            then: 1,
                                                            else: 0
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    ]
                                }
                            }
                        }
                    }
                },
                {
                    $unwind: '$datesWithNonNullTimes'
                },
                {
                    $group: {
                        _id: {
                            classCode: '$classCode',
                            date: '$datesWithNonNullTimes.date'
                        },
                        nonNullTimesCount: { $sum: '$datesWithNonNullTimes.nonNullTimesCount' }
                    }
                },
                {
                    $sort: {
                        '_id.date': 1
                    }
                },
                {
                    $group: {
                        _id: '$_id.classCode',
                        datesWithNonNullTimes: {
                            $push: {
                                date: '$_id.date',
                                nonNullTimesCount: '$nonNullTimesCount'
                            }
                        }
                    }
                },
                {
                    $lookup: {
                        from: 'classsections',
                        localField: '_id',
                        foreignField: 'classCode',
                        as: 'classSection'
                    }
                },
                {
                    $unwind: '$classSection'
                },
                {
                    $project: {
                        _id: '$classSection._id',
                        classCode: '$_id',
                        classType: '$classSection.classType',
                        schoolDay: '$classSection.schoolDay',
                        lesson: '$classSection.lesson',
                        subjecttermID: '$classSection.subjecttermID',
                        subjectID: '$classSection.subjectID',
                        totalDays: '$classSection.totalDays',
                        datesWithNonNullTimes: 1,
                        totalStudents: { $literal: 0 },
                        subjectName: { $literal: '' },
                        termID: { $literal: '' }
                    }
                }
            ]);
            classSections.forEach(classSection => {
                classSection.totalStudents = totalStudentsMap.get(classSection._id.toString()) || 0;
                classSection.subjectName = subjectNamesMap.get(classSection._id.toString()) || '';
                classSection.termID = termIDsMap.get(classSection._id.toString()) || '';
            });
            classSections.forEach(classSection => {
                classSection.datesWithNonNullTimes.sort((a, b) => new Date(a.date) - new Date(b.date));
            });
            return classSections;
        } catch (error) {
            console.error('Error fetching all class sections and dates with non-null times:', error);
            throw error;
        }
    },

    //Xuất trang Thống kê tỉ lệ SV điểm danh
    async exportAllClassSectionsAndDatesWithNonNullTimesToExcel(termID) {
        try {
            // Truy vấn termID để lấy thông tin term
            const term = await Term.findById(termID).select('term').lean();
            if (!term) {
                throw new Error('Term not found');
            }
    
            // Lấy dữ liệu các lớp học phần theo termID
            const classSections = await this.getAllClassSectionsAndDatesWithNonNullTimes();
    
            // Lọc dữ liệu theo termID
            const filteredClassSections = classSections.filter(classSection => classSection.termID.toString() === termID);
    
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('ClassSections');
    
            // === LOGO ===
            const logoPath = path.join(__dirname, '../uploads/logovanlang1.png');
            const logo = workbook.addImage({
                filename: logoPath,
                extension: 'png',
            });
            worksheet.addImage(logo, {
                tl: { col: 1.6, row: 0 }, // B1 là col: 1 (0-indexed)
                ext: { width: 60, height: 53 }, // Tùy chỉnh theo kích thước logo thật tế
            });
            
            
            // === TÊN TRƯỜNG ===
            worksheet.mergeCells('A4:H4');
            worksheet.getCell('A4').value = 'TRƯỜNG ĐẠI HỌC VĂN LANG';
            worksheet.getCell('A4').font = { bold: true, size: 16 };
            worksheet.getCell('A4').alignment = { vertical: 'middle', horizontal: 'left' };
            
            // === TÊN KHOA ===
            worksheet.mergeCells('A5:H5');
            worksheet.getCell('A5').value = 'KHOA CÔNG NGHỆ THÔNG TIN';
            worksheet.getCell('A5').font = { bold: true, size: 16 };
            worksheet.getCell('A5').alignment = { vertical: 'middle', horizontal: 'left' };
            
            // === DÒNG TRỐNG ===
            worksheet.addRow([null]);
            
            // === TIÊU ĐỀ THỐNG KÊ ===
            worksheet.mergeCells('A7:H7');
            worksheet.getCell('A7').value = 'THỐNG KÊ SỐ LƯỢNG SINH VIÊN THAM GIA';
            worksheet.getCell('A7').font = { bold: true, size: 14 };
            worksheet.getCell('A7').alignment = { vertical: 'middle', horizontal: 'center' };
            
            // === HỌC KỲ ===
            worksheet.mergeCells('A8:H8');
            worksheet.getCell('A8').value = `Học kỳ: ${term.term}`;
            worksheet.getCell('A8').font = { bold: true, size: 12 };
            worksheet.getCell('A8').alignment = { vertical: 'middle', horizontal: 'center' };
            const columnHeaders = [
                'STT', 'Mã lớp học phần', 'Tên lớp học phần', 'Tổng SLSV', 'SLSV tham gia TB'
            ];
            const headerRow = worksheet.addRow(columnHeaders);
            
            headerRow.eachCell((cell) => {
                // cell.font = { bold: true };
                cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FF2400' }, // Nền đỏ
                };
                cell.alignment = { vertical: 'middle', horizontal: 'center' };
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' },
                };
            });
            
    
            // Set column widths
            const columnWidths = [10, 22, 50, 15, 20];
            worksheet.columns.forEach((column, index) => {
                column.width = columnWidths[index];
            });
    
            // Add the class section data
            filteredClassSections.forEach((classSection, index) => {
                const totalNonNullTimesCount = classSection.datesWithNonNullTimes.reduce((sum, record) => sum + record.nonNullTimesCount, 0);
                const averageNonNullTimesCount = classSection.datesWithNonNullTimes.length > 0 ? (totalNonNullTimesCount / classSection.datesWithNonNullTimes.length).toFixed(2) : 'Chưa có dữ liệu';
    
                const rowData = [
                    index + 1, // STT
                    classSection.classCode,
                    classSection.subjectName,
                    classSection.totalStudents,
                    averageNonNullTimesCount
                ];
                worksheet.addRow(rowData);
            });
    
            // Add the final rows with the date and signature
            const finalRow1 = worksheet.addRow(['TP.Hồ Chí Minh, ngày   tháng    năm 2025']);
            finalRow1.font = { italic: true };
            finalRow1.alignment = { horizontal: 'right' };
            worksheet.mergeCells(`A${finalRow1.number}:E${finalRow1.number}`);
    
            const finalRow2 = worksheet.addRow(['Người lập danh sách                ']);
            finalRow2.font = { italic: true };
            finalRow2.alignment = { horizontal: 'right' };
            worksheet.mergeCells(`A${finalRow2.number}:E${finalRow2.number}`);
    
            const buffer = await workbook.xlsx.writeBuffer();
            return buffer;
        } catch (error) {
            console.error('Error exporting class sections and dates with non-null times to Excel:', error);
            throw error;
        }
    },

    //Chạy local
    // async getAttendanceStatistics() {
    //     const now = new Date();
    //     const fiveWeeksAgo = new Date(now);
    //     fiveWeeksAgo.setDate(now.getDate() - 35);
    
    //     const attendanceRecords = await Attendance.aggregate([
    //       {
    //         $match: {
    //           'attendanceRecords.date': { $gte: fiveWeeksAgo, $lte: now }
    //         }
    //       },
    //       {
    //         $unwind: '$attendanceRecords'
    //       },
    //       {
    //         $match: {
    //           'attendanceRecords.date': { $gte: fiveWeeksAgo, $lte: now }
    //         }
    //       },
    //       {
    //         $group: {
    //           _id: {
    //             week: { $isoWeek: '$attendanceRecords.date' },
    //             year: { $isoWeekYear: '$attendanceRecords.date' }
    //           },
    //           count: {
    //             $sum: {
    //               $cond: [{ $ne: ['$attendanceRecords.time', null] }, 1, 0]
    //             }
    //           },
    //           startDate: { $min: '$attendanceRecords.date' },
    //           endDate: { $max: '$attendanceRecords.date' }
    //         }
    //       },
    //       {
    //         $sort: { '_id.year': -1, '_id.week': -1 }
    //       },
    //       {
    //         $limit: 5
    //       }
    //     ]);
    
    //     const weekNames = ['Tuần thứ nhất', 'Tuần thứ hai', 'Tuần thứ ba', 'Tuần thứ tư', 'Tuần thứ năm'];
    
    //     return attendanceRecords.map((record, index) => ({
    //       week: `${weekNames[index]} (${record.startDate.toLocaleDateString()} - ${record.endDate.toLocaleDateString()})`,
    //       count: record.count
    //     }));
    //   },
      
      //Chạy khi deloy
      async getAttendanceStatistics() {
        const now = new Date();
        const fiveWeeksAgo = new Date(now);
        fiveWeeksAgo.setDate(now.getDate() - 35);
    
        const attendanceRecords = await Attendance.aggregate([
          {
            $match: {
              'attendanceRecords.date': { $gte: fiveWeeksAgo, $lte: now }
            }
          },
          {
            $unwind: '$attendanceRecords'
          },
          {
            $match: {
              'attendanceRecords.date': { $gte: fiveWeeksAgo, $lte: now }
            }
          },
          {
            $group: {
              _id: {
                week: { $isoWeek: '$attendanceRecords.date' },
                year: { $isoWeekYear: '$attendanceRecords.date' }
              },
              count: {
                $sum: {
                  $cond: [{ $ne: ['$attendanceRecords.time', null] }, 1, 0]
                }
              },
              startDate: { $min: '$attendanceRecords.date' },
              endDate: { $max: '$attendanceRecords.date' }
            }
          },
          {
            $sort: { '_id.year': -1, '_id.week': -1 }
          },
          {
            $limit: 5
          }
        ]);
    
        const weekNames = ['Tuần thứ nhất', 'Tuần thứ hai', 'Tuần thứ ba', 'Tuần thứ tư', 'Tuần thứ năm'];
    
        return attendanceRecords.map((record, index) => ({
          week: `${weekNames[index]} (${record.startDate.toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })} - ${record.endDate.toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })})`,
          count: record.count
        }));
      },




    //Chạy khi deloy
    async getFaceIDAttendanceStatistics() {
        const now = new Date();
        const fiveWeeksAgo = new Date(now);
        fiveWeeksAgo.setDate(now.getDate() - 35);
    
        const attendanceRecords = await Attendance.aggregate([
          {
            $match: {
              'attendanceRecords.date': { $gte: fiveWeeksAgo, $lte: now }
            }
          },
          {
            $unwind: '$attendanceRecords'
          },
          {
            $match: {
              'attendanceRecords.date': { $gte: fiveWeeksAgo, $lte: now },
              'attendanceRecords.status': 'Có mặt'
            }
          },
          {
            $group: {
              _id: {
                week: { $isoWeek: '$attendanceRecords.date' },
                year: { $isoWeekYear: '$attendanceRecords.date' }
              },
              count: {
                $sum: {
                  $cond: [{ $ne: ['$attendanceRecords.time', null] }, 1, 0]
                }
              },
              startDate: { $min: '$attendanceRecords.date' },
              endDate: { $max: '$attendanceRecords.date' }
            }
          },
          {
            $sort: { '_id.year': -1, '_id.week': -1 }
          },
          {
            $limit: 5
          }
        ]);
    
        const weekNames = ['Tuần thứ nhất', 'Tuần thứ hai', 'Tuần thứ ba', 'Tuần thứ tư', 'Tuần thứ năm'];
        const result = [];
    
        for (let i = 0; i < 5; i++) {
          const record = attendanceRecords[i];
          if (record) {
            result.push({
              week: `${weekNames[i]} (${record.startDate.toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })} - ${record.endDate.toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })})`,
              count: record.count
            });
          } else {
            const startDate = new Date(now);
            startDate.setDate(now.getDate() - (i + 1) * 7);
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 6);
            result.push({
              week: `${weekNames[i]} (${startDate.toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })} - ${endDate.toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })})`,
              count: 0
            });
          }
        }
    
        return result;
      },

      async getCurrentTermStudentCount() {
        // Lấy tất cả các học kỳ
        const terms = await Term.find();

    const results = [];

    for (const term of terms) {
      // Tìm tất cả các subjectTermID liên quan đến học kỳ hiện tại
      const subjectTerms = await SubjectTerm.find({ termID: term._id });

      const subjectTermIDs = subjectTerms.map(subjectTerm => subjectTerm._id);

      // Tìm tất cả các classsectionID liên quan đến các subjectTermID
      const classSections = await Classsection.find({ subjecttermID: { $in: subjectTermIDs } });

      const classSectionIDs = classSections.map(classSection => classSection._id);

      const studentAttendance = await Attendance.aggregate([
        {
          $unwind: '$attendanceRecords'
        },
        {
          $match: {
            'attendanceRecords.time': { $ne: null }
          }
        },
        {
          $lookup: {
            from: 'studentclasses',
            localField: 'studentclasssection',
            foreignField: '_id',
            as: 'studentClass'
          }
        },
        {
          $unwind: '$studentClass'
        },
        {
          $match: {
            'studentClass.classsectionID': { $in: classSectionIDs }
          }
        },
        {
          $group: {
            _id: '$studentClass.studentID',
            attendanceCount: { $sum: 1 }
          }
        },
        {
          $match: {
            attendanceCount: { $gt: 0 }
          }
        }
      ]);

      const studentIDs = studentAttendance.map(record => record._id);
      const totalStudentCount = studentIDs.length;

      results.push({
        termID: term._id,
        totalStudentCount: totalStudentCount,
        // studentIDs: studentIDs
      });
    }

    return results;
  },

  //ver0.1
//   async getAllSuccessAttendanceFaceIDStudentCount() {
//     // Lấy tất cả các học kỳ
//     const terms = await Term.find();

//     const results = [];

//     for (const term of terms) {
//       // Tìm tất cả các subjectTermID liên quan đến học kỳ hiện tại
//       const subjectTerms = await SubjectTerm.find({ termID: term._id });

//       const subjectTermIDs = subjectTerms.map(subjectTerm => subjectTerm._id);

//       // Tìm tất cả các classsectionID liên quan đến các subjectTermID
//       const classSections = await Classsection.find({ subjecttermID: { $in: subjectTermIDs } });

//       const classSectionIDs = classSections.map(classSection => classSection._id);

//       const studentAttendance = await Attendance.aggregate([
//         {
//           $unwind: '$attendanceRecords'
//         },
//         {
//           $match: {
//             'attendanceRecords.time': { $ne: null },
//             'attendanceRecords.status': 'Có mặt'
//           }
//         },
//         {
//           $lookup: {
//             from: 'studentclasses',
//             localField: 'studentclasssection',
//             foreignField: '_id',
//             as: 'studentClass'
//           }
//         },
//         {
//           $unwind: '$studentClass'
//         },
//         {
//           $match: {
//             'studentClass.classsectionID': { $in: classSectionIDs }
//           }
//         },
//         {
//           $group: {
//             _id: '$studentClass.studentID',
//             attendanceCount: { $sum: 1 }
//           }
//         },
//         {
//           $match: {
//             attendanceCount: { $gt: 0 }
//           }
//         }
//       ]);

//       const studentIDs = studentAttendance.map(record => record._id);
//       const totalStudentCount = studentIDs.length;

//       results.push({
//         termID: term._id,
//         totalStudentCount: totalStudentCount,
//         // studentIDs: studentIDs
//       });
//     }

//     return results;
//   },
  //ver0.2
  async getAllSuccessAttendanceFaceIDStudentCount() {
    const terms = await Term.find();
    const results = [];

    for (const term of terms) {
        const subjectTerms = await SubjectTerm.find({ termID: term._id });
        const subjectTermIDs = subjectTerms.map(subjectTerm => subjectTerm._id);
        const classSections = await Classsection.find({ subjecttermID: { $in: subjectTermIDs } });
        const classSectionIDs = classSections.map(classSection => classSection._id);

        const studentAttendance = await Attendance.aggregate([
            { $unwind: '$attendanceRecords' },
            { $match: { 'attendanceRecords.status': 'Có mặt' } },
            { 
                $lookup: { 
                    from: 'studentclasses', 
                    localField: 'studentclasssection', 
                    foreignField: '_id', 
                    as: 'studentClass' 
                } 
            },
            { $unwind: '$studentClass' },
            { $match: { 'studentClass.classsectionID': { $in: classSectionIDs } } },
            { 
                $group: { 
                    _id: '$studentClass.studentID', 
                    attendanceCount: { $sum: 1 } // Đếm số lần "Có mặt" của mỗi sinh viên
                } 
            }
        ]);

        const totalAttendanceCount = studentAttendance.reduce((acc, student) => acc + student.attendanceCount, 0);

        results.push({
            termID: term._id,
            totalAttendanceCount: totalAttendanceCount,
            studentAttendanceDetails: studentAttendance // Danh sách số lần có mặt của từng sinh viên
        });
    }

    return results;
},

  async getTopAbsentClasses() {
    try {
      const classSections = await classsection.aggregate([
        {
          $lookup: {
            from: 'subjectterms',
            localField: 'subjecttermID',
            foreignField: '_id',
            as: 'subjectterm'
          }
        },
        { $unwind: '$subjectterm' },
        {
          $lookup: {
            from: 'subjects',
            localField: 'subjectterm.subjectID',
            foreignField: '_id',
            as: 'subject'
          }
        },
        { $unwind: '$subject' },
        {
          $lookup: {
            from: 'teachingassignments',
            localField: '_id',
            foreignField: 'classsectionID',
            as: 'teachingAssignments'
          }
        },
        { $unwind: '$teachingAssignments' },
        {
          $lookup: {
            from: 'users',
            localField: 'teachingAssignments.teacherID',
            foreignField: '_id',
            as: 'teacher'
          }
        },
        { $unwind: '$teacher' },
        {
          $lookup: {
            from: 'studentclasses',
            localField: '_id',
            foreignField: 'classsectionID',
            as: 'studentClasses'
          }
        },
        {
          $lookup: {
            from: 'attendances',
            localField: 'studentClasses._id',
            foreignField: 'studentclasssection',
            as: 'attendances'
          }
        },
        {
          $addFields: {
            totalClasses: {
              $sum: {
                $map: {
                  input: {
                    $filter: {
                      input: '$attendances',
                      as: 'attendance',
                      cond: { $eq: ['$$attendance.studentclasssection', { $arrayElemAt: ['$studentClasses._id', 0] }] }
                    }
                  },
                  as: 'attendance',
                  in: { $size: '$$attendance.attendanceRecords' }
                }
              }
            }
          }
        },
        {
          $unwind: '$attendances'
        },
        {
          $unwind: '$attendances.attendanceRecords'
        },
        {
          $group: {
            _id: '$_id',
            classCode: { $first: '$classCode' },
            subjectName: { $first: '$subject.subjectName' },
            teacherName: { $first: '$teacher.fullName' },
            termID: { $first: '$subjectterm.termID' },
            totalClasses: { $first: '$totalClasses' },
            totalAbsences: {
              $sum: {
                $cond: [{ $eq: ['$attendances.attendanceRecords.time', null] }, 1, 0]
              }
            }
          }
        }
      ]);

      const totalStudentsPerClass = await studentClass.aggregate([
        {
          $group: {
            _id: '$classsectionID',
            totalStudents: { $sum: 1 }
          }
        }
      ]);

      const totalStudentsMap = new Map();
      totalStudentsPerClass.forEach(item => {
        totalStudentsMap.set(item._id.toString(), item.totalStudents);
      });

      return classSections.map(cls => ({
        classCode: cls.classCode,
        subjectName: cls.subjectName,
        teacherName: cls.teacherName,
        termID: cls.termID,
        totalClasses: cls.totalClasses,
        totalAbsences: cls.totalAbsences,
        totalStudents: totalStudentsMap.get(cls._id.toString()) || 0
      }));
    } catch (error) {
      console.error('Error fetching top absent classes:', error);
      throw error;
    }
  },
  async increaseLoginCount() {
    try {
        const record = await CountLoginFaceID.findOne();
        
        if (record) {
            record.totalLoginFaceID += 1;
            await record.save();
        } else {
            const newRecord = new CountLoginFaceID({
                _id: new mongoose.Types.ObjectId(),
                totalLoginFaceID: 1
            });
            await newRecord.save();
        }
        return { success: true, message: 'Login count updated successfully' };
    } catch (error) {
        console.error('Error updating login count:', error);
        return { success: false, message: 'Error updating login count' };
    }
},
async getTotalLoginFaceID() {
    try {
        const record = await CountLoginFaceID.findOne();
        return { success: true, totalLoginFaceID: record ? record.totalLoginFaceID : 0 };
    } catch (error) {
        console.error('Error fetching total login FaceID count:', error);
        return { success: false, message: 'Internal Server Error' };
    }
}



};

module.exports = StatisticDAO;