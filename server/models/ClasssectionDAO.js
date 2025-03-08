const mongoose = require('mongoose'); // Đảm bảo import mongoose ở đầu file
require('../utils/MongooseUtil');
const Classsection = require('./Classsection'); // Import mô hình Classsection
const xlsx = require('xlsx'); // Import thư viện xlsx để đọc tệp Excel
const Subject = require('./Subject');
const Term = require('./Term'); // Import mô hình Term
const SubjectTerm = require('./SubjectTerm');
const Users = require('./User');
const teachingAssignment = require('./teachingAssignment'); // Import the teachingAssignment model
const studentClass = require('./studentClass');
const Attendance = require('./Attendance');
const moment = require('moment-timezone');


const { v4: uuidv4 } = require('uuid');
const { use } = require('passport');

const ClasssectionDAO = {
  // async selectAll() {
  //   try {
  //     const css = await Classsection.find().exec();
  //     return css;
  //   } catch (error) {
  //     console.error('Error fetching class sections:', error);
  //     throw error;
  //   }
  // },
  async selectAll() {
    try {
      // Lấy tất cả các lớp và thông tin môn học liên quan
      const classes = await Classsection.find()
        .populate({
          path: 'subjecttermID',
          populate: {
            path: 'subjectID',
            select: 'subjectName'
          }
        })
        .exec();
  
      // Lấy tất cả các giảng viên và thông tin phân công giảng dạy
      const teachingAssignments = await teachingAssignment.find()
        .populate('teacherID', 'displayName fullName email')
        .exec();
  
      // Tạo một bản đồ để tra cứu nhanh thông tin giảng viên theo classsectionID
      const teacherMap = teachingAssignments.reduce((map, assignment) => {
        assignment.classsectionID.forEach(classsectionID => {
          map[classsectionID] = {
            displayName: assignment.teacherID.displayName,
            fullName: assignment.teacherID.fullName,
            email: assignment.teacherID.email
          };
        });
        return map;
      }, {});
  
      // Kết hợp thông tin lớp và giảng viên
      const classAndTeacherInfo = classes.map(classInfo => ({
        _id: classInfo._id,
        classCode: classInfo.classCode,
        classType: classInfo.classType,
        schoolDay: classInfo.schoolDay,
        lesson: classInfo.lesson,
        subjecttermID: classInfo.subjecttermID,
        subjectName: classInfo.subjecttermID.subjectID.subjectName,
        teacher: teacherMap[classInfo._id] || null
      }));
  
      return classAndTeacherInfo;
    } catch (error) {
      console.error('Error fetching class sections and teachers:', error);
      throw error;
    }
  },
  // async getClassSection(subjecttermID) {
  //   try {
  //     if (!mongoose.Types.ObjectId.isValid(subjecttermID)) {
  //       throw new Error('Invalid subjectID format');
  //     }
  //     const objectId = new mongoose.Types.ObjectId(subjecttermID);
  //     const assignments = await Classsection.find({ subjecttermID: objectId, classType: 0 }) // Thêm điều kiện classType: 0
  //     return assignments;
  //   } catch (error) {
  //     console.error('Error fetching class section:', error);
  //     throw error;
  //   }
  // },

  async getClassSection(subjecttermID) {
    try {
      if (!mongoose.Types.ObjectId.isValid(subjecttermID)) {
        throw new Error('Invalid subjectID format');
      }
      const objectId = new mongoose.Types.ObjectId(subjecttermID);
      const assignments = await Classsection.find({ subjecttermID: objectId, classType: 0 })
        .populate({
          path: 'subjecttermID',
          populate: {
            path: 'subjectID termID',
            model: 'SubjectTerm'
          }
        });
  
      const teachingAssignments = await teachingAssignment.find({ subjecttermID: objectId })
        .populate({
          path: 'teacherID',
          model: 'User',
          select: 'userCode fullName displayName'
        });
  
      const result = assignments.map(assignment => {
        const teachingAssignment = teachingAssignments.find(ta => ta.classsectionID.includes(assignment._id));
        if (teachingAssignment) {
          return {
            ...assignment.toObject(),
            teacher: teachingAssignment.teacherID
          };
        }
        return {
          ...assignment.toObject(),
          teacher: {
            userCode: null,
            fullName: null,
            displayName: null
          }
        };
      });
  
      return result;
    } catch (error) {
      console.error('Error fetching class section:', error);
      throw error;
    }
  },
  async insert(classsection) {
    try {
      classsection._id = new mongoose.Types.ObjectId();
      const result = await Classsection.create(classsection);
      return result;
    } catch (error) {
      console.error('Error inserting class section:', error);
      throw error;
    }
  },
  async update(classsection) {
    try {
      const newValues = { classType: classsection.classType, schoolDay: classsection.schoolDay,lesson: classsection.lesson };
      const result = await Classsection.findByIdAndUpdate(classsection._id, newValues, { new: true });
      return result;
    } catch (error) {
      console.error('Error updating class section:', error);
      throw error;
    }
  },
  // async getPracticeSections(classCode) {
  //   try {
  //     const regex = new RegExp(`^${classCode}0[0-9]+$`);
  //     const practiceSections = await Classsection.find({ classCode: { $regex: regex }, classType: 1 }).exec();
  //     return practiceSections;
  //   } catch (error) {
  //     console.error('Error fetching practice sections:', error);
  //     throw error;
  //   }
  // },


  async getPracticeSections(classCode) {
    try {
      const regex = new RegExp(`^${classCode}0[0-9]+$`);
      const practiceSections = await Classsection.find({ classCode: { $regex: regex }, classType: 1 }).exec();
  
      const teachingAssignments = await teachingAssignment.find({ classsectionID: { $in: practiceSections.map(section => section._id) } })
        .populate({
          path: 'teacherID',
          model: 'User',
          select: 'userCode fullName displayName'
        });
  
      const result = practiceSections.map(section => {
        const teachingAssignment = teachingAssignments.find(ta => ta.classsectionID.includes(section._id));
        if (teachingAssignment) {
          return {
            ...section.toObject(),
            teacher: teachingAssignment.teacherID
          };
        }
        return {
          ...section.toObject(),
          teacher: {
            userCode: null,
            fullName: null,
            displayName: null
          }
        };
      });
  
      return result;
    } catch (error) {
      console.error('Error fetching practice sections:', error);
      throw error;
    }
  },
  async deletepractical(_id) {
    try {
      const result = await Classsection.findByIdAndRemove(_id);
      return result;
    } catch (error) {
      console.error('Error deleting class section:', error);
      throw error;
    }
  },
  async deleteAll(_id) {
    try {
      const classSection = await Classsection.findById(_id);
      if (classSection && classSection.classType === 0) {
        const regex = new RegExp(`^${classSection.classCode}0[0-9]+$`);
        await Classsection.deleteMany({ classCode: { $regex: regex }, classType: 1 });
      }
      const result = await Classsection.findByIdAndRemove(_id);
      return result;
    } catch (error) {
      console.error('Error deleting class section:', error);
      throw error;
    }
  },
  
async importFromExcel(filePath) {
  const removeDiacritics = (str) => {
    return str ? str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D') : '';
  };
  const generateEmail = (fullName) => {
    if (!fullName) return null;
    const nameParts = fullName.split(' ');
    const lastName = nameParts.pop();
    const initials = nameParts.map(name => name[0]).join('');
    if (!lastName || !initials) return null;
    return `${removeDiacritics(lastName.toLowerCase())}.${removeDiacritics(initials.toLowerCase())}@vlu.edu.vn`;
  };
  try {
    const startTime = performance.now();
    const workbook = xlsx.readFile(filePath);
    const sheetNames = workbook.SheetNames;
    let totalRowsChanged = 0;
    const addedEmails = new Set();
    const addedSubjectCodes = new Set(); 
    const addedSubjectTermCodes = new Set();
    const addedClassCodes = []; // Track the class codes and subject names that will be added
    const duplicateClasses = []; // Track the duplicate classes
    for (const sheetName of sheetNames) {
      const worksheet = workbook.Sheets[sheetName];
      const data = xlsx.utils.sheet_to_json(worksheet);
      // subject
      const subjects = data.map((row) => ({
        subjectCode: row['Mã MH'],
        subjectName: row['Tên HP'],
        credit: row['Số TC'],
        major: "6783d919c034eecc84398cf0",
      })).filter(subject => subject.subjectCode && subject.subjectName);
      const subjectBulkOps = [];
      for (const subject of subjects) {
        const exists = await Subject.findOne({ subjectCode: subject.subjectCode, subjectName: subject.subjectName });
        if (!exists) {
          subjectBulkOps.push({
            updateOne: {
              filter: { subjectCode: subject.subjectCode, subjectName: subject.subjectName },
              update: { $set: subject },
              upsert: true,
            },
          });
          addedSubjectCodes.add(subject.subjectCode);
        }
      }
      if (subjectBulkOps.length > 0) {
        const result = await Subject.bulkWrite(subjectBulkOps);
        totalRowsChanged += result.nUpserted + result.nModified; 
      }
      // Lấy danh sách các subjects đã được lưu
      const savedSubjects = await Subject.find({ subjectCode: { $in: subjects.map(s => s.subjectCode) } });
      // Lấy danh sách các terms đã được lưu
      const termCodes = data.map(row => {
        const termCode = parseInt(row['Mã LHP']?.split('_')[0]);
        return isNaN(termCode) ? null : termCode;
      }).filter(termCode => termCode !== null);
      const savedTerms = await Term.find({ term: { $in: termCodes } });
      // subjectterm
      const subjectterms = data.map((row) => {
        const subjectCodePart = row['Mã LHP']?.split('_')[1];
        const termCodePart = parseInt(row['Mã LHP']?.split('_')[0]);
        const subject = savedSubjects.find(s => s.subjectCode === subjectCodePart);
        const term = savedTerms.find(t => t.term === termCodePart);
        return {
          subjectTermCode: row['Mã LHP']?.split('_')[0] + '_' + subjectCodePart,
          subjectID: subject ? subject._id : null,
          termID: term ? term._id : null,
        };
      }).filter(subjectterm => subjectterm.termID !== null);

      const subjectTermBulkOps = [];
      for (const subjectterm of subjectterms) {
        if (subjectterm.termID !== null) {
          const exists = await SubjectTerm.findOne({ subjectTermCode: subjectterm.subjectTermCode });
          if (!exists) {
            subjectTermBulkOps.push({
              updateOne: {
                filter: { subjectTermCode: subjectterm.subjectTermCode },
                update: { $set: subjectterm },
                upsert: true, // Chèn mới nếu không tồn tại
              },
            });
            addedSubjectTermCodes.add(subjectterm.subjectTermCode);
          }
        }
      }

      if (subjectTermBulkOps.length > 0) {
        const result = await SubjectTerm.bulkWrite(subjectTermBulkOps);
        totalRowsChanged += result.nUpserted + result.nModified;
      }
      // Lấy danh sách các subjectterms đã được lưu
      const savedSubjectTerms = await SubjectTerm.find({ subjectTermCode: { $in: subjectterms.map(st => st.subjectTermCode) } });

      // Hàm chuyển đổi schoolDay
      const convertSchoolDay = (day) => {
        const daysMap = {
          'Thứ Hai': 'Thứ 2',
          'Thứ Ba': 'Thứ 3',
          'Thứ Tư': 'Thứ 4',
          'Thứ Năm': 'Thứ 5',
          'Thứ Sáu': 'Thứ 6',
          'Thứ Bảy': 'Thứ 7',
        };
        return daysMap[day] || day;
      };

      // Hàm chuyển đổi lesson
      const convertLesson = (lesson) => {
        const lessonMap = {
          '1 - 3': 1,
          '4 - 6': 2,
          '7 - 9': 3,
          '10 - 12': 4,
          '13 - 15': 5,
        };
        return lessonMap[lesson] !== undefined ? lessonMap[lesson] : 6;
      };

      // Hàm chuyển đổi classType
      const convertClassType = (type) => {
        const typeMap = {
          'Lý thuyết': 0,
          'Thực hành': 1
        };
        return typeMap[type] !== undefined ? typeMap[type] : 0;
      };

      // Lấy danh sách các classCodes đã tồn tại trong cơ sở dữ liệu
      const existingClassCodes = await Classsection.find({ classCode: { $in: data.map(row => row['Mã LHP']) } }).select('classCode').lean();
      const existingClassCodeSet = new Set(existingClassCodes.map(cs => cs.classCode));

      // classSections

const classSections = data.map((row) => {
  const subjectTermCode = row['Mã LHP']?.split('_')[0] + '_' + row['Mã LHP']?.split('_')[1];
  const subjectTerm = savedSubjectTerms.find(st => st.subjectTermCode === subjectTermCode);
  return {
    classCode: row['Mã LHP'],
    classType: convertClassType(row['Loại HP']),
    schoolDay: [convertSchoolDay(row['Thứ'])],
    lesson: [convertLesson(row['Tiết Học'])],
    subjecttermID: subjectTerm ? subjectTerm._id : null,
  };
}).filter(classSection => classSection.schoolDay[0] !== null && classSection.lesson[0] !== null && classSection.subjecttermID !== null);

const classSectionBulkOps = classSections.map((classSection) => ({
  updateOne: {
    filter: { classCode: classSection.classCode },
    update: { $set: classSection },
    upsert: true, // Chèn mới nếu không tồn tại
  },
}));

if (classSectionBulkOps.length > 0) {
  const result = await Classsection.bulkWrite(classSectionBulkOps);
  totalRowsChanged += result.nUpserted + result.nModified; // Update the number of rows changed
  classSections.forEach(cs => {
    if (!existingClassCodeSet.has(cs.classCode)) {
      // Find the subject name for the class to be added
      const subjectTerm = savedSubjectTerms.find(st => st._id.toString() === cs.subjecttermID.toString());
      const subject = savedSubjects.find(s => s._id.toString() === subjectTerm?.subjectID.toString());
      addedClassCodes.push({ classCode: cs.classCode, subjectName: subject ? subject.subjectName : null }); // Add class codes and subject names to the list
    } else {
      // Find the subject name for the duplicate class
      const subjectTerm = savedSubjectTerms.find(st => st._id.toString() === cs.subjecttermID.toString());
      const subject = savedSubjects.find(s => s._id.toString() === subjectTerm?.subjectID.toString());
      duplicateClasses.push({ classCode: cs.classCode, subjectName: subject ? subject.subjectName : null }); // Add duplicate class codes and subject names to the list
    }
  });
}

      // teachers
      const teachers = data.map((row) => ({
        microsoftId: uuidv4(),
        displayName: null,
        email: generateEmail(row['Tên CBGD']),
        accessToken: null,
        lastLogin: null,
        role: "67593968b4c9c77f87657a18",
        status: 1,
        phone: null,
        personalEmail: null,
        fullName: row['Tên CBGD'],
        typeLecturer: null,
        userCode: row['Mã CBGD']
      })).filter(teacher => teacher.email); // Bỏ qua các đối tượng có email bị null

      // Lấy danh sách các email đã tồn tại trong cơ sở dữ liệu
      const existingEmails = await Users.find({ email: { $in: teachers.map(t => t.email) } }).select('email').lean();
      const existingEmailSet = new Set(existingEmails.map(user => user.email));

      // Chỉ thêm các giáo viên mới chưa có trong cơ sở dữ liệu
      const newTeachers = teachers.filter(teacher => !existingEmailSet.has(teacher.email));
      const teacherBulkOps = newTeachers.map((teacher) => ({
        updateOne: {
          filter: { email: teacher.email },
          update: { $set: teacher },
          upsert: true,
        },
      }));

      if (teacherBulkOps.length > 0) {
        const result = await Users.bulkWrite(teacherBulkOps);
        totalRowsChanged += result.nUpserted + result.nModified; 
        newTeachers.forEach(t => addedEmails.add(t.email));
      }

      // teachingassignments
      const savedTeachers = await Users.find({ userCode: { $in: teachers.map(t => t.userCode) } });
      const savedClassSections = await Classsection.find({ classCode: { $in: classSections.map(cs => cs.classCode) } });
      const teachingassignments = data.map((row) => {
        const teacher = savedTeachers.find(t => t.userCode === row['Mã CBGD']);
        const subjectTerm = savedSubjectTerms.find(st => st.subjectTermCode === row['Mã LHP']?.split('_')[0] + '_' + row['Mã LHP']?.split('_')[1]);
        const classSection = savedClassSections.find(cs => cs.classCode === row['Mã LHP']);
        return {
          teacherID: teacher ? teacher._id : null,
          subjecttermID: subjectTerm ? subjectTerm._id : null,
          classsectionID: classSection ? [classSection._id] : [],
        };
      }).filter(assignment => assignment.teacherID && assignment.subjecttermID && assignment.classsectionID.length > 0);

      const teachingAssignmentBulkOps = teachingassignments.map((assignment) => ({
        updateOne: {
          filter: { teacherID: assignment.teacherID, subjecttermID: assignment.subjecttermID },
          update: { $addToSet: { classsectionID: { $each: assignment.classsectionID } } },
          upsert: true, // Chèn mới nếu không tồn tại
        },
      }));

      if (teachingAssignmentBulkOps.length > 0) {
        const result = await teachingAssignment.bulkWrite(teachingAssignmentBulkOps);
        totalRowsChanged += result.nUpserted + result.nModified; 
      }
    }
    const endTime = performance.now();
    const runtime = endTime - startTime;
    return {
      runtime,
      totalRowsChanged,
      duplicateClasses,
      addedEmails: Array.from(addedEmails),
      addedSubjectCodes: Array.from(addedSubjectCodes),
      addedSubjectTermCodes: Array.from(addedSubjectTermCodes),
      addedClassCodes,
    };
  } catch (error) {
    console.error('Error importing from Excel:', error);
    throw error;
  }
},

async importFromExcelTeacher(filePath) {
  try {
    const startTime = performance.now(); // Start time measurement

    const workbook = xlsx.readFile(filePath);
    const sheetNames = workbook.SheetNames;

    const allTeachers = [];
    let totalRowsChanged = 0; // Track the number of rows changed
    let totalRowsAdded = 0; // Track the number of rows added
    const addedEmails = []; // Track the emails of newly added teachers
    const duplicateTeachers = []; // Track the duplicate teachers

    for (const sheetName of sheetNames) {
      const worksheet = workbook.Sheets[sheetName];
      const data = xlsx.utils.sheet_to_json(worksheet);

      // teachers
      const teachers = data.map((row) => ({
        microsoftId: uuidv4(),
        displayName: null,
        email: row['Mail'], // Assuming the email is directly provided in the Excel file
        accessToken: null,
        lastLogin: null,
        role: "67593968b4c9c77f87657a18",
        status: 1,
        phone: null,
        personalEmail: null,
        fullName: row['Họ và tên'],
        typeLecturer: null,
        userCode: row['Mã GV']
      })).filter(teacher => teacher.email); // Bỏ qua các đối tượng có email bị null

      const teacherBulkOps = [];
      for (const teacher of teachers) {
        const exists = await Users.findOne({ email: teacher.email });
        if (!exists) {
          teacherBulkOps.push({
            updateOne: {
              filter: { email: teacher.email },
              update: { $set: teacher },
              upsert: true, // Chèn mới nếu không tồn tại
            },
          });
          addedEmails.push({email: teacher.email, fullName: teacher.fullName}); // Add email to the list of newly added teachers
        } else {
          // Check if the existing teacher data matches the new data
          const isSameData = exists.fullName === teacher.fullName && exists.userCode === teacher.userCode;
          if (!isSameData) {
            teacherBulkOps.push({
              updateOne: {
                filter: { email: teacher.email },
                update: { $set: teacher },
                upsert: true, // Chèn mới nếu không tồn tại
              },
            });
          }
          // Add duplicate teacher data to the list
          duplicateTeachers.push({ email: exists.email, fullName: exists.fullName });
        }
      }

      if (teacherBulkOps.length > 0) {
        const result = await Users.bulkWrite(teacherBulkOps);
        totalRowsChanged += result.nModified; // Update the number of rows changed
        totalRowsAdded += result.nUpserted; // Update the number of rows added
      }

      allTeachers.push(...teachers);
    }

    const endTime = performance.now(); // End time measurement
    const runtime = endTime - startTime; // Calculate runtime

    console.log('Import thành công!');
    console.log(`Thời gian chạy: ${runtime}ms`);
    console.log(`Số dòng được thay đổi: ${totalRowsChanged}`);
    console.log(`Số dòng được thêm mới: ${totalRowsAdded}`);
    console.log(`Emails of newly added teachers: ${addedEmails.join(', ')}`);
    console.log(`Duplicate teachers: ${JSON.stringify(duplicateTeachers)}`);

    return {
      runtime,
      totalRowsChanged,
      totalRowsAdded,
      addedEmails,
      duplicateTeachers, // Return the list of duplicate teachers
      changedRows: {
        teachers: allTeachers
      }
    };
  } catch (error) {
    console.error('Error importing from Excel:', error);
    throw error;
  }
},

// async importFromExcelStudent(filePath, classCode) {
//   try {
//     const startTime = performance.now(); // Start time measurement

//     const workbook = xlsx.readFile(filePath);
//     const sheetNames = workbook.SheetNames;

//     const allStudents = [];
//     let totalRowsChanged = 0; // Track the number of rows changed
//     let totalRowsAdded = 0; // Track the number of rows added
//     const addedEmails = []; // Track the emails of newly added students

//     for (const sheetName of sheetNames) {
//       const worksheet = workbook.Sheets[sheetName];
//       const data = xlsx.utils.sheet_to_json(worksheet);

//       // students
//       const students = data.map((row) => ({
//         microsoftId: uuidv4(),
//         displayName: null,
//         email: row['Email'], // Assuming the email is directly provided in the Excel file
//         accessToken: null,
//         lastLogin: null,
//         role: "6759a2efbdadd030d0029634", // Assuming this is the role ID for students
//         status: 1,
//         phone: null,
//         personalEmail: null,
//         fullName: row['Họ lót'] + ' ' + row['Tên'], // Concatenate 'Họ lót' and 'Tên'
//         userCode: row['Mã SV']
//       })).filter(student => student.email); // Bỏ qua các đối tượng có email bị null

//       const studentBulkOps = [];
//       for (const student of students) {
//         const exists = await Users.findOne({ email: student.email });
//         if (!exists) {
//           studentBulkOps.push({
//             updateOne: {
//               filter: { email: student.email },
//               update: { $set: student },
//               upsert: true, // Chèn mới nếu không tồn tại
//             },
//           });
//           addedEmails.push(student.email); // Add email to the list of newly added students
//         } else {
//           // Check if the existing student data matches the new data
//           const isSameData = exists.fullName === student.fullName && exists.userCode === student.userCode;
//           if (!isSameData) {
//             studentBulkOps.push({
//               updateOne: {
//                 filter: { email: student.email },
//                 update: { $set: student },
//                 upsert: true, // Chèn mới nếu không tồn tại
//               },
//             });
//           }
//         }
//       }

//       if (studentBulkOps.length > 0) {
//         const result = await Users.bulkWrite(studentBulkOps);
//         totalRowsChanged += result.nModified; // Update the number of rows changed
//         totalRowsAdded += result.nUpserted; // Update the number of rows added
//       }

//       allStudents.push(...students);
//     }

//     // Add students to the class
//     const classSection = await Classsection.findOne({ classCode: classCode });
//     if (!classSection) {
//       throw new Error('Class section not found');
//     }

//     const studentClassBulkOps = [];
//     for (const student of allStudents) {
//       const user = await Users.findOne({ email: student.email });
//       if (user) {
//         studentClassBulkOps.push({
//           updateOne: {
//             filter: { studentID: user._id, classsectionID: classSection._id },
//             update: { $set: { studentID: user._id, classsectionID: classSection._id } },
//             upsert: true, // Chèn mới nếu không tồn tại
//           },
//         });
//       }
//     }

//     if (studentClassBulkOps.length > 0) {
//       await studentClass.bulkWrite(studentClassBulkOps);
//     }

//     const endTime = performance.now(); // End time measurement
//     const runtime = endTime - startTime; // Calculate runtime

//     console.log('Import thành công!');
//     console.log(`Thời gian chạy: ${runtime}ms`);
//     console.log(`Số dòng được thay đổi: ${totalRowsChanged}`);
//     console.log(`Số dòng được thêm mới: ${totalRowsAdded}`);
//     console.log(`Emails of newly added students: ${addedEmails.join(', ')}`);

//     return {
//       runtime,
//       totalRowsChanged,
//       totalRowsAdded,
//       addedEmails,
//       changedRows: {
//         students: allStudents
//       }
//     };
//   } catch (error) {
//     console.error('Error importing from Excel:', error);
//     throw error;
//   }
// },
// async importFromExcelStudent(filePath, classCode) {
//   try {
//     const startTime = performance.now(); // Start time measurement

//     const workbook = xlsx.readFile(filePath);
//     const sheetNames = workbook.SheetNames;

//     const allStudents = [];
//     let totalRowsChanged = 0; // Track the number of rows changed
//     let totalRowsAdded = 0; // Track the number of rows added
//     const addedEmails = []; // Track the emails of newly added students

//     for (const sheetName of sheetNames) {
//       const worksheet = workbook.Sheets[sheetName];
//       const data = xlsx.utils.sheet_to_json(worksheet);

//       // Extract attendance dates from the first row (header)
//       const headers = Object.keys(data[0]);
//       const attendanceDates = headers.slice(8).map(date => {
//         const parsedDate = moment.utc(date, 'DD/MM/YYYY').toDate();
//         if (!moment(parsedDate).isValid()) {
//           throw new Error(`Invalid date format: ${date}`);
//         }
//         return parsedDate;
//       }); // Assuming attendance dates start from the 9th column
      

//       // students
//       const students = data.map((row) => ({
//         microsoftId: uuidv4(),
//         displayName: null,
//         email: row['Email'], // Assuming the email is directly provided in the Excel file
//         accessToken: null,
//         lastLogin: null,
//         role: "6759a2efbdadd030d0029634", // Assuming this is the role ID for students
//         status: 1,
//         phone: null,
//         personalEmail: null,
//         fullName: row['Họ lót'] + ' ' + row['Tên'], // Concatenate 'Họ lót' and 'Tên'
//         userCode: row['Mã SV']
//       })).filter(student => student.email); // Bỏ qua các đối tượng có email bị null

//       const studentBulkOps = [];
//       for (const student of students) {
//         const exists = await Users.findOne({ email: student.email });
//         if (!exists) {
//           studentBulkOps.push({
//             updateOne: {
//               filter: { email: student.email },
//               update: { $set: student },
//               upsert: true, // Chèn mới nếu không tồn tại
//             },
//           });
//           addedEmails.push(student.email); // Add email to the list of newly added students
//         } else {
//           // Check if the existing student data matches the new data
//           const isSameData = exists.fullName === student.fullName && exists.userCode === student.userCode;
//           if (!isSameData) {
//             studentBulkOps.push({
//               updateOne: {
//                 filter: { email: student.email },
//                 update: { $set: student },
//                 upsert: true, // Chèn mới nếu không tồn tại
//               },
//             });
//           }
//         }
//       }

//       if (studentBulkOps.length > 0) {
//         const result = await Users.bulkWrite(studentBulkOps);
//         totalRowsChanged += result.nModified; // Update the number of rows changed
//         totalRowsAdded += result.nUpserted; // Update the number of rows added
//       }
//       allStudents.push(...students);
//       const classSection = await Classsection.findOne({ classCode: classCode });
//       if (!classSection) {
//         throw new Error('Class section not found');
//       }

//       const studentClassBulkOps = [];
//       const attendanceBulkOps = [];
//       for (const student of allStudents) {
//         const user = await Users.findOne({ email: student.email });
//         if (user) {
//           studentClassBulkOps.push({
//             updateOne: {
//               filter: { studentID: user._id, classsectionID: classSection._id },
//               update: { $set: { studentID: user._id, classsectionID: classSection._id } },
//               upsert: true, // Chèn mới nếu không tồn tại
//             },
//           });

//           // Find or create studentClass entry
//           const studentClassEntry = await studentClass.findOneAndUpdate(
//             { studentID: user._id, classsectionID: classSection._id },
//             { $set: { studentID: user._id, classsectionID: classSection._id } },
//             { upsert: true, new: true }
//           );

//           // Create attendance records for each student
//           const attendanceRecords = attendanceDates.map(date => ({
//             date: date,
//             time: null,
//             status: null
//           }));

//           attendanceBulkOps.push({
//             updateOne: {
//               filter: { studentclasssection: studentClassEntry._id },
//               update: { $set: { studentclasssection: studentClassEntry._id, attendanceRecords: attendanceRecords } },
//               upsert: true, // Chèn mới nếu không tồn tại
//             },
//           });
//         }
//       }

//       if (studentClassBulkOps.length > 0) {
//         await studentClass.bulkWrite(studentClassBulkOps);
//       }

//       if (attendanceBulkOps.length > 0) {
//         await Attendance.bulkWrite(attendanceBulkOps);
//       }
//     }

//     const endTime = performance.now(); // End time measurement
//     const runtime = endTime - startTime; // Calculate runtime

//     console.log('Import thành công!');
//     console.log(`Thời gian chạy: ${runtime}ms`);
//     console.log(`Số dòng được thay đổi: ${totalRowsChanged}`);
//     console.log(`Số dòng được thêm mới: ${totalRowsAdded}`);
//     console.log(`Emails of newly added students: ${addedEmails.join(', ')}`);

//     return {
//       runtime,
//       totalRowsChanged,
//       totalRowsAdded,
//       addedEmails,
//       changedRows: {
//         students: allStudents
//       }
//     };
//   } catch (error) {
//     console.error('Error importing from Excel:', error);
//     throw error;
//   }
// }
async importFromExcelStudent(filePath, classCode) {
  try {
    const startTime = performance.now(); // Start time measurement

    const workbook = xlsx.readFile(filePath);
    const sheetNames = workbook.SheetNames;

    const allStudents = [];
    let totalRowsChanged = 0; // Track the number of rows changed
    let totalRowsAdded = 0; // Track the number of rows added
    const addedEmails = []; // Track the emails of newly added students to studentClass for the specified classCode
    const duplicateEmails = []; // Track the emails of duplicate students in studentClass

    for (const sheetName of sheetNames) {
      const worksheet = workbook.Sheets[sheetName];
      const data = xlsx.utils.sheet_to_json(worksheet);

      // Extract attendance dates from the first row (header)
      const headers = Object.keys(data[0]);
      const attendanceDates = headers.slice(8).map(date => {
        const parsedDate = moment.utc(date, 'DD/MM/YYYY').toDate();
        if (!moment(parsedDate).isValid()) {
          throw new Error(`Invalid date format: ${date}`);
        }
        return parsedDate;
      }); // Assuming attendance dates start from the 9th column

      // students
      const students = data.map((row) => ({
        microsoftId: uuidv4(),
        displayName: null,
        email: row['Email'], // Assuming the email is directly provided in the Excel file
        accessToken: null,
        lastLogin: null,
        role: "6759a2efbdadd030d0029634", // Assuming this is the role ID for students
        status: 1,
        phone: null,
        personalEmail: null,
        fullName: row['Họ lót'] + '' + row['Tên'], // Concatenate 'Họ lót' and 'Tên'
        userCode: row['Mã SV']
      })).filter(student => student.email); // Bỏ qua các đối tượng có email bị null

      const studentBulkOps = [];
      for (const student of students) {
        const exists = await Users.findOne({ email: student.email });
        if (!exists) {
          studentBulkOps.push({
            updateOne: {
              filter: { email: student.email },
              update: { $set: student },
              upsert: true, // Chèn mới nếu không tồn tại
            },
          });
        } else {
          // Check if the existing student data matches the new data
          const isSameData = exists.fullName === student.fullName && exists.userCode === student.userCode;
          if (!isSameData) {
            studentBulkOps.push({
              updateOne: {
                filter: { email: student.email },
                update: { $set: student },
                upsert: true, // Chèn mới nếu không tồn tại
              },
            });
          }
        }
      }

      if (studentBulkOps.length > 0) {
        const result = await Users.bulkWrite(studentBulkOps);
        totalRowsChanged += result.nModified; // Update the number of rows changed
        totalRowsAdded += result.nUpserted; // Update the number of rows added
      }
      allStudents.push(...students);
      const classSection = await Classsection.findOne({ classCode: classCode });
      if (!classSection) {
        throw new Error('Class section not found');
      }

      const studentClassBulkOps = [];
      const attendanceBulkOps = [];
      for (const student of allStudents) {
        const user = await Users.findOne({ email: student.email });
        if (user) {
          const studentClassExists = await studentClass.findOne({ studentID: user._id, classsectionID: classSection._id });
          if (studentClassExists) {
            duplicateEmails.push({email: student.email, fullName: student.fullName}); // Add email to the list of duplicate students in studentClass
          } else {
            studentClassBulkOps.push({
              updateOne: {
                filter: { studentID: user._id, classsectionID: classSection._id },
                update: { $set: { studentID: user._id, classsectionID: classSection._id } },
                upsert: true, // Chèn mới nếu không tồn tại
              },
            });
            addedEmails.push({email: student.email, fullName: student.fullName}); // Add email to the list of newly added students to studentClass

            // Find or create studentClass entry
            const studentClassEntry = await studentClass.findOneAndUpdate(
              { studentID: user._id, classsectionID: classSection._id },
              { $set: { studentID: user._id, classsectionID: classSection._id } },
              { upsert: true, new: true }
            );

            // Create attendance records for each student
            const attendanceRecords = attendanceDates.map(date => ({
              date: date,
              time: null,
              status: null
            }));

            attendanceBulkOps.push({
              updateOne: {
                filter: { studentclasssection: studentClassEntry._id },
                update: { $set: { studentclasssection: studentClassEntry._id, attendanceRecords: attendanceRecords } },
                upsert: true, // Chèn mới nếu không tồn tại
              },
            });
          }
        }
      }

      if (studentClassBulkOps.length > 0) {
        await studentClass.bulkWrite(studentClassBulkOps);
      }

      if (attendanceBulkOps.length > 0) {
        await Attendance.bulkWrite(attendanceBulkOps);
      }
    }

    const endTime = performance.now(); // End time measurement
    const runtime = endTime - startTime; // Calculate runtime

    console.log('Import thành công!');
    console.log(`Thời gian chạy: ${runtime}ms`);
    console.log(`Số dòng được thay đổi: ${totalRowsChanged}`);
    console.log(`Số dòng được thêm mới: ${totalRowsAdded}`);
    console.log(`Emails of newly added students to studentClass for classCode ${classCode}: ${addedEmails.join(', ')}`);
    console.log(`Emails of duplicate students in studentClass: ${duplicateEmails.join(', ')}`);

    return {
      runtime,
      totalRowsChanged,
      totalRowsAdded,
      addedEmails, // Include newly added emails to studentClass in the return object
      duplicateEmails, // Include duplicate emails in the return object
      changedRows: {
        students: allStudents
      }
    };
  } catch (error) {
    console.error('Error importing from Excel:', error);
    throw error;
  }
}
  
  // Các phương thức khác nếu cần
  // const classSections = data.map((row) => ({
  //   MaGocLHP: row['MaGocLHP'],
  //   MaMH: row['Mã MH'],
  //   MaLHP: row['Mã LHP'],
  //   TenHP: row['Tên HP'],
  //   SoTC: row['Số TC'],
  //   LoaiHP: row['Loại HP'],
  //   MaLop: row['Mã Lớp'],
  //   TSMH: row['TSMH'],
  //   SoTietDaXep: row['Số Tiết Đã xếp'],
  //   Thu: row['Thứ'],
  //   TietBD: row['Tiết BĐ'],
  //   SoTiet: row['Số Tiết'],
  //   TietHoc: row['Tiết Học'],
  //   Phong: row['Phòng'],
  //   PH_X: row['PH_X'],
  //   SucChua: row['Sức Chứa'],
  //   SiSoTKB: row['SiSoTKB'],
  //   Trong: row['Trống'],
  //   TinhTrangLHP: row['Tình Trạng LHP'],
  //   TuanHoc2: row['TuanHoc2'],
  //   ThuS: row['ThuS'],
  //   TietS: row['TietS'],
  //   SoSVDK: row['Số SVĐK'],
  //   TuanBD: row['Tuần BD'],
  //   TuanKT: row['Tuần KT'],
  //   GhiChu1: row['Ghi Chú 1'],
  //   GhiChu2: row['Ghi chú 2'],
  // }));
};

module.exports = ClasssectionDAO;
