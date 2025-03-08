// import React, { Component } from 'react';
// import axios from 'axios';
// import MyContext from '../contexts/MyContext';
// import { Link } from 'react-router-dom';
// import '../plugins/fontawesome-free/css/all.min.css';
// import '../plugins/tempusdominus-bootstrap-4/css/tempusdominus-bootstrap-4.min.css';
// import '../plugins/icheck-bootstrap/icheck-bootstrap.min.css';
// import '../plugins/jqvmap/jqvmap.min.css';
// import '../dist/css/adminlte.min.css';
// import '../plugins/overlayScrollbars/css/OverlayScrollbars.min.css';
// import '../plugins/daterangepicker/daterangepicker.css';
// import '../plugins/summernote/summernote-bs4.min.css';
// import '../dist/css/pagination.css';
// import '../dist/css/buttonIcon.css';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// class Test extends Component {
//   static contextType = MyContext;
//   state = {
//     subjectterms: [],
//     modalMessage: '',
//     file: null,
//     showModal: false,
//     isLoading: false, // Thêm trạng thái isLoading

//     runtime: null,
//   totalRowsChanged: null,
//   addedEmails: [],
//   addedSubjectCodes: [],
//   addedSubjectTermCodes: [],
//   addedClassCodes: [],
//   duplicateTeachers: [], // Thêm trạng thái duplicateTeachers

    
//   };

//   handleFileChange = (event) => {
//     this.setState({ file: event.target.files[0] });
//   };

//   fileInputRef = React.createRef();
//   handleFileChange1 = () => {
//     axios({
//       url: '/api/admin/export-attendance/242_71ITSE41303_0102',
//       method: 'GET',
//       responseType: 'blob', // Important to handle binary data
//     })
//     .then((response) => {
//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', 'attendance_242_71ITSE41303_0102.xlsx'); // Set the file name
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//     })
//     .catch((error) => {
//       console.error('Error downloading the file:', error);
//     });
//   }
//   // handleFileUpload = () => {
//   //   this.setState({ isLoading: true }); // Bắt đầu hiệu ứng loading
//   //   const formData = new FormData();
//   //   formData.append('file', this.state.file);
  
//   //   axios.post('/api/admin/upload', formData)
//   //     .then(response => {
//   //       console.log(response.data);
//   //       this.setState({ 
//   //         file: null, // Xóa tên file sau khi upload thành công
//   //         isLoading: false, // Kết thúc hiệu ứng loading
//   //         runtime: response.data.runtime,
//   //         totalRowsChanged: response.data.totalRowsChanged,
//   //         addedEmails: response.data.addedEmails,
//   //         addedSubjectCodes: response.data.addedSubjectCodes,
//   //         addedSubjectTermCodes: response.data.addedSubjectTermCodes,
//   //         addedClassCodes: response.data.addedClassCodes,
//   //       });
//   //       this.fileInputRef.current.value = ''; // Đặt lại giá trị của input file
//   //       this.showToast('Upload file thành công');
//   //     })
//   //     .catch(error => {
//   //       console.error('Đã xảy ra lỗi khi tải tệp lên!', error);
//   //       this.setState({ 
//   //         isLoading: false // Kết thúc hiệu ứng loading
//   //       });
//   //       this.showErrorToast('Upload file thất bại');
//   //     });
//   // };
//   handleFileUpload = () => {
//     this.setState({ isLoading: true }); // Bắt đầu hiệu ứng loading
//     const formData = new FormData();
//     formData.append('file', this.state.file);
  
//     axios.post('/api/admin/upload/teachers', formData)
//       .then(response => {
//         console.log(response.data);
//         this.setState({ 
//           file: null, // Xóa tên file sau khi upload thành công
//           isLoading: false, // Kết thúc hiệu ứng loading
//           runtime: response.data.runtime,
//           totalRowsChanged: response.data.totalRowsChanged,
//           totalRowsAdded: response.data.totalRowsAdded,
//           addedEmails: response.data.addedEmails,
//           duplicateTeachers:response.data.duplicateTeachers
//         });
//         this.fileInputRef.current.value = ''; // Đặt lại giá trị của input file
//         this.showToast('Upload file thành công');
//       })
//       .catch(error => {
//         console.error('Đã xảy ra lỗi khi tải tệp lên!', error);
//         this.setState({ 
//           isLoading: false // Kết thúc hiệu ứng loading
//         });
//         this.showErrorToast('Upload file thất bại');
//       });
//   };

//   // handleFileUpload = () => {
//   //   this.setState({ isLoading: true }); // Bắt đầu hiệu ứng loading
//   //   const formData = new FormData();
//   //   formData.append('file', this.state.file);
  
//   //   axios.post('/api/admin/upload', formData)
//   //     .then(response => {
//   //       console.log(response.data);
//   //       this.setState({ 
//   //         file: null, // Xóa tên file sau khi upload thành công
//   //         isLoading: false, // Kết thúc hiệu ứng loading
//   //         runtime: response.data.runtime,
//   //         totalRowsChanged: response.data.totalRowsChanged,
//   //         addedEmails: response.data.addedEmails,
//   //         addedSubjectCodes: response.data.addedSubjectCodes,
//   //         addedSubjectTermCodes: response.data.addedSubjectTermCodes,
//   //         addedClassCodes: response.data.addedClassCodes,
//   //       });
//   //       this.fileInputRef.current.value = ''; // Đặt lại giá trị của input file
//   //       this.showToast('Upload file thành công');
//   //     })
//   //     .catch(error => {
//   //       console.error('Đã xảy ra lỗi khi tải tệp lên!', error);
//   //       this.setState({ 
//   //         isLoading: false // Kết thúc hiệu ứng loading
//   //       });
//   //       this.showErrorToast('Upload file thất bại');
//   //     });
//   // };
//   showToast = (message) => {
//     toast.success(message, {
//       position: "top-right"
//     });
//   };

//   showErrorToast = (message) => {
//     toast.error(message, {
//       position: "top-right"
//     });
//   };

//   formatRuntime = (milliseconds) => {
//     const totalSeconds = Math.floor(milliseconds / 1000);
//     const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
//     const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
//     const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  
//     return `${hours}:${minutes}:${seconds}`;
//   };

//   render() {
//     return (
//       <div>
//         <section className="content-header">
//           <div className="container-fluid">
//             <div className="row mb-2">
//               <div className="col-sm-6">
//                 <h1>Thời khóa biểu</h1>
//               </div>
//               <div className="col-sm-6">
//                 <ol className="breadcrumb float-sm-right">
//                   <li className="breadcrumb-item">
//                     <b><Link to='/admin/home' style={{ color: '#6B63FF' }}>Trang chủ</Link></b>
//                   </li>
//                   <li className="breadcrumb-item active">Thời khóa biểu</li>
//                 </ol>
//               </div>
//             </div>
//           </div>
//         </section>
//         <section className="content">
//           <div className="card">
//             <div className="card-body table-responsive p-0">
//               <table className="table table-hover text-nowrap">
//                 <thead style={{ backgroundColor: '#FFCCCC' }}>
//                   <tr>
//                     <th>File Import</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr>
//                     <td>
//                       <input 
//                         type="file" 
//                         onChange={this.handleFileChange} 
//                         disabled={this.state.isLoading} // Vô hiệu hóa input khi đang upload
//                         ref={this.fileInputRef}
//                       />
//                       <button 
//                         onClick={this.handleFileChange} 
//                         disabled={this.state.isLoading} // Vô hiệu hóa nút khi đang upload
//                       >
//                         {this.state.isLoading ? 'Uploading...' : 'Upload'} // Hiển thị hiệu ứng loading
//                       </button>
//                       <a href="/ExampleFile/GV_Template.xlsx" download>
//                         <button>Download Sample File</button>
//                       </a>
//                     </td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </section>
//         <ToastContainer />
        
//         {this.state.isLoading && (
//           <div style={styles.loadingOverlay}>
//             <div aria-label="Orange and tan hamster running in a metal wheel" role="img" className="wheel-and-hamster">
//               <div className="wheel"></div>
//               <div className="hamster">
//                 <div className="hamster__body">
//                   <div className="hamster__head">
//                     <div className="hamster__ear"></div>
//                     <div className="hamster__eye"></div>
//                     <div className="hamster__nose"></div>
//                   </div>
//                   <div className="hamster__limb hamster__limb--fr"></div>
//                   <div className="hamster__limb hamster__limb--fl"></div>
//                   <div className="hamster__limb hamster__limb--br"></div>
//                   <div className="hamster__limb hamster__limb--bl"></div>
//                   <div className="hamster__tail"></div>
//                 </div>
//               </div>
//               <div className="spoke"></div>
//             </div>
//           </div>
//         )}

// {this.state.runtime && (
//           <div className="modal-body">
//             <h3>Kết quả upload</h3>
//             <p>Thời gian chạy: {this.formatRuntime(this.state.runtime)}</p>
//             <h4>Email của GV mới được thêm vào:</h4>
//             <ul>
//               {this.state.addedEmails.map((email, index) => (
//                 <li key={index}>{email}</li>
//               ))}
//             </ul>
//             <h4>Email của GV bị trùng:</h4>
// <ul>
//   {this.state.duplicateTeachers.map((teacher, index) => (
//     <li key={index}>{teacher.fullName} - {teacher.email}</li>
//   ))}
// </ul>
//           </div>
//         )}

//         <style jsx>{`
//           /* From Uiverse.io by KSAplay */ 
//           /* From Uiverse.io by Nawsome */ 
//           .wheel-and-hamster {
//             --dur: 1s;
//             position: relative;
//             width: 12em;
//             height: 12em;
//             font-size: 14px;
//           }

//           .wheel,
//           .hamster,
//           .hamster div,
//           .spoke {
//             position: absolute;
//           }

//           .wheel,
//           .spoke {
//             border-radius: 50%;
//             top: 0;
//             left: 0;
//             width: 100%;
//             height: 100%;
//           }

//           .wheel {
//             background: radial-gradient(100% 100% at center,hsla(0,0%,60%,0) 47.8%,hsl(0,0%,60%) 48%);
//             z-index: 2;
//           }

//           .hamster {
//             animation: hamster var(--dur) ease-in-out infinite;
//             top: 50%;
//             left: calc(50% - 3.5em);
//             width: 7em;
//             height: 3.75em;
//             transform: rotate(4deg) translate(-0.8em,1.85em);
//             transform-origin: 50% 0;
//             z-index: 1;
//           }

//           .hamster__head {
//             animation: hamsterHead var(--dur) ease-in-out infinite;
//             background: hsl(30,90%,55%);
//             border-radius: 70% 30% 0 100% / 40% 25% 25% 60%;
//             box-shadow: 0 -0.25em 0 hsl(30,90%,80%) inset,
//               0.75em -1.55em 0 hsl(30,90%,90%) inset;
//             top: 0;
//             left: -2em;
//             width: 2.75em;
//             height: 2.5em;
//             transform-origin: 100% 50%;
//           }

//           .hamster__ear {
//             animation: hamsterEar var(--dur) ease-in-out infinite;
//             background: hsl(0,90%,85%);
//             border-radius: 50%;
//             box-shadow: -0.25em 0 hsl(30,90%,55%) inset;
//             top: -0.25em;
//             right: -0.25em;
//             width: 0.75em;
//             height: 0.75em;
//             transform-origin: 50% 75%;
//           }

//           .hamster__eye {
//             animation: hamsterEye var(--dur) linear infinite;
//             background-color: hsl(0,0%,0%);
//             border-radius: 50%;
//             top: 0.375em;
//             left: 1.25em;
//             width: 0.5em;
//             height: 0.5em;
//           }

//           .hamster__nose {
//             background: hsl(0,90%,75%);
//             border-radius: 35% 65% 85% 15% / 70% 50% 50% 30%;
//             top: 0.75em;
//             left: 0;
//             width: 0.2em;
//             height: 0.25em;
//           }

//           .hamster__body {
//             animation: hamsterBody var(--dur) ease-in-out infinite;
//             background: hsl(30,90%,90%);
//             border-radius: 50% 30% 50% 30% / 15% 60% 40% 40%;
//             box-shadow: 0.1em 0.75em 0 hsl(30,90%,55%) inset,
//               0.15em -0.5em 0 hsl(30,90%,80%) inset;
//             top: 0.25em;
//             left: 2em;
//             width: 4.5em;
//             height: 3em;
//             transform-origin: 17% 50%;
//             transform-style: preserve-3d;
//           }

//           .hamster__limb--fr,
//           .hamster__limb--fl {
//             clip-path: polygon(0 0,100% 0,70% 80%,60% 100%,0% 100%,40% 80%);
//             top: 2em;
//             left: 0.5em;
//             width: 1em;
//             height: 1.5em;
//             transform-origin: 50% 0;
//           }

//           .hamster__limb--fr {
//             animation: hamsterFRLimb var(--dur) linear infinite;
//             background: linear-gradient(hsl(30,90%,80%) 80%,hsl(0,90%,75%) 80%);
//             transform: rotate(15deg) translateZ(-1px);
//           }

//           .hamster__limb--fl {
//             animation: hamsterFLLimb var(--dur) linear infinite;
//             background: linear-gradient(hsl(30,90%,90%) 80%,hsl(0,90%,85%) 80%);
//             transform: rotate(15deg);
//           }

//           .hamster__limb--br,
//           .hamster__limb--bl {
//             border-radius: 0.75em 0.75em 0 0;
//             clip-path: polygon(0 0,100% 0,100% 30%,70% 90%,70% 100%,30% 100%,40% 90%,0% 30%);
//             top: 1em;
//             left: 2.8em;
//             width: 1.5em;
//             height: 2.5em;
//             transform-origin: 50% 30%;
//           }

//           .hamster__limb--br {
//             animation: hamsterBRLimb var(--dur) linear infinite;
//             background: linear-gradient(hsl(30,90%,80%) 90%,hsl(0,90%,75%) 90%);
//             transform: rotate(-25deg) translateZ(-1px);
//           }

//           .hamster__limb--bl {
//             animation: hamsterBLLimb var(--dur) linear infinite;
//             background: linear-gradient(hsl(30,90%,90%) 90%,hsl(0,90%,85%) 90%);
//             transform: rotate(-25deg);
//           }

//           .hamster__tail {
//             animation: hamsterTail var(--dur) linear infinite;
//             background: hsl(0,90%,85%);
//             border-radius: 0.25em 50% 50% 0.25em;
//             box-shadow: 0 -0.2em 0 hsl(0,90%,75%) inset;
//             top: 1.5em;
//             right: -0.5em;
//             width: 1em;
//             height: 0.5em;
//             transform: rotate(30deg) translateZ(-1px);
//             transform-origin: 0.25em 0.25em;
//           }

//           .spoke {
//             animation: spoke var(--dur) linear infinite;
//             background: radial-gradient(100% 100% at center,hsl(0,0%,60%) 4.8%,hsla(0,0%,60%,0) 5%),
//               linear-gradient(hsla(0,0%,55%,0) 46.9%,hsl(0,0%,65%) 47% 52.9%,hsla(0,0%,65%,0) 53%) 50% 50% / 99% 99% no-repeat;
//           }

//           /* Animations */
//           @keyframes hamster {
//             from, to {
//               transform: rotate(4deg) translate(-0.8em,1.85em);
//             }

//             50% {
//               transform: rotate(0) translate(-0.8em,1.85em);
//             }
//           }

//           @keyframes hamsterHead {
//             from, 25%, 50%, 75%, to {
//               transform: rotate(0);
//             }

//             12.5%, 37.5%, 62.5%, 87.5% {
//               transform: rotate(8deg);
//             }
//           }

//           @keyframes hamsterEye {
//             from, 90%, to {
//               transform: scaleY(1);
//             }

//             95% {
//               transform: scaleY(0);
//             }
//           }

//           @keyframes hamsterEar {
//             from, 25%, 50%, 75%, to {
//               transform: rotate(0);
//             }

//             12.5%, 37.5%, 62.5%, 87.5% {
//               transform: rotate(12deg);
//             }
//           }

//           @keyframes hamsterBody {
//             from, 25%, 50%, 75%, to {
//               transform: rotate(0);
//             }

//             12.5%, 37.5%, 62.5%, 87.5% {
//               transform: rotate(-2deg);
//             }
//           }

//           @keyframes hamsterFRLimb {
//             from, 25%, 50%, 75%, to {
//               transform: rotate(50deg) translateZ(-1px);
//             }

//             12.5%, 37.5%, 62.5%, 87.5% {
//               transform: rotate(-30deg) translateZ(-1px);
//             }
//           }

//           @keyframes hamsterFLLimb {
//             from, 25%, 50%, 75%, to {
//               transform: rotate(-30deg);
//             }

//             12.5%, 37.5%, 62.5%, 87.5% {
//               transform: rotate(50deg);
//             }
//           }

//           @keyframes hamsterBRLimb {
//             from, 25%, 50%, 75%, to {
//               transform: rotate(-60deg) translateZ(-1px);
//             }

//             12.5%, 37.5%, 62.5%, 87.5% {
//               transform: rotate(20deg) translateZ(-1px);
//             }
//           }

//           @keyframes hamsterBLLimb {
//             from, 25%, 50%, 75%, to {
//               transform: rotate(20deg);
//             }

//             12.5%, 37.5%, 62.5%, 87.5% {
//               transform: rotate(-60deg);
//             }
//           }

//           @keyframes hamsterTail {
//             from, 25%, 50%, 75%, to {
//               transform: rotate(30deg) translateZ(-1px);
//             }

//             12.5%, 37.5%, 62.5%, 87.5% {
//               transform: rotate(10deg) translateZ(-1px);
//             }
//           }

//           @keyframes spoke {
//             from {
//               transform: rotate(0);
//             }

//             to {
//               transform: rotate(-1turn);
//             }
//           }
//         `}</style>
//       </div>
//     );
//   }
// }

// const styles = {
//   loadingOverlay: {
//     position: 'fixed',
//     top: 0,
//     left: 0,
//     width: '100%',
//     height: '100%',
//     background: 'rgba(0, 0, 0, 0.5)',
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 9999,
//   },
// };

// export default Test;





// import React, { Component } from 'react';
// import axios from 'axios';
// import MyContext from '../contexts/MyContext';
// import { Link } from 'react-router-dom';
// import '../plugins/fontawesome-free/css/all.min.css';
// import '../plugins/tempusdominus-bootstrap-4/css/tempusdominus-bootstrap-4.min.css';
// import '../plugins/icheck-bootstrap/icheck-bootstrap.min.css';
// import '../plugins/jqvmap/jqvmap.min.css';
// import '../dist/css/adminlte.min.css';
// import '../plugins/overlayScrollbars/css/OverlayScrollbars.min.css';
// import '../plugins/daterangepicker/daterangepicker.css';
// import '../plugins/summernote/summernote-bs4.min.css';
// import '../dist/css/pagination.css';
// import '../dist/css/buttonIcon.css';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';


// class Test1 extends Component {
//   static contextType = MyContext;
//   state = {
//     isWebcamOpen: false,
//     webcamImage: null,
//     userName: '',
//     isUserRegistered: false,
//   };

//   videoRef = React.createRef();

//   handleOpenWebcam = () => {
//     if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
//       navigator.mediaDevices.getUserMedia({ video: true })
//         .then(stream => {
//           this.videoRef.current.srcObject = stream;
//           this.videoRef.current.play();
//           this.setState({ isWebcamOpen: true });
//           this.showToast('Webcam opened successfully');
//         })
//         .catch(error => {
//           console.error('Error accessing webcam:', error);
//           this.showErrorToast('Error accessing webcam');
//         });
//     }
//   };

//   // handleLoginUser = () => {
//   //   const { webcamImage } = this.state;
//   //   if (!webcamImage) {
//   //     this.showErrorToast('Please capture an image.');
//   //     return;
//   //   }

//   //   axios.post('/api/admin/login_user', {
//   //     image: webcamImage.split(',')[1] // Remove the data URL prefix
//   //   })
//   //     .then(response => {
//   //       this.showToast(response.data.message);
//   //     })
//   //     .catch(error => {
//   //       if (error.response) {
//   //         console.log('Error status:', error.response.status);
//   //         console.error('Error logging in user:', error.response.data);

//   //         if (error.response.status === 403) {
//   //           this.showErrorToast('Hãy trung thực!');
//   //         } else if (error.response.status === 401) {
//   //           this.showErrorToast('Bạn chưa đăng ký FaceID');
//   //         } else {
//   //           this.showErrorToast('Đăng nhập thất bại');
//   //         }
//   //       } else {
//   //         console.error('Error logging in user:', error);
//   //         this.showErrorToast('Error logging in user');
//   //       }
//   //     });
//   // };
//   handleLoginUser = () => {
//   const { userName, webcamImage } = this.state;
//   if (!userName || !webcamImage) {
//     this.showErrorToast('Please enter a username and capture an image.');
//     return;
//   }

//   axios.post('/api/admin/login_user', {
//     name: userName,
//     image: webcamImage.split(',')[1] // Remove the data URL prefix
//   })
//     .then(response => {
//       this.showToast(response.data.message);
//     })
//     .catch(error => {
//       if (error.response) {
//         console.log('Error status:', error.response.status);
//         console.error('Error logging in user:', error.response.data);

//         if (error.response.status === 403) {
//           this.showErrorToast('Hãy trung thực!');
//         } else if (error.response.status === 401) {
//           this.showErrorToast('Thất bại vui lòng thử lại!');
//         } else {
//           this.showErrorToast('Đăng nhập thất bại');
//         }
//       } else {
//         console.error('Error logging in user:', error);
//         this.showErrorToast('Error logging in user');
//       }
//     });
// };

//   // handleCaptureImage = () => {
//   //   const canvas = document.createElement('canvas');
//   //   canvas.width = this.videoRef.current.videoWidth;
//   //   canvas.height = this.videoRef.current.videoHeight;
//   //   const context = canvas.getContext('2d');
//   //   context.drawImage(this.videoRef.current, 0, 0, canvas.width, canvas.height);
//   //   const image = canvas.toDataURL('image/jpeg');
//   //   this.setState({ webcamImage: image });
//   //   this.showToast('Image captured successfully');
//   // };
  
//   handleCaptureImage = () => {
//     const canvas = document.createElement('canvas');
//     canvas.width = this.videoRef.current.videoWidth;
//     canvas.height = this.videoRef.current.videoHeight;
//     const context = canvas.getContext('2d');
  
//     // Đảm bảo định dạng hình ảnh đúng
//     context.drawImage(this.videoRef.current, 0, 0, canvas.width, canvas.height);
//     const image = canvas.toDataURL('image/jpeg');
  
//     this.setState({ webcamImage: image });
//     this.showToast('Chụp ảnh thành công');
//   };

//   handleCloseWebcam = () => {
//     const stream = this.videoRef.current.srcObject;
//     const tracks = stream.getTracks();
//     tracks.forEach(track => track.stop());
//     this.videoRef.current.srcObject = null;
//     this.setState({ isWebcamOpen: false, webcamImage: null });
//     this.showToast('Webcam closed successfully');
//   };

//   handleRegisterUser = () => {
//     const { userName, webcamImage } = this.state;
//     if (!userName || !webcamImage) {
//       this.showErrorToast('Please enter a username and capture an image.');
//       return;
//     }

//     axios.post('/api/admin/register_user', {
//       name: userName,
//       image: webcamImage.split(',')[1] // Remove the data URL prefix
//     })
//       .then(response => {
//         this.showToast(response.data.message);
//         this.setState({ isUserRegistered: true });
//       })
//       .catch(error => {
//         console.error('Error registering user:', error);
//         this.showErrorToast('Error registering user');
//       });
//   };

//   handleInputChange = (event) => {
//     const userName = event.target.value;
//     this.setState({ userName });

//     if (userName) {
//       axios.post('/api/admin/check_user', { name: userName })
//         .then(response => {
//           if (response.data.status === 'success') {
//             this.setState({ isUserRegistered: true });
//           } else {
//             this.setState({ isUserRegistered: false });
//           }
//         })
//         .catch(error => {
//           console.error('Error checking user registration:', error);
//           this.setState({ isUserRegistered: false });
//         });
//     } else {
//       this.setState({ isUserRegistered: false });
//     }
//   };

//   showToast = (message) => {
//     toast.success(message, {
//       position: "top-right"
//     });
//   };

//   showErrorToast = (message) => {
//     toast.error(message, {
//       position: "top-right"
//     });
//   };

//   render() {
//     return (
//       <div>
//         <section className="content-header">
//           <div className="container-fluid">
//             <div className="row mb-2">
//               <div className="col-sm-6">
//                 <h1>Thời khóa biểu</h1>
//               </div>
//               <div className="col-sm-6">
//                 <ol className="breadcrumb float-sm-right">
//                   <li className="breadcrumb-item">
//                     <b><Link to='/admin/home' style={{ color: '#6B63FF' }}>Trang chủ</Link></b>
//                   </li>
//                   <li className="breadcrumb-item active">Thời khóa biểu</li>
//                 </ol>
//               </div>
//             </div>
//           </div>
//         </section>
//         <section className="content">
//           <div className="card">
//             <div className="card-body table-responsive p-0">
//               <table className="table table-hover text-nowrap">
//                 <thead style={{ backgroundColor: '#FFCCCC' }}>
//                   <tr>
//                     <th>File Import</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr>
//                     <td>
//                       <input 
//                         type="text" 
//                         placeholder="Enter username" 
//                         value={this.state.userName} 
//                         onChange={this.handleInputChange} 
//                       />
//                       <button onClick={this.handleOpenWebcam} disabled={this.state.isWebcamOpen}>Open Webcam</button>
//                       <button onClick={this.handleCaptureImage} disabled={!this.state.isWebcamOpen}>Capture Image</button>
//                       <button onClick={this.handleCloseWebcam} disabled={!this.state.isWebcamOpen}>Close Webcam</button>
//                       <button onClick={this.handleRegisterUser} disabled={this.state.isUserRegistered}>
//                         {this.state.isUserRegistered ? 'You are already registered' : 'Register User'}
//                       </button>
//                       <button onClick={this.handleLoginUser}>Login User</button>
//                     </td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </section>
//         <div style={{ textAlign: 'center', marginTop: '20px' }}>
//           <video ref={this.videoRef} style={{ width: '100%', maxWidth: '600px' }}></video>
//         </div>
//         {this.state.webcamImage && (
//           <div style={{ textAlign: 'center', marginTop: '20px' }}>
//             <img src={this.state.webcamImage} alt="Webcam Capture" style={{ width: '100%', maxWidth: '600px' }} />
//           </div>
//         )}
//         <ToastContainer />
//       </div>
//     );
//   }
// }

// export default Test1;



// import React, { Component } from 'react';
// import axios from 'axios';
// import MyContext from '../contexts/MyContext';
// import { Link } from 'react-router-dom';
// import '../plugins/fontawesome-free/css/all.min.css';
// import '../plugins/tempusdominus-bootstrap-4/css/tempusdominus-bootstrap-4.min.css';
// import '../plugins/icheck-bootstrap/icheck-bootstrap.min.css';
// import '../plugins/jqvmap/jqvmap.min.css';
// import '../dist/css/adminlte.min.css';
// import '../plugins/overlayScrollbars/css/OverlayScrollbars.min.css';
// import '../plugins/daterangepicker/daterangepicker.css';
// import '../plugins/summernote/summernote-bs4.min.css';
// import '../dist/css/pagination.css';
// import '../dist/css/buttonIcon.css';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import Webcam from 'react-webcam';

// class Test extends Component {
//   static contextType = MyContext;
//   state = {
//     isWebcamOpen: false,
//     webcamImage: null,
//     userName: '',
//     isUserRegistered: false,
//   };

//   webcamRef = React.createRef();

//   handleOpenWebcam = () => {
//     this.setState({ isWebcamOpen: true });
//     this.showToast('Webcam opened successfully');
//   };

//   handleCaptureImage = () => {
//     const imageSrc = this.webcamRef.current.getScreenshot();
//     this.setState({ webcamImage: imageSrc });
//     this.downloadImage(imageSrc);
//     this.showToast('Chụp ảnh thành công');
//   };


//   downloadImage = (imageSrc) => {
//     const link = document.createElement('a');
//     link.href = imageSrc;
//     link.download = 'captured_image.jpg';
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   handleCloseWebcam = () => {
//     this.setState({ isWebcamOpen: false, webcamImage: null });
//     this.showToast('Webcam closed successfully');
//   };

//   showToast = (message) => {
//     toast(message);
//   };

//   showErrorToast = (message) => {
//     toast.error(message);
//   };

//   render() {
//     return (
//       <div>
//         <button onClick={this.handleOpenWebcam}>Open Webcam</button>
//         <button onClick={this.handleCaptureImage}>Capture Image</button>
//         <button onClick={this.handleCloseWebcam}>Close Webcam</button>
//         {this.state.isWebcamOpen && (
//           <Webcam
//             audio={false}
//             ref={this.webcamRef}
//             screenshotFormat="image/jpeg"
//             videoConstraints={{
//               width: 1280,
//               height: 720,
//               facingMode: "user"
//             }}
//           />
//         )}
//         <ToastContainer />
//         {this.state.webcamImage && (
//           <div>
//             <h3>Ảnh đã chụp</h3>
//             <img
//               src={this.state.webcamImage}
//               alt="Captured"
//               style={{ width: '100%', height: 'auto' }}
//             />
//           </div>
//         )}
//       </div>
//     );
//   }
// }

// export default Test;


import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Test1 = () => {
    const { classCode, day } = useParams(); // Lấy classCode và day từ URL

    useEffect(() => {
        // Clear the token from localStorage when the component unmounts
        return () => {
            localStorage.removeItem('token');
        };
    }, []);

    return (
        <div>
            <h1>Welcome to Test1</h1>
            <p>Class Code: {classCode}</p> {/* Hiển thị classCode */}
            <p>Day: {day}</p> {/* Hiển thị ngày */}
            {/* Your component content */}
        </div>
    );
};

export default Test1;