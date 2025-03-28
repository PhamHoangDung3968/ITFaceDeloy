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
// async function(accessToken, refreshToken, profile, done) {
//   try {
//     // Find or create user in MongoDB
//     let user = await User.findOne({ microsoftId: profile.id });
//     if (!user) {
//       // Find the "sinh viên" role
//       const studentRole = await Role.findOne({ tenrole: 'Chưa phân quyền' });
//       user = new User({
//         microsoftId: profile.id,
//         displayName: profile.displayName,
//         email: profile.emails[0].value,
//         accessToken: accessToken,
//         lastLogin: Date.now(), // Lưu ngày giờ đăng nhập
//         role: studentRole ? studentRole._id : null, // Đặt role mặc định là "Chưa phân quyền"
//         status: 1, // Đặt trạng thái mặc định là 1
//         phone: profile.mobilePhone
//       });
//       await user.save();
//     } else {
//       // Update accessToken and lastLogin if user already exists
//       user.accessToken = accessToken;
//       user.lastLogin = Date.now(); // Cập nhật ngày giờ đăng nhập
//       await user.save();
//     }

//     // Check user status
//     if (user.status === 0) {
//       return done(null, false, { message: 'User is not allowed to log in' });
//     }
//     return done(null, user);
//   } catch (err) {
//     return done(err);
//   }
// }));
async function(accessToken, refreshToken, profile, done) {
  try {
    let user = await User.findOne({ $or: [{ microsoftId: profile.id }, { email: profile.emails[0].value }] });
    let usercode = null;

    if (!user) {
      let role;

      if (profile.emails[0].value.endsWith('@vanlanguni.vn')) {
        role = await Role.findOne({ tenrole: 'Sinh viên' });
        // Extract usercode from displayName
        const displayNameParts = profile.displayName.split(' - ');
        if (displayNameParts.length > 0) {
          usercode = displayNameParts[0];
        }
      } else if (profile.emails[0].value.endsWith('@vlu.edu.vn')) {
        role = await Role.findOne({ tenrole: 'Giảng viên' });
      } else {
        role = await Role.findOne({ tenrole: 'Chưa phân quyền' });
      }

      user = new User({
        microsoftId: profile.id,
        displayName: profile.displayName,
        email: profile.emails[0].value,
        accessToken: accessToken,
        lastLogin: Date.now(), // Lưu ngày giờ đăng nhập
        role: role ? role._id : null, // Đặt role mặc định là "Chưa phân quyền"
        status: 1, // Đặt trạng thái mặc định là 1
        phone: profile.mobilePhone,
        userCode: usercode // Add usercode to the user object
      });
      await user.save();
    } else {
      // Update user details if user already exists
      user.microsoftId = profile.id;
      user.displayName = profile.displayName;
      user.email = profile.emails[0].value;
      user.accessToken = accessToken;
      user.lastLogin = Date.now(); // Cập nhật ngày giờ đăng nhập
      user.phone = profile.mobilePhone;
      user.status = 1;

      // Update usercode if email ends with @vanlanguni.vn
      if (profile.emails[0].value.endsWith('@vanlanguni.vn')) {
        const displayNameParts = profile.displayName.split(' - ');
        if (displayNameParts.length > 0) {
          user.userCode = displayNameParts[0];
        }
      } else {
        user.userCode = null;
      }

      await user.save();
    }

    // Check user status
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

// app.get('/api/auth/callback',
//   passport.authenticate('microsoft', { failureRedirect: 'http://localhost:3001/admin' }),
//   (req, res) => {
//     res.redirect('http://localhost:3001/admin/home');
//   });
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

// app.get('/user', (req, res) => {
//   if (!req.isAuthenticated()) {
//     return res.status(401).json({ message: 'User not authenticated' });
//   }

//   const accessToken = req.user.accessToken;

//   axios.get('https://graph.microsoft.com/v1.0/me', {
//     headers: {
//       Authorization: `Bearer ${accessToken}`
//     }
//   })
//   .then(response => {
//     res.json(response.data);
//   })
//   .catch(error => {
//     res.status(500).json({ message: 'Error fetching user data' });
//   });
// });

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
app.use('/api/customer', require('./api/customer.js'));

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});