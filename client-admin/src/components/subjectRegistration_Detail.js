// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Link, useParams } from 'react-router-dom';
// import ReactPaginate from 'react-paginate';
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

// const TeacherAssignments = ({ userRole }) => {
//   const { subjectID } = useParams();
//   const [assignments, setAssignments] = useState([]);
//   const [subjectInfo, setSubjectInfo] = useState({});
//   const [termName, setTermName] = useState('');
//   const [majorName, setMajorName] = useState('');
//   const [currentPage, setCurrentPage] = useState(0);
//   const [searchKeyword, setSearchKeyword] = useState('');
//   const [expandedRow, setExpandedRow] = useState(null);
//   const [expandedClassCode, setExpandedClassCode] = useState(null);
//   const [classSections, setClassSections] = useState([]);
//   const [selectedClassSections, setSelectedClassSections] = useState([]);
//   const subjectsPerPage = 10;

//   useEffect(() => {
//     if (subjectID && subjectID.length === 24) {
//       apiGetAssignments();
//     } else {
//       console.error('Invalid subjectID format');
//     }
//   }, [subjectID]);

//   const apiGetAssignments = async () => {
//     try {
//       const response = await axios.get(`/api/admin/teacherassignments/${subjectID}`);
//       setAssignments(response.data);
//       if (response.data.length > 0) {
//         setSubjectInfo(response.data[0].subjectID);
//         fetchTermName(response.data[0].subjectID.term);
//         fetchMajorName(response.data[0].subjectID.major);
//       } else {
//         const subjectResponse = await axios.get(`/api/admin/subjects/${subjectID}`);
//         setSubjectInfo(subjectResponse.data);
//         fetchTermName(subjectResponse.data.term);
//         fetchMajorName(subjectResponse.data.major);
//       }
//     } catch (error) {
//       console.error('Error fetching assignments:', error);
//     }
//   };

//   const fetchTermName = async (termCode) => {
//     try {
//       const response = await axios.get(`/api/admin/terms/${termCode}`);
//       setTermName(response.data.term);
//     } catch (error) {
//       console.error('Error fetching term name:', error);
//     }
//   };

//   const fetchMajorName = async (majorCode) => {
//     try {
//       const response = await axios.get(`/api/admin/majors/${majorCode}`);
//       setMajorName(response.data.majorName);
//     } catch (error) {
//       console.error('Error fetching major name:', error);
//     }
//   };

//   const handlePageClick = (data) => {
//     setCurrentPage(data.selected);
//   };

//   const handleSearchChange = (e) => {
//     setSearchKeyword(e.target.value);
//   };

//   const handleRowClick = async (assignmentID) => {
//     if (expandedRow === assignmentID) {
//       setExpandedRow(null);
//       setClassSections([]);
//     } else {
//       try {
//         const response = await axios.get(`/api/admin/classsections/unregist/${subjectID}/${subjectCode}`);
//         setClassSections(response.data);
//         setExpandedRow(assignmentID);
//       } catch (error) {
//         console.error('Error fetching class sections:', error);
//       }
//     }
//   };
//   const handleCheckboxChange = (classSectionID) => {
//     setSelectedClassSections(prevSelected => {
//       if (prevSelected.includes(classSectionID)) {
//         return prevSelected.filter(id => id !== classSectionID);
//       } else {
//         return [...prevSelected, classSectionID];
//       }
//     });
//   };

//   const handleRegisterClick = async (teacherID) => {
//     try {
//       await axios.post(`/api/admin/teacherassignments/${subjectID}/${teacherID}/register`, {
//         classsectionIDs: selectedClassSections
//       });
//       alert('Đăng ký thành công!');
//       // Remove registered class sections from the list
//       setClassSections(prevSections => prevSections.filter(section => !selectedClassSections.includes(section._id)));
//       // Keep the selectedClassSections array as it is
//     } catch (error) {
//       console.error('Error registering class sections:', error);
//       alert('Đăng ký thất bại!');
//     }
//   };

//   const handleDeleteClick = async (assignmentID) => {
//     if (window.confirm('Bạn có chắc chắn muốn xóa phân công này không?')) {
//       try {
//         await axios.delete(`/api/admin/teacherassignments/${assignmentID}`);
//         setAssignments(assignments.filter(assignment => assignment._id !== assignmentID));
//         apiGetAssignments();
//         alert('Xóa thành công!');
//       } catch (error) {
//         console.error('Error deleting assignment:', error);
//         alert('Xóa thất bại!');
//       }
//     }
//   };

//   const offset = currentPage * subjectsPerPage;
//   const filteredAssignments = assignments.filter(assignment =>
//     assignment.teacherID.email.toLowerCase().includes(searchKeyword.toLowerCase()) ||
//     assignment.teacherID.displayName.toLowerCase().includes(searchKeyword.toLowerCase())
//   );
//   const currentAssignments = filteredAssignments.slice(offset, offset + subjectsPerPage);

//   return (
//     <div>
//   <section className="content-header">
//     <div className="container-fluid">
//       <div className="row mb-2">
//         <div className="col-sm-6">
//           <h1>Danh sách phân công giảng dạy</h1>
//         </div>
//         <div className="col-sm-6">
//           <ol className="breadcrumb float-sm-right">
//             <li className="breadcrumb-item">
//               <b><Link to='/admin/home' style={{color: '#6B63FF'}}>Trang chủ</Link></b>
//             </li>
//             <li className="breadcrumb-item">
//               <b><Link to='/admin/subjectregistration' style={{color: '#6B63FF'}}>Đăng ký môn</Link></b>
//             </li>
//             <li className="breadcrumb-item active">Phân công</li>
//           </ol>
//         </div>
//       </div>
//     </div>
//   </section>
//   <section className="content">
//     <div className="card">
//       <div className="card-header">
//         <h3 className="card-title" style={{ lineHeight: '1.6' }}>
//           <strong>{subjectInfo.subjectName} ({subjectInfo.subjectCode})<br /></strong>
//           <strong>Học kỳ:</strong> {termName}<br />
//           <strong>Ngành:</strong> {majorName}
//         </h3>
//         <br /><br />
//         <div className="card-tools">
//           <div className="input-group input-group-sm" style={{ width: '200px' }}>
//             <input
//               type="text"
//               className="form-control float-right"
//               placeholder="Tìm kiếm"
//               value={searchKeyword}
//               onChange={handleSearchChange}
//             />
//             <div className="input-group-append">
//               <button type="submit" className="btn btn-default">
//                 <i className="fas fa-search"></i>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="card-body table-responsive p-0">
//         <table className="table table-hover text-nowrap">
//           <thead>
//             <tr>
//               <th>STT</th>
//               <th>Email giảng viên</th>
//               <th>Tên giảng viên</th>
//               <th>SĐT</th>
//               <th></th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentAssignments.map((assignment, index) => (
//               <React.Fragment key={assignment._id}>
//                 <tr onClick={() => handleRowClick(assignment._id)}>
//                   <td>{offset + index + 1}</td>
//                   <td>{assignment.teacherID.email}</td>
//                   <td>{assignment.teacherID.displayName}</td>
//                   <td>{assignment.teacherID?.phone || 'N/A'}</td>
//                   <td>
//                     <div className="action-buttons">
//                       {userRole !== 'Giảng viên' && (
//                         <button
//                           className="icon-button delete far fa-trash-alt"
//                           onClick={() => handleDeleteClick(assignment._id)}
//                         ></button>
//                       )}
//                     </div>
//                   </td>
//                 </tr>
//                 {userRole !== 'Giảng viên' && (
//                   <>
//                     {expandedRow === assignment._id && (
//                       <tr>
//                         <td colSpan="5">
//                           <table className="table table-hover text-nowrap">
//                             <thead>
//                               <tr>
//                                 <th>Mã lớp</th>
//                                 <th>Ngày học</th>
//                                 <th>Tiết học</th>
//                                 <th></th>
//                               </tr>
//                             </thead>
//                             <tbody>
//                               {classSections.map((section) => (
//                                 <React.Fragment key={section._id}>
//                                   <tr>
//                                     <td>{section.classCode}</td>
//                                     <td>{section.schoolDay.join(', ')}</td>
//                                     <td>{section.lesson.join(', ')}</td>
//                                     <td>
//                                       <input
//                                         type="checkbox"
//                                         checked={selectedClassSections.includes(section._id)}
//                                         onChange={() => handleCheckboxChange(section._id)}
//                                       />
//                                     </td>
//                                   </tr>
//                                 </React.Fragment>
//                               ))}
//                             </tbody>
//                           </table>
//                           <div className="text-right">
//                             <button
//                               className="btn btn-success"
//                               style={{ backgroundColor: '#6B63FF', borderColor: '#6B63FF', color: '#ffffff', borderRadius: '4px', marginTop: '10px' }}
//                               onClick={() => handleRegisterClick(assignments.find(a => a._id === expandedRow).teacherID._id)}
//                             >
//                               <i className="fas fa" style={{
//                                 fontFamily: 'Roboto, Arial, sans-serif',
//                                 fontSize: '16px',
//                                 fontWeight: '400',
//                               }}>Đăng ký
//                               </i>
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     )}
//                   </>
//                 )}
//               </React.Fragment>
//             ))}
//             {currentAssignments.length === 0 && (
//               <tr>
//                 <td colSpan="5" className="text-center">Không có giảng viên nào được đăng ký</td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//         <div className="pagination-container"
//           style={{
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//             margin: '20px 0',
//           }}
//         >
//           <ReactPaginate
//             previousLabel={<span style={{ fontSize: "16px" }}>‹</span>}
//             nextLabel={<span style={{ fontSize: "16px" }}>›</span>}
//             breakLabel={'...'}
//             breakClassName={'break-me'}
//             pageCount={Math.ceil(filteredAssignments.length / subjectsPerPage)}
//             marginPagesDisplayed={2}
//             pageRangeDisplayed={5}
//             onPageChange={handlePageClick}
//             containerClassName={'pagination'}
//             subContainerClassName={'pages pagination'}
//             activeClassName={'active'}
//           />
//         </div>
//       </div>
//     </div>
//   </section>
// </div>
//   );
// };

// export default TeacherAssignments;



// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Link, useParams } from 'react-router-dom';
// import ReactPaginate from 'react-paginate';
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

// const TeacherAssignments = ({ userRole }) => {
//   const { subjectID } = useParams();
//   const [assignments, setAssignments] = useState([]);
//   const [subjectInfo, setSubjectInfo] = useState({});
//   const [termName, setTermName] = useState('');
//   const [majorName, setMajorName] = useState('');
//   const [currentPage, setCurrentPage] = useState(0);
//   const [searchKeyword, setSearchKeyword] = useState('');
//   const [expandedRow, setExpandedRow] = useState(null);
//   const [classSections, setClassSections] = useState([]);
//   const [selectedClassSections, setSelectedClassSections] = useState([]);
//   const subjectsPerPage = 10;

//   useEffect(() => {
//     if (subjectID && subjectID.length === 24) {
//       apiGetAssignments();
//     } else {
//       console.error('Invalid subjectID format');
//     }
//   }, [subjectID]);

//   const apiGetAssignments = async () => {
//     try {
//       const response = await axios.get(`/api/admin/teacherassignments/${subjectID}`);
//       setAssignments(response.data);
//       if (response.data.length > 0) {
//         setSubjectInfo(response.data[0].subjectID);
//         fetchTermName(response.data[0].subjectID.term);
//         fetchMajorName(response.data[0].subjectID.major);
//       } else {
//         const subjectResponse = await axios.get(`/api/admin/subjects/${subjectID}`);
//         setSubjectInfo(subjectResponse.data);
//         fetchTermName(subjectResponse.data.term);
//         fetchMajorName(subjectResponse.data.major);
//       }
//     } catch (error) {
//       console.error('Error fetching assignments:', error);
//     }
//   };

//   const fetchTermName = async (termCode) => {
//     try {
//       const response = await axios.get(`/api/admin/terms/${termCode}`);
//       setTermName(response.data.term);
//     } catch (error) {
//       console.error('Error fetching term name:', error);
//     }
//   };

//   const fetchMajorName = async (majorCode) => {
//     try {
//       const response = await axios.get(`/api/admin/majors/${majorCode}`);
//       setMajorName(response.data.majorName);
//     } catch (error) {
//       console.error('Error fetching major name:', error);
//     }
//   };

//   const handlePageClick = (data) => {
//     setCurrentPage(data.selected);
//   };

//   const handleSearchChange = (e) => {
//     setSearchKeyword(e.target.value);
//   };

//   const handleRowClick = async (assignmentID) => {
//     if (expandedRow === assignmentID) {
//       setExpandedRow(null);
//       setClassSections([]);
//     } else {
//       try {
//         const response = await axios.get(`/api/admin/classsections/unregist/${subjectID}/${subjectInfo.subjectCode}`);
//         setClassSections(response.data);
//         setExpandedRow(assignmentID);
//       } catch (error) {
//         console.error('Error fetching class sections:', error);
//       }
//     }
//   };

//   const handleCheckboxChange = (classSectionID) => {
//     setSelectedClassSections(prevSelected => {
//       if (prevSelected.includes(classSectionID)) {
//         return prevSelected.filter(id => id !== classSectionID);
//       } else {
//         return [...prevSelected, classSectionID];
//       }
//     });
//   };

//   const handleRegisterClick = async (teacherID) => {
//     try {
//       await axios.post(`/api/admin/teacherassignments/${subjectID}/${teacherID}/register`, {
//         classsectionIDs: selectedClassSections
//       });
//       alert('Đăng ký thành công!');
//       // Remove registered class sections from the list
//       setClassSections(prevSections => prevSections.filter(section => !selectedClassSections.includes(section._id)));
//       // Keep the selectedClassSections array as it is
//     } catch (error) {
//       console.error('Error registering class sections:', error);
//       alert('Đăng ký thất bại!');
//     }
//   };

//   const handleDeleteClick = async (assignmentID) => {
//     if (window.confirm('Bạn có chắc chắn muốn xóa phân công này không?')) {
//       try {
//         await axios.delete(`/api/admin/teacherassignments/${assignmentID}`);
//         setAssignments(assignments.filter(assignment => assignment._id !== assignmentID));
//         apiGetAssignments();
//         alert('Xóa thành công!');
//       } catch (error) {
//         console.error('Error deleting assignment:', error);
//         alert('Xóa thất bại!');
//       }
//     }
//   };

//   const offset = currentPage * subjectsPerPage;
//   const filteredAssignments = assignments.filter(assignment =>
//     assignment.teacherID.email.toLowerCase().includes(searchKeyword.toLowerCase()) ||
//     assignment.teacherID.displayName.toLowerCase().includes(searchKeyword.toLowerCase())
//   );
//   const currentAssignments = filteredAssignments.slice(offset, offset + subjectsPerPage);

//   return (
//     <div>
//       <section className="content-header">
//         <div className="container-fluid">
//           <div className="row mb-2">
//             <div className="col-sm-6">
//               <h1>Danh sách phân công giảng dạy</h1>
//             </div>
//             <div className="col-sm-6">
//               <ol className="breadcrumb float-sm-right">
//                 <li className="breadcrumb-item">
//                   <b><Link to='/admin/home' style={{color: '#6B63FF'}}>Trang chủ</Link></b>
//                 </li>
//                 <li className="breadcrumb-item">
//                   <b><Link to='/admin/subjectregistration' style={{color: '#6B63FF'}}>Đăng ký môn</Link></b>
//                 </li>
//                 <li className="breadcrumb-item active">Phân công</li>
//               </ol>
//             </div>
//           </div>
//         </div>
//       </section>
//       <section className="content">
//         <div className="card">
//           <div className="card-header">
//             <h3 className="card-title" style={{ lineHeight: '1.6' }}>
//               <strong>{subjectInfo.subjectName} ({subjectInfo.subjectCode})<br /></strong>
//               <strong>Học kỳ:</strong> {termName}<br />
//               <strong>Ngành:</strong> {majorName}
//             </h3>
//             <br /><br />
//             <div className="card-tools">
//               <div className="input-group input-group-sm" style={{ width: '200px' }}>
//                 <input
//                   type="text"
//                   className="form-control float-right"
//                   placeholder="Tìm kiếm"
//                   value={searchKeyword}
//                   onChange={handleSearchChange}
//                 />
//                 <div className="input-group-append">
//                   <button type="submit" className="btn btn-default">
//                     <i className="fas fa-search"></i>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="card-body table-responsive p-0">
//             <table className="table table-hover text-nowrap">
//               <thead>
//                 <tr>
//                   <th>STT</th>
//                   <th>Email giảng viên</th>
//                   <th>Tên giảng viên</th>
//                   <th>SĐT</th>
//                   <th></th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {currentAssignments.map((assignment, index) => (
//                   <React.Fragment key={assignment._id}>
//                     <tr onClick={() => handleRowClick(assignment._id)}>
//                       <td>{offset + index + 1}</td>
//                       <td>{assignment.teacherID.email}</td>
//                       <td>{assignment.teacherID.displayName}</td>
//                       <td>{assignment.teacherID?.phone || 'N/A'}</td>
//                       <td>
//                         <div className="action-buttons">
//                           {userRole !== 'Giảng viên' && (
//                             <button
//                               className="icon-button delete far fa-trash-alt"
//                               onClick={() => handleDeleteClick(assignment._id)}
//                             ></button>
//                           )}
//                         </div>
//                       </td>
//                     </tr>
//                     {userRole !== 'Giảng viên' && (
//                       <>
//                         {expandedRow === assignment._id && (
//                           <tr>
//                             <td colSpan="5">
//                               <table className="table table-hover text-nowrap">
//                                 <thead>
//                                   <tr>
//                                     <th>Mã lớp</th>
//                                     <th>Ngày học</th>
//                                     <th>Tiết học</th>
//                                     <th></th>
//                                   </tr>
//                                 </thead>
//                                 <tbody>
//                                   {classSections.map((section) => (
//                                     <React.Fragment key={section._id}>
//                                       <tr>
//                                         <td>{section.classCode}</td>
//                                         <td>{section.schoolDay.join(', ')}</td>
//                                         <td>{section.lesson.join(', ')}</td>
//                                         <td>
//                                           <input
//                                             type="checkbox"
//                                             checked={selectedClassSections.includes(section._id)}
//                                             onChange={() => handleCheckboxChange(section._id)}
//                                           />
//                                         </td>
//                                       </tr>
//                                     </React.Fragment>
//                                   ))}
//                                 </tbody>
//                               </table>
//                               <div className="text-right">
//                                 <button
//                                   className="btn btn-success"
//                                   style={{ backgroundColor: '#6B63FF', borderColor: '#6B63FF', color: '#ffffff', borderRadius: '4px', marginTop: '10px' }}
//                                   onClick={() => handleRegisterClick(assignments.find(a => a._id === expandedRow).teacherID._id)}
//                                 >
//                                   <i className="fas fa" style={{
//                                     fontFamily: 'Roboto, Arial, sans-serif',
//                                     fontSize: '16px',
//                                     fontWeight: '400',
//                                   }}>Đăng ký
//                                   </i>
//                                 </button>
//                               </div>
//                             </td>
//                           </tr>
//                         )}
//                       </>
//                     )}
//                   </React.Fragment>
//                 ))}
//                 {currentAssignments.length === 0 && (
//                   <tr>
//                     <td colSpan="5" className="text-center">Không có giảng viên nào được đăng ký</td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//             <div className="pagination-container"
//               style={{
//                 display: 'flex',
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 margin: '20px 0',
//               }}
//             >
//               <ReactPaginate
//                 previousLabel={<span style={{ fontSize: "16px" }}>‹</span>}
//                 nextLabel={<span style={{ fontSize: "16px" }}>›</span>}
//                 breakLabel={'...'}
//                 breakClassName={'break-me'}
//                 pageCount={Math.ceil(filteredAssignments.length / subjectsPerPage)}
//                 marginPagesDisplayed={2}
//                 pageRangeDisplayed={5}
//                 onPageChange={handlePageClick}
//                 containerClassName={'pagination'}
//                 subContainerClassName={'pages pagination'}
//                 activeClassName={'active'}
//               />
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default TeacherAssignments;






import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
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

const TeacherAssignments = ({ userRole }) => {
  const { subjecttermID } = useParams();
  const [assignments, setAssignments] = useState([]);
  const [subjectInfo, setSubjectInfo] = useState({});
  const [termName, setTermName] = useState('');
  const [majorName, setMajorName] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [expandedRow, setExpandedRow] = useState(null);
  const [classSections, setClassSections] = useState([]);
  const [selectedClassSections, setSelectedClassSections] = useState([]);
  const subjectsPerPage = 10;


  useEffect(() => {
    if (subjecttermID && subjecttermID.length === 24) {
      apiGetAssignments();
    } else {
      console.error('Invalid subjecttermID format');
    }
  }, [subjecttermID]);

  const apiGetAssignments = async () => {
    try {
      const response = await axios.get(`/api/admin/teacherassignments/${subjecttermID}`);
      setAssignments(response.data);
      
        const subjectResponse = await axios.get(`/api/admin/subjectterms/allvalue/${subjecttermID}`);
        setSubjectInfo(subjectResponse.data);
        
      
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  
  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value);
  };

  const handleRowClick = async (assignmentID) => {
    if (expandedRow === assignmentID) {
      setExpandedRow(null);
      setClassSections([]);
    } else {
      try {
        const response = await axios.get(`/api/admin/classsections/unregist/${subjecttermID}/${subjectInfo.subjectTermCode}`);
        setClassSections(response.data);
        setExpandedRow(assignmentID);
      } catch (error) {
        console.error('Error fetching class sections:', error);
      }
    }
  };

  const handleCheckboxChange = (classSectionID) => {
    setSelectedClassSections(prevSelected => {
      if (prevSelected.includes(classSectionID)) {
        return prevSelected.filter(id => id !== classSectionID);
      } else {
        return [...prevSelected, classSectionID];
      }
    });
  };

  const handleRegisterClick = async (teacherID) => {
    try {
      await axios.post(`/api/admin/teacherassignments/${subjecttermID}/${teacherID}/register`, {
        classsectionIDs: selectedClassSections
      });
      showToast('Đăng ký thành công!');
      // Remove registered class sections from the list
      setClassSections(prevSections => prevSections.filter(section => !selectedClassSections.includes(section._id)));
      // Keep the selectedClassSections array as it is
    } catch (error) {
      console.error('Error registering class sections:', error);
      showErrorToast('Đăng ký thất bại!');
    }
  };

  const handleDeleteClick = async (assignmentID) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phân công này không?')) {
      try {
        await axios.delete(`/api/admin/teacherassignments/${assignmentID}`);
        setAssignments(assignments.filter(assignment => assignment._id !== assignmentID));
        apiGetAssignments();
        alert('Xóa thành công!');
      } catch (error) {
        console.error('Error deleting assignment:', error);
        alert('Xóa thất bại!');
      }
    }
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


  const offset = currentPage * subjectsPerPage;
const filteredAssignments = assignments.filter(assignment => {
  const email = assignment.teacherID?.email?.toLowerCase() || '';
  const displayName = assignment.teacherID?.displayName?.toLowerCase() || '';
  const keyword = searchKeyword.toLowerCase();

  return email.includes(keyword) || displayName.includes(keyword);
});
  const currentAssignments = filteredAssignments.slice(offset, offset + subjectsPerPage);

  return (
    <div>
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Danh sách phân công giảng dạy</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <b><Link to='/admin/home' style={{color: '#6B63FF'}}>Trang chủ</Link></b>
                </li>
                <li className="breadcrumb-item">
                  <b><Link to='/admin/subjectregistration' style={{color: '#6B63FF'}}>Đăng ký môn</Link></b>
                </li>
                <li className="breadcrumb-item active">Phân công</li>
              </ol>
            </div>
          </div>
        </div>
      </section>
      <section className="content">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title" style={{ lineHeight: '1.6' }}>
            <strong>{subjectInfo.subjectCode} ({subjectInfo.subjectName})<br /></strong>
              <strong>Học kỳ:</strong> {subjectInfo.term}<br />
              <strong>Ngành:</strong> {subjectInfo.majorName}
            </h3>
            <br /><br />
            <div className="card-tools">
              <div className="input-group input-group-sm" style={{ width: '200px' }}>
                <input
                  type="text"
                  className="form-control float-right"
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
          </div>
          <div className="card-body table-responsive p-0">
            <table className="table table-hover text-nowrap">
              <thead>
                <tr>
                  <th></th>
                  <th>Email giảng viên</th>
                  <th>Tên giảng viên</th>
                  <th>SĐT</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {currentAssignments.map((assignment, index) => (
                  <React.Fragment key={assignment._id}>
                    <tr onClick={() => handleRowClick(assignment._id)}>
                    <td><i className={expandedRow === assignment._id ? 'fas fa-angle-down' : 'fas fa-angle-right'}></i></td>
                      <td>{assignment.teacherID.email}</td>
                      <td>{assignment.teacherID.fullName}</td>
                      <td>{assignment.teacherID?.phone || 'N/A'}</td>
                      <td>
                        <div className="action-buttons">
                          
                          {userRole !== 'Giảng viên' && (
                            <button
                              className="icon-button delete far fa-trash-alt"
                              onClick={() => handleDeleteClick(assignment._id)}
                            ></button>
                          )}
                        </div>
                      </td>
                    </tr>
                    {userRole !== 'Giảng viên' && (
                      <>
                        {expandedRow === assignment._id && (
                          <tr>
                            <td colSpan="5">
                              <table className="table table-hover text-nowrap">
                                <thead>
                                  <tr>
                                    <th>Mã lớp</th>
                                    <th>Ngày học</th>
                                    <th>Tiết học</th>
                                    <th></th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {classSections.map((section) => (
                                    <React.Fragment key={section._id}>
                                      <tr>
                                        <td>{section.classCode}</td>
                                        <td>{section.schoolDay.join(', ')}</td>
                                        <td>{section.lesson.join(', ')}</td>
                                        <td>
                                          <input
                                            type="checkbox"
                                            checked={selectedClassSections.includes(section._id)}
                                            onChange={() => handleCheckboxChange(section._id)}
                                          />
                                        </td>
                                      </tr>
                                    </React.Fragment>
                                  ))}
                                </tbody>
                              </table>
                              <div className="text-right">
                                <button
                                  className="btn btn-success"
                                  style={{ backgroundColor: '#6B63FF', borderColor: '#6B63FF', color: '#ffffff', borderRadius: '4px', marginTop: '10px' }}
                                  onClick={() => handleRegisterClick(assignments.find(a => a._id === expandedRow).teacherID._id)}
                                >
                                  <i className="fas fa" style={{
                                    fontFamily: 'Roboto, Arial, sans-serif',
                                    fontSize: '16px',
                                    fontWeight: '400',
                                  }}>Đăng ký
                                  </i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    )}
                  </React.Fragment>
                ))}
                {currentAssignments.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center">Không có giảng viên nào được đăng ký</td>
                  </tr>
                )}
              </tbody>
            </table>
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
                pageCount={Math.ceil(filteredAssignments.length / subjectsPerPage)}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={'pagination'}
                subContainerClassName={'pages pagination'}
                activeClassName={'active'}
              />
            </div>
          </div>
        </div>
      </section>
      <ToastContainer />

    </div>
  );
};

export default TeacherAssignments;