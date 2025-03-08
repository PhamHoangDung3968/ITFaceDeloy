require('../utils/MongooseUtil');
const SubjectTerm = require('./SubjectTerm');
const Subject = require('./Subject'); // Import mô hình Role


const SubjectTermDAO = {
  async selectAll() {
    try {
      const subjectterms = await SubjectTerm.find().populate('subjectID').exec();
      return subjectterms;
    } catch (error) {
      console.error('Error fetching subject terms:', error);
      throw error;
    }
  },
  async insert(subjectterm) {
    try {
      const mongoose = require('mongoose');
      subjectterm._id = new mongoose.Types.ObjectId();
      const result = await SubjectTerm.create(subjectterm);
      return result;
    } catch (error) {
      console.error('Error inserting subject term:', error);
      throw error;
    }
  },
  async delete(_id) {
    try {
      const result = await SubjectTerm.findByIdAndRemove(_id);
      return result;
    } catch (error) {
      console.error('Error deleting Subject term:', error);
      throw error;
    }
  },
  async selectByID(_id) {
    try {
      const subjectterm = await SubjectTerm.findById(_id).exec();
      return subjectterm;
    } catch (error) {
      console.error('Error fetching subject term by ID:', error);
      throw error;
    }
  },
  async update(subjectterm) {
    try {
      const newvalues = { subjectTermCode: subjectterm.subjectTermCode, subjectID: subjectterm.subjectID, termID: subjectterm.termID  }
      const result = await SubjectTerm.findByIdAndUpdate(subjectterm._id, newvalues, { new: true });
      return result;
    } catch (error) {
      console.error('Error updating subject term:', error);
      throw error;
    }
  },
//   async selectBySubjectCode(subjectCode) {
//     try {
//       const subjects = await Subject.find({ subjectCode }).exec();
//       return subjects;
//     } catch (error) {
//       console.error('Error fetching subjects by subjectCode:', error);
//       throw error;
//     }
//   }
async selectByIDtest(_id) {
  try {
    const mongoose = require('mongoose');
    const subjectterm = await SubjectTerm.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(_id) } },
      {
        $lookup: {
          from: 'subjects',
          localField: 'subjectID',
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
          localField: 'termID',
          foreignField: '_id',
          as: 'term'
        }
      },
      { $unwind: '$term' },
      {
        $project: {
          _id: 0,
          subjectTermCode: 1,
          subjectCode: '$subject.subjectCode',
          subjectName: '$subject.subjectName',
          credit: '$subject.credit',
          majorName: '$major.majorName',
          term: '$term.term',
          startYear: '$term.startYear',
          endYear: '$term.endYear',
          startWeek: '$term.startWeek',
          startDate: '$term.startDate',
          maximumLessons: '$term.maximumLessons',
          maximumClasses: '$term.maximumClasses',
          status: '$term.status'
        }
      }
    ]).exec();
    return subjectterm[0];
  } catch (error) {
    console.error('Error fetching subject term by ID:', error);
    throw error;
  }
}
};

module.exports = SubjectTermDAO;