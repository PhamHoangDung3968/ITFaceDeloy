// import React, { Component } from 'react';
// import axios from 'axios';
// import MyContext from '../contexts/MyContext';
// import '../plugins/fontawesome-free/css/all.min.css';
// import '../plugins/tempusdominus-bootstrap-4/css/tempusdominus-bootstrap-4.min.css';
// import '../plugins/icheck-bootstrap/icheck-bootstrap.min.css';
// import '../plugins/jqvmap/jqvmap.min.css';
// import '../dist/css/adminlte.min.css';
// import '../plugins/overlayScrollbars/css/OverlayScrollbars.min.css';
// import '../plugins/daterangepicker/daterangepicker.css';
// import '../plugins/summernote/summernote-bs4.min.css';
// import backgroundImage from '../dist/img/background1.jpg';
// import videobackground from '../dist/img/file.mp4'



// class Home extends Component {
//   static contextType = MyContext; // using this.context to access global state

//   state = {
//     users: []
//   };

//   componentDidMount() {
//     this.fetchUsers();
//   }

//   fetchUsers = async () => {
//     try {
//       const response = await axios.get('/api/users');
//       this.setState({ users: response.data });
//     } catch (error) {
//       console.error('Error fetching users:', error);
//     }
//   };

//   render() {
//     const { users } = this.state;

//     return (
//       <div className="align-center">
//         {/* <section className="content-header"> */}
//           <div className="hold-transition login-page" style={{
//                 backgroundImage: `url(${videobackground})`,
//                 backgroundRepeat: 'no-repeat',
//                 backgroundPosition: 'center',
//                 backgroundSize: 'cover',
//                 backgroundColor: 'linear-gradient(to bottom right, #0066cc, #d0e0ff)',
//                 backgroundColor: 'rgba(0, 0, 0, 0.5)',
//                 backgroundBlendMode: 'multiply',
//                 position: 'relative'
//               }}>
               
//                 <div className="card-footer">
          
//                 <h3 className="h3" style={{ color: 'white', marginTop: '50px', textAlign: 'center' }}>
//                   ỨNG DỤNG ĐIỂM DANH ITFACE
//                 </h3>
//                 <h3 className="h3" style={{ color: 'white',  textAlign: 'center' }}>
//                   VLU
//                 </h3>
//                 <h3 className="h1" style={{ color: 'white', fontSize:'80px',marginTop: '20px', textAlign: 'center' }}>
//                   XIN CHÀO
//                 </h3>
//                 <h3 className="h3" style={{ color: 'white', marginTop: '20px', textAlign: 'center' }}>
//                   CHÚC BẠN CÓ MỘT BUỔI HỌC THẬT VUI VẺ.
//                 </h3>
//                 </div>
//               </div>
//         {/* </section> */}
//         <div style={{ 
//           display: 'flex', 
//           justifyContent: 'center', 
//           alignItems: 'center', 
//           // height: '100vh', 
//         }}>
//           {/* <img 
//             src={background02} 
//             style={{ 
//               width: '60%', 
//               height: '100%', 
//               margin: '0 auto', 
//             }} 
//           /> */}
//         </div>
        
//       </div>
//     );
//   }
// }

// export default Home;
import React, { Component } from 'react';
import axios from 'axios';
import MyContext from '../contexts/MyContext';
import '../plugins/fontawesome-free/css/all.min.css';
import '../plugins/tempusdominus-bootstrap-4/css/tempusdominus-bootstrap-4.min.css';
import '../plugins/icheck-bootstrap/icheck-bootstrap.min.css';
import '../plugins/jqvmap/jqvmap.min.css';
import '../dist/css/adminlte.min.css';
import '../plugins/overlayScrollbars/css/OverlayScrollbars.min.css';
import '../plugins/daterangepicker/daterangepicker.css';
import '../plugins/summernote/summernote-bs4.min.css';
import videobackground from '../dist/img/file.mp4';

class Home extends Component {
  static contextType = MyContext; // using this.context to access global state

  state = {
    users: []
  };

  componentDidMount() {
    this.fetchUsers();
  }

  fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users');
      this.setState({ users: response.data });
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  render() {
    const { users } = this.state;

    return (
      <div className="align-center">
        <div className="hold-transition login-page" style={{
          position: 'relative',
          overflow: 'hidden'
        }}>
          
          <div className="video-overlay" style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(107, 25, 45, 0.5)'
          }}></div>
          <video autoPlay loop muted style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            
          }}>
            <source src={videobackground} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="overlay-text" style={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'white',
            textAlign: 'center',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)' // Added text shadow

          }}>
            <h3 className="h3" style={{ marginTop: '50px' }}>
              ỨNG DỤNG ĐIỂM DANH ITFACE
            </h3>
            <h3 className="h3">
              VLU
            </h3>
            <h3 className="h1" style={{ fontSize: '80px', marginTop: '20px' }}>
              XIN CHÀO
            </h3>
            <h3 className="h3" style={{ marginTop: '20px' }}>
              CHÚC BẠN CÓ MỘT BUỔI HỌC THẬT VUI VẺ.
            </h3>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;