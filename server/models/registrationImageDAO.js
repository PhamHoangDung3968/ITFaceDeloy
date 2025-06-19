require('../utils/MongooseUtil');
const RegistrationImage = require('./registrationImage');
const User = require('./User'); // Đảm bảo bạn đã require model User
const crypto = require('crypto');
const MyConstants = require('../utils/MyConstants'); // Cập nhật đường dẫn đúng
const algorithm = 'aes-256-cbc';
const secretKey = crypto.createHash('sha256').update(MyConstants.ENCRYPTION_SECRET).digest(); // Tạo key 32 bytes
// 🔐 Hàm mã hóa ảnh
function encrypt(text) {
    const iv = crypto.randomBytes(16); // Tạo IV ngẫu nhiên
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted; // Ghép IV và dữ liệu mã hóa
}
function decrypt(encryptedText) {
    const [ivHex, encryptedData] = encryptedText.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}
function isEncrypted(text) {
    return text.includes(':') && /^[0-9a-f]{32}$/i.test(text.split(':')[0]);
}


const registrationImageDAO = {
    // async insert(userCode, imageUrl) {
    //     try {
    //         const mongoose = require('mongoose');
            
    //         // Tìm người dùng theo userCode
    //         const user = await User.findOne({ userCode: userCode });
    //         if (!user) {
    //             throw new Error('User not found');
    //         }

    //         // Tìm tài liệu registrationImage theo studentID
    //         let registrationImage = await RegistrationImage.findOne({ studentID: user._id });

    //         if (registrationImage) {
    //             // Nếu đã có tài liệu, thêm ảnh mới vào mảng
    //             registrationImage.images.push(imageUrl);
    //         } else {
    //             // Nếu chưa có tài liệu, tạo mới
    //             registrationImage = new RegistrationImage({
    //                 _id: new mongoose.Types.ObjectId(),
    //                 studentID: user._id,
    //                 images: [imageUrl]
    //             });
    //         }

    //         // Lưu tài liệu vào cơ sở dữ liệu
    //         const result = await registrationImage.save();
    //         return result;
    //     } catch (error) {
    //         console.error('Error inserting registration image:', error);
    //         throw error;
    //     }
    // },
    async insert(userCode, imageUrl) {
        try {
            const mongoose = require('mongoose');
            // Tìm người dùng theo userCode
            const user = await User.findOne({ userCode: userCode });
            if (!user) {
                throw new Error('User not found');
            }
            // Mã hóa URL ảnh
            const encryptedImageUrl = encrypt(imageUrl);
            // Tìm tài liệu registrationImage theo studentID
            let registrationImage = await RegistrationImage.findOne({ studentID: user._id });
            if (registrationImage) {
                // Nếu đã có tài liệu, thêm ảnh mới vào mảng
                registrationImage.images.push(encryptedImageUrl);
            } else {
                // Nếu chưa có tài liệu, tạo mới
                registrationImage = new RegistrationImage({
                    _id: new mongoose.Types.ObjectId(),
                    studentID: user._id,
                    images: [encryptedImageUrl]
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

    // async getImagesByUserId(userId) {
    //     try {
    //         // Tìm tài liệu registrationImage theo studentID
    //         const registrationImage = await RegistrationImage.findOne({ studentID: userId });
    //         if (!registrationImage) {
    //             throw new Error('No images found for this user');
    //         }
    //         return registrationImage.images;
    //     } catch (error) {
    //         console.error('Error fetching images:', error);
    //         throw error;
    //     }
    // },
    async getImagesByUserId(userId) {
    try {
        const registrationImage = await RegistrationImage.findOne({ studentID: userId });
        if (!registrationImage) {
            throw new Error('No images found for this user');
        }

        // Giải mã nếu cần
        const decryptedImages = registrationImage.images.map(image => {
            return isEncrypted(image) ? decrypt(image) : image;
        });

        return decryptedImages;
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