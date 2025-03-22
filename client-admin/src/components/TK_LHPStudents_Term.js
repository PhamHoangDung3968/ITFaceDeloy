import React, { Component } from 'react';
import axios from 'axios';
import MyContext from '../contexts/MyContext';
import { ToastContainer, toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import 'react-toastify/dist/ReactToastify.css';

class TK_LHPStudents_Term extends Component {
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

  apiGetClassSectionsByStudentID = async (studentID) => {
    try {
      const response = await axios.get(`/api/admin/classsections/student/totalstudyday/${studentID}`);
      const classSections = response.data;

      this.setState({ subjectterms: classSections, filteredSubjectterms: classSections }, this.filterClassSectionsBySemester);
    } catch (error) {
      console.error('Error fetching class sections by student ID:', error);
    }
  };

  handleSemesterChange = (e) => {
    const selectedSemester = e.target.value;
    this.setState({ selectedSemester }, this.filterClassSectionsBySemester);
  };

  filterClassSectionsBySemester = () => {
    const { subjectterms, selectedSemester } = this.state;
    console.log('Selected Semester:', selectedSemester);
    const filteredSubjectterms = selectedSemester
      ? subjectterms.filter(section => section.subjecttermID.termID === selectedSemester)
      : subjectterms;
    console.log('Filtered Subject Terms:', filteredSubjectterms);
    this.setState({ filteredSubjectterms });
  };

  render() {
    const { filteredSubjectterms, selectedSemester, semesters } = this.state;

    const data = (totalDays, totalDaysWithNullTime) => ({
      datasets: [
        {
          data: [100 - (totalDaysWithNullTime / totalDays) * 100, (totalDaysWithNullTime / totalDays) * 100],
          backgroundColor: ['#36A2EB','#FF6384'],
          hoverBackgroundColor: ['#36A2EB', '#FF6384']
        }
      ],
    });

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
                <h1>Thống kê lớp học phần</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <b><Link to='/admin/home' style={{ color: '#6B63FF' }}>Trang chủ</Link></b>
                  </li>
                  <li className="breadcrumb-item active">Thống kê lớp học phần</li>
                </ol>
              </div>
            </div>
          </div>
        </section>
      
        <div className="content">
          <div className="row">
            <div className="col-12 col-sm">
              <div className="form-group">
                <label>Học kỳ:</label>
                <select className="form-control select2 select2-danger" data-dropdown-css-class="select2-danger" style={{ width: '100%' }} onChange={this.handleSemesterChange} value={selectedSemester}>
                  <option value="">Tất cả</option>
                  {semesters.map(semester => (
                    <option key={semester._id} value={semester._id}>{semester.term}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="row">
            {filteredSubjectterms.map((section, index) => (
              <div className="col-md-4" key={index}>
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title"><b>{section.classCode} ({section.subjecttermID.subjectID.subjectName})</b></h3>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-8">
                        <div className="chart-responsive">
                          <Pie data={data(section.totalDays, section.totalDaysWithNullTime)} options={options} />
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

                    </div>
                  </div>
                  <div className="card-footer p-0">
                    <ul className="nav nav-pills flex-column">
                      <li className="nav-item">
                        <a className="nav-link">
                          Số buổi đã tham gia
                          <span className="float-right text-danger">
                            {section.totalDays - section.totalDaysWithNullTime}/{section.totalDays}</span>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <ToastContainer />
        </div>
      </div>
    );
  }
}

export default TK_LHPStudents_Term;