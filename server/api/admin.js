const express = require('express');
const router = express.Router();
const multer = require('multer');
const xlsx = require('xlsx');
const fs = require('fs');
const bodyParser = require('body-parser');
const qrcode = require('qrcode');
const jwt = require('jsonwebtoken');
// utils
const JwtUtil = require('../utils/JwtUtil');
const { v4: uuidv4 } = require('uuid');
const upload = multer({ dest: 'uploads/' });
const { Readable } = require('stream'); // Thêm dòng này
const axios = require('axios');


// utils
const EmailUtil = require('../utils/EmailUtil');
// daos
const RoleDAO = require('../models/RoleDAO'); 
const UserDAO = require('../models/UserDAO'); 
const MajorDAO = require('../models/MajorDAO'); 
const TermDAO = require('../models/TermDAO'); 
const SubjectDAO = require('../models/SubjectDAO'); 
const SubjectTermDAO = require('../models/SubjectTermDAO'); 
const teachingAssignmentDAO = require('../models/teachingAssignmentDAO'); 
const ClasssectionDAO = require('../models/ClasssectionDAO'); 
const studentClassDAO = require('../models/studentClassDAO'); 
const registrationImageDAO = require('../models/registrationImageDAO'); 



const secretKey = 'dung123456'; // Khóa bí mật để mã hóa token
const validQrCodes = {}; // Giả lập cơ sở dữ liệu mã QR hợp lệ

//-------------------------------------------------ver01---------------------------------------
// router.post('/generate/:classcode', (req, res) => {
//   const classcode = req.params.classcode;
//   const { url } = req.body; // Get the URL from the request body
//   const token = jwt.sign({ classcode }, secretKey, { expiresIn: '30m' });

//   qrcode.toDataURL(url, (err, qr) => {
//     if (err) return res.status(500).json({ error: 'Error generating QR code' });

//     // Return the QR code image and token as JSON
//     res.json({
//       token,
//       qrCodeImage: qr
//     });
//   });

//   // Save the QR code to a mock database
//   validQrCodes[classcode] = token;
// });
//-------------------------------------------------ver02---------------------------------------
const tokens = {}; // Định nghĩa biến tokens ở phạm vi toàn cục
// router.post('/generate/:classcode', (req, res) => {
//     const classcode = req.params.classcode;
//     const { url } = req.body;
//     const token = jwt.sign({ classcode }, secretKey, { expiresIn: '30m' });
//     const deviceUUID = uuidv4(); // Tạo UUID duy nhất cho thiết bị

//     tokens[token] = { classcode, used: false, deviceUUID }; // Lưu trữ token và UUID

//     qrcode.toDataURL(url, (err, qr) => {
//         if (err) return res.status(500).json({ error: 'Error generating QR code' });

//         res.json({
//             token,
//             qrCodeImage: qr,
//             deviceUUID // Trả về UUID cho thiết bị
//         });
//     });
// });
//-------------------------------------------------ver03---------------------------------------
// router.post('/generate/:classcode/:day', (req, res) => {
//   const classcode = req.params.classcode;
//   const day = req.params.day; // Nhận ngày từ URL
//   const { url } = req.body;
//   const token = jwt.sign({ classcode, day }, secretKey, { expiresIn: '30m' });
//   const deviceUUID = uuidv4(); // Tạo UUID duy nhất cho thiết bị

//   tokens[token] = { classcode, used: false, deviceUUID, day }; // Lưu trữ token, UUID và ngày tháng

//   qrcode.toDataURL(url, (err, qr) => {
//       if (err) return res.status(500).json({ error: 'Error generating QR code' });

//       res.json({
//           token,
//           qrCodeImage: qr,
//           deviceUUID, // Trả về UUID cho thiết bị
//           day // Trả về ngày tháng
//       });
//   });
// });





// router.post('/generate/:classcode/:day', (req, res) => {
//   const classcode = req.params.classcode;
//   const day = req.params.day; // Nhận ngày từ URL
//   const { url } = req.body;
//   const token = jwt.sign({ classcode, day }, secretKey, { expiresIn: '30m' });
//   const deviceUUID = uuidv4(); // Tạo UUID duy nhất cho thiết bị

//   tokens[token] = { classcode, used: false, deviceUUID, day }; // Lưu trữ token, UUID và ngày tháng

//   // Include the day in the URL for QR code generation
//   const qrData = `${url}?day=${day}`;

//   qrcode.toDataURL(qrData, (err, qr) => {
//       if (err) return res.status(500).json({ error: 'Error generating QR code' });

//       res.json({
//           token,
//           qrCodeImage: qr,
//           deviceUUID, // Trả về UUID cho thiết bị
//           day // Trả về ngày tháng
//       });
//   });
// });
// router.post('/generate/:classcode/:day', (req, res) => {
//   const classcode = req.params.classcode;
//   const day = req.params.day; // Nhận ngày từ URL
//   const { url } = req.body;
//   const token = jwt.sign({ classcode, day }, secretKey, { expiresIn: '10s' });
//   const deviceUUID = uuidv4(); // Tạo UUID duy nhất cho thiết bị

//   tokens[token] = { classcode, used: false, deviceUUID, day }; // Lưu trữ token, UUID và ngày tháng

//   const qrData = `${url}/admin/?classcode=${classcode}&day=${day}&timestamp=${Date.now()}`;
//   qrcode.toDataURL(qrData, (err, qr) => {
//     if (err) return res.status(500).json({ error: 'Error generating QR code' });
//     res.json({
//       token,
//       qrCodeImage: qr,
//       deviceUUID, // Trả về UUID cho thiết bị
//       day // Trả về ngày tháng
//     });
//   });
// });

// router.get('/generate/:classcode/:day/qr', (req, res) => {
//   const classcode = req.params.classcode;
//   const day = req.params.day; // Nhận ngày từ URL
//   const { url } = req.query;

//   const qrData = `${url}/admin/?classcode=${classcode}&day=${day}&timestamp=${Date.now()}`;
//   qrcode.toDataURL(qrData, (err, qr) => {
//     if (err) return res.status(500).json({ error: 'Error generating QR code' });
//     res.json({
//       qrCodeImage: qr,
//       day // Trả về ngày tháng
//     });
//   });
// });
router.post('/generate/:classcode/:day', (req, res) => {
  const classcode = req.params.classcode;
  const day = req.params.day; // Nhận ngày từ URL
  const { url } = req.body;
  const deviceUUID = uuidv4(); // Tạo UUID duy nhất cho thiết bị

  const token = jwt.sign({ classcode, day }, secretKey, { expiresIn: '10s' });
  tokens[token] = { classcode, used: false, deviceUUID, day }; // Lưu trữ token, UUID và ngày tháng

  const qrData = `${url}/admin/?classcode=${classcode}&day=${day}&token=${token}`;
  qrcode.toDataURL(qrData, (err, qr) => {
    if (err) return res.status(500).json({ error: 'Error generating QR code' });

    res.json({
      token,
      qrCodeImage: qr,
      deviceUUID, // Trả về UUID cho thiết bị
      day // Trả về ngày tháng
    });
  });
});

router.get('/generate/:classcode/:day/qr', (req, res) => {
  const classcode = req.params.classcode;
  const day = req.params.day; // Nhận ngày từ URL
  const { url } = req.query;

  const token = jwt.sign({ classcode, day }, secretKey, { expiresIn: '10s' });
  tokens[token] = { classcode, used: false, deviceUUID: uuidv4(), day }; // Lưu trữ token, UUID và ngày tháng

  const qrData = `${url}/admin/?classcode=${classcode}&day=${day}&token=${token}`;
  qrcode.toDataURL(qrData, (err, qr) => {
    if (err) return res.status(500).json({ error: 'Error generating QR code' });

    res.json({
      token,
      qrCodeImage: qr,
      day // Trả về ngày tháng
    });
  });
});


//-------------------------------------------------ver01---------------------------------------
// router.post('/scan/:classcode', (req, res) => {
//   const classcode = req.params.classcode;
//   const token = req.headers['x-access-token'];
//   const { url } = req.body; // Get the URL from the request body

//   if (!token) {
//     return res.status(403).send('No token provided.');
//   }

//   try {
//     // Log the received token for debugging
//     console.log('Received token:', token);

//     // Verify the token
//     const decoded = jwt.verify(token, secretKey);

//     // Log the decoded token for debugging
//     console.log('Decoded token:', decoded);

//     if (decoded.classcode === classcode && validQrCodes[classcode] === token) {
//       res.redirect(url); // Redirect to the URL provided in the request body
//     } else {
//       res.status(400).send('Invalid QR code');
//     }
//   } catch (error) {
//     console.error('Token verification error:', error);
//     res.status(400).send('QR code has expired or is invalid');
//   }
// });
//-------------------------------------------------ver02---------------------------------------
// router.post('/scan/:classcode', (req, res) => {
//   const classcode = req.params.classcode;
//   const token = req.headers['x-access-token'];
//   const { url, deviceUUID } = req.body; // Nhận UUID từ yêu cầu

//   if (!token) {
//       return res.status(403).send('No token provided.');
//   }

//   try {
//       console.log('Received token:', token);
//       const decoded = jwt.verify(token, secretKey);
//       console.log('Decoded token:', decoded);

//       if (tokens[token] && tokens[token].classcode === classcode && !tokens[token].used && tokens[token].deviceUUID === deviceUUID) {
//           tokens[token].used = true; // Đánh dấu token là đã sử dụng
//           res.redirect(url);
//       } else {
//           res.status(400).send('Invalid or already used QR code');
//       }
//   } catch (error) {
//       console.error('Token verification error:', error);
//       res.status(400).send('QR code has expired or is invalid');
//   }
// });




// router.post('/scan/:classcode/:day', (req, res) => {
//   const classcode = req.params.classcode;
//   const day = req.params.day; // Nhận ngày từ URL
//   const token = req.headers['x-access-token'];
//   const { url, deviceUUID } = req.body; // Nhận UUID từ yêu cầu

//   if (!token) {
//       return res.status(403).send('No token provided.');
//   }

//   try {
//       console.log('Received token:', token);
//       const decoded = jwt.verify(token, secretKey);
//       console.log('Decoded token:', decoded);

//       if (tokens[token] && tokens[token].classcode === classcode && !tokens[token].used && tokens[token].deviceUUID === deviceUUID && tokens[token].day === day) {
//           tokens[token].used = true; // Đánh dấu token là đã sử dụng
//           res.redirect(url);
//       } else {
//           res.status(400).send('Invalid or already used QR code');
//       }
//   } catch (error) {
//       console.error('Token verification error:', error);
//       res.status(400).send('QR code has expired or is invalid');
//   }
// });


router.post('/scan/:classcode/:day', (req, res) => {
  const classcode = req.params.classcode;
  const day = req.params.day; // Nhận ngày từ URL
  const token = req.headers['x-access-token'];
  const { url, deviceUUID } = req.body; // Nhận UUID từ yêu cầu

  if (!token) {
      return res.status(403).send('No token provided.');
  }

  try {
      console.log('Received token:', token);
      const decoded = jwt.verify(token, secretKey);
      console.log('Decoded token:', decoded);

      if (tokens[token] && tokens[token].classcode === classcode && !tokens[token].used && tokens[token].deviceUUID === deviceUUID && tokens[token].day === day) {
          tokens[token].used = true; // Đánh dấu token là đã sử dụng
          res.redirect(url);
      } else {
          res.status(400).send('Invalid or already used QR code');
      }
  } catch (error) {
      console.error('Token verification error:', error);
      res.status(400).send('QR code has expired or is invalid');
  }
});

router.post('/verify-token', (req, res) => {
  const token = req.headers['x-access-token'];

  if (!token) {
      return res.status(403).send('No token provided.');
  }

  try {
      jwt.verify(token, secretKey);
      res.sendStatus(200);
  } catch (error) {
      console.error('Token verification error:', error);
      res.status(400).send('Invalid or expired token.');
  }
});



//test file import
router.post('/upload/test', upload.single('file'), (req, res) => {
  try {
    const file = req.file;
    const workbook = xlsx.readFile(file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    res.status(200).json(data);
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).send('Error processing file');
  }
});

//import lớp học phần
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const classSections = await ClasssectionDAO.importFromExcel(file.path);
    fs.unlinkSync(file.path);
    res.status(200).json(classSections);
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).send('Error processing file');
  }
});

//import giảng viên
router.post('/upload/teachers', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const teachers = await ClasssectionDAO.importFromExcelTeacher(file.path);
    fs.unlinkSync(file.path);
    res.status(200).json(teachers);
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).send('Error processing file');
  }
});

//import sinh viên ứng với lớp học phần
router.post('/upload/student/:classcode', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const classCode = req.params.classcode;
    const result = await ClasssectionDAO.importFromExcelStudent(file.path, classCode);
    fs.unlinkSync(file.path);    
    res.status(200).json(result);
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).send('Error processing file');
  }
});

//-----Xử lý người dùng-----
//lấy tất cả người dùng
router.get('/users', async (req, res) => {
  try {
    const users = await UserDAO.selectAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
});
router.get('/users/unstudent', async (req, res) => {
  try {
    const users = await UserDAO.selectAllNotHaveStudent();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
});
//lấy tất cả sinh viên
router.get('/users/student', async (req, res) => {
  try {
    const users = await UserDAO.selectStudent();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
});
//lấy tất cả giảng viên
router.get('/users/lecturer', async (req, res) => {
  try {
    const users = await UserDAO.selectLecturer();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
});



//Lấy ra các giảng viên đã được đăng ký môn
router.get('/users/lecturer/registed', async (req, res) => {
  try {
    const users = await teachingAssignmentDAO.getAllRegisteredLecturers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
});

//Thêm người dùng mới
router.post('/users', async (req, res) => {
  try {
    const { email } = req.body;
    const user = {
      microsoftId: uuidv4(),
      displayName: null,
      email,
      accessToken: null,
      lastLogin: null,
      role: "675efcfcf5200355f4e3c04e",
      status: 0,
      phone: null,
      personalEmail: null

    };
    const result = await UserDAO.insert(user);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error inserting user', error });
  }
});
//xóa người dùng
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await UserDAO.delete(id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
});
//chỉnh sửa quyền và trạng thái người dùng
router.put('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const { role, status } = req.body;
    if (!userId) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    let updatedUser;
    if (role !== undefined) {
      updatedUser = await UserDAO.updateRole(userId, role);
    }
    if (status !== undefined) {
      const statusValue = status === 1 ? 1 : 0;
      updatedUser = await UserDAO.updateStatus(userId, statusValue);
    }
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user', error });
  }
});
//Lấy thông tin người dùng theo id
router.get('/users/profile/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserDAO.selectByID(id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user by ID', error });
  }
});
//Chỉnh sửa thông tin người dùng
router.put('/users/edit/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName } = req.body;
    const { userCode } = req.body;
    const { phone } = req.body;
    const { personalEmail } = req.body;
    const { typeLecturer } = req.body;
    const user = { _id: id, fullName,phone, personalEmail, typeLecturer, userCode };
    const result = await UserDAO.update(user);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
});


//-----Xử lý vai trò người dùng-----
//lấy tất cả vai trò
router.get('/roles', async (req, res) => {
  try {
    const roles = await RoleDAO.selectAll();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching roles', error });
  }
});
router.get('/roles/unstudent', async (req, res) => {
  try {
    const roles = await RoleDAO.selectAllNotHaveStudent();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching roles', error });
  }
});
// Thêm vai trò mới
router.post('/roles', async (req, res) => {
  try {
    const { tenrole } = req.body;
    const role = { tenrole };
    const result = await RoleDAO.insert(role);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error inserting role', error });
  }
});
// Cập nhật vai trò
router.put('/roles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { tenrole } = req.body;
    const role = { _id: id, tenrole };
    const result = await RoleDAO.update(role);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error updating role', error });
  }
});
// Lấy vai trò theo ID
router.get('/roles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const role = await RoleDAO.selectByID(id);
    res.json(role);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching role by ID', error });
  }
});
// Xóa vai trò
router.delete('/roles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await RoleDAO.delete(id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting role', error });
  }
});


//-----Xử lý ngành học-----
//lấy tất cả ngành học
router.get('/majors', async (req, res) => {
  try {
    const majors = await MajorDAO.selectAll();
    res.json(majors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching majors', error });
  }
});
//Thêm mới ngành học
router.post('/majors', async (req, res) => {
  try {
    const { majorName } = req.body;
    const { subMajorName } = req.body;
    const { majorCode } = req.body;
    const major = { majorName, subMajorName, status: 0, majorCode };
    const result = await MajorDAO.insert(major);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error inserting major', error });
  }
});
//Chỉnh sửa trạng thái của ngành học
router.put('/majors/:id', async (req, res) => {
  try {
    const majorId = req.params.id;
    const { status } = req.body;
    if (!majorId) {
      return res.status(400).json({ message: 'Invalid major ID' });
    }
    if (status === undefined) {
      return res.status(400).json({ message: 'Status is required' });
    }
    const statusValue = status === 1 ? 1 : 0;
    const updatedMajor = await MajorDAO.updateStatus(majorId, statusValue);
    if (!updatedMajor) {
      return res.status(404).json({ message: 'Major not found' });
    }
    res.json(updatedMajor);
  } catch (error) {
    console.error('Error updating major:', error);
    res.status(500).json({ message: 'Error updating major', error });
  }
});
//Xóa ngành học
router.delete('/majors/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await MajorDAO.delete(id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting major', error });
  }
});
//Lấy thông tin ngành học theo ID
router.get('/majors/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const major = await MajorDAO.selectByID(id);
    res.json(major);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching major by ID', error });
  }
});
//Chỉnh sửa thông tin ngành học
router.put('/majors/edit/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { majorName } = req.body;
    const { subMajorName } = req.body;
    const major = { _id: id, majorName,subMajorName };
    const result = await MajorDAO.update(major);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error updating major', error });
  }
});
//kiểm tra ràng buộc
router.get('/major', async (req, res) => {
  try {
    const { majorName } = req.query;
    if (!majorName) {
      return res.status(400).json({ message: 'Ngành là bắt buộc' });
    }

    const majors = await MajorDAO.selectByMajorName(majorName);
    res.json(majors);
  } catch (error) {
    console.error('Error fetching majors:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra' });
  }
});

//-----Xử lý học kỳ-----
//Lấy tất cả học kỳ
router.get('/terms', async (req, res) => {
  try {
    const terms = await TermDAO.selectAll();
    res.json(terms);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching terms', error });
  }
});
//Thêm mới học kỳ
router.post('/terms', async (req, res) => {
  try {
    const { term } = req.body;
    const { startYear } = req.body;
    const { endYear } = req.body;
    const { startDate } = req.body;
    const { endDate } = req.body;
    const terms = { term, startYear, endYear, startDate, endDate, status: 1 };
    const result = await TermDAO.insert(terms);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error inserting terms', error });
  }
});
//Thay đổi trạng thái của học kỳ
router.put('/terms/:id', async (req, res) => {
  try {
    const termId = req.params.id;
    const { status } = req.body;
    if (!termId) {
      return res.status(400).json({ message: 'Invalid term ID' });
    }
    if (status === undefined) {
      return res.status(400).json({ message: 'Status is required' });
    }
    const statusValue = status === 1 ? 1 : 0;
    const updatedTerm = await TermDAO.updateStatus(termId, statusValue);
    if (!updatedTerm) {
      return res.status(404).json({ message: 'Term not found' });
    }
    res.json(updatedTerm);
  } catch (error) {
    console.error('Error updating term:', error);
    res.status(500).json({ message: 'Error updating term', error });
  }
});
//Xóa học kỳ
router.delete('/terms/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await TermDAO.delete(id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting term', error });
  }
});
//Lấy thông tin học kỳ theo ID
router.get('/terms/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const term = await TermDAO.selectByID(id);
    res.json(term);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching term by ID', error });
  }
});
//Chỉnh sửa học kỳ
router.put('/terms/edit/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { term } = req.body;
    const { startYear } = req.body;
    const { endYear } = req.body;
    const { startDate } = req.body;
    const { endDate } = req.body;
    const terms = { _id: id, term ,startYear,endYear,startDate,endDate };
    const result = await TermDAO.update(terms);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error updating term', error });
  }
});
//kiểm tra ràng buộc
router.get('/term', async (req, res) => {
  try {
    const { term } = req.query;
    if (!term) {
      return res.status(400).json({ message: 'học kỳ là bắt buộc' });
    }

    const terms = await TermDAO.selectByTermName(term);
    res.json(terms);
  } catch (error) {
    console.error('Error fetching terms:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra' });
  }
});


//-----Xử lý môn học-----
//Lấy tất cả môn học
router.get('/subjects', async (req, res) => {
  try {
    const subjects = await SubjectDAO.selectAll();
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subjects', error });
  }
});
//Thêm mới môn học
router.post('/subjects', async (req, res) => {
  try {
    const { subjectCode, subjectName, credit, major } = req.body;
    const subjects = { subjectCode, subjectName, credit, major };
    // Log the data to be saved
    // console.log('Data to be saved:', subjects);
    // Save the data to the database
    const result = await SubjectDAO.insert(subjects);
    res.json({ message: 'Data saved successfully', data: subjects, result });
  } catch (error) {
    res.status(500).json({ message: 'Error inserting subjects', error });
  }
});
//Xóa môn học
router.delete('/subjects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await SubjectDAO.delete(id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting subject', error });
  }
});
//Lấy thông môn học theo ID
router.get('/subjects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const subject = await SubjectDAO.selectByID(id);
    res.json(subject);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subject by ID', error });
  }
});
//Chỉnh sửa môn học
router.put('/subjects/edit/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { subjectName } = req.body;
    const { credit } = req.body;
    const { major } = req.body;
    const subject = { _id: id, subjectName, credit, major };
    const result = await SubjectDAO.update(subject);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error updating subject', error });
  }
});

//kiểm tra ràng buộc
router.get('/subject', async (req, res) => {
  try {
    const { subjectCode } = req.query;
    if (!subjectCode) {
      return res.status(400).json({ message: 'Mã môn học là bắt buộc' });
    }

    // Tìm kiếm mã môn học trong cơ sở dữ liệu
    const subjects = await SubjectDAO.selectBySubjectCode(subjectCode);
    res.json(subjects);
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra' });
  }
});










router.get('/subjectterms', async (req, res) => {
  try {
    const subjectterms = await SubjectTermDAO.selectAll();
    res.json(subjectterms);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subject terms', error });
  }
});

router.post('/subjectterm', async (req, res) => {
  try {
    const { subjectTermCode, subjectID, termID } = req.body;
    const subjectterms = { subjectTermCode, subjectID, termID };
    // Log the data to be saved
    // console.log('Data to be saved:', subjects);
    // Save the data to the database
    const result = await SubjectTermDAO.insert(subjectterms);
    res.json({ message: 'Data saved successfully', data: subjectterms, result });
  } catch (error) {
    res.status(500).json({ message: 'Error inserting subject terms', error });
  }
});
router.get('/subjectterms/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const subjectterm = await SubjectTermDAO.selectByID(id);
    res.json(subjectterm);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subject term by ID', error });
  }
});
router.put('/subjectterms/edit/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { subjectTermCode } = req.body;
    const { subjectID } = req.body;
    const { termID } = req.body;
    const subjectterm = { _id: id, subjectTermCode, subjectID, termID };
    const result = await SubjectTermDAO.update(subjectterm);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error updating subject term', error });
  }
});
router.delete('/subjectterms/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await SubjectTermDAO.delete(id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting subject term', error });
  }
});
router.get('/subjectterms/allvalue/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const subjectterm = await SubjectTermDAO.selectByIDtest(id);
    res.json(subjectterm);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subject term by ID', error });
  }
});















//-----Xử lý đăng ký môn học cho giảng viên-----
router.get('/teachingassignments', async (req, res) => {
  try {
    const teachingassignments = await teachingAssignmentDAO.selectAll();
    res.json(teachingassignments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching teachingassignments', error });
  }
});
//Thêm mới đăng ký môn học 
router.post('/teachingAssignments', async (req, res) => {
  try {
    const { teacherID, subjecttermID } = req.body;
    const teachingAssignments = { teacherID, subjecttermID };
    // Log the data to be saved
    // console.log('Data to be saved:', teachingAssignments);
    // Save the data to the database
    const result = await teachingAssignmentDAO.insert(teachingAssignments);
    res.json({ message: 'Data saved successfully', data: teachingAssignments, result });
  } catch (error) {
    res.status(500).json({ message: 'Error inserting teaching assignments', error });
  }
});
//Thực hiện đăng ký 
router.get('/unregisteredLecturers/:subjecttermID', async (req, res) => {
  try {
    const { subjecttermID } = req.params;
    if (!subjecttermID) {
      return res.status(400).json({ error: 'subjecttermID is required' });
    }
    const unregisteredLecturers = await teachingAssignmentDAO.getUnregisteredLecturers(subjecttermID);
    res.json(unregisteredLecturers);
  } catch (error) {
    console.error('Error fetching unregistered:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
//Lấy thông tin đăng kí theo ID
router.get('/teacherassignments/:subjecttermID', async (req, res) => {
  try {
    const { subjecttermID } = req.params;
    const assignments = await teachingAssignmentDAO.getTeacherAssignments(subjecttermID);
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//Xóa môn học đã đăng kí cho GV
router.delete('/teacherassignments/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await teachingAssignmentDAO.deleteAssignment(id);
    res.status(200).json({ message: 'Assignment deleted successfully', result });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting assignment', error: error.message });
  }
});
//đăng kí môn dạy cho GV
router.post('/teacherassignments/:subjecttermID/:teacherID/register', async (req, res) => {
  const { subjecttermID, teacherID } = req.params;
  const { classsectionIDs } = req.body;

  try {
    const result = await teachingAssignmentDAO.registerClassSections(subjecttermID, teacherID, classsectionIDs);
    res.status(200).send(result.message);
  } catch (error) {
    console.error('Error registering class sections:', error);
    res.status(500).send('Registration failed');
  }
});


// router.get('/classsections/unregist/:subjectID', async (req, res) => {
//   const { subjectID } = req.params;

//   try {
//     const availableClassSections = await teachingAssignmentDAO.getUnassignedClassSections(subjectID);
//     res.status(200).json(availableClassSections);
//   } catch (error) {
//     console.error('Error fetching class sections:', error);
//     res.status(500).send('Error fetching class sections');
//   }
// });
router.get('/classsections/unregist/:subjecttermID/:subjectTermCode', async (req, res) => {
  const { subjecttermID, subjectTermCode } = req.params;

  try {
    const availableClassSections = await teachingAssignmentDAO.getUnassignedClassSections(subjecttermID, subjectTermCode);
    res.status(200).json(availableClassSections);
  } catch (error) {
    console.error('Error fetching class sections:', error);
    res.status(500).send('Error fetching class sections');
  }
});



//-----Xử lý lớp học phần-----
//Lấy tất cả học phần
router.get('/classsections', async (req, res) => {
  try {
    const subjects = await ClasssectionDAO.selectAll();
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subjects', error });
  }
});
router.get('/classsections/:subjecttermID', async (req, res) => {
  try {
    const { subjecttermID } = req.params;
    const css = await ClasssectionDAO.getClassSection(subjecttermID);
    res.json(css);
  } catch (error) {
    res.status(500).json({  message: error.message });
  }
});
//Thêm mới môn học
router.post('/classsections', async (req, res) => {
  try {
    const { classCode, classType, schoolDay, lesson, subjecttermID } = req.body;
    const classsections = { classCode, classType, schoolDay, lesson, subjecttermID };
    // Log the data to be saved
    // console.log('Data to be saved:', subjects);
    // Save the data to the database
    const result = await ClasssectionDAO.insert(classsections);
    res.json({ message: 'Data saved successfully', data: classsections, result });
  } catch (error) {
    res.status(500).json({ message: 'Error inserting class sections', error });
  }
});
//Chỉnh sửa lớp học phần
router.put('/classsections/edit/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { classType } = req.body;
    const { schoolDay } = req.body;
    const { lesson } = req.body;
    const classsection = { _id: id, classType, schoolDay,lesson };
    const result = await ClasssectionDAO.update(classsection);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error updating class section', error });
  }
});
//Lấy tất cả lớp thực hành theo mã lớp
router.get('/classsections/practice/:classCode', async (req, res) => {
  try {
    const { classCode } = req.params;
    const practiceSections = await ClasssectionDAO.getPracticeSections(classCode);

    res.json(practiceSections);
  } catch (error) {
    console.error('Error fetching practice sections:', error);
    res.status(500).send('Server error');
  }
});
//Xóa lớp thực hành
router.delete('/classsections/practice/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await ClasssectionDAO.deletepractical(id);
    res.status(200).json({ message: 'Assignment deleted successfully', result });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting practical', error: error.message });
  }
});
//Xóa lớp học phần
router.delete('/classsections/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await ClasssectionDAO.deleteAll(id);
    res.status(200).json({ message: 'Class section deleted successfully', result });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting class section', error: error.message });
  }
});
//Lấy tất cả thông tin giảng viên và các môn học mà giảng viên đang dạy
router.get('/teacherassignments/teacher/getall/:teacherID', async (req, res) => {
  try {
    const teacherID = req.params.teacherID; // Lấy teacherID từ req.params
    const tcs = await teachingAssignmentDAO.getClassSectionsByTeacherID(teacherID);
    res.json(tcs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching class sections', error });
  }
});
//Xóa môn dạy đã đăng ký cho giảng viên
router.delete('/teacherassignments/removeclasssection/:teacherID/:classsectionID', async (req, res) => {
  const { teacherID, classsectionID } = req.params;

  try {
    const result = await teachingAssignmentDAO.removeClassSection(teacherID, classsectionID);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


//-----Xử lý Thời khóa biểu-----
router.get('/user-by-classcode/:classCode', async (req, res) => {
  const { classCode } = req.params;
  try {
    const user = await teachingAssignmentDAO.getUserByClassCode(classCode);
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user by classCode:', error);
    res.status(500).json({ error: error.message });
  }
});
//lấy các lớp của GV
router.get('/classsections/teacher/:teacherID', async (req, res) => {
  const { teacherID } = req.params;

  try {
    const result = await teachingAssignmentDAO.getClassSectionsByTeacherIDTKB(teacherID);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching class sections:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
//lấy các lớp của SV
router.get('/classsections/student/:studentID', async (req, res) => {
  const { studentID } = req.params;

  try {
    const result = await teachingAssignmentDAO.getClassSectionsByStudentIDTKB(studentID);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching class sections:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



//-----Xử lý lớp học cho từng sinh viên-----
//thêm sinh viên
router.post('/studentclass', async (req, res) => {
  try {
    const { studentID, classsectionID } = req.body;
    const studentClass = { studentID, classsectionID };
    // Log the data to be saved
    // console.log('Data to be saved:', teachingAssignments);
    // Save the data to the database
    const result = await studentClassDAO.insert(studentClass);
    res.json({ message: 'Data saved successfully', data: studentClass, result });
  } catch (error) {
    res.status(500).json({ message: 'Error inserting student Class', error });
  }
});
//lấy thông tin của lớp học
router.get('/studentclass/allvalue/:classCode', async (req, res) => {
  try {
    const { classCode } = req.params;
    const studentclass = await studentClassDAO.selectByClassCode(classCode);
    res.json(studentclass);
  } catch (error) {
    console.error('Error fetching class section by classCode:', error);
    res.status(500).json({ message: 'Error fetching class section by classCode', error });
  }
});
//lấy tất cả sinh viên dựa vào classcode
router.get('/studentclass/allstudent/:classCode', async (req, res) => {
  try {
    const { classCode } = req.params;
    const users = await studentClassDAO.getUsersByClassCode(classCode);
    res.json(users);
  } catch (error) {
    console.error('Error fetching users by classCode:', error);
    res.status(500).json({ message: 'Error fetching users by classCode', error });
  }
});
//lấy thông tin điểm danh của 1 sinh viên
router.get('/studentclass/onestudent/:classCode/:studentID', async (req, res) => {
  try {
    const { classCode, studentID } = req.params;
    const users = await studentClassDAO.getUsersByClassCodeAndStudentID(classCode, studentID);
    res.json(users);
  } catch (error) {
    console.error('Error fetching users by classCode and studentID:', error);
    res.status(500).json({ message: 'Error fetching users by classCode and studentID', error });
  }
});
//Thêm email sinh viên vào lớp học
router.post('/studentclass/:classCode', async (req, res) => {
  try {
    const { classCode } = req.params;
    const { email } = req.body;
    const newStudentClass = await studentClassDAO.addStudentToClass(classCode, email);
    res.json(newStudentClass);
  } catch (error) {
    console.error('Error adding student to class:', error);
    res.status(500).json({ message: 'Error adding student to class', error });
  }
});
//xóa sinh viên ra khỏi lớp học
router.delete('/studentclass/remove/:classCode/:studentID', async (req, res) => {
  try {
    const { classCode, studentID } = req.params;
    const result = await studentClassDAO.removeStudentFromClass(classCode, studentID);
    res.json(result);
  } catch (error) {
    console.error('Error removing student from class:', error);
    res.status(500).json({ message: 'Error removing student from class', error });
  }
});

//lấy các ngày học trong nguyên 1 học kỳ ra của 1 lớp 
router.get('/studentclass/dateattendance/:classCode', async (req, res) => {
  try {
    const { classCode } = req.params;
    const users = await studentClassDAO.getAttendanceDatesByClassCode(classCode);
    res.json(users);
  } catch (error) {
    console.error('Error fetching users by classCode:', error);
    res.status(500).json({ message: 'Error fetching users by classCode', error });
  }
});

//lấy các ngày học trong 1 học kỳ ra của 1 sinh viên
router.get('/studentclass/dateattendance-student/:classCode/:studentID', async (req, res) => {
  try {
    const { classCode, studentID } = req.params;
    const attendanceDates = await studentClassDAO.getAttendanceDatesByClassCodeAndStudentID(classCode, studentID);
    res.json(attendanceDates);
  } catch (error) {
    console.error('Error fetching attendance dates by classCode and studentID:', error);
    res.status(500).json({ message: 'Error fetching attendance dates by classCode and studentID', error });
  }
});

//lấy tất cả dữ liệu điểm danh của lớp
router.get('/studentclass/dateattendance/detail/:classCode', async (req, res) => {
  try {
    const { classCode } = req.params;
    const users = await studentClassDAO.getAttendanceDetailsByClassCode(classCode);
    res.json(users);
  } catch (error) {
    console.error('Error fetching users by classCode:', error);
    res.status(500).json({ message: 'Error fetching users by classCode', error });
  }
});

//lấy dữ liệu điểm danh của một sinh viên
router.get('/studentclass/dateattendance-student/detail/:classCode/:studentID', async (req, res) => {
  try {
    const { classCode, studentID } = req.params;
    const attendanceDetails = await studentClassDAO.getAttendanceDetailsByClassCodeAndStudentID(classCode, studentID);
    res.json(attendanceDetails);
  } catch (error) {
    console.error('Error fetching attendance details by classCode and studentID:', error);
    res.status(500).json({ message: 'Error fetching attendance details by classCode and studentID', error });
  }
});

//điểm danh thủ công
router.post('/studentclass/dateattendancing/:classCode', async (req, res) => {
  try {
    const { classCode } = req.params;
    const { studentId, date, status } = req.body;

    const attendance = await studentClassDAO.updateAttendanceWithCurrentTimeAndStatus(classCode, studentId, date, status);
    res.json(attendance);
  } catch (error) {
    console.error('Error updating attendance:', error);
    res.status(500).json({ message: 'Error updating attendance', error });
  }
});

//Đổi status từ vắng có phép sang hỗ trợ và ngược lại
router.post('/studentclass/changestatus/:classCode', async (req, res) => {
  try {
    const { classCode } = req.params;
    const { studentId, date, status } = req.body;

    const attendance = await studentClassDAO.updateAttendanceStatus(classCode, studentId, date, status);
    res.json(attendance);
  } catch (error) {
    console.error('Error updating attendance:', error);
    res.status(500).json({ message: 'Error updating attendance', error });
  }
});

//Lấy các status của người dùng khi đã điểm danh
router.get('/studentclass/getstatusattendance/:classCode', async (req, res) => {
  try {
    const { classCode } = req.params;
    const { studentId, date } = req.query; // Use query parameters for studentId and date

    const status = await studentClassDAO.getAttendanceStatus(classCode, studentId, date);
    res.json({ status });
  } catch (error) {
    console.error('Error getting attendance status:', error);
    res.status(500).json({ message: 'Error getting attendance status', error });
  }
});

//export file excel
router.get('/export-attendance/:classCode', async (req, res) => {
  try {
      const { classCode } = req.params;
      const buffer = await studentClassDAO.exportAttendanceToExcel(classCode);

      // Create a readable stream from the buffer
      const stream = new Readable();
      stream.push(buffer);
      stream.push(null);

      // Set headers and send the file
      res.setHeader('Content-Disposition', `attachment; filename=attendance_${classCode}.xlsx`);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      stream.pipe(res);
  } catch (error) {
      console.error('Error exporting attendance:', error);
      res.status(500).json({ message: 'Error exporting attendance', error });
  }
});


// router.post('/register_user', async (req, res) => {
//   try {
//     const { name, image } = req.body;

//     console.log('Sending request to Python API for user registration...');
//     const response = await axios.post('http://127.0.0.1:5000/api/register', { name, image
//     });

//     console.log('Received response from Python API:', response.data);
//     res.json(response.data);
//   } catch (error) {
//     console.error('Error calling Python API:', error);
//     res.status(500).json({ message: 'Error calling Python API', error });
//   }
// });



//-----Xử lý FaceID-----
//Đăng ký FaceID lần đầu
router.post('/register_user', async (req, res) => {
  try {
    const { name, image } = req.body;

    console.log('Sending request to Python API for user registration...');
    const response = await axios.post('http://127.0.0.1:5000/api/register', { name, image });

    console.log('Received response from Python API:', response.data);

    // Assuming the response contains a success status
    if (response.data.status == 'success') {
      // Call the insert function to save the image
      const result = await registrationImageDAO.insert(name, image);
      console.log('Image saved successfully:', result);
      res.json({ message: 'User registered and image saved successfully', data: result });
    } else {
      res.status(400).json({ message: 'User registration failed', data: response.data });
    }
  } catch (error) {
    console.error('Error calling Python API:', error);
    res.status(500).json({ message: 'Error calling Python API', error });
  }
});

//Đăng ký faceID lại
router.post('/re_register_user', async (req, res) => {
  try {
    const { name, image } = req.body;

    console.log('Gửi yêu cầu đến API Python để đăng ký lại người dùng...');
    const response = await axios.post('http://127.0.0.1:5000/api/re_register', { name, image });

    console.log('Nhận phản hồi từ API Python:', response.data);

    // Giả sử phản hồi chứa trạng thái thành công
    if (response.data.status === 'success') {
      // Gọi hàm insert để lưu hình ảnh
      const result = await registrationImageDAO.insert(name, image);
      console.log('Hình ảnh đã được lưu thành công:', result);
      res.json({ message: 'Người dùng đã được đăng ký lại và hình ảnh đã được lưu thành công', data: result });
    } else {
      res.status(400).json({ message: 'Đăng ký lại người dùng thất bại', data: response.data });
    }
  } catch (error) {
    console.error('Lỗi khi gọi API Python:', error);
    res.status(500).json({ message: 'Lỗi khi gọi API Python', error });
  }
});

//Lưu hình ảnh khi người dùng đăng kí lại
router.get('/user_images/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const images = await registrationImageDAO.getImagesByUserId(userId);
    res.json({ images });
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ message: 'Error fetching images', error });
  }
});

// router.post('/login_user', async (req, res) => {
//   try {
//     const { image } = req.body;

//     console.log('Sending request to Python API for user login...');
//     const response = await axios.post('http://127.0.0.1:5000/api/login', { image });

//     console.log('Received response from Python API:', response.data);
//     res.json(response.data);
//   } catch (error) {
//     console.error('Error calling Python API:', error);
//     res.status(500).json({ message: 'Error calling Python API', error });
//   }
// });







// router.post('/login_user', async (req, res) => {
//   try {
//     const { image } = req.body;

//     console.log('Sending request to Python API for user login...');
//     const response = await axios.post('http://127.0.0.1:5000/api/login', { image });

//     console.log('Received response from Python API:', response.data);
//     res.json(response.data);
//   } catch (error) {
//     console.error('Error calling Python API:', error);

//     if (error.response) {
//       console.log('Error status:', error.response.status);
//       console.log('Error response data:', error.response.data);

//       if (error.response.status === 403) {
//         res.status(403).json({ message: 'You are fake' });
//       } else if (error.response.status === 401) {
//         res.status(401).json({ message: 'Unknown user. Please register new user or try again.' });
//       } else {
//         res.status(error.response.status).json({ message: 'Error calling Python API', error: error.response.data });
//       }
//     } else {
//       res.status(500).json({ message: 'Error calling Python API', error });
//     }
//   }
// });

//điểm danh bằng khuôn mặt
router.post('/login_user', async (req, res) => {
  try {
    const { name, image } = req.body;

    console.log('Sending request to Python API for user login...');
    const response = await axios.post('http://127.0.0.1:5000/api/login', { name, image });

    console.log('Received response from Python API:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Error calling Python API:', error);

    if (error.response) {
      console.log('Error status:', error.response.status);
      console.log('Error response data:', error.response.data);

      if (error.response.status === 403) {
        res.status(403).json({ message: 'You are fake' });
      } else if (error.response.status === 401) {
        res.status(401).json({ message: 'Thất bại!' });
      } else {
        res.status(error.response.status).json({ message: 'Error calling Python API', error: error.response.data });
      }
    } else {
      res.status(500).json({ message: 'Error calling Python API', error });
    }
  }
});

//kiểm tra người dùng có đăng kí faceID chưa
router.post('/check_user', async (req, res) => {
  try {
    const { name } = req.body;

    console.log('Sending request to Python API to check user registration...');
    const response = await axios.post('http://127.0.0.1:5000/api/check_user', { name });

    console.log('Received response from Python API:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Error calling Python API:', error);

    if (error.response) {
      console.log('Error status:', error.response.status);
      console.log('Error response data:', error.response.data);

      if (error.response.status === 404) {
        res.status(404).json({ message: 'User not found.' });
      } else {
        res.status(error.response.status).json({ message: 'Error calling Python API', error: error.response.data });
      }
    } else {
      res.status(500).json({ message: 'Error calling Python API', error });
    }
  }
});





//Gửi email khi điểm danh thành công
router.post('/send-email', (req, res) => {
  const { email, date, time, image, classcode } = req.body;

  EmailUtil.send(email, date, time, image, classcode)
    .then(() => res.status(200).send('Email sent successfully'))
    .catch((err) => res.status(500).send(err.toString()));
});

// category
// router.get('/categories', JwtUtil.checkToken, async function (req, res) {
//   const categories = await CategoryDAO.selectAll();
//   res.json(categories);
// });

// // category
// router.post('/categories', JwtUtil.checkToken, async function (req, res) {
//   const name = req.body.name;
//   const category = { name: name };
//   const result = await CategoryDAO.insert(category);
//   res.json(result);
// });
// // category
// router.put('/categories/:id', JwtUtil.checkToken, async function (req, res) {
//   const _id = req.params.id;
//   const name = req.body.name;
//   const category = { _id: _id, name: name };
//   const result = await CategoryDAO.update(category);
//   res.json(result);
// });
// // category
// router.delete('/categories/:id', JwtUtil.checkToken, async function (req, res) {
//   const _id = req.params.id;
//   const result = await CategoryDAO.delete(_id);
//   res.json(result);
// });
// // product
// router.get('/products', JwtUtil.checkToken, async function (req, res) {
//   // get data
//   var products = await ProductDAO.selectAll();
//   // pagination
//   const sizePage = 4;
//   const noPages = Math.ceil(products.length / sizePage);
//   var curPage = 1;
//   if (req.query.page) curPage = parseInt(req.query.page); // /products?page=xxx
//   const offset = (curPage - 1) * sizePage;
//   products = products.slice(offset, offset + sizePage);
//   // return
//   const result = { products: products, noPages: noPages, curPage: curPage };
//   res.json(result);
// });
// // product
// router.post('/products', JwtUtil.checkToken, async function (req, res) {
//   const name = req.body.name;
//   const price = req.body.price;
//   const cid = req.body.category;
//   const image = req.body.image;
//   const now = new Date().getTime(); // milliseconds
//   const category = await CategoryDAO.selectByID(cid);
//   const product = { name: name, price: price, image: image, cdate: now, category: category };
//   const result = await ProductDAO.insert(product);
//   res.json(result);
// });
// // product
// router.put('/products/:id', JwtUtil.checkToken, async function (req, res) {
//   const _id = req.params.id;
//   const name = req.body.name;
//   const price = req.body.price;
//   const cid = req.body.category;
//   const image = req.body.image;
//   const now = new Date().getTime(); // milliseconds
//   const category = await CategoryDAO.selectByID(cid);
//   const product = { _id: _id, name: name, price: price, image: image, cdate: now, category: category };
//   const result = await ProductDAO.update(product);
//   res.json(result);
// });
// // product
// router.delete('/products/:id', JwtUtil.checkToken, async function (req, res) {
//   const _id = req.params.id;
//   const result = await ProductDAO.delete(_id);
//   res.json(result);
// });
// // order
// router.get('/orders', JwtUtil.checkToken, async function (req, res) {
//   const orders = await OrderDAO.selectAll();
//   res.json(orders);
// });
// // order
// router.put('/orders/status/:id', JwtUtil.checkToken, async function (req, res) {
//   const _id = req.params.id;
//   const newStatus = req.body.status;
//   const result = await OrderDAO.update(_id, newStatus);
//   res.json(result);
// });
// // order
// router.get('/orders/customer/:cid', JwtUtil.checkToken, async function (req, res) {
//   const _cid = req.params.cid;
//   const orders = await OrderDAO.selectByCustID(_cid);
//   res.json(orders);
// });
// // customer
// router.get('/customers', JwtUtil.checkToken, async function (req, res) {
//   const customers = await CustomerDAO.selectAll();
//   res.json(customers);
// });
// // customer
// router.put('/customers/deactive/:id', JwtUtil.checkToken, async function (req, res) {
//   const _id = req.params.id;
//   const token = req.body.token;
//   const result = await CustomerDAO.active(_id, token, 0);
//   res.json(result);
// });
// // customer
// router.get('/customers/sendmail/:id', JwtUtil.checkToken, async function (req, res) {
//   const _id = req.params.id;
//   const cust = await CustomerDAO.selectByID(_id);
//   if (cust) {
//     const send = await EmailUtil.send(cust.email, cust._id, cust.token);
//     if (send) {
//       res.json({ success: true, message: 'Please check email' });
//     } else {
//       res.json({ success: false, message: 'Email failure' });
//     }
//   } else {
//     res.json({ success: false, message: 'Not exists customer' });
//   }
// });
module.exports = router;