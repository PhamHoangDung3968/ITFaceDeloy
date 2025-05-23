// 
// import React, { Component } from 'react';
// import axios from 'axios';
// import ReactPaginate from 'react-paginate';
// import MyContext from '../contexts/MyContext';
// import { Link } from 'react-router-dom';
// import '../dist/css/pagination.css';
// import '../dist/css/buttonIcon.css';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';


// class TK_StudentClassections extends Component {
//   static contextType = MyContext;
//   state = {
//     subjects: [],
//     users: [],
//     semesters: [],
//     selectedSemester: '',
//     currentPage: 0,
//     subjectsPerPage: 10,
//     filteredUsers: [],
//     expandedRow: null,
//     nestedCurrentPage: {},
//     searchKeyword: '', // Add this line
//     searchKeyword1:'',
//     absenceSort: 'none', // Add this line
//   };

//   componentDidMount() {
//     this.apiGetSemesters();
//     this.apiGetUsers(this.props.userID);
//     this.filterUsersBySearchKeyword1(); // Thêm dòng này
//   }
//   apiGetSemesters = async () => {
//     try {
//       const response = await axios.get('/api/admin/terms');
//       const semesters = response.data;
//       const largestTerm = semesters.reduce((max, term) => term.term > max.term ? term : max, semesters[0]);
//       this.setState({ semesters, selectedSemester: largestTerm._id }, this.filterUsersBySemester);
//     } catch (error) {
//       console.error('Error fetching semesters:', error);
//     }
//   };

//   apiGetUsers = async (teacherID) => {
//     try {
//       const apiUrl = this.props.userRole === 'Ban chủ nhiệm khoa'
//         ? `/api/admin/classsections/bcnk/totalteacherday`
//         : `/api/admin/classsections/teacher/totalteachday/${teacherID}`;
  
//       const response = await axios.get(apiUrl);
//       const reversedUsers = response.data.reverse(); // Reverse the order here
//       this.setState({ subjects: reversedUsers, filteredUsers: reversedUsers });
//     } catch (error) {
//       console.error('Error fetching subjects:', error);
//     }
//   };

//   handleSemesterChange = (e) => {
//     const selectedSemester = e.target.value;
//     this.setState({ selectedSemester }, this.filterUsersBySemester);
//   };

//   filterUsersBySemester = () => {
//     const { subjects, selectedSemester } = this.state;
//     const filteredUsers = selectedSemester
//       ? subjects.filter(subject => subject.termID === selectedSemester)
//       : subjects;
//     this.setState({ filteredUsers });
//   };
  
//   handleRowClick = (id) => {
//     this.setState((prevState) => ({
//       expandedRow: prevState.expandedRow === id ? null : id,
//       searchKeyword: '', // Reset search keyword
//       absenceSort: '5', // Reset absence sort
//     }), this.filterAndSortStudents);
//   };

//   handlePageClick = (data) => {
//     this.setState({ currentPage: data.selected });
//   };
//   handleNestedPageClick = (data, rowId) => {
//     this.setState(prevState => ({
//       nestedCurrentPage: {
//         ...prevState.nestedCurrentPage,
//         [rowId]: data.selected
//       }
//     }));
//   };
//   handleSearchChange = (e) => {
//     this.setState({ searchKeyword: e.target.value }, this.filterAndSortStudents);
//   };
//   handleSearchChange1 = (e) => {
//     this.setState({ searchKeyword1: e.target.value }, this.filterUsersBySearchKeyword1);
//   };
//   filterUsersBySearchKeyword1 = () => {
//     const { subjects, searchKeyword1 } = this.state;
//     const filteredUsers = subjects.filter(subject =>
//       subject.classCode.toLowerCase().includes(searchKeyword1.toLowerCase()) ||
//       subject.subjectName.toLowerCase().includes(searchKeyword1.toLowerCase())
//     );
//     this.setState({ filteredUsers });
//   };
  
//   handleAbsenceSortChange = (e) => {
//     const value = e.target.value;
//     this.setState({ absenceSort: value }, this.filterAndSortStudents);
//   };
  
//   filterAndSortStudents = () => {
//     const { subjects, searchKeyword, absenceSort } = this.state;
//     const filteredUsers = subjects.map(subject => {
//       let filteredStudents = subject.students;
  
//       if (searchKeyword) {
//         filteredStudents = filteredStudents.filter(student =>
//           student.fullName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
//           student.usercode.toLowerCase().includes(searchKeyword.toLowerCase())
//         );
//       }
  
//       if (absenceSort === 'most') {
//         filteredStudents.sort((a, b) => b.totalNullTimes - a.totalNullTimes);
//       } else if (absenceSort === 'least') {
//         filteredStudents.sort((a, b) => a.totalNullTimes - b.totalNullTimes);
//       } else if (!isNaN(absenceSort)) {
//         filteredStudents = filteredStudents.filter(student => student.totalNullTimes === parseInt(absenceSort));
//       }
  
//       return { ...subject, students: filteredStudents };
//     });
  
//     this.setState({ filteredUsers });
//   };
  
//   mapLesson = (lesson) => {
//     switch (lesson) {
//       case 1:
//         return '1 - 3';
//       case 2:
//         return '4 - 6';
//       case 3:
//         return '7 - 9';
//       case 4:
//         return '10 - 12';
//       case 5:
//         return '13 - 15';
//       case 6:
//         return 'Không có';
//       default:
//         return lesson;
//     }
//   };
//   handleTKExportAttendance = (teacherID, termID, classCode, totalNullTimes) => {
//     const apiUrl = this.props.userRole === 'Ban chủ nhiệm khoa'
//         ? `/api/admin/export-tk-bcnk/${termID}/${classCode}/${totalNullTimes}`
//         : `/api/admin/export-tk-teacher/${teacherID}/${termID}/${classCode}/${totalNullTimes}`;

//     const fileName = this.props.userRole === 'Ban chủ nhiệm khoa'
//         ? `attendance_BCNK_${classCode}_vang${totalNullTimes}buoi.xlsx`
//         : `attendance_${classCode}_vang${totalNullTimes}buoi.xlsx`;

//     axios({
//         url: apiUrl,
//         method: 'GET',
//         responseType: 'blob',
//     })
//     .then((response) => {
//         const url = window.URL.createObjectURL(new Blob([response.data]));
//         const link = document.createElement('a');
//         link.href = url;
//         link.setAttribute('download', fileName);
//         document.body.appendChild(link);
//         link.click();
//         link.remove();
//     })
//     .catch((error) => {
//         this.showErrorToast("Tải thất bại!");
//     });
// };
// showToast = (message) => {
//     toast.success(message, {
//       position: "top-right"
//     });
//   };
//   showErrorToast = (message) => {
//     toast.error(message, {
//       position: "top-right"
//     });
//   };



//   render() {
//     const { currentPage, subjectsPerPage, filteredUsers, expandedRow, semesters, nestedCurrentPage, searchKeyword, searchKeyword1, absenceSort } = this.state;
// const offset = currentPage * subjectsPerPage;
// const currentPageUsers = filteredUsers.slice(offset, offset + subjectsPerPage);
// const userRows = currentPageUsers.map((item, index) => {
//   const nestedOffset = (nestedCurrentPage[item._id] || 0) * subjectsPerPage;
//   const currentStudents = item.students.slice(nestedOffset, nestedOffset + subjectsPerPage);
//   return (
//     <React.Fragment key={item._id}>
//   <tr onClick={() => this.handleRowClick(item._id)}>
//     <td>
//       <i className={expandedRow === item._id ? 'fas fa-angle-down' : 'fas fa-angle-right'}></i>
//     </td>
//     <td>{offset + index + 1}</td>
//     <td>{item.classCode}</td>
//     <td>{item.subjectName}</td>
//     <td>{item.schoolDay}</td>
//     <td>
//       {item.lesson.map(lesson => (
//         <div key={lesson} style={{ margin: '0 5px' }}>
//           {this.mapLesson(lesson)}
//         </div>
//       ))}
//     </td>
//   </tr>
//   {expandedRow === item._id && (
//     <tr>
//       <td colSpan="7">
//       <div className="card-header">
//   <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
//     <div style={{ display: 'flex', gap: '10px' }}>
//       <div className="input-group input-group-sm" style={{ width: '200px' }}>
//         <input
//           type="text"
//           className="form-control float-right"
//           placeholder="Tìm kiếm"
//           value={searchKeyword}
//           onChange={this.handleSearchChange}
//         />
//         <div className="input-group-append">
//           <button type="submit" className="btn btn-default">
//             <i className="fas fa-search"></i>
//           </button>
//         </div>
//       </div>
//       <div className="input-group input-group-sm" style={{ width: '200px' }}>
//         <select className="form-control" value={absenceSort} onChange={this.handleAbsenceSortChange}>
//           <option value="most">Vắng nhiều hơn</option>
//           {[...Array(15).keys()].map(i => (
//             <option key={i + 1} value={i + 1}>{i + 1} buổi</option>
//           ))}
//         </select>
//       </div>
//     </div>
//     <button
//       type="button"
//       onClick={() => this.handleTKExportAttendance(this.props.userID, item.termID, item.classCode, this.state.absenceSort)}
//       className="btn btn-success text-nowrap"
//       style={{ backgroundColor: '#009900', borderColor: '#009900', color: '#ffffff', marginLeft: 'auto' }}
//     >
//       <i className="nav-icon fas fa-file-excel"></i> Xuất excel
//     </button>
//   </div>
// </div>
//         <table className="table table-bordered">
//           <thead>
//             <tr>
//               <th>STT</th>
//               <th>Mã số SV</th>
//               <th>Email</th>
//               <th>Họ và tên</th>
//               <th>Số buổi vắng</th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentStudents.map((student, idx) => (
//               <tr key={idx}>
//                 <td>{nestedOffset + idx + 1}</td>
//                 <td>{student.usercode}</td>
//                 <td>{student.email}</td>
//                 <td>{student.fullName}</td>
//                 <td>{student.totalNullTimes}/{item.totalDays}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         <div
//           className="pagination-container"
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
//             pageCount={Math.ceil(item.students.length / subjectsPerPage)}
//             marginPagesDisplayed={2}
//             pageRangeDisplayed={5}
//             onPageChange={(data) => this.handleNestedPageClick(data, item._id)}
//             containerClassName={'pagination'}
//             subContainerClassName={'pages pagination'}
//             activeClassName={'active1'}
//           />
//         </div>
//       </td>
//     </tr>
//   )}
// </React.Fragment>
//   );
// });
//     return (
//       <div>
//         <section className="content-header">
//           <div className="container-fluid">
//             <div className="row mb-2">
//               <div className="col-sm-6">
//                 <h1>Thống kê sinh viên vắng theo LHP</h1>
//               </div>
//               <div className="col-sm-6">
//                 <ol className="breadcrumb float-sm-right">
//                   <li className="breadcrumb-item">
//                     <b><Link to='/admin/home' style={{ color: '#6B63FF' }}>Trang chủ</Link></b>
//                   </li>
//                   <li className="breadcrumb-item active">Thống kê sinh viên vắng theo LHP</li>
//                 </ol>
//               </div>
//             </div>
//           </div>
//         </section>
//         <section className="content">
//           <div className="card">
//             <div className="card-header">
//               <div className="card-tools">
//                 <div className="input-group input-group-sm" style={{ width: '200px' }}>
//                   <select className="form-control" value={this.state.selectedSemester} onChange={this.handleSemesterChange}>
//                     <option value="">học kỳ</option>
//                     {semesters.map((semester) => (
//                       <option key={semester._id} value={semester._id}>
//                         {semester.term}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//               <div className="input-group input-group-sm" style={{ width: '200px' }}>
//               <input
//                 type="text"
//                 className="form-control float-right"
//                 placeholder="Tìm kiếm"
//                 value={searchKeyword1}
//                 onChange={this.handleSearchChange1}
//               />
//               <div className="input-group-append">
//                 <button type="submit" className="btn btn-default">
//                   <i className="fas fa-search"></i>
//                 </button>
//               </div>
//             </div>
//             </div>
//             <div className="card-body table-responsive p-0">
//               <table className="table table-hover text-nowrap">
//                 <thead>
//                   <tr>
//                     <th></th>
//                     <th>STT</th>
//                     <th>Mã lớp</th>
//                     <th>Tên lớp</th>
//                     <th>Ngày học</th>
//                     <th>Tiết</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {userRows}
//                 </tbody>
//               </table>
//               <div
//                 className="pagination-container"
//                 style={{
//                   display: 'flex',
//                   justifyContent: 'center',
//                   alignItems: 'center',
//                   margin: '20px 0',
//                 }}
//               >
//                 <ReactPaginate
//                   previousLabel={<span style={{ fontSize: "16px" }}>‹</span>}
//                   nextLabel={<span style={{ fontSize: "16px" }}>›</span>}
//                   breakLabel={'...'}
//                   breakClassName={'break-me'}
//                   pageCount={Math.ceil(filteredUsers.length / subjectsPerPage)}
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
//         <ToastContainer />
//       </div>
//     );
//   }
// }
// export default TK_StudentClassections;


import React, { Component } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import MyContext from '../contexts/MyContext';
import { Link } from 'react-router-dom';
import '../dist/css/pagination.css';
import '../dist/css/buttonIcon.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


class TK_StudentClassections extends Component {
  static contextType = MyContext;
  state = {
    subjects: [],
    users: [],
    semesters: [],
    selectedSemester: '',
    currentPage: 0,
    subjectsPerPage: 10,
    filteredUsers: [],
    expandedRow: null,
    nestedCurrentPage: {},
    searchKeyword: '', // Add this line
    searchKeyword1:'',
    fromAbsence: 'none', // Giá trị mặc định là 'none'
    toAbsence: 'none', // Giá trị mặc định là 'none'
  };

  componentDidMount() {
    this.apiGetSemesters();
    this.apiGetUsers(this.props.userID).then(() => {
      this.setState({ absenceSort: '5' }, this.filterAndSortStudents);
    });
    this.filterUsersBySearchKeyword1();
  }
  apiGetSemesters = async () => {
    try {
      const response = await axios.get('/api/admin/terms');
      const semesters = response.data;
      const largestTerm = semesters.reduce((max, term) => term.term > max.term ? term : max, semesters[0]);
      this.setState({ semesters, selectedSemester: largestTerm._id }, this.filterUsersBySemester);
    } catch (error) {
      console.error('Error fetching semesters:', error);
    }
  };

  apiGetUsers = async (teacherID) => {
    try {
      const apiUrl = this.props.userRole === 'Ban chủ nhiệm khoa'
        ? `/api/admin/classsections/bcnk/totalteacherday`
        : `/api/admin/classsections/teacher/totalteachday/${teacherID}`;
  
      const response = await axios.get(apiUrl);
      const reversedUsers = response.data.reverse(); // Reverse the order here
      this.setState({ subjects: reversedUsers, filteredUsers: reversedUsers });
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  handleSemesterChange = (e) => {
    const selectedSemester = e.target.value;
    this.setState({ selectedSemester }, this.filterUsersBySemester);
  };

  filterUsersBySemester = () => {
    const { subjects, selectedSemester } = this.state;
    const filteredUsers = selectedSemester
      ? subjects.filter(subject => subject.classSection.termID === selectedSemester)
      : subjects;
    this.setState({ filteredUsers });
  };

  handlePageClick = (data) => {
    this.setState({ currentPage: data.selected });
  };
  handleNestedPageClick = (data, rowId) => {
    this.setState(prevState => ({
      nestedCurrentPage: {
        ...prevState.nestedCurrentPage,
        [rowId]: data.selected
      }
    }));
  };
  handleSearchChange = (e) => {
    this.setState({ searchKeyword: e.target.value }, this.filterAndSortStudents);
  };
  handleSearchChange1 = (e) => {
    this.setState({ searchKeyword1: e.target.value }, this.filterUsersBySearchKeyword1);
  };
  filterUsersBySearchKeyword1 = () => {
    const { subjects, searchKeyword1 } = this.state;
    const filteredUsers = subjects.filter(subject =>
      subject.classCode.toLowerCase().includes(searchKeyword1.toLowerCase()) ||
      subject.subjectName.toLowerCase().includes(searchKeyword1.toLowerCase())
    );
    this.setState({ filteredUsers });
  };
  
  handleAbsenceSortChange = (e) => {
    const value = e.target.value;
    this.setState({ absenceSort: value }, this.filterAndSortStudents);
  };
  
  filterUsersBySemester = () => {
    const { subjects, selectedSemester } = this.state;
    const filteredUsers = selectedSemester
      ? subjects.filter(subject => subject.classSection.termID === selectedSemester)
      : subjects;
    this.setState({ filteredUsers }, this.filterAndSortStudents);
  };
  handleFromAbsenceChange = (e) => {
    this.setState({ fromAbsence: e.target.value }, () => {
      const { fromAbsence, toAbsence } = this.state;
      if (fromAbsence !== 'none' && toAbsence !== 'none') {
        const from = parseInt(fromAbsence);
        const to = parseInt(toAbsence);
        if (from >= to) {
          this.showErrorToast("Giá trị 'đến' phải lớn hơn giá trị 'buổi'");
        } else {
          this.filterAndSortStudents();
        }
      }
    });
  };
  
  handleToAbsenceChange = (e) => {
    this.setState({ toAbsence: e.target.value }, () => {
      const { fromAbsence, toAbsence } = this.state;
      if (fromAbsence !== 'none' && toAbsence !== 'none') {
        const from = parseInt(fromAbsence);
        const to = parseInt(toAbsence);
        if (from >= to) {
          this.showErrorToast("Giá trị 'đến' phải lớn hơn giá trị 'buổi'");
        } else {
          this.filterAndSortStudents();
        }
      }
    });
  };
  
  
  
  filterAndSortStudents = () => {
  const { subjects, searchKeyword, selectedSemester, fromAbsence, toAbsence } = this.state;
  let filteredUsers = subjects;

  if (selectedSemester) {
    filteredUsers = filteredUsers.filter(subject => subject.classSection.termID === selectedSemester);
  }

  if (fromAbsence !== 'none' && toAbsence !== 'none') {
    const from = parseInt(fromAbsence);
    const to = parseInt(toAbsence);

    if (from >= to) {
      this.showErrorToast("Giá trị 'đến' phải lớn hơn giá trị 'buổi'");
      return;
    }

    filteredUsers = filteredUsers.filter(subject => subject.totalNullTimes >= from && subject.totalNullTimes <= to);
  }

  if (searchKeyword) {
    filteredUsers = filteredUsers.filter(subject =>
      subject.fullName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      subject.userCode.toLowerCase().includes(searchKeyword.toLowerCase())
    );
  }

  this.setState({ filteredUsers });
};

  
  

  handleAbsenceSortChange = (e) => {
    const value = e.target.value;
    
    this.setState({ absenceSort: value }, this.filterAndSortStudents);
  };

  filterAndSortStudents = () => {
    const { subjects, searchKeyword, selectedSemester, fromAbsence, toAbsence } = this.state;
    let filteredUsers = subjects;
  
    if (selectedSemester) {
      filteredUsers = filteredUsers.filter(subject => subject.classSection.termID === selectedSemester);
    }
  
    if (fromAbsence !== 'none' && toAbsence !== 'none') {
      const from = parseInt(fromAbsence);
      const to = parseInt(toAbsence);
      filteredUsers = filteredUsers.filter(subject => subject.totalNullTimes >= from && subject.totalNullTimes <= to);
    }
  
    if (searchKeyword) {
      filteredUsers = filteredUsers.filter(subject =>
        subject.fullName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        subject.userCode.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }
  
    this.setState({ filteredUsers });
  };
  
  
  
  mapLesson = (lesson) => {
    switch (lesson) {
      case 1:
        return '1 - 3';
      case 2:
        return '4 - 6';
      case 3:
        return '7 - 9';
      case 4:
        return '10 - 12';
      case 5:
        return '13 - 15';
      case 6:
        return 'Không có';
      default:
        return lesson;
    }
  };
  handleTKExportAttendance = (teacherID, termID, fromAbsence, toAbsence) => {
    const apiUrl = this.props.userRole === 'Ban chủ nhiệm khoa'
        ? `/api/admin/export-tk-bcnk/${termID}/${fromAbsence}/${toAbsence}`
        : `/api/admin/export-tk-teacher/${teacherID}/${termID}/${fromAbsence}/${toAbsence}`;
  
    const fileName = this.props.userRole === 'Ban chủ nhiệm khoa'
        ? `attendance_BCNK_vang${fromAbsence}-${toAbsence}buoi.xlsx`
        : `attendance_vang${fromAbsence}-${toAbsence}buoi.xlsx`;
  
    axios({
        url: apiUrl,
        method: 'GET',
        responseType: 'blob',
    })
    .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
    })
    .catch((error) => {
        this.showErrorToast("Tải thất bại!");
    });
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
    const { currentPage, subjectsPerPage, filteredUsers, selectedSemester, semesters, fromAbsence, toAbsence } = this.state;
    const offset = currentPage * subjectsPerPage;
    const currentPageUsers = filteredUsers.slice(offset, offset + subjectsPerPage);
  
    return (
      <div>
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1>Thống kê sinh viên vắng theo LHP</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <b><Link to='/admin/home' style={{ color: '#6B63FF' }}>Trang chủ</Link></b>
                  </li>
                  <li className="breadcrumb-item active">Thống kê sinh viên vắng theo LHP</li>
                </ol>
              </div>
            </div>
          </div>
        </section>
        <section className="content">
        {/* CSS INLINE THÊM TRỰC TIẾP */}
        <style>
          {`
            .filter-row {
              display: flex;
              justify-content: space-between;
              align-items: center;
              flex-wrap: wrap;
              margin-bottom: 20px;
            }

            .filter-left {
              display: flex;
              align-items: center;
              gap: 10px;
              flex-wrap: wrap;
            }

            .filter-left select {
              width: auto;
              min-width: 100px;
              font-size: 14px;
            }

            .filter-left .form-group {
              display: flex;
              align-items: center;
              margin-bottom: 0;
            }

            .filter-left .form-group p {
              margin: 0 5px 0 0;
              white-space: nowrap;
              font-weight: 500;
            }

            .excel-btn {
              background-color: #009900 !important;
              border-color: #009900 !important;
              color: #fff !important;
              font-size: 14px;
              border-radius: 4px;
              padding: 6px 12px;
            }

            .select-semester {
              max-width: 160px;
            }
          `}
        </style>

        <div className="card-body">
          <div className="filter-row">
            {/* BÊN TRÁI: Bộ lọc */}
            <div className="filter-left">
              <div className="form-group select-semester">
                <select
                  className="form-control select2"
                  onChange={this.handleSemesterChange}
                  value={selectedSemester}
                >
                  <option value="">Tất cả</option>
                  {semesters.map((semester) => (
                    <option key={semester._id} value={semester._id}>
                      {semester.term}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <p>Vắng từ:</p>
                <select
                  className="form-control select2"
                  onChange={this.handleFromAbsenceChange}
                  value={fromAbsence}
                >
                  <option value="none">Chọn số buổi</option>
                  {[...Array(15).keys()].map((i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <p>đến</p>
                <select
                  className="form-control select2"
                  onChange={this.handleToAbsenceChange}
                  value={toAbsence}
                >
                  <option value="none">Chọn số buổi</option>
                  {[...Array(15).keys()].map((i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
                <span style={{ marginLeft: '5px' }}>buổi</span>
              </div>
            </div>

            {/* BÊN PHẢI: Nút Excel */}
            <button
              type="submit"
              onClick={() =>
                this.handleTKExportAttendance(
                  this.props.userID,
                  selectedSemester,
                  fromAbsence,
                  toAbsence
                )
              }
              className="btn btn-success text-nowrap excel-btn"
            >
              <i className="nav-icon fas fa-file-excel"></i> Xuất excel
            </button>
          </div>
        </div>

        {/* Bảng hiển thị dữ liệu */}
        <div className="card">
          <div className="card-body table-responsive p-0">
            <table className="table table-hover text-nowrap">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Mã lớp</th>
                  <th>Tên môn học</th>
                  <th>Email</th>
                  <th>Mã số SV</th>
                  <th>Họ và tên</th>
                  <th>Số buổi vắng</th>
                </tr>
              </thead>
              <tbody>
                {currentPageUsers.map((user, index) => (
                  <tr key={user._id}>
                    <td>{offset + index + 1}</td>
                    <td>{user.classSection.classCode}</td>
                    <td>{user.classSection.subjectName}</td>
                    <td>{user.email}</td>
                    <td>{user.userCode}</td>
                    <td>{user.fullName}</td>
                    <td>{user.totalNullTimes}/{user.classSection.totalDays}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
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
            pageCount={Math.ceil(filteredUsers.length / subjectsPerPage)}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={this.handlePageClick}
            containerClassName={'pagination'}
            subContainerClassName={'pages pagination'}
            activeClassName={'active'}
          />
        </div>
      </section>

      </div>
    );
  }
  
}
export default TK_StudentClassections;