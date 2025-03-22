import React, { Component } from 'react';
import axios from 'axios';
import MyContext from '../contexts/MyContext';
import { ToastContainer, toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import ReactPaginate from 'react-paginate';
import 'chart.js/auto';
import 'react-toastify/dist/ReactToastify.css';
import IonIcon from '@reacticons/ionicons';


class TK_StudenAbsent extends Component {
  static contextType = MyContext;

  state = {
    subjectterms: [],
    filteredSubjectterms: [],
    semesters: [],
    selectedSemester: '',
    selectedUser: null,
    selectedSubject: null,
    showModal: false,
    modalMessage: '',
    currentPage: 0,
    itemsPerPage: 24,
    searchKeyword: '',

  };

  componentDidMount() {
    this.apiGetSemesters();
    this.apiGetClassSectionsByStudentID(this.props.userID);
  }

  apiGetSemesters = async () => {
    try {
      const response = await axios.get('/api/admin/terms');
      const semesters = response.data;
      const largestTerm = semesters.reduce((max, term) => term.term > max.term ? term : max, semesters[0]);
      this.setState({ semesters, selectedSemester: largestTerm._id }, this.filterClassSectionsBySemester);
    } catch (error) {
      console.error('Error fetching semesters:', error);
    }
  };

  apiGetClassSectionsByStudentID = async () => {
    try {
      const response = await axios.get(`/api/admin/classsections/allstudent/totalstudyday`);
      const classSections = response.data;

      this.setState({ subjectterms: classSections, filteredSubjectterms: classSections }, this.filterClassSectionsBySemester);
    } catch (error) {
      console.error('Error fetching class sections by student ID:', error);
    }
  };

  handlePageClick = (data) => {
    this.setState({ currentPage: data.selected });
  };
    handleSemesterChange = (e) => {
    const selectedSemester = e.target.value;
    this.setState({ selectedSemester }, this.filterClassSectionsBySemester);
  };
  handleSearchChange = (e) => {
    const searchKeyword = e.target.value;
    this.setState({ searchKeyword }, this.filterClassSectionsBySearch);
  };

  filterClassSectionsBySemester = () => {
    const { subjectterms, selectedSemester } = this.state;
    console.log('Selected Semester:', selectedSemester);
    const filteredSubjectterms = selectedSemester
      ? subjectterms.filter(section => section.termID === selectedSemester)
      : subjectterms;
    console.log('Filtered Subject Terms:', filteredSubjectterms);
    this.setState({ filteredSubjectterms });
  };

  filterClassSectionsBySearch = () => {
    const { subjectterms, searchKeyword } = this.state;
    const filteredSubjectterms = searchKeyword
      ? subjectterms.filter(section => section.classCode.toLowerCase().includes(searchKeyword.toLowerCase()) || section.subjectName.toLowerCase().includes(searchKeyword.toLowerCase()))
      : subjectterms;
    this.setState({ filteredSubjectterms });
  };
  handleTKExportAttendance = () => {
    axios({
      url: `/api/admin/export-tk-average-absent`,
      method: 'GET',
      responseType: 'blob',
    })
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `attendance_AverageAbsent.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    })
    .catch((error) => {
      console.error('Error downloading the file:', error);
    });
  };

  render() {
    const { filteredSubjectterms, currentPage, itemsPerPage, selectedSemester, semesters, searchKeyword } = this.state;
// Tính toán các mục cần hiển thị dựa trên trang hiện tại
const indexOfLastItem = (currentPage + 1) * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;
const currentItems = filteredSubjectterms.slice(indexOfFirstItem, indexOfLastItem);

const data = (totalStudents, totalNullTimes,totalDays) => {
  const percentage1 = (100 - ((totalNullTimes / totalStudents) / totalDays) * 100).toFixed(2);
  const percentage2 = (((totalNullTimes / totalStudents) / totalDays) * 100).toFixed(2);

  return {
    datasets: [
      {
        data: [percentage1, percentage2],
        backgroundColor: ['#36A2EB','#FF6384'],
        hoverBackgroundColor: ['#36A2EB','#FF6384']
      }
    ],
  };
};

    const options = {
      responsive: true,
      maintainAspectRatio: false
    };

    return (
      <div>
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1>Thống kê tỉ lệ SV vắng</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <b><Link to='/admin/home' style={{ color: '#6B63FF' }}>Trang chủ</Link></b>
                  </li>
                  <li className="breadcrumb-item active">Thống kê tỉ lệ SV vắng</li>
                </ol>
              </div>
            </div>
          </div>
        </section>
        <div className="content">
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label>Học kỳ</label>
                  <select class="form-control select2" style={{'width': '100%'}} onChange={this.handleSemesterChange} value={selectedSemester}>
                  <option value="">Tất cả</option>
                  {semesters.map(semester => (
                    <option key={semester._id} value={semester._id}>{semester.term}</option>
                  ))}
                  </select>
                </div>
                
              </div>
              <div class="col-md-6">
                <div class="form-group">
                    <label>Tìm kiếm</label>
                    <input type="text" class="form-control" placeholder="Tìm kiếm" style={{'width': '100%'}} value={searchKeyword} onChange={this.handleSearchChange}/>
                </div>
                </div>
                <div class="col-md-12">
                <div class="form-group">
                  <p><IonIcon name="pencil-outline" style={{ fontSize: '16px', marginRight: '5px',marginTop:'-7px' }} />Lưu ý: Dưới đây là biểu đồ tròn minh họa tỉ lệ phần trăm SV vắng mặt trung bình so với phần trăm tham gia trung bình của một LHP &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <button
                            className="btn btn-success"
                            style={{ backgroundColor: '#009900', borderColor: '#6B63FF' ,color: '#ffffff', borderRadius: '4px' }}
                            onClick={() => this.handleTKExportAttendance()}
                          >
                            <i className="fas fa" style={{
                              fontFamily: 'Roboto, Arial, sans-serif',
                              fontSize: '16px',
                              fontWeight: '400',
                            }}><i className="nav-icon fas fa-file-excel"></i> Xuất Excel</i>
                          </button>
                  </p>
                </div>
                
              </div>
              
                
                {/* <h6>Lưu ý: Dưới đây là biểu đồ tròn minh họa tỉ lệ phần trăm sinh viên vắng mặt trung bình so với phần trăm có mặt của một lớp học phần</h6> */}
            </div>
          </div>
          
          <div className="row">
            {currentItems.map((section, index) => (
              <div className="col-md-4" key={index}>
                <div className="card">
                  <div className="card-header">
                    {/* <h3 className="card-title"><b>{section.classCode} ({section.subjectName})</b></h3> */}
                    <h3 className="card-title" title={section.subjectName}>
                      <b>{section.classCode} ({section.subjectName})</b>
                    </h3>

                    <style jsx>{`
                      .card-title {
                        display: -webkit-box;
                        -webkit-line-clamp: 2; /* Number of lines to show */
                        -webkit-box-orient: vertical;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        min-height: 3em; /* Adjust based on your line height */
                        line-height: 1.5em; /* Adjust based on your font size */
                      }
                    `}</style>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-8">
                        <div className="chart-responsive">
                          {/* <Pie data={data(section.totalDays, section.totalDaysWithNullTime)} options={options} /> */}
                          {section.totalStudents === 0 || section.totalNullTimes === 0 ? (
                            <p></p>
                          ) : (
                            <Pie data={data(section.totalStudents, section.totalNullTimes, section.totalDays)} options={options} />
                          )}
                        </div>
                        <br></br>
                      </div>
                      <div className="col-md-4">
                      <ul className="chart-legend clearfix">
                        <li style={{ marginLeft: '-40px' }}>
                          <i className="fas fa-square text-danger" style={{ marginLeft: '5px', marginRight: '10px' }}></i>
                          % ngày vắng
                        </li>
                        <li style={{ marginLeft: '-40px' }}>
                          <i className="fas fa-square text-blue" style={{ marginLeft: '5px', marginRight: '10px', color:'#36A2EB' }}></i>
                          % ngày có mặt
                        </li>
                      </ul>
                    </div>
                      <p style={{ textAlign:'center' }}></p>
                    </div>
                  </div>
                  <div className="card-footer p-0">
                    <ul className="nav nav-pills flex-column">
                      <li className="nav-item">
                      {section.totalNullTimes && section.totalStudents ? (
                        <a className="nav-link">
                          Số lượng SV vắng trung bình
                          <span className="float-right text-danger">
                              {(section.totalNullTimes / section.totalStudents).toFixed(2)}/{section.totalStudents}
                            </span>
                        </a>
                        ) : (
                          ''
                      )}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
                  pageCount={Math.ceil(filteredSubjectterms.length / itemsPerPage)}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={5}
                  onPageChange={this.handlePageClick}
                  containerClassName={'pagination'}
                  subContainerClassName={'pages pagination'}
                  activeClassName={'active'}
                />
            </div>
          <ToastContainer />
        </div>
      </div>
    );
  }
}

export default TK_StudenAbsent;