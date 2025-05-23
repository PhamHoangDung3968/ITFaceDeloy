import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DisplayInfo = ({ userCode, userID, userEmail }) => {
    const location = useLocation();
    const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng
    const queryParams = new URLSearchParams(location.search);
    const classcode = queryParams.get('classcode');
    const day = queryParams.get('day');
    const formatDate = (dateString) => {
        const [day, month, year] = dateString.split('-');
        return `${day}/${month}/${year}`;
    };

    const formattedDay = day ? formatDate(day) : '';
    const [isProcessing, setIsProcessing] = useState(false);


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

    const handleLoginUser = async () => {
        if (isProcessing) return;
        setIsProcessing(true);
        try {
            if (!videoRef.current) {
                setIsProcessing(false);
                return;
            }
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const context = canvas.getContext('2d');
            context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
            const image = canvas.toDataURL('image/jpeg');
            setWebcamImage(image);
            const loginResponse = await axios.post('/login_v02_user', {
                image: image.split(',')[1]
            });
            if (loginResponse.status === 200) {
                const userResponse = await axios.get('/user_v02');
                const userData = userResponse.data;
                const userID = userData._id;
                const userEmail = userData.microsoftData?.email;
                const today = new Date();
                const formattedToday = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
                const currentTime = `${today.getHours().toString().padStart(2, '0')}:${today.getMinutes().toString().padStart(2, '0')}:${today.getSeconds().toString().padStart(2, '0')}`;
                await axios.post(`/api/admin/studentclass/dateattendancing/${classcode}`, {
                    studentId: userID,
                    date: formattedDay,
                    status: 'Có mặt' // hoặc bất kỳ trạng thái nào bạn muốn đặt
                })
                showToast('Điểm danh thành công!');
                setTimeout(() => {
                    showWarningToast("Vui lòng chờ đợi cho hệ thống xử lý!")
                }, 500);
                await axios.post('/api/admin/send-email', {
                    classcode: classcode,
                    email: userEmail, // Thay thế bằng địa chỉ email thực tế
                    date: formattedToday,
                    time: currentTime,
                    image: image.split(',')[1] // Loại bỏ tiền tố data URL
                });
                navigate(`/admin/attendance-student/${classcode}`);
                window.location.reload();
            }
        } catch (error) {
            console.error('Lỗi trong quá trình đăng nhập hoặc điểm danh:', error);
            showErrorToast('Đã xảy ra lỗi trong quá trình đăng nhập hoặc điểm danh');
        } finally {
            setIsProcessing(false);
        }
    };

    // const handleLoginUser2 = async () => {
    //     if (isProcessing) return;
    //     setIsProcessing(true);
    //     try {
    //         if (!videoRef.current) {
    //             setIsProcessing(false);
    //             return;
    //         }
    //         const canvas = document.createElement('canvas');
    //         canvas.width = videoRef.current.videoWidth;
    //         canvas.height = videoRef.current.videoHeight;
    //         const context = canvas.getContext('2d');
    //         context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    //         const image = canvas.toDataURL('image/jpeg');
    //         setWebcamImage(image);
            
    //             const userResponse = await axios.get('/user');
    //             const userData = userResponse.data;
    //             const userID = userData._id;
    //             const userEmail = userData.microsoftData?.mail;
    //             const today = new Date();
    //             const formattedToday = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
    //             const currentTime = `${today.getHours().toString().padStart(2, '0')}:${today.getMinutes().toString().padStart(2, '0')}:${today.getSeconds().toString().padStart(2, '0')}`;
    //             await axios.post(`/api/admin/studentclass/dateattendancing/${classcode}`, {
    //                 studentId: userID,
    //                 date: formattedDay,
    //                 status: 'Có mặt' // hoặc bất kỳ trạng thái nào bạn muốn đặt
    //             })
    //             await axios.post('/api/admin/send-email', {
    //                 classcode: classcode,
    //                 email: userEmail, // Thay thế bằng địa chỉ email thực tế
    //                 date: formattedToday,
    //                 time: currentTime,
    //                 image: image.split(',')[1] // Loại bỏ tiền tố data URL
    //             });
    //             setTimeout(() => {
    //                 showToast('Điểm danh thành công!');
    //                 navigate(`/admin/attendance-student/${classcode}`);
    //                 window.location.reload();
    //             }, 7000);
    //     } catch (error) {
    //         console.error('Lỗi trong quá trình đăng nhập hoặc điểm danh:', error);
    //         showErrorToast('Đã xảy ra lỗi trong quá trình đăng nhập hoặc điểm danh');
    //     } finally {
    //         setTimeout(() => {
    //             setIsProcessing(false);
    //         }, 7000);
    //     }
    // };

    const showToast = (message) => {
        toast.success(message, { position: "top-right" });
    };

    const showErrorToast = (message) => {
        toast.error(message, { position: "top-right" });
    };
    const showWarningToast = (message) => {
        toast.warning(message, { position: "top-right" });
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
                        <div className="col-lg-6">
                            <div className="card">
                                <div className="card-body">
                                <p style={{fontSize:'20px'}}>Mã lớp: {classcode}</p>
                                <p style={{fontSize:'20px'}}>Ngày: {formattedDay}</p>
                                    <div style={{ backgroundColor: 'black', width: '100%', maxWidth: '600px', marginTop: '10px' }}>
                                        <video ref={videoRef} style={{ width: '100%', maxWidth: '600px', height: '100%' }}></video>
                                    </div>
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
                                            disabled={isProcessing}
                                            style={{ 
                                              display: isProcessing ? 'none' : 'block',
                                              fontSize: '16px', 
                                              fontWeight: 'bold', 
                                              padding: '10px 20px', 
                                              borderRadius: '8px', 
                                              cursor: 'pointer', 
                                              transition: 'all 0.3s ease', 
                                              background: 'linear-gradient(45deg, #2196F3, #64B5F6)', 
                                              color: 'white', 
                                              border: 'none' 
                                            }}
                                          >
                                            Điểm danh
                                          </button>
                                    </div>
                                </div>
                            </div>
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