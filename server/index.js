const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const MicrosoftStrategy = require('passport-microsoft').Strategy;
const session = require('express-session');
const axios = require('axios');
const path = require('path');
const mongoose = require('mongoose');
const User = require('./models/User'); // Import mô hình User
const Role = require('./models/Role'); // Import mô hình Role

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(session({ secret: 'dung123456', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Middleware để chuyển hướng từ localhost:3000 sang localhost:3001/admin/
//Chạy local
// app.use((req, res, next) => {
//   if (req.hostname === 'localhost' && req.port === '3001') {
//     res.redirect('http://localhost:3001/admin');
//   } else {
//     next();
//   }
// });
//Chạy deploy
app.use((req, res, next) => {
  if (req.hostname === 'itface.onrender.com' && req.path === '/') {
    res.redirect('https://itface.onrender.com/admin');
  } else {
    next();
  }
});

// Passport configuration
passport.use(new MicrosoftStrategy({
  clientID: 'b124aa58-71a9-43fd-9962-6c81b6281dc8',
  clientSecret: 'Nqj8Q~aPxN8YZCT_GMkAp5whzcQMAMf5b2m6raXn',
  callbackURL: 'https://itface.onrender.com/api/auth/callback',
  scope: ['user.read'],
  tenant: '3011a54b-0a5d-4929-bf02-a00787877c6a',
  authorizationURL: 'https://login.microsoftonline.com/3011a54b-0a5d-4929-bf02-a00787877c6a/oauth2/v2.0/authorize',
  tokenURL: 'https://login.microsoftonline.com/3011a54b-0a5d-4929-bf02-a00787877c6a/oauth2/v2.0/token'
},
async function(accessToken, refreshToken, profile, done) {
  try {
    let user = await User.findOne({ $or: [{ microsoftId: profile.id }, { email: profile.emails[0].value }] });
    let usercode = null;

    if (!user) {
      let role;

      if (profile.emails[0].value.endsWith('@vanlanguni.vn')) {
        role = await Role.findOne({ tenrole: 'Sinh viên' });
        const displayNameParts = profile.displayName.split(' - ');
        if (displayNameParts.length > 0) {
          usercode = displayNameParts[0];
        }
      } else if (profile.emails[0].value.endsWith('@vlu.edu.vn')) {
        role = await Role.findOne({ tenrole: 'Giảng viên' });
        usercode = null; // Thiết lập userCode là null nếu không có giá trị ban đầu
      } else {
        role = await Role.findOne({ tenrole: 'Chưa phân quyền' });
      }

      user = new User({
        microsoftId: profile.id,
        displayName: profile.displayName,
        email: profile.emails[0].value,
        accessToken: accessToken,
        lastLogin: Date.now(),
        role: role ? role._id : null,
        status: 1,
        phone: profile.mobilePhone,
        userCode: usercode
      });
      await user.save();
    } else {
      user.microsoftId = profile.id;
      user.displayName = profile.displayName;
      user.email = profile.emails[0].value;
      user.accessToken = accessToken;
      user.lastLogin = Date.now();
      user.phone = profile.mobilePhone;
      user.status = 1;

      if (profile.emails[0].value.endsWith('@vanlanguni.vn')) {
        const displayNameParts = profile.displayName.split(' - ');
        if (displayNameParts.length > 0) {
          user.userCode = displayNameParts[0];
        }
      } else if (profile.emails[0].value.endsWith('@vlu.edu.vn') && user.userCode === undefined) {
        user.userCode = null; // Thiết lập userCode là null nếu không có giá trị ban đầu
      }
      await user.save();
    }

    if (user.status === 0) {
      return done(null, false, { message: 'User is not allowed to log in' });
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Routes
app.get('/auth/microsoft', passport.authenticate('microsoft'));
app.get('/api/auth/callback',
  passport.authenticate('microsoft', { failureRedirect: 'https://itface.onrender.com/admin?error=login_failed' }),
  (req, res) => {
    res.redirect('https://itface.onrender.com/admin/home');
  });

app.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) { return next(err); }
    res.redirect('https://itface.onrender.com/admin');
  });
});
app.get('/user', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  try {
    const user = await User.findById(req.user._id).populate('role'); // Populate the role field

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const accessToken = req.user.accessToken;

    // Fetch additional data from Microsoft Graph API if needed
    const microsoftData = await axios.get('https://graph.microsoft.com/v1.0/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    // Combine user data from your database with Microsoft data
    const userData = {
      _id: user._id,
      personalEmail: user.personalEmail,
      phone: user.phone,
      role: user.role.tenrole, // Include the role name
      userCode: user.userCode, // Include the role name
      microsoftData: microsoftData.data // Include additional Microsoft data if needed
    };

    res.json(userData);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Error fetching user data' });
  }
});
// Endpoint để đăng nhập và lấy userCode
// app.post('/login_v02_user', async (req, res) => {
//   try {
//     const { image } = req.body;

//     console.log('Sending request to Python API for user login...');
//     const response = await axios.post('https://www.itface.fun/api/login_v02', { image });

//     console.log('Received response from Python API:', response.data);

//     if (response.data.status === 'success') {
//       const userCode = response.data.message;

//       // Lưu userCode vào session hoặc một biến toàn cục
//       req.session.userCode = userCode;

//       return res.json({ message: 'Login successful', userCode });
//     } else {
//       return res.status(401).json({ message: 'Login failed' });
//     }
//   } catch (error) {
//     console.error('Error calling Python API:', error);

//     if (error.response) {
//       console.log('Error status:', error.response.status);
//       console.log('Error response data:', error.response.data);

//       if (error.response.status === 403) {
//         res.status(403).json({ message: 'Vui lòng trung thực!' });
//       } else if (error.response.status === 401) {
//         res.status(401).json({ message: 'Vui lòng đăng nhập bằng tài khoản Microsoft để đăng ký FaceID và trải nghiệm tốt hơn lần sau!' });
//       } else {
//         res.status(error.response.status).json({ message: 'Error calling Python API', error: error.response.data });
//       }
//     } else {
//       res.status(500).json({ message: 'Error calling Python API', error });
//     }
//   }
// });

app.post('/login_v02_user', async (req, res) => {
  try {
    const { image } = req.body;
    console.time('Login Execution Time'); // Bắt đầu đo thời gian

    const loginResponse = await axios.post('https://www.itface.fun/api/login_v02', { image });

    const request_id = loginResponse.data.request_id; // Lấy request_id từ Python API

    if (!request_id) {
      return res.status(500).json({ message: 'Failed to generate request_id' });
    }

    console.log(`Checking login result for request_id: ${request_id}`);

    let loginResult;
    let attempts = 10;

    while (attempts > 0) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Đợi 1 giây trước khi kiểm tra

      loginResult = await axios.get(`https://www.itface.fun/api/login_result/${request_id}`);

      if (loginResult.data.status !== 'pending') {
        break;
      }

      attempts--;
    }

    console.timeEnd('Login Execution Time'); // Kết thúc đo thời gian
    console.log('Received final result from Python API:', loginResult.data);

    if (loginResult.data.status === 'success') {
      const userCode = loginResult.data.message;
      req.session.userCode = userCode;
      return res.json({ message: 'Login successful', userCode });
    } else {
      return res.status(401).json({ message: loginResult.data.message });
    }

  } catch (error) {
    console.timeEnd('Login Execution Time');

    if (error.response) {
      if (error.response.status === 403) {
        res.status(403).json({ message: 'Vui lòng trung thực!' });
      } else if (error.response.status === 401) {
        res.status(401).json({ message: 'Vui lòng đăng nhập bằng tài khoản Microsoft để đăng ký FaceID và trải nghiệm tốt hơn lần sau!' });
      } else {
        res.status(error.response.status).json({ message: 'Error calling Python API', error: error.response.data });
      }
    } else {
      res.status(500).json({ message: 'Error calling Python API', error });
    }
  }
});
// Endpoint để lấy thông tin người dùng dựa trên userCode
app.get('/user_v02', async (req, res) => {
  try {
    // Lấy userCode từ session, đảm bảo nó tồn tại
    const userCode = req.session?.userCode; // Sử dụng optional chaining để tránh lỗi nếu req.session là undefined
    if (!userCode) {
      return res.status(400).json({ message: 'User code not found in session' });
    }
    // Truy vấn dữ liệu người dùng từ cơ sở dữ liệu
    const user = await User.findOne({ userCode }).populate('role');
    if (!user) {
      return res.status(404).json({ message: 'User not found with the provided code' });
    }
    // Chuẩn bị dữ liệu người dùng để trả về
    const userData = {
      _id: user._id,
      personalEmail: user.personalEmail || null,
      phone: user.phone || null,
      role: user.role?.tenrole || null,
      userCode: user.userCode,
      microsoftData: {
        displayName: user.displayName || null,
        email: user.email || null,
        businessPhones: [],
        givenName: user.displayName?.split(' - ')[1] || null,
        jobTitle: null,
        mail: user.email || null,
        mobilePhone: user.phone || null,
        officeLocation: null,
        preferredLanguage: null,
        surname: user.displayName?.split(' - ')[2] || null,
        userPrincipalName: user.email || null,
        id: user.microsoftId
      },
    };
    return res.json(userData);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Failed to fetch user data', error: error.message }); // Gửi kèm error message để debug dễ hơn
  }
});


// Serve static files
app.use('/admin', express.static(path.resolve(__dirname, '../client-admin/build')));
app.get('/admin/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client-admin/build', 'index.html'));
});

// Example API
app.get('/hello', (req, res) => {
  res.json({ message: 'Hello from server!' });
});

// Additional APIs
app.use('/api/admin', require('./api/admin.js'));

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});