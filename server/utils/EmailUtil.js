// const nodemailer = require('nodemailer');
// const MyConstants = require('./MyConstants');

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: MyConstants.EMAIL_USER,
//     pass: MyConstants.EMAIL_PASS,
//   },
//   // tls: {
//   //   rejectUnauthorized: false
//   // }
// });

// const EmailUtil = {
//   send(email, date, time, image, classcode) {
//     const subject = `ỨNG DỤNG ĐIỂM DANH SINH VIÊN ITFACE ${date}`;
//     const text = `Chào bạn!\n\nBạn đã điểm danh thành công lớp ${classcode} ngày ${date} vào lúc ${time}.\n\nChúc bạn có một ngày tốt lành!\n\n*Đây là email được gửi tự động từ hệ thống ITFace của Khoa Công nghệ Thông tin trường Đại học Văn Lang, vui lòng không reply email này.*\n\n---\nITFace Team - Khoa Công nghệ Thông tin Trường Đại học Văn Lang`;
//     const html = `<p>Chào bạn!</p><p>Bạn đã điểm danh thành công lớp <strong>${classcode}</strong> vào ngày <strong>${date}</strong> lúc <strong>${time}</strong>.</p><img src="data:image/jpeg;base64,${image}" alt="Attendance Image" style="width:200px; height:auto;"/><p>Chúc bạn có một ngày tốt lành.</p><p><em>Đây là email được gửi tự động từ hệ thống ITFace của Khoa Công nghệ Thông tin trường Đại học Văn Lang, vui lòng không reply email này.</em></p><hr/><p>ITFace Team - Khoa Công nghệ Thông tin Trường Đại học Văn Lang</p>`;

//     return new Promise((resolve, reject) => {
//       const mailOptions = {
//         from: `"ITFaceVLU" <${MyConstants.EMAIL_USER}>`,
//         to: email,
//         subject: subject,
//         text: text,
//         html: html,
//       };
//       transporter.sendMail(mailOptions, (err, result) => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve(true);
//         }
//       });
//     });
//   },
// };

// module.exports = EmailUtil;

const nodemailer = require('nodemailer');
const MyConstants = require('./MyConstants');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: MyConstants.EMAIL_USER,
    pass: MyConstants.EMAIL_PASS,
  },
  // tls: {
  //   rejectUnauthorized: false
  // }
});

const EmailUtil = {
  send(email, date, time, image, classcode) {
    const subject = `ỨNG DỤNG ĐIỂM DANH SINH VIÊN ITFACE ${date}`;
    const text = `Chào bạn,\n\nBạn đã điểm danh thành công lớp ${classcode} ngày ${date} vào lúc ${time}.\n\nChúc bạn có một ngày tốt lành!\n\n*Đây là email được gửi tự động từ hệ thống ITFace của Khoa Công nghệ Thông tin trường Đại học Văn Lang, vui lòng không reply email này.*\n\nHình ảnh cá nhân của bạn được thu thập từ ITFace sẽ được bảo mật và không dùng cho bất kỳ mục đích thương mại nào hoặc làm ảnh hưởng đến danh dự cá nhân.\n\n---\nITFace Team - Khoa Công nghệ Thông tin Trường Đại học Văn Lang`;
    const html = `<p>Chào bạn,</p><p>Bạn đã điểm danh thành công lớp <strong>${classcode}</strong> vào ngày <strong>${date}</strong> lúc <strong>${time}</strong>.</p><img src="data:image/jpeg;base64,${image}" alt="Attendance Image" style="width:200px; height:auto;"/><p>Chúc bạn có một ngày tốt lành.</p><p><em>Đây là email được gửi tự động từ hệ thống ITFace của Khoa Công nghệ Thông tin trường Đại học Văn Lang, vui lòng không reply email này.</em></p><p>Hình ảnh cá nhân của bạn được thu thập từ ITFace sẽ được bảo mật và không dùng cho bất kỳ mục đích thương mại nào hoặc làm ảnh hưởng đến danh dự cá nhân.</p><hr/><p>ITFace Team - Khoa Công nghệ Thông tin Trường Đại học Văn Lang</p>`;

    return new Promise((resolve, reject) => {
      const mailOptions = {
        from: `"ITFaceVLU" <${MyConstants.EMAIL_USER}>`,
        to: email,
        subject: subject,
        text: text,
        html: html,
      };
      transporter.sendMail(mailOptions, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(true);
        }
      });
    });
  },
};

module.exports = EmailUtil;