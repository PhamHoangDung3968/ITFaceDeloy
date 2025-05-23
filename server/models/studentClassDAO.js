const mongoose = require('mongoose');
const teachingAssignment = require('./teachingAssignment'); // Import the teachingAssignment model
const studentClass = require('./studentClass');
const Users = require('./User'); // Import the Users model
const Classsection = require('./Classsection'); // Import mô hình Classsection
const { populate } = require('./Role');
const Attendance = require('./Attendance');
const XLSX = require('xlsx');
const ExcelJS = require('exceljs'); // Import the exceljs library
const { Readable } = require('stream');
const path = require('path'); // Import thư viện path
const NoticeWarning = require('./NoticeWarning'); // Import mô hình NoticeWarning





const { v4: uuidv4 } = require('uuid');



const studentClassDAO = {
//   async selectAll() {
//     try {
//       const teachingAssignments = await teachingAssignment.find().exec();
//       return teachingAssignments;
//     } catch (error) {
//       console.error('Error fetching teaching Assignments:', error);
//       throw error;
//     }
//   },
  async insert(studentclass) {
    try {
        studentclass._id = new mongoose.Types.ObjectId();
      const result = await studentClass.create(studentclass);
      return result;
    } catch (error) {
      console.error('Error inserting student class:', error);
      throw error;
    }
  },
  // async selectByClassCode(classCode) {
  //   try {
  //     const mongoose = require('mongoose');
  //     const classSection = await Classsection.aggregate([
  //       { $match: { classCode: classCode } },
  //       {
  //         $lookup: {
  //           from: 'subjectterms',
  //           localField: 'subjecttermID',
  //           foreignField: '_id',
  //           as: 'subjectTerm'
  //         }
  //       },
  //       { $unwind: '$subjectTerm' },
  //       {
  //         $lookup: {
  //           from: 'subjects',
  //           localField: 'subjectTerm.subjectID',
  //           foreignField: '_id',
  //           as: 'subject'
  //         }
  //       },
  //       { $unwind: '$subject' },
  //       {
  //         $lookup: {
  //           from: 'majors',
  //           localField: 'subject.major',
  //           foreignField: '_id',
  //           as: 'major'
  //         }
  //       },
  //       { $unwind: '$major' },
  //       {
  //         $lookup: {
  //           from: 'terms',
  //           localField: 'subjectTerm.termID',
  //           foreignField: '_id',
  //           as: 'term'
  //         }
  //       },
  //       { $unwind: '$term' },
  //       {
  //         $project: {
  //           _id: 0,
  //           classCode: 1,
  //           classType: 1,
  //           schoolDay: 1,
  //           lesson: 1,
  //           subjectName: '$subject.subjectName',
  //           credit: '$subject.credit',
  //           majorName: '$major.majorName',
  //           term: '$term.term',
  //         }
  //       }
  //     ]).exec();
  //     return classSection[0];
  //   } catch (error) {
  //     console.error('Error fetching class section by classCode:', error);
  //     throw error;
  //   }
  // },



  async selectByClassCode(classCode) {
    try {
      const mongoose = require('mongoose');
      const classSection = await Classsection.aggregate([
        { $match: { classCode: classCode } },
        {
          $lookup: {
            from: 'subjectterms',
            localField: 'subjecttermID',
            foreignField: '_id',
            as: 'subjectTerm'
          }
        },
        { $unwind: '$subjectTerm' },
        {
          $lookup: {
            from: 'subjects',
            localField: 'subjectTerm.subjectID',
            foreignField: '_id',
            as: 'subject'
          }
        },
        { $unwind: '$subject' },
        {
          $lookup: {
            from: 'majors',
            localField: 'subject.major',
            foreignField: '_id',
            as: 'major'
          }
        },
        { $unwind: '$major' },
        {
          $lookup: {
            from: 'terms',
            localField: 'subjectTerm.termID',
            foreignField: '_id',
            as: 'term'
          }
        },
        { $unwind: '$term' },
        {
          $lookup: {
            from: 'teachingassignments',
            localField: '_id',
            foreignField: 'classsectionID',
            as: 'teachingAssignment'
          }
        },
        { $unwind: '$teachingAssignment' },
        {
          $lookup: {
            from: 'users',
            localField: 'teachingAssignment.teacherID',
            foreignField: '_id',
            as: 'teacher'
          }
        },
        { $unwind: '$teacher' },
        {
          $lookup: {
            from: 'roles',
            localField: 'teacher.role',
            foreignField: '_id',
            as: 'role'
          }
        },
        { $unwind: '$role' },
        { $match: { 'role.tenrole': 'Giảng viên' } },
        {
          $project: {
            _id: 0,
            classCode: 1,
            classType: 1,
            schoolDay: 1,
            lesson: 1,
            subjectName: '$subject.subjectName',
            credit: '$subject.credit',
            majorName: '$major.majorName',
            term: '$term.term',
            teacherName: '$teacher.fullName',
            teacherEmail: '$teacher.email'
          }
        }
      ]).exec();
      return classSection[0];
    } catch (error) {
      console.error('Error fetching class section by classCode:', error);
      throw error;
    }
  },
  async getUsersByClassCode(classCode) {
    try {
      const mongoose = require('mongoose');
      const users = await studentClass.aggregate([
        {
          $lookup: {
            from: 'classsections',
            localField: 'classsectionID',
            foreignField: '_id',
            as: 'classSection'
          }
        },
        { $unwind: '$classSection' },
        { $match: { 'classSection.classCode': classCode } },
        {
          $lookup: {
            from: 'users',
            localField: 'studentID',
            foreignField: '_id',
            as: 'user'
          }
        },
        { $unwind: '$user' },
        {
          $lookup: {
            from: 'roles',
            localField: 'user.role',
            foreignField: '_id',
            as: 'role'
          }
        },
        { $unwind: '$role' },
        { $match: { 'role.tenrole': 'Sinh viên' } },
        {
          $project: {
            _id: '$user._id',
            displayName: '$user.displayName',
            email: '$user.email',
            phone: '$user.phone',
            fullName: '$user.fullName',
            userCode: '$user.userCode'
          }
        }
      ]).exec();
      return users;
    } catch (error) {
      console.error('Error fetching users by classCode:', error);
      throw error;
    }
  },
  async getUsersByClassCodeAndStudentID(classCode, studentID) {
    try {
      const mongoose = require('mongoose');
      const users = await studentClass.aggregate([
        {
          $lookup: {
            from: 'classsections',
            localField: 'classsectionID',
            foreignField: '_id',
            as: 'classSection'
          }
        },
        { $unwind: '$classSection' },
        { $match: { 'classSection.classCode': classCode } },
        {
          $lookup: {
            from: 'users',
            localField: 'studentID',
            foreignField: '_id',
            as: 'user'
          }
        },
        { $unwind: '$user' },
        {
          $lookup: {
            from: 'roles',
            localField: 'user.role',
            foreignField: '_id',
            as: 'role'
          }
        },
        { $unwind: '$role' },
        { $match: { 'role.tenrole': 'Sinh viên' } },
        { $match: { 'user._id': new mongoose.Types.ObjectId(studentID) } }, // Thêm điều kiện lọc theo studentID
        {
          $project: {
            _id: '$user._id',
            displayName: '$user.displayName',
            email: '$user.email',
            phone: '$user.phone',
            fullName: '$user.fullName',
            userCode: '$user.userCode'
          }
        }
      ]).exec();
      return users;
    } catch (error) {
      console.error('Error fetching users by classCode and studentID:', error);
      throw error;
    }
  },
  async getAttendanceDatesByClassCode(classCode) {
    try {
      // Tìm classSection dựa trên classCode
      const classSection = await Classsection.findOne({ classCode });
      if (!classSection) {
        throw new Error('Class section not found');
      }
  
      // Tìm tất cả các bản ghi studentClass có classsectionID trùng
      const studentClasses = await studentClass.find({ classsectionID: classSection._id });
  
      // Tạo một tập hợp để lưu trữ các ngày điểm danh duy nhất
      const attendanceDatesSet = new Set();
  
      // Lấy các ngày điểm danh từ các bản ghi Attendance
      for (const studentClassEntry of studentClasses) {
        const attendance = await Attendance.findOne({ studentclasssection: studentClassEntry._id });
        if (attendance) {
          for (const record of attendance.attendanceRecords) {
            attendanceDatesSet.add(record.date.toISOString());
          }
        }
      }
  
      // Chuyển đổi tập hợp thành mảng và sắp xếp các ngày
      const attendanceDates = Array.from(attendanceDatesSet).map(dateStr => new Date(dateStr)).sort((a, b) => a - b);
  
      return attendanceDates;
    } catch (error) {
      console.error('Error fetching attendance dates by classCode:', error);
      throw error;
    }
  },

  async getAttendanceDatesByClassCodeAndStudentID(classCode, studentID) {
    try {
      // Tìm classSection dựa trên classCode
      const classSection = await Classsection.findOne({ classCode });
      if (!classSection) {
        throw new Error('Class section not found');
      }
  
      // Tìm tất cả các bản ghi studentClass có classsectionID trùng và studentID trùng
      const studentClasses = await studentClass.find({ classsectionID: classSection._id, studentID: studentID });
  
      // Tạo một tập hợp để lưu trữ các ngày điểm danh duy nhất
      const attendanceDatesSet = new Set();
  
      // Lấy các ngày điểm danh từ các bản ghi Attendance
      for (const studentClassEntry of studentClasses) {
        const attendance = await Attendance.findOne({ studentclasssection: studentClassEntry._id });
        if (attendance) {
          for (const record of attendance.attendanceRecords) {
            attendanceDatesSet.add(record.date.toISOString());
          }
        }
      }
  
      // Chuyển đổi tập hợp thành mảng và sắp xếp các ngày
      const attendanceDates = Array.from(attendanceDatesSet).map(dateStr => new Date(dateStr)).sort((a, b) => a - b);
  
      return attendanceDates;
    } catch (error) {
      console.error('Error fetching attendance dates by classCode and studentID:', error);
      throw error;
    }
  },




  // async getAttendanceDetailsByClassCode(classCode) {
  //   try {
  //     // Tìm classSection dựa trên classCode
  //     const classSection = await Classsection.findOne({ classCode });
  //     if (!classSection) {
  //       throw new Error('Class section not found');
  //     }
  
  //     // Tìm tất cả các bản ghi studentClass có classsectionID trùng
  //     const studentClasses = await studentClass.find({ classsectionID: classSection._id });
  
  //     // Tạo một mảng để lưu trữ thông tin điểm danh
  //     const attendanceDetails = [];
  
  //     // Lấy thông tin time và status từ các bản ghi Attendance
  //     for (const studentClassEntry of studentClasses) {
  //       const attendance = await Attendance.findOne({ studentclasssection: studentClassEntry._id });
  //       if (attendance) {
  //         for (const record of attendance.attendanceRecords) {
  //           attendanceDetails.push({
  //             studentID: studentClassEntry.studentID,
  //             date: record.date,
  //             time: record.time,
  //             status: record.status
  //           });
  //         }
  //       }
  //     }
  
  //     return attendanceDetails;
  //   } catch (error) {
  //     console.error('Error fetching attendance details by classCode:', error);
  //     throw error;
  //   }
  // },
  // async countNonNullTimesByClassCode(classCode) {
  //   try {
  //     const attendanceDetails = await this.getAttendanceDetailsByClassCode(classCode);
  //     return this.countNonNullTimes(attendanceDetails);
  //   } catch (error) {
  //     console.error('Error counting non-null times by classCode:', error);
  //     throw error;
  //   }
  // },
  // countNonNullTimes(attendanceDetails) {
  //   const studentIDs = [...new Set(attendanceDetails.map(detail => detail.studentID))];
  //   const timeCount = studentIDs.reduce((acc, studentID) => {
  //     acc[studentID] = 0;
  //     return acc;
  //   }, {});
  //   attendanceDetails.forEach(detail => {
  //     if (detail.time !== null) {
  //       timeCount[detail.studentID]++;
  //     }
  //   });
  //   return timeCount;
  // },

  // async countStatusByClassCode(classCode, status) {
  //   try {
  //     const attendanceDetails = await this.getAttendanceDetailsByClassCode(classCode);
  //     return this.countStatus(attendanceDetails, status);
  //   } catch (error) {
  //     console.error(`Error counting status "${status}" by classCode:`, error);
  //     throw error;
  //   }
  // },
  // countStatus(attendanceDetails, status) {
  //   const studentIDs = [...new Set(attendanceDetails.map(detail => detail.studentID))];
  //   const statusCount = studentIDs.reduce((acc, studentID) => {
  //     acc[studentID] = 0;
  //     return acc;
  //   }, {});
  //   attendanceDetails.forEach(detail => {
  //     if (detail.status === status) {
  //       statusCount[detail.studentID]++;
  //     }
  //   });
  //   return statusCount;
  // },
  async getAttendanceDetailsByClassCode(classCode) {
    try {
      // Tìm classSection dựa trên classCode
      const classSection = await Classsection.findOne({ classCode });
      if (!classSection) {
        throw new Error('Class section not found');
      }

      // Tìm tất cả các bản ghi studentClass có classsectionID trùng
      const studentClasses = await studentClass.find({ classsectionID: classSection._id });

      // Tạo một mảng để lưu trữ thông tin điểm danh
      const attendanceDetails = [];

      // Lấy thông tin time và status từ các bản ghi Attendance
      for (const studentClassEntry of studentClasses) {
        const attendance = await Attendance.findOne({ studentclasssection: studentClassEntry._id }, 'studentclasssection attendanceRecords');
        if (attendance) {
          for (const record of attendance.attendanceRecords) {
            attendanceDetails.push({
              studentID: studentClassEntry.studentID,
              date: record.date,
              time: record.time,
              status: record.status
            });
          }
        }
      }

      return attendanceDetails;
    } catch (error) {
      console.error('Error fetching attendance details by classCode:', error);
      throw error;
    }
  },

  async countNonNullTimesByClassCode(classCode) {
    try {
      const attendanceDetails = await this.getAttendanceDetailsByClassCode(classCode);
      return this.countNonNullTimes(attendanceDetails);
    } catch (error) {
      console.error('Error counting non-null times by classCode:', error);
      throw error;
    }
  },

  countNonNullTimes(attendanceDetails) {
    const studentIDs = [...new Set(attendanceDetails.map(detail => detail.studentID))];
    const timeCount = studentIDs.reduce((acc, studentID) => {
      acc[studentID] = 0;
      return acc;
    }, {});
    attendanceDetails.forEach(detail => {
      if (detail.time !== null) {
        timeCount[detail.studentID]++;
      }
    });
    return timeCount;
  },

  async countStatusByClassCode(classCode, status) {
    try {
      const attendanceDetails = await this.getAttendanceDetailsByClassCode(classCode);
      return this.countStatus(attendanceDetails, status);
    } catch (error) {
      console.error(`Error counting status "${status}" by classCode:`, error);
      throw error;
    }
  },

  countStatus(attendanceDetails, status) {
    const studentIDs = [...new Set(attendanceDetails.map(detail => detail.studentID))];
    const statusCount = studentIDs.reduce((acc, studentID) => {
      acc[studentID] = 0;
      return acc;
    }, {});
    attendanceDetails.forEach(detail => {
      if (detail.status === status) {
        statusCount[detail.studentID]++;
      }
    });
    return statusCount;
  },


  // async getAttendanceDetailsByClassCodeAndStudentID(classCode, studentID) {
  //   try {
  //     // Tìm classSection dựa trên classCode
  //     const classSection = await Classsection.findOne({ classCode });
  //     if (!classSection) {
  //       throw new Error('Class section not found');
  //     }
  
  //     // Tìm tất cả các bản ghi studentClass có classsectionID trùng và studentID trùng
  //     const studentClasses = await studentClass.find({ classsectionID: classSection._id, studentID: studentID });
  
  //     // Tạo một mảng để lưu trữ thông tin điểm danh
  //     const attendanceDetails = [];
  
  //     // Lấy thông tin time và status từ các bản ghi Attendance
  //     for (const studentClassEntry of studentClasses) {
  //       const attendance = await Attendance.findOne({ studentclasssection: studentClassEntry._id });
  //       if (attendance) {
  //         for (const record of attendance.attendanceRecords) {
  //           attendanceDetails.push({
  //             studentID: studentClassEntry.studentID,
  //             date: record.date,
  //             time: record.time,
  //             status: record.status
  //           });
  //         }
  //       }
  //     }
  
  //     return attendanceDetails;
  //   } catch (error) {
  //     console.error('Error fetching attendance details by classCode and studentID:', error);
  //     throw error;
  //   }
  // },

  // async countNonNullTimesByClassCodeAndStudentID(classCode, studentID) {
  //   try {
  //     const attendanceDetails = await this.getAttendanceDetailsByClassCodeAndStudentID(classCode, studentID);
  //     return this.countNonNullTimes(attendanceDetails);
  //   } catch (error) {
  //     console.error('Error counting non-null times by classCode and studentID:', error);
  //     throw error;
  //   }
  // },

  // async countStatusByClassCodeAndStudentID(classCode, studentID, status) {
  //   try {
  //     const attendanceDetails = await this.getAttendanceDetailsByClassCodeAndStudentID(classCode, studentID);
  //     return this.countStatus(attendanceDetails, status);
  //   } catch (error) {
  //     console.error(`Error counting status "${status}" by classCode and studentID:`, error);
  //     throw error;
  //   }
  // },
  async getAttendanceDetailsByClassCodeAndStudentID(classCode, studentID) {
    try {
      // Tìm classSection dựa trên classCode
      const classSection = await Classsection.findOne({ classCode });
      if (!classSection) {
        throw new Error('Class section not found');
      }
      // Tìm tất cả các bản ghi studentClass có classsectionID trùng và studentID trùng
      const studentClasses = await studentClass.find({ classsectionID: classSection._id, studentID: studentID });
      // Tạo một mảng để lưu trữ thông tin điểm danh
      const attendanceDetails = [];
      // Lấy thông tin time và status từ các bản ghi Attendance
      for (const studentClassEntry of studentClasses) {
        const attendance = await Attendance.findOne({ studentclasssection: studentClassEntry._id });
        if (attendance) {
          for (const record of attendance.attendanceRecords) {
            attendanceDetails.push({
              studentID: studentClassEntry.studentID,
              date: record.date,
              time: record.time,
              status: record.status
            });
          }
        }
      }
      return attendanceDetails;
    } catch (error) {
      console.error('Error fetching attendance details by classCode and studentID:', error);
      throw error;
    }
  },

  async countNonNullTimesByClassCodeAndStudentID(classCode, studentID) {
    try {
      const attendanceDetails = await this.getAttendanceDetailsByClassCodeAndStudentID(classCode, studentID);
      return this.countNonNullTimes(attendanceDetails);
    } catch (error) {
      console.error('Error counting non-null times by classCode and studentID:', error);
      throw error;
    }
  },

  async countStatusByClassCodeAndStudentID(classCode, studentID, status) {
    try {
      const attendanceDetails = await this.getAttendanceDetailsByClassCodeAndStudentID(classCode, studentID);
      return this.countStatus(attendanceDetails, status);
    } catch (error) {
      console.error(`Error counting status "${status}" by classCode and studentID:`, error);
      throw error;
    }
  },

  countNonNullTimes(attendanceDetails) {
    const studentIDs = [...new Set(attendanceDetails.map(detail => detail.studentID))];
    const timeCount = studentIDs.reduce((acc, studentID) => {
      acc[studentID] = 0;
      return acc;
    }, {});
    attendanceDetails.forEach(detail => {
      if (detail.time !== null) {
        timeCount[detail.studentID]++;
      }
    });
    return timeCount;
  },

  countStatus(attendanceDetails, status) {
    const studentIDs = [...new Set(attendanceDetails.map(detail => detail.studentID))];
    const statusCount = studentIDs.reduce((acc, studentID) => {
      acc[studentID] = 0;
      return acc;
    }, {});
    attendanceDetails.forEach(detail => {
      if (detail.status === status) {
        statusCount[detail.studentID]++;
      }
    });
    return statusCount;
  },
  
  
  // async addStudentToClass(classCode, email) {
  //   try {
  //     const mongoose = require('mongoose');
      
  //     // Tìm classSection dựa trên classCode
  //     const classSection = await Classsection.findOne({ classCode: classCode });
  //     if (!classSection) {
  //       throw new Error('Class section not found');
  //     }
  
  //     // Tìm hoặc tạo user dựa trên email
  //     let user = await Users.findOne({ email: email });
  //     if (!user) {
  //       user = new Users({
  //         _id: new mongoose.Types.ObjectId(),
  //         microsoftId: uuidv4(),
  //         displayName: null,
  //         email: email,
  //         accessToken: null,
  //         lastLogin: null,
  //         role: "6759a2efbdadd030d0029634", // ID của role "Sinh viên"
  //         status: 1,
  //         phone: null,
  //         personalEmail: null,
  //         fullName: null,
  //         typeLecturer: null,
  //         userCode: null
  //       });
  //       await user.save();
  //     }
  
  //     // Tạo mới studentClass
  //     const newStudentClass = new studentClass({
  //       _id: new mongoose.Types.ObjectId(),
  //       studentID: user._id,
  //       classsectionID: classSection._id
  //     });
  
  //     // Lưu studentClass vào database
  //     await newStudentClass.save();
  //     return newStudentClass;
  //   } catch (error) {
  //     console.error('Error adding student to class:', error);
  //     throw error;
  //   }
  // },
  async addStudentToClass(classCode, email) {
    try {
      // Tìm classSection dựa trên classCode
      const classSection = await Classsection.findOne({ classCode: classCode });
      if (!classSection) {
        throw new Error('Class section not found');
      }
  
      // Tìm hoặc tạo user dựa trên email
      let user = await Users.findOne({ email: email });
      if (!user) {
        user = new Users({
          _id: new mongoose.Types.ObjectId(),
          microsoftId: uuidv4(),
          displayName: null,
          email: email,
          accessToken: null,
          lastLogin: null,
          role: "6759a2efbdadd030d0029634", // ID của role "Sinh viên"
          status: 1,
          phone: null,
          personalEmail: null,
          fullName: null,
          typeLecturer: null,
          userCode: null
        });
        await user.save();
      }
  
      // Tạo mới studentClass
      const newStudentClass = new studentClass({
        _id: new mongoose.Types.ObjectId(),
        studentID: user._id,
        classsectionID: classSection._id
      });
  
      // Lưu studentClass vào database
      await newStudentClass.save();
  
      // Truy vấn tất cả các bản ghi studentClass có classsectionID trùng
      const studentClasses = await studentClass.find({ classsectionID: classSection._id });
  
      // Lấy các ngày điểm danh giống nhau từ các bản ghi Attendance
      let attendanceRecords = [];
      if (studentClasses.length > 0) {
        const attendanceRecordsMap = new Map();
        for (const studentClassEntry of studentClasses) {
          const attendance = await Attendance.findOne({ studentclasssection: studentClassEntry._id });
          if (attendance) {
            for (const record of attendance.attendanceRecords) {
              const dateStr = record.date.toISOString();
              if (!attendanceRecordsMap.has(dateStr)) {
                attendanceRecordsMap.set(dateStr, { date: record.date, time: null, status: null });
              }
            }
          }
        }
        attendanceRecords = Array.from(attendanceRecordsMap.values());
      }
  
      const newAttendance = new Attendance({
        _id: new mongoose.Types.ObjectId(),
        studentclasssection: newStudentClass._id,
        attendanceRecords: attendanceRecords
      });
  
      // Lưu attendance vào database
      await newAttendance.save();
  
      return newStudentClass;
    } catch (error) {
      console.error('Error adding student to class:', error);
      throw error;
    }
  },
  //test------------------------------------------------------------------------------
//   async updateAttendanceWithCurrentTimeAndStatus(classCode, studentId, date, status) {
//     try {
//         // Find classSection based on classCode
//         const classSection = await Classsection.findOne({ classCode: classCode });
//         if (!classSection) {
//             throw new Error('Class section not found');
//         }

//         // Find the studentClass entry
//         const studentClassEntry = await studentClass.findOne({
//             studentID: studentId,
//             classsectionID: classSection._id
//         });
//         if (!studentClassEntry) {
//             throw new Error('Student class entry not found');
//         }

//         // Find the corresponding Attendance record
//         const attendance = await Attendance.findOne({ studentclasssection: studentClassEntry._id });
//         if (!attendance) {
//             throw new Error('Attendance record not found');
//         }

//         // Update the time and status for the specified date in the attendance records
//         const currentTime = new Date().toLocaleTimeString();
//         const recordToUpdate = attendance.attendanceRecords.find(record => record.date.toISOString().split('T')[0] === date);
//         if (recordToUpdate) {
//             recordToUpdate.time = currentTime;
//             recordToUpdate.status = status;
//         } else {
//             throw new Error('Attendance record for the specified date not found');
//         }

//         await attendance.save();

//         return attendance;
//     } catch (error) {
//         console.error('Error updating attendance:', error);
//         throw error;
//     }
// },
async updateAttendanceWithCurrentTimeAndStatus(classCode, studentId, date, status) {
  try {
      // Find classSection based on classCode
      const classSection = await Classsection.findOne({ classCode: classCode });
      if (!classSection) {
          throw new Error('Class section not found');
      }

      // Find the studentClass entry
      const studentClassEntry = await studentClass.findOne({
          studentID: studentId,
          classsectionID: classSection._id
      });
      if (!studentClassEntry) {
          throw new Error('Student class entry not found');
      }

      // Find the corresponding Attendance record
      const attendance = await Attendance.findOne({ studentclasssection: studentClassEntry._id });
      if (!attendance) {
          throw new Error('Attendance record not found');
      }

      // Parse the provided date in DD/MM/YYYY format
      const [day, month, year] = date.split('/');
      const providedDate = new Date(Date.UTC(year, month - 1, day)); // Use Date.UTC to avoid time zone issues
      const providedDateString = providedDate.toISOString().split('T')[0];

      // Update the time and status for the specified date in the attendance records
      
      const currentTime = new Date().toLocaleTimeString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
      // const currentTime = new Date().toLocaleTimeString();
      let recordToUpdate = attendance.attendanceRecords.find(record => record.date.toISOString().split('T')[0] === providedDateString);
      
      if (recordToUpdate) {
          recordToUpdate.time = currentTime;
          recordToUpdate.status = status;
      } else {
          // If the record for the specified date is not found, add a new record
          attendance.attendanceRecords.push({ date: providedDate, time: currentTime, status: status });
      }

      await attendance.save();

      return attendance;
  } catch (error) {
      console.error('Error updating attendance:', error);
      throw error;
  }
},

async updateAttendanceStatus(classCode, studentId, date, newStatus) {
  try {
    // Find classSection based on classCode
    const classSection = await Classsection.findOne({ classCode: classCode });
    if (!classSection) {
      throw new Error('Class section not found');
    }

    // Find the studentClass entry
    const studentClassEntry = await studentClass.findOne({
      studentID: studentId,
      classsectionID: classSection._id
    });
    if (!studentClassEntry) {
      throw new Error('Student class entry not found');
    }

    // Find the corresponding Attendance record
    const attendance = await Attendance.findOne({ studentclasssection: studentClassEntry._id });
    if (!attendance) {
      throw new Error('Attendance record not found');
    }

    // Parse the provided date in DD/MM/YYYY format
    const [day, month, year] = date.split('/');
    const providedDate = new Date(Date.UTC(year, month - 1, day)); // Use Date.UTC to avoid time zone issues
    const providedDateString = providedDate.toISOString().split('T')[0];

    // Update the status for the specified date in the attendance records
    let recordToUpdate = attendance.attendanceRecords.find(record => record.date.toISOString().split('T')[0] === providedDateString);

    if (recordToUpdate) {
      recordToUpdate.status = newStatus;
    } else {
      // If the record for the specified date is not found, add a new record with the status
      attendance.attendanceRecords.push({ date: providedDate, status: newStatus });
    }

    await attendance.save();

    return attendance;
  } catch (error) {
    console.error('Error updating attendance status:', error);
    throw error;
  }
},

async getAttendanceStatus(classCode, studentId, date) {
  try {
    // Tìm classSection dựa trên classCode
    const classSection = await Classsection.findOne({ classCode: classCode });
    if (!classSection) {
      throw new Error('Class section not found');
    }
    console.log('Class section found:', classSection);

    // Tìm mục studentClass
    const studentClassEntry = await studentClass.findOne({
      studentID: studentId,
      classsectionID: classSection._id
    });
    if (!studentClassEntry) {
      throw new Error('Student class entry not found');
    }
    console.log('Student class entry found:', studentClassEntry);

    // Tìm bản ghi Attendance tương ứng
    const attendance = await Attendance.findOne({ studentclasssection: studentClassEntry._id });
    if (!attendance) {
      throw new Error('Attendance record not found');
    }
    console.log('Attendance record found:', attendance);

    // Phân tích ngày được cung cấp theo định dạng DD/MM/YYYY
    const [day, month, year] = date.split('/');
    const providedDate = new Date(Date.UTC(year, month - 1, day)); // Sử dụng Date.UTC để tránh vấn đề múi giờ
    const providedDateString = providedDate.toISOString().split('T')[0];

    // Tìm trạng thái cho ngày được chỉ định trong các bản ghi attendance
    const record = attendance.attendanceRecords.find(record => record.date.toISOString().split('T')[0] === providedDateString);

    if (record) {
      return record.status;
    } else {
      throw new Error('Attendance record for the specified date not found');
    }
  } catch (error) {
    console.error('Error getting attendance status:', error);
    throw error;
  }
},

  // async removeStudentFromClass(classCode, studentID) {
  //   try {
  //     const mongoose = require('mongoose');
      
  //     // Tìm classSection dựa trên classCode
  //     const classSection = await Classsection.findOne({ classCode: classCode });
  //     if (!classSection) {
  //       throw new Error('Class section not found');
  //     }
  
  //     // Xóa studentClass dựa trên classSectionID và studentID
  //     const result = await studentClass.deleteOne({
  //       classsectionID: classSection._id,
  //       studentID: new mongoose.Types.ObjectId(studentID)
  //     });
  
  //     if (result.deletedCount === 0) {
  //       throw new Error('Student not found in the specified class');
  //     }
  
  //     return { message: 'Student removed successfully' };
  //   } catch (error) {
  //     console.error('Error removing student from class:', error);
  //     throw error;
  //   }
  // },
  async removeStudentFromClass(classCode, studentID) {
    try {
      // Tìm classSection dựa trên classCode
      const classSection = await Classsection.findOne({ classCode: classCode });
      if (!classSection) {
        throw new Error('Class section not found');
      }
  
      // Tìm _id của studentClass dựa trên classSectionID và studentID
      const studentClassEntry = await studentClass.findOne({
        classsectionID: classSection._id,
        studentID: new mongoose.Types.ObjectId(studentID)
      });
  
      if (!studentClassEntry) {
        throw new Error('Student not found in the specified class');
      }
  
      // Xóa thông tin điểm danh của sinh viên này trong bảng Attendance
      await Attendance.deleteOne({ studentclasssection: studentClassEntry._id });
  
      // Xóa studentClass dựa trên classSectionID và studentID
      await studentClass.deleteOne({
        classsectionID: classSection._id,
        studentID: new mongoose.Types.ObjectId(studentID)
      });
  
      return { message: 'Student removed successfully' };
    } catch (error) {
      console.error('Error removing student from class:', error);
      throw error;
    }
  },

// async exportAttendanceToExcel(classCode) {
//   try {
//       // Find classSection based on classCode
//       const classSection = await Classsection.findOne({ classCode: classCode });
//       if (!classSection) {
//           throw new Error('Class section not found');
//       }

//       // Find all studentClass entries for the classSection
//       const studentClasses = await studentClass.find({ classsectionID: classSection._id }).populate('studentID');

//       // Prepare data for the Excel file
//       const data = [];
//       const headers = [
//           'STT', 'Mã SV', 'Họ và tên', 'Email'
//       ];

//       const allDates = new Set();
//       for (const studentClassEntry of studentClasses) {
//           const attendance = await Attendance.findOne({ studentclasssection: studentClassEntry._id });
//           if (attendance) {
//               attendance.attendanceRecords.forEach(record => {
//                   allDates.add(record.date.toISOString().split('T')[0]);
//               });
//           }
//       }

//       // Sort dates
//       const sortedDates = Array.from(allDates).sort();
//       headers.push(...sortedDates);

//       // Prepare student data
//       let index = 1;
//       for (const studentClassEntry of studentClasses) {
//           const user = studentClassEntry.studentID;
//           const attendance = await Attendance.findOne({ studentclasssection: studentClassEntry._id });

//           const rowData = {
//               STT: index++,
//               'Mã SV': user.userCode || '',
//               'Họ và tên': user.fullName || '',
//               'Email': user.email
//           };

//           // Add attendance data
//           if (attendance) {
//               sortedDates.forEach(date => {
//                   const record = attendance.attendanceRecords.find(record => record.date.toISOString().split('T')[0] === date);
//                   rowData[date] = record ? record.status : '';
//               });
//           } else {
//               sortedDates.forEach(date => {
//                   rowData[date] = '';
//               });
//           }

//           data.push(rowData);
//       }

//       // Create a new workbook and worksheet
//       const workbook = XLSX.utils.book_new();
//       const worksheet = XLSX.utils.json_to_sheet(data, { header: headers });

//       // Apply bold style to the header row
//       const range = XLSX.utils.decode_range(worksheet['!ref']);
//       for (let C = range.s.c; C <= range.e.c; ++C) {
//           const cell_address = XLSX.utils.encode_cell({ r: 0, c: C });
//           if (!worksheet[cell_address]) continue;
//           if (!worksheet[cell_address].s) worksheet[cell_address].s = {};
//           worksheet[cell_address].s.font = { bold: true };
//       }

//       // Append the worksheet to the workbook
//       XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance');

//       // Write the workbook to a file in the current directory
//       const filePath = `./attendance_${classCode}.xlsx`;
//       XLSX.writeFile(workbook, filePath);

//       return filePath;
//   } catch (error) {
//       console.error('Error exporting attendance to Excel:', error);
//       throw error;
//   }
// }

// async exportAttendanceToExcel(classCode) {
//   try {
//       // Find classSection based on classCode
//       const classSection = await Classsection.findOne({ classCode: classCode });
//       if (!classSection) {
//           throw new Error('Class section not found');
//       }

//       // Find all studentClass entries for the classSection
//       const studentClasses = await studentClass.find({ classsectionID: classSection._id }).populate('studentID');

//       // Prepare data for the Excel file
//       const data = [];
//       const headers = [
//           'STT', 'Mã SV', 'Họ và tên', 'Email'
//       ];

//       const allDates = new Set();
//       for (const studentClassEntry of studentClasses) {
//           const attendance = await Attendance.findOne({ studentclasssection: studentClassEntry._id });
//           if (attendance) {
//               attendance.attendanceRecords.forEach(record => {
//                   allDates.add(record.date.toISOString().split('T')[0]);
//               });
//           }
//       }

//       // Sort dates
//       const sortedDates = Array.from(allDates).sort();
//       headers.push(...sortedDates);

//       // Prepare student data
//       let index = 1;
//       for (const studentClassEntry of studentClasses) {
//           const user = studentClassEntry.studentID;
//           const attendance = await Attendance.findOne({ studentclasssection: studentClassEntry._id });

//           const rowData = {
//               STT: index++,
//               'Mã SV': user.userCode || '',
//               'Họ và tên': user.fullName || '',
//               'Email': user.email
//           };

//           // Add attendance data
//           if (attendance) {
//               sortedDates.forEach(date => {
//                   const record = attendance.attendanceRecords.find(record => record.date.toISOString().split('T')[0] === date);
//                   rowData[date] = record ? record.status : '';
//               });
//           } else {
//               sortedDates.forEach(date => {
//                   rowData[date] = '';
//               });
//           }

//           data.push(rowData);
//       }

//       // Create a new workbook and worksheet
//       const workbook = XLSX.utils.book_new();
//       const worksheet = XLSX.utils.json_to_sheet(data, { header: headers });

//       // Apply bold style to the header row
//       const range = XLSX.utils.decode_range(worksheet['!ref']);
//       for (let C = range.s.c; C <= range.e.c; ++C) {
//           const cell_address = XLSX.utils.encode_cell({ r: 0, c: C });
//           if (!worksheet[cell_address]) continue;
//           if (!worksheet[cell_address].s) worksheet[cell_address].s = {};
//           worksheet[cell_address].s.font = { bold: true };
//       }

//       // Append the worksheet to the workbook
//       XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance');

//       // Write the workbook to a buffer
//       const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

//       return buffer;
//   } catch (error) {
//       console.error('Error exporting attendance to Excel:', error);
//       throw error;
//   }
// },
  async exportAttendanceToExcel(classCode) {
    try {
        // Find classSection based on classCode
        const classSection = await Classsection.findOne({ classCode: classCode });
        if (!classSection) {
            throw new Error('Class section not found');
        }

        // Find all studentClass entries for the classSection
        const studentClasses = await studentClass.find({ classsectionID: classSection._id }).populate('studentID');

        // Prepare data for the Excel file
        const data = [];
        const headers = [
            'STT', 'Mã SV', 'Họ và tên', 'Email'
        ];

        const allDates = new Set();
        for (const studentClassEntry of studentClasses) {
            const attendance = await Attendance.findOne({ studentclasssection: studentClassEntry._id });
            if (attendance) {
                attendance.attendanceRecords.forEach(record => {
                    allDates.add(record.date.toISOString().split('T')[0]);
                });
            }
        }

        // Sort dates
        const sortedDates = Array.from(allDates).sort();
        headers.push(...sortedDates);

        // Prepare student data
        let index = 1;
        for (const studentClassEntry of studentClasses) {
            const user = studentClassEntry.studentID;
            const attendance = await Attendance.findOne({ studentclasssection: studentClassEntry._id });

            const rowData = {
                STT: index++,
                'Mã SV': user.userCode || '',
                'Họ và tên': user.fullName || '',
                'Email': user.email
            };

            // Add attendance data
            if (attendance) {
                sortedDates.forEach(date => {
                    const record = attendance.attendanceRecords.find(record => record.date.toISOString().split('T')[0] === date);
                    rowData[date] = record ? record.status : '';
                });
            } else {
                sortedDates.forEach(date => {
                    rowData[date] = '';
                });
            }

            data.push(rowData);
        }

        // Create a new workbook and worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Attendance');

        // === LOGO ===
        const logoPath = path.join(__dirname, '../uploads/logovanlang1.png');
        const logo = workbook.addImage({
            filename: logoPath,
            extension: 'png',
        });
        
        // Logo nằm ở giữa phía trên 2 dòng tiêu đề, ví dụ từ B1 đến C3
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

        // === TIÊU ĐỀ THỐNG KÊ ===
        worksheet.mergeCells('A7:N7');
        worksheet.getCell('A7').value = 'SỐ LƯỢNG SINH VIÊN TỪNG BUỔI';
        worksheet.getCell('A7').font = { bold: true, size: 14 };
        worksheet.getCell('A7').alignment = { vertical: 'middle', horizontal: 'center' };

        // === DÒNG TRỐNG ===
        worksheet.addRow([null]);

        // Add the column headers
        // Add the column headers
      const headerRow = worksheet.addRow(headers);
      headerRow.eachCell((cell) => {
          // cell.font = { bold: true };
          cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
          cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FF2400' } // Màu đỏ (ARGB: AARRGGBB — FF=opacity, FF0000=red)
          };
      });

        // Set column widths
        const columnWidths = [5, 15, 22, 30, ...Array(sortedDates.length).fill(15)];
        worksheet.columns.forEach((column, index) => {
            column.width = columnWidths[index];
        });

        // Add the student data
        data.forEach((rowData) => {
            worksheet.addRow(Object.values(rowData));
        });

        // Add the final rows with the date and signature
        const finalRow1 = worksheet.addRow(['TP.Hồ Chí Minh, ngày   tháng    năm 2025']);
        finalRow1.font = { italic: true };
        finalRow1.alignment = { horizontal: 'right' };
        worksheet.mergeCells(`A${finalRow1.number}:N${finalRow1.number}`);

        const finalRow2 = worksheet.addRow(['Người lập danh sách                ']);
        finalRow2.font = { italic: true };
        finalRow2.alignment = { horizontal: 'right' };
        worksheet.mergeCells(`A${finalRow2.number}:N${finalRow2.number}`);

        const buffer = await workbook.xlsx.writeBuffer();
        return buffer;
    } catch (error) {
        console.error('Error exporting attendance to Excel:', error);
        throw error;
    }
  },

async incrementNotificationCount(studentId, classCode) {
  try {
    // Tìm kiếm classSection dựa trên classCode
    const classSection = await Classsection.findOne({ classCode: classCode });
    if (!classSection) {
      throw new Error('Class section not found');
    }

    // Tìm kiếm bản ghi NoticeWarning dựa trên studentID và classsectionID
    let noticeWarning = await NoticeWarning.findOne({
      studentID: studentId,
      classsectionID: classSection._id
    });

    if (noticeWarning) {
      // Nếu bản ghi tồn tại, tăng giá trị numberNotifications lên 1
      noticeWarning.numberNotifications += 1;
    } else {
      // Nếu bản ghi không tồn tại, tạo một bản ghi mới với numberNotifications là 1
      noticeWarning = new NoticeWarning({
        _id: new mongoose.Types.ObjectId(),
        studentID: studentId,
        classsectionID: classSection._id,
        numberNotifications: 1
      });
    }

    // Lưu bản ghi NoticeWarning
    await noticeWarning.save();

    return noticeWarning;
  } catch (error) {
    console.error('Error incrementing notification count:', error);
    throw error;
  }
},
async getNotificationCount(studentId, classCode) {
  try {
    // Tìm kiếm classSection và NoticeWarning song song
    const [classSection, noticeWarning] = await Promise.all([
      Classsection.findOne({ classCode: classCode }).lean(),
      NoticeWarning.findOne({
        studentID: studentId,
        classsectionID: (await Classsection.findOne({ classCode: classCode }).lean())._id
      }).lean()
    ]);

    if (!classSection) {
      throw new Error('Class section not found');
    }

    // Trả về số lượng thông báo hoặc 0 nếu không có bản ghi
    return noticeWarning ? noticeWarning.numberNotifications : 0;
  } catch (error) {
    console.error('Error getting notification count:', error);
    throw error;
  }
},
async getUsersAndNotificationCountsByClassCode(classCode) {
  try {
    const mongoose = require('mongoose');

    // Tìm kiếm classSection dựa trên classCode
    const classSection = await Classsection.findOne({ classCode: classCode }).lean();
    if (!classSection) {
      throw new Error('Class section not found');
    }

    // Tìm kiếm users và số lượng thông báo
    const users = await studentClass.aggregate([
      {
        $lookup: {
          from: 'classsections',
          localField: 'classsectionID',
          foreignField: '_id',
          as: 'classSection'
        }
      },
      { $unwind: '$classSection' },
      { $match: { 'classSection.classCode': classCode } },
      {
        $lookup: {
          from: 'users',
          localField: 'studentID',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $lookup: {
          from: 'roles',
          localField: 'user.role',
          foreignField: '_id',
          as: 'role'
        }
      },
      { $unwind: '$role' },
      { $match: { 'role.tenrole': 'Sinh viên' } },
      {
        $lookup: {
          from: 'noticewarnings',
          let: { studentId: '$user._id', classSectionId: classSection._id },
          pipeline: [
            { $match: { $expr: { $and: [{ $eq: ['$studentID', '$$studentId'] }, { $eq: ['$classsectionID', '$$classSectionId'] }] } } },
            { $project: { numberNotifications: 1 } }
          ],
          as: 'noticeWarning'
        }
      },
      { $unwind: { path: '$noticeWarning', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: '$user._id',
          displayName: '$user.displayName',
          email: '$user.email',
          phone: '$user.phone',
          fullName: '$user.fullName',
          userCode: '$user.userCode',
          numberNotifications: { $ifNull: ['$noticeWarning.numberNotifications', 0] }
        }
      }
    ]).exec();

    return users;
  } catch (error) {
    console.error('Error fetching users and notification counts by classCode:', error);
    throw error;
  }
}

};
module.exports = studentClassDAO;