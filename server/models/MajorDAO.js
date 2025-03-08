require('../utils/MongooseUtil');
const Major = require('./Major'); // Import mô hình Role

const MajorDAO = {
  async selectAll() {
    try {
      const majors = await Major.find().exec();
      return majors;
    } catch (error) {
      console.error('Error fetching majors:', error);
      throw error;
    }
  },

  async insert(major) {
    try {
      const mongoose = require('mongoose');
      major._id = new mongoose.Types.ObjectId();
      const result = await Major.create(major);
      return result;
    } catch (error) {
      console.error('Error inserting major:', error);
      throw error;
    }
  },

  async updateStatus(majorId, newStatus) {
    try {
      if (!majorId || (newStatus !== 1 && newStatus !== 0)) {
        throw new Error('Invalid input');
      }
  
      // Convert status to number
      const statusValue = newStatus === 1 ? 1 : 0;
  
      // Tìm và cập nhật trạng thái của ngành
      const result = await Major.findByIdAndUpdate(majorId, { status: statusValue }, { new: true });
  
      if (!result) {
        throw new Error('Major not found');
      }
  
      return result;
    } catch (error) {
      console.error('Error updating major status:', error);
      throw error;
    }
  },
  async delete(_id) {
    try {
      const result = await Major.findByIdAndRemove(_id);
      return result;
    } catch (error) {
      console.error('Error deleting major:', error);
      throw error;
    }
  },
  async selectByID(_id) {
    try {
      const major = await Major.findById(_id).exec();
      return major;
    } catch (error) {
      console.error('Error fetching major by ID:', error);
      throw error;
    }
  },
  async update(major) {
    try {
      const newvalues = { majorName: major.majorName, subMajorName: major.subMajorName }
      const result = await Major.findByIdAndUpdate(major._id, newvalues, { new: true });
      return result;
    } catch (error) {
      console.error('Error updating major:', error);
      throw error;
    }
},
async selectByMajorName(majorName) {
  try {
    const majors = await Major.find({ majorName }).exec();
    return majors;
  } catch (error) {
    console.error('Error fetching subjects by majors name:', error);
    throw error;
  }
}
  

//   async update(role) {
//     try {
//       const newValues = { tenrole: role.tenrole };
//       const result = await Role.findByIdAndUpdate(role._id, newValues, { new: true });
//       return result;
//     } catch (error) {
//       console.error('Error updating role:', error);
//       throw error;
//     }
//   },




};

module.exports = MajorDAO;