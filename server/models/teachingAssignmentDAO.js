const mongoose = require('mongoose');
const teachingAssignment = require('./teachingAssignment'); // Import the teachingAssignment model
const Users = require('./User'); // Import the Users model
const Classsection = require('./Classsection'); // Import mô hình Classsection
const { populate } = require('./Role');
const studentClass = require('./studentClass');



const teachingAssignmentDAO = {
  async selectAll() {
    try {
      const teachingAssignments = await teachingAssignment.find().exec();
      return teachingAssignments;
    } catch (error) {
      console.error('Error fetching teaching Assignments:', error);
      throw error;
    }
  },
  async insert(teachingAssignments) {
    try {
      teachingAssignments._id = new mongoose.Types.ObjectId();
      const result = await teachingAssignment.create(teachingAssignments);
      // console.log('Inserted teaching assignment:', result); // Log the result
      return result;
    } catch (error) {
      console.error('Error inserting teaching assignment:', error);
      throw error;
    }
  },

  async getUnregisteredLecturers(subjecttermID) {
    try {
      if (!mongoose.Types.ObjectId.isValid(subjecttermID)) {
        throw new Error('Invalid subjecttermID');
      }
  
      // Fetch all lecturers (assuming role 'lecturer' is used to identify lecturers)
      const allLecturers = await Users.find({ role: '67593968b4c9c77f87657a18' });
  
      // Fetch lecturers already registered for the subject
      const registeredLecturers = await teachingAssignment.find({ subjecttermID: subjecttermID }).select('teacherID');
  
      // Extract registered lecturer IDs
      const registeredLecturerIds = registeredLecturers.map(assignment => assignment.teacherID.toString());
  
      // Filter out registered lecturers from all lecturers
      const unregisteredLecturers = allLecturers.filter(lecturer => !registeredLecturerIds.includes(lecturer._id.toString()));
  
      return unregisteredLecturers;
    } catch (error) {
      console.error('Error fetching unregistered lecturers:', error);
      throw error;
    }
  },
  async getTeacherAssignments(subjecttermID) {
    try {
      if (!mongoose.Types.ObjectId.isValid(subjecttermID)) {
        throw new Error('Invalid subjecttermID format');
      }
      const objectId = new mongoose.Types.ObjectId(subjecttermID);
      const assignments = await teachingAssignment.find({ subjecttermID: objectId })
        .populate('teacherID', 'email fullName phone');
      return assignments;
    } catch (error) {
      console.error('Error fetching teacher assignments:', error);
      throw error;
    }
  },
  async deleteAssignment(assignmentID) {
    try {
      if (!mongoose.Types.ObjectId.isValid(assignmentID)) {
        throw new Error('Invalid assignmentID format');
      }
      const result = await teachingAssignment.findByIdAndDelete(assignmentID);
      if (!result) {
        throw new Error('Assignment not found');
      }
      return result;
    } catch (error) {
      console.error('Error deleting assignment:', error);
      throw error;
    }
  },
  async registerClassSections(subjecttermID, teacherID, classsectionIDs) {
    try {
      if (!mongoose.Types.ObjectId.isValid(subjecttermID) || !mongoose.Types.ObjectId.isValid(teacherID)) {
        throw new Error('Invalid subjecttermID or teacherID format');
      }
      const subjectObjectId = new mongoose.Types.ObjectId(subjecttermID);
      const teacherObjectId = new mongoose.Types.ObjectId(teacherID);
      await teachingAssignment.updateOne(
        { subjecttermID: subjectObjectId, teacherID: teacherObjectId },
        { $addToSet: { classsectionID: { $each: classsectionIDs } } }, // Add new classsectionIDs to the existing array
        { upsert: true } // This option creates a new document if no document matches the filter
      );
      return { message: 'Registration successful' };
    } catch (error) {
      console.error('Error registering class sections:', error);
      throw error;
    }
  },

  // async getUnassignedClassSections(subjectID, subjectCode) {
  //   try {
  //     if (!mongoose.Types.ObjectId.isValid(subjectID)) {
  //       throw new Error('Invalid subjectID format');
  //     }
  
  //     const objectId = new mongoose.Types.ObjectId(subjectID);
  //     const regex = new RegExp(`^${subjectCode}_\\d+`, 'i'); // Case-insensitive regex to match classCode with subjectCode followed by an underscore and digits
  
  //     const allClassSections = await Classsection.find({ classCode: { $regex: regex } });
  //     const registeredAssignments = await teachingAssignment.find({ subjectID: objectId }).select('classsectionID');
  //     const registeredClassSectionIds = registeredAssignments.flatMap(assignment => assignment.classsectionID.map(id => id.toString()));
  //     const unassignedClassSections = allClassSections.filter(section => !registeredClassSectionIds.includes(section._id.toString()));
  
  //     return unassignedClassSections;
  //   } catch (error) {
  //     console.error('Error fetching unassigned class sections:', error);
  //     throw error;
  //   }
  // },


  async getUnassignedClassSections(subjecttermID, subjectTermCode) {
    try {
      if (!mongoose.Types.ObjectId.isValid(subjecttermID)) {
        throw new Error('Invalid subjecttermID format');
      }
  
      const objectId = new mongoose.Types.ObjectId(subjecttermID);
      const regex = new RegExp(`^${subjectTermCode}_\\d+`, 'i'); // Case-insensitive regex to match classCode with subjectTermCode followed by an underscore and digits
  
      const allClassSections = await Classsection.find({ classCode: { $regex: regex } });
      const registeredAssignments = await teachingAssignment.find({ subjecttermID: objectId }).select('classsectionID');
      const registeredClassSectionIds = registeredAssignments.flatMap(assignment => assignment.classsectionID.map(id => id.toString()));
      const unassignedClassSections = allClassSections.filter(section => !registeredClassSectionIds.includes(section._id.toString()));
  
      return unassignedClassSections;
    } catch (error) {
      console.error('Error fetching unassigned class sections:', error);
      throw error;
    }
  },
  
  async getAllLecturersFromAssignments() {
    try {
      const assignments = await teachingAssignment.find()
        .populate('teacherID', 'email displayName phone role')
        .populate('subjectID', 'subjectCode subjectName credit major term')
        .populate('classsectionID', 'classCode classType schoolDay lesson');
      
      const lecturers = assignments.map(assignment => ({
        teacher: assignment.teacherID,
        subject: assignment.subjectID,
        classsection: assignment.classsectionID
      }));
      
      return lecturers;
    } catch (error) {
      console.error('Error fetching lecturers from assignments:', error);
      throw error;
    }
  },
  
  async getClassSectionsByTeacherID(teacherID) {
    try {
      if (!mongoose.Types.ObjectId.isValid(teacherID)) {
        throw new Error('Invalid teacherID format');
      }
      
      const assignments = await teachingAssignment.find({ teacherID: teacherID })
        .populate({
          path: 'classsectionID',
          populate: {
            path: 'subjecttermID',
            populate: {
              path: 'subjectID',
              select: 'subjectName'
            }
          }
        })
        .populate('teacherID', 'email displayName fullName phone');
      
      const classSections = assignments.map(assignment => assignment.classsectionID);
      
      const teacherInfo = assignments.length > 0 ? {
        email: assignments[0].teacherID.email,
        displayName: assignments[0].teacherID.displayName,
        fullName: assignments[0].teacherID.fullName,
        phone: assignments[0].teacherID.phone
      } : null;
      
      return {
        teacher: teacherInfo,
        classSections: classSections.flat() // Combine all class sections into a single array
      };
    } catch (error) {
      console.error('Error fetching class sections by teacherID:', error);
      throw error;
    }
  },
  async removeClassSection(teacherID, classsectionID) {
    try {
      if (!mongoose.Types.ObjectId.isValid(teacherID) || !mongoose.Types.ObjectId.isValid(classsectionID)) {
        throw new Error('Invalid ID format');
      }
      const teacherObjectId = new mongoose.Types.ObjectId(teacherID);
      const classsectionObjectId = new mongoose.Types.ObjectId(classsectionID);
  
      const result = await teachingAssignment.updateMany(
        { teacherID: teacherObjectId },
        { $pull: { classsectionID: classsectionObjectId } }
      );
  
      if (result.nModified === 0) {
        throw new Error('Class section not found or already removed');
      }
  
      return { message: 'Class section removed successfully' };
    } catch (error) {
      console.error('Error removing class section:', error);
      throw error;
    }
  },


  // async getUserByClassCode(classCode) {
  //   try {
  //     // Find the class section by classCode
  //     const classSection = await Classsection.findOne({ classCode })
  //       .populate({
  //         path: 'subjecttermID',
  //         populate: [
  //           { path: 'termID', select: 'term startYear endYear' },
  //           { 
  //             path: 'subjectID', 
  //             select: 'subjectCode subjectName credit major',
  //             populate: { path: 'major', select: 'majorName subMajorName' }
  //           }
  //         ]
  //       })
  //       .exec();
  
  //     if (!classSection) {
  //       throw new Error('Class section not found');
  //     }
  
  //     // Find the teaching assignment that includes this class section
  //     const assignment = await teachingAssignment.findOne({ classsectionID: classSection._id })
  //       .populate('teacherID', 'email displayName fullName phone')
  //       .exec();
  
  //     // Combine subject and term information
  //     const subjectWithTerm = {
  //       ...classSection.subjecttermID.subjectID.toObject(),
  //       term: classSection.subjecttermID.termID
  //     };
  
  //     // Return the user and subject information, including term within subject
  //     return {
  //       teacher: assignment ? assignment.teacherID : null,
  //       subject: subjectWithTerm
  //     };
  //   } catch (error) {
  //     console.error('Error fetching user by classCode:', error);
  //     throw error;
  //   }
  // },
  async getUserByClassCode(classCode) {
    try {
      // Tìm classSection dựa trên classCode
      const classSection = await Classsection.findOne({ classCode })
        .populate({
          path: 'subjecttermID',
          populate: [
            { path: 'termID', select: 'term startYear endYear' },
            { 
              path: 'subjectID', 
              select: 'subjectCode subjectName credit major',
              populate: { path: 'major', select: 'majorName subMajorName' }
            }
          ]
        })
        .exec();
  
      if (!classSection) {
        throw new Error('Class section not found');
      }
  
      // Tìm teaching assignment bao gồm classSection này
      const assignment = await teachingAssignment.findOne({ classsectionID: classSection._id })
        .populate('teacherID', 'email displayName fullName phone')
        .exec();
  
      // Kết hợp thông tin subject, term và classCode
      const subjectWithTerm = {
        ...classSection.subjecttermID.subjectID.toObject(),
        term: classSection.subjecttermID.termID,
        classCode: classSection.classCode
      };
  
      // Trả về thông tin user và subject
      return {
        teacher: assignment ? assignment.teacherID : null,
        subject: subjectWithTerm
      };
    } catch (error) {
      console.error('Error fetching user by classCode:', error);
      throw error;
    }
  },
async getClassSectionsByTeacherIDTKB(teacherID) {
  try {
    if (!mongoose.Types.ObjectId.isValid(teacherID)) {
      throw new Error('Invalid teacherID format');
    }
    
    const assignments = await teachingAssignment.find({ teacherID: teacherID })
      .populate({
        path: 'classsectionID',
        select: 'classCode classType schoolDay lesson subjecttermID' // Include subjectID and exclude subjectName
      });
    
    const classSections = assignments.map(assignment => assignment.classsectionID);
    
    return classSections.flat(); // Combine all class sections into a single array
  } catch (error) {
    console.error('Error fetching class sections by teacherID:', error);
    throw error;
  }
},
async getAllRegisteredLecturers() {
  try {
    // Fetch all unique teacher IDs from teaching assignments
    const registeredLecturers = await teachingAssignment.distinct('teacherID');
    
    // Fetch lecturer details based on the unique teacher IDs
    const lecturers = await Users.find({ _id: { $in: registeredLecturers } });
    
    // Fetch teaching assignments with populated termID
    const assignments = await teachingAssignment.find({ teacherID: { $in: registeredLecturers } })
      .populate({
        path: 'subjecttermID',
      });

    // Map unique termIDs to each lecturer
    const lecturersWithTerms = lecturers.map(lecturer => {
      const termIDs = new Set(assignments
        .filter(assignment => assignment.teacherID.toString() === lecturer._id.toString())
        .map(assignment => assignment.subjecttermID && assignment.subjecttermID.termID.toString())
        .filter(termID => termID)); // Filter out null values
      return {
        ...lecturer.toObject(),
        termIDs: Array.from(termIDs) // Convert Set to Array
      };
    });

    return lecturersWithTerms;
  } catch (error) {
    console.error('Error fetching registered lecturers:', error);
    throw error;
  }
},
async getClassSectionsByStudentIDTKB(studentID) {
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
          select: 'subjectID',
          populate: {
            path: 'subjectID',
            select: 'subjectName'
          }
        }
      });
    
    const classSections = assignments.map(assignment => assignment.classsectionID);
    
    return classSections.flat(); // Combine all class sections into a single array
  } catch (error) {
    console.error('Error fetching class sections by studentID:', error);
    throw error;
  }
},
};
module.exports = teachingAssignmentDAO;