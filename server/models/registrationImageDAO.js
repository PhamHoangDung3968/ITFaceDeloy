require('../utils/MongooseUtil');
const RegistrationImage = require('./registrationImage');
const User = require('./User'); // Đảm bảo bạn đã require model User

const registrationImageDAO = {
    async insert(userCode, imageUrl) {
        try {
            const mongoose = require('mongoose');
            
            // Tìm người dùng theo userCode
            const user = await User.findOne({ userCode: userCode });
            if (!user) {
                throw new Error('User not found');
            }

            // Tìm tài liệu registrationImage theo studentID
            let registrationImage = await RegistrationImage.findOne({ studentID: user._id });

            if (registrationImage) {
                // Nếu đã có tài liệu, thêm ảnh mới vào mảng
                registrationImage.images.push(imageUrl);
            } else {
                // Nếu chưa có tài liệu, tạo mới
                registrationImage = new RegistrationImage({
                    _id: new mongoose.Types.ObjectId(),
                    studentID: user._id,
                    images: [imageUrl]
                });
            }

            // Lưu tài liệu vào cơ sở dữ liệu
            const result = await registrationImage.save();
            return result;
        } catch (error) {
            console.error('Error inserting registration image:', error);
            throw error;
        }
    },
    async getImagesByUserId(userId) {
        try {
            // Tìm tài liệu registrationImage theo studentID
            const registrationImage = await RegistrationImage.findOne({ studentID: userId });
            if (!registrationImage) {
                throw new Error('No images found for this user');
            }
            return registrationImage.images;
        } catch (error) {
            console.error('Error fetching images:', error);
            throw error;
        }
    },
    //...........
        async findOne1(query) {
            try {
                return await RegistrationImage.findOne(query).exec();
            } catch (error) {
                console.error('Error finding registration image:', error);
                throw error;
            }
        },
        async create1(data) {
            try {
                const registrationImage = new RegistrationImage(data);
                return await registrationImage.save();
            } catch (error) {
                console.error('Error creating registration image:', error);
                throw error;
            }
        }
};

module.exports = registrationImageDAO;