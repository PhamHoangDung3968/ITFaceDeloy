require('../utils/MongooseUtil');
const Subject = require('./Subject'); // Import mô hình Role

const SubjectDAO = {
  async selectAll() {
    try {
      const subjects = await Subject.find().exec();
      return subjects;
    } catch (error) {
      console.error('Error fetching subjects:', error);
      throw error;
    }
  },

  async insert(subject) {
    try {
      const mongoose = require('mongoose');
      subject._id = new mongoose.Types.ObjectId();
      const result = await Subject.create(subject);
      return result;
    } catch (error) {
      console.error('Error inserting subject:', error);
      throw error;
    }
  },
  async delete(_id) {
    try {
      const result = await Subject.findByIdAndRemove(_id);
      return result;
    } catch (error) {
      console.error('Error deleting Subject:', error);
      throw error;
    }
  },
  async selectByID(_id) {
    try {
      const subject = await Subject.findById(_id).exec();
      return subject;
    } catch (error) {
      console.error('Error fetching subject by ID:', error);
      throw error;
    }
  },
  async update(subject) {
    try {
      const newvalues = { subjectName: subject.subjectName, credit: subject.credit, major: subject.major  }
      const result = await Subject.findByIdAndUpdate(subject._id, newvalues, { new: true });
      return result;
    } catch (error) {
      console.error('Error updating subject:', error);
      throw error;
    }
  },
  async selectBySubjectCode(subjectCode) {
    try {
      const subjects = await Subject.find({ subjectCode }).exec();
      return subjects;
    } catch (error) {
      console.error('Error fetching subjects by subjectCode:', error);
      throw error;
    }
  }
};

module.exports = SubjectDAO;