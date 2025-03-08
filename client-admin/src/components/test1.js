// // import React, { useState } from 'react';
// // import axios from 'axios';
// // import { useNavigate } from 'react-router-dom';

// // const Test = () => {
// //     const [classCode, setClassCode] = useState('242_71ITDS30103_0301');
// //     const [token, setToken] = useState('');
// //     const [qrCode, setQrCode] = useState('');
// //     const navigate = useNavigate();

// //     const generateQrCode = async () => {
// //         try {
// //             const response = await axios.post(`/api/admin/generate/${classCode}`, {
// //                 url: window.location.origin  // Send dynamic URL to the server
// //             });
// //             setToken(response.data.token);
// //             setQrCode(response.data.qrCodeImage);
// //         } catch (error) {
// //             console.error('Error generating QR code:', error);
// //         }
// //     };

// //     const scanQrCode = async () => {
// //         try {
// //             const response = await axios.post(`/api/admin/scan/${classCode}`, {
// //                 url: window.location.origin  // Send dynamic URL to the server
// //             }, {
// //                 headers: {
// //                     'x-access-token': token
// //                 }
// //             });
// //             console.log('Scan response:', response);

// //             // Navigate to URL after successful scan
// //             if (response.status === 200) {
// //                 window.location.href = `${window.location.origin}/admin/attendance/${classCode}`;
// //             }
// //         } catch (error) {
// //             console.error('Error scanning QR code:', error);
// //         }
// //     };

// //     return (
// //         <div>
// //             <h1>QR Code Generator and Scanner</h1>
// //             <button onClick={generateQrCode}>Generate QR Code</button>
// //             {qrCode && (
// //                 <div>
// //                     <img src={qrCode} alt="QR Code" />
// //                     <button onClick={scanQrCode}>Scan QR Code</button>
// //                 </div>
// //             )}
// //         </div>
// //     );
// // };

// // export default Test;

// import React, { useState } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';

// const Test = () => {
//     const [classCode, setClassCode] = useState('242_71ITDS30103_0301');
//     const [token, setToken] = useState('');
//     const [qrCode, setQrCode] = useState('');
//     const [scanSuccess, setScanSuccess] = useState(false);
//     const defaultUrl = window.location.origin; // URL mặc định

//     const generateQrCode = async () => {
//         try {
//             const response = await axios.post(`/api/admin/generate/${classCode}`, {
//                 url: defaultUrl // Sử dụng URL mặc định
//             });
//             console.log('Token:', response.data.token); // Log the token
//             console.log('QR Code Image:', response.data.qrCodeImage); // Log the QR code image
//             setToken(response.data.token);
//             setQrCode(response.data.qrCodeImage);
//             localStorage.setItem('token', response.data.token); // Store the token in localStorage
//         } catch (error) {
//             console.error('Error generating QR code:', error);
//         }
//     };

//     const scanQrCode = async () => {
//         try {
//             const response = await axios.post(`/api/admin/scan/${classCode}`, {
//                 url: defaultUrl // Sử dụng URL mặc định
//             }, {
//                 headers: {
//                     'x-access-token': token
//                 }
//             });
//             console.log('Scan response:', response);

//             // Điều hướng đến URL sau khi quét thành công
//             if (response.status === 200) {
//                 setScanSuccess(true); // Set scan success to true
//             }
//         } catch (error) {
//             console.error('Error scanning QR code:', error);
//         }
//     };

//     return (
//         <div>
//             <h1>QR Code Generator and Scanner</h1>
//             <button onClick={generateQrCode}>Generate QR Code</button>
//             {qrCode && (
//                 <div>
//                     <img src={qrCode} alt="QR Code" />
//                     <button onClick={scanQrCode}>Scan QR Code</button>
//                 </div>
//             )}
//             {scanSuccess && (
//                 <Link to='/admin/test1'>Go to Test1</Link>
//             )}
//         </div>
//     );
// };

// export default Test;


// import React, { useState } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';

// const Test = () => {
//     const [classCode, setClassCode] = useState('242_71ITDS30103_0301');
//     const [token, setToken] = useState('');
//     const [qrCode, setQrCode] = useState('');
//     const [scanSuccess, setScanSuccess] = useState(false);
//     const defaultUrl = window.location.origin; // URL mặc định

//     const generateQrCode = async () => {
//         try {
//             const response = await axios.post(`/api/admin/generate/${classCode}`, {
//                 url: defaultUrl // Sử dụng URL mặc định
//             });
//             console.log('Token:', response.data.token); // Log the token
//             console.log('QR Code Image:', response.data.qrCodeImage); // Log the QR code image
//             setToken(response.data.token);
//             setQrCode(response.data.qrCodeImage);
//             localStorage.setItem('token', response.data.token); // Store the token in localStorage
//         } catch (error) {
//             console.error('Error generating QR code:', error);
//         }
//     };

//     const scanQrCode = async () => {
//         try {
//             const response = await axios.post(`/api/admin/scan/${classCode}`, {
//                 url: defaultUrl // Sử dụng URL mặc định
//             }, {
//                 headers: {
//                     'x-access-token': token
//                 }
//             });
//             console.log('Scan response:', response);

//             // Điều hướng đến URL sau khi quét thành công
//             if (response.status === 200) {
//                 setScanSuccess(true); // Set scan success to true
//             }
//         } catch (error) {
//             console.error('Error scanning QR code:', error);
//         }
//     };

//     return (
//         <div>
//             <h1>QR Code Generator and Scanner</h1>
//             <button onClick={generateQrCode}>Generate QR Code</button>
//             {qrCode && (
//                 <div>
//                     <img src={qrCode} alt="QR Code" />
//                     <button onClick={scanQrCode}>Scan QR Code</button>
//                 </div>
//             )}
//             {scanSuccess && (
//                 <Link to='/admin/test1'>Go to Test1</Link>
//             )}
//         </div>
//     );
// };

// export default Test;















// import React, { useState } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';
// import { v4 as uuidv4 } from 'uuid';

// const Test = () => {
//     const [classCode, setClassCode] = useState('242_71ITDS30103_0301');
//     const [token, setToken] = useState('');
//     const [qrCode, setQrCode] = useState('');
//     const [scanSuccess, setScanSuccess] = useState(false);
//     const defaultUrl = window.location.origin;
//     const deviceUUID = uuidv4(); // Tạo UUID duy nhất cho thiết bị

//     const generateQrCode = async () => {
//         try {
//             const response = await axios.post(`/api/admin/generate/${classCode}`, {
//                 url: defaultUrl
//             });
//             console.log('Token:', response.data.token);
//             console.log('QR Code Image:', response.data.qrCodeImage);
//             setToken(response.data.token);
//             setQrCode(response.data.qrCodeImage);
//             localStorage.setItem('token', response.data.token);
//             localStorage.setItem('deviceUUID', response.data.deviceUUID); // Lưu UUID vào localStorage
//         } catch (error) {
//             console.error('Error generating QR code:', error);
//         }
//     };

//     const scanQrCode = async () => {
//         try {
//             const response = await axios.post(`/api/admin/scan/${classCode}`, {
//                 url: defaultUrl,
//                 deviceUUID: localStorage.getItem('deviceUUID') // Gửi UUID cùng với yêu cầu
//             }, {
//                 headers: {
//                     'x-access-token': token
//                 }
//             });
//             console.log('Scan response:', response);

//             if (response.status === 200) {
//                 setScanSuccess(true);
//                 localStorage.removeItem('token'); // Xóa token khỏi localStorage sau khi sử dụng
//             }
//         } catch (error) {
//             console.error('Error scanning QR code:', error);
//         }
//     };

//     return (
//         <div>
//             <h1>QR Code Generator and Scanner</h1>
//             <button onClick={generateQrCode}>Generate QR Code</button>
//             {qrCode && (
//                 <div>
//                     <img src={qrCode} alt="QR Code" />
//                     <button onClick={scanQrCode}>Scan QR Code</button>
//                 </div>
//             )}
//             {scanSuccess && (
//                 <Link to='/admin/test1'>Go to Test1</Link>
//             )}
//         </div>
//     );
// };

// export default Test;


// import React, { useState } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';
// import { v4 as uuidv4 } from 'uuid';

// const Test = () => {
//     const [classCode, setClassCode] = useState('242_71ITDS30103_0301');
//     const [token, setToken] = useState('');
//     const [qrCode, setQrCode] = useState('');
//     const [scanSuccess, setScanSuccess] = useState(false);
//     const defaultUrl = window.location.origin;
//     const deviceUUID = uuidv4(); // Tạo UUID duy nhất cho thiết bị

//     // Hàm định dạng ngày thành dd-mm-yyyy
//     const formatDate = (date) => {
//         const d = new Date(date);
//         const day = (`0${d.getDate()}`).slice(-2);
//         const month = (`0${d.getMonth() + 1}`).slice(-2);
//         const year = d.getFullYear();
//         return `${day}-${month}-${year}`;
//     };

//     const day = formatDate(new Date()); // Lấy ngày hiện tại với định dạng dd-mm-yyyy

//     const generateQrCode = async () => {
//         try {
//             const response = await axios.post(`/api/admin/generate/${classCode}/${day}`, {
//                 url: defaultUrl
//             });
//             console.log('Token:', response.data.token);
//             console.log('QR Code Image:', response.data.qrCodeImage);
//             setToken(response.data.token);
//             setQrCode(response.data.qrCodeImage);
//             localStorage.setItem('token', response.data.token);
//             localStorage.setItem('deviceUUID', response.data.deviceUUID); // Lưu UUID vào localStorage
//             localStorage.setItem('day', response.data.day); // Lưu ngày tháng vào localStorage
//         } catch (error) {
//             console.error('Error generating QR code:', error);
//         }
//     };

//     const scanQrCode = async () => {
//         try {
//             const response = await axios.post(`/api/admin/scan/${classCode}/${localStorage.getItem('day')}`, {
//                 url: defaultUrl,
//                 deviceUUID: localStorage.getItem('deviceUUID') // Gửi UUID cùng với yêu cầu
//             }, {
//                 headers: {
//                     'x-access-token': token
//                 }
//             });
//             console.log('Scan response:', response);

//             if (response.status === 200) {
//                 setScanSuccess(true);
//                 localStorage.removeItem('token'); // Xóa token khỏi localStorage sau khi sử dụng
//             }
//         } catch (error) {
//             console.error('Error scanning QR code:', error);
//         }
//     };

//     return (
//         <div>
//             <h1>QR Code Generator and Scanner</h1>
//             <button onClick={generateQrCode}>Generate QR Code</button>
//             {qrCode && (
//                 <div>
//                     <img src={qrCode} alt="QR Code" />
//                     <button onClick={scanQrCode}>Scan QR Code</button>
//                 </div>
//             )}
//             {scanSuccess && (
//                 <Link to='/admin/test1'>Go to Test1</Link>
//             )}
//         </div>
//     );
// };

// export default Test;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const Test = () => {
    const [classCode, setClassCode] = useState('242_71ITDS30103_0301');
    const [token, setToken] = useState('');
    const [qrCode, setQrCode] = useState('');
    const [scanSuccess, setScanSuccess] = useState(false);
    const [countdown, setCountdown] = useState(10); // Thêm state cho bộ đếm thời gian
    const defaultUrl = window.location.origin;
    const deviceUUID = uuidv4(); // Tạo UUID duy nhất cho thiết bị

    useEffect(() => {
        // Clear localStorage on component mount
        localStorage.clear();
    }, []);

    // Hàm định dạng ngày thành dd-mm-yyyy
    const formatDate = (date) => {
        const d = new Date(date);
        const day = (`0${d.getDate()}`).slice(-2);
        const month = (`0${d.getMonth() + 1}`).slice(-2);
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const day = formatDate(new Date()); // Lấy ngày hiện tại với định dạng dd-mm-yyyy

    const generateQrCode = async () => {
        try {
            const response = await axios.post(`/api/admin/generate/${classCode}/${day}`, {
                url: defaultUrl
            });
            console.log('Token:', response.data.token);
            console.log('QR Code Image:', response.data.qrCodeImage);
            setToken(response.data.token);
            setQrCode(response.data.qrCodeImage);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('deviceUUID', response.data.deviceUUID); // Lưu UUID vào localStorage
            localStorage.setItem('day', response.data.day); // Lưu ngày tháng vào localStorage
            setCountdown(10); // Đặt lại bộ đếm thời gian khi mã QR được tạo
        } catch (error) {
            console.error('Error generating QR code:', error);
        }
    };

    const fetchQrCode = async () => {
        try {
            const response = await axios.get(`/api/admin/generate/${classCode}/${day}/qr`, {
                params: { url: defaultUrl }
            });
            setQrCode(response.data.qrCodeImage);
            setCountdown(10); // Đặt lại bộ đếm thời gian mỗi khi mã QR được cập nhật
        } catch (error) {
            console.error('Error fetching QR code:', error);
        }
    };

    useEffect(() => {
        if (token) {
            const interval = setInterval(fetchQrCode, 10000); // Lấy mã QR mới mỗi 10 giây
            return () => clearInterval(interval); // Xóa interval khi component unmount
        }
    }, [token]);

    useEffect(() => {
        if (token) {
            const countdownInterval = setInterval(() => {
                setCountdown(prevCountdown => prevCountdown > 0 ? prevCountdown - 1 : 10);
            }, 1000); // Giảm bộ đếm thời gian mỗi giây

            return () => clearInterval(countdownInterval); // Xóa interval khi component unmount
        }
    }, [token]);

    const scanQrCode = async () => {
        try {
            const response = await axios.post(`/api/admin/scan/${classCode}/${localStorage.getItem('day')}`, {
                url: defaultUrl,
                deviceUUID: localStorage.getItem('deviceUUID') // Gửi UUID cùng với yêu cầu
            }, {
                headers: {
                    'x-access-token': token
                }
            });
            console.log('Scan response:', response);

            if (response.status === 200) {
                setScanSuccess(true);
                localStorage.removeItem('token'); // Xóa token khỏi localStorage sau khi sử dụng
            }
        } catch (error) {
            console.error('Error scanning QR code:', error);
        }
    };

    return (
        <div>
            <h1>QR Code Generator and Scanner</h1>
            <button onClick={generateQrCode}>Generate QR Code</button>
            {qrCode && (
                <div>
                    <img src={qrCode} alt="QR Code" />
                    <p>QR code sẽ thay đổi trong: {countdown} giây</p> {/* Hiển thị bộ đếm thời gian */}
                    <button onClick={scanQrCode}>Scan QR Code</button>
                </div>
            )}
            {scanSuccess && (
                <Link to='/admin/test1'>Go to Test1</Link>
            )}
        </div>
    );
};

export default Test;