const nodemailer = require('nodemailer');
const MyConstants = require('./MyConstants');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: MyConstants.EMAIL_USER,
    pass: MyConstants.EMAIL_PASS,
  },
});

const EmailNoticeUtil = {
  send(emails, classcode, subjectName) {
    const subject = `NHẮC NHỞ VỀ VIỆC NGHỈ HỌC - ITFace`;
    const text = `Chào bạn,\n\nGiảng viên nhận thấy rằng bạn đã nghỉ học quá nhiều buổi môn ${subjectName} của lớp ${classcode}. Việc nghỉ học thường xuyên có thể ảnh hưởng đến điểm quá trình và kết quả học tập của bạn.\n\nGiảng viên khuyến khích bạn tham gia đầy đủ các buổi học để không bỏ lỡ kiến thức quan trọng và đạt được kết quả tốt nhất.\n\nChúc bạn một ngày học tập hiệu quả!\n\n*Đây là email được gửi tự động từ hệ thống ITFace của Khoa Công nghệ Thông tin trường Đại học Văn Lang, vui lòng không reply email này.*\n\n---\nITFace Team - Khoa Công nghệ Thông tin Trường Đại học Văn Lang\n|| 0919079192 || itface.vlu@gmail.com\n\nVAN LANG UNIVERSITY\nHotline: 028.71 099 240 | https://www.vlu.edu.vn\nMain campus: 69/68 Dang Thuy Tram Street, Ward 13, Binh Thanh District, HCMC, Vietnam\nCampus 1: 45 Nguyen Khac Nhu Street, Co Giang Ward, District 1, HCMC, Vietnam\nCampus 2: 233A Phan Van Tri Street, Ward 11, Binh Thanh District, HCMC, Vietnam`;
    const html = `<p>Chào bạn,</p><p>Giảng viên nhận thấy rằng bạn đã nghỉ học quá nhiều buổi môn <strong>${subjectName}</strong> của lớp <strong>${classcode}</strong>. Việc nghỉ học thường xuyên có thể ảnh hưởng đến điểm quá trình và kết quả học tập của bạn.</p><p>Giảng viên khuyến khích bạn tham gia đầy đủ các buổi học để không bỏ lỡ kiến thức quan trọng và đạt được kết quả tốt nhất.</p><p>Chúc bạn một ngày học tập hiệu quả!</p><p><em>Đây là email được gửi tự động từ hệ thống ITFace của Khoa Công nghệ Thông tin trường Đại học Văn Lang, vui lòng không reply email này.</em></p><hr/><p>ITFace Team - Khoa Công nghệ Thông tin Trường Đại học Văn Lang</p><p>|| 0919079192 || <a href="mailto:itface.vlu@gmail.com">itface.vlu@gmail.com</a></p><p>VAN LANG UNIVERSITY<br/>Hotline: 028.71 099 240 | <a href="https://www.vlu.edu.vn">https://www.vlu.edu.vn</a><br/>Main campus: 69/68 Dang Thuy Tram Street, Ward 13, Binh Thanh District, HCMC, Vietnam<br/>Campus 1: 45 Nguyen Khac Nhu Street, Co Giang Ward, District 1, HCMC, Vietnam<br/>Campus 2: 233A Phan Van Tri Street, Ward 11, Binh Thanh District, HCMC, Vietnam</p>`;

    return new Promise((resolve, reject) => {
      if (!Array.isArray(emails) || emails.length === 0) {
        resolve(true); // Không có email để gửi, coi như thành công
        return;
      }

      const sendPromises = emails.map(email => {
        const mailOptions = {
          from: `"ITFaceVLU" <${MyConstants.EMAIL_USER}>`,
          to: email,
          subject: subject,
          text: text,
          html: html,
        };
        return new Promise((resolveInner, rejectInner) => {
          transporter.sendMail(mailOptions, (err, result) => {
            if (err) {
              console.error(`Error sending email to ${email}:`, err);
              rejectInner(err);
            } else {
              console.log(`Email sent to ${email}:`, result);
              resolveInner(true);
            }
          });
        });
      });

      Promise.all(sendPromises)
        .then(() => resolve(true))
        .catch((err) => reject(err));
    });
  },
};

module.exports = EmailNoticeUtil;
