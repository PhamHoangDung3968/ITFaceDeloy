// import React, { useEffect } from 'react';
// import { useLocation } from 'react-router-dom';

// const DisplayInfo = () => {
//     const location = useLocation();
//     const queryParams = new URLSearchParams(location.search);
//     const classcode = queryParams.get('classcode');
//     const day = queryParams.get('day');

//     useEffect(() => {
//         // Clear the token from localStorage when the component unmounts
//         return () => {
//             localStorage.removeItem('token');
//         };
//     }, []);

//     return (
//         <div>
//             <h1>Thông tin lớp học</h1>
//             <p>Mã lớp: {classcode}</p> {/* Hiển thị classcode */}
//             <p>Ngày: {day}</p> {/* Hiển thị ngày */}
//             {/* Nội dung khác của component */}
//         </div>
//     );
// };

// export default DisplayInfo;








import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DisplayInfo = ({ userCode, userID, userEmail }) => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const classcode = queryParams.get('classcode');
    const day = queryParams.get('day');
    const formatDate = (dateString) => {
        const [day, month, year] = dateString.split('-');
        return `${day}/${month}/${year}`;
    };

    const formattedDay = day ? formatDate(day) : '';

    useEffect(() => {
        return () => {
            localStorage.removeItem('token');
        };
    }, []);

    useEffect(() => {
        console.log('usercode:', userCode); // Log the classcode for debugging
        console.log('userID:', userID); // Log the classcode for debugging
        console.log('userEmail:', userEmail); // Log the classcode for debugging
    }, [userCode, userID, userEmail]);

    const [isWebcamOpen, setIsWebcamOpen] = useState(false);
    const [webcamImage, setWebcamImage] = useState(null);
    const videoRef = useRef(null);

    const handleOpenWebcam = () => {
        if (navigator.mediaDevices?.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(stream => {
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                        videoRef.current.play();
                        setIsWebcamOpen(true);
                        showToast('Bật camera thành công!');
                    }
                })
                .catch(error => {
                    console.error('Error accessing webcam:', error);
                    showErrorToast('Không truy cập được camera!');
                });
        }
    };

    const handleCloseWebcam = () => {
        if (videoRef.current?.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        setIsWebcamOpen(false);
        setWebcamImage(null);
        showToast('Tắt camera thành công!');
    };

const handleLoginUser = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const image = canvas.toDataURL('image/jpeg');

    setWebcamImage(image);

    axios.post('/api/admin/login_user', {
        name: userCode,
        image: image.split(',')[1] // Remove the data URL prefix
    })
    .then(response => {
        showToast(response.data.message);
        if (response.status === 200) {
            const today = new Date();
            const formattedToday = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
            const currentTime = `${today.getHours().toString().padStart(2, '0')}:${today.getMinutes().toString().padStart(2, '0')}:${today.getSeconds().toString().padStart(2, '0')}`;

            if (formattedDay > formattedToday) {
                showErrorToast('Điểm danh thất bại: Ngày điểm danh chưa tới.');
                return;
            }

            axios.post(`/api/admin/studentclass/dateattendancing/${classcode}`, {
                studentId: userID,
                date: formattedDay,
                status: 'Có mặt' // or any other status you want to set
            })
            .then(attendanceResponse => {
                showToast('Điểm danh thành công!');
                // Call the /send-email API
                axios.post('/api/admin/send-email', {
                    classcode: classcode,
                    email: userEmail, // Replace with the actual email address
                    date: formattedToday,
                    time: currentTime,
                    image: image.split(',')[1] // Remove the data URL prefix
                })
                .catch(emailError => {
                    console.error('Error sending email:', emailError);
                });
            })
            .catch(attendanceError => {
                console.error('Error updating attendance:', attendanceError);
            });
        }
    })
    .catch(error => {
        console.error('Error logging in user:', error);
        showErrorToast('Error logging in user');
    });
};

// const handleLoginUser = () => {
//     if (!videoRef.current) return;

//     const canvas = document.createElement('canvas');
//     canvas.width = videoRef.current.videoWidth;
//     canvas.height = videoRef.current.videoHeight;
//     const context = canvas.getContext('2d');
//     context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
//     const image = canvas.toDataURL('image/jpeg');

//     setWebcamImage(image);

//     axios.post('/api/admin/login_user', {
//         name: userCode,
//         image: image.split(',')[1] // Remove the data URL prefix
//     })
//     .then(response => {
//         showToast(response.data.message);
//         if (response.status === 200) {
//             const today = new Date();
//             const formattedToday = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
//             const currentTime = `${today.getHours().toString().padStart(2, '0')}:${today.getMinutes().toString().padStart(2, '0')}:${today.getSeconds().toString().padStart(2, '0')}`;

//             if (formattedDay > formattedToday) {
//                 showErrorToast('Điểm danh thất bại: Ngày điểm danh chưa tới.');
//                 return;
//             }

//             axios.post(`/api/admin/studentclass/dateattendancing/${classcode}`, {
//                 userID,
//                 date: formattedDay,
//                 status: 'Có mặt' // or any other status you want to set
//             })
//             .then(attendanceResponse => {
//                 showToast('Điểm danh thành công!');
//                 // Call the /send-email API
//                 axios.post('/api/admin/send-email', {
//                     email: userEmail, // Replace with the actual email address
//                     date: formattedToday,
//                     time: currentTime,
//                     image: image.split(',')[1] // Remove the data URL prefix
//                 })
//                 .then(() => showToast('Email sent successfully'))
//                 .catch(emailError => {
//                     console.error('Error sending email:', emailError);
//                     showErrorToast('Error sending email');
//                 });
//             })
//             .catch(attendanceError => {
//                 console.error('Error updating attendance:', attendanceError);
//                 showErrorToast('Error updating attendance');
//             });
//         }
//     })
//     .catch(error => {
//         console.error('Error logging in user:', error);
//         showErrorToast('Error logging in user');
//     });
// };


    const showToast = (message) => {
        toast.success(message, { position: "top-right" });
    };

    const showErrorToast = (message) => {
        toast.error(message, { position: "top-right" });
    };

    return (
        <div>
            <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1>Điểm danh FaceID</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <b><Link to='/admin/home' style={{ color: '#6B63FF' }}>Trang chủ</Link></b>
                  </li>
                  <li className="breadcrumb-item active">Điểm danh FaceID</li>
                </ol>
              </div>
            </div>
          </div>
        </section>
            
            
            <div className="content">
                <div className="container-fluid">
                    <div className="row">
                        {/* Cột chứa video */}
                        <div className="col-lg-6">
                            <div className="card">
                                <div className="card-body">
                                <p style={{fontSize:'20px'}}>Mã lớp: {classcode}</p> {/* Hiển thị classcode */}
                                <p style={{fontSize:'20px'}}>Ngày: {formattedDay}</p> {/* Hiển thị ngày */}
                                {/* Nội dung khác của component */}
                                    <div style={{ backgroundColor: 'black', width: '100%', maxWidth: '600px', height: '450px', marginTop: '10px' }}>
                                        <video ref={videoRef} style={{ width: '100%', maxWidth: '600px', height: '100%' }}></video>
                                    </div>
                                    {/* Các nút nằm dưới khung hình, căn giữa */}
                                    <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                                        <button 
                                            onClick={handleOpenWebcam} 
                                            disabled={isWebcamOpen}
                                            style={{ fontSize: '16px', fontWeight: 'bold', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.3s ease', background: isWebcamOpen ? '#ddd' : 'linear-gradient(45deg, #4CAF50, #8BC34A)', color: isWebcamOpen ? '#999' : 'white', border: 'none' }}
                                        >
                                            Bật camera
                                        </button>

                                        <button 
                                            onClick={handleCloseWebcam} 
                                            disabled={!isWebcamOpen}
                                            style={{ fontSize: '16px', fontWeight: 'bold', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.3s ease', background: !isWebcamOpen ? '#ddd' : 'linear-gradient(45deg, #F44336, #E57373)', color: !isWebcamOpen ? '#999' : 'white', border: 'none' }}
                                        >
                                            Tắt camera
                                        </button>

                                            <button 
                                                onClick={handleLoginUser}
                                                style={{ fontSize: '16px', fontWeight: 'bold', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.3s ease', background: 'linear-gradient(45deg, #2196F3, #64B5F6)', color: 'white', border: 'none' }}
                                            >
                                                Điểm danh
                                            </button>
                                    </div>
                                </div>
                            </div>

                            {/* Thông báo đã đăng ký */}
                           
                        </div>

                        {/* Cột chứa hướng dẫn */}
                        <div className="col-lg-6">
                            <div className="card">
                                <div className="card-body">
                                    <h4>Hướng dẫn điểm danh khuôn mặt</h4>

                                    <h5>Chuẩn bị:</h5>
                                    <ul>
                                        <li>Ngồi ở nơi có ánh sáng tốt.</li>
                                        <li>Đảm bảo đủ ánh sáng để khuôn mặt rõ ràng.</li>
                                    </ul>

                                    <h5>Vị trí khuôn mặt:</h5>
                                    <ul>
                                        <li>Nhìn thẳng vào camera và khuôn mặt nằm chính giữa khung hình.</li>
                                        <li>Nhìn trực diện, không quay đầu hoặc nghiêng mặt và đặt khuôn mặt cách camera 30-50 cm.</li>
                                    </ul>
                                    <h5>Tránh che khuất khuôn mặt</h5>
                                    <ul>
                                        <li>Tháo khẩu trang, kính râm, hoặc vật dụng che mặt và giữ khuôn mặt tự nhiên.</li>
                                        <li>Nếu đeo kính, đảm bảo không có ánh sáng phản chiếu.</li>
                                    </ul>

                                    <h5>Tránh chuyển động</h5>
                                    <ul>
                                        <li>Giữ đầu ổn định trong suốt quá trình.</li>
                                        <li>Tránh nháy mắt hoặc biểu cảm khuôn mặt.</li>
                                    </ul>

                                    <h5>Môi trường xung quanh</h5>
                                    <ul>
                                        <li>Nền phía sau nên đơn giản.</li>
                                        <li>Tránh yếu tố gây xao nhãng, như người khác di chuyển trong khung hình.</li>
                                    </ul>

                                    <h5>Camera</h5>
                                    <ul>
                                        <li>Đảm bảo camera hoạt động tốt và ống kính không bị bẩn.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ToastContainer />
            </div>
        </div>
    );
};

export default DisplayInfo;