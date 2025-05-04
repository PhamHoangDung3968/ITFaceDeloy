import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { v4 as uuidv4 } from 'uuid';
import IonIcon from '@reacticons/ionicons';
import '../dist/css/pagination.css';
import '../dist/css/buttonIcon.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  const [countdown, setCountdown] = useState(10);
  // const [countdown, setCountdown] = useState(5);
  const [attendanceCounts, setAttendanceCounts] = useState({});
  const [excusedAbsenceCounts, setExcusedAbsenceCounts] = useState({});
  const [showStudentListModal, setShowStudentListModal] = useState(false); // New state for modal
  const [studentListData, setStudentListData] = useState([]); // New state for API data
  const [absenceStart, setAbsenceStart] = useState('');
  const [absenceEnd, setAbsenceEnd] = useState('');
  const [filteredStudentList, setFilteredStudentList] = useState([]);
  const [totalPossibleAbsences, setTotalPossibleAbsences] = useState(0); // Để giới hạn số lượng option trong dropdown
  const [studentListCurrentPage, setStudentListCurrentPage] = useState(0);
  const studentsPerPage = 20; // Số dòng trên mỗi trang
  const [selectedStudents, setSelectedStudents] = useState({}); // Lưu trữ trạng thái checkbox của sinh viên
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [studentsToRemind, setStudentsToRemind] = useState([]);
  const [showStudentListDetails, setShowStudentListDetails] = useState(false);
  const [remindLoading, setRemindLoading] = useState(false); // State để kiểm soát hiển thị loading

  const [isZoomed, setIsZoomed] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: null, // 'attendance' or null
    direction: null, // 'ascending' or 'descending' or null
  });

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
      setClassSections(response.data);

      const subjectResponse = await axios.get(`/api/admin/studentclass/allvalue/${classcode}`);
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
      setCountdown(10);
      // setCountdown(5);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };
//checkall
const handleCheckAll = (isChecked) => {
  const newSelected = {};
  currentStudents.forEach(student => {
    newSelected[student._id] = isChecked;
  });
  setSelectedStudents(newSelected);
};


  const fetchQrCode = async () => {
    try {
      const response = await axios.get(`/api/admin/generate/${classcode}/${formatDate(selectedDate)}/qr`, {
        params: { url: defaultUrl }
      });

      setToken(response.data.token);
      setQrCodeValue(response.data.qrCodeImage);
      setCountdown(10);
      // setCountdown(5);
    } catch (error) {
      console.error('Error fetching QR code:', error);
    }
  };

  useEffect(() => {
    if (token) {
      const interval = setInterval(fetchQrCode, 10000);
      // const interval = setInterval(fetchQrCode, 5000);
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
  
  // useEffect(() => {
  //   const fetchAttendanceCounts = async () => {
  //     try {
  //       const response = await axios.get(`/api/admin/studentclass/dateattendance/detail/count/${classcode}`);
  //       setAttendanceCounts(response.data.timeCountByStudentID);
  //       setExcusedAbsenceCounts(response.data.statusCountByStudentID);
  //     } catch (error) {
  //       console.error('Error fetching attendance counts:', error);
  //     }
  //   };
  //   fetchAttendanceCounts();
  // }, [classcode, attendanceDetails]); // Thêm attendanceDetails làm dependency


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

const handleExportAttendance = async (classcode) => {
  setRemindLoading(true); // Bắt đầu hiệu ứng loading
  try {
    const response = await axios({
      url: `/api/admin/export-attendance/${classcode}`,
      method: 'GET',
      responseType: 'blob', // Important to handle binary data
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `attendance_${classcode}.xlsx`); // Set the file name
    document.body.appendChild(link);
    link.click();
    link.remove();

    showToast("Xuất file điểm danh thành công!");
  } catch (error) {
    console.error('Error downloading the file:', error);
    showErrorToast("Lỗi khi xuất file điểm danh!");
  } finally {
    setRemindLoading(false); // Kết thúc hiệu ứng loading
  }
};


const handleAttendanceClick = async (studentId, date) => {
  const formattedDate = new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
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

  try {
    const response = await axios.post(`/api/admin/studentclass/dateattendancing/${classcode}`, {
      studentId: studentId,
      date: formattedDate,
      status: status,
    });

    showToast("Điểm danh thành công");

    const attendanceDetailsResponse = await axios.get(`/api/admin/studentclass/dateattendance/detail/${classcode}`);
    setAttendanceDetails(attendanceDetailsResponse.data);
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

    showToast("Trạng thái đã được thay đổi");

    const attendanceDetailsResponse = await axios.get(`/api/admin/studentclass/dateattendance/detail/${classcode}`);
    setAttendanceDetails(attendanceDetailsResponse.data);
  } catch (error) {
    console.error("Error toggling status:", error);
  }
};
const countTotalDateColumns = () => {
  return attendanceDates.length;
};

// const countAttendanceForStudent = (studentID) => {
//     return attendanceCounts[studentID] || 0; // Use API data or default to 0
//   };
const countAttendanceForStudent = (studentID) => {
  return attendanceDetails.filter(record => 
    record.studentID === studentID && 
    (record.status === "Vắng có phép" || record.status === "Có mặt" || record.status === "Hỗ trợ")
  ).length;
};

  
const countExcusedAbsencesForStudent = (studentID) => {
  return attendanceDetails.filter(record => record.studentID === studentID && record.status === "Vắng có phép").length;
};
// const countExcusedAbsencesForStudent = (studentID) => {
//   return excusedAbsenceCounts[studentID] || 0;
// };


const handleQrCodeClick = () => {
  setIsZoomed(true);
};

const handleCloseModal = () => {
  setIsZoomed(false);
};

const handleIncrementNotification = async (studentId, classcode, studentEmail, subjectName) => {
  setRemindLoading(true); // Bắt đầu hiệu ứng loading
  try {
    // Gọi API để tăng số lượng thông báo
    await axios.post(`/api/admin/studentclass/dateattendancing/warning/${classcode}`, {
      studentId: studentId,
    });

    // Gọi API để gửi email nhắc nhở
    await axios.post("/api/admin/send-email/warning", {
      emails: [studentEmail], // Đảm bảo gửi email dưới dạng mảng
      classcode: classcode,
      subjectName: subjectName,
    });

    showToast("Nhắc nhở và email đã được gửi thành công!");
    apiGetClassSections(); // Gọi lại hàm lấy danh sách lớp học nếu cần cập nhật giao diện
  } catch (error) {
    console.error("Lỗi tăng số lượng thông báo hoặc gửi email:", error);
    showErrorToast("Nhắc nhở thất bại!");
  } finally {
    setRemindLoading(false); // Kết thúc hiệu ứng loading
  }
};


const sortedClassSections = [...currentClassSections].sort((a, b) => {
  if (sortConfig.key === 'attendance') {
    const countA = countAttendanceForStudent(a._id);
    const countB = countAttendanceForStudent(b._id);

    if (countA < countB) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (countA > countB) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  }
  return 0; // No sorting if sortConfig.key is not 'attendance'
});
const requestSort = (key) => {
  let direction = 'ascending';
  if (sortConfig.key === key && sortConfig.direction === 'ascending') {
    direction = 'descending';
  }
  setSortConfig({ key, direction });
};
// New function to fetch and show student list
const fetchStudentList = async () => {
  try {
      const response = await axios.get(`/api/admin/studentclass/allstudent/${classcode}`);
      const totalAttendanceDates = countTotalDateColumns();
      const studentDataWithAbsences = response.data.map(student => ({
          ...student,
          absenceCount: totalAttendanceDates - countAttendanceForStudent(student._id),
      }));
      setStudentListData(studentDataWithAbsences);
      setFilteredStudentList(studentDataWithAbsences); // Khởi tạo filtered list với toàn bộ dữ liệu
      setShowStudentListModal(true);
      setAbsenceStart(''); // Reset giá trị dropdown khi mở modal
      setAbsenceEnd('');   // Reset giá trị dropdown khi mở modal
  } catch (error) {
      console.error('Error fetching student list:', error);
      showErrorToast('Lỗi khi lấy danh sách sinh viên');
  }
};
useEffect(() => {
  setTotalPossibleAbsences(countTotalDateColumns());
}, [attendanceDates]);
const handleAbsenceStartChange = (event) => {
  const value = event.target.value;
  setAbsenceStart(value);
  if (absenceEnd && parseInt(value, 10) > parseInt(absenceEnd, 10)) {
      showErrorToast('Số buổi bắt đầu không được lớn hơn số buổi kết thúc'); // Show error toast
  }
};
const handleAbsenceEndChange = (event) => {
  const value = event.target.value;
  setAbsenceEnd(value);
  if (absenceStart && parseInt(value, 10) < parseInt(absenceStart, 10)) {
      showErrorToast('Số buổi kết thúc không được nhỏ hơn số buổi bắt đầu'); // Show error toast
  }
};

useEffect(() => {
  if (studentListData.length > 0) {
      const start = parseInt(absenceStart, 10) || 0;
      const end = parseInt(absenceEnd, 10) || totalPossibleAbsences;

      const filtered = studentListData.filter(student => {
          const absenceCount = student.absenceCount;
          return absenceCount >= start && absenceCount <= end;
      });
      setFilteredStudentList(filtered);
  } else {
      setFilteredStudentList([]);
  }
}, [studentListData, absenceStart, absenceEnd, totalPossibleAbsences]);



const handleStudentListPageChange = (event) => {
  setStudentListCurrentPage(event.selected);
};
const indexOfLastStudent = (studentListCurrentPage + 1) * studentsPerPage;
const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
const currentStudents = filteredStudentList.slice(indexOfFirstStudent, indexOfLastStudent);
const pageCount = Math.ceil(filteredStudentList.length / studentsPerPage);






const handleCheckboxChange = (studentId) => {
  setSelectedStudents(prev => ({
      ...prev,
      [studentId]: !prev[studentId],
  }));
};


const handleRemindStudents = () => {
  const selectedIds = Object.keys(selectedStudents).filter(id => selectedStudents[id]);
  if (selectedIds.length > 0) {
      const selectedNames = studentListData
          .filter(student => selectedIds.includes(student._id))
          .map(student => student.fullName || student.displayName);
      setStudentsToRemind(selectedNames);
      setShowReminderModal(true);
  } else {
      showErrorToast('Vui lòng chọn ít nhất một sinh viên để nhắc nhở.');
  }
};
const handleCloseReminderModal = () => {
  setShowReminderModal(false);
  setStudentsToRemind([]);
  setSelectedStudents({}); // Reset checkbox sau khi đóng modal nhắc nhở (tùy chọn)
};

const handleSendReminder = async () => {
  const selectedIds = Object.keys(selectedStudents).filter(id => selectedStudents[id]);

  if (selectedIds.length > 0) {
      setRemindLoading(true); // Bỏ comment nếu bạn muốn sử dụng loading state
      try {
          const studentEmails = studentListData
              .filter(student => selectedIds.includes(student._id) && student.email)
              .map(student => student.email);

          if (studentEmails.length > 0) {
              let allEmailsSentSuccessfully = true;
              const emailSendErrors = {};

              // Gửi thông báo qua API cho từng sinh viên
              for (const studentId of selectedIds) {
                  try {
                      await axios.post(`/api/admin/studentclass/dateattendancing/warning/${classcode}`, {
                          studentId: studentId,
                      });
                  } catch (error) {
                      allEmailsSentSuccessfully = false;
                      emailSendErrors[studentId] = error.message;
                  }
              }

              // Gửi email nhắc nhở cho từng sinh viên
              for (const email of studentEmails) {
                  try {
                      await axios.post("/api/admin/send-email/warning", {
                          emails: [email], // Gửi từng email một
                          classcode: classcode,
                          subjectName: subjectInfo?.subjectName || "",
                      });
                  } catch (error) {
                      allEmailsSentSuccessfully = false;
                      emailSendErrors[email] = error.message;
                  }
              }

              if (allEmailsSentSuccessfully) {
                  showToast("Đã gửi email nhắc nhở cho tất cả sinh viên đã chọn!");
                  apiGetClassSections(); 
              } else {
                  showErrorToast("Một số email nhắc nhở hoặc thông báo có thể chưa được gửi thành công. Vui lòng kiểm tra lại.");
                  console.error("Chi tiết lỗi gửi email và thông báo:", emailSendErrors);
              }

              handleCloseReminderModal();
          } else {
              showErrorToast("Không tìm thấy địa chỉ email cho các sinh viên đã chọn.");
          }
      } catch (error) {
          console.error("Lỗi tổng quan khi gửi nhắc nhở:", error);
          showErrorToast("Gửi nhắc nhở thất bại!");
      } finally {
          setRemindLoading(false);
      }
  } else {
      showErrorToast("Vui lòng chọn ít nhất một sinh viên để gửi nhắc nhở.");
  }
};

const styles = {
  loadingOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
  },
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
    <li>- GV click vào "Số buổi tham dự" để lọc ra các SV vắng học nhiều nhất và ngược lại</li>
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
<div className="input-group input-group-sm" style={{ width: '113px', marginLeft: '10px' }}>
    <div className="input-group-append">
        <button
            type="button"
            className="btn btn-info text-nowrap"
            style={{ borderRadius: '4px', fontSize: '17px' }}
            onClick={fetchStudentList}
        >
            <i class="fas fa-bullhorn"></i> Nhắc nhở
        </button>
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
      {/* <th style={{ position: 'sticky', left: '430px', background: 'white', zIndex: 2, textAlign: 'center', width: '150px' }}>
  Số buổi<br />tham dự
</th> */}
<th
       onClick={() => requestSort('attendance')}
       style={{
         position: 'sticky',
         left: '430px',
         background: 'white',
         zIndex: 2,
         textAlign: 'center',
         width: '150px',
         cursor: 'pointer', // Add cursor pointer
       }}
     >
       Số buổi<br />tham dự
       {sortConfig.key === 'attendance' && (
         <span>
           {sortConfig.direction === 'ascending' ? ' ▲' : ' ▼'}
         </span>
       )}
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
        <th>Nhắc nhở</th>
      </tr>
    </thead>
    <tbody>
      
      {sortedClassSections.map((section, index) => (
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
                 <td style={{ textAlign: 'center', position: 'relative' }}>
  <IonIcon
    name="notifications-outline"
    style={{ fontSize: '24px', cursor: 'pointer' }}
    onClick={() =>
      handleIncrementNotification(
        section._id,
        classcode,
        section.email,
        subjectInfo.subjectName
      )
    }  />
  <span style={{
    position: 'absolute',
    top: '10px',
    right: '40px',
    backgroundColor: 'red',
    color: 'white',
    borderRadius: '50%',
    padding: '2px 6px',
    fontSize: '12px',
    fontWeight: 'bold'
  }}>
    {section.numberNotifications || 0}
  </span>
</td>
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
      {showStudentListModal && (
    <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-lg">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">Danh sách toàn bộ sinh viên</h5>
                    <button type="button" className="close" onClick={() => setShowStudentListModal(false)}>
                        <span>&times;</span>
                    </button>
                </div>
                <div className="card-body">
  <style>
    {`
      .absence-filter-row {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 10px;
        white-space: nowrap;
      }

      .absence-filter-row .form-group {
        margin-bottom: 0;
        display: flex;
        align-items: center;
      }

      .absence-filter-row .form-group p {
        margin: 0 6px 0 0;
        font-weight: 500;
      }

      .absence-filter-row .form-control {
        min-width: 120px;
      }

      .absence-button {
        height: 38px;
        white-space: nowrap;
      }
    `}
  </style>

  <div className="absence-filter-row">
    <div className="form-group">
      <p>Vắng từ:</p>
      <select
        className="form-control select2"
        value={absenceStart}
        onChange={handleAbsenceStartChange}
      >
        <option value="">Chọn số buổi bắt đầu</option>
        {[...Array(totalPossibleAbsences).keys()].map(i => (
          <option key={i} value={i}>{i} buổi</option>
        ))}
      </select>
    </div>

    <div className="form-group">
      <p>đến</p>
      <select
        className="form-control select2"
        value={absenceEnd}
        onChange={handleAbsenceEndChange}
      >
        <option value="">Chọn số buổi kết thúc</option>
        {[...Array(totalPossibleAbsences).keys()].map(i => (
          <option key={i} value={i}>{i} buổi</option>
        ))}
      </select>
    </div>

    <button
      type="button"
      className="btn btn-primary absence-button"
      onClick={handleRemindStudents}
    >
      Nhắc nhở
    </button>
  </div>
</div>

                <div className="modal-body" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    <div className="table-responsive p-0">
                        <table className="table table-hover text-nowrap" style={{ borderCollapse: 'collapse', width: '100%' }}>
                            <thead>
                                <tr> 
                                <th style={{ textAlign: 'center', width: '50px' }}>
                                    {/* Check All checkbox */}
                                    <input
                                      type="checkbox"
                                      checked={currentStudents.length > 0 && currentStudents.every(student => selectedStudents[student._id])}
                                      onChange={(e) => handleCheckAll(e.target.checked)}
                                    />
                                  </th>
                                    <th style={{ textAlign: 'center', width: '50px' }}>STT</th>
                                    <th style={{ textAlign: 'center', width: '100px' }}>Mã số SV</th>
                                    <th style={{ textAlign: 'center', width: '200px' }}>Họ tên</th>
                                    <th style={{ textAlign: 'center' }}>Email</th>
                                    <th style={{ textAlign: 'center', width: '150px' }}>Số buổi vắng</th>
                                    {/* <th style={{ textAlign: 'center', width: '50px' }}></th> Checkbox column */}
                                    {/* Thêm các cột khác nếu cần */}
                                </tr>
                            </thead>
                            <tbody>
                                {currentStudents.map((student, index) => (
                                    <tr key={student._id}>
                                      <td style={{ textAlign: 'center' }}>
                                            <input
                                                type="checkbox"
                                                checked={selectedStudents[student._id] || false}
                                                onChange={() => handleCheckboxChange(student._id)}
                                            />
                                        </td>
                                        <td style={{ textAlign: 'center' }}>{indexOfFirstStudent + index + 1}</td>
                                        <td style={{ textAlign: 'center' }}>{student.userCode}</td>
                                        <td style={{ textAlign: 'center' }}>{student.fullName || student.displayName}</td>
                                        <td style={{ textAlign: 'center' }}>{student.email}</td>
                                        <td style={{ textAlign: 'center' }}>{student.absenceCount}</td>
                                        {/* <td style={{ textAlign: 'center' }}>
                                            <input
                                                type="checkbox"
                                                checked={selectedStudents[student._id] || false}
                                                onChange={() => handleCheckboxChange(student._id)}
                                            />
                                        </td> */}
                                        {/* Thêm dữ liệu cho các cột khác nếu cần */}
                                    </tr>
                                ))}
                                {filteredStudentList.length === 0 && (
                                    <tr><td colSpan="5" className="text-center">Không có dữ liệu</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                {filteredStudentList.length > studentsPerPage && (
                    <div className="modal-footer" style={{ justifyContent: 'center' }}>
                        <div
                            className="pagination-container"
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
                                pageCount={pageCount}
                                marginPagesDisplayed={2}
                                pageRangeDisplayed={5}
                                onPageChange={handleStudentListPageChange}
                                containerClassName={'pagination'}
                                subContainerClassName={'pages pagination'}
                                activeClassName={'active'}
                            />
                        </div>
                    </div>
                )}
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowStudentListModal(false)}>Đóng</button>
                </div>
            </div>
        </div>
    </div>
)}
{showReminderModal && (
    <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">Xác nhận nhắc nhở</h5>
                    <button type="button" className="close" onClick={handleCloseReminderModal}>
                        <span>&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                    <p>
                        Bạn có chắc chắn gửi nhắc nhở cho{' '}
                        <button
                            type="button"
                            className="btn btn-link p-0" style={{ color: 'red' }}
                            onClick={() => setShowStudentListDetails(!showStudentListDetails)}
                        >
                            {Object.keys(selectedStudents).filter(id => selectedStudents[id]).length} sinh viên 
                        </button>
                        {' '}này không?
                    </p>
                    {showStudentListDetails && (
                        <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px', marginTop: '10px' }}>
                            <ul>
                                {studentListData
                                    .filter(student => selectedStudents[student._id])
                                    .map(student => (
                                        <li key={student._id}>
                                            {student.userCode} - {student.fullName || student.displayName}
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    )}
                    {/* Thêm nội dung hoặc form nhắc nhở nếu cần */}
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-primary" onClick={handleSendReminder}>Gửi nhắc nhở</button>
                    <button type="button" className="btn btn-secondary" onClick={handleCloseReminderModal}>Đóng</button>
                </div>
            </div>
        </div>
    </div>
)}
{remindLoading  && (
          <div style={styles.loadingOverlay}>
            <div aria-label="Orange and tan hamster running in a metal wheel" role="img" className="wheel-and-hamster">
              <div className="wheel"></div>
              <div className="hamster">
                <div className="hamster__body">
                  <div className="hamster__head">
                    <div className="hamster__ear"></div>
                    <div className="hamster__eye"></div>
                    <div className="hamster__nose"></div>
                  </div>
                  <div className="hamster__limb hamster__limb--fr"></div>
                  <div className="hamster__limb hamster__limb--fl"></div>
                  <div className="hamster__limb hamster__limb--br"></div>
                  <div className="hamster__limb hamster__limb--bl"></div>
                  <div className="hamster__tail"></div>
                </div>
              </div>
              <div className="spoke"></div>
            </div>
          </div>
        )}
        <style jsx>{`
          /* From Uiverse.io by KSAplay */ 
          /* From Uiverse.io by Nawsome */ 
          .scrollable-modal-body {
  max-height: 400px; /* Adjust the height as needed */
  overflow-y: auto;
}
          .wheel-and-hamster {
            --dur: 1s;
            position: relative;
            width: 12em;
            height: 12em;
            font-size: 14px;
          }

          .wheel,
          .hamster,
          .hamster div,
          .spoke {
            position: absolute;
          }

          .wheel,
          .spoke {
            border-radius: 50%;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
          }

          .wheel {
            background: radial-gradient(100% 100% at center,hsla(0,0%,60%,0) 47.8%,hsl(0,0%,60%) 48%);
            z-index: 2;
          }

          .hamster {
            animation: hamster var(--dur) ease-in-out infinite;
            top: 50%;
            left: calc(50% - 3.5em);
            width: 7em;
            height: 3.75em;
            transform: rotate(4deg) translate(-0.8em,1.85em);
            transform-origin: 50% 0;
            z-index: 1;
          }

          .hamster__head {
            animation: hamsterHead var(--dur) ease-in-out infinite;
            background: hsl(30,90%,55%);
            border-radius: 70% 30% 0 100% / 40% 25% 25% 60%;
            box-shadow: 0 -0.25em 0 hsl(30,90%,80%) inset,
              0.75em -1.55em 0 hsl(30,90%,90%) inset;
            top: 0;
            left: -2em;
            width: 2.75em;
            height: 2.5em;
            transform-origin: 100% 50%;
          }

          .hamster__ear {
            animation: hamsterEar var(--dur) ease-in-out infinite;
            background: hsl(0,90%,85%);
            border-radius: 50%;
            box-shadow: -0.25em 0 hsl(30,90%,55%) inset;
            top: -0.25em;
            right: -0.25em;
            width: 0.75em;
            height: 0.75em;
            transform-origin: 50% 75%;
          }

          .hamster__eye {
            animation: hamsterEye var(--dur) linear infinite;
            background-color: hsl(0,0%,0%);
            border-radius: 50%;
            top: 0.375em;
            left: 1.25em;
            width: 0.5em;
            height: 0.5em;
          }

          .hamster__nose {
            background: hsl(0,90%,75%);
            border-radius: 35% 65% 85% 15% / 70% 50% 50% 30%;
            top: 0.75em;
            left: 0;
            width: 0.2em;
            height: 0.25em;
          }

          .hamster__body {
            animation: hamsterBody var(--dur) ease-in-out infinite;
            background: hsl(30,90%,90%);
            border-radius: 50% 30% 50% 30% / 15% 60% 40% 40%;
            box-shadow: 0.1em 0.75em 0 hsl(30,90%,55%) inset,
              0.15em -0.5em 0 hsl(30,90%,80%) inset;
            top: 0.25em;
            left: 2em;
            width: 4.5em;
            height: 3em;
            transform-origin: 17% 50%;
            transform-style: preserve-3d;
          }

          .hamster__limb--fr,
          .hamster__limb--fl {
            clip-path: polygon(0 0,100% 0,70% 80%,60% 100%,0% 100%,40% 80%);
            top: 2em;
            left: 0.5em;
            width: 1em;
            height: 1.5em;
            transform-origin: 50% 0;
          }

          .hamster__limb--fr {
            animation: hamsterFRLimb var(--dur) linear infinite;
            background: linear-gradient(hsl(30,90%,80%) 80%,hsl(0,90%,75%) 80%);
            transform: rotate(15deg) translateZ(-1px);
          }

          .hamster__limb--fl {
            animation: hamsterFLLimb var(--dur) linear infinite;
            background: linear-gradient(hsl(30,90%,90%) 80%,hsl(0,90%,85%) 80%);
            transform: rotate(15deg);
          }

          .hamster__limb--br,
          .hamster__limb--bl {
            border-radius: 0.75em 0.75em 0 0;
            clip-path: polygon(0 0,100% 0,100% 30%,70% 90%,70% 100%,30% 100%,40% 90%,0% 30%);
            top: 1em;
            left: 2.8em;
            width: 1.5em;
            height: 2.5em;
            transform-origin: 50% 30%;
          }

          .hamster__limb--br {
            animation: hamsterBRLimb var(--dur) linear infinite;
            background: linear-gradient(hsl(30,90%,80%) 90%,hsl(0,90%,75%) 90%);
            transform: rotate(-25deg) translateZ(-1px);
          }

          .hamster__limb--bl {
            animation: hamsterBLLimb var(--dur) linear infinite;
            background: linear-gradient(hsl(30,90%,90%) 90%,hsl(0,90%,85%) 90%);
            transform: rotate(-25deg);
          }

          .hamster__tail {
            animation: hamsterTail var(--dur) linear infinite;
            background: hsl(0,90%,85%);
            border-radius: 0.25em 50% 50% 0.25em;
            box-shadow: 0 -0.2em 0 hsl(0,90%,75%) inset;
            top: 1.5em;
            right: -0.5em;
            width: 1em;
            height: 0.5em;
            transform: rotate(30deg) translateZ(-1px);
            transform-origin: 0.25em 0.25em;
          }

          .spoke {
            animation: spoke var(--dur) linear infinite;
            background: radial-gradient(100% 100% at center,hsl(0,0%,60%) 4.8%,hsla(0,0%,60%,0) 5%),
              linear-gradient(hsla(0,0%,55%,0) 46.9%,hsl(0,0%,65%) 47% 52.9%,hsla(0,0%,65%,0) 53%) 50% 50% / 99% 99% no-repeat;
          }

          /* Animations */
          @keyframes hamster {
            from, to {
              transform: rotate(4deg) translate(-0.8em,1.85em);
            }

            50% {
              transform: rotate(0) translate(-0.8em,1.85em);
            }
          }

          @keyframes hamsterHead {
            from, 25%, 50%, 75%, to {
              transform: rotate(0);
            }

            12.5%, 37.5%, 62.5%, 87.5% {
              transform: rotate(8deg);
            }
          }

          @keyframes hamsterEye {
            from, 90%, to {
              transform: scaleY(1);
            }

            95% {
              transform: scaleY(0);
            }
          }

          @keyframes hamsterEar {
            from, 25%, 50%, 75%, to {
              transform: rotate(0);
            }

            12.5%, 37.5%, 62.5%, 87.5% {
              transform: rotate(12deg);
            }
          }

          @keyframes hamsterBody {
            from, 25%, 50%, 75%, to {
              transform: rotate(0);
            }

            12.5%, 37.5%, 62.5%, 87.5% {
              transform: rotate(-2deg);
            }
          }

          @keyframes hamsterFRLimb {
            from, 25%, 50%, 75%, to {
              transform: rotate(50deg) translateZ(-1px);
            }

            12.5%, 37.5%, 62.5%, 87.5% {
              transform: rotate(-30deg) translateZ(-1px);
            }
          }

          @keyframes hamsterFLLimb {
            from, 25%, 50%, 75%, to {
              transform: rotate(-30deg);
            }

            12.5%, 37.5%, 62.5%, 87.5% {
              transform: rotate(50deg);
            }
          }

          @keyframes hamsterBRLimb {
            from, 25%, 50%, 75%, to {
              transform: rotate(-60deg) translateZ(-1px);
            }

            12.5%, 37.5%, 62.5%, 87.5% {
              transform: rotate(20deg) translateZ(-1px);
            }
          }

          @keyframes hamsterBLLimb {
            from, 25%, 50%, 75%, to {
              transform: rotate(20deg);
            }

            12.5%, 37.5%, 62.5%, 87.5% {
              transform: rotate(-60deg);
            }
          }

          @keyframes hamsterTail {
            from, 25%, 50%, 75%, to {
              transform: rotate(30deg) translateZ(-1px);
            }

            12.5%, 37.5%, 62.5%, 87.5% {
              transform: rotate(10deg) translateZ(-1px);
            }
          }

          @keyframes spoke {
            from {
              transform: rotate(0);
            }

            to {
              transform: rotate(-1turn);
            }
          }
        `}</style>
      
  </div>
);
};

export default Attendance;