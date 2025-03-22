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

    // async getAllClassSectionsAndTotalDates() {
    //     try {
    //         const classSections = await Classsection.aggregate([
    //             {
    //                 $lookup: {
    //                     from: 'subjectterms',
    //                     localField: 'subjecttermID',
    //                     foreignField: '_id',
    //                     as: 'subjectterm'
    //                 }
    //             },
    //             { $unwind: '$subjectterm' },
    //             {
    //                 $lookup: {
    //                     from: 'subjects',
    //                     localField: 'subjectterm.subjectID',
    //                     foreignField: '_id',
    //                     as: 'subject'
    //                 }
    //             },
    //             { $unwind: '$subject' },
    //             {
    //                 $lookup: {
    //                     from: 'terms',
    //                     localField: 'subjectterm.termID',
    //                     foreignField: '_id',
    //                     as: 'term'
    //                 }
    //             },
    //             { $unwind: '$term' },
    //             {
    //                 $lookup: {
    //                     from: 'studentclasses',
    //                     localField: '_id',
    //                     foreignField: 'classsectionID',
    //                     as: 'studentClasses'
    //                 }
    //             },
    //             {
    //                 $lookup: {
    //                     from: 'attendances',
    //                     localField: 'studentClasses._id',
    //                     foreignField: 'studentclasssection',
    //                     as: 'attendances'
    //                 }
    //             },
    //             {
    //                 $addFields: {
    //                     totalStudents: { $size: '$studentClasses' },
    //                     totalNullTimes: {
    //                         $sum: {
    //                             $map: {
    //                                 input: '$attendances',
    //                                 as: 'attendance',
    //                                 in: {
    //                                     $size: {
    //                                         $filter: {
    //                                             input: '$$attendance.attendanceRecords',
    //                                             as: 'record',
    //                                             cond: { $eq: ['$$record.time', null] }
    //                                         }
    //                                     }
    //                                 }
    //                             }
    //                         }
    //                     },
    //                     totalDaysWithExcusedAbsence: {
    //                         $sum: {
    //                             $map: {
    //                                 input: '$attendances',
    //                                 as: 'attendance',
    //                                 in: {
    //                                     $size: {
    //                                         $filter: {
    //                                             input: '$$attendance.attendanceRecords',
    //                                             as: 'record',
    //                                             cond: { $eq: ['$$record.status', 'Vắng có phép'] }
    //                                         }
    //                                     }
    //                                 }
    //                             }
    //                         }
    //                     },
    //                     totalDays: {
    //                         $sum: {
    //                             $map: {
    //                                 input: {
    //                                     $filter: {
    //                                         input: '$attendances',
    //                                         as: 'attendance',
    //                                         cond: { $eq: ['$$attendance.studentclasssection', { $arrayElemAt: ['$studentClasses._id', 0] }] }
    //                                     }
    //                                 },
    //                                 as: 'attendance',
    //                                 in: { $size: '$$attendance.attendanceRecords' }
    //                             }
    //                         }
    //                     },
    //                     totalNonNullTimes: {
    //                         $sum: {
    //                             $map: {
    //                                 input: '$attendances',
    //                                 as: 'attendance',
    //                                 in: {
    //                                     $size: {
    //                                         $filter: {
    //                                             input: '$$attendance.attendanceRecords',
    //                                             as: 'record',
    //                                             cond: { $ne: ['$$record.time', null] }
    //                                         }
    //                                     }
    //                                 }
    //                             }
    //                         }
    //                     }
    //                 }
    //             },
    //             {
    //                 $project: {
    //                     _id: 1,
    //                     classCode: 1,
    //                     classType: 1,
    //                     schoolDay: 1,
    //                     lesson: 1,
    //                     subjecttermID: '$subjectterm._id',
    //                     subjectID: '$subject._id',
    //                     subjectName: '$subject.subjectName',
    //                     termID: '$term._id',
    //                     totalDaysWithExcusedAbsence: 1,
    //                     totalNullTimes: 1,
    //                     totalStudents: 1,
    //                     totalDays: 1, // Thêm tổng số ngày học
    //                     totalNonNullTimes: 1 // Thêm tổng thời gian không null
    //                 }
    //             }
    //         ]);

    //         return classSections;
    //     } catch (error) {
    //         console.error('Error fetching all class sections and total dates:', error);
    //         throw error;
    //     }
    // },
    // async exportTKAverageParticipationExcel(filePath) {
    //     try {
    //       const classSections = await this.getAllClassSectionsAndTotalDates();
    
    //       const workbook = new ExcelJS.Workbook();
    //       const worksheet = workbook.addWorksheet('AverageParticipation');
    
    //       // Add the column headers
    //       const columnHeaders = [
    //         'Mã lớp học phần', 'Tên lớp học phần', 'Số lượng sinh viên tham gia trung bình', 'Tổng số sinh viên'
    //         // 'Total Days With Excused Absence', 
    //         // 'Total Null Times', 'Total Students', 'Total Days', 'Total Non-Null Times'
    //       ];
    //       const headerRow = worksheet.addRow(columnHeaders);
    //       headerRow.eachCell((cell) => {
    //         cell.font = { bold: true }; // Make the column headers bold
    //       });
    
    //       // Add the class section data
    //       classSections.forEach(classSection => {
    //         const nullTimesPerStudent = (classSection.totalStudents === 0 || classSection.totalNullTimes === 0) 
    //       ? 'Chưa có dữ liệu' 
    //       : (classSection.totalNonNullTimes / classSection.totalStudents).toFixed(2);
    //         worksheet.addRow([
    //           classSection.classCode,
    //           classSection.subjectName,
    //           nullTimesPerStudent,
    //         //   classSection.totalDaysWithExcusedAbsence,
    //         //   classSection.totalNullTimes,
    //           classSection.totalStudents,
    //         //   classSection.totalDays,
    //         //   classSection.totalNonNullTimes
    //         ]);
    //       });
    //       const buffer = await workbook.xlsx.writeBuffer();
    //       return buffer;
    //     } catch (error) {
    //       console.error('Error exporting class sections to Excel:', error);
    //       throw error;
    //     }
    //   },


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
                    $project: {
                        _id: 1,
                        classCode: 1,
                        classType: 1,
                        schoolDay: 1,
                        lesson: 1,
                        subjecttermID: '$subjectterm._id',
                        subjectID: '$subject._id',
                        subjectName: '$subject.subjectName',
                        termID: '$term._id',
                        totalDays: 1,
                        students: {
                            $map: {
                                input: '$students',
                                as: 'student',
                                in: {
                                    email: { $ifNull: ['$$student.email', null] },
                                    usercode: { $ifNull: ['$$student.userCode', null] },
                                    fullName: { $ifNull: ['$$student.fullName', null] },
                                    totalNullTimes: {
                                        $sum: {
                                            $map: {
                                                input: {
                                                    $filter: {
                                                        input: '$attendances',
                                                        as: 'attendance',
                                                        cond: { $eq: ['$$attendance.studentclasssection', { $arrayElemAt: ['$studentClasses._id', { $indexOfArray: ['$studentClasses.studentID', '$$student._id'] }] }] }
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
                                    },
                                }
                            }
                        }
                    }
                }
            ]);

            return classSections;
        } catch (error) {
            console.error('Error fetching class sections and total dates by teacherID:', error);
            throw error;
        }
    },

    
    async exportTKClassSectionsToExcel(teacherID) {
        try {
            const classSections = await this.getClassSectionsAndTotalDatesByTeacherID(teacherID);
    
            const workbook = new ExcelJS.Workbook();
    
            classSections.forEach((classSection) => {
                const worksheet = workbook.addWorksheet(classSection.classCode);
    
                // Add the merged header row
                worksheet.mergeCells('A1', 'E1');
                const headerCell = worksheet.getCell('A1');
                headerCell.value = `${classSection.classCode} - ${classSection.subjectName}`;
                headerCell.alignment = { horizontal: 'center' };
                headerCell.font = { bold: true }; // Make the header bold
    
                // Add the column headers
                const columnHeaders = ['STT', 'Email', 'Mã số SV', 'Họ tên', 'Tổng số buổi vắng'];
                const headerRow = worksheet.addRow(columnHeaders);
                headerRow.eachCell((cell) => {
                    cell.font = { bold: true }; // Make the column headers bold
                });
    
                // Add the student data with index
                classSection.students.forEach((student, index) => {
                    worksheet.addRow([
                        index + 1, // STT
                        student.email,
                        student.usercode,
                        student.fullName,
                        student.totalNullTimes
                    ]);
                });
            });
    
            const buffer = await workbook.xlsx.writeBuffer();
            return buffer;
        } catch (error) {
            console.error('Error exporting class sections to Excel:', error);
            throw error;
        }
    },

      async getClassSectionsAndTotalDates() {
        try {
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
                        }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        classCode: 1,
                        classType: 1,
                        schoolDay: 1,
                        lesson: 1,
                        subjecttermID: '$subjectterm._id',
                        subjectID: '$subject._id',
                        subjectName: '$subject.subjectName',
                        termID: '$term._id',
                        totalDays: 1,
                        students: {
                            $map: {
                                input: '$students',
                                as: 'student',
                                in: {
                                    email: { $ifNull: ['$$student.email', null] },
                                    usercode: { $ifNull: ['$$student.userCode', null] },
                                    fullName: { $ifNull: ['$$student.fullName', null] },
                                    totalNullTimes: {
                                        $sum: {
                                            $map: {
                                                input: {
                                                    $filter: {
                                                        input: '$attendances',
                                                        as: 'attendance',
                                                        cond: { $eq: ['$$attendance.studentclasssection', { $arrayElemAt: ['$studentClasses._id', { $indexOfArray: ['$studentClasses.studentID', '$$student._id'] }] }] }
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
                                    },
                                }
                            }
                        }
                    }
                }
            ]);
    
            return classSections;
        } catch (error) {
            console.error('Error fetching class sections and total dates:', error);
            throw error;
        }
    },
    async exportTKClassSectionsToExcelWithoutTeacherID() {
        try {
            const classSections = await this.getClassSectionsAndTotalDates();
    
            const workbook = new ExcelJS.Workbook();
    
            classSections.forEach((classSection) => {
                const worksheet = workbook.addWorksheet(classSection.classCode);
    
                // Add the merged header row
                worksheet.mergeCells('A1', 'E1');
                const headerCell = worksheet.getCell('A1');
                headerCell.value = `${classSection.classCode} - ${classSection.subjectName}`;
                headerCell.alignment = { horizontal: 'center' };
                headerCell.font = { bold: true }; // Make the header bold
    
                // Add the column headers
                const columnHeaders = ['STT', 'Email', 'Mã số SV', 'Họ tên', 'Tổng số buổi vắng'];
                const headerRow = worksheet.addRow(columnHeaders);
                headerRow.eachCell((cell) => {
                    cell.font = { bold: true }; // Make the column headers bold
                });
    
                // Add the student data with index
                classSection.students.forEach((student, index) => {
                    worksheet.addRow([
                        index + 1, // STT
                        student.email,
                        student.usercode,
                        student.fullName,
                        student.totalNullTimes
                    ]);
                });
            });
    
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
    async exportClassSectionsAndDatesWithNonNullTimesToExcel(teacherID) {
        try {
            const classSections = await this.getClassSectionsAndDatesWithNonNullTimesByTeacherID(teacherID);
    
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('ClassSections');
    
            // Add the column headers
            const columnHeaders = [
                'STT', 'Mã lớp học phần', 'Tên lớp học phần', 
                ...Array.from({ length: 15 }, (_, i) => `Buổi ${i + 1}`), 
                'Tổng số sinh viên'
            ];
            const headerRow = worksheet.addRow(columnHeaders);
            headerRow.eachCell((cell) => {
                cell.font = { bold: true }; // Make the column headers bold
            });
    
            // Add the class section data
            classSections.forEach((classSection, index) => {
                const rowData = [
                    index + 1, // STT
                    classSection.classCode,
                    classSection.subjectName,
                    ...Array.from({ length: 15 }, (_, i) => {
                        const sessionDate = new Date(classSection.datesWithNonNullTimes[0].date);
                        sessionDate.setDate(sessionDate.getDate() + i);
                        const dateWithNonNullTimes = classSection.datesWithNonNullTimes.find(d => new Date(d.date).getTime() === sessionDate.getTime());
                        return dateWithNonNullTimes ? dateWithNonNullTimes.nonNullTimesCount : '';
                    }),
                    classSection.totalStudents
                ];
                worksheet.addRow(rowData);
            });
    
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
    async exportAllClassSectionsAndDatesWithNonNullTimesToExcel() {
        try {
            const classSections = await this.getAllClassSectionsAndDatesWithNonNullTimes();
    
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('ClassSections');
    
            // Add the column headers
            const columnHeaders = [
                'Mã lớp học phần', 'Tên lớp học phần', 'Tổng số sinh viên', 'Số lượng SV tham gia trung bình'
            ];
            const headerRow = worksheet.addRow(columnHeaders);
            headerRow.eachCell((cell) => {
                cell.font = { bold: true }; // Make the column headers bold
            });
    
            // Add the class section data
            classSections.forEach((classSection) => {
                const totalNonNullTimesCount = classSection.datesWithNonNullTimes.reduce((sum, record) => sum + record.nonNullTimesCount, 0);
                const averageNonNullTimesCount = classSection.datesWithNonNullTimes.length > 0 ? (totalNonNullTimesCount / classSection.datesWithNonNullTimes.length).toFixed(2) : 'Chưa có dữ liệu';
    
                const rowData = [
                    classSection.classCode,
                    classSection.subjectName,
                    classSection.totalStudents,
                    averageNonNullTimesCount
                ];
                worksheet.addRow(rowData);
            });
    
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

  async getAllSuccessAttendanceFaceIDStudentCount() {
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
            'attendanceRecords.time': { $ne: null },
            'attendanceRecords.status': 'Có mặt'
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
  }

};

module.exports = StatisticDAO;