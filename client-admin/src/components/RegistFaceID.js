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

// class RegistFaceID extends Component {
//   static contextType = MyContext;
//   state={
//   isWebcamOpen: false,
//     webcamImage: null,
//     userName: '',
//     isUserRegistered: false, // Add this line
//   };
//   componentDidMount() {
//     this.checkUserRegistration();
//   }

//   videoRef = React.createRef();

//   handleOpenWebcam = () => {
//     if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
//       navigator.mediaDevices.getUserMedia({ video: true })
//         .then(stream => {
//           this.videoRef.current.srcObject = stream;
//           this.videoRef.current.play();
//           this.setState({ isWebcamOpen: true });
//           this.showToast('Bật camera thành công!');
//         })
//         .catch(error => {
//           console.error('Error accessing webcam:', error);
//           this.showErrorToast('Không truy cập được camera!');
//         });
//     }
//   };

//   handleCaptureImage = () => {
//     const canvas = document.createElement('canvas');
//     canvas.width = this.videoRef.current.videoWidth;
//     canvas.height = this.videoRef.current.videoHeight;
//     const context = canvas.getContext('2d');
//     context.drawImage(this.videoRef.current, 0, 0, canvas.width, canvas.height);
//     const image = canvas.toDataURL('image/jpeg');
//     this.setState({ webcamImage: image });
//     this.showToast('Image captured successfully');
//   };

//   handleCloseWebcam = () => {
//     const stream = this.videoRef.current.srcObject;
//     const tracks = stream.getTracks();
//     tracks.forEach(track => track.stop());
//     this.videoRef.current.srcObject = null;
//     this.setState({ isWebcamOpen: false, webcamImage: null });
//     this.showToast('Tắt camera thành công!');
//   };

// handleRegisterUser = () => {
//     const canvas = document.createElement('canvas');
//     canvas.width = this.videoRef.current.videoWidth;
//     canvas.height = this.videoRef.current.videoHeight;
//     const context = canvas.getContext('2d');
//     context.drawImage(this.videoRef.current, 0, 0, canvas.width, canvas.height);
//     const image = canvas.toDataURL('image/jpeg');
//     this.setState({ webcamImage: image });

//     axios.post('/api/admin/register_user', {
//       name: this.props.userCode,
//       image: image.split(',')[1] // Remove the data URL prefix
//     })
//       .then(response => {
//         this.showToast('Đăng ký thành công!');
//         this.checkUserRegistration();
//       })
//       .catch(error => {
//         console.error('Error registering user:', error);
//         this.showErrorToast('Đăng ký thất bại');
//       });
//   };
//   checkUserRegistration = () => {
//     axios.post('/api/admin/check_user', { name: this.props.userCode })
//       .then(response => {
//         if (response.data.status === 'success') {
//           this.setState({ isUserRegistered: true });
//         } else {
//           this.setState({ isUserRegistered: false });
//         }
//       })
//       .catch(error => {
//         console.error('Error checking user registration:', error);
//         this.setState({ isUserRegistered: false });
//       });
//   };
//   handleInputChange = (event) => {
//     this.setState({ userName: event.target.value });
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
//     <div>
//         <section className="content-header">
//           <div className="container-fluid">
//             <div className="row mb-2">
//               <div className="col-sm-6">
//                 <h1>Đăng ký FaceID</h1>
//               </div>
//               <div className="col-sm-6">
//                 <ol className="breadcrumb float-sm-right">
//                   <li className="breadcrumb-item">
//                     <b><Link to='/admin/home' style={{ color: '#6B63FF' }}>Trang chủ</Link></b>
//                   </li>
//                   <li className="breadcrumb-item active">Đăng ký FaceID</li>
//                 </ol>
//               </div>
//             </div>
//           </div>
//         </section>
//         <section className="content">
//           <div class="row">
//         <div class="col-md-12">
//           <div class="card">
//             <div class="card-body">
//               <div class="row">
//                 <div class="col-md-8">
//                   <div class="chart">
//                   <div style={{ backgroundColor: 'black', width: '100%', maxWidth: '600px', height: '450px', marginTop: '10px' }}>
//                     <video ref={this.videoRef} style={{ width: '100%', maxWidth: '600px', height: '100%' }}></video>
//                   </div> 
//                 </div>
//                 </div>
//                 <div className="col-md-4">
//             <div className="progress-group" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
//                 <div style={{ display: 'flex', gap: '10px' }}>
//                   {/* Nút Bật Camera */}
//                   <button 
//                     onClick={this.handleOpenWebcam} 
//                     disabled={this.state.isWebcamOpen}
//                     style={{
//                       fontSize: '16px',
//                       fontWeight: 'bold',
//                       padding: '10px 20px',
//                       border: `2px solid ${this.state.isWebcamOpen ? '#aaa' : '#4CAF50'}`,
//                       borderRadius: '8px',
//                       cursor: 'pointer',
//                       transition: 'all 0.3s ease',
//                       background: this.state.isWebcamOpen ? '#ddd' : 'linear-gradient(45deg, #4CAF50, #8BC34A)',
//                       color: this.state.isWebcamOpen ? '#999' : 'white',
//                       boxShadow: this.state.isWebcamOpen ? 'none' : '0 4px 8px rgba(0, 0, 0, 0.2)',
//                       transform: this.state.isWebcamOpen ? 'none' : 'scale(1)'
//                     }}
//                   >
//                     Bật camera
//                   </button>

//                   {/* Nút Tắt Camera */}
//                   <button 
//                     onClick={this.handleCloseWebcam} 
//                     disabled={!this.state.isWebcamOpen}
//                     style={{
//                       fontSize: '16px',
//                       fontWeight: 'bold',
//                       padding: '10px 20px',
//                       border: `2px solid ${!this.state.isWebcamOpen ? '#aaa' : '#F44336'}`,
//                       borderRadius: '8px',
//                       cursor: 'pointer',
//                       transition: 'all 0.3s ease',
//                       background: !this.state.isWebcamOpen ? '#ddd' : 'linear-gradient(45deg, #F44336, #E57373)',
//                       color: !this.state.isWebcamOpen ? '#999' : 'white',
//                       boxShadow: !this.state.isWebcamOpen ? 'none' : '0 4px 8px rgba(0, 0, 0, 0.2)',
//                       transform: !this.state.isWebcamOpen ? 'none' : 'scale(1)'
//                     }}
//                   >
//                     Tắt camera
//                   </button>

//                   {/* Nút Đăng ký */}
//                   {!this.state.isUserRegistered && (
//                     <button 
//                       onClick={this.handleRegisterUser}
//                       style={{
//                         fontSize: '16px',
//                         fontWeight: 'bold',
//                         padding: '10px 20px',
//                         border: '2px solid #2196F3',
//                         borderRadius: '8px',
//                         cursor: 'pointer',
//                         transition: 'all 0.3s ease',
//                         background: 'linear-gradient(45deg, #2196F3, #64B5F6)',
//                         color: 'white',
//                         boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
//                         transform: 'scale(1)'
//                       }}
//                     >
//                       Đăng ký
//                     </button>
//                   )}
//                 </div>

//     {/* Thông báo đã đăng ký */}
//     {this.state.isUserRegistered && (
//       <span>Bạn đã đăng ký FaceID rồi!</span>
//     )}
//   </div>  
//   <div className="progress-group" >
//   <h4>Hướng dẫn đăng ký khuôn mặt</h4>

// <h5>Chuẩn bị:</h5>
// <ul>
//     <li>Ngồi ở nơi có ánh sáng tốt.</li>
//     <li>Đảm bảo đủ ánh sáng để khuôn mặt rõ ràng.</li>
// </ul>

// <h5>Vị trí khuôn mặt:</h5>
// <ul>
//     <li>Nhìn thẳng vào camera.</li>
//     <li>Khuôn mặt nằm chính giữa khung hình.</li>
//     <li>Nhìn trực diện, không quay đầu hoặc nghiêng mặt.</li>
//     <li>Đặt khuôn mặt cách camera 30-50 cm.</li>
// </ul>
// <h5>Tránh che khuất khuôn mặt</h5>
// <ul>
//     <li>Tháo khẩu trang, kính râm, hoặc vật dụng che mặt.</li>
//     <li>Nếu đeo kính, đảm bảo không có ánh sáng phản chiếu.</li>
//     <li>Giữ khuôn mặt tự nhiên.</li>
// </ul>

// <h5>Tránh chuyển động</h5>
// <ul>
//     <li>Giữ đầu ổn định trong suốt quá trình.</li>
//     <li>Tránh nháy mắt hoặc biểu cảm khuôn mặt.</li>
// </ul>

// <h5>Môi trường xung quanh</h5>
// <ul>
//     <li>Nền phía sau nên đơn giản.</li>
//     <li>Tránh yếu tố gây xao nhãng, như người khác di chuyển trong khung hình.</li>
// </ul>

// <h5>Camera</h5>
// <ul>
//     <li>Đảm bảo camera hoạt động tốt và ống kính không bị bẩn.</li>
// </ul>

    
//   </div>  
// </div>


//               </div>
//             </div>
//           </div>
//         </div>
//       </div>


//       <div class="content">
//       <div class="container-fluid">
//         <div class="row">
//           <div class="col-lg-6">
//             <div class="card">
             
//               <div class="card-body">
//               <div style={{ backgroundColor: 'black', width: '100%', maxWidth: '600px', height: '450px', marginTop: '10px' }}>
//                     <video ref={this.videoRef} style={{ width: '100%', maxWidth: '600px', height: '100%' }}></video>
//                   </div> 
//               </div>
//             </div>
//           </div>
//           <div class="col-lg-6">
//             <div class="card">
              
//               <div class="card-body">
//               <div className="progress-group" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
//                 <div style={{ display: 'flex', gap: '10px' }}>
//                   {/* Nút Bật Camera */}
//                   <button 
//                     onClick={this.handleOpenWebcam} 
//                     disabled={this.state.isWebcamOpen}
//                     style={{
//                       fontSize: '16px',
//                       fontWeight: 'bold',
//                       padding: '10px 20px',
//                       border: `2px solid ${this.state.isWebcamOpen ? '#aaa' : '#4CAF50'}`,
//                       borderRadius: '8px',
//                       cursor: 'pointer',
//                       transition: 'all 0.3s ease',
//                       background: this.state.isWebcamOpen ? '#ddd' : 'linear-gradient(45deg, #4CAF50, #8BC34A)',
//                       color: this.state.isWebcamOpen ? '#999' : 'white',
//                       boxShadow: this.state.isWebcamOpen ? 'none' : '0 4px 8px rgba(0, 0, 0, 0.2)',
//                       transform: this.state.isWebcamOpen ? 'none' : 'scale(1)'
//                     }}
//                   >
//                     Bật camera
//                   </button>

//                   {/* Nút Tắt Camera */}
//                   <button 
//                     onClick={this.handleCloseWebcam} 
//                     disabled={!this.state.isWebcamOpen}
//                     style={{
//                       fontSize: '16px',
//                       fontWeight: 'bold',
//                       padding: '10px 20px',
//                       border: `2px solid ${!this.state.isWebcamOpen ? '#aaa' : '#F44336'}`,
//                       borderRadius: '8px',
//                       cursor: 'pointer',
//                       transition: 'all 0.3s ease',
//                       background: !this.state.isWebcamOpen ? '#ddd' : 'linear-gradient(45deg, #F44336, #E57373)',
//                       color: !this.state.isWebcamOpen ? '#999' : 'white',
//                       boxShadow: !this.state.isWebcamOpen ? 'none' : '0 4px 8px rgba(0, 0, 0, 0.2)',
//                       transform: !this.state.isWebcamOpen ? 'none' : 'scale(1)'
//                     }}
//                   >
//                     Tắt camera
//                   </button>

//                   {/* Nút Đăng ký */}
//                   {!this.state.isUserRegistered && (
//                     <button 
//                       onClick={this.handleRegisterUser}
//                       style={{
//                         fontSize: '16px',
//                         fontWeight: 'bold',
//                         padding: '10px 20px',
//                         border: '2px solid #2196F3',
//                         borderRadius: '8px',
//                         cursor: 'pointer',
//                         transition: 'all 0.3s ease',
//                         background: 'linear-gradient(45deg, #2196F3, #64B5F6)',
//                         color: 'white',
//                         boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
//                         transform: 'scale(1)'
//                       }}
//                     >
//                       Đăng ký
//                     </button>
//                   )}
//                 </div>

//     {/* Thông báo đã đăng ký */}
//     {this.state.isUserRegistered && (
//       <span>Bạn đã đăng ký FaceID rồi!</span>
//     )}
//   </div>  
//   <div className="progress-group" >
//   <h4>Hướng dẫn đăng ký khuôn mặt</h4>

// <h5>Chuẩn bị:</h5>
// <ul>
//     <li>Ngồi ở nơi có ánh sáng tốt.</li>
//     <li>Đảm bảo đủ ánh sáng để khuôn mặt rõ ràng.</li>
// </ul>

// <h5>Vị trí khuôn mặt:</h5>
// <ul>
//     <li>Nhìn thẳng vào camera và khuôn mặt nằm chính giữa khung hình.</li>
//     <li>Nhìn trực diện, không quay đầu hoặc nghiêng mặt và đặt khuôn mặt cách camera 30-50 cm.</li>
// </ul>
// <h5>Tránh che khuất khuôn mặt</h5>
// <ul>
//     <li>Tháo khẩu trang, kính râm, hoặc vật dụng che mặt và giữ khuôn mặt tự nhiên.</li>
//     <li>Nếu đeo kính, đảm bảo không có ánh sáng phản chiếu.</li>
// </ul>

// <h5>Tránh chuyển động</h5>
// <ul>
//     <li>Giữ đầu ổn định trong suốt quá trình.</li>
//     <li>Tránh nháy mắt hoặc biểu cảm khuôn mặt.</li>
// </ul>

// <h5>Môi trường xung quanh</h5>
// <ul>
//     <li>Nền phía sau nên đơn giản.</li>
//     <li>Tránh yếu tố gây xao nhãng, như người khác di chuyển trong khung hình.</li>
// </ul>

// <h5>Camera</h5>
// <ul>
//     <li>Đảm bảo camera hoạt động tốt và ống kính không bị bẩn.</li>
// </ul>

    
//   </div>  
  

                
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//         </section>
//         <ToastContainer />
//       </div>
//     );
//   }
// }

// export default RegistFaceID;



import React, { Component } from 'react';
import axios from 'axios';
import MyContext from '../contexts/MyContext';
import { ToastContainer, toast } from 'react-toastify';
import { Link } from 'react-router-dom';

import 'react-toastify/dist/ReactToastify.css';

class RegistFaceID extends Component {
  static contextType = MyContext;

  state = {
    isWebcamOpen: false,
    webcamImage: null,
    isUserRegistered: false,
    showModalHistory: false,
    isProcessing: false,
    isProcessing1: false,
    userImages: []
  };

  videoRef = React.createRef();

  componentDidMount() {
    this.checkUserRegistration();
  }

  handleOpenWebcam = () => {
    if (navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          if (this.videoRef.current) {
            this.videoRef.current.srcObject = stream;
            this.videoRef.current.play();
            this.setState({ isWebcamOpen: true });
            this.showToast('Bật camera thành công!');
          }
        })
        .catch(error => {
          console.error('Error accessing webcam:', error);
          this.showErrorToast('Không truy cập được camera!');
        });
    }
  };

  handleCloseWebcam = () => {
    if (this.videoRef.current?.srcObject) {
      this.videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      this.videoRef.current.srcObject = null;
    }
    this.setState({ isWebcamOpen: false, webcamImage: null });
    this.showToast('Tắt camera thành công!');
  };

  // handleRegisterUser = () => {
  //   if (!this.videoRef.current) return;

  //   const canvas = document.createElement('canvas');
  //   canvas.width = this.videoRef.current.videoWidth;
  //   canvas.height = this.videoRef.current.videoHeight;
  //   const context = canvas.getContext('2d');
  //   context.drawImage(this.videoRef.current, 0, 0, canvas.width, canvas.height);
  //   const image = canvas.toDataURL('image/jpeg');

  //   this.setState({ webcamImage: image });

  //   axios.post('/api/admin/register_user', {
  //     name: this.props.userCode,
  //     image: image.split(',')[1]
  //   })
  //     .then(() => {
  //       this.showToast('Đăng ký thành công!');
  //       this.checkUserRegistration();
  //     })
  //     .catch(error => {
  //       console.error('Error registering user:', error);
  //       this.showErrorToast('Đăng ký thất bại');
  //     });
  // };
  handleRegisterUser = () => {
    if (this.state.isProcessing) return; // Ngăn chặn việc nhấp nhiều lần
    this.setState({ isProcessing: true });

    if (!this.videoRef.current) {
      this.setState({ isProcessing: false });
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = this.videoRef.current.videoWidth;
    canvas.height = this.videoRef.current.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(this.videoRef.current, 0, 0, canvas.width, canvas.height);
    const image = canvas.toDataURL('image/jpeg');

    this.setState({ webcamImage: image });

    axios.post('/api/admin/register_user', {
      name: this.props.userCode,
      image: image.split(',')[1]
    })
      .then(() => {
        this.showToast('Đăng ký thành công!');
        this.checkUserRegistration();
      })
      .catch(error => {
        console.error('Error registering user:', error);
        this.showErrorToast('Đăng ký thất bại');
      })
      .finally(() => {
        this.setState({ isProcessing: false });
      });
  };
  // handleReRegisterUser = () => {
  //   if (!this.videoRef.current) return;

  //   const canvas = document.createElement('canvas');
  //   canvas.width = this.videoRef.current.videoWidth;
  //   canvas.height = this.videoRef.current.videoHeight;
  //   const context = canvas.getContext('2d');
  //   context.drawImage(this.videoRef.current, 0, 0, canvas.width, canvas.height);
  //   const image = canvas.toDataURL('image/jpeg');

  //   this.setState({ webcamImage: image });

  //   axios.post('/api/admin/re_register_user', {
  //     name: this.props.userCode,
  //     image: image.split(',')[1]
  //   })
  //     .then(() => {
  //       this.showToast('Đăng ký lại thành công!');
  //       this.checkUserRegistration();
  //     })
  //     .catch(error => {
  //       console.error('Error re-registering user:', error);
  //       this.showErrorToast('Đăng ký lại thất bại');
  //     });
  // };
  handleReRegisterUser = () => {
    if (this.state.isProcessing1) return; // Ngăn chặn việc nhấp nhiều lần
    this.setState({ isProcessing1: true });

    if (!this.videoRef.current) {
      this.setState({ isProcessing1: false });
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = this.videoRef.current.videoWidth;
    canvas.height = this.videoRef.current.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(this.videoRef.current, 0, 0, canvas.width, canvas.height);
    const image = canvas.toDataURL('image/jpeg');

    this.setState({ webcamImage: image });

    axios.post('/api/admin/re_register_user', {
      name: this.props.userCode,
      image: image.split(',')[1]
    })
      .then(() => {
        this.showToast('Đăng ký lại thành công!');
        this.checkUserRegistration();
      })
      .catch(error => {
        console.error('Error re-registering user:', error);
        this.showErrorToast('Đăng ký lại thất bại');
      })
      .finally(() => {
        this.setState({ isProcessing1: false });
      });
  };

  checkUserRegistration = () => {
    axios.post('/api/admin/check_user', { name: this.props.userCode })
      .then(response => {
        this.setState({ isUserRegistered: response.data.status === 'success' });
      })
      .catch(error => {
        console.error('Error checking user registration:', error);
        this.setState({ isUserRegistered: false });
      });
  };
  toggleModalHistory = () => {
    this.setState(prevState => ({ showModalHistory: !prevState.showModalHistory }), () => {
      if (this.state.showModalHistory) {
        this.fetchUserImages();
      }
    });
  };

  fetchUserImages = () => {
    axios.get(`/api/admin/user_images/${this.props.userID}`)
      .then(response => {
        this.setState({ userImages: response.data.images });
      })
      .catch(error => {
        console.error('Error fetching user images:', error);
      });
  };

  showToast = (message) => {
    toast.success(message, { position: "top-right" });
  };

  showErrorToast = (message) => {
    toast.error(message, { position: "top-right" });
  };

  render() {
    const { showModalHistory, userImages } = this.state;

    return (
      <div>
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1>Đăng ký FaceID</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <b><Link to='/admin/home' style={{ color: '#6B63FF' }}>Trang chủ</Link></b>
                  </li>
                  <li className="breadcrumb-item active">Đăng ký FaceID</li>
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
            {/* <div style={{ backgroundColor: 'black', width: '100%', maxWidth: '600px', height: '450px', marginTop: '10px' }}> */}
              <div style={{ backgroundColor: 'black', width: '100%', maxWidth: '600px', marginTop: '20px' }}>

                <video ref={this.videoRef} style={{ width: '100%', maxWidth: '600px', height: '100%' }}></video>
              </div>
              {/* Các nút nằm dưới khung hình, căn giữa */}
              <div 
            style={{ 
              marginTop: '10px', 
              display: 'flex', 
              flexWrap: 'wrap', 
              justifyContent: 'center', 
              alignItems: 'center', 
              gap: '10px',
              width: '100%', 
              maxWidth: '600px', 
              marginLeft: 'auto',
              marginRight: 'auto'
            }}
          >
            <button 
              onClick={this.handleOpenWebcam} 
              disabled={this.state.isWebcamOpen}
              style={{ 
                fontSize: '16px', 
                fontWeight: 'bold', 
                padding: '10px 20px', 
                borderRadius: '8px', 
                cursor: 'pointer', 
                transition: 'all 0.3s ease', 
                color: this.state.isWebcamOpen ? '#999' : 'white', 
                border: 'none', 
                textAlign: 'center',
                background: this.state.isWebcamOpen ? '#ddd' : 'linear-gradient(45deg, #4CAF50, #8BC34A)',
                flex: '1', 
                minWidth: '120px'
              }}
            >
              Bật camera
            </button>

            <button 
              onClick={this.handleCloseWebcam} 
              disabled={!this.state.isWebcamOpen}
              style={{ 
                fontSize: '16px', 
                fontWeight: 'bold', 
                padding: '10px 20px', 
                borderRadius: '8px', 
                cursor: 'pointer', 
                transition: 'all 0.3s ease', 
                color: !this.state.isWebcamOpen ? '#999' : 'white', 
                border: 'none', 
                textAlign: 'center',
                background: !this.state.isWebcamOpen ? '#ddd' : 'linear-gradient(45deg, #F44336, #E57373)',
                flex: '1', 
                minWidth: '120px'
              }}
            >
              Tắt camera
            </button>

            <button 
              onClick={this.handleReRegisterUser}
              style={{ 
                fontSize: '16px', 
                fontWeight: 'bold', 
                padding: '10px 20px', 
                borderRadius: '8px', 
                cursor: 'pointer', 
                transition: 'all 0.3s ease', 
                color: 'white', 
                border: 'none', 
                textAlign: 'center',
                background: 'linear-gradient(45deg, #FF9800, #FFC107)',
                flex: '1', 
                minWidth: '120px'
              }}
            >
              Đăng ký lại
            </button>

            <button 
              onClick={this.toggleModalHistory}
              style={{ 
                fontSize: '16px', 
                fontWeight: 'bold', 
                padding: '10px 20px', 
                borderRadius: '8px', 
                cursor: 'pointer', 
                transition: 'all 0.3s ease', 
                color: 'white', 
                border: 'none', 
                textAlign: 'center',
                background: 'linear-gradient(45deg, #FF9966 , #FF9999)',
                flex: '1', 
                minWidth: '120px'
              }}
            >
              Lịch sử
            </button>
          </div>

              
            </div>
          </div>
            </div>

            {/* Cột chứa hướng dẫn */}
            <div className="col-lg-6">
              <div className="card">
                <div className="card-body">
                <h4>Hướng dẫn đăng ký khuôn mặt</h4>

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
      {showModalHistory && (
  <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Lịch sử hình ảnh</h5>
          <button type="button" className="close" onClick={this.toggleModalHistory}>
            <span>&times;</span>
          </button>
        </div>
        <div className="modal-body">
          {userImages.length > 0 ? (
            <div className="image-gallery" style={{ display: 'flex', overflowX: 'auto', gap: '10px' }}>
              {userImages.map((image, index) => (
                <div key={index} className="image-item" style={{ flex: '0 0 auto', width: '150px', marginBottom: '10px' }}>
                  <img src={`data:image/jpeg;base64,${image}`} alt={`User Image ${index + 1}`} style={{ width: '100%' }} />
                </div>
              ))}
            </div>
          ) : (
            <p>Không có hình ảnh nào được tìm thấy.</p>
          )}
        </div>
        <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button type="button" className="btn btn-danger" onClick={this.toggleModalHistory}>Đóng</button>
        </div>
      </div>
    </div>
  </div>
)}
      </div>
    );
  }
}

export default RegistFaceID;
