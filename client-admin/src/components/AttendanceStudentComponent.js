// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import { Link, useParams } from 'react-router-dom';
// import ReactPaginate from 'react-paginate';
// import IonIcon from '@reacticons/ionicons';
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

// const AttendanceStudent = ({ userID }) => {
//   const [classcode, setClasscode] = useState('');
//   const [classSections, setClassSections] = useState([]);
//   const [subjectInfo, setSubjectInfo] = useState({ lesson: [] });
//   const [currentPage, setCurrentPage] = useState(0);
//   const [searchKeyword, setSearchKeyword] = useState('');
//   const sectionsPerPage = 50;
//   const [attendanceDates, setAttendanceDates] = useState([]);
//   const [attendanceDetails, setAttendanceDetails] = useState([]);


//   useEffect(() => {
//     const url = window.location.href;
//     const extractedClasscode = url.split('/').pop(); // Adjust this as needed
//     if (extractedClasscode) {
//       setClasscode(extractedClasscode);
//     } else {
//       console.error('Failed to extract classcode from URL');
//     }
//   }, []);

//   useEffect(() => {
//     console.log('Classcode:', classcode); // Log the classcode for debugging

//     if (classcode) {
//       apiGetClassSections();
//     }
//   }, [classcode]);

// useEffect(() => {
//     const fetchAttendanceData = async () => {
//       try {
//         const [datesResponse, detailsResponse] = await Promise.all([
//           axios.get(`/api/admin/studentclass/dateattendance-student/${classcode}/${userID}`),
//           axios.get(`/api/admin/studentclass/dateattendance-student/detail/${classcode}/${userID}`)
//         ]);
//         setAttendanceDates(datesResponse.data);
//         setAttendanceDetails(detailsResponse.data);
//       } catch (error) {
//         console.error('Error fetching attendance data:', error);
//       }
//     };

//     if (classcode && userID) {
//       fetchAttendanceData();
//     }
//   }, [classcode, userID]);
  
//   const apiGetClassSections = async () => {
//     try {
//       const response = await axios.get(`/api/admin/studentclass/onestudent/${classcode}/${userID}`);
//       console.log('All students response:', response.data); // Log the response for all students
//       setClassSections(response.data);
  
//       const subjectResponse = await axios.get(`/api/admin/studentclass/allvalue/${classcode}`);
//       console.log('Subject info response:', subjectResponse.data); // Log the response for subject info
//       setSubjectInfo(subjectResponse.data);
//     } catch (error) {
//       console.error('Error fetching class sections:', error);
//     }
//   };
  
//   const offset = currentPage * sectionsPerPage;
//   const filteredClassSections = classSections.filter(section =>
//     (section.displayName || '').toLowerCase().includes(searchKeyword.toLowerCase()) ||
//     (section.email || '').toLowerCase().includes(searchKeyword.toLowerCase()) ||
//     (section.fullName || '').toLowerCase().includes(searchKeyword.toLowerCase()) ||
//     (section.userCode || '').toLowerCase().includes(searchKeyword.toLowerCase())
//   );
//   const currentClassSections = filteredClassSections.slice(offset, offset + sectionsPerPage);

//   const mapLesson = (lesson) => {
//     switch (lesson) {
//       case 1:
//         return '1-3';
//       case 2:
//         return '4-6';
//       case 3:
//         return '7-9';
//       case 4:
//         return '10-12';
//       case 5:
//         return '13-15';
//       default:
//         return lesson;
//     }
//   };

//   const mapClassType = (classType) => {
//     return classType === 0 ? 'Lý thuyết' : 'Thực hành';
//   };
//   const countColumnsWithTime = () => {
//     let count = 0;
//     attendanceDetails.forEach(record => {
//       if (record.time) {
//         count++;
//       }
//     });
//     return count;
//   };
//   const countTotalDateColumns = () => {
//     return attendanceDates.length;
//   };

//   return (
//     <div>
//       <section className="content-header">
//         <div className="container-fluid">
//           <div className="row mb-2">
//             <div className="col-sm-6">
//               <h1>Danh sách điểm danh</h1>
//             </div>
//             <div className="col-sm-6">
//               <ol className="breadcrumb float-sm-right">
//                 <li className="breadcrumb-item">
//                   <b><Link to='/admin/home' style={{color: '#6B63FF'}}>Trang chủ</Link></b>
//                 </li>
//                 <li className="breadcrumb-item">
//                   <b><Link to='/admin/tkbstudent' style={{color: '#6B63FF'}}>Thời khóa biểu</Link></b>
//                 </li>
//                 <li className="breadcrumb-item active">Danh sách điểm danh</li>
//               </ol>
//             </div>
//           </div>
//         </div>
//       </section>
//       <section className="content">
//       <div className="card">
//   <div className="card-header">
//     <h3 className="card-title" style={{ lineHeight: '1.6' }}>
//       <strong>{classcode} ({subjectInfo.subjectName})<br /></strong>
//       <strong>Học kỳ:</strong> {subjectInfo.term}<br />
//       <strong>Loại lớp:</strong> {mapClassType(subjectInfo.classType)}<br />
//       <strong>Số tín chỉ:</strong> {subjectInfo.credit}<br />
//       <strong>Ngành:</strong> {subjectInfo.majorName}
//       <div style={{ display: 'flex', flexDirection: 'row' }}>
//         <strong>Tiết:</strong>
//         {subjectInfo.lesson.map(lesson => (
//           <div key={lesson} style={{ margin: '0 5px' }}>
//             {mapLesson(lesson)}
//           </div>
//         ))}
//       </div>
//       <strong>Ngày học:</strong> {subjectInfo.schoolDay}<br />
//       <strong>Tên GV:</strong> {subjectInfo.teacherName}<br />
//       <strong>Email GV:</strong> {subjectInfo.teacherEmail}<br />
//     </h3>
//   </div>
//   <div style={{ overflowX: 'auto', width: '100%' }}>
//     <table className="table table-hover text-nowrap" style={{ minWidth: '1200px', borderCollapse: 'collapse' }}>
//       <thead>
//         <tr>
//           <th style={{ position: 'sticky', left: 0, backgroundColor: '#fff', zIndex: 2, minWidth: '120px', textAlign: 'center' }}>Mã số SV</th>
//           <th style={{ position: 'sticky', left: '120px', backgroundColor: '#fff', zIndex: 2, minWidth: '200px', textAlign: 'center' }}>Họ tên</th>
//           {attendanceDates.map((date, index) => (
//             <th key={index} style={{ textAlign: 'center', minWidth: '120px' }}>
//               {new Date(date).toLocaleDateString('en-GB', {
//                 day: '2-digit',
//                 month: '2-digit',
//                 year: 'numeric'
//               })}
//             </th>
//           ))}
//         </tr>
//       </thead>
//       <tbody>
//         {currentClassSections.map((section) => (
//           <tr key={section._id}>
//             <td style={{ position: 'sticky', left: 0, backgroundColor: '#fff', zIndex: 3, minWidth: '120px', textAlign: 'center' }}>
//               {section.userCode || 'Chưa cập nhật'}
//             </td>
//             <td style={{ position: 'sticky', left: '120px', backgroundColor: '#fff', zIndex: 3, minWidth: '200px', textAlign: 'center' }}>
//               {section.fullName || section.displayName || 'Chưa cập nhật'}
//             </td>
//             {attendanceDates.map((date, dateIndex) => {
//               const attendanceRecord = attendanceDetails.find(
//                 (record) =>
//                   record.studentID === section._id &&
//                   new Date(record.date).toLocaleDateString() ===
//                     new Date(date).toLocaleDateString()
//               );
//               return (
//                 <td key={dateIndex} style={{ textAlign: 'center', minWidth: '120px' }}>
//                   {attendanceRecord ? (
//                     <>
//                       {attendanceRecord.time ? attendanceRecord.time : ""}{" "}
//                       <br />
//                       {attendanceRecord.status || ""}
//                     </>
//                   ) : (
//                     ""
//                   )}
//                 </td>
//               );
//             })}
//           </tr>
//         ))}
//         {currentClassSections.length === 0 && (
//           <tr>
//             <td colSpan="5" className="text-center">Chưa có sinh viên nào</td>
//           </tr>
//         )}
//       </tbody>
//     </table>
//   </div>
// </div>
// <div>
//           <strong>Số buổi tham dự:</strong> {countColumnsWithTime()}/{countTotalDateColumns()}
//         </div>
        

//       <ToastContainer />
//       </section>
       
//     </div>
//   );
// };

// export default AttendanceStudent;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AttendanceStudent = ({ userID }) => {
  const [classcode, setClasscode] = useState('');
  const [classSections, setClassSections] = useState([]);
  const [subjectInfo, setSubjectInfo] = useState({ lesson: [] });
  const [currentPage, setCurrentPage] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');
  const sectionsPerPage = 50;
  const [attendanceDates, setAttendanceDates] = useState([]);
  const [attendanceDetails, setAttendanceDetails] = useState([]);
  const [attendanceCount, setAttendanceCount] = useState({ totalTimes: {}, excusedAbsences: {} });

  useEffect(() => {
    const url = window.location.href;
    const extractedClasscode = url.split('/').pop(); // Adjust this as needed
    if (extractedClasscode) {
      setClasscode(extractedClasscode);
    } else {
      console.error('Failed to extract classcode from URL');
    }
  }, []);

  useEffect(() => {
    console.log('Classcode:', classcode); // Log the classcode for debugging

    if (classcode) {
      apiGetClassSections();
    }
  }, [classcode]);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const [datesResponse, detailsResponse] = await Promise.all([
          axios.get(`/api/admin/studentclass/dateattendance-student/${classcode}/${userID}`),
          axios.get(`/api/admin/studentclass/dateattendance-student/detail/${classcode}/${userID}`)
        ]);
        setAttendanceDates(datesResponse.data);
        setAttendanceDetails(detailsResponse.data);
      } catch (error) {
        console.error('Error fetching attendance data:', error);
      }
    };

    if (classcode && userID) {
      fetchAttendanceData();
    }
  }, [classcode, userID]);

  useEffect(() => {
    const fetchAttendanceCount = async () => {
      try {
        const response = await axios.get(`/api/admin/studentclass/dateattendance-student/detail/count/${classcode}/${userID}`);
        setAttendanceCount(response.data);
      } catch (error) {
        console.error('Error fetching attendance count:', error);
      }
    };

    if (classcode && userID) {
      fetchAttendanceCount();
    }
  }, [classcode, userID]);

  const apiGetClassSections = async () => {
    try {
      const response = await axios.get(`/api/admin/studentclass/onestudent/${classcode}/${userID}`);
      console.log('All students response:', response.data); // Log the response for all students
      setClassSections(response.data);

      const subjectResponse = await axios.get(`/api/admin/studentclass/allvalue/${classcode}`);
      console.log('Subject info response:', subjectResponse.data); // Log the response for subject info
      setSubjectInfo(subjectResponse.data);
    } catch (error) {
      console.error('Error fetching class sections:', error);
    }
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

  const countTotalDateColumns = () => {
    return attendanceDates.length;
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
                  <b><Link to='/admin/tkbstudent' style={{color: '#6B63FF'}}>Thời khóa biểu</Link></b>
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
          </div>
          <div style={{ overflowX: 'auto', width: '100%' }}>
            <table className="table table-hover text-nowrap" style={{ minWidth: '1200px', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{  minWidth: '120px', textAlign: 'center' }}>Mã số SV</th>
                  <th style={{ minWidth: '200px', textAlign: 'center' }}>Họ tên</th>
                  {attendanceDates.map((date, index) => (
                    <th key={index} style={{ textAlign: 'center', minWidth: '120px' }}>
                      {new Date(date).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentClassSections.map((section) => (
                  <tr key={section._id}>
                    <td style={{  minWidth: '120px', textAlign: 'center' }}>
                      {section.userCode || 'Chưa cập nhật'}
                    </td>
                    <td style={{  minWidth: '200px', textAlign: 'center' }}>
                      {section.fullName || section.displayName || 'Chưa cập nhật'}
                    </td>
                    {attendanceDates.map((date, dateIndex) => {
                      const attendanceRecord = attendanceDetails.find(
                        (record) =>
                          record.studentID === section._id &&
                          new Date(record.date).toLocaleDateString() ===
                            new Date(date).toLocaleDateString()
                      );
                      return (
                        <td key={dateIndex} style={{ textAlign: 'center', minWidth: '120px' }}>
                          {attendanceRecord ? (
                            <>
                              {attendanceRecord.time ? attendanceRecord.time : ""}{" "}
                              <br />
                              {attendanceRecord.status || ""}
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
        </div>
        <div>
          {/* <p><b>Số buổi tham dự:</b> {attendanceCount.totalTimes[userID]}/{countTotalDateColumns}</p> */}
          <p><b>Số buổi tham dự:</b> {attendanceCount.totalTimes[userID] || 0}/<b>{countTotalDateColumns()} buổi</b></p>
          <p><b>Số buổi vắng có phép:</b> {attendanceCount.excusedAbsences[userID]} <b>buổi</b></p>
        </div>
        <ToastContainer />
      </section>
    </div>
  );
};

export default AttendanceStudent;