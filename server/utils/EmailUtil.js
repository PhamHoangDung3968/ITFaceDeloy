const nodemailer = require('nodemailer');
const MyConstants = require('./MyConstants');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: MyConstants.EMAIL_USER,
    pass: MyConstants.EMAIL_PASS,
  },
});

const EmailUtil = {
  send(email, date, time, image, classcode) {
    const subject = `ỨNG DỤNG ĐIỂM DANH SINH VIÊN ITFACE ${date}`;
    const text = `Bạn đã điểm danh thành công lớp ${classcode} ngày ${date} vào lúc ${time}.`;
    const html = `<p>Bạn đã điểm danh thành công lớp <strong>${classcode}</strong> vào ngày <strong>${date}</strong> lúc <strong>${time}</strong>.</p><img src="data:image/jpeg;base64,${image}" alt="Attendance Image"/>`;

    return new Promise((resolve, reject) => {
      const mailOptions = {
        from: MyConstants.EMAIL_USER,
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