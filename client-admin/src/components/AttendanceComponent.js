import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { v4 as uuidv4 } from 'uuid';
import IonIcon from '@reacticons/ionicons';
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
import QRCode from 'qrcode.react';
import { QRCodeCanvas } from 'qrcode.react';

const Attendance = ({ userRole }) => {
  const [classcode, setClasscode] = useState('');
  const [classSections, setClassSections] = useState([]);
  const [subjectInfo, setSubjectInfo] = useState({ lesson: [] });
  const [currentPage, setCurrentPage] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [qrCodeValue, setQrCodeValue] = useState('');
  const [showModalProfile, setShowModalProfile] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const sectionsPerPage = 50;
  const [attendanceDates, setAttendanceDates] = useState([]);
  const [attendanceDetails, setAttendanceDetails] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('Hỗ trợ');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [token, setToken] = useState('');
  const [scanSuccess, setScanSuccess] = useState(false);
  // const [countdown, setCountdown] = useState(10);
  const [countdown, setCountdown] = useState(5);
  const [attendanceCounts, setAttendanceCounts] = useState({});
  const [excusedAbsenceCounts, setExcusedAbsenceCounts] = useState({});
  const [isZoomed, setIsZoomed] = useState(false);

  const defaultUrl = window.location.origin;
  const deviceUUID = uuidv4();

  useEffect(() => {
    const url = window.location.href;
    const extractedClasscode = url.split('/').pop();
    if (extractedClasscode) {
      setClasscode(extractedClasscode);
    } else {
      console.error('Failed to extract classcode from URL');
    }
  }, []);

  useEffect(() => {
    console.log('Classcode:', classcode);
    if (classcode) {
      apiGetClassSections();
    }
  }, [classcode]);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const [datesResponse, detailsResponse] = await Promise.all([
          axios.get(`/api/admin/studentclass/dateattendance/${classcode}`),
          axios.get(`/api/admin/studentclass/dateattendance/detail/${classcode}`)
        ]);
        setAttendanceDates(datesResponse.data);
        setAttendanceDetails(detailsResponse.data);
      } catch (error) {
        console.error('Error fetching attendance data:', error);
      }
    };

    if (classcode) {
      fetchAttendanceData();
    }
  }, [classcode]);

  const apiGetClassSections = async () => {
    try {
      const response = await axios.get(`/api/admin/studentclass/allstudent/${classcode}`);
      console.log('All students response:', response.data);
      setClassSections(response.data);

      const subjectResponse = await axios.get(`/api/admin/studentclass/allvalue/${classcode}`);
      console.log('Subject info response:', subjectResponse.data);
      setSubjectInfo(subjectResponse.data);
    } catch (error) {
      console.error('Error fetching class sections:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const generateQrCode = async (date) => {
    try {
      const response = await axios.post(`/api/admin/generate/${classcode}/${formatDate(date)}`, {
        url: window.location.origin
      });

      setToken(response.data.token);
      setQrCodeValue(response.data.qrCodeImage);
      // setCountdown(10);
      setCountdown(5);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const fetchQrCode = async () => {
    try {
      const response = await axios.get(`/api/admin/generate/${classcode}/${formatDate(selectedDate)}/qr`, {
        params: { url: defaultUrl }
      });

      setToken(response.data.token);
      setQrCodeValue(response.data.qrCodeImage);
      // setCountdown(10);
      setCountdown(5);
    } catch (error) {
      console.error('Error fetching QR code:', error);
    }
  };

  useEffect(() => {
    if (token) {
      // const interval = setInterval(fetchQrCode, 10000);
      const interval = setInterval(fetchQrCode, 5000);
      return () => clearInterval(interval);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      const countdownInterval = setInterval(() => {
      //   setCountdown(prevCountdown => prevCountdown > 0 ? prevCountdown - 1 : 10);
      // }, 1000);
      setCountdown(prevCountdown => prevCountdown > 0 ? prevCountdown - 1 : 10);
      }, 1000);

      return () => clearInterval(countdownInterval);
    }
  }, [token]);
  
  useEffect(() => {
    const fetchAttendanceCounts = async () => {
      try {
        const response = await axios.get(`/api/admin/studentclass/dateattendance/detail/count/${classcode}`);
        setAttendanceCounts(response.data.timeCountByStudentID);
        setExcusedAbsenceCounts(response.data.statusCountByStudentID);
      } catch (error) {
        console.error('Error fetching attendance counts:', error);
      }
    };
    fetchAttendanceCounts();
  }, [classcode, attendanceDetails]); // Thêm attendanceDetails làm dependency


  const handleDateClick = (date) => {
    setSelectedDate(date);
    generateQrCode(date); // Gọi API generate để tạo mã QR
  };


  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value);
  };
  const openProfileModal = (user) => {
    setSelectedUser(user);
    setShowModalProfile(true);
  };
  
  const offset = currentPage * sectionsPerPage;
  const filteredClassSections = classSections.filter(section =>
    (section.displayName || '').toLowerCase().includes(searchKeyword.toLowerCase()) ||
    (section.email || '').toLowerCase().includes(searchKeyword.toLowerCase()) ||
    (section.fullName || '').toLowerCase().includes(searchKeyword.toLowerCase()) ||
    (section.userCode || '').toLowerCase().includes(searchKeyword.toLowerCase())
  );
  const currentClassSections = filteredClassSections.slice(offset, offset + sectionsPerPage);

  const mapLesson = (lesson) => {
    switch (lesson) {
      case 1:
        return '1-3';
      case 2:
        return '4-6';
      case 3:
        return '7-9';
      case 4:
        return '10-12';
      case 5:
        return '13-15';
      case 6:
        return 'Không có';
      default:
        return lesson;
    }
  };

  const mapClassType = (classType) => {
    return classType === 0 ? 'Lý thuyết' : 'Thực hành';
  };
  const showToast = (message) => {
        toast.success(message, {
          position: "top-right"
        });
      };
  const showErrorToast = (message) => {
          toast.error(message, {  
            position: "top-right"
          });
        };
  const handleExportAttendance = (classcode) => {
  axios({
    url: `/api/admin/export-attendance/${classcode}`,
    method: 'GET',
    responseType: 'blob', // Important to handle binary data
  })
  .then((response) => {
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `attendance_${classcode}.xlsx`); // Set the file name
    document.body.appendChild(link);
    link.click();
    link.remove();
  })
  .catch((error) => {
    console.error('Error downloading the file:', error);
  });
};
const handleAttendanceClick = async (studentId, date) => {
  console.log("Student ID:", studentId);
  console.log("Date (Original):", date);

  const formattedDate = new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  console.log("Date (Formatted):", formattedDate);

  const now = new Date();
  const currentDay = now.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  if (new Date(date) > now) {
    showErrorToast("Chưa đến ngày");
    return;
  }

  let status = "Hỗ trợ";

  if (formattedDate === currentDay) {
    const lessons = subjectInfo.lesson.map(mapLesson);

    lessons.forEach(lesson => {
      if (lesson === '1-3' && ((currentHour >= 7 && currentHour < 9) || (currentHour === 9 && currentMinute <= 30))) {
        status = "Hỗ trợ";
      } else if (lesson === '4-6' && ((currentHour >= 9 && currentMinute >= 35 && currentHour < 12) || (currentHour === 12 && currentMinute <= 0))) {
        status = "Hỗ trợ";
      } else if (lesson === '7-9' && ((currentHour >= 13 && currentHour < 15) || (currentHour === 15 && currentMinute <= 30))) {
        status = "Hỗ trợ";
      } else if (lesson === '10-12' && ((currentHour >= 15 && currentMinute >= 35 && currentHour < 18) || (currentHour === 18 && currentMinute <= 0))) {
        status = "Hỗ trợ";
      } else if (lesson === '13-15' && ((currentHour >= 18 && currentHour < 20) || (currentHour === 20 && currentMinute <= 30))) {
        status = "Hỗ trợ";
      }
    });
  }

  console.log("Status:", status);

  try {
    const response = await axios.post(`/api/admin/studentclass/dateattendancing/${classcode}`, {
      studentId: studentId,
      date: formattedDate,
      status: status,
    });

    console.log("Attendance recorded successfully:", response.data);
    showToast("Điểm danh thành công");

    const attendanceDetailsResponse = await axios.get(`/api/admin/studentclass/dateattendance/detail/${classcode}`);
    setAttendanceDetails(attendanceDetailsResponse.data);
    console.log("Attendance details reloaded successfully:", attendanceDetailsResponse.data);
  } catch (error) {
    console.error("Error recording attendance:", error);
  }
};

const toggleStatus = async (studentId, date, currentStatus) => {
  let newStatus = currentStatus;

  if (currentStatus === "Vắng có phép") {
    newStatus = "Hỗ trợ";
  } else if (currentStatus === "Hỗ trợ") {
    newStatus = "Vắng có phép";
  }

  console.log("New Status:", newStatus);

  try {
    const response = await axios.post(`/api/admin/studentclass/changestatus/${classcode}`, {
      studentId: studentId,
      date: new Date(date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
      status: newStatus,
    });

    console.log("Status toggled successfully:", response.data);
    showToast("Trạng thái đã được thay đổi");

    const attendanceDetailsResponse = await axios.get(`/api/admin/studentclass/dateattendance/detail/${classcode}`);
    setAttendanceDetails(attendanceDetailsResponse.data);
    console.log("Attendance details reloaded successfully:", attendanceDetailsResponse.data);
  } catch (error) {
    console.error("Error toggling status:", error);
  }
};
const countTotalDateColumns = () => {
  return attendanceDates.length;
};

const countAttendanceForStudent = (studentID) => {
    return attendanceCounts[studentID] || 0; // Use API data or default to 0
  };

  
// const countExcusedAbsencesForStudent = (studentID) => {
//   return attendanceDetails.filter(record => record.studentID === studentID && record.status === "Vắng có phép").length;
// };
const countExcusedAbsencesForStudent = (studentID) => {
  return excusedAbsenceCounts[studentID] || 0;
};


const handleQrCodeClick = () => {
  setIsZoomed(true);
};

const handleCloseModal = () => {
  setIsZoomed(false);
};

return (
  <div>
    <section className="content-header">
      <div className="container-fluid">
        <div className="row mb-2">
          <div className="col-sm-6">
            <h1>Danh sách điểm danh</h1>
          </div>
          <div className="col-sm-6">
            <ol className="breadcrumb float-sm-right">
              <li className="breadcrumb-item">
                <b><Link to='/admin/home' style={{color: '#6B63FF'}}>Trang chủ</Link></b>
              </li>
              <li className="breadcrumb-item">
                <b><Link to='/admin/tkb' style={{color: '#6B63FF'}}>Thời khóa biểu</Link></b>
              </li>
              <li className="breadcrumb-item active">Danh sách điểm danh</li>
            </ol>
          </div>
        </div>
      </div>
    </section>
    <section className="content">
      <div className="card">
      <div className="card-header">
          <h3 className="card-title" style={{ lineHeight: '1.6' }}>
            <strong>{classcode} ({subjectInfo.subjectName})<br /></strong>
            <strong>Học kỳ:</strong> {subjectInfo.term}<br />
            <strong>Loại lớp:</strong> {mapClassType(subjectInfo.classType)}<br />
            <strong>Số tín chỉ:</strong> {subjectInfo.credit}<br />
            <strong>Ngành:</strong> {subjectInfo.majorName}
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <strong>Tiết:</strong>
              {subjectInfo.lesson.map(lesson => (
                <div key={lesson} style={{ margin: '0 5px' }}>
                  {mapLesson(lesson)}
                </div>
              ))}
            </div>             
            <strong>Ngày học:</strong> {subjectInfo.schoolDay}<br />
            <strong>Tên GV:</strong> {subjectInfo.teacherName}<br />
            <strong>Email GV:</strong> {subjectInfo.teacherEmail}<br />
          </h3>
          <div className="card-tools">
      <div className="input-group input-group-sm">
      {selectedDate && (
      <div style={{ textAlign: 'center', margin: '10px 0',fontSize:'19px' }}>
        <p>Ngày: {formatDate(selectedDate)}</p> {/* Hiển thị ngày đã chọn */}
        {/* {qrCodeValue && (
          <div>
            <img src={qrCodeValue} alt="QR Code" width="200" height="200" style={{marginTop:'-15px'}}/>
            <p>QR code sẽ thay đổi trong: {countdown} giây</p>
          </div>
        )} */}
        {qrCodeValue && (
                      <div>
                        <img
                          src={qrCodeValue}
                          alt="QR Code"
                          width="200"
                          height="200"
                          style={{ marginTop: '-15px' }}
                          onClick={handleQrCodeClick}
                        />
                        <p>QR code sẽ thay đổi trong: {countdown} giây</p>
                      </div>
                    )}
        {scanSuccess && (
          <Link to='/admin/test1'>Go to Test1</Link>
        )}
      </div>
    )}
      </div>
    </div>
        </div>
        <div className="card-header" style={{ display: 'flex', flexDirection: 'column' }}>
  {/* Hàng 1: Lưu ý bên trái - Ngày đã qua, Hôm nay, Ngày chưa đến bên phải */}
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <h3 className="card-title" style={{ marginBottom: '0' }}>
      <IonIcon name="pencil-outline" style={{ fontSize: '20px', marginRight: '5px' }} />
      Lưu ý:
    </h3>

    <div className="d-flex flex-row" style={{ fontSize: '17.6px' }}>
      <span className="mr-3">
        <i className="fas fa-square text-gray"></i> Ngày đã qua
      </span>
      <span className="mr-3">
        <i className="fas fa-square pink" style={{ color: '#da2864' }}></i> Hôm nay
      </span>
      <span className="mr-3">
        <i className="fas fa-square text-violet" style={{ color: '#9400d3' }}></i> Ngày chưa đến
      </span>
    </div>
  </div>

  {/* Hàng 2: Danh sách gạch đầu dòng */}
  <ul style={{ listStyleType: 'none', paddingLeft: '25px', margin: '5px 0 0 25px' }}>
    <li>- GV click vào biểu tượng QR để hiển thị hình QR cho buổi điểm danh</li>
    <li>- GV có thể click vào hình QR code để phóng to</li>
    <li>- GV có thể điểm danh giúp SV bằng cách click vào nút "Điểm danh" và có thể click vào chữ "Hỗ trợ" để chuyển trạng thái thành "Vắng có phép" và ngược lại</li>
  </ul>
</div>

        <div className="card-header">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 'none' }}>
<div className="card-tools" style={{ flex: 1 }}>
  <div className="input-group input-group-sm" style={{ width: '250px' }}>
    <input
      type="text"
      className="form-control float-left"
      placeholder="Tìm kiếm"
      value={searchKeyword}
      onChange={handleSearchChange}
    />
    <div className="input-group-append">
      <button type="submit" className="btn btn-default">
        <i className="fas fa-search"></i>
      </button>
    </div>
  </div>
</div>
<div className="input-group input-group-sm" style={{ width: '110px', marginLeft: 'auto' ,order: 2}}>
  <div className="input-group-append">
    
    <button
      type="button"
      className="btn btn-success text-nowrap"
      style={{ backgroundColor: '#009900', borderColor: '#009900', color: '#ffffff', borderRadius: '4px', marginLeft: '10px',fontSize:'17px' }}
      onClick={() => handleExportAttendance(classcode)}
      >
      <i className="nav-icon fas fa-file-excel"></i> Xuất Excel
    </button>
  </div>
</div>
<div className="input-group input-group-sm" style={{ width: '110px', marginLeft: 'auto' }}>
  <div className="input-group-append">
    
    <Link
    to={`/admin/classsections/detail/${classcode}`}
      className="btn btn-success text-nowrap"
      style={{ backgroundColor: '#6b63ff', borderColor: '#6b63ff', color: '#ffffff', borderRadius: '4px', marginLeft: '10px',fontSize:'17px' }}
      >
       + Thêm SV
    </Link>
  </div>
</div>
</div>
</div>
<div className="card-body table-responsive p-0">
  <table className="table table-hover text-nowrap" style={{ borderCollapse: 'collapse', width: '100%' }}>
    <thead>
      <tr>
      <th style={{ position: 'sticky', left: 0, background: 'white', zIndex: 2, textAlign: 'center', width: '50px' }}>STT</th>
      <th style={{ position: 'sticky', left: '65px', background: 'white', zIndex: 2, textAlign: 'center', width: '100px' }}>Mã số SV</th>
      <th style={{ position: 'sticky', left: '200px', background: 'white', zIndex: 2, textAlign: 'center', width: '200px' }}>Họ tên</th>
      <th style={{ position: 'sticky', left: '430px', background: 'white', zIndex: 2, textAlign: 'center', width: '150px' }}>
  Số buổi<br />tham dự
</th>
      <th style={{ position: 'sticky', left: '540px', background: 'white', zIndex: 2, textAlign: 'center', width: '150px' }}>Số buổi  <br/>VCP</th>


        {attendanceDates.map((date, index) => (
          <th key={index} onClick={() => handleDateClick(date)} style={{ textAlign: 'center', minWidth: '120px' }}>
            {new Date(date).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            })}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '5px' }}>
              <IonIcon name="qr-code-outline" style={{ fontSize: '20px', height: '1em', width: '1.3em' }} />
            </div>
          </th>
        ))}
        
      </tr>
    </thead>
    <tbody>
      {currentClassSections.map((section, index) => (
        <tr key={section._id}>
          <td style={{ position: 'sticky', left: 0, background: 'white', zIndex: 1, textAlign: 'center' }}>
            {offset + index + 1}
          </td>
          <td style={{ position: 'sticky', left: '65px', background: 'white', zIndex: 1, textAlign: 'center' }}>
            {section.userCode || 'Chưa cập nhật'}
          </td>
          <td style={{ position: 'sticky', left: '200px', background: 'white', zIndex: 1, textAlign: 'center' }}>
            {section.fullName || section.displayName || 'Chưa cập nhật'}
          </td>
          <td style={{ textAlign: 'center', minWidth: '120px',position: 'sticky', background: 'white', zIndex: 1,left: '430px' }}>
                  {countAttendanceForStudent(section._id)}/{countTotalDateColumns()}
                </td>
                <td style={{ textAlign: 'center', minWidth: '120px',position: 'sticky', background: 'white', zIndex: 1,left: '540px'  }}>
                  {countExcusedAbsencesForStudent(section._id)}
                </td>

          {attendanceDates.map((date, dateIndex) => {
            const attendanceRecord = attendanceDetails.find(
              (record) =>
                record.studentID === section._id &&
                new Date(record.date).toLocaleDateString() === new Date(date).toLocaleDateString()
            );

            return (
              <td key={dateIndex} style={{ textAlign: 'center', verticalAlign: 'middle' }}>
  {attendanceRecord ? (
    <>
      {attendanceRecord.time ? (
        // <>
        //   {attendanceRecord.time}
        //   <br />
        //   {attendanceRecord.status === "Vắng có phép" || attendanceRecord.status === "Hỗ trợ" ? (
        //     <span
        //       onClick={() => toggleStatus(section._id, date, attendanceRecord.status)}
        //       style={{ cursor: 'pointer', color: '#da2864' }}
        //     >
        //       {attendanceRecord.status || ""}
        //     </span>
        //   ) : (
        //     <span>{attendanceRecord.status || ""}</span>
        //   )}
        // </>
        <>
        {attendanceRecord.time}
        <br />
        {attendanceRecord.status === "Vắng có phép" || attendanceRecord.status === "Hỗ trợ" ? (
          <span
            onClick={() => toggleStatus(section._id, date, attendanceRecord.status)}
            style={{
              cursor: 'pointer',
              color: attendanceRecord.status === "Vắng có phép" ? '#FF8C00' : '#da2864'
            }}
          >
            {attendanceRecord.status || ""}
          </span>
        ) : (
          <span>{attendanceRecord.status || ""}</span>
        )}
      </>
      ) : (
        <button
          onClick={() => handleAttendanceClick(section._id, date)}
          style={{
            backgroundColor:
              new Date(date).toDateString() === new Date().toDateString()
                ? '#da2864'
                : new Date(date) < new Date()
                ? '#808080'
                : '#9400D3',
            borderColor:
              new Date(date).toDateString() === new Date().toDateString()
                ? '#da2864'
                : new Date(date) < new Date()
                ? '#808080'
                : '#9400D3',
            color: '#ffffff',
            borderRadius: '4px',
            padding: '6px 10px',
            cursor: 'pointer',
            fontSize: '14px',
            width: '100px'
          }}
        >
          Điểm danh
        </button>
      )}
    </>
  ) : (
    ""
  )}
</td>
            );
          })}
          
        </tr>
      ))}
      {currentClassSections.length === 0 && (
        <tr>
          <td colSpan="5" className="text-center">Chưa có sinh viên nào</td>
        </tr>
      )}
    </tbody>
  </table>
</div>

        <div className="pagination-container"
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              margin: '20px 0',
            }}
          >
            <ReactPaginate
              previousLabel={<span style={{ fontSize: "16px" }}>‹</span>}
              nextLabel={<span style={{ fontSize: "16px" }}>›</span>}
              breakLabel={'...'}
              breakClassName={'break-me'}
              pageCount={Math.ceil(filteredClassSections.length / sectionsPerPage)}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageClick}
              containerClassName={'pagination'}
              subContainerClassName={'pages pagination'}
              activeClassName={'active'}
            />
          </div>
      </div>
    <ToastContainer />
    </section>
     {showModalProfile && selectedUser && (
<div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title">Thông tin sinh viên</h5>
        <button type="button" className="close" onClick={() => setShowModalProfile(false)}>
          <span>&times;</span>
        </button>
      </div>
      <div className="modal-body">
        <p><strong>Mã số SV:</strong> {selectedUser.userCode || 'Chưa cập nhật'}</p>
        <p><strong>Email:</strong> {selectedUser.email}</p>
        <p><strong>Họ tên:</strong> {selectedUser.fullName || selectedUser.displayName || 'Chưa cập nhật'}</p>
        <p><strong>SĐT:</strong> {selectedUser.phone || 'Chưa cập nhật'}</p>
      </div>
      <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
        <button type="button" className="btn btn-secondary" onClick={() => setShowModalProfile(false)}>Đóng</button>
      </div>
    </div>
  </div>
</div>
)}
{isZoomed && (
        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.7)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title"><b></b>Mã QR được phóng to</h5>
                <button type="button" className="close" onClick={handleCloseModal}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <h4 style={{ textAlign:'center' }}>{formatDate(selectedDate)}</h4>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <img src={qrCodeValue} alt="Zoomed QR Code" style={{ width: '450px', height: '450px' }} />
                </div>
                <h4 style={{ textAlign:'center' }}>{countdown}</h4>
              </div>
            </div>
          </div>
        </div>
      )}
  </div>
);
};

export default Attendance;