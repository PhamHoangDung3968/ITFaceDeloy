import React, { Component } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import MyContext from '../contexts/MyContext';
import { Link } from 'react-router-dom';
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
import IonIcon from '@reacticons/ionicons';

class TeacherAssignmentsDetail extends Component {
  static contextType = MyContext;
  state = {
    users: [],
    subjectterms: [],
    currentPage: 0,
    usersPerPage: 10,
    searchKeyword: '',
    filteredUsers: [],
    showModal1: false,
    selectedUser: null,
    modalCurrentPage: 0,
    itemsPerPage: 3,
    modalSearchKeyword: '',
    filteredClassSections: [],
    originalClassSections: [],
    teacherInfo: null,
    selectedSemester: '',
    selectedSemester1: '', // Change this line
    semesters: [], // Add this line
  };

  componentDidMount() {
    this.apiGetUsers();
    this.apiGetSemesters();
    this.apiGetSemesters1();
    this.filterClassSectionsBySemester(); // Add this line

  }
  // apiGetUsers = async () => {
  //   try {
  //     const response = await axios.get('/api/admin/users/lecturer/registed');
  //     const usersWithClassSections = await Promise.all(response.data.map(async (user) => {
  //       const classSectionsResponse = await axios.get(`/api/admin/teacherassignments/teacher/getall/${user._id}`);
  //       return {
  //         ...user,
  //         hasClassSections: classSectionsResponse.data.classSections.length > 0
  //       };
  //     }));
  //     this.setState({ users: usersWithClassSections.reverse(), filteredUsers: usersWithClassSections });
  //   } catch (error) {
  //     console.error('Error fetching users:', error);
  //   }
  // };

  apiGetUsers = async () => {
    try {
      const response = await axios.get('/api/admin/users/lecturer/registed');
      const users = response.data;
  
      const classSectionsPromises = users.map(user =>
        axios.get(`/api/admin/teacherassignments/teacher/getall/${user._id}`)
      );
  
      const classSectionsResponses = await Promise.all(classSectionsPromises);
  
      const usersWithClassSections = users.map((user, index) => ({
        ...user,
        hasClassSections: classSectionsResponses[index].data.classSections.length > 0
      }));
  
      this.setState({ users: usersWithClassSections.reverse(), filteredUsers: usersWithClassSections });
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
  
  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value }, () => {
      if (e.target.name === 'modalSearchKeyword') {
        this.handleModalSearch();
      }
    });
  };

  handleSearch = () => {
    const { searchKeyword, users } = this.state;
    const filteredUsers = users.filter(user => 
      user.email.toLowerCase().includes(searchKeyword.toLowerCase())
    );
    this.setState({ filteredUsers, currentPage: 0 });
  };

  handleModalSearch = () => {
    const { modalSearchKeyword, originalClassSections } = this.state;
    const keyword = modalSearchKeyword.toLowerCase();
  
    const filteredSections = originalClassSections.filter(section => {
      const classCode = section.classCode ? String(section.classCode).toLowerCase() : '';
      const schoolDay = section.schoolDay ? String(section.schoolDay).toLowerCase() : '';
      const lesson = section.lesson ? String(section.lesson).toLowerCase() : '';
  
      return (
        classCode.includes(keyword) ||
        schoolDay.includes(keyword) ||
        lesson.includes(keyword)
      );
    });
  
    this.setState({
      filteredClassSections: filteredSections,
      modalCurrentPage: 0
    });
  };
  

  handlePageClick = (data) => {
    this.setState({ currentPage: data.selected });
  };

  handleModalPageClick = (data) => {
    this.setState({ modalCurrentPage: data.selected });
  };

  handleSemesterChange = (e) => {
    const selectedSemester = e.target.value;
    this.setState({ selectedSemester }, this.filterClassSectionsBySemester);
  };
  
  handleViewUser = async (user) => {
    try {
      const response = await axios.get(`/api/admin/teacherassignments/teacher/getall/${user._id}`);
      const classSections = response.data.classSections;
  
      this.setState({
        selectedUser: user,
        showModal1: true,
        originalClassSections: classSections,
        teacherInfo: response.data.teacher
      }, this.filterClassSectionsBySemester);
    } catch (error) {
      console.error('Error fetching class sections:', error);
    }
  };
  closeModal = () => {
    this.setState({ showModal1: false, selectedUser: null, teacherInfo: null });
  };
  // handleSemesterChange1 = (e) => {
  //   const selectedSemester1 = e.target.value;
  //   console.log('Selected Semester:', selectedSemester1); // Add this line
  //   this.setState({ selectedSemester1 }, this.filterUsersBySemester1);
  // };
  
  // filterUsersBySemester1 = () => {
  //   const { users, selectedSemester1 } = this.state;
  //   console.log('Users:', users); // Add this line
  //   console.log('Selected Semester in filter:', selectedSemester1); // Add this line
  //   const filteredUsers = selectedSemester1
  //     ? users.filter(user => user.termIDs.includes(selectedSemester1))
  //     : users;
  //   console.log('Filtered Users:', filteredUsers); // Add this line
  //   this.setState({ filteredUsers, currentPage: 0 });
  // };

  handleSemesterChange1 = (e) => {
    const selectedSemester1 = e.target.value;
    console.log('Selected Semester:', selectedSemester1); // Add this line
    this.setState({ selectedSemester1 }, this.filterUsersBySemester1);
  };
  
  filterUsersBySemester1 = () => {
    const { users, selectedSemester1 } = this.state;
    console.log('Users:', users); // Add this line
    console.log('Selected Semester in filter:', selectedSemester1); // Add this line
    const filteredUsers = selectedSemester1
      ? users.filter(user => user.termIDs.includes(selectedSemester1))
      : users;
    console.log('Filtered Users:', filteredUsers); // Add this line
    this.setState({ filteredUsers, currentPage: 0 });
  };
  
  handleDeleteClassSection = async (teacherID, classsectionID) => {
    if (window.confirm('Xác nhận xóa?')) {
      try {
        await axios.delete(`/api/admin/teacherassignments/removeclasssection/${teacherID}/${classsectionID}`);
        this.setState(prevState => ({
          filteredClassSections: prevState.filteredClassSections.filter(section => section._id !== classsectionID)
        }));
      } catch (error) {
        console.error('Error deleting class section:', error);
      }
    }
  };
  // apiGetSemesters = async () => {
  //   try {
  //     const response = await axios.get('/api/admin/terms');
  //     this.setState({ semesters: response.data });
  //   } catch (error) {
  //     console.error('Error fetching semesters:', error);
  //   }
  // };


  apiGetSemesters = async () => {
    try {
      const response = await axios.get('/api/admin/terms');
      const semesters = response.data;
      const largestTerm = semesters.reduce((max, term) => term.term > max.term ? term : max, semesters[0]);
      this.setState({ semesters, selectedSemester1: largestTerm._id }, this.filterUsersBySemester1);
    } catch (error) {
      console.error('Error fetching semesters:', error);
    }
  };
  apiGetSemesters1 = async () => {
    try {
      const response = await axios.get('/api/admin/terms');
      const semesters = response.data;
      const largestTerm = semesters.reduce((max, term) => term.term > max.term ? term : max, semesters[0]);
      this.setState({ semesters, selectedSemester: largestTerm._id }, this.filterClassSectionsBySemester);
    } catch (error) {
      console.error('Error fetching semesters:', error);
    }
  };
  // filterClassSectionsBySemester = () => {
  //   const { originalClassSections, selectedSemester } = this.state;
  
  //   console.log('Selected Semester:', selectedSemester);
  //   console.log('Original Class Sections:', originalClassSections);
  
  //   const filteredClassSections = selectedSemester
  //     ? originalClassSections.filter(section => section.subjecttermID.termID === selectedSemester)
  //     : originalClassSections;
  
  //   console.log('Filtered Class Sections:', filteredClassSections);
  
  //   this.setState({ filteredClassSections, modalCurrentPage: 0 });
  // };
  filterClassSectionsBySemester = () => {
    const { originalClassSections, selectedSemester } = this.state;
  
    console.log('Selected Semester:', selectedSemester);
    console.log('Original Class Sections:', originalClassSections);
  
    const filteredClassSections = selectedSemester
      ? originalClassSections.filter(section => section.subjecttermID.termID === selectedSemester)
      : originalClassSections;
  
    console.log('Filtered Class Sections:', filteredClassSections);
  
    this.setState({ filteredClassSections, modalCurrentPage: 0 });
  };
  mapLesson = (lesson) => {
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
      default:
        return lesson;
    }
  };

  render() {
    const { currentPage, usersPerPage, filteredUsers, subjectterms,semesters, selectedSemester,showModal1, selectedUser, modalCurrentPage, itemsPerPage, filteredClassSections, teacherInfo } = this.state;
    const offset = currentPage * usersPerPage;
    const currentPageUsers = filteredUsers.slice(offset, offset + usersPerPage);
    const { userRole } = this.props;

    const userRows = currentPageUsers.map((item, index) => (
      <tr key={item._id}>
        <td>{offset + index + 1}</td>
        <td>{item.userCode}</td>
        <td>{item.fullName}</td>
        <td>{item.email}</td>
        <td>{item.phone || "Chưa cập nhật"}</td>
        <td>
          <div className="action-buttons">
           {item.hasClassSections && (
            <IonIcon 
              name="file-tray-full-outline" 
              className="icon-button"
              onClick={() => this.handleViewUser(item)} 
              style={{ fontSize: '20px', height: '1em', width: '1.3em', padding: '1px 4px', color: '#009900' }}
            />            
          )}
          </div>
        </td>
      </tr>
    ));
    const filteredsubjectterms = selectedSemester
  ? subjectterms.filter(subject => subject.termID === selectedSemester)
  : subjectterms;

const combinedItems = [...filteredClassSections, ...filteredsubjectterms];

const modalOffset = modalCurrentPage * itemsPerPage;
const currentModalItems = combinedItems.slice(modalOffset, modalOffset + itemsPerPage);

    return (
      <div>
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1>Danh sách GV - LHP</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <b><Link to='/admin/home' style={{color: '#6B63FF'}}>Trang chủ</Link></b>
                  </li>
                  <li className="breadcrumb-item active">Giảng viên phân công</li>
                </ol>
              </div>
            </div>
          </div>
        </section>
        <section className="content">
          <div className="card">
            <div className="card-header">
            <h3 className="card-title" style={{ lineHeight: '1.6' }}>
              Danh sách giảng viên
            </h3>
            <div className="card-tools" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
  <div className="input-group input-group-sm" style={{ width: '200px' }}>
    <input
      type="text"
      className="form-control float-right"
      placeholder="Tìm kiếm"
      name="searchKeyword"
      value={this.state.searchKeyword}
      onChange={this.handleInputChange}
    />
    <div className="input-group-append">
      <button type="submit" className="btn btn-default" onClick={this.handleSearch}>
        <i className="fas fa-search"></i>
      </button>
    </div>
  </div>
  <select
    className="form-control"
    style={{ width: '150px',height: 'calc(2rem)'}}
    value={this.state.selectedSemester1}
    onChange={this.handleSemesterChange1}
  >
    <option value="">Chọn học kỳ</option>
    {this.state.semesters.map(semester => (
      <option key={semester._id} value={semester._id}>{semester.term}</option>
    ))}
  </select>
</div>

            </div>
           
            <div className="card-body table-responsive p-0">
              <table className="table table-hover text-nowrap">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Mã số</th>
                    <th>Tên GV</th>
                    <th>Email</th>
                    <th>Số điện thoại</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {userRows}
                </tbody>
              </table>
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
                  pageCount={Math.ceil(filteredUsers.length / usersPerPage)}
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
        {showModal1 && selectedUser && (
          <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Thông tin giảng viên</h5>
                  <button type="button" className="close" onClick={this.closeModal}>
                    <span>&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  {teacherInfo && (
                    <>
                      <p><strong>Email:</strong> {teacherInfo.email}</p>
                      <p><strong>Tên:</strong> {teacherInfo.fullName}</p>
                      <p><strong>Số điện thoại:</strong> {teacherInfo.phone}</p>
                    </>
                  )}
                  <section className="content">
                    <div className="card">
                      <div className="card-header">
                      
                      <div className="card-tools" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="form-group">
                          <select className="form-control select2 select2-danger" data-dropdown-css-class="select2-danger" style={{ width: '100%',marginTop:'9px'}} onChange={this.handleSemesterChange} value={selectedSemester}>
                            <option value="">Tất cả</option>
                            {semesters.map(semester => (
                              <option key={semester._id} value={semester._id}>{semester.term}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="input-group input-group-sm" style={{ width: '200px' }}>
                        <input type="text" className="form-control float-right" placeholder="Tìm kiếm" name="modalSearchKeyword" value={this.state.modalSearchKeyword} onChange={this.handleInputChange} style={{ borderRadius: '4px 0 0 4px' }} />
                        <div className="input-group-append">
                          <button type="submit" className="btn btn-default" onClick={this.handleModalSearch} style={{ borderRadius: '0 4px 4px 0', marginLeft: '-1px' }}>
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
                              <th>Mã lớp</th>
                              <th>Thứ học</th>
                              <th>Tiết</th>
                              <th></th>
                            </tr>
                          </thead>

                          <tbody>
          {currentModalItems.map((section, index) => (
            <tr key={index}>
              <td title={section.subjecttermID.subjectID.subjectName}>{section.classCode}</td>
              <td title={section.subjecttermID.subjectID.subjectName}>{section.schoolDay.map(day => <div key={day}>{day}</div>)}</td>
              <td title={section.subjecttermID.subjectID.subjectName}>{section.lesson.map(lesson => <div key={lesson}>{this.mapLesson(lesson)}</div>)}</td>
              <td>
              <div className="action-buttons" >
              <Link to={`/admin/classsections/detail/${section.classCode}`} className="icon-button">
          <span>
            <IonIcon name="people-outline" style={{ fontSize: '20px', height: '1em', width: '1.3em', padding: '1px 4px' }} />
          </span>
        </Link>
        {userRole !== 'Giảng viên' && userRole !== 'Sinh viên'  && (
                <>
<button
                  className="icon-button delete far fa-trash-alt"
                  onClick={() => this.handleDeleteClassSection(selectedUser._id, section._id)}
                ></button>
                </>
              )}
          
          </div>
              
                
              </td>
            </tr>
          ))}
        </tbody>
                        </table>
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
                            pageCount={Math.ceil(filteredClassSections.length / itemsPerPage)}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={5}
                            onPageChange={this.handleModalPageClick}
                            containerClassName={'pagination'}
                            subContainerClassName={'pages pagination'}
                            activeClassName={'active'}
                          />
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default TeacherAssignmentsDetail;