import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import PublicPage from './components/PublicPage';
import { Routes, Route, BrowserRouter, Link, useLocation, Navigate } from 'react-router-dom';
import logo from "./dist/img/logoIT.png"
import sidebarback from "./dist/img/sidebarbackground.jpg"
import DangNhap from './components/DangNhapComponent';
import User from './components/UserComponent';
import Student from './components/StudentComponent';
import Home from './components/HomeComponent';
import Profile from './components/Profile';
import Subject from './components/SubjectComponent';
import SubjectRegistration from './components/subjectRegistrationComponent';
import SubjectRegistrationDetail from './components/subjectRegistration_Detail';
import Classsection from './components/ClasssectionComponent';
import TeacherAssignmentsDetail from './components/Registration_Detail';
import Term from './components/TermComponent';
import Major from './components/MajorComponent';
import ClassSectionDetail from './components/ClasssectionDetail';
import TKB from './components/TKBComponent';
import Attendance from './components/AttendanceComponent';
import TKBStudent from './components/TKBStudentComponent';
import AttendanceStudent from './components/AttendanceStudentComponent';
import RegistFaceID from './components/RegistFaceID';
import Clause from './components/Clause';
import ProtectedRoute from './components/ProtectedRoute';
import DisplayInfo from './components/DisplayInfo';
import TK_LHPStudents_Term from './components/TK_LHPStudents_Term';
import TK_StudenAbsent from './components/TK_StudenAbsent';
import TK_StudenAttendance from './components/TK_StudentAttendance';
import TK_StudentClassections from './components/TK_StudentClassections';
import TK_LHPTotalStudent from './components/TK_LHPTotalStudent';
import Dashboard from './components/dashboard';
//Scanner
import { BrowserMultiFormatReader } from '@zxing/library';
import './dist/css/adminlte.min.css';
import './plugins/icheck-bootstrap/icheck-bootstrap.min.css';
import './plugins/fontawesome-free/css/all.min.css';
import './plugins/daterangepicker/daterangepicker.css';
import './plugins/bootstrap-colorpicker/css/bootstrap-colorpicker.min.css';
import './plugins/tempusdominus-bootstrap-4/css/tempusdominus-bootstrap-4.min.css';
import './plugins/select2/css/select2.min.css';
import './plugins/select2-bootstrap4-theme/select2-bootstrap4.min.css';
import './plugins/bootstrap4-duallistbox/bootstrap-duallistbox.min.css';
import './plugins/bs-stepper/css/bs-stepper.min.css';
import './plugins/dropzone/min/dropzone.min.css';
import './dist/css/pagination.css'; // Import custom CSS file
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import IonIcon from '@reacticons/ionicons';


const App = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isTKBMenuOpen, setIsTKBMenuOpen] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isCourseMenuOpen, setIsCourseMenuOpen] = useState(false); 
  const [isTermMajorMenuOpen, setIsTermMajorMenuOpen] = useState(false);
  const [isUserManagementMenuOpen, setIsUserManagementMenuOpen] = useState(false);
  const [isStatisticMenuOpen, setIsStatisticMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  //Scanner
  const [showScanner, setShowScanner] = useState(false);
  const [showModal1, setShowModal1] = useState(false);
  const [scanResult, setScanResult] = useState('');

  const handleLogin = () => {
    window.location.href = 'https://itface.onrender.com/auth/microsoft';
  };

  const handleLogout = () => {
    setShowLogoutModal(true); // Show the logout confirmation modal
  };

  const confirmLogout = () => {
    axios.get('https://itface.onrender.com/logout')
      .then(response => {
        setUser(null);
        window.location.href = 'https://itface.onrender.com/admin';
      })
      .catch(error => {
        console.error('Logout error:', error);
      });
  };

  const cancelLogout = () => {
    setShowLogoutModal(false); // Hide the logout confirmation modal
  };
  const fetchUserV02 = async () => {
    try {
      const response = await axios.get('/user_v02');
      console.log('User V02 data:', response.data);
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user V02 data:', error);
    }
  };
  

  useEffect(() => {
    axios.get('/user')
      .then(response => {
        console.log('User data:', response.data);
        setUser(response.data);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });

    const params = new URLSearchParams(window.location.search);
    if (params.get('error') === 'login_failed') {
      setError('Tài khoản của bạn đã bị vô hiệu hóa hãy liên hệ với admin để đăng nhập');
    }
  fetchUserV02();
  }, []);

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };
  const toggleTKBMenu = () => {
    setIsTKBMenuOpen(!isTKBMenuOpen);
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const toggleNotification = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  const toggleCourseMenu = () => {
    setIsCourseMenuOpen(!isCourseMenuOpen);
  };
  const toggleTermMajorMenu = () => {
    setIsTermMajorMenuOpen(!isTermMajorMenuOpen);
  };

  const toggleUserManagementMenu = () => {
    setIsUserManagementMenuOpen(!isUserManagementMenuOpen);
  };
  const toggleStatisticMenu = () => {
    setIsStatisticMenuOpen(!isStatisticMenuOpen);
  };

  const sidebarTextStyle = {
    color: '#fff', // Change this to your desired color
  };

  const activeLinkStyle = {
    background: 'rgba(238, 238, 238, 0.3)', // Màu #EEEEEE với độ trong suốt
    color: '#fff',
    border: '1px solid #fff'
};

  const roleRoutes = {
    'Ban chủ nhiệm khoa': [
      { path: '/admin/profile', element: <Profile userRole={user?.role} userID={user?._id} /> },
      { path: '/admin/user', element: <User userRole={user?.role} /> },
      { path: '/admin/user/student', element: <Student /> },
      { path: '/admin/subject', element: <Subject userRole={user?.role} /> }, // Pass userRole as prop
      { path: '/admin/subjectregistration', element: <SubjectRegistration userRole={user?.role} /> },
      { path: '/admin/subjectregistration/:subjecttermID', element: <SubjectRegistrationDetail userRole={user?.role} /> },
      { path: '/admin/assignmentlist', element: <TeacherAssignmentsDetail userRole={user?.role}/> },
      { path: '/admin/classsections/:subjecttermID', element: <Classsection userRole={user?.role} /> }, // Pass userRole as prop
      { path: '/admin/tkb', element: <TKB userRole={user?.role} userID={user?._id} /> }, // Pass userRole and userID as props
      { path: '/admin/term', element: <Term userRole={user?.role}/> },
      { path: '/admin/major', element: <Major userRole={user?.role}/> },
      { path: '/admin/classsections/detail/:classCode', element: <ClassSectionDetail /> },
      { path: '/admin/attendance/:classCode', element: <Attendance userEmail={user?.microsoftData.mail}/> },
      // { path: '/admin/faceid_registration', element: <RegistFaceID userRole={user?.role} userID={user?._id} userCode={user?.userCode} /> },
      // { path: '/admin/test1', element: <ProtectedRoute element={Test1} /> }, // Sử dụng ProtectedRoute
      // { path: '/admin/', element: <ProtectedRoute element={DisplayInfo} userCode={user?.userCode} userID={user?._id} userEmail={user?.microsoftData.mail} /> }, // Sử dụng ProtectedRoute

      { path: '/admin/statistics-studenabsent', element: <TK_StudenAbsent/> }, 
      { path: '/admin/statistics-studenattendance', element: <TK_StudenAttendance/> }, 
      { path: '/admin/statistics-all-classes', element: <TK_StudentClassections userID={user?._id} userRole={user?.role} /> },
      { path: '/admin/dashboard', element: <Dashboard/> }, // Sử dụng ProtectedRoute

    ],
    'Giảng viên': [
      { path: '/admin/profile', element: <Profile userRole={user?.role} userID={user?._id} /> },
      { path: '/admin/user', element: <User userRole={user?.role} /> }, //nhớ xóa
      { path: '/admin/user/student', element: <Student /> },
      { path: '/admin/subject', element: <Subject userRole={user?.role} /> }, // Pass userRole as prop
      { path: '/admin/subjectregistration', element: <SubjectRegistration userRole={user?.role} /> },
      { path: '/admin/subjectregistration/:subjecttermID', element: <SubjectRegistrationDetail userRole={user?.role} /> },
      { path: '/admin/classsections/:subjecttermID', element: <Classsection userRole={user?.role} /> }, // Pass userRole as prop
      { path: '/admin/tkb', element: <TKB userRole={user?.role} userID={user?._id}/> },
      { path: '/admin/term', element: <Term userRole={user?.role}/> },
      { path: '/admin/major', element: <Major userRole={user?.role}/> },
      { path: '/admin/classsections/detail/:classCode', element: <ClassSectionDetail /> },
      { path: '/admin/assignmentlist', element: <TeacherAssignmentsDetail userRole={user?.role}/> },
      { path: '/admin/attendance/:classCode', element: <Attendance userEmail={user?.microsoftData.mail} /> },
      { path: '/admin/statistics-all-classes', element: <TK_StudentClassections userID={user?._id} userRole={user?.role} /> },
      { path: '/admin/statistics-total-all-classes', element: <TK_LHPTotalStudent userID={user?._id}/> },
      // { path: '/admin/faceid_registration', element: <RegistFaceID userRole={user?.role} userID={user?._id} userCode={user?.userCode}/> },


    ],
    'Sinh viên': [
      { path: '/admin/profile', element: <Profile userRole={user?.role} userID={user?._id} /> },
      // { path: '/admin/subject', element: <Subject /> },
      { path: '/admin/subjectregistration', element: <SubjectRegistration /> },
      { path: '/admin/subjectregistration/:subjectID', element: <SubjectRegistrationDetail /> },
      { path: '/admin/tkbstudent', element: <TKBStudent userRole={user?.role} userID={user?._id}/> },
      { path: '/admin/attendance-student/:classCode', element: <AttendanceStudent userRole={user?.role} userID={user?._id}/> },
      { path: '/admin/classsections/:subjecttermID', element: <Classsection userRole={user?.role} /> },
      { path: '/admin/faceid_registration', element: <RegistFaceID userRole={user?.role} userID={user?._id} userCode={user?.userCode} /> },
      // { path: '/admin/', element: <ProtectedRoute element={DisplayInfo} userCode={user?.userCode} userID={user?._id} userEmail={user?.microsoftData.mail} /> }, // Sử dụng ProtectedRoute
      // { path: '/admin/haha', element: <DisplayInfo userCode={user?.userCode} userID={user?._id} userEmail={user?.microsoftData.mail} /> }, // Sử dụng ProtectedRoute
      { path: '/admin/statistics-classsections-students-term', element: <TK_LHPStudents_Term userID={user?._id}/> }, 
      { path: '/admin/clause', element: <Clause/> }, 
      //nhớ xóa
      { path: '/admin/classsections/detail/:classCode', element: <ClassSectionDetail /> }, 
      { path: '/admin/assignmentlist', element: <TeacherAssignmentsDetail userRole={user?.role}/> },
      { path: '/admin/attendance/:classCode', element: <Attendance userEmail={user?.microsoftData.mail} /> },
    ],
  };
  const showToast = () => {
    toast.success('Hello, toastsContainerTopRight!', {
      position: "top-right"
    });
  };
  //Scanner
  const codeReaderRef = useRef(null);
  const startScanner = () => {
    const codeReader = new BrowserMultiFormatReader();
    codeReader.decodeFromVideoDevice(undefined, 'video', (result, err) => {
      if (result) {
        handleScan(result);
      }
      if (err) {
        handleError(err);
      }
    });
    codeReaderRef.current = codeReader;
  };
  
  const stopScanner = () => {
    if (codeReaderRef.current) {
      codeReaderRef.current.reset();
    }
  };
  
  const handleScan = (result) => {
    if (result) {
      setScanResult(result.text);
      window.location.href = result.text; // Redirect to the scanned URL
    }
  };
  
  const handleError = (err) => {
    console.error(err);
  };
  const toggleScanner = () => {
    setShowScanner(prevState => !prevState);
    setShowModal1(prevState => !prevState);
  };
  
  const handleCloseModal = () => {
    stopScanner();
    setShowModal1(false);
    setScanResult('');
    setShowScanner(false);
  };
  useEffect(() => {
    if (showScanner) {
      startScanner();
    }
  }, [showScanner]);
  
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/public" element={<PublicPage />} /> */}
        <Route 
          path="/admin/" 
          element={
            <ProtectedRoute 
              element={DisplayInfo} 
              userCode={user?.userCode} 
              userID={user?._id} 
              userEmail={user?.microsoftData.mail} 
            />
          } 
        />
        {/* <Route path="/" element={<DisplayInfo />} /> */}


        <Route path="/*" element={<AppContent
          user={user}
          error={error}
          isUserMenuOpen={isUserMenuOpen}
          isTKBMenuOpen={isTKBMenuOpen}
          isSidebarVisible={isSidebarVisible}
          isNotificationOpen={isNotificationOpen}
          isCourseMenuOpen={isCourseMenuOpen}
          isTermMajorMenuOpen={isTermMajorMenuOpen}
          isUserManagementMenuOpen={isUserManagementMenuOpen}
          isStatisticMenuOpen={isStatisticMenuOpen}
          handleLogin={handleLogin}
          handleLogout={handleLogout}
          confirmLogout={confirmLogout}
          cancelLogout={cancelLogout}
          toggleUserMenu={toggleUserMenu}
          toggleSidebar={toggleSidebar}
          toggleNotification={toggleNotification}
          toggleCourseMenu={toggleCourseMenu}
          toggleTKBMenu={toggleTKBMenu}
          toggleTermMajorMenu={toggleTermMajorMenu}
          toggleUserManagementMenu={toggleUserManagementMenu}
          toggleStatisticMenu={toggleStatisticMenu}
          sidebarTextStyle={sidebarTextStyle}
          activeLinkStyle={activeLinkStyle}
          roleRoutes={roleRoutes}
          showLogoutModal={showLogoutModal}
          showToast={showToast}
          showScanner={showScanner}
          showModal1={showModal1}
          scanResult={scanResult}
          toggleScanner={toggleScanner}
          handleCloseModal={handleCloseModal}
        />} />
        <Route path="/" element={<Navigate to="/public" />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
};

const AppContent = ({
  user,
  error,
  isUserMenuOpen,
  isTKBMenuOpen,
  isSidebarVisible,
  isNotificationOpen,
  isCourseMenuOpen,
  isTermMajorMenuOpen,
  isUserManagementMenuOpen,
  isStatisticMenuOpen,
  handleLogin,
  handleLogout,
  confirmLogout, // Add confirmLogout to AppContent props
  cancelLogout, // Add cancelLogout to AppContent props
  toggleUserMenu,
  toggleSidebar,
  toggleTKBMenu,
  toggleNotification,
  toggleCourseMenu,
  toggleTermMajorMenu,
  toggleUserManagementMenu,
  toggleStatisticMenu,
  sidebarTextStyle,
  activeLinkStyle,
  roleRoutes,
  showLogoutModal, // Add showLogoutModal to AppContent props
  showToast, // Add showToast to AppContent props
  //Scanner
  showScanner, // Add showScanner to AppContent props
  showModal1, // Add showModal1 to AppContent props
  scanResult, // Add scanResult to AppContent props
  toggleScanner, // Add toggleScanner to AppContent props
  handleCloseModal, // Add handleCloseModal to AppContent props
}) => {
  const location = useLocation();

  const getRoutesForRole = (role) => {
    return roleRoutes[role] || [];
  };
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  // const userName = user ? user.microsoftData.displayName.split(' - ')[1] : '';
  const userName = user ? (user.microsoftData.mail.includes('@vanlanguni.vn') ? user.microsoftData.displayName.split(' - ')[1] : user.microsoftData.displayName.split(' - ')[0]) : '';

  return (
    <div className={`wrapper ${isSidebarVisible ? '' : 'sidebar-collapse'}`}>
      {!user ? (
        <DangNhap handleLogin={handleLogin} error={error} />
      ) : (
        <div>
          <nav className={`main-header navbar navbar-expand navbar-white navbar-light ${isSidebarVisible ? '' : 'ml-0'}`} style={{ backgroundColor: '#fff', padding: '1.0em 1.0em', color: '#000' }}>
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link" data-widget="pushmenu" role="button" onClick={toggleSidebar} style={{ color: '#000' }}>
                  <i className="fas fa-bars"></i>
                </a>
              </li>
            </ul>
            <ul className="navbar-nav ml-auto">
              {/* Scanner */}
            <li className="nav-item" style={{ position: 'relative' }}>
              <a onClick={toggleScanner} className="nav-link" role="button" title='Quét QR Code' style={{ color: '#000' }}>
                <IonIcon name="scan-outline" style={{ fontSize: '30px',position: 'absolute', top: '-5px', left: '-2px' }} />
                <IonIcon name="qr-code-outline" style={{ fontSize: '16px', position: 'absolute', top: '6px', left: '5px' }} />
              </a>
            </li>
              <li className="nav-item">
                <a className="nav-link" role="button" onClick={toggleNotification} style={{ color: '#000' }}>
                  <i className="far fa-user-circle" style={{ fontSize: '24px' }}></i>
                </a>
              </li>
              <li className="nav-item">
                <div>
                  <b>{userName}</b><br></br>
                  <b style={{ fontSize: '12px' }}>{user.role}</b>
                </div>
              </li>
              <li className="nav-item dropdown">
                <a className="nav-link" role="button" onClick={toggleNotification} style={{ color: '#FFFFFF' }}>
                  <i className="fas fa-angle-down" style={{ fontSize: '16px', color:'#000' }}></i>
                </a>
                {isNotificationOpen && (
                  <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right show" style={{ minWidth: '100px' }}>
                    <div className="dropdown-divider"></div>
                    
                     <Link to="/admin/profile" className="dropdown-item" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#000000' }}>
                       <i className="fas fa-user mr-2"></i>Hồ sơ
                     </Link>
                    <div className="dropdown-divider"></div>
                    <a href='#' onClick={handleLogout} className="dropdown-item" style={{ color: '#FF0000' }}>
                      <i className="fas fa-power-off mr-2"></i> Đăng xuất
                    </a>
                  </div>
                )}
              </li>
            </ul>
          </nav>
          {isSidebarVisible && (
                        <aside className="main-sidebar sidebar-dark-primary elevation-4" style={{ backgroundImage: `url(${sidebarback})`, backgroundSize: 'contain', backgroundPosition: 'top left', backgroundAttachment: 'fixed' }}>            

              <Link to="/admin/home" className="brand-link" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', borderBottom: '#ffffff', padding: 0, height: '100px'}}>
                <img src={logo} alt='logo' style={{ width: '180px', height: 'auto'}} />
              </Link>
              <div className="sidebar" style={{  }}>
                <nav className="mt-2">
                  <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                    <li className="nav-item">
                      <Link to="/admin/home" className="nav-link" style={location.pathname === '/admin/home' ? activeLinkStyle : sidebarTextStyle}>
                        <i className="nav-icon fas fa-home"></i>
                        <p>TRANG CHỦ</p>
                      </Link>
                    </li>
                    {user.role !== 'Chưa phân quyền' && (
                      <>
                        {/* <li className="nav-item">
                          <Link to="/admin/user" className="nav-link" style={location.pathname === '/admin/user' ? activeLinkStyle : sidebarTextStyle}>
                            <i className="nav-icon fas fa-users"></i>
                            <p>Người dùng</p>
                          </Link>
                        </li> */}
                        {user.role !== 'Sinh viên' && (
                         <li className={`nav-item has-treeview ${isUserMenuOpen ? 'menu-open' : ''}`}>
                         <a className="nav-link" onClick={toggleUserMenu} style={sidebarTextStyle}>
                           <i className="nav-icon fas fa-users"></i>
                           <p>
                             NGƯỜI DÙNG
                             <i className="right fas fa-angle-left"></i>
                           </p>
                         </a>
                         <ul className="nav nav-treeview custom-indent">
                           <li className="nav-item">
                             <Link to="/admin/user" className="nav-link" style={location.pathname === '/admin/user' ? activeLinkStyle : sidebarTextStyle}>
                               <i className="fas fa-dot-circle nav-icon"></i>
                               <p>CBGVNV</p>
                             </Link>
                           </li>
                           <li className="nav-item">
                             <Link to="/admin/user/student" className="nav-link" style={location.pathname === '/admin/user/student' ? activeLinkStyle : sidebarTextStyle}>
                               <i className="fas fa-dot-circle nav-icon"></i>
                               <p>Sinh viên</p>
                             </Link>
                           </li>
                         </ul>
                       </li>
                      )}
                       
                        {/* <li className="nav-item">
                          <Link to="/admin/semester_major" className="nav-link" style={location.pathname === '/admin/semester_major' ? activeLinkStyle : sidebarTextStyle}>
                            <i className="nav-icon fas fa-layer-group"></i>
                            <p>Học kỳ và ngành</p>
                          </Link>
                        </li> */}
                        {user.role !== 'Sinh viên' && (
                          <li className={`nav-item has-treeview ${isTermMajorMenuOpen ? 'menu-open' : ''}`}>
                            <a className="nav-link" onClick={toggleTermMajorMenu} style={sidebarTextStyle}>
                              <i className="nav-icon fas fa-layer-group"></i>
                              <p>
                                DANH MỤC
                                <i className="right fas fa-angle-left"></i>
                              </p>
                            </a>
                            <ul className="nav nav-treeview custom-indent">
                              <li className="nav-item">
                                <Link to="/admin/term" className="nav-link" style={location.pathname === '/admin/term' ? activeLinkStyle : sidebarTextStyle}>
                                  <i className="fas fa-dot-circle nav-icon"></i>
                                  <p>Học kỳ</p>
                                </Link>
                              </li>
                              <li className="nav-item">
                                <Link to="/admin/major" className="nav-link" style={location.pathname === '/admin/major' ? activeLinkStyle : sidebarTextStyle}>
                                  <i className="fas fa-dot-circle nav-icon"></i>
                                  <p>Ngành</p>
                                </Link>
                              </li>
                            </ul>
                          </li>
                        )}
                        {/* <li className={`nav-item has-treeview ${isTermMajorMenuOpen ? 'menu-open' : ''}`}>
                          <a href="#" className="nav-link" onClick={toggleTermMajorMenu} style={sidebarTextStyle}>
                            <i className="nav-icon fas fa-layer-group"></i>
                            <p>
                              DANH MỤC
                              <i className="right fas fa-angle-left"></i>
                            </p>
                          </a>
                          <ul className="nav nav-treeview custom-indent">
                            <li className="nav-item">
                              <Link to="/admin/term" className="nav-link" style={location.pathname === '/admin/term' ? activeLinkStyle : sidebarTextStyle}>
                                <i className="fas fa-dot-circle nav-icon"></i>
                                <p>Học kỳ</p>
                              </Link>
                            </li>
                            <li className="nav-item">
                              <Link to="/admin/major" className="nav-link" style={location.pathname === '/admin/major' ? activeLinkStyle : sidebarTextStyle}>
                                <i className="fas fa-dot-circle nav-icon"></i>
                                <p>Ngành</p>
                              </Link>
                            </li>
                          </ul>
                        </li> */}
                        
                        {user.role !== 'Sinh viên' && (
                              <li className={`nav-item has-treeview ${isCourseMenuOpen ? 'menu-open' : 'Sinh viên'}`}>
                              <a className="nav-link" onClick={toggleCourseMenu} style={sidebarTextStyle}>
                                <i className="nav-icon fas fa-book"></i>
                                <p>
                                  LỚP HỌC PHẦN
                                  <i className="right fas fa-angle-left"></i>
                                </p>
                              </a>
                              <ul className="nav nav-treeview custom-indent">
                                <li className="nav-item">
                                  <Link to="/admin/subject" className="nav-link" style={location.pathname === '/admin/subject' ? activeLinkStyle : sidebarTextStyle}>
                                    <i className="fas fa-dot-circle nav-icon"></i>
                                    <p>LHP - Môn học</p>
                                  </Link>
                                </li>
                                {user.role !== 'Sinh viên' && (
                                  <li className="nav-item">
                                  <Link to="/admin/assignmentlist" className="nav-link" style={location.pathname === '/admin/assignmentlist' ? activeLinkStyle : sidebarTextStyle}>
                                    <i className="fas fa-dot-circle nav-icon"></i>
                                    <p>LHP - Giảng viên</p>
                                  </Link>
                                </li>
                                )}
                                
                              </ul>
                            </li>
                            )}
                          {user.role !== 'Sinh viên' && (
                            <li className="nav-item">
                          <Link to="/admin/tkb" className="nav-link" style={location.pathname === '/admin/tkb' ? activeLinkStyle : sidebarTextStyle}>
                            {/* <i className="nav-icon fas fa-id-card"></i> */}
                            <i className="nav-icon fas fa-calendar-alt"></i>
                            <p>THỜI KHÓA BIỂU</p>
                          </Link>
                        </li>
                          )}


                          {/* Menu Sinh viên */}
                        {user.role !== 'Ban chủ nhiệm khoa' && user.role !== 'Giảng viên' && (
                            <li className="nav-item">
                          <Link to="/admin/tkbstudent" className="nav-link" style={location.pathname === '/admin/tkbstudent' ? activeLinkStyle : sidebarTextStyle}>
                            {/* <i className="nav-icon fas fa-id-card"></i> */}
                            <i className="nav-icon fas fa-calendar-alt"></i>

                            <p>THỜI KHÓA BIỂU</p>
                          </Link>
                        </li>
                          )}
                       {user.role !== 'Ban chủ nhiệm khoa' && user.role !== 'Giảng viên' && (
                            <li className="nav-item">
                          <Link to="/admin/clause" className="nav-link" style={location.pathname === '/admin/clause' ? activeLinkStyle : sidebarTextStyle}>
                            {/* <i className="nav-icon fas fa-id-card"></i> */}
                            <i className="nav-icon fas fa-exclamation-circle"></i>

                            <p>ĐIỀU KHOẢN ITFACE</p>
                          </Link>
                        </li>
                          )}
                       {user.role !== 'Ban chủ nhiệm khoa' && user.role !== 'Giảng viên' && (
                            <li className="nav-item">
                          <Link to="/admin/faceid_registration" className="nav-link" style={location.pathname === '/admin/faceid_registration' ? activeLinkStyle : sidebarTextStyle}>
                            <i className="nav-icon fas fa-id-card"></i>
                            <p>ĐĂNG KÝ FACEID</p>
                          </Link>
                        </li>
                          )}
                          {user.role !== 'Ban chủ nhiệm khoa' && user.role !== 'Giảng viên' && (
                            <li className="nav-item">
                                <Link to="/admin/statistics-classsections-students-term" className="nav-link" style={location.pathname === '/admin/statistics-classsections-students-term' ? activeLinkStyle : sidebarTextStyle}>
                                  <i className="nav-icon fas fa-chart-line"></i>
                                  <p>THỐNG KÊ</p>
                                </Link>
                              </li>
                          )}
                          
                          {/* kết thúc menu Sinh viên */}


                        {user.role !== 'Sinh viên' && (
                           <li className={`nav-item has-treeview ${isStatisticMenuOpen ? 'menu-open' : ''}`}>
                            <a className="nav-link" onClick={toggleStatisticMenu} style={sidebarTextStyle}>
                              <i className="nav-icon fas fa-chart-line"></i>
                              <p>
                                THỐNG KÊ
                                <i className="right fas fa-angle-left"></i>
                              </p>
                            </a>
                            
                            <ul className="nav nav-treeview custom-indent">
                            {/* {user.role !== 'Ban chủ nhiệm khoa' && user.role !== 'Giảng viên' && (
                            <li className="nav-item">
                                <Link to="/admin/statistics-classsections-students-term" className="nav-link" style={location.pathname === '/admin/statistics-classsections-students-term' ? activeLinkStyle : sidebarTextStyle}>
                                  <i className="fas fa-dot-circle nav-icon"></i>
                                  <p>LHP - Theo học kỳ</p>
                                </Link>
                              </li>
                          )} */}
                          {user.role !== 'Sinh viên' && user.role !== 'Giảng viên' && (
                            <>
                            {/* <li className="nav-item">
                                <Link to="/admin/statistics-studenabsent" className="nav-link" style={location.pathname === '/admin/statistics-studenabsent' ? activeLinkStyle : sidebarTextStyle}>
                                  <i className="fas fa-dot-circle nav-icon"></i>
                                  <p>Tỉ lệ SV vắng</p>
                                </Link>
                              </li>
                              <li className="nav-item">
                              <Link to="/admin/statistics-studenattendance" className="nav-link" style={location.pathname === '/admin/statistics-studenattendance' ? activeLinkStyle : sidebarTextStyle}>
                                <i className="fas fa-dot-circle nav-icon"></i>
                                <p>Tỉ lệ SV điểm danh</p>
                              </Link>
                            </li> */}
                            <li className="nav-item">
                              <Link to="/admin/dashboard" className="nav-link" style={location.pathname === '/admin/dashboard' ? activeLinkStyle : sidebarTextStyle}>
                                <i className="fas fa-dot-circle nav-icon"></i>
                                <p>Thống kê chung</p>
                              </Link>
                            </li>
                            <li className="nav-item">
                              <Link to="/admin/statistics-studenattendance" className="nav-link" style={location.pathname === '/admin/statistics-studenattendance' ? activeLinkStyle : sidebarTextStyle}>
                                <i className="fas fa-dot-circle nav-icon"></i>
                                <p>Tỉ lệ SV điểm danh</p>
                              </Link>
                            </li>
                            </>
                          )}
                          {user.role !== 'Sinh viên' && (
                              <li className="nav-item">
                              <Link to="/admin/statistics-all-classes" className="nav-link" style={location.pathname === '/admin/statistics-all-classes' ? activeLinkStyle : sidebarTextStyle}>
                                <i className="fas fa-dot-circle nav-icon"></i>
                                <p>DSSV vắng nhiều</p>
                              </Link>
                            </li>
                          )}
                          {user.role !== 'Sinh viên' && user.role !== 'Ban chủ nhiệm khoa' && (
                              <li className="nav-item">
                              <Link to="/admin/statistics-total-all-classes" className="nav-link" style={location.pathname === '/admin/statistics-total-all-classes' ? activeLinkStyle : sidebarTextStyle}>
                                <i className="fas fa-dot-circle nav-icon"></i>
                                <p>SLSV từng buổi</p>
                              </Link>
                            </li>
                          )}
                          
                          
                              
                            </ul>
                          </li>
                          )}
                          
                      </>
                    )}
                    
                  </ul>
                </nav>
                <button className="mobile-button" onClick={toggleSidebar} style={{ backgroundColor: 'transparent', border: 'none' }}>
              <IonIcon name="chevron-back-circle-outline" style={{ fontSize: '25px', height: '1em', width: '1.3em', padding: '1px 4px', color: '#fff' }} />
          </button>

              </div>
            </aside>
          )}
          <div className={`content-wrapper ${isSidebarVisible ? '' : 'ml-0'}`}>
            <Routes>
              <Route path='/admin/home' element={<Home />} />
            </Routes>
            <section className="content">
              <div className="card">
                <div className="card-body">
                  <Routes>
                    {getRoutesForRole(user.role).map((route, index) => (
                      <Route key={index} path={route.path} element={route.element} />
                    ))}
                  </Routes>
                </div>
              </div>
            </section>
          </div>
          <footer className={`main-footer ${isSidebarVisible ? '' : 'ml-0'}`}>
          <p><b>© {currentYear} - Bản Quyền Thuộc Khoa Công nghệ Thông tin, Trường Đại Học Văn Lang.</b></p>
          </footer>
          <aside className="control-sidebar control-sidebar-dark"></aside>
                <style jsx>{`
          @media (max-width: 768px) {
            .mobile-button {
              display: block;
              width: 100%;
              padding: 10px;
              background-color: #007bff;
              color: white;
              border: none;
              text-align: center;
              cursor: pointer;
            }
          }

          @media (min-width: 769px) {
            .mobile-button {
              display: none;
            }
          }
        `}</style>
        </div>
      )}
      {showLogoutModal && (
        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Xác nhận đăng xuất</h5>
                <button type="button" className="close" onClick={cancelLogout}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                Bạn có chắc chắn muốn đăng xuất không?
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={cancelLogout}>Hủy</button>
                <button type="button" className="btn btn-primary" onClick={confirmLogout}>Đăng xuất</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Scanner */}
    {showModal1 && (
      <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.7)' }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title"><b>Quét mã QR</b></h5>
              <button type="button" className="close" onClick={handleCloseModal}>
                <span>&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {showScanner && (
                <div>
                  <video id="video" width="100%" height="100%"></video>
                </div>
              )}
              {scanResult && (
                <div>
                  <p>Kết quả quét: <a href={scanResult} target="_blank" rel="noopener noreferrer">{scanResult}</a></p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )}
    </div>
  );
};

export default App;

