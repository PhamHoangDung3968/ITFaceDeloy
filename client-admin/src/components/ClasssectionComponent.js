import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import Select from 'react-select';
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

const Classsection = ({ userRole }) => {
  const { subjecttermID } = useParams();
  const [classSections, setClassSections] = useState([]);
  const [subjectInfo, setSubjectInfo] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [expandedClassCode, setExpandedClassCode] = useState(null);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [deleteClassSectionId, setDeleteClassSectionId] = useState(null);
  const [showModalDeletePractical, setShowModalDeletePractical] = useState(false);
  const [deletePracticalClassSectionId, setDeletePracticalClassSectionId] = useState(null);
  const [newClassSection, setNewClassSection] = useState({
    classCode: '',
    schoolDay: [],
    lesson: [],
    classType: 0,
    subjecttermID: subjecttermID // Include subjecttermID in the initial state
  });
  const [editClassSection, setEditClassSection] = useState({
    _id: '',
    classCode: '',
    schoolDay: [],
    lesson: [],
    classType: 0,
    subjecttermID: subjecttermID
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
    if (subjecttermID && subjecttermID.length === 24) {
      apiGetClassSections();
    } else {
      console.error('Invalid subjecttermID format');
    }
  }, [subjecttermID]);

  useEffect(() => {
    if (subjectInfo.subjectCode) {
      setNewClassSection((prevState) => ({
        ...prevState,
        classCode: `${subjectInfo.subjectTermCode}_`
      }));
    }
  }, [subjectInfo]);

  const apiGetClassSections = async () => {
    try {
      const response = await axios.get(`/api/admin/classsections/${subjecttermID}`);
      setClassSections(response.data);
        const subjectResponse = await axios.get(`/api/admin/subjectterms/allvalue/${subjecttermID}`);
        setSubjectInfo(subjectResponse.data);
    } catch (error) {
      console.error('Error fetching class sections:', error);
    }
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value);
  };

  // const handleDelete = async (classSectionID) => {
  //   const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa lớp học phần này không?');
  //   if (confirmDelete) {
  //     try {
  //       await axios.delete(`/api/admin/classsections/${classSectionID}`);
  //       setClassSections(classSections.filter(section => section._id !== classSectionID));
  //       apiGetClassSections();
  //       showToast('Xóa thành công');
  //     } catch (error) {
  //       console.error('Error deleting class section:', error);
  //     }
  //   }
  // };
  const handleDelete = (classSectionID) => {
    setDeleteClassSectionId(classSectionID);
    setShowModalDelete(true);
  };
  const confirmDelete = async () => {
    try {
      await axios.delete(`/api/admin/classsections/${deleteClassSectionId}`);
      setClassSections(classSections.filter(section => section._id !== deleteClassSectionId));
      apiGetClassSections();
      showToast('Xóa thành công');
    } catch (error) {
      console.error('Error deleting class section:', error);
    }
    setShowModalDelete(false);
    setDeleteClassSectionId(null);
  };
  // const handleDeletePractical = async (classSectionID) => {
  //   const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa lớp thực hành này không?');
  //   if (confirmDelete) {
  //     try {
  //       await axios.delete(`/api/admin/classsections/practice/${classSectionID}`);
  //       setClassSections(classSections.filter(section => section._id !== classSectionID));
  //       apiGetClassSections();
  //       showToast('Xóa thành công');
  //     } catch (error) {
  //       console.error('Error deleting class section:', error);
  //     }
  //   }
  // };
  const handleDeletePractical = (classSectionID) => {
    setDeletePracticalClassSectionId(classSectionID);
    setShowModalDeletePractical(true);
  };
  const confirmDeletePractical = async () => {
    try {
      await axios.delete(`/api/admin/classsections/practice/${deletePracticalClassSectionId}`);
      setClassSections(classSections.filter(section => section._id !== deletePracticalClassSectionId));
      apiGetClassSections();
      showToast('Xóa lớp thực hành thành công');
    } catch (error) {
      console.error('Error deleting practical class section:', error);
    }
    setShowModalDeletePractical(false);
    setDeletePracticalClassSectionId(null);
  };
  
  const handleAddNewClassSection = async (e) => {
    e.preventDefault();
    try {
      // Check for duplicates
      const isDuplicate = classSections.some(section => section.classCode === newClassSection.classCode);
  
      if (isDuplicate) {
        showErrorToast('Mã lớp học phần đã tồn tại!');
        return;
      }
  
      // Check if the classCode is for a practical class
      const practicalClassMatch = newClassSection.classCode.match(/_(\d{2})(\d{2})$/);
  
      if (practicalClassMatch) {
        // Extract the theoretical class code
        const theoreticalClassCode = newClassSection.classCode.replace(/_(\d{2})(\d{2})$/, '_$1');
  
        // Check if the theoretical class exists
        const theoreticalClassExists = classSections.some(section => section.classCode === theoreticalClassCode);
  
        if (!theoreticalClassExists) {
          showErrorToast('Lớp lý thuyết tương ứng không tồn tại!');
          return;
        }
      }
  
      const response = await axios.post('/api/admin/classsections', newClassSection);
      setClassSections([...classSections, response.data]);
      setShowModal(false);
      setNewClassSection({ classCode: '', schoolDay: [], lesson: [], classType: 0, subjecttermID: subjecttermID }); // Reset form with subjecttermID
      showToast('Thêm lớp học phần thành công!');
      apiGetClassSections(); // Reload the table data
    } catch (error) {
      showErrorToast('Error adding new class section:', error);
    }
  };

  const handleEditClassSection = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`/api/admin/classsections/edit/${editClassSection._id}`, editClassSection);
      setClassSections(classSections.map(section => section._id === editClassSection._id ? response.data : section));
      setShowModalEdit(false);
      showToast('Chỉnh sửa thành công!');
      apiGetClassSections(); // Reload the table data
    } catch (error) {
      showErrorToast('Error editing class section:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewClassSection({ ...newClassSection, [name]: value });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditClassSection({ ...editClassSection, [name]: value });
  };

  const handleDaysChange = (selectedOptions) => {
    setNewClassSection({ ...newClassSection, schoolDay: selectedOptions.map(option => option.value) });
  };

  const handleEditDaysChange = (selectedOptions) => {
    setEditClassSection({ ...editClassSection, schoolDay: selectedOptions.map(option => option.value) });
  };

  const handleLessonChange = (selectedOptions) => {
    setNewClassSection({ ...newClassSection, lesson: selectedOptions.map(option => option.value) });
  };

  const handleEditLessonChange = (selectedOptions) => {
    setEditClassSection({ ...editClassSection, lesson: selectedOptions.map(option => option.value) });
  };

  const handleClassTypeChange = (selectedOption) => {
    setNewClassSection({ ...newClassSection, classType: selectedOption.value });
  };

  const handleEditClassTypeChange = (selectedOption) => {
    setEditClassSection({ ...editClassSection, classType: selectedOption.value });
  };

  const handleEditClick = (section) => {
    setEditClassSection(section);
    setShowModalEdit(true);
  };

  const handleExpandClick = async (classCode) => {
    if (expandedClassCode === classCode) {
      setExpandedClassCode(null);
    } else {
      try {
        const response = await axios.get(`/api/admin/classsections/practice/${classCode}`);
        setClassSections(prevSections => prevSections.map(section => {
          if (section.classCode === classCode) {
            return { ...section, practiceSections: response.data };
          }
          return section;
        }));
        setExpandedClassCode(classCode);
      } catch (error) {
        console.error('Error fetching practice sections:', error);
      }
    }
  };

  const offset = currentPage * sectionsPerPage;
  const filteredClassSections = classSections.filter(section =>
    section.classCode?.toLowerCase().includes(searchKeyword.toLowerCase())
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
      case 6:
        return 'Không có';
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

  return (
    <div>
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Danh sách lớp học phần</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <b><Link to='/admin/home' style={{color: '#6B63FF'}}>Trang chủ</Link></b>
                </li>
                <li className="breadcrumb-item">
                  <b><Link to='/admin/subject' style={{color: '#6B63FF'}}>Danh sách môn học</Link></b>
                </li>
                <li className="breadcrumb-item active">Danh sách lớp học phần</li>
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
              <br></br><br></br>
              <div className="input-group input-group-sm" style={{float:'right'}}>
                <div className="input-group-append" >
                  {/* <button
                    className="btn btn-success"
                    style={{ backgroundColor: '#6B63FF', borderColor: '#6B63FF', color: '#ffffff', borderRadius: '4px' }}
                    onClick={() => setShowModal(true)}
                  >
                    <i className="fas fa" style={{
                      fontFamily: 'Roboto, Arial, sans-serif',
                      fontSize: '16px',
                      fontWeight: '400',
                    }}>+ Thêm mới</i>
                  </button> */}
                  {userRole !== 'Giảng viên'  && userRole !== 'Sinh viên' && (
                      <button
                      className="btn btn-success"
                      style={{ backgroundColor: '#6B63FF', borderColor: '#6B63FF', color: '#ffffff', borderRadius: '4px' }}
                      onClick={() => setShowModal(true)}
                    >
                      <i className="fas fa" style={{
                        fontFamily: 'Roboto, Arial, sans-serif',
                        fontSize: '16px',
                        fontWeight: '400',
                      }}>+ Thêm mới</i>
                    </button>
                    )}
                </div>
              </div>
            </h3>
            <br /><br /><br /><br /><br />
            <div className="card-tools">
              <div className="input-group input-group-sm">
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
                  <th>Mã học phần</th>
                  <th>Ngày học</th>
                  <th>Ca học</th>
                  <th>Loại lớp</th>
                  <th>Mã GV</th>
                  <th>Tên GV</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {currentClassSections.map((section, index) => (
                  <React.Fragment key={section._id}>
                    <tr>
                      <td onClick={() => handleExpandClick(section.classCode)} style={{ cursor: 'pointer' }}>
                        
                      <i className={expandedClassCode === section.classCode ? 'fas fa-angle-down' : 'fas fa-angle-right'}></i> {section.classCode}                      </td>
                      <td>{section.schoolDay.map(day => <div key={day}>{day}</div>)}</td>
                      <td>{section.lesson.map(lesson => <div key={lesson}>{mapLesson(lesson)}</div>)}</td>
                      <td>{mapClassType(section.classType)}</td>
                      <td>{section.teacher.userCode || 'Chưa cập nhật'}</td>
                      <td>{section.teacher.fullName || 'Chưa cập nhật'}</td>
                      <td>
                        <div className="action-buttons">
                          {/* <button
                            className="icon-button edit far fa-edit"
                            onClick={() => handleEditClick(section)}
                          ></button>
                          <button
                            className="icon-button delete far fa-trash-alt"
                            onClick={() => handleDelete(section._id)}
                          ></button> */}
                          {userRole !== 'Giảng viên' && userRole !== 'Sinh viên' && (
                            <>
                              <button
                                className="icon-button edit far fa-edit"
                                onClick={() => handleEditClick(section)}
                              ></button>
                              {/* <button
                                className="icon-button delete far fa-trash-alt"
                                onClick={() => handleDelete(section._id)}
                              ></button> */}
                              <button
                                                className="icon-button delete far fa-trash-alt"
                                                onClick={() => handleDelete(section._id)}
                                              ></button>
                            </>
                          )}
                        </div>
                      </td>
                      
                    </tr>
                    {/* bảng nhỏ*/}
                    {expandedClassCode === section.classCode && section.practiceSections ? (
                      section.practiceSections.length > 0 ? (
                        <>
                          <div className="card-header">
                            <h5 className="card-title" style={{ lineHeight: '1.6' }}>
                              <strong>Danh sách lớp thực hành: {section.classCode} </strong>
                            </h5>
                          </div>
                          {section.practiceSections.map(practiceSection => (
                            <tr key={practiceSection._id} style={{ backgroundColor: '#f9f9f9' }}>
                              <td>{practiceSection.classCode}</td>
                              <td>{practiceSection.schoolDay.map(day => <div key={day}>{day}</div>)}</td>
                              <td>{practiceSection.lesson.map(lesson => <div key={lesson}>{mapLesson(lesson)}</div>)}</td>
                              <td></td>
                              <td>{practiceSection.teacher.userCode|| 'Chưa cập nhật'}</td>
                              <td>{practiceSection.teacher.fullName|| 'Chưa cập nhật'}</td>
                              <td>
                                <div className="action-buttons">
                                  {/* <button
                                    className="icon-button edit far fa-edit"
                                    onClick={() => handleEditClick(practiceSection)}
                                  ></button>
                                  <button
                                    className="icon-button delete far fa-trash-alt"
                                    onClick={() => handleDeletePractical(practiceSection._id)}
                                  ></button> */}
                                  {userRole !== 'Giảng viên' && userRole !== 'Sinh viên' && (
                                      <>
                                        <button
                                              className="icon-button edit far fa-edit"
                                              onClick={() => handleEditClick(practiceSection)}
                                            ></button>
                                            
                                            <button
                                              className="icon-button delete far fa-trash-alt"
                                              onClick={() => handleDeletePractical(practiceSection._id)}
                                            ></button>
                                      </>
                                    )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </>
                      ) : (
                        <tr>
                          <td colSpan="5" style={{ textAlign: 'center' }}>Chưa có dữ liệu</td>
                        </tr>
                      )
                    ) : null}

                  </React.Fragment>
                ))}
                {currentClassSections.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center">Không có lớp học phần nào</td>
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
        
        {showModal && (
          <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Thêm mới lớp học phần</h5>
                  <button type="button" className="close" onClick={() => setShowModal(false)}>
                    <span>&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleAddNewClassSection}>
                    <div className="form-group">
                      <label>Mã học phần</label>
                      <input
                        type="text"
                        className="form-control"
                        name="classCode"
                        value={newClassSection.classCode}
                        onChange={handleInputChange}
                        placeholder="Nhập mã học phần..."
                      />
                    </div>
                    <div className="form-group">
                      <label>Ngày học</label>
                      <Select
                        isMulti
                        name="schoolDay"
                        options={daysOptions}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        onChange={handleDaysChange}
                        value={daysOptions.filter(option => newClassSection.schoolDay.includes(option.value))}
                      />
                    </div>
                    <div className="form-group">
                      <label>Ca học</label>
                      <Select
                        isMulti
                        name="lesson"
                        options={lessonOptions}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        onChange={handleLessonChange}
                        value={lessonOptions.filter(option => newClassSection.lesson.includes(option.value))}
                      />
                    </div>
                    <div className="form-group">
                      <label>Loại lớp</label>
                      <Select
                        name="classType"
                        options={classTypeOptions}
                        className="basic-single-select"
                        classNamePrefix="select"
                        onChange={handleClassTypeChange}
                        value={classTypeOptions.find(option => option.value === newClassSection.classType)}
                      />
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-danger" onClick={() => setShowModal(false)}>Hủy</button>
                      <button type="submit" className="btn btn-info" style={{ backgroundColor: '#6B63FF', borderColor: '#6B63FF' }}>Xác nhận</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
        {showModalEdit && (
          <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Chỉnh sửa lớp học phần</h5>
                  <button type="button" className="close" onClick={() => setShowModalEdit(false)}>
                    <span>&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleEditClassSection}>
                    <div className="form-group">
                      <label>Mã học phần</label>
                      <input
                        type="text"
                        className="form-control"
                        name="classCode"
                        value={editClassSection.classCode}
                        onChange={handleEditInputChange}
                        placeholder="Nhập mã học phần..."
                        readOnly
                      />
                    </div>
                    <div className="form-group">
                      <label>Ngày học</label>
                      <Select
                        isMulti
                        name="schoolDay"
                        options={daysOptions}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        onChange={handleEditDaysChange}
                        value={daysOptions.filter(option => editClassSection.schoolDay.includes(option.value))}
                      />
                    </div>
                    <div className="form-group">
                      <label>Ca học</label>
                      <Select
                        isMulti
                        name="lesson"
                        options={lessonOptions}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        onChange={handleEditLessonChange}
                        value={lessonOptions.filter(option => editClassSection.lesson.includes(option.value))}
                      />
                    </div>
                    <div className="form-group">
                      <label>Loại lớp</label>
                      <Select
                        name="classType"
                        options={classTypeOptions}
                        className="basic-single-select"
                        classNamePrefix="select"
                        onChange={handleEditClassTypeChange}
                        value={classTypeOptions.find(option => option.value === editClassSection.classType)}
                      />
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-danger" onClick={() => setShowModalEdit(false)}>Hủy</button>
                      <button type="submit" className="btn btn-info" style={{ backgroundColor: '#6B63FF', borderColor: '#6B63FF' }}>Xác nhận</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          
        )}
        {showModalDelete && (
          <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Xác nhận xóa lớp học phần</h5>
                  <button type="button" className="close" onClick={() => setShowModalDelete(false)}>
                    <span>&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <p>Bạn có chắc chắn muốn xóa lớp học phần này không?</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModalDelete(false)}>Hủy</button>
                  <button type="button" className="btn btn-danger" onClick={confirmDelete}>Xóa</button>
                </div>
              </div>
            </div>
          </div>
        )}
        {showModalDeletePractical && (
          <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Xác nhận xóa lớp thực hành</h5>
                  <button type="button" className="close" onClick={() => setShowModalDeletePractical(false)}>
                    <span>&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <p>Bạn có chắc chắn muốn xóa lớp thực hành này không?</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModalDeletePractical(false)}>Hủy</button>
                  <button type="button" className="btn btn-danger" onClick={confirmDeletePractical}>Xóa</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Classsection;