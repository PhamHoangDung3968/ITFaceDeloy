import React, { Component } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import MyContext from '../contexts/MyContext';
import { Link } from 'react-router-dom';
import '../dist/css/pagination.css';
import '../dist/css/buttonIcon.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class TK_LHPTotalStudent extends Component {
  static contextType = MyContext;
  state = {
    subjects: [],
    semesters: [],
    selectedSemester: '',
    currentPage: 0,
    subjectsPerPage: 10,
    filteredUsers: [],
  };

  componentDidMount() {
    this.apiGetSemesters();
    this.apiGetUsers(this.props.userID);
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
      const response = await axios.get(`/api/admin/classsections/teacher/quantitystudentinday/${teacherID}`);
      const reversedUsers = response.data.reverse();
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
      ? subjects.filter(subject => subject.termID === selectedSemester)
      : subjects;
    this.setState({ filteredUsers });
  };

  handlePageClick = (data) => {
    this.setState({ currentPage: data.selected });
  };
  handleTKExportAttendance = (teacherID) => {
    const apiUrl = `/api/admin/export-tk-totallhp/${teacherID}`;
    const fileName = `total_class_sections.xlsx`;
  
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
      console.error('Error downloading the file:', error);
    });
  };

  render() {
    const { currentPage, subjectsPerPage, filteredUsers, semesters } = this.state;
    const offset = currentPage * subjectsPerPage;
    const currentPageUsers = filteredUsers.slice(offset, offset + subjectsPerPage);

    const userRows = currentPageUsers.map((item, index) => (
        <tr key={item._id}>
          <td>{index + 1}</td>
          <td>{item.classCode}</td>
          <td>{item.subjectName}</td>
          {Array.from({ length: 15 }, (_, i) => (
            <td key={i + 1}>
                <b>{item.datesWithNonNullTimes[i] ? `${item.datesWithNonNullTimes[i].nonNullTimesCount}/${item.totalStudents}` : ''}</b>
            </td>
            ))}
        </tr>
      ));

    return (
      <div>
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1>Thống kê tình hình học theo LHP</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <b><Link to='/admin/home' style={{ color: '#6B63FF' }}>Trang chủ</Link></b>
                  </li>
                  <li className="breadcrumb-item active">Thống kê tình hình học theo LHP</li>
                </ol>
              </div>
            </div>
          </div>
        </section>
        <section className="content">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title" style={{ float: 'right' }}>
                <button
                  type="submit"
                  onClick={() => this.handleTKExportAttendance(this.props.userID)}
                  className="btn btn-success text-nowrap"
                  style={{ marginLeft: '210px', borderRadius: '4px', backgroundColor: '#009900', borderColor: '#009900' }}
                >
                  <i className="nav-icon fas fa-file-excel" onClick={() => this.handleTKExportAttendance(this.props.userID)}></i> Xuất excel
                </button>
             </h3>
              <div className="card-tools" style={{ float: 'left' }}>
                <div className="input-group input-group-sm" style={{ width: '200px' }}>
                  <select className="form-control" value={this.state.selectedSemester} onChange={this.handleSemesterChange}>
                    <option value="">học kỳ</option>
                    {semesters.map((semester) => (
                      <option key={semester._id} value={semester._id}>
                        {semester.term}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="card-body table-responsive p-0">
              <table className="table table-hover text-nowrap">
              <thead>
                <tr>
                    <th>STT</th>
                    <th>Mã lớp</th>
                    <th>Tên lớp</th>
                    {Array.from({ length: 15 }, (_, i) => (
                    <th key={i + 1}>Buổi {i + 1}</th>
                    ))}
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
                  pageCount={Math.ceil(filteredUsers.length / subjectsPerPage)}
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

export default TK_LHPTotalStudent;