import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

import ReactPaginate from 'react-paginate';
import IonIcon from '@reacticons/ionicons';
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
import QRCode from 'qrcode.react';
import { QRCodeCanvas } from 'qrcode.react';

const ClassSectionDetail = ({ userRole }) => {
  const [classcode, setClasscode] = useState('');
  const [classSections, setClassSections] = useState([]);
  const [subjectInfo, setSubjectInfo] = useState({ lesson: [] });
  const [currentPage, setCurrentPage] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [qrCodeValue, setQrCodeValue] = useState('');
  const [runtime, setRuntime] = useState(null);
  const [addedEmails, setAddedEmails] = useState([]);
  const [duplicateEmails, setDuplicateEmails] = useState([]);
  const [addedSubjectCodes, setAddedSubjectCodes] = useState([]);
  const [addedSubjectTermCodes, setAddedSubjectTermCodes] = useState([]);
  const [addedClassCodes, setAddedClassCodes] = useState([]);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [totalRowsChanged, setTotalRowsChanged] = useState(0);
  const [totalRowsAdded, setTotalRowsAdded] = useState(0);

  const [showModalImport, setShowModalImport] = useState(false);
  const [showModalKQIm, setShowModalKQIm] = useState(false); // Thêm trạng thái showModal
  const [showAddedEmails, setShowAddedEmails] = useState(false); // Thêm trạng thái showAddedEmails
  const [showDuplicateEmails, setShowDuplicateEmails] = useState(false); // Thêm trạng thái showDuplicateTeachers
  const [addedEmailsCount, setAddedEmailsCount] = useState(0); // Thêm trạng thái addedEmailsCount
  const [duplicateEmailsCount, setDuplicateEmailsCount] = useState(0); // Thêm trạng thái duplicateTeachersCount
  const [showModalProfile, setShowModalProfile] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [expandedClassCode, setExpandedClassCode] = useState(null);
  const [newClassSection, setNewClassSection] = useState({
    classCode: '',
    schoolDay: [],
    lesson: [],
    classType: 0,
    classcode: classcode // Include classcode in the initial state
  });
  const [editClassSection, setEditClassSection] = useState({
    _id: '',
    classCode: '',
    schoolDay: [],
    lesson: [],
    classType: 0,
    classcode: classcode
  });
  const sectionsPerPage = 10;

  const daysOptions = [
    { value: 'Thứ 2', label: 'Thứ 2' },
    { value: 'Thứ 3', label: 'Thứ 3' },
    { value: 'Thứ 4', label: 'Thứ 4' },
    { value: 'Thứ 5', label: 'Thứ 5' },
    { value: 'Thứ 6', label: 'Thứ 6' },
    { value: 'Thứ 7', label: 'Thứ 7' },
    { value: 'Chủ nhật', label: 'Chủ nhật' }
  ];
  

  const lessonOptions = [
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
    { value: 4, label: '4' },
    { value: 5, label: '5' },
  ];

  const classTypeOptions = [
    { value: 0, label: 'Lý thuyết' },
    { value: 1, label: 'Thực hành' }
  ];
  useEffect(() => {
    const interval = setInterval(() => {
      setQrCodeValue(`https://elearning.vlu.edu.vn/${Math.random().toString(36).substring(7)}`);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

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
  
  const apiGetClassSections = async () => {
    try {
      const response = await axios.get(`/api/admin/studentclass/allstudent/${classcode}`);
      console.log('All students response:', response.data); // Log the response for all students
      setClassSections(response.data);
  
      const subjectResponse = await axios.get(`/api/admin/studentclass/allvalue/${classcode}`);
      console.log('Subject info response:', subjectResponse.data); // Log the response for subject info
      setSubjectInfo(subjectResponse.data);
    } catch (error) {
      console.error('Error fetching class sections:', error);
    }
  };

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await axios.delete(`/api/admin/studentclass/remove/${classcode}/${deleteId}`);
        setClassSections(prevSections => prevSections.filter(section => section._id !== deleteId));
        showToast('Xóa sinh viên thành công');
        setShowModalDelete(false); // Close the modal after deletion
      } catch (error) {
        console.error('Error deleting student:', error);
        showErrorToast('Xóa sinh viên thất bại');
      }
    }
  };

  const openDeleteModal = (id) => {
    setDeleteId(id);
    setShowModalDelete(true);
  };

  const closeDeleteModal = () => {
    setShowModalDelete(false);
    setDeleteId(null);
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value);
  };
  const openProfileModal = (user) => {
    setSelectedUser(user);
    setShowModalProfile(true);
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
      default:
        return lesson;
    }
  };

  const mapClassType = (classType) => {
    return classType === 0 ? 'Lý thuyết' : 'Thực hành';
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
        const handleAddEmail = async () => {
  // Trim leading and trailing spaces from the email
  const trimmedEmail = newEmail.trim();

  // Check if the email field is empty
  if (!trimmedEmail) {
    showErrorToast('Email không được bỏ trống');
    return;
  }

  // Check if the email already exists in the classSections array
  const emailExists = classSections.some(section => section.email === trimmedEmail);

  if (emailExists) {
    showErrorToast('Email đã tồn tại');
    return;
  }

  try {
    const response = await axios.post(`/api/admin/studentclass/${classcode}`, { email: trimmedEmail, classcode });
    showToast('Thêm email thành công');
    setNewEmail(''); // Clear the input field
    apiGetClassSections(); // Reload the list of class sections
  } catch (error) {
    console.error('Error adding email:', error);
    showErrorToast('Thêm email thất bại');
  }
};
const openImportModal = () => {
  setShowModalImport(true);
};

const closeImportModal = () => {
  setShowModalImport(false);
};

const handleFileChange = (event) => {
  setFile(event.target.files[0]);
};


const handleFileUpload = () => {
  setIsLoading(true); // Start loading effect
  const formData = new FormData();
  formData.append('file', file);

  axios.post(`/api/admin/upload/student/${classcode}`, formData)
    .then(response => {
      console.log('Upload response:', response.data);
      setFile(null); // Clear file after successful upload
      setIsLoading(false); // End loading effect
      setRuntime(response.data.runtime);
      setTotalRowsChanged(response.data.totalRowsChanged);
      setAddedEmails(response.data.addedEmails);
      setDuplicateEmails(response.data.duplicateEmails);
      setAddedEmailsCount(response.data.addedEmails.length); // Update addedEmailsCount
      setDuplicateEmailsCount(response.data.duplicateEmails.length); // Update duplicateEmailsCount
      setShowModalKQIm(true); // Show the result modal
      setTotalRowsAdded(response.data.totalRowsAdded);
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Reset file input
      }
      showToast('Upload file thành công');
      apiGetClassSections(); // Reload the list of class sections
    })
    .catch(error => {
      console.error('Đã xảy ra lỗi khi tải tệp lên!', error);
      if (error.response) {
        console.error('Server responded with:', error.response.data);
      }
      setIsLoading(false); // End loading effect
      showErrorToast('Upload file thất bại');
    });
};
const closeModalKQIM = () => {
  setShowModalKQIm(false);
};

const toggleAddedEmails = () => {
  setShowAddedEmails(prevState => !prevState);
};

const toggleDuplicateEmails = () => {
  setShowDuplicateEmails(prevState => !prevState);
};

const formatRuntime = (milliseconds) => {
const totalSeconds = Math.floor(milliseconds / 1000);
const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
const seconds = (totalSeconds % 60).toString().padStart(2, '0');

return `${hours}:${minutes}:${seconds}`;
};

  return (
    <div>
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Thông tin lớp học phần</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <b><Link to='/admin/home' style={{color: '#6B63FF'}}>Trang chủ</Link></b>
                </li>
                <li className="breadcrumb-item">
                  <b><Link to='/admin/assignmentlist' style={{color: '#6B63FF'}}>GV-LHP</Link></b>
                </li>
                <li className="breadcrumb-item active">Thông tin lớp học phần</li>
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
            <div className="card-tools">
            <div className="input-group input-group-sm">
              <Link
                to={`/admin/attendance/${classcode}`}
                className="btn btn-success text-nowrap"
                style={{
                  backgroundColor: "#da2864",
                  borderColor: "#870040",
                  color: "#ffffff",
                  borderRadius: "4px",
                  marginLeft: "10px",
                  border: "1.5px solid #888",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px", // Tạo khoảng cách giữa icon và chữ
                  padding: "5px 10px" // Tăng vùng bấm
                }}
              >
                <span><IonIcon name="log-out-outline" style={{ fontSize: '20px', height: '1em', width: '1.3em',marginTop:'-3px' }} /></span>
                Điểm danh
              </Link>
            </div>
          </div>

          </div>
          <div className="card-header">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 'none' }}>
  <div className="card-tools" style={{ flex: 1 }}>
    <div className="input-group input-group-sm" style={{ width: '250px' }}>
      <input
        type="text"
        className="form-control float-left"
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
  <div className="input-group input-group-sm" style={{ width: '400px', marginLeft: 'auto' }}>
    <input
      type="text"
      className="form-control float-right"
      placeholder="Email mới"
      value={newEmail}
      onChange={(e) => setNewEmail(e.target.value)}
    />
    <div className="input-group-append">
      <button
        type="button"
        className="btn btn-success text-nowrap"
        style={{ backgroundColor: '#6B63FF', borderColor: '#6B63FF', color: '#ffffff', borderRadius: '4px' }}
        onClick={handleAddEmail}
      >
        + Thêm mới
      </button>
      <button
  type="button"
  className="btn btn-success text-nowrap"
  style={{ backgroundColor: '#009900', borderColor: '#009900', color: '#ffffff', borderRadius: '4px', marginLeft: '10px' }}
  onClick={openImportModal}
>
  + import SV
</button>
    </div>
  </div>
</div>
</div>
          <div className="card-body table-responsive p-0">
            <table className="table table-hover text-nowrap">
              <thead>
              <tr>
                <th>STT</th>
                <th>Mã số SV</th>
                <th>Email</th>
                <th>Họ tên</th>
                <th>SĐT</th>
                <th></th>
              </tr>
              </thead>
              <tbody>
              {currentClassSections.map((section, index) => (
                <tr key={section._id}>
                      <td>{offset + index + 1}</td> {/* Serial number */}
                  <td>{section.userCode || 'Chưa cập nhật'}</td>
                  <td>{section.email}</td>
                  <td>{section.fullName || section.displayName || 'Chưa cập nhật'}</td>
                  <td>{section.phone || 'Chưa cập nhật'}</td>
                  {/* <td>
                  <Link className="icon-button" style={{padding:'1px 6px'}}  >
          <span><IonIcon name="information-circle-outline" style={{ fontSize: '20px',height: '1em',width: '1.3em'}} /></span>
          </Link>
                  <button
                        className="icon-button delete far fa-trash-alt"
                        onClick={() => openDeleteModal(section._id)}
                      ></button>
                  </td> */}
                  <td>
  <div className="action-buttons">
    <Link className="icon-button" style={{padding:'1px 6px'}} onClick={() => openProfileModal(section)}>
      <span><IonIcon name="information-circle-outline" style={{ fontSize: '20px', height: '1em', width: '1.3em' }} /></span>
    </Link>
    <button className="icon-button delete far fa-trash-alt" onClick={() => openDeleteModal(section._id)}></button>
  </div>
</td>
                </tr>
              ))}
                                    {currentClassSections.length === 0 && (
                                      <tr>
                                        <td colSpan="5" className="text-center">Chưa có sinh viên nào</td>
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
                pageCount={Math.ceil(filteredClassSections.length / sectionsPerPage)}
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
      <ToastContainer />
      </section>
      {showModalDelete && (
        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Xác nhận xóa</h5>
                <button type="button" className="close" onClick={closeDeleteModal}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>Bạn có chắc chắn muốn xóa?</p>
              </div>
              <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn btn-danger" onClick={closeDeleteModal}>Hủy</button>
                <button type="button" className="btn btn-info" style={{ backgroundColor: '#6B63FF', borderColor: '#6B63FF' }} onClick={handleDelete}>Xác nhận</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showModalProfile && selectedUser && (
  <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Thông tin sinh viên</h5>
          <button type="button" className="close" onClick={() => setShowModalProfile(false)}>
            <span>&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <p><strong>Mã số SV:</strong> {selectedUser.userCode || 'Chưa cập nhật'}</p>
          <p><strong>Email:</strong> {selectedUser.email}</p>
          <p><strong>Họ tên:</strong> {selectedUser.fullName || selectedUser.displayName || 'Chưa cập nhật'}</p>
          <p><strong>SĐT:</strong> {selectedUser.phone || 'Chưa cập nhật'}</p>
        </div>
        <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button type="button" className="btn btn-secondary" onClick={() => setShowModalProfile(false)}>Đóng</button>
        </div>
      </div>
    </div>
  </div>
)}
        {isLoading && (
          <div style={styles.loadingOverlay}>
            <div aria-label="Orange and tan hamster running in a metal wheel" role="img" className="wheel-and-hamster">
              <div className="wheel"></div>
              <div className="hamster">
                <div className="hamster__body">
                  <div className="hamster__head">
                    <div className="hamster__ear"></div>
                    <div className="hamster__eye"></div>
                    <div className="hamster__nose"></div>
                  </div>
                  <div className="hamster__limb hamster__limb--fr"></div>
                  <div className="hamster__limb hamster__limb--fl"></div>
                  <div className="hamster__limb hamster__limb--br"></div>
                  <div className="hamster__limb hamster__limb--bl"></div>
                  <div className="hamster__tail"></div>
                </div>
              </div>
              <div className="spoke"></div>
            </div>
          </div>
        )}
 {showModalImport && (
  <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">IMPORT SINH VIÊN VÀO LỚP HP</h5>
          <button type="button" className="close" onClick={closeImportModal}>
            <span>&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <input 
            type="file" 
            onChange={handleFileChange} 
            disabled={isLoading} // Disable input when uploading
          />
        </div>
        <div className="modal-body">
          <h6>Tải file mẫu import GV: <a href="/ExampleFile/ImportSV_Template.xlsx" download>Tải mẫu</a></h6>
        </div>
        {/* {runtime && (
          <div className="modal-body">
            <h3>Kết quả upload</h3>
            <p>Thời gian chạy: {formatRuntime(runtime)}</p>
            <p>Số dòng được thay đổi: {totalRowsChanged}</p>
            <p>Số dòng được thêm mới: {totalRowsAdded}</p>
            <h4>Email của SV mới được thêm vào:</h4>
            <ul>
              {addedEmails.map((email, index) => (
                <li key={index}>{email}</li>
              ))}
            </ul>
          </div>
        )} */}
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={closeImportModal}>Hủy</button>
          <button 
            type="button" 
            className="btn btn-primary" 
            onClick={handleFileUpload} 
            disabled={isLoading} // Disable button when uploading
          >
            {isLoading ? 'Uploading...' : 'Gửi'}
          </button>
        </div>
      </div>
    </div>
  </div>
)}
{showModalKQIm && (
          <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Thông tin import</h5>
                  <button type="button" className="close" onClick={() => { closeModalKQIM(); closeImportModal(); }}>
                  <span>&times;</span>
                  </button>
                </div>
                <div className="modal-body scrollable-modal-body">
                  <h3><b>Kết quả upload</b></h3>
                  <p><b>Thời gian chạy:</b> {formatRuntime(runtime)}</p>
                  <h4 onClick={toggleAddedEmails} style={{ cursor: 'pointer', color: 'rgb(0, 153, 0)' }}><b>Sinh viên mới được thêm:</b> ({addedEmailsCount})</h4>
                  {showAddedEmails && (
                    // <ul>
                    //   {this.state.addedEmails.map((email, index) => (
                    //     <li key={index}>{email}</li>
                    //   ))}
                    // </ul>
                    <table className="table table-hover text-nowrap">
                      <thead>
                        <tr>
                          <th>Email</th>
                          <th>Full Name</th>
                        </tr>
                      </thead>
                      <tbody>
                        {addedEmails.map((emailteacher, index) => (
                          <tr key={index}>
                            <td>{emailteacher.email}</td>
                            <td>{emailteacher.fullName}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    
                  )}
                  <h4 onClick={toggleDuplicateEmails} style={{ cursor: 'pointer', color: 'rgb(184, 190, 3)' }}><b>Sinh viên đã có trong data:</b>({duplicateEmailsCount})</h4>
                  {showDuplicateEmails && (
                    <table className="table table-hover text-nowrap">
                      <thead>
                        <tr>
                          <th>Email</th>
                          <th>Full Name</th>
                        </tr>
                      </thead>
                      <tbody>
                        {duplicateEmails.map((teacher, index) => (
                          <tr key={index}>
                            <td>{teacher.email}</td>
                            <td>{teacher.fullName}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
<style jsx>{`
          /* From Uiverse.io by KSAplay */ 
          /* From Uiverse.io by Nawsome */ 
          .scrollable-modal-body {
  max-height: 400px; /* Adjust the height as needed */
  overflow-y: auto;
}
          .wheel-and-hamster {
            --dur: 1s;
            position: relative;
            width: 12em;
            height: 12em;
            font-size: 14px;
          }

          .wheel,
          .hamster,
          .hamster div,
          .spoke {
            position: absolute;
          }

          .wheel,
          .spoke {
            border-radius: 50%;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
          }

          .wheel {
            background: radial-gradient(100% 100% at center,hsla(0,0%,60%,0) 47.8%,hsl(0,0%,60%) 48%);
            z-index: 2;
          }

          .hamster {
            animation: hamster var(--dur) ease-in-out infinite;
            top: 50%;
            left: calc(50% - 3.5em);
            width: 7em;
            height: 3.75em;
            transform: rotate(4deg) translate(-0.8em,1.85em);
            transform-origin: 50% 0;
            z-index: 1;
          }

          .hamster__head {
            animation: hamsterHead var(--dur) ease-in-out infinite;
            background: hsl(30,90%,55%);
            border-radius: 70% 30% 0 100% / 40% 25% 25% 60%;
            box-shadow: 0 -0.25em 0 hsl(30,90%,80%) inset,
              0.75em -1.55em 0 hsl(30,90%,90%) inset;
            top: 0;
            left: -2em;
            width: 2.75em;
            height: 2.5em;
            transform-origin: 100% 50%;
          }

          .hamster__ear {
            animation: hamsterEar var(--dur) ease-in-out infinite;
            background: hsl(0,90%,85%);
            border-radius: 50%;
            box-shadow: -0.25em 0 hsl(30,90%,55%) inset;
            top: -0.25em;
            right: -0.25em;
            width: 0.75em;
            height: 0.75em;
            transform-origin: 50% 75%;
          }

          .hamster__eye {
            animation: hamsterEye var(--dur) linear infinite;
            background-color: hsl(0,0%,0%);
            border-radius: 50%;
            top: 0.375em;
            left: 1.25em;
            width: 0.5em;
            height: 0.5em;
          }

          .hamster__nose {
            background: hsl(0,90%,75%);
            border-radius: 35% 65% 85% 15% / 70% 50% 50% 30%;
            top: 0.75em;
            left: 0;
            width: 0.2em;
            height: 0.25em;
          }

          .hamster__body {
            animation: hamsterBody var(--dur) ease-in-out infinite;
            background: hsl(30,90%,90%);
            border-radius: 50% 30% 50% 30% / 15% 60% 40% 40%;
            box-shadow: 0.1em 0.75em 0 hsl(30,90%,55%) inset,
              0.15em -0.5em 0 hsl(30,90%,80%) inset;
            top: 0.25em;
            left: 2em;
            width: 4.5em;
            height: 3em;
            transform-origin: 17% 50%;
            transform-style: preserve-3d;
          }

          .hamster__limb--fr,
          .hamster__limb--fl {
            clip-path: polygon(0 0,100% 0,70% 80%,60% 100%,0% 100%,40% 80%);
            top: 2em;
            left: 0.5em;
            width: 1em;
            height: 1.5em;
            transform-origin: 50% 0;
          }

          .hamster__limb--fr {
            animation: hamsterFRLimb var(--dur) linear infinite;
            background: linear-gradient(hsl(30,90%,80%) 80%,hsl(0,90%,75%) 80%);
            transform: rotate(15deg) translateZ(-1px);
          }

          .hamster__limb--fl {
            animation: hamsterFLLimb var(--dur) linear infinite;
            background: linear-gradient(hsl(30,90%,90%) 80%,hsl(0,90%,85%) 80%);
            transform: rotate(15deg);
          }

          .hamster__limb--br,
          .hamster__limb--bl {
            border-radius: 0.75em 0.75em 0 0;
            clip-path: polygon(0 0,100% 0,100% 30%,70% 90%,70% 100%,30% 100%,40% 90%,0% 30%);
            top: 1em;
            left: 2.8em;
            width: 1.5em;
            height: 2.5em;
            transform-origin: 50% 30%;
          }

          .hamster__limb--br {
            animation: hamsterBRLimb var(--dur) linear infinite;
            background: linear-gradient(hsl(30,90%,80%) 90%,hsl(0,90%,75%) 90%);
            transform: rotate(-25deg) translateZ(-1px);
          }

          .hamster__limb--bl {
            animation: hamsterBLLimb var(--dur) linear infinite;
            background: linear-gradient(hsl(30,90%,90%) 90%,hsl(0,90%,85%) 90%);
            transform: rotate(-25deg);
          }

          .hamster__tail {
            animation: hamsterTail var(--dur) linear infinite;
            background: hsl(0,90%,85%);
            border-radius: 0.25em 50% 50% 0.25em;
            box-shadow: 0 -0.2em 0 hsl(0,90%,75%) inset;
            top: 1.5em;
            right: -0.5em;
            width: 1em;
            height: 0.5em;
            transform: rotate(30deg) translateZ(-1px);
            transform-origin: 0.25em 0.25em;
          }

          .spoke {
            animation: spoke var(--dur) linear infinite;
            background: radial-gradient(100% 100% at center,hsl(0,0%,60%) 4.8%,hsla(0,0%,60%,0) 5%),
              linear-gradient(hsla(0,0%,55%,0) 46.9%,hsl(0,0%,65%) 47% 52.9%,hsla(0,0%,65%,0) 53%) 50% 50% / 99% 99% no-repeat;
          }

          /* Animations */
          @keyframes hamster {
            from, to {
              transform: rotate(4deg) translate(-0.8em,1.85em);
            }

            50% {
              transform: rotate(0) translate(-0.8em,1.85em);
            }
          }

          @keyframes hamsterHead {
            from, 25%, 50%, 75%, to {
              transform: rotate(0);
            }

            12.5%, 37.5%, 62.5%, 87.5% {
              transform: rotate(8deg);
            }
          }

          @keyframes hamsterEye {
            from, 90%, to {
              transform: scaleY(1);
            }

            95% {
              transform: scaleY(0);
            }
          }

          @keyframes hamsterEar {
            from, 25%, 50%, 75%, to {
              transform: rotate(0);
            }

            12.5%, 37.5%, 62.5%, 87.5% {
              transform: rotate(12deg);
            }
          }

          @keyframes hamsterBody {
            from, 25%, 50%, 75%, to {
              transform: rotate(0);
            }

            12.5%, 37.5%, 62.5%, 87.5% {
              transform: rotate(-2deg);
            }
          }

          @keyframes hamsterFRLimb {
            from, 25%, 50%, 75%, to {
              transform: rotate(50deg) translateZ(-1px);
            }

            12.5%, 37.5%, 62.5%, 87.5% {
              transform: rotate(-30deg) translateZ(-1px);
            }
          }

          @keyframes hamsterFLLimb {
            from, 25%, 50%, 75%, to {
              transform: rotate(-30deg);
            }

            12.5%, 37.5%, 62.5%, 87.5% {
              transform: rotate(50deg);
            }
          }

          @keyframes hamsterBRLimb {
            from, 25%, 50%, 75%, to {
              transform: rotate(-60deg) translateZ(-1px);
            }

            12.5%, 37.5%, 62.5%, 87.5% {
              transform: rotate(20deg) translateZ(-1px);
            }
          }

          @keyframes hamsterBLLimb {
            from, 25%, 50%, 75%, to {
              transform: rotate(20deg);
            }

            12.5%, 37.5%, 62.5%, 87.5% {
              transform: rotate(-60deg);
            }
          }

          @keyframes hamsterTail {
            from, 25%, 50%, 75%, to {
              transform: rotate(30deg) translateZ(-1px);
            }

            12.5%, 37.5%, 62.5%, 87.5% {
              transform: rotate(10deg) translateZ(-1px);
            }
          }

          @keyframes spoke {
            from {
              transform: rotate(0);
            }

            to {
              transform: rotate(-1turn);
            }
          }
        `}</style>
    </div>
  );
};
const styles = {
  loadingOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
};
export default ClassSectionDetail;