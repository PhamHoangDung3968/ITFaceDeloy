import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import icon_face from "../dist/img/icon_face.png"; // Cập nhật đường dẫn ảnh
import Test from './test';

const Dashboard = () => {
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalClassSections, setTotalClassSections] = useState(0);
  const [totalLecturers, setTotalLecturers] = useState(0);
  const [currentTermStudentCount, setCurrentTermStudentCount] = useState(0);
  const [totalsuccessFaceIDStudents, setTotalSuccessFaceIDStudents] = useState(0);
  const [totalAdminAndBCNK, setTotalAdminAndBCNK] = useState(0);
  const [totalRegisteredUsers, setTotalRegisteredUsers] = useState(0);






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
          const totalFaceIDCount = response.data.reduce((acc, curr) => acc + curr.totalStudentCount, 0); // Tính tổng số lượng sinh viên từ nhiều termID
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



  return (
    <div>
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Tổng quan ITFace</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <b><Link to='/admin/home' style={{color:'#6B63FF'}}>Trang chủ</Link></b>
                </li>
                <li className="breadcrumb-item active">Tổng quan ITFace</li>
              </ol>
            </div>
          </div>
        </div>
      </section>
      <section className="content">
        <div className="card">
          <div className="row" style={{ margin: "15px 5px 0 5px" }}>
            <div className="col-12 col-sm-6 col-md-3">
              <div className="info-box">
                <span className="info-box-icon bg-info elevation-1"><i className="fas fa-user-graduate"></i></span>
                <div className="info-box-content">
                  <span className="info-box-text">Số lượng SV</span>
                  <span className="info-box-number">{totalStudents} SV</span>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-md-3">
              <div className="info-box mb-3">
                <span className="info-box-icon bg-danger elevation-1"><i className="fas fa-chalkboard-teacher"></i></span>
                <div className="info-box-content">
                  <span className="info-box-text">Số lượng GV</span>
                  <span className="info-box-number">{totalLecturers} GV</span>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-md-3">
             <div className="info-box mb-3">
               <span className="info-box-icon bg-dark elevation-1"><i className="fas fa-user-tie"></i></span>
               <div className="info-box-content">
                 <span className="info-box-text">Số lượng Admin & BCNK</span>
                 <span className="info-box-number">{totalAdminAndBCNK} GV</span>
               </div>
             </div>
           </div>
            <div className="col-12 col-sm-6 col-md-3">
              <div className="info-box mb-3">
                <span className="info-box-icon bg-success elevation-1"><i className="fas fa-book"></i></span>
                <div className="info-box-content">
                  <span className="info-box-text">Số lượng LHP</span>
                  <span className="info-box-number">{totalClassSections} Lớp</span>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-md-3">
              <div className="info-box mb-3">
                <span className="info-box-icon bg-warning elevation-1"><i className="fas fa-clipboard-list"></i></span>
                <div className="info-box-content">
                  <span className="info-box-text">SLSV đã được điểm danh</span>
                  <span className="info-box-number">{currentTermStudentCount} SV</span>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-md-3">
              <div className="info-box mb-3">
                <span className="info-box-icon bg-primary elevation-1">
                  <img src={icon_face} alt="icon" style={{ width: "40px", height: "40px" }} />
                </span>
                <div className="info-box-content">
                  <span className="info-box-text">Tổng FaceID đã đăng ký</span>
                  <span className="info-box-number">{totalRegisteredUsers} SV</span>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-md-3">
              <div className="info-box mb-3">
                <span className="info-box-icon bg-secondary elevation-1"><i className="fas fa-grin-wink"></i></span>
                <div className="info-box-content">
                  <span className="info-box-text">Số lượt dùng Faceid</span>
                  <span className="info-box-number">{totalsuccessFaceIDStudents} SV</span>
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