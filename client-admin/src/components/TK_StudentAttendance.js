import React, { Component } from 'react';
import axios from 'axios';
import MyContext from '../contexts/MyContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactPaginate from 'react-paginate';

class TK_StudenAttendance extends Component {
  static contextType = MyContext;

  state = {
    subjectterms: [],
    filteredSubjectterms: [],
    semesters: [],
    selectedSemester: '',
    currentPage: 0,
    itemsPerPage: 10,
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
      const response = await axios.get(`/api/admin/classsections/bcnk/quantitystudentinday`);
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
    const filteredSubjectterms = selectedSemester
      ? subjectterms.filter(section => section.termID === selectedSemester)
      : subjectterms;
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
      url: `/api/admin/export-tk-bcnk-totallhp`,
      method: 'GET',
      responseType: 'blob',
    })
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `total_average_class_sections.xlsx.xlsx`);
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
    const indexOfLastItem = (currentPage + 1) * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredSubjectterms.slice(indexOfFirstItem, indexOfLastItem);

    const calculateAverage = (datesWithNonNullTimes) => {
      const totalNonNullTimes = datesWithNonNullTimes.reduce((sum, entry) => sum + entry.nonNullTimesCount, 0);
      const totalDates = datesWithNonNullTimes.length;
      return totalDates > 0 ? (totalNonNullTimes / totalDates).toFixed(2) : 'Chưa có dữ liệu';
    };
    
    const userRows = currentItems.map((section, index) => (
      <tr key={index}>
        <td>{indexOfFirstItem + index + 1}</td>
        <td>{section.classCode}</td>
        <td>{section.subjectName}</td>
        <td>{calculateAverage(section.datesWithNonNullTimes)}/<b>{section.totalStudents} sinh viên</b></td>
      </tr>
    ));

    return (
      <div>
        <div className="content">
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label>Học kỳ</label>
                  <select className="form-control select2" style={{ width: '100%' }} onChange={this.handleSemesterChange} value={selectedSemester}>
                    <option value="">Tất cả</option>
                    {semesters.map(semester => (
                      <option key={semester._id} value={semester._id}>{semester.term}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Tìm kiếm</label>
                  <input type="text" className="form-control" placeholder="Tìm kiếm" style={{ width: '100%' }} value={searchKeyword} onChange={this.handleSearchChange} />
                </div>
              </div>
              <div className="col-md-12">
                <div className="form-group">
                  <p>
                    <button
                      className="btn btn-success"
                      style={{ backgroundColor: '#009900', borderColor: '#6B63FF', color: '#ffffff', borderRadius: '4px', marginLeft: '20px' }}
                      onClick={this.handleTKExportAttendance}
                    >
                      <i className="nav-icon fas fa-file-excel"></i> Xuất Excel
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-body table-responsive p-0">
              <table className="table table-hover text-nowrap">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Mã lớp</th>
                    <th>Tên lớp</th>
                    <th>Số lượng SV <br></br>tham gia trung bình</th>
                  </tr>
                </thead>
                <tbody>
                {userRows}

                </tbody>
              </table>
              <div className="pagination-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '20px 0' }}>
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
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    );
  }
}

export default TK_StudenAttendance;