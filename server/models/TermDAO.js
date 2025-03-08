require('../utils/MongooseUtil');
const Term = require('./Term'); // Import mô hình Role

const TermDAO = {
  async selectAll() {
    try {
      const terms = await Term.find().exec();
      return terms;
    } catch (error) {
      console.error('Error fetching terms:', error);
      throw error;
    }
  },

  async insert(term) {
    try {
      const mongoose = require('mongoose');
      term._id = new mongoose.Types.ObjectId();
      const result = await Term.create(term);
      return result;
    } catch (error) {
      console.error('Error inserting term:', error);
      throw error;
    }
  },

  async updateStatus(termId, newStatus) {
    try {
      if (!termId || (newStatus !== 1 && newStatus !== 0)) {
        throw new Error('Invalid input');
      }
  
      // Convert status to number
      const statusValue = newStatus === 1 ? 1 : 0;
  
      // Tìm và cập nhật trạng thái của ngành
      const result = await Term.findByIdAndUpdate(termId, { status: statusValue }, { new: true });
  
      if (!result) {
        throw new Error('Term not found');
      }
  
      return result;
    } catch (error) {
      console.error('Error updating Term status:', error);
      throw error;
    }
  },
  async delete(_id) {
    try {
      const result = await Term.findByIdAndRemove(_id);
      return result;
    } catch (error) {
      console.error('Error deleting Term:', error);
      throw error;
    }
  },
  async selectByID(_id) {
    try {
      const term = await Term.findById(_id).exec();
      return term;
    } catch (error) {
      console.error('Error fetching term by ID:', error);
      throw error;
    }
  },
  async update(term) {
    try {
      const newvalues = { term: term.term, startYear: term.startYear, endYear: term.endYear, startDate: term.startDate, endDate: term.endDate  }
      const result = await Term.findByIdAndUpdate(term._id, newvalues, { new: true });
      return result;
    } catch (error) {
      console.error('Error updating Term:', error);
      throw error;
    }
},
async selectByTermName(term) {
  try {
    const terms = await Term.find({ term }).exec();
    return terms;
  } catch (error) {
    console.error('Error fetching subjects by term:', error);
    throw error;
  }
}
  

};

module.exports = TermDAO;