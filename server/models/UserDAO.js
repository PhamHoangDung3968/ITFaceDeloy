require('../utils/MongooseUtil');
const Users = require('./User');
const RegistrationImage = require('./registrationImage');


const UserDAO = {
    async selectAll() {
        try {
          const users = await Users.find().exec();
          return users;
        } catch (error) {
          console.error('Error fetching users:', error);
          throw error;
        }
      },
      async selectAllNotHaveStudent() {
        try {
            // Assuming 'sinhVienRoleId' is the ID for the "sinh viên" role
            const sinhVienRoleId = '6759a2efbdadd030d0029634'; // Replace with actual role ID

            // Query to find users excluding the "sinh viên" role
            const users = await Users.find({ role: { $ne: sinhVienRoleId } }).exec();
            return users;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    },
      async selectStudent() {
        try {
          // Assuming 'sinhVienRoleId' is the ID for the "sinh viên" role
          const sinhVienRoleId = '6759a2efbdadd030d0029634'; // Replace with actual role ID
      
          // Query to find users with the "sinh viên" role
          const users = await Users.find({ role: sinhVienRoleId }).exec();
          return users;
        } catch (error) {
          console.error('Error fetching users:', error);
          throw error;
        }
      },
      async selectLecturer() {
        try {
          // Assuming 'sinhVienRoleId' is the ID for the "sinh viên" role
          const giangvienRoleId = '67593968b4c9c77f87657a18'; // Replace with actual role ID
      
          // Query to find users with the "sinh viên" role
          const users = await Users.find({ role: giangvienRoleId }).exec();
          return users;
        } catch (error) {
          console.error('Error fetching users:', error);
          throw error;
        }
      },
      async selectAdminAndBCNK() {
        try {
          // Assuming 'adminRoleId' and 'bcnkRoleId' are the IDs for the "admin" and "bcnk" roles
          const adminRoleId = '67a2333630fb4a619fcc4d4c'; // Replace with actual admin role ID
          const bcnkRoleId = '6759a318bdadd030d0029639'; // Replace with actual bcnk role ID
    
          // Query to find users with either the "admin" or "bcnk" role
          const users = await Users.find({ role: { $in: [adminRoleId, bcnkRoleId] } }).exec();
          return users;
        } catch (error) {
          console.error('Error fetching users:', error);
          throw error;
        }
      },
      async insert(user) {
        try {
          const mongoose = require('mongoose');
          user._id = new mongoose.Types.ObjectId();
          const result = await Users.create(user);
          return result;
        } catch (error) {
          console.error('Error inserting user:', error);
          throw error;
        }
      },
    async delete(_id) {
      try {
        const result = await Users.findByIdAndRemove(_id);
        return result;
      } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
      }
    },
  
    async updateRole(userId, newRoleId) {
      try {
        const result = await Users.findByIdAndUpdate(userId, { role: newRoleId }, { new: true });
        return result;
      } catch (error) {
        console.error('Error updating user role:', error);
        throw error;
      }
    },
    async updateStatus(userId, newStatus) {
      try {
        console.log('userId:', userId);
        console.log('newStatus:', newStatus);
    
        if (!userId || (newStatus !== 1 && newStatus !== 0)) {
          throw new Error('Invalid input');
        }
    
        const statusValue = newStatus === 1 ? 1 : 0; // Convert status to number
        const result = await Users.findByIdAndUpdate(userId, { status: statusValue }, { new: true });
    
        if (!result) {
          throw new Error('User not found');
        }
    
        return result;
      } catch (error) {
        console.error('Error updating user status:', error);
        throw error;
      }
    },
    async selectByID(_id) {
      try {
        const user = await Users.findById(_id).exec();
        return user;
      } catch (error) {
        console.error('Error fetching user by ID:', error);
        throw error;
      }
    },
    async update(user) {
          try {
            const newvalues = {  fullName: user.fullName,phone: user.phone, personalEmail: user.personalEmail, typeLecturer: user.typeLecturer,userCode: user.userCode}
            const result = await Users.findByIdAndUpdate(user._id, newvalues, { new: true });
            return result;
          } catch (error) {
            console.error('Error updating role:', error);
            throw error;
          }
      },
      //............
      async checkStudentImage(studentID) {
        try {
            const registrationImage = await RegistrationImage.findOne({ studentID: studentID }).exec();
            return registrationImage && registrationImage.images.length > 0;
        } catch (error) {
            console.error('Error checking student image:', error);
            throw error;
        }
    },
};
module.exports = UserDAO;