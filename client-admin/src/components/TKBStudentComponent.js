import React, { Component } from 'react';
import axios from 'axios';
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
import QrScanner from 'react-qr-scanner';
import Webcam from 'react-webcam';



class TKBStudent extends Component {
  static contextType = MyContext;
  state = {
    subjectterms: [],
    semesters: [],
    selectedSemester: '',
    selectedUser: null,
    selectedSubject: null,
    showModal: false,
    modalMessage: '',
    showScanner: false,
  scanResult: '',
  facingMode: 'environment', // Mặc định là camera sau
    showModal1: false, // Trạng thái để hiển thị modal

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
      const response = await axios.get(`/api/admin/classsections/student/${studentID}`);
      const classSections = response.data;

      // Fetch subjectterms to get the term information
      const subjecttermsResponse = await axios.get('/api/admin/subjectterms');
      const subjectterms = subjecttermsResponse.data;

      // Map class sections to include term information
      const subjecttermsMap = subjectterms.reduce((map, subject) => {
        map[subject._id] = subject.termID;
        return map;
      }, {});

      const classSectionsWithTerms = classSections.map(classSection => ({
        ...classSection,
        termID: subjecttermsMap[classSection.subjecttermID._id]
      }));

      this.setState({ subjectterms: classSectionsWithTerms });
    } catch (error) {
      console.error('Error fetching class sections by teacher ID:', error);
    }
  };

  handleSemesterChange = (e) => {
    const selectedSemester = e.target.value;
    this.setState({ selectedSemester }, () => {
        console.log(this.state.selectedSemester);
    });
};
  handleClassCodeClick = async (classCode) => {
    try {
      const response = await axios.get(`/api/admin/user-by-classcode/${classCode}`);
      if (response.data) {
        this.setState({
          selectedUser: response.data.teacher,
          selectedSubject: response.data.subject,
          showModal: true,
          modalMessage: ''
        });
      } else {
        this.setState({
          selectedUser: null,
          selectedSubject: response.data.subject,
          showModal: true,
          modalMessage: 'Lớp này chưa được đăng ký'
        });
      }
    } catch (error) {
      console.error('Error fetching user by classCode:', error);
      this.setState({
        selectedUser: null,
        selectedSubject: null,
        showModal: true,
        modalMessage: 'Lớp này chưa được đăng ký'
      });
    }
  };

  closeModal = () => {
    this.setState({ showModal: false, selectedUser: null, selectedSubject: null, modalMessage: '' });
  };


  // toggleScanner = () => {
  //   this.setState(prevState => ({ showScanner: !prevState.showScanner, showModal1: !prevState.showModal1 }));
  // };
  
  // handleScan = (data) => {
  //   if (data) {
  //     this.setState({ scanResult: data.text });
  //   }
  // };
  
  // handleError = (err) => {
  //   console.error(err);
  // };
  // switchCamera = () => {
  //   this.setState(prevState => {
  //     const newFacingMode = prevState.facingMode === 'environment' ? 'user' : 'environment';
  //     console.log(`Chuyển đổi camera thành công: ${newFacingMode}`);
  //     return { facingMode: newFacingMode };
  //   });
  // };
  
  // handleCloseModal = () => {
  //   this.setState({ showModal1: false, scanResult: '', showScanner: false });
  // };

  toggleScanner = () => {
    this.setState(prevState => ({ showScanner: !prevState.showScanner, showModal1: !prevState.showModal1 }));
  };
  
  handleScan = (data) => {
    if (data) {
      this.setState({ scanResult: data.text });
    }
  };
  
  handleError = (err) => {
    console.error(err);
  };
  
  switchCamera = () => {
    this.setState(prevState => ({
      facingMode: prevState.facingMode === 'environment' ? 'user' : 'environment'
    }));
  };
  
  handleCloseModal = () => {
    this.setState({ showModal1: false, scanResult: '', showScanner: false });
  };

  render() {
    const { userRole } = this.props; // Get userRole from props
    // const { showScanner, scanResult, facingMode } = this.state;

    const { showScanner, scanResult, facingMode, showModal1 } = this.state;

    const { subjectterms, semesters, selectedSemester, selectedUser, selectedSubject, showModal, modalMessage } = this.state;
    const days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    const periods = ['1-3', '4-6', '7-9', '10-12', '13-15'];

    const lessonToPeriod = {
      1: '1-3',
      2: '4-6',
      3: '7-9',
      4: '10-12',
      5: '13-15'
    };

    const filteredsubjectterms = selectedSemester
      ? subjectterms.filter(subject => subject.termID === selectedSemester)
      : subjectterms;

      const timetable = periods.map(period => (
        <tr key={period} >
          <td style={{backgroundColor: '#FFCCCC'}}>{period}</td>
          {days.map(day => (
            <td key={day} style={{ borderLeft: '1px solid #ddd', verticalAlign: 'top' }}>
              {filteredsubjectterms
                .filter(subject => subject.schoolDay.includes(day) && subject.lesson.some(lesson => lessonToPeriod[lesson] === period))
                .map(subject => (
                  <div key={subject._id} onClick={() => this.handleClassCodeClick(subject.classCode)} style={{ cursor: 'pointer' }}>
                    <div>{subject.classCode}</div>
                    <div style={{ fontSize: 'smaller', color: '#555' }}>{subject.subjecttermID.subjectID.subjectName}</div>
                  </div>
                ))}
              {/* {filteredsubjectterms.filter(subject => subject.schoolDay.includes(day) && subject.lesson.some(lesson => lessonToPeriod[lesson] === period)).length === 0 && (
                <div>N/A</div>
              )} */}
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
                <h1>Thời khóa biểu</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <b><Link to='/admin/home' style={{ color: '#6B63FF' }}>Trang chủ</Link></b>
                  </li>
                  <li className="breadcrumb-item active">Thời khóa biểu</li>
                </ol>
              </div>
            </div>
          </div>
        </section>
        <section className="content">
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
          <div className="card">
            <div className="card-body table-responsive p-0">
              <table className="table table-hover text-nowrap">
                <thead style={{ backgroundColor: '#FFCCCC' }}>
                  <tr>
                    <th>Tiết</th>
                    {days.map(day => (
                      <th key={day}>{day}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {timetable}
                </tbody>
              </table>
            </div>
          </div>
        </section>
        {showModal && (
            <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">THÔNG TIN GV VÀ LỚP HP</h5>
                    <button type="button" className="close" onClick={this.closeModal}>
                      <span>&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    {selectedSubject ? (
                      <>
                        {selectedUser ? (
                          <>
                            <h6>Thông tin giảng viên</h6>
                            <p><strong>Email:</strong> {selectedUser.email}</p>
                            <p><strong>Tên:</strong> {selectedUser.displayName ?? selectedUser.fullName ?? 'N/A'}</p>
                            <p><strong>Số điện thoại:</strong> {selectedUser.phone}</p>
                          </>
                        ) : (
                          <p>{modalMessage}</p>
                        )}
                        <hr></hr>
                        <h6>Thông tin môn học</h6>
                        <p><strong>Tên môn học:</strong> {selectedSubject.subjectName}</p>
                        <p><strong>Mã môn học:</strong> {selectedSubject.subjectCode}</p>
                        <p><strong>Học kỳ:</strong> {selectedSubject.term.term} ({selectedSubject.term.startYear} - {selectedSubject.term.endYear})</p>
                        <p><strong>Ngành:</strong> {selectedSubject.major.majorName} {selectedSubject.major.subMajorName ? `(${selectedSubject.major.subMajorName})` : ''}</p>                      </>
                    ) : (
                      <p>{modalMessage}</p>
                    )}
                  </div>
                  <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <Link type="button" className="btn btn-info" style={{ backgroundColor: '#6B63FF', borderColor: '#6B63FF' }} to={`/admin/attendance-student/${selectedSubject.classCode}`}>Xem kết quả điểm danh</Link>
              </div>
                </div>
              </div>
            </div>
          )}
          {/* {showScanner && (
        <div>
          <QrScanner
            delay={300}
            onError={this.handleError}
            onScan={this.handleScan}
            facingMode={facingMode}
            style={{ width: '100%' }}
          />
          <button onClick={this.switchCamera} className="btn btn-secondary">
            Chuyển đổi camera
          </button>
        </div>
      )} */}
      <button onClick={this.toggleScanner} className="btn btn-primary">
        {showScanner ? 'Đóng máy quét' : 'Quét mã QR'}
      </button>
      {/* {scanResult && (
        <div>
          <p>Kết quả quét: <a href={scanResult} target="_blank" rel="noopener noreferrer">{scanResult}</a></p>
        </div>
      )} */}
      {/* {showModal1 && (
        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.7)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title"><b>Quét mã QR</b></h5>
                <button type="button" className="close" onClick={this.handleCloseModal}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                {showScanner && (
                  <div>
                    <QrScanner
                      delay={300}
                      onError={this.handleError}
                      onScan={this.handleScan}
                      facingMode={facingMode}
                      style={{ width: '100%' }}
                    />
                    <button onClick={this.switchCamera} className="btn btn-secondary">
                      Chuyển đổi camera
                    </button>
                    <p>Chế độ camera hiện tại: {facingMode === 'environment' ? 'Camera sau' : 'Camera trước'}</p>
                  </div>
                )}
                {scanResult && (
                  <div>
                    <p>Kết quả quét: <a href={scanResult} target="_blank" rel="noopener noreferrer">{scanResult}</a></p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )} */}
      {showModal1 && (
        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.7)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title"><b>Quét mã QR</b></h5>
                <button type="button" className="close" onClick={this.handleCloseModal}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                {showScanner && (
                  <div>
                    <Webcam
                      audio={false}
                      screenshotFormat="image/jpeg"
                      videoConstraints={{ facingMode }}
                      style={{ width: '100%' }}
                    />
                    <button onClick={this.switchCamera} className="btn btn-secondary">
                      Chuyển đổi camera
                    </button>
                  </div>
                )}
                {scanResult && (
                  <div>
                    <p>Kết quả quét: <a href={scanResult} target="_blank" rel="noopener noreferrer">{scanResult}</a></p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    
      </div>
    );
  }
}
export default TKBStudent;
