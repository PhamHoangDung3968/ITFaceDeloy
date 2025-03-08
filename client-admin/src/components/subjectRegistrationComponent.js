// import React, { Component } from 'react';
// import axios from 'axios';
// import ReactPaginate from 'react-paginate';
// import MyContext from '../contexts/MyContext';
// import { Link,useNavigate } from 'react-router-dom';
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

// class SubjectRegistration extends Component {
//   static contextType = MyContext;
//   state = {
//     subjects: [],
//     majors: [],
//     semesters: [],
//     newSubject: '',
//     currentPage: 0,
//     subjectsPerPage: 10,
//     searchKeyword: '',
//     filteredSubjects: [],
//     selectedMajor: '',
//     selectedSemester: '',
//     expandedRows: {},
//     lecturers: {},
//     filteredLecturers: {},
//     selectedLecturers: {} 
//   };

//   componentDidMount() {
//     this.apiGetSubjects();
//     this.apiGetMajors();
//     this.apiGetSemesters();
//   }

//   apiGetSubjects = async () => {
//     try {
//       const response = await axios.get('/api/admin/subjects');
//       this.setState({ subjects: response.data, filteredSubjects: response.data });
//     } catch (error) {
//       console.error('Error fetching subjects:', error);
//     }
//   };

//   apiGetMajors = async () => {
//     try {
//       const response = await axios.get('/api/admin/majors');
//       this.setState({ majors: response.data });
//     } catch (error) {
//       console.error('Error fetching majors:', error);
//     }
//   };

//   apiGetSemesters = async () => {
//     try {
//       const response = await axios.get('/api/admin/terms');
//       this.setState({ semesters: response.data });
//     } catch (error) {
//       console.error('Error fetching semesters:', error);
//     }
//   };

//   apiGetUnregisteredLecturers = async (subjectId) => {
//     try {
//       const response = await axios.get(`/api/admin/unregisteredLecturers/${subjectId}`);
//       this.setState(prevState => ({
//         lecturers: {
//           ...prevState.lecturers,
//           [subjectId]: response.data
//         },
//         filteredLecturers: {
//           ...prevState.filteredLecturers,
//           [subjectId]: response.data
//         }
//       }));
//     } catch (error) {
//       console.error('Error fetching unregistered lecturers:', error);
//     }
//   };

//   handleInputChange = (e) => {
//     this.setState({ [e.target.name]: e.target.value });
//   };

//   handleSearch = (subjectId) => {
//     const { searchKeyword, lecturers } = this.state;
//     const filteredLecturers = lecturers[subjectId].filter(lecturer =>
//       lecturer.displayName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
//       lecturer.email.toLowerCase().includes(searchKeyword.toLowerCase())
//     );
//     this.setState(prevState => ({
//       filteredLecturers: {
//         ...prevState.filteredLecturers,
//         [subjectId]: filteredLecturers
//       }
//     }));
//   };

//   handlePageClick = (data) => {
//     this.setState({ currentPage: data.selected });
//   };

//   getMajorName = (majorCode) => {
//     const major = this.state.majors.find(m => m._id === majorCode);
//     return major ? major.majorName : majorCode;
//   };

//   handleMajorChange = (e) => {
//     const selectedMajor = e.target.value;
//     this.filterSubjects(selectedMajor, this.state.selectedSemester);
//   };

//   handleSemesterChange = (e) => {
//     const selectedSemester = e.target.value;
//     this.filterSubjects(this.state.selectedMajor, selectedSemester);
//   };

//   filterSubjects = (selectedMajor, selectedSemester) => {
//     let filteredSubjects = this.state.subjects;

//     if (selectedMajor) {
//       filteredSubjects = filteredSubjects.filter(subject => subject.major === selectedMajor);
//     }

//     if (selectedSemester) {
//       filteredSubjects = filteredSubjects.filter(subject => subject.term === selectedSemester);
//     }

//     this.setState({ selectedMajor, selectedSemester, filteredSubjects });
//   };

//   toggleRow = (id) => {
//     this.setState(prevState => ({
//       expandedRows: {
//         ...prevState.expandedRows,
//         [id]: !prevState.expandedRows[id]
//       }
//     }), () => {
//       if (this.state.expandedRows[id]) {
//         this.apiGetUnregisteredLecturers(id);
//       }
//     });
//   };

//   handleCheckboxChange = (subjectId, lecturerId, isChecked) => {
//     this.setState(prevState => {
//       const selectedLecturers = { ...prevState.selectedLecturers };
//       if (!selectedLecturers[subjectId]) {
//         selectedLecturers[subjectId] = new Set();
//       }
//       if (isChecked) {
//         selectedLecturers[subjectId].add(lecturerId);
//       } else {
//         selectedLecturers[subjectId].delete(lecturerId);
//         if (selectedLecturers[subjectId].size === 0) {
//           delete selectedLecturers[subjectId];
//         }
//       }
//       return { selectedLecturers };
//     });
//   };

//   handleRegister = async (subjectId) => {
//     const { selectedLecturers } = this.state;
//     const lecturerIds = Array.from(selectedLecturers[subjectId] || []);
//     try {
//       for (const lecturerId of lecturerIds) {
//         const response = await axios.post('/api/admin/teachingAssignments', {
//           teacherID: lecturerId,
//           subjectID: subjectId
//         });
//         console.log('Response:', response.data);
//       }
//       alert('Đăng ký thành công!');
//       window.location.reload(); // Reload the page after successful registration
//     } catch (error) {
//       console.error('Error registering teaching assignments:', error);
//       alert('Có lỗi xảy ra khi đăng ký.');
//     }
//   };

//   render() {
//     const { currentPage, subjectsPerPage, searchKeyword, filteredSubjects, majors, semesters, selectedMajor, selectedSemester, expandedRows, lecturers, filteredLecturers, selectedLecturers } = this.state;
//     const offset = currentPage * subjectsPerPage;
//     const currentPageSubjects = filteredSubjects.slice(offset, offset + subjectsPerPage);
//     const { userRole } = this.props; // Get userRole from props


//     const subjectRows = currentPageSubjects.map((item, index) => (
//       <React.Fragment key={item._id}>
//         <tr onClick={() => this.toggleRow(item._id)}>
//           <td>{item.subjectCode}</td>
//           <td>{item.subjectName}</td>
//           <td>
//                   <div className="action-buttons">
//                     {/* <button className="btn btn-sm btn-primary">Cập nhật</button> */}
//                     <Link to={`/admin/subjectregistration/${item._id}`} className="icon-button edit fas fa-eye"></Link>
//                   </div>
//                   </td>
//         </tr>
//         {userRole !== 'Giảng viên' && (
//                             <>
//                               {expandedRows[item._id] && (
//           <tr className="expandable-body">
//             <td colSpan="8">
//               <div className="p-0">
//                 <div className="card-header">
//                   <h3 className="card-title">
//                     <b>Danh sách giảng viên chưa đăng ký</b>
//                   </h3>
//                   <div className="card-tools">
//                     <div className="input-group input-group-sm" style={{ width: '200px' }}>
//                       <input type="text" className="form-control float-right" placeholder="Tìm kiếm" name="searchKeyword" value={searchKeyword} onChange={this.handleInputChange} />
//                       <div className="input-group-append">
//                         <button type="submit" className="btn btn-default" onClick={() => this.handleSearch(item._id)}>
//                           <i className="fas fa-search"></i>
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 <table className="table table-hover">
//                   <tbody style={{ backgroundColor:'#ffdecc' }}>
//                     {filteredLecturers[item._id] ? (
//                       filteredLecturers[item._id].map(lecturer => (
//                         <tr key={lecturer._id}>
//                           <td>{lecturer.displayName}</td>
//                           <td>{lecturer.email}</td>
//                           <td>
//                             <input
//                               type="checkbox"
//                               checked={selectedLecturers[item._id] && selectedLecturers[item._id].has(lecturer._id)}
//                               onChange={(e) => this.handleCheckboxChange(item._id, lecturer._id, e.target.checked)}
//                             />
//                           </td>
//                         </tr>
//                       ))
//                     ) : (
//                       <tr>
//                         <td>Loading...</td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//                 <div className="card-footer">
//                   <button type="submit" className="btn btn-info float-right" onClick={() => this.handleRegister(item._id)} style={{backgroundColor:'#ff8e4c', borderColor: '#ffbe98'}}>Đăng ký</button>
//                 </div>
//               </div>
//             </td>
//           </tr>
//         )}
//                             </>
//                           )}
//         {/* {expandedRows[item._id] && (
//           <tr className="expandable-body">
//             <td colSpan="8">
//               <div className="p-0">
//                 <div className="card-header">
//                   <h3 className="card-title">
//                     <b>Danh sách giảng viên chưa đăng ký</b>
//                   </h3>
//                   <div className="card-tools">
//                     <div className="input-group input-group-sm" style={{ width: '200px' }}>
//                       <input type="text" className="form-control float-right" placeholder="Tìm kiếm" name="searchKeyword" value={searchKeyword} onChange={this.handleInputChange} />
//                       <div className="input-group-append">
//                         <button type="submit" className="btn btn-default" onClick={() => this.handleSearch(item._id)}>
//                           <i className="fas fa-search"></i>
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 <table className="table table-hover">
//                   <tbody style={{ backgroundColor:'#ffdecc' }}>
//                     {filteredLecturers[item._id] ? (
//                       filteredLecturers[item._id].map(lecturer => (
//                         <tr key={lecturer._id}>
//                           <td>{lecturer.displayName}</td>
//                           <td>{lecturer.email}</td>
//                           <td>
//                             <input
//                               type="checkbox"
//                               checked={selectedLecturers[item._id] && selectedLecturers[item._id].has(lecturer._id)}
//                               onChange={(e) => this.handleCheckboxChange(item._id, lecturer._id, e.target.checked)}
//                             />
//                           </td>
//                         </tr>
//                       ))
//                     ) : (
//                       <tr>
//                         <td>Loading...</td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//                 <div className="card-footer">
//                   <button type="submit" className="btn btn-info float-right" onClick={() => this.handleRegister(item._id)} style={{backgroundColor:'#ff8e4c', borderColor: '#ffbe98'}}>Đăng ký</button>
//                 </div>
//               </div>
//             </td>
//           </tr>
//         )} */}
//       </React.Fragment>
//     ));

//     return (
//       <div>
//         <section className="content-header">
//           <div className="container-fluid">
//             <div className="row mb-2">
//               <div className="col-sm-6">
//                 <h1>Đăng ký môn học</h1>
//               </div>
//               <div className="col-sm-6">
//                 <ol className="breadcrumb float-sm-right">
//                   <li className="breadcrumb-item">
//                     <b><Link to='/admin/home' style={{color: '#6B63FF'}}>Trang chủ</Link></b>
//                     </li>
//                   <li className="breadcrumb-item active">Đăng ký môn học</li>
//                 </ol>
//               </div>
//               </div>
//           </div>
//         </section>
//         <section className="content">
//           <div className="row">
//             <div className="col-12 col-sm-6">
//               <div className="form-group">
//                 <label>Học kỳ:</label>
//                 <select className="form-control select2 select2-danger" data-dropdown-css-class="select2-danger" style={{ width: '100%' }} onChange={this.handleSemesterChange} value={selectedSemester}>
//                   <option value="">Tất cả</option>
//                   {semesters.map(semester => (
//                     <option key={semester._id} value={semester._id}>{semester.term}</option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//             <div className="col-12 col-sm-6">
//               <div className="form-group">
//                 <label>Ngành</label>
//                 <select className="form-control select2 select2-danger" data-dropdown-css-class="select2-danger" style={{ width: '100%' }} onChange={this.handleMajorChange} value={selectedMajor}>
//                   <option value="">Tất cả</option>
//                   {majors.map(major => (
//                     <option key={major._id} value={major._id}>{major.majorName}</option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </div>
//           <div className="card">
//             <div className="card-header">
//               <h3 className="card-title">
//                 <b>Danh sách môn học</b>
//               </h3>
//             </div>
//             <div className="card-body table-responsive p-0">
//               <table className="table table-hover text-nowrap">
//                 <thead>
//                   <tr>
//                     <th>Mã môn học</th>
//                     <th>Tên môn học</th>
//                     <th></th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {subjectRows}
//                 </tbody>
//               </table>
//               <div className="pagination-container"
//                   style={{
//                     display: 'flex',
//                     justifyContent: 'center',
//                     alignItems: 'center',
//                     margin: '20px 0',
//                   }}
//                 >
//                 <ReactPaginate
//                   previousLabel={<span style={{ fontSize: "16px" }}>‹</span>}
//                   nextLabel={<span style={{ fontSize: "16px" }}>›</span>}
//                   breakLabel={'...'}
//                   breakClassName={'break-me'}
//                   pageCount={Math.ceil(filteredSubjects.length / subjectsPerPage)}
//                   marginPagesDisplayed={2}
//                   pageRangeDisplayed={5}
//                   onPageChange={this.handlePageClick}
//                   containerClassName={'pagination'}
//                   subContainerClassName={'pages pagination'}
//                   activeClassName={'active'}
//                 />
//               </div>
//             </div>
//           </div>
//         </section>
//       </div>
//     );
//   }
// }

// export default SubjectRegistration;





import React, { Component } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import MyContext from '../contexts/MyContext';
import { Link,useNavigate } from 'react-router-dom';
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

class SubjectRegistration extends Component {
  static contextType = MyContext;
  state = {
    subjectterms: [],
    majors: [],
    semesters: [],
    newSubject: '',
    subjects:'',
    currentPage: 0,
    subjecttermsPerPage: 10,
    searchKeyword: '',
    filteredsubjectterms: [],
    selectedMajor: '',
    selectedSemester: '',
    searchKeyword1: '',
    searchKeywordLecturer: '',
    lecturersPerPage: 5,
  currentLecturerPage: {},
    expandedRows: {},
    lecturers: {},
    filteredLecturers: {},
    selectedLecturers: {} 
  };

  componentDidMount() {
    this.apiGetsubjectterms();
    this.apiGetMajors();
    this.apiGetSubjectss();
    this.apiGetSemesters();
  }

  apiGetsubjectterms = async () => {
    try {
      const response = await axios.get('/api/admin/subjectterms');
      this.setState({ subjectterms: response.data, filteredsubjectterms: response.data });
    } catch (error) {
      console.error('Error fetching subjectterms:', error);
    }
  };
  apiGetSubjectss = async () => {
    try {
      const response = await axios.get('/api/admin/subjects');
      this.setState({ subjects: response.data });
    } catch (error) {
      console.error('Error fetching majors:', error);
    }
  };

  getSubjectName = (subjectID) => {
    if (!this.state.subjects || this.state.subjects.length === 0) {
      return subjectID; // Return the ID if subjects are not loaded yet
    }
    const subject = this.state.subjects.find(s => s._id === subjectID);
    return subject ? subject.subjectName : subjectID;
  };


  apiGetMajors = async () => {
    try {
      const response = await axios.get('/api/admin/majors');
      this.setState({ majors: response.data });
    } catch (error) {
      console.error('Error fetching majors:', error);
    }
  };

  apiGetSemesters = async () => {
    try {
      const response = await axios.get('/api/admin/terms');
      this.setState({ semesters: response.data });
    } catch (error) {
      console.error('Error fetching semesters:', error);
    }
  };

  apiGetUnregisteredLecturers = async (subjecttermID) => {
    try {
      const response = await axios.get(`/api/admin/unregisteredLecturers/${subjecttermID}`);
      this.setState(prevState => ({
        lecturers: {
          ...prevState.lecturers,
          [subjecttermID]: response.data
        },
        filteredLecturers: {
          ...prevState.filteredLecturers,
          [subjecttermID]: response.data
        }
      }));
    } catch (error) {
      console.error('Error fetching unregistered lecturers:', error);
    }
  };

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSearch = (subjecttermID) => {
    const { searchKeyword, lecturers } = this.state;
    const filteredLecturers = lecturers[subjecttermID].filter(lecturer =>
      lecturer.fullName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      lecturer.email.toLowerCase().includes(searchKeyword.toLowerCase())
    );
    this.setState(prevState => ({
      filteredLecturers: {
        ...prevState.filteredLecturers,
        [subjecttermID]: filteredLecturers
      }
    }));
  };

  handlePageClick = (data) => {
    this.setState({ currentPage: data.selected });
  };
  handleLecturerPageClick = (subjecttermID, data) => {
    this.setState(prevState => ({
      currentLecturerPage: {
        ...prevState.currentLecturerPage,
        [subjecttermID]: data.selected
      }
    }));
  };

  getMajorName = (majorCode) => {
    const major = this.state.majors.find(m => m._id === majorCode);
    return major ? major.majorName : majorCode;
  };

  handleMajorChange = (e) => {
    const selectedMajor = e.target.value;
    this.filtersubjectterms(selectedMajor, this.state.selectedSemester);
  };

  handleSemesterChange = (e) => {
    const selectedSemester = e.target.value;
    this.filtersubjectterms(this.state.selectedMajor, selectedSemester);
  };

  filtersubjectterms = (selectedMajor, selectedSemester) => {
    let filteredsubjectterms = this.state.subjectterms;

    if (selectedMajor) {
      filteredsubjectterms = filteredsubjectterms.filter(subject => subject.major === selectedMajor);
    }

    if (selectedSemester) {
      filteredsubjectterms = filteredsubjectterms.filter(subject => subject.term === selectedSemester);
    }

    this.setState({ selectedMajor, selectedSemester, filteredsubjectterms });
  };

  toggleRow = (id) => {
    this.setState(prevState => ({
      expandedRows: {
        ...prevState.expandedRows,
        [id]: !prevState.expandedRows[id]
      }
    }), () => {
      if (this.state.expandedRows[id]) {
        this.apiGetUnregisteredLecturers(id);
      }
    });
  };

  handleCheckboxChange = (subjecttermID, lecturerId, isChecked) => {
    this.setState(prevState => {
      const selectedLecturers = { ...prevState.selectedLecturers };
      if (!selectedLecturers[subjecttermID]) {
        selectedLecturers[subjecttermID] = new Set();
      }
      if (isChecked) {
        selectedLecturers[subjecttermID].add(lecturerId);
      } else {
        selectedLecturers[subjecttermID].delete(lecturerId);
        if (selectedLecturers[subjecttermID].size === 0) {
          delete selectedLecturers[subjecttermID];
        }
      }
      return { selectedLecturers };
    });
  };

  handleRegister = async (subjecttermID) => {
    const { selectedLecturers } = this.state;
    const lecturerIds = Array.from(selectedLecturers[subjecttermID] || []);
    try {
      for (const lecturerId of lecturerIds) {
        const response = await axios.post('/api/admin/teachingAssignments', {
          teacherID: lecturerId,
          subjecttermID: subjecttermID
        });
        console.log('Response:', response.data);
      }
      this.showToast('Đăng ký thành công!');
      this.setState(prevState => ({
        expandedRows: {
          ...prevState.expandedRows,
          [subjecttermID]: false
        }
      }));
        } catch (error) {
      console.error('Error registering teaching assignments:', error);
      this.showErrorToast('Có lỗi xảy ra khi đăng ký.');
    }
  };
  handleSearchSubjectTerm = () => {
    const { searchKeyword, subjectterms, subjects } = this.state;
  
    if (!subjectterms) {
      console.error('subjectterms is undefined');
      return;
    }
  
    const filteredsubjectterms = subjectterms.filter(subject =>
      subject.subjectTermCode.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      (subjects.find(s => s._id === subject.subjectID)?.subjectName.toLowerCase() || '').includes(searchKeyword.toLowerCase())
    );
  
    this.setState({ filteredsubjectterms });
  };
  handleSearchLecturer = (subjecttermID) => {
    const { searchKeywordLecturer, lecturers } = this.state;
  
    if (!lecturers[subjecttermID]) {
      console.error('lecturers for subjecttermID is undefined');
      return;
    }
  
    const filteredLecturers = lecturers[subjecttermID].filter(lecturer =>
      (lecturer.fullName && lecturer.fullName.toLowerCase().includes(searchKeywordLecturer.toLowerCase())) ||
      (lecturer.email && lecturer.email.toLowerCase().includes(searchKeywordLecturer.toLowerCase()))
    );
  
    this.setState(prevState => ({
      filteredLecturers: {
        ...prevState.filteredLecturers,
        [subjecttermID]: filteredLecturers
      }
    }));
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
    const { currentPage, subjecttermsPerPage, searchKeyword, filteredsubjectterms, searchKeywordLecturer, semesters, selectedMajor, selectedSemester, expandedRows, lecturers, filteredLecturers, selectedLecturers } = this.state;
    const offset = currentPage * subjecttermsPerPage;
    const currentPagesubjectterms = filteredsubjectterms.slice(offset, offset + subjecttermsPerPage);
    const { userRole } = this.props;


    const subjectRows = currentPagesubjectterms.map((item, index) => (
      <React.Fragment key={item._id}>
        <tr onClick={() => this.toggleRow(item._id)}>
          <td><i className={expandedRows[item._id] ? 'fas fa-angle-down' : 'fas fa-angle-right'}></i></td>
          <td>{item.subjectTermCode}</td>
          <td>{this.getSubjectName(item.subjectID)}</td>
          <td>
                  <div className="action-buttons">
                    {/* <button className="btn btn-sm btn-primary">Cập nhật</button> */}
                    <Link className="btn btn-success" style={{ backgroundColor: '#6B63FF', borderColor: '#6B63FF', color: '#ffffff', borderRadius: '4px' }} to={`/admin/subjectregistration/${item._id}`}>
                        <i className="fas fa" style={{ fontFamily: 'Roboto, Arial, sans-serif', fontSize: '13px', fontWeight: '400',}}>Đăng ký lớp HP</i>
                    </Link>
                  </div>
                  </td>
        </tr>
        {userRole !== 'Giảng viên' && (
                            <>
                              {expandedRows[item._id] && (
  <tr className="expandable-body">
    <td colSpan="8">
      <div className="p-0">
        <div className="card-header">
          <h3 className="card-title">
            <b>Danh sách giảng viên chưa đăng ký ({item.subjectTermCode})</b>
          </h3>
          <div className="card-tools">
            <div className="input-group input-group-sm">
              <input type="text" className="form-control" placeholder="Tìm kiếm" value={searchKeywordLecturer} onChange={(e) => this.setState({ searchKeywordLecturer: e.target.value }, () => this.handleSearchLecturer(item._id))} />
              <div className="input-group-append">
                <button type="submit" className="btn btn-default" onClick={() => this.handleSearchLecturer(item._id)}>
                  <i className="fas fa-search"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Tên giảng viên</th>
              <th>Email</th>
              <th></th>
            </tr>
          </thead>
          <tbody style={{ backgroundColor:'#ffdecc' }}>
            {filteredLecturers[item._id] && filteredLecturers[item._id].length > 0 ? (
              filteredLecturers[item._id]
                .slice(
                  (this.state.currentLecturerPage[item._id] || 0) * this.state.lecturersPerPage,
                  ((this.state.currentLecturerPage[item._id] || 0) + 1) * this.state.lecturersPerPage
                )
                .map(lecturer => (
                  <tr key={lecturer._id}>
                    <td>{lecturer.fullName}</td>
                    <td>{lecturer.email}</td>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedLecturers[item._id] && selectedLecturers[item._id].has(lecturer._id)}
                        onChange={(e) => this.handleCheckboxChange(item._id, lecturer._id, e.target.checked)}
                      />
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="3">Không còn giảng viên nào</td>
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
            pageCount={Math.ceil((filteredLecturers[item._id] || []).length / this.state.lecturersPerPage)}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={(data) => this.handleLecturerPageClick(item._id, data)}
            containerClassName={'pagination'}
            subContainerClassName={'pages pagination'}
            activeClassName={'active'}
          />
        </div>
        <div className="card-footer">
          <button type="submit" className="btn btn-info float-right" onClick={() => this.handleRegister(item._id)} style={{backgroundColor:'#ff8e4c', borderColor: '#ffbe98'}}>Đăng ký</button>
        </div>
      </div>
    </td>
  </tr>
)}
        </>
   )}
      </React.Fragment>
    ));

    return (
      <div>
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1>Đăng ký giảng dạy</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <b><Link to='/admin/home' style={{color: '#6B63FF'}}>Trang chủ</Link></b>
                    </li>
                  <li className="breadcrumb-item active">Đăng ký môn học</li>
                </ol>
              </div>
              </div>
          </div>
        </section>
        <section className="content">
          
          <div className="card">
          <div className="card-header">
                  <h3 className="card-title">
                    <b>Danh sách môn học</b>
                  </h3>
                  <div className="card-tools">
                      <div className="input-group input-group-sm">
                        <input type="text" className="form-control" placeholder="Tìm kiếm" value={searchKeyword} onChange={(e) => this.setState({ searchKeyword: e.target.value }, this.handleSearchSubjectTerm)}/>
                        <div className="input-group-append">
                          <button type="submit" className="btn btn-default" onClick={this.handleSearch1}>
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
                    <th>Mã môn học theo học kỳ</th>
                    <th>Tên môn học</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {subjectRows}
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
                  pageCount={Math.ceil(filteredsubjectterms.length / subjecttermsPerPage)}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={5}
                  onPageChange={this.handlePageClick}
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
  }
}

export default SubjectRegistration;