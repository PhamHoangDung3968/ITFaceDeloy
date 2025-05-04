import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Test from './test';

const Dashboard = () => {
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalClassSections, setTotalClassSections] = useState(0);
  const [totalLecturers, setTotalLecturers] = useState(0);
  const [currentTermStudentCount, setCurrentTermStudentCount] = useState(0);
  const [totalsuccessFaceIDStudents, setTotalSuccessFaceIDStudents] = useState(0);
  const [totalAdminAndBCNK, setTotalAdminAndBCNK] = useState(0);
  const [totalRegisteredUsers, setTotalRegisteredUsers] = useState(0);
  const [totalLoginFaceID, setTotalLoginFaceID] = useState(0);

  // Gọi API để lấy danh sách sinh viên
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get("/api/admin/users/student"); // Cập nhật URL API nếu cần
        setTotalStudents(response.data.length || 0); // Lấy số lượng sinh viên từ mảng trả về
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sinh viên:", error);
        setTotalStudents(0);
      }
    };

    fetchStudents();
  }, []);

  // Gọi API để lấy danh sách lớp học phần
  useEffect(() => {
    const fetchClassSections = async () => {
      try {
        const response = await axios.get("/api/admin/classsections"); // Cập nhật URL API nếu cần
        setTotalClassSections(response.data.length || 0); // Lấy số lượng lớp học phần từ mảng trả về
      } catch (error) {
        console.error("Lỗi khi lấy danh sách lớp học phần:", error);
        setTotalClassSections(0);
      }
    };

    fetchClassSections();
  }, []);

  useEffect(() => {
    const fetchLecturers = async () => {
      try {
        const response = await axios.get("/api/admin/users/lecturer"); // Cập nhật URL API nếu cần
        setTotalLecturers(response.data.length || 0); // Lấy số lượng giảng viên từ mảng trả về
      } catch (error) {
        console.error("Lỗi khi lấy danh sách giảng viên:", error);
        setTotalLecturers(0);
      }
    };

    fetchLecturers();
  }, []);


  useEffect(() => {
    const fetchCurrentTermStudentCount = async () => {
      try {
        const response = await axios.get("/api/admin/thongke-soluong-sinhvien-hocky-hientai"); // Cập nhật URL API nếu cần
        if (Array.isArray(response.data)) {
          const totalStudentCount = response.data.reduce((acc, curr) => acc + curr.totalStudentCount, 0); // Tính tổng số lượng sinh viên từ nhiều termID
          setCurrentTermStudentCount(totalStudentCount || 0);
        } else {
          console.error("Dữ liệu trả về không phải là một mảng:", response.data);
          setCurrentTermStudentCount(0); // Nếu không phải là mảng, đặt giá trị là 0
        }
      } catch (error) {
        console.error("Lỗi khi lấy số lượng sinh viên của học kỳ hiện tại:", error);
        setCurrentTermStudentCount(0); // Nếu có lỗi, đặt giá trị là 0
      }
    };

    fetchCurrentTermStudentCount();
  }, []);


  useEffect(() => {
    const fetchSuccessFaceIDStudents = async () => {
      try {
        const response = await axios.get("/api/admin/thongke-soluong-sinhvien-sudungfaceid-diemdanh-thanhcong"); // Cập nhật URL API nếu cần
        if (Array.isArray(response.data)) {
          const totalFaceIDCount = response.data.reduce((acc, curr) => acc + curr.totalAttendanceCount, 0); // Tính tổng số lượng sinh viên từ nhiều termID
          setTotalSuccessFaceIDStudents(totalFaceIDCount || 0);
        } else {
          console.error("Dữ liệu trả về không phải là một mảng:", response.data);
          setTotalSuccessFaceIDStudents(0)
        }
      } catch (error) {
        console.error("Lỗi khi lấy số lượng sinh viên sử dụng FaceID điểm danh thành công:", error);
        setTotalSuccessFaceIDStudents(0)
      }
    };

    fetchSuccessFaceIDStudents();
  }, []);

  useEffect(() => {
    const fetchAdminAndBCNK = async () => {
      try {
        const response = await axios.get("/api/admin/users/adminandbcnk"); // Cập nhật URL API nếu cần
        setTotalAdminAndBCNK(response.data.length || 0); // Lấy số lượng Admin & BCNK từ mảng trả về
      } catch (error) {
        console.error("Lỗi khi lấy danh sách Admin & BCNK:", error);
        setTotalAdminAndBCNK(0);
      }
    };

    fetchAdminAndBCNK();
  }, []);

  useEffect(() => {
    const fetchRegisteredUsers = async () => {
      try {
        const response = await axios.get("/api/admin/count_users_regist"); // Cập nhật URL API nếu cần
        setTotalRegisteredUsers(response.data.count || 0); // Lấy số lượng người dùng đã đăng ký, nếu không có dữ liệu thì đặt là 0
      } catch (error) {
        console.error("Lỗi khi lấy số lượng người dùng đã đăng ký:", error);
        setTotalRegisteredUsers(0); // Nếu có lỗi, đặt giá trị là 0
      }
    };

    fetchRegisteredUsers();
  }, []);
  
  useEffect(() => {
    const fetchTotalLoginFaceID = async () => {
      try {
        const response = await axios.get("/api/admin/get-count-faceid-login"); // Cập nhật URL API nếu cần
        
        // Kiểm tra response và cập nhật state một cách an toàn
        if (response.data && typeof response.data.totalLoginFaceID === 'number') {
          setTotalLoginFaceID(response.data.totalLoginFaceID);
        } else {
          console.warn("Dữ liệu trả về không hợp lệ:", response.data);
          setTotalLoginFaceID(0);
        }
      } catch (error) {
        console.error("Lỗi khi lấy số lượt đăng nhập FaceID:", error);
        setTotalLoginFaceID(0);
      }
    };
  
    fetchTotalLoginFaceID();
}, []);



  return (
    <div>
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Thống kê chung</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <b><Link to='/admin/home' style={{color:'#6B63FF'}}>Trang chủ</Link></b>
                </li>
                <li className="breadcrumb-item active">Thống kê chung</li>
              </ol>
            </div>
          </div>
        </div>
      </section>
      <section className="content">
        <div className="card">
          <div className="card-body">
            <div className="row">
            <div className="col-lg-3 col-6">
                <div className="small-box bg-success">
                  <div className="inner">
                    <h3>{totalClassSections} Lớp<sup></sup></h3>
                    <p>Số lượng LHP</p>
                  </div>
                  <div className="icon">
                    <i className="fa fa-book"></i>
                  </div>
                             </div>
            </div>
              <div className="col-lg-3 col-6">
                <div className="small-box bg-info">
                  <div className="inner">
                    <h3>{totalStudents} SV</h3>
                    <p>Số lượng SV</p>
                  </div>
                  <div className="icon">
                    <i className="fa fa-user-graduate"></i>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-6">
                <div className="small-box bg-success">
                  <div className="inner bg-primary">
                    <h3>{totalRegisteredUsers} SV<sup></sup></h3>
                    <p>Tổng FaceID đã đăng ký</p>
                  </div>
                  <div className="icon">
                    <i className="fa fa-laugh-beam"></i>
                  </div>
                </div>
            </div>
              <div className="col-lg-3 col-6" >
                <div className="small-box bg-info" >
                  <div className="inner bg-danger">
                    <h3>{totalLecturers} GV</h3>
                    <p>Số lượng GV</p>
                  </div>
                  <div className="icon">
                    <i className="fa fa-chalkboard-teacher"></i>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-6">
                <div className="small-box bg-info">
                  <div className="inner bg-dark">
                    <h3>{totalAdminAndBCNK} tài khoản</h3>
                    <p>Số lượng Admin & BCNK</p>
                  </div>
                  <div className="icon" style={{ color: 'gray' }}>
                    <i className="fas fa-user-tie"></i>
                  </div>
                </div>
              </div>
              
            <div className="col-lg-3 col-6">
                <div className="small-box bg-success">
                  <div className="inner bg-warning">
                    <h3>{currentTermStudentCount} SV<sup></sup></h3>
                    <p>SLSV đã được điểm danh</p>
                  </div>
                  <div className="icon">
                    <i className="fa fa-clipboard-list"></i>
                  </div>
                </div>
            </div>
            
            <div className="col-lg-3 col-6">
                <div className="small-box bg-success">
                  <div className="inner bg-secondary">
                    <h3>{totalsuccessFaceIDStudents} lượt<sup></sup></h3>
                    <p>Số lượt dùng Faceid</p>
                  </div>
                  <div className="icon">
                    <i className="fa fa-grin-wink"></i>
                  </div>
                </div>
            </div>
            
            <div className="col-lg-3 col-6">
                <div className="small-box bg-success">
                  <div className="inner" style={{ backgroundColor: '#ffbe98' }}>
                    <h3>{totalLoginFaceID} lượt<sup></sup></h3>
                    <p>Số lượt đăng nhập FaceID</p>
                  </div>
                  <div className="icon">
                    <i className="far fa-grin-stars"></i>
                  </div>
                </div>
            </div>
          </div>
        </div>
        </div>
      <Test/>


      </section>
    </div>
  );
};

export default Dashboard;