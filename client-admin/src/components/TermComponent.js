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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class Term extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      terms: [],
      majors: [],
      currentPage: 0,
      majorsPerPage: 10,
      searchKeyword: '',
      filteredTerms: [],
      activeTab: 'area',
      showModalAddTerm: false,
      showModalEditTerm: false,
      newTerm: {
        term: '',
        startYear: '',
        endYear: '',
        endDate: '',
        startDate: '',
        status: 1,
      },
      editingTerm: {
        term: '',
        startYear: '',
        endYear: '',
        endDate: '',
        startDate: '',
      },
      
      isEditing: false,
      editingTermId: null,
      errorTerm: '',
      errorEndDate: '',
      errorStartYear: '',
      errorEndYear: '',
      errorStartDate: '',
      showModalDelete: false,
  termToDelete: null,
    };
  }
  componentDidMount() {
    this.apiGetTerms();
  }
  apiGetTerms = async () => {
    try {
      const response = await axios.get('/api/admin/terms');
      this.setState({ terms: response.data.reverse(), filteredTerms: response.data });
    } catch (error) {
      console.error('Error fetching terms:', error);
    }
  };

  handleStatusChangeTerm = async (e, termId) => {
    const newStatus = e.target.checked ? 1 : 0;
    try {
      const response = await axios.put(`/api/admin/terms/${termId}`, { status: newStatus });
      if (response.data) {
        this.setState(prevState => ({
          terms: prevState.terms.map(term =>
            term._id === termId ? { ...term, status: newStatus } : term
          ),
          filteredTerms: prevState.filteredTerms.map(term =>
            term._id === termId ? { ...term, status: newStatus } : term
          )
        }));
        this.showToast('Trạng thái đã được cập nhật thành công');
      } else {
        this.showErrorToast('Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error updating term status:', error);
      this.showErrorToast('Có lỗi xảy ra');
    }
  };

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };


  handleSearch1 = () => {
    const { searchKeyword, terms } = this.state;
    const filteredTerms = terms.filter(term =>
      term.term.toString().toLowerCase().includes(searchKeyword.toLowerCase())
    );
    this.setState({ filteredTerms, currentPage: 0 });
  };

  handlePageClick = (data) => {
    this.setState({ currentPage: data.selected });
  };

  handleTabClick = (tab) => {
    this.setState({ activeTab: tab });
  };

  toggleModalAddTerm = () => {
    this.setState(prevState => ({ showModalAddTerm: !prevState.showModalAddTerm }));
  };

  toggleModalEditTerm = () => {
    this.setState(prevState => ({ showModalEditTerm: !prevState.showModalEditTerm }));
  };
  toggleModalDelete = (term) => {
    this.setState(prevState => ({
      showModalDelete: !prevState.showModalDelete,
      termToDelete: term || null,
    }));
  };

  handleNewTermChange = (e) => {
    const { name, value } = e.target;
    if (name === 'startYear') {
      const [startYear, endYear] = value.split('-');
      this.setState(prevState => ({
        newTerm: {
          ...prevState.newTerm,
          startYear,
          endYear,
        },
        [`error${name.charAt(0).toUpperCase() + name.slice(1)}`]: '',
      }));
    } else {
      this.setState(prevState => ({
        newTerm: {
          ...prevState.newTerm,
          [name]: value,
        },
        [`error${name.charAt(0).toUpperCase() + name.slice(1)}`]: '',
      }));
    }
  };

  handleEditingTermChange = (e) => {
    const { name, value } = e.target;
    if (name === 'startYear') {
      const [startYear, endYear] = value.split('-');
      this.setState(prevState => ({
        editingTerm: {
          ...prevState.editingTerm,
          startYear,
          endYear,
        },
      }));
    } else {
      this.setState(prevState => ({
        editingTerm: {
          ...prevState.editingTerm,
          [name]: value,
        },
      }));
    }
  };

  // validateTerm = (term) => {
  //   let isValid = true;
  //   const errors = {};

  //   if (!term.term || typeof term.term !== 'string' || !term.term.trim()) {
  //     errors.errorTerm = 'Học kỳ không được để trống';
  //     isValid = false;
  //   }

  //   if (!term.endDate || typeof term.endDate !== 'string' || !term.endDate.trim()) {
  //     errors.errorendDate = 'Ngày kết thúc không được để trống';
  //     isValid = false;
  //   }

  //   if (!term.startYear || typeof term.startYear !== 'string' || !term.startYear.trim()) {
  //     errors.errorStartYear = 'Năm học không được để trống';
  //     isValid = false;
  //   }

  //   if (!term.endYear || typeof term.endYear !== 'string' || !term.endYear.trim()) {
  //     errors.errorEndYear = 'Năm kết thúc không được để trống';
  //     isValid = false;
  //   }

  //   if (!term.startDate || typeof term.startDate !== 'string' || !term.startDate.trim()) {
  //     errors.errorStartDate = 'Ngày bắt đầu không được để trống';
  //     isValid = false;
  //   }

  //   this.setState(errors);
  //   return isValid;
  // };
  validateTerm = (term) => {
    let isValid = true;
    const errors = {};
  
    if (!term.term || typeof term.term !== 'string' || !term.term.trim()) {
      errors.errorTerm = 'Học kỳ không được để trống';
      isValid = false;
    }
  
    if (!term.endDate || typeof term.endDate !== 'string' || !term.endDate.trim()) {
      errors.errorEndDate = 'Ngày kết thúc không được để trống';
      isValid = false;
    }
  
    if (!term.startYear || typeof term.startYear !== 'string' || !term.startYear.trim()) {
      errors.errorStartYear = 'Năm học không được để trống';
      isValid = false;
    }
  
    if (!term.endYear || typeof term.endYear !== 'string' || !term.endYear.trim()) {
      errors.errorEndYear = 'Năm kết thúc không được để trống';
      isValid = false;
    }
  
    if (!term.startDate || typeof term.startDate !== 'string' || !term.startDate.trim()) {
      errors.errorStartDate = 'Ngày bắt đầu không được để trống';
      isValid = false;
    }
  
    // Kiểm tra nếu startDate lớn hơn endDate
    if (term.startDate && term.endDate && new Date(term.startDate) > new Date(term.endDate)) {
      errors.errorDateRange = 'Ngày bắt đầu không được lớn hơn ngày kết thúc';
      isValid = false;
    }
  
    // Kiểm tra nếu endDate nhỏ hơn startDate
    if (term.startDate && term.endDate && new Date(term.endDate) < new Date(term.startDate)) {
      errors.errorDateRange = 'Ngày kết thúc không được nhỏ hơn ngày bắt đầu';
      isValid = false;
    }
  
    this.setState(errors);
    return isValid;
  };

  handleAddNewTerm = async (e) => {
    e.preventDefault();
    const { newTerm } = this.state;
  
    if (!this.validateTerm(newTerm)) {
      return;
    }
  
    try {
      const checkResponse = await axios.get(`/api/admin/term?term=${newTerm.term}`);
      if (checkResponse.data.length > 0) {
        this.setState({ errorTerm: 'Học kỳ đã tồn tại' });
        return;
      }
  
      const formattedStartDate = new Date(newTerm.startDate).toISOString();
      const termData = { 
        ...newTerm, 
        startDate: newTerm.startDate, 
        endDate: newTerm.endDate 
      };
  
      const response = await axios.post('/api/admin/terms', termData);
      if (response.data) {
        this.showToast('Thêm mới thành công!');
        this.apiGetTerms();
        this.toggleModalAddTerm();
      } else {
        this.showErrorToast('Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error adding new term:', error);
      this.showErrorToast('Có lỗi xảy ra');
    }
  };

  handleEditClick = (term) => {
    console.log('Editing term:', term);
    this.setState({
      showModalEditTerm: true,
      isEditing: true,
      editingTermId: term._id,
      editingTerm: {
        term: term.term,
        startYear: term.startYear,
        endYear: term.endYear,
        startDate: term.startDate ? term.startDate.split('T')[0] : '',
        endDate: term.endDate ? term.endDate.split('T')[0] : '',
        status: term.status,
      },
    });
  };

  // handleUpdateTerm = async (e) => {
  //   e.preventDefault();
  //   const { editingTerm, editingTermId } = this.state;
  
  //   try {
  //     console.log('Updating term with ID:', editingTermId);
  //     console.log('Payload:', editingTerm);
  
  //     const formattedStartDate = new Date(editingTerm.startDate).toISOString();
  //     const formattedEndDate = new Date(editingTerm.endDate).toISOString();
  //     const termData = {
  //       term: editingTerm.term,
  //       startYear: editingTerm.startYear,
  //       endYear: editingTerm.endYear,
  //       startDate: formattedStartDate,
  //       endDate: formattedEndDate,
  //     };
  
  //     const response = await axios.put(`/api/admin/terms/edit/${editingTermId}`, termData);
  //     console.log('Response:', response);
  
  //     if (response.data) {
  //       console.log('Updated term:', response.data);
  //       this.showToast('Cập nhật thành công!');
  //       this.apiGetTerms();
  //       this.toggleModalEditTerm();
  //     } else {
  //       this.showErrorToast('Có lỗi xảy ra');
  //     }
  //   } catch (error) {
  //     console.error('Error updating term:', error);
  //     this.showErrorToast('Có lỗi xảy ra');
  //   }
  // };
  
  handleUpdateTerm = async (e) => {
    e.preventDefault();
    const { editingTerm, editingTermId } = this.state;
  
    // Kiểm tra nếu startDate lớn hơn endDate
    if (new Date(editingTerm.startDate) > new Date(editingTerm.endDate)) {
      this.showErrorToast('Ngày bắt đầu không được lớn hơn ngày kết thúc');
      return;
    }
  
    try {
      console.log('Updating term with ID:', editingTermId);
      console.log('Payload:', editingTerm);
  
      const formattedStartDate = new Date(editingTerm.startDate).toISOString();
      const formattedEndDate = new Date(editingTerm.endDate).toISOString();
      const termData = {
        term: editingTerm.term,
        startYear: editingTerm.startYear,
        endYear: editingTerm.endYear,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      };
  
      const response = await axios.put(`/api/admin/terms/edit/${editingTermId}`, termData);
      console.log('Response:', response);
  
      if (response.data) {
        console.log('Updated term:', response.data);
        this.showToast('Cập nhật thành công!');
        this.apiGetTerms();
        this.toggleModalEditTerm();
      } else {
        this.showErrorToast('Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error updating term:', error);
      this.showErrorToast('Có lỗi xảy ra');
    }
  };
  btnDeleteClick1 = (e, item) => {
    e.preventDefault();
    this.toggleModalDelete(item);
  };
  confirmDeleteTerm = async () => {
    const { termToDelete } = this.state;
    if (termToDelete) {
      try {
        const response = await axios.delete(`/api/admin/terms/${termToDelete._id}`);
        if (response.data) {
          this.showToast('Thao tác thành công!');
          this.apiGetTerms();
          this.toggleModalDelete();
        } else {
          this.showErrorToast('Có lỗi xảy ra');
        }
      } catch (error) {
        console.error('Error deleting term:', error);
        this.showErrorToast('Có lỗi xảy ra');
      }
    }
  };
    apiDeleteTerm = async (id) => {
    try {
      const response = await axios.delete(`/api/admin/terms/${id}`);
      if (response.data) {
        alert('Thao tác thành công!');
        this.apiGetTerms();
      } else {
        alert('Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error deleting major:', error);
    }
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
    const { currentPage, majorsPerPage, filteredTerms, activeTab, showModalDelete, termToDelete,showModalAddTerm, showModalEditTerm, newTerm, editingTerm, errorTerm, errorendDate, errorStartYear, errorDateRange, errorStartDate } = this.state;
    const offset = currentPage * majorsPerPage;
    const currentPageTerms = filteredTerms.slice(offset, offset + majorsPerPage);
    const { userRole } = this.props;

    const formatDate = (dateString) => {
      const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
      return new Date(dateString).toLocaleDateString('en-GB', options);
    };

    const termRows = currentPageTerms.map((item, index) => (
      <tr key={item._id}>
        <td>{offset + index + 1}</td>
        <td>{item.term}</td>
        <td>{item.startYear} - {item.endYear}</td>
        <td>{formatDate(item.startDate)}</td>
        <td>{formatDate(item.endDate)}</td>

        <td>
          <div className="action-buttons">
          {userRole !== 'Giảng viên' && userRole !== 'Sinh viên'  && (
                            <>
                              <button className="icon-button edit far fa-edit" onClick={() => this.handleEditClick(item)}></button>
                              <button className="icon-button delete far fa-trash-alt" onClick={(e) => this.btnDeleteClick1(e, item)}></button>
                            </>
                          )}
            
          </div>
        </td>
      </tr>
    ));
    


    return (
      <div>
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1>Danh sách học kỳ</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <b><Link to='/admin/home' style={{ color: '#6B63FF' }}>Trang chủ</Link></b>
                  </li>
                  <li className="breadcrumb-item active">Danh sách học kỳ</li>
                </ol>
              </div>
            </div>
          </div>
        </section>
        <section className="content">
          <div className="card">
            
            <div className="card-body">
              <div className="tab-content p-0">
                <div
                  className={`chart tab-pane ${activeTab === 'area' ? 'active' : ''}`}
                  id="semester"
                  style={{ position: 'relative' }}
                >
                  <div className="card-header">
                    <h3 className="card-title" style={{ float: 'right' }}>
                      <div className="input-group input-group-sm" >
                        <div className="input-group-append" >
                        {userRole !== 'Giảng viên' && userRole !== 'Sinh viên'  && (
                            <>
                               <button
                            className="btn btn-success"
                            style={{ backgroundColor: '#6B63FF', borderColor: '#6B63FF', color: '#ffffff', borderRadius: '4px' }}
                            onClick={this.toggleModalAddTerm}
                          >
                            <i className="fas fa" style={{
                              fontFamily: 'Roboto, Arial, sans-serif',
                              fontSize: '16px',
                              fontWeight: '400',
                            }}>+ Thêm mới</i>
                          </button>
                            </>
                          )}
                         
                        </div>
                      </div>
                    </h3>
                    <div className="card-tools" style={{ float: 'left' }}>
                      <div className="input-group input-group-sm">
                        <input type="text" className="form-control float-right" placeholder="Tìm kiếm" name="searchKeyword" value={this.state.searchKeyword} onChange={this.handleInputChange} />
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
                            <th>STT</th>
                          <th>Học kỳ</th>
                          <th>Năm học</th>
                          <th>Ngày bắt đầu</th>
                          <th>Ngày kết thúc</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {termRows}
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
                        pageCount={Math.ceil(filteredTerms.length / majorsPerPage)}
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
                {/* {showModalAddTerm && (
                  <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title">Thêm mới học kỳ</h5>
                          <button type="button" className="close" onClick={this.toggleModalAddTerm}>
                            <span>&times;</span>
                          </button>
                        </div>
                        <div className="modal-body">
                          <form onSubmit={this.handleAddNewTerm}>
                            <div className="row">
                              <div className="col-sm-6">
                                <div className="form-group">
                                  <label>Học kỳ</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="term"
                                    value={newTerm.term}
                                    onChange={this.handleNewTermChange}
                                    placeholder="Nhập học kỳ..."
                                  />
                                  {errorTerm && <span className="text-danger">{errorTerm}</span>}
                                </div>
                              </div>
                              <div className="col-sm-6">
                              <div className="form-group">
                                    <label>Năm học</label>
                                    <select
                                        className="form-control"
                                        name="startYear"
                                        value={`${newTerm.startYear}-${newTerm.endYear}`}
                                        onChange={this.handleNewTermChange}
                                    >
                                        <option value="">Chọn năm học...</option>
                                        {Array.from({ length: 10 }, (_, i) => {
                                        const startYear = new Date().getFullYear() - i;
                                        const endYear = startYear + 1;
                                        return <option key={startYear} value={`${startYear}-${endYear}`}>{`${startYear}-${endYear}`}</option>;
                                        })}
                                    </select>
                                    {errorStartYear && <span className="text-danger">{<div className="form-group">
                                    <label>Năm học</label>
                                    <select
                                        className="form-control"
                                        name="startYear"
                                        value={`${newTerm.startYear}-${newTerm.endYear}`}
                                        onChange={this.handleNewTermChange}
                                    >
                                        <option value="">Chọn năm học...</option>
                                        {Array.from({ length: 5 }, (_, i) => {
                                        const startYear = new Date().getFullYear() - i;
                                        const endYear = startYear + 1;
                                        return <option key={startYear} value={`${startYear}-${endYear}`}>{`${startYear}-${endYear}`}</option>;
                                        })}
                                    </select>
                                    {errorStartYear && <span className="text-danger">{errorStartYear}</span>}
                                    </div>}</span>}
                                    </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-sm-6">
                              <div className="form-group">
                                  <label>Ngày bắt đầu</label>
                                  <div className="input-group">
                                    <div className="input-group-prepend">
                                      <span className="input-group-text"><i className="far fa-calendar-alt"></i></span>
                                    </div>
                                    <input
                                      type="date"
                                      className="form-control"
                                      name="startDate"
                                      value={newTerm.startDate}
                                      onChange={this.handleNewTermChange}
                                    />
                                  </div>
                                  {errorStartDate && <span className="text-danger">{errorStartDate}</span>}

                                </div>
                              </div>
                              <div className="col-sm-6">
                              <div className="form-group">
                                  <label>Ngày kết thúc</label>
                                  <div className="input-group">
                                    <div className="input-group-prepend">
                                      <span className="input-group-text"><i className="far fa-calendar-alt"></i></span>
                                    </div>
                                    <input
                                      type="date"
                                      className="form-control"
                                      name="endDate"
                                      value={newTerm.endDate}
                                      onChange={this.handleNewTermChange}
                                    />
                                  </div>
                                  {errorendDate && <span className="text-danger">{errorendDate}</span>}

                                </div>
                              </div>
                            </div>
                            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                              <button type="button" className="btn btn-danger" onClick={this.toggleModalAddTerm}>Hủy</button>
                              <button type="submit" className="btn btn-info" style={{ backgroundColor: '#6B63FF', borderColor: '#6B63FF' }}>Xác nhận</button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                )} */}
                {showModalAddTerm && (
                <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">Thêm mới học kỳ</h5>
                        <button type="button" className="close" onClick={this.toggleModalAddTerm}>
                          <span>&times;</span>
                        </button>
                      </div>
                      <div className="modal-body">
                        <form onSubmit={this.handleAddNewTerm}>
                          <div className="row">
                            <div className="col-sm-6">
                              <div className="form-group">
                                <label>Học kỳ</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="term"
                                  value={newTerm.term}
                                  onChange={this.handleNewTermChange}
                                  placeholder="Nhập học kỳ..."
                                />
                                {errorTerm && <span className="text-danger">{errorTerm}</span>}
                              </div>
                            </div>
                            <div className="col-sm-6">
                              <div className="form-group">
                                <label>Năm học</label>
                                <select
                                  className="form-control"
                                  name="startYear"
                                  value={`${newTerm.startYear}-${newTerm.endYear}`}
                                  onChange={this.handleNewTermChange}
                                >
                                  <option value="">Chọn năm học...</option>
                                  {Array.from({ length: 10 }, (_, i) => {
                                    const startYear = new Date().getFullYear() - i;
                                    const endYear = startYear + 1;
                                    return <option key={startYear} value={`${startYear}-${endYear}`}>{`${startYear}-${endYear}`}</option>;
                                  })}
                                </select>
                                {errorStartYear && <span className="text-danger">{errorStartYear}</span>}
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-sm-6">
                              <div className="form-group">
                                <label>Ngày bắt đầu</label>
                                <div className="input-group">
                                  <div className="input-group-prepend">
                                    <span className="input-group-text"><i className="far fa-calendar-alt"></i></span>
                                  </div>
                                  <input
                                    type="date"
                                    className="form-control"
                                    name="startDate"
                                    value={newTerm.startDate}
                                    onChange={this.handleNewTermChange}
                                  />
                                </div>
                                {errorStartDate && <span className="text-danger">{errorStartDate}</span>}
                              </div>
                            </div>
                            <div className="col-sm-6">
                              <div className="form-group">
                                <label>Ngày kết thúc</label>
                                <div className="input-group">
                                  <div className="input-group-prepend">
                                    <span className="input-group-text"><i className="far fa-calendar-alt"></i></span>
                                  </div>
                                  <input
                                    type="date"
                                    className="form-control"
                                    name="endDate"
                                    value={newTerm.endDate}
                                    onChange={this.handleNewTermChange}
                                  />
                                </div>
                                {errorendDate && <span className="text-danger">{errorendDate}</span>}
                              </div>
                            </div>
                          </div>
                          {errorDateRange && <div className="text-danger">{errorDateRange}</div>}
                          <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                            <button type="button" className="btn btn-danger" onClick={this.toggleModalAddTerm}>Hủy</button>
                            <button type="submit" className="btn btn-info" style={{ backgroundColor: '#6B63FF', borderColor: '#6B63FF' }}>Xác nhận</button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              )}
                
                {showModalEditTerm && (
  <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Chỉnh sửa học kỳ</h5>
          <button type="button" className="close" onClick={this.toggleModalEditTerm}>
            <span>&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <form onSubmit={this.handleUpdateTerm}>
            <div className="row">
              <div className="col-sm-6">
                <div className="form-group">
                  <label>Học kỳ</label>
                  <input
                    type="text"
                    className="form-control"
                    name="term"
                    value={editingTerm.term}
                    onChange={this.handleEditingTermChange}

                  />
                </div>
              </div>
              <div className="col-sm-6">
                <div className="form-group">
                  <label>Năm học</label>
                  <select
                    className="form-control"
                    name="startYear"
                    value={`${editingTerm.startYear}-${editingTerm.endYear}`}
                    onChange={this.handleEditingTermChange}
                  >
                    <option value="">Chọn năm học...</option>
                    {Array.from({ length: 10 }, (_, i) => {
                      const startYear = new Date().getFullYear() - i;
                      const endYear = startYear + 1;
                      return <option key={startYear} value={`${startYear}-${endYear}`}>{`${startYear}-${endYear}`}</option>;
                    })}
                  </select>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-6">
                <div className="form-group">
                  <label>Ngày bắt đầu</label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text"><i className="far fa-calendar-alt"></i></span>
                    </div>
                    <input
                      type="date"
                      className="form-control"
                      name="startDate"
                      value={editingTerm.startDate}
                      onChange={this.handleEditingTermChange}
                    />
                  </div>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="form-group">
                  <label>Ngày kết thúc</label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text"><i className="far fa-calendar-alt"></i></span>
                    </div>
                    <input
                      type="date"
                      className="form-control"
                      name="endDate"
                      value={editingTerm.endDate}
                      onChange={this.handleEditingTermChange}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button type="button" className="btn btn-danger" onClick={this.toggleModalEditTerm}>Hủy</button>
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
                <h5 className="modal-title">Xác nhận xóa</h5>
                <button type="button" className="close" onClick={() => this.toggleModalDelete(null)}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>Bạn có chắc chắn muốn xóa học kỳ {termToDelete?.term}?</p>
              </div>
              <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn btn-danger" onClick={() => this.toggleModalDelete(null)}>Hủy</button>
                <button type="button" className="btn btn-info" style={{ backgroundColor: '#6B63FF', borderColor: '#6B63FF' }} onClick={this.confirmDeleteTerm}>Xác nhận</button>
              </div>
            </div>
          </div>
        </div>
      )}
                <ToastContainer />
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default Term;