import React, { useState, useEffect } from 'react';
import logo0 from '../dist/img/logovlu2.png';
import logo1 from "../dist/img/logoIT.png"
import logo2 from '../dist/img/logoVLU.abdc5798120a9127abb6.png';
import backgroundImage from '../dist/img/bglogin.jpg';
import '../plugins/fontawesome-free/css/all.min.css';
import '../plugins/daterangepicker/daterangepicker.css';
import '../plugins/icheck-bootstrap/icheck-bootstrap.min.css';
import '../plugins/bootstrap-colorpicker/css/bootstrap-colorpicker.min.css';
import '../plugins/tempusdominus-bootstrap-4/css/tempusdominus-bootstrap-4.min.css';
import '../plugins/select2/css/select2.min.css';
import '../plugins/select2-bootstrap4-theme/select2-bootstrap4.min.css';
import '../plugins/bootstrap4-duallistbox/bootstrap-duallistbox.min.css';
import '../plugins/bs-stepper/css/bs-stepper.min.css';
import '../plugins/dropzone/min/dropzone.min.css';

const DangNhap = ({ handleLogin, error }) => {
  const [errorState, setErrorState] = useState('');
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (error) {
      setErrorState(error);
    }
  }, [error]);

  const handleLoginClick = () => {
    setErrorState('');
    handleLogin();
  };

  return (
    <div className="hold-transition login-page" style={{
      backgroundImage: `url(${backgroundImage})`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      backgroundColor: 'linear-gradient(to bottom right, #0066cc, #d0e0ff)',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backgroundBlendMode: 'multiply',
      position: 'relative'
    }}>
      <img src={logo1} style={{ width: '250px', height: 'auto' }} />

      <h4 className="h4" style={{ color: 'white', textAlign: 'center' }}>
        <b>HỆ THỐNG</b>
      </h4>
      <h2 className="h2" style={{ color: 'white', textAlign: 'center' }}>
        <b>ĐIỂM DANH SINH VIÊN KHOA CNTT</b>
      </h2>
      <h2 className="h2" style={{ color: 'white', textAlign: 'center' }}>
        <b>TRƯỜNG ĐẠI HỌC VĂN LANG</b>
      </h2>
      <div className="login-box" style={{ marginTop: '30px' }}>
        <div className="card card-outline card-primary" style={{
        backgroundColor: 'rgba(255, 255, 255, 0.3)', // Nền trắng với độ trong suốt 80%
        borderRadius: '5px', // Bo góc cho khung
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)', // Bóng mờ nhẹ
        border: 'none'
        // padding: '20px' // Thêm khoảng cách bên trong
        }}>
          <div className="card-header text-center">
            {/* <h1 className="h1"><img src={logo1} style={{ width: '300px', height: 'auto'}} />
            </h1> */}
          </div>
          <div className="card-body">
            <p className="login-box-msg" style={{ marginTop: '10px' }}>
              <img src={logo2} style={{ width: '100px', height: 'auto', animation: 'slideInFromRight 1s ease-in-out, moveBanner 5s infinite' }} />
            </p>
            <style>
              {`
                @keyframes moveBanner {
                  0% { transform: translateY(0); }
                  50% { transform: translateY(-16px); }
                  100% { transform: translateY(0); }
                }
              `}
            </style>
            <div className="social-auth-links text-center mt-2 mb-3">
            <h6 class="login-box-msg" style={{ color:'white' }}>Đăng nhập bằng tài khoản Văn Lang</h6>
            {errorState && <div className="error-message"><b>{errorState}</b></div>}
              <button className="btn btn-block btn-danger" style={{ height: '70px', borderRadius:'10px' }} onClick={handleLoginClick}>
               <h5><b>ĐĂNG NHẬP</b></h5>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="card-footer">

      <h5 className="h5" style={{ color: 'white', marginTop: '30px', textAlign: 'center' }}>
        © {currentYear} - Bản Quyền Thuộc Khoa Công nghệ Thông tin, Trường Đại Học Văn Lang.
      </h5>
      </div>
    </div>
  );
};

export default DangNhap;
