import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Routes, Route, BrowserRouter, Link, useLocation, Navigate } from 'react-router-dom';
import logo from "./dist/img/logoIT.png"
import sidebarback from "./dist/img/sidebarbackground.jpg"
import DangNhap from './components/DangNhapComponent';
import Role from './components/RoleComponent';
import User from './components/UserComponent';
import Student from './components/StudentComponent';
import Home from './components/HomeComponent';
import Profile from './components/ProfileComponent';
import Semester_major from './components/semester_major';
import AddMajor from './components/Major_Add';
import EditMajor from './components/Major_Edit';
import AddTerm from './components/Term_Add';
import EditTerm from './components/Term_Edit';
import Subject from './components/SubjectComponent';
import AddSubject from './components/Subject_Add';
import EditSubject from './components/Subject_Edit';
import SubjectRegistration from './components/subjectRegistrationComponent';
import SubjectRegistrationDetail from './components/subjectRegistration_Detail';
import Classsection from './components/ClasssectionComponent';
import TeacherAssignmentsDetail from './components/Registration_Detail';
import Term from './components/TermComponent';
import Major from './components/MajorComponent';
import ClassSectionDetail from './components/ClasssectionDetail';
import TKB from './components/TKBComponent';
import Test from './components/test';
import Attendance from './components/AttendanceComponent';
import TKBStudent from './components/TKBStudentComponent';
import AttendanceStudent from './components/AttendanceStudentComponent';
import RegistFaceID from './components/RegistFaceID';

import Test1 from './components/test1';
import ProtectedRoute from './components/ProtectedRoute';
import DisplayInfo from './components/DisplayInfo';

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

const App = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isTKBMenuOpen, setIsTKBMenuOpen] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isCourseMenuOpen, setIsCourseMenuOpen] = useState(false); // State for "Môn học"
  const [isTermMajorMenuOpen, setIsTermMajorMenuOpen] = useState(false); // State for "Môn học"
  const [isUserManagementMenuOpen, setIsUserManagementMenuOpen] = useState(false); // State for "Người dùng"
  const [showLogoutModal, setShowLogoutModal] = useState(false); // State for logout confirmation modal

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
      { path: '/admin/user', element: <User userRole={user?.role} /> },
      { path: '/admin/user/student', element: <Student /> },
      { path: '/admin/semester_major', element: <Semester_major /> },
      { path: '/admin/major/add', element: <AddMajor /> },
      { path: '/admin/major/edit/:id', element: <EditMajor /> },
      { path: '/admin/term/add', element: <AddTerm /> },
      { path: '/admin/term/edit/:id', element: <EditTerm /> },
      { path: '/admin/subject', element: <Subject userRole={user?.role} /> }, // Pass userRole as prop
      { path: '/admin/subject/add', element: <AddSubject /> },
      { path: '/admin/subject/edit/:id', element: <EditSubject /> },
      { path: '/admin/subjectregistration', element: <SubjectRegistration userRole={user?.role} /> },
      { path: '/admin/subjectregistration/:subjecttermID', element: <SubjectRegistrationDetail userRole={user?.role} /> },
      { path: '/admin/assignmentlist', element: <TeacherAssignmentsDetail userRole={user?.role}/> },
      { path: '/admin/classsections/:subjecttermID', element: <Classsection userRole={user?.role} /> }, // Pass userRole as prop
      { path: '/admin/role', element: <Role /> },
      { path: '/admin/user/profile/:id', element: <Profile /> },
      { path: '/admin/tkb', element: <TKB userRole={user?.role} userID={user?._id} /> }, // Pass userRole and userID as props
      { path: '/admin/test', element: <Test/> },
      { path: '/admin/term', element: <Term userRole={user?.role}/> },
      { path: '/admin/major', element: <Major userRole={user?.role}/> },
      { path: '/admin/classsections/detail/:classCode', element: <ClassSectionDetail /> },
      { path: '/admin/attendance/:classCode', element: <Attendance /> },
      { path: '/admin/faceid_registration', element: <RegistFaceID userRole={user?.role} userID={user?._id} userCode={user?.userCode} /> },
      // { path: '/admin/test1', element: <ProtectedRoute element={Test1} /> }, // Sử dụng ProtectedRoute
      // { path: '/admin/', element: <ProtectedRoute element={DisplayInfo} /> }, // Sử dụng ProtectedRoute

      { path: '/admin/haha', element: <DisplayInfo userCode={user?.userCode} userID={user?._id} /> }, // Sử dụng ProtectedRoute

    ],
    'Giảng viên': [
      { path: '/admin/user', element: <User userRole={user?.role} /> }, //nhớ xóa
      { path: '/admin/user/student', element: <Student /> },
      { path: '/admin/semester_major', element: <Semester_major /> },
      { path: '/admin/subject', element: <Subject userRole={user?.role} /> }, // Pass userRole as prop
      { path: '/admin/subjectregistration', element: <SubjectRegistration userRole={user?.role} /> },
      { path: '/admin/subjectregistration/:subjecttermID', element: <SubjectRegistrationDetail userRole={user?.role} /> },
      { path: '/admin/classsections/:subjecttermID', element: <Classsection userRole={user?.role} /> }, // Pass userRole as prop
      { path: '/admin/tkb', element: <TKB userRole={user?.role} userID={user?._id}/> },
      { path: '/admin/test', element: <Test/> },
      { path: '/admin/term', element: <Term userRole={user?.role}/> },
      { path: '/admin/major', element: <Major userRole={user?.role}/> },
      { path: '/admin/classsections/detail/:classCode', element: <ClassSectionDetail /> },
      { path: '/admin/assignmentlist', element: <TeacherAssignmentsDetail userRole={user?.role}/> },
      { path: '/admin/attendance/:classCode', element: <Attendance /> },
      { path: '/admin/faceid_registration', element: <RegistFaceID userRole={user?.role} userID={user?._id} userCode={user?.userCode}/> },


    ],
    'Sinh viên': [
      { path: '/admin/subject', element: <Subject /> },
      { path: '/admin/subjectregistration', element: <SubjectRegistration /> },
      { path: '/admin/subjectregistration/:subjectID', element: <SubjectRegistrationDetail /> },
      { path: '/admin/tkbstudent', element: <TKBStudent userRole={user?.role} userID={user?._id}/> },
      { path: '/admin/attendance-student/:classCode', element: <AttendanceStudent userRole={user?.role} userID={user?._id}/> },
      { path: '/admin/classsections/:subjecttermID', element: <Classsection userRole={user?.role} /> },
      { path: '/admin/faceid_registration', element: <RegistFaceID userRole={user?.role} userID={user?._id} userCode={user?.userCode} /> },
      // { path: '/admin/', element: <ProtectedRoute element={DisplayInfo} /> }, // Sử dụng ProtectedRoute
      { path: '/admin/haha', element: <DisplayInfo userCode={user?.userCode} userID={user?._id} /> }, // Sử dụng ProtectedRoute


    ],
  };
  const showToast = () => {
    toast.success('Hello, toastsContainerTopRight!', {
      position: "top-right"
    });
  };
  return (
    <BrowserRouter>
      <AppContent
        user={user}
        error={error}
        isUserMenuOpen={isUserMenuOpen}
        isTKBMenuOpen={isTKBMenuOpen}
        isSidebarVisible={isSidebarVisible}
        isNotificationOpen={isNotificationOpen}
        isCourseMenuOpen={isCourseMenuOpen}
        isTermMajorMenuOpen={isTermMajorMenuOpen}
        isUserManagementMenuOpen={isUserManagementMenuOpen}
        handleLogin={handleLogin}
        handleLogout={handleLogout}
        confirmLogout={confirmLogout} // Pass confirmLogout to AppContent
        cancelLogout={cancelLogout} // Pass cancelLogout to AppContent
        toggleUserMenu={toggleUserMenu}
        toggleSidebar={toggleSidebar}
        toggleNotification={toggleNotification}
        toggleCourseMenu={toggleCourseMenu}
        toggleTKBMenu={toggleTKBMenu}
        toggleTermMajorMenu={toggleTermMajorMenu}
        toggleUserManagementMenu={toggleUserManagementMenu}
        sidebarTextStyle={sidebarTextStyle}
        activeLinkStyle={activeLinkStyle}
        roleRoutes={roleRoutes}
        showLogoutModal={showLogoutModal} // Pass showLogoutModal to AppContent
        showToast={showToast} // Pass showToast to AppContent
      />
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
  sidebarTextStyle,
  activeLinkStyle,
  roleRoutes,
  showLogoutModal, // Add showLogoutModal to AppContent props
  showToast, // Add showToast to AppContent props
}) => {
  const location = useLocation();

  const getRoutesForRole = (role) => {
    return roleRoutes[role] || [];
  };
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const userName = user ? user.microsoftData.displayName.split(' - ')[1] : '';

  return (
    <div className={`wrapper ${isSidebarVisible ? '' : 'sidebar-collapse'}`}>
      {!user ? (
        <DangNhap handleLogin={handleLogin} error={error} />
      ) : (
        <div>
          <nav className={`main-header navbar navbar-expand navbar-white navbar-light ${isSidebarVisible ? '' : 'ml-0'}`} style={{ backgroundColor: '#fff', padding: '1.0em 1.0em', color: '#000' }}>
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link" data-widget="pushmenu" href="#" role="button" onClick={toggleSidebar} style={{ color: '#000' }}>
                  <i className="fas fa-bars"></i>
                </a>
              </li>
            </ul>
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <a className="nav-link" href="#" role="button" onClick={toggleNotification} style={{ color: '#000' }}>
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
                <a className="nav-link" href="#" role="button" onClick={toggleNotification} style={{ color: '#FFFFFF' }}>
                  <i className="fas fa-angle-down" style={{ fontSize: '16px', color:'#000' }}></i>
                </a>
                {isNotificationOpen && (
                  <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right show" style={{ minWidth: '100px' }}>
                    <div className="dropdown-divider"></div>
                    
                     <Link to="#" className="dropdown-item" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#000000' }}>
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
                         <a href="#" className="nav-link" onClick={toggleUserMenu} style={sidebarTextStyle}>
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
                              <li className={`nav-item has-treeview ${isCourseMenuOpen ? 'menu-open' : ''}`}>
                              <a href="#" className="nav-link" onClick={toggleCourseMenu} style={sidebarTextStyle}>
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
                                    <p>LHP</p>
                                  </Link>
                                </li>
                                {user.role !== 'Sinh viên' && (
                                  <li className="nav-item">
                                  <Link to="/admin/assignmentlist" className="nav-link" style={location.pathname === '/admin/assignmentlist' ? activeLinkStyle : sidebarTextStyle}>
                                    <i className="fas fa-dot-circle nav-icon"></i>
                                    <p>LHP - GV</p>
                                  </Link>
                                </li>
                                )}
                                
                              </ul>
                            </li>
                            )}
                        
                        {/* <li className="nav-item">
                          <Link to="/admin/assignmentlist" className="nav-link" style={location.pathname === '/admin/assignmentlist' ? activeLinkStyle : sidebarTextStyle}>
                            <i className="nav-icon fas fa-chalkboard-teacher"></i>
                            <p>GV - LHP</p>
                          </Link>
                        </li> */}
                        <li className={`nav-item has-treeview ${isTKBMenuOpen ? 'menu-open' : ''}`}>
                         <a href="#" className="nav-link" onClick={toggleTKBMenu} style={sidebarTextStyle}>
                           <i className="nav-icon fas fa-calendar-alt"></i>
                           <p>
                             THỜI KHÓA BIỂU
                             <i className="right fas fa-angle-left"></i>
                           </p>
                         </a>
                         <ul className="nav nav-treeview custom-indent">
                         {user.role !== 'Sinh viên' && (
                            <li className="nav-item">
                             <Link to="/admin/tkb" className="nav-link" style={location.pathname === '/admin/tkb' ? activeLinkStyle : sidebarTextStyle}>
                               <i className="fas fa-dot-circle nav-icon"></i>
                               <p>TKB - GV</p>
                             </Link>
                           </li>
                          )}
                           {user.role !== 'Ban chủ nhiệm khoa' && (
                            <li className="nav-item">
                             <Link to="/admin/tkbstudent" className="nav-link" style={location.pathname === '/admin/tkbstudent' ? activeLinkStyle : sidebarTextStyle}>
                               <i className="fas fa-dot-circle nav-icon"></i>
                               <p>TKB - SV</p>
                             </Link>
                           </li>
                          )}
                           
                         </ul>
                       </li>
                       <li className="nav-item">
                          <Link to="/admin/faceid_registration" className="nav-link" style={location.pathname === '/admin/faceid_registration' ? activeLinkStyle : sidebarTextStyle}>
                            <i className="nav-icon fas fa-id-card"></i>
                            <p>ĐĂNG KÝ FACEID</p>
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link to="/admin/haha" className="nav-link" style={location.pathname === '/admin/haha' ? activeLinkStyle : sidebarTextStyle}>
                            <i className="nav-icon fas fa-calendar-alt"></i>
                            <p>Test</p>
                          </Link>
                        </li>
                      </>
                    )}
                  </ul>
                </nav>
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
    </div>
  );
};

export default App;

