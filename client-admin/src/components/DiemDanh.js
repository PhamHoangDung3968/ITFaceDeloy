import React, { Component } from 'react';
import axios from 'axios';
import MyContext from '../contexts/MyContext';
import { Link } from 'react-router-dom';
import '../plugins/fontawesome-free/css/all.min.css';
import '../plugins/tempusdominus-bootstrap-4/css/tempusdominus-bootstrap-4.min.css';
import '../plugins/icheck-bootstrap/icheck-bootstrap.min.css';
import '../plugins/jqvmap/jqvmap.min.css';
import '../dist/css/adminlte.min.css';
import '../plugins/overlayScrollbars/css/OverlayScrollbars.min.css';
import '../plugins/daterangepicker/daterangepicker.css';
import '../plugins/summernote/summernote-bs4.min.css';
import '../dist/css/pagination.css';
import '../dist/css/buttonIcon.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


class DiemDanh extends Component {
  static contextType = MyContext;
  state = {
    isWebcamOpen: false,
    webcamImage: null,
    userName: '',
    isUserRegistered: false,
  };

  videoRef = React.createRef();

  handleOpenWebcam = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          this.videoRef.current.srcObject = stream;
          this.videoRef.current.play();
          this.setState({ isWebcamOpen: true });
          this.showToast('Webcam opened successfully');
        })
        .catch(error => {
          console.error('Error accessing webcam:', error);
          this.showErrorToast('Error accessing webcam');
        });
    }
  };

  handleLoginUser = () => {
  const { userName, webcamImage } = this.state;
  if (!userName || !webcamImage) {
    this.showErrorToast('Please enter a username and capture an image.');
    return;
  }

  axios.post('/api/admin/login_user', {
    name: userName,
    image: webcamImage.split(',')[1] // Remove the data URL prefix
  })
    .then(response => {
      this.showToast(response.data.message);
    })
    .catch(error => {
      if (error.response) {
        console.log('Error status:', error.response.status);
        console.error('Error logging in user:', error.response.data);

        if (error.response.status === 403) {
          this.showErrorToast('Hãy trung thực!');
        } else if (error.response.status === 401) {
          this.showErrorToast('Thất bại vui lòng thử lại!');
        } else {
          this.showErrorToast('Đăng nhập thất bại');
        }
      } else {
        console.error('Error logging in user:', error);
        this.showErrorToast('Error logging in user');
      }
    });
};

  handleCaptureImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = this.videoRef.current.videoWidth;
    canvas.height = this.videoRef.current.videoHeight;
    const context = canvas.getContext('2d');
  
    // Đảm bảo định dạng hình ảnh đúng
    context.drawImage(this.videoRef.current, 0, 0, canvas.width, canvas.height);
    const image = canvas.toDataURL('image/jpeg');
  
    this.setState({ webcamImage: image });
    this.showToast('Chụp ảnh thành công');
  };

  handleCloseWebcam = () => {
    const stream = this.videoRef.current.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach(track => track.stop());
    this.videoRef.current.srcObject = null;
    this.setState({ isWebcamOpen: false, webcamImage: null });
    this.showToast('Webcam closed successfully');
  };

  handleRegisterUser = () => {
    const { userName, webcamImage } = this.state;
    if (!userName || !webcamImage) {
      this.showErrorToast('Please enter a username and capture an image.');
      return;
    }

    axios.post('/api/admin/register_user', {
      name: userName,
      image: webcamImage.split(',')[1] // Remove the data URL prefix
    })
      .then(response => {
        this.showToast(response.data.message);
        this.setState({ isUserRegistered: true });
      })
      .catch(error => {
        console.error('Error registering user:', error);
        this.showErrorToast('Error registering user');
      });
  };

  handleInputChange = (event) => {
    const userName = event.target.value;
    this.setState({ userName });

    if (userName) {
      axios.post('/api/admin/check_user', { name: userName })
        .then(response => {
          if (response.data.status === 'success') {
            this.setState({ isUserRegistered: true });
          } else {
            this.setState({ isUserRegistered: false });
          }
        })
        .catch(error => {
          console.error('Error checking user registration:', error);
          this.setState({ isUserRegistered: false });
        });
    } else {
      this.setState({ isUserRegistered: false });
    }
  };

  showToast = (message) => {
    toast.success(message, {
      position: "top-right"
    });
  };

  showErrorToast = (message) => {
    toast.error(message, {
      position: "top-right"
    });
  };

  render() {
    return (
      <div>
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1>Thời khóa biểu</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <b><Link to='/admin/home' style={{ color: '#6B63FF' }}>Trang chủ</Link></b>
                  </li>
                  <li className="breadcrumb-item active">Thời khóa biểu</li>
                </ol>
              </div>
            </div>
          </div>
        </section>
        <section className="content">
          <div className="card">
            <div className="card-body table-responsive p-0">
              <table className="table table-hover text-nowrap">
                <thead style={{ backgroundColor: '#FFCCCC' }}>
                  <tr>
                    <th>File Import</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <input 
                        type="text" 
                        placeholder="Enter username" 
                        value={this.state.userName} 
                        onChange={this.handleInputChange} 
                      />
                      <button onClick={this.handleOpenWebcam} disabled={this.state.isWebcamOpen}>Open Webcam</button>
                      <button onClick={this.handleCaptureImage} disabled={!this.state.isWebcamOpen}>Capture Image</button>
                      <button onClick={this.handleCloseWebcam} disabled={!this.state.isWebcamOpen}>Close Webcam</button>
                      <button onClick={this.handleRegisterUser} disabled={this.state.isUserRegistered}>
                        {this.state.isUserRegistered ? 'You are already registered' : 'Register User'}
                      </button>
                      <button onClick={this.handleLoginUser}>Login User</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <video ref={this.videoRef} style={{ width: '100%', maxWidth: '600px' }}></video>
        </div>
        {this.state.webcamImage && (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <img src={this.state.webcamImage} alt="Webcam Capture" style={{ width: '100%', maxWidth: '600px' }} />
          </div>
        )}
        <ToastContainer />
      </div>
    );
  }
}

export default DiemDanh;


// import React, { useEffect } from 'react';

// const Test1 = () => {
//     useEffect(() => {
//         // Clear the token from localStorage when the component unmounts
//         return () => {
//             localStorage.removeItem('token');
//         };
//     }, []);

//     return (
//         <div>
//             <h1>Welcome to Test1</h1>
//             {/* Your component content */}
//         </div>
//     );
// };

// export default Test1;