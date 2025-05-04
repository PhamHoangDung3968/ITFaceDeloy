import React, { useState, useEffect, useRef } from 'react';
import logo1 from "../dist/img/logoIT.png"
import logo2 from '../dist/img/logoVLU.abdc5798120a9127abb6.png';
import icon_face from "../dist/img/icon_face.png";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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
  const [errorState1, setErrorState1] = useState('');
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isLoggingInWithFaceID, setIsLoggingInWithFaceID] = useState(false);
  const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng

  useEffect(() => {
    if (error) {
      setErrorState(error);
    }
  }, [error]);

  const handleLoginClick = () => {
    setErrorState('');
    handleLogin();
  };
  

  //Xử lý FaceID
  const videoRef = useRef(null);
  const handleOpenCameraModal = () => {
    setShowCameraModal(true);
  };

  const handleOpenCamera = () => {
    if (navigator.mediaDevices?.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.play();
                    setIsCameraOpen(true);
                }
            })
            .catch(err => {
                console.error('Error accessing webcam:', err);
                setErrorState('Không thể truy cập camera.');
            });
    } else {
        setErrorState('Thiết bị không hỗ trợ truy cập camera.');
    }
  };

  useEffect(() => {
    if (showCameraModal) {
      handleOpenCamera();
    }
  }, [showCameraModal]);
  
  const handleCloseCameraModal = () => {
    setShowCameraModal(false);
    if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false); // Added this line
  };

  const handleFaceIDLogin = async () => {
    if (!videoRef.current || !isCameraOpen || isLoggingInWithFaceID) {
        return;
    }

    setIsLoggingInWithFaceID(true);
    setErrorState1(''); // Reset error state for Face ID

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const image = canvas.toDataURL('image/jpeg');

    try {
        const response = await axios.post('/login_v02_user', { image: image.split(',')[1] });
        console.log('Face ID Login Response:', response.data);
        setIsLoggingInWithFaceID(false);

        if (response.data.message === 'Login successful') {
            try {
                await axios.get("/api/admin/count-faceid-login"); // Đợi API cập nhật số lần đăng nhập FaceID
            } catch (countError) {
                console.error("Lỗi khi cập nhật số lượt đăng nhập FaceID:", countError);
            }

            navigate('/admin/home'); // Điều hướng đến trang /home sau khi đăng nhập thành công
            window.location.reload();
        } else {
            setErrorState1(response.data.message || 'Đăng nhập bằng Face ID thất bại.');
        }
        
        handleCloseCameraModal();
    } catch (error) {
        console.error('Error during Face ID login:', error);
        setIsLoggingInWithFaceID(false);
        
        if (error.response && error.response.data && error.response.data.message) {
            setErrorState1(error.response.data.message);
        } else {
            setErrorState1('Đã có lỗi xảy ra khi đăng nhập bằng Face ID.');
        }
    }
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
      <div className="login-box" style={{ marginTop: '10px' }}>
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
            <p className="login-box-msg">
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
            <h6 class="login-box-msg" style={{ color:'white' }}>Đăng nhập bằng tài khoản Văn Lang hoặc bằng FaceID</h6>
            {errorState && <div className="error-message"><b>{errorState}</b></div>}
              <button 
                className="btn btn-sm btn-danger float-left" 
                style={{ 
                  width: '235px', 
                  height: '70px', 
                  borderRadius: '10px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }} 
                onClick={handleLoginClick}
              >
                <b style={{ fontSize: '18px' }}>ĐĂNG NHẬP</b>
              </button>
                <button 
                  style={{ 
                    width: '70px', 
                    height: '70px', 
                    borderRadius: '10px', // hoặc '50%' nếu muốn tròn hơn nữa
                    backgroundColor: 'white', 
                    border: '2px solid #DC3545', // viền hồng nhạt
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    padding: 0
                  }} 
                  className="btn btn-sm float-right" 
                  onClick={handleOpenCameraModal}
                  disabled={isLoggingInWithFaceID} // Disabled during Face ID login
                >
                <img 
                  src={icon_face} 
                  alt="Face ID" 
                  style={{ 
                    width: '45px', 
                    height: '45px', 
                    filter: 'brightness(0) saturate(100%) invert(17%) sepia(93%) saturate(6682%) hue-rotate(341deg) brightness(91%) contrast(94%)',
                    transition: 'transform 0.3s ease',
                  }} 
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.15)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
                </button>
            </div>
          </div>
        </div>
      </div>
      <div className="card-footer">
      <h5 className="h5" style={{ color: 'white', marginTop: '10px', textAlign: 'center' }}>
        © {currentYear} - Bản Quyền Thuộc Khoa Công nghệ Thông tin, Trường Đại Học Văn Lang.
      </h5>
      </div>
      {showCameraModal && (
  <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Đăng nhập FaceID</h5>
          <button type="button" className="close" onClick={handleCloseCameraModal}>
            <span>&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <video ref={videoRef} style={{ width: '100%', maxWidth: '600px', height: '100%' }}></video>
        </div>
        {errorState1 && <div className="error-message" style={{ textAlign:'center' }}><b>{errorState1}</b></div>}
        <div className="modal-footer" style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <button
            type="button"
            className="btn btn-danger"
            style={{ borderRadius: '10px' }}
            onClick={handleFaceIDLogin} // Initiates Face ID login
            disabled={!isCameraOpen || isLoggingInWithFaceID} // Disabled if camera is off or login in progress
          >
            {isLoggingInWithFaceID ? 'Đang xác thực...' : 'Đăng nhập'}
          </button>                
          <button type="button" className="btn btn-secondary" style={{ borderRadius: '10px'}} onClick={handleCloseCameraModal}>Hủy</button>
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default DangNhap;
