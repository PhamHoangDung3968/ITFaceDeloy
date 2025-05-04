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

class Major extends Component {
  static contextType = MyContext;
  constructor(props) {
    super(props);
    this.state = {
      majors: [],
      currentPage: 0,
      majorsPerPage: 5,
      searchKeyword: '',
      filteredMajors: [],
      activeTab: 'area',
      showModalAddMajor: false,
      showModalEditMajor: false,
      newMajor: {
        majorName: '',
        subMajorName: '',
        status: 1,
        majorCode:'',
      },
      editingMajor: {
        majorName: '',
        subMajorName: '',
        status: 1,
      },
      isEditing: false,
      editingMajorId: null,
      errorMajorName: '',
      errormajorCode:'',
      errorStartWeek: '',
      errorStartYear: '',
      errorEndYear: '',
      errorStartDate: '',
      showModalDelete: false,
        majorToDelete: null,
    };
  }

  componentDidMount() {
    this.apiGetMajors();
  }

  apiGetMajors = async () => {
    try {
      const response = await axios.get('/api/admin/majors');
      this.setState({ majors: response.data.reverse(), filteredMajors: response.data });
    } catch (error) {
      console.error('Error fetching majors:', error);
    }
  };
  handleStatusChange = async (e, majorId) => {
    const newStatus = e.target.checked ? 1 : 0;
    try {
      const response = await axios.put(`/api/admin/majors/${majorId}`, { status: newStatus });
      if (response.data) {
        this.setState(prevState => ({
          majors: prevState.majors.map(major =>
            major._id === majorId ? { ...major, status: newStatus } : major
          ),
          filteredMajors: prevState.filteredMajors.map(major =>
            major._id === majorId ? { ...major, status: newStatus } : major
          )
        }));
        this.showToast('Trạng thái đã được cập nhật thành công');
      } else {
        this.showErrorToast('Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error updating major status:', error);
      this.showErrorToast('Có lỗi xảy ra');
    }
  };
  btnDeleteClick = (e, item) => {
    e.preventDefault();
    this.toggleModalDelete(item);
  };
  
  handleDeleteConfirm = async () => {
    const { majorToDelete } = this.state;
    if (majorToDelete && majorToDelete._id) {
      try {
        const response = await axios.delete(`/api/admin/majors/${majorToDelete._id}`);
        if (response.data) {
          this.showToast('Thao tác thành công!');
          this.apiGetMajors();
        } else {
          this.showErrorToast('Có lỗi xảy ra');
        }
      } catch (error) {
        console.error('Error deleting major:', error);
        this.showErrorToast('Có lỗi xảy ra');
      }
      this.toggleModalDelete();
    }
  };

  apiDeleteMajor = async (id) => {
    try {
      const response = await axios.delete(`/api/admin/majors/${id}`);
      if (response.data) {
        alert('Thao tác thành công!');
        this.apiGetMajors();
      } else {
        alert('Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error deleting major:', error);
    }
  };

  toggleModalAddMajor = () => {
    this.setState(prevState => ({ showModalAddMajor: !prevState.showModalAddMajor }));
  };

  toggleModalEditMajor = () => {
    this.setState(prevState => ({ showModalEditMajor: !prevState.showModalEditMajor }));
  };
  toggleModalDelete = (major) => {
    this.setState(prevState => ({
      showModalDelete: !prevState.showModalDelete,
      majorToDelete: major || null,
    }));
  };
  handleEditClickMajor = (major) => {
    console.log('Editing major:', major);
    this.setState({
      showModalEditMajor: true,
      isEditing: true,
      editingMajorId: major._id,
      editingMajor: {
        majorName: major.majorName,
        subMajorName: major.subMajorName,
        status: major.status,
      },
    });
  };

  handleUpdateMajor = async (e) => {
    e.preventDefault();
    try {
      console.log('Updating major with ID:', this.state.editingMajorId);
      console.log('Payload:', this.state.editingMajor);

      const response = await axios.put(`/api/admin/majors/edit/${this.state.editingMajorId}`, this.state.editingMajor);
      console.log('Response:', response);

      if (response.data) {
        console.log('Updated major:', response.data);
        this.showToast('Cập nhật thành công!');
        this.apiGetMajors();
        this.toggleModalEditMajor();
      } else {
        this.showErrorToast('Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error updating major:', error);
      this.showErrorToast('Có lỗi xảy ra');
    }
  };

  handleNewMajorChange = (e) => {
    const { name, value } = e.target;
    this.setState(prevState => ({
      newMajor: {
        ...prevState.newMajor,
        [name]: value,
      },
      errormajorCode: name === 'majorCode' ? '' : prevState.errormajorCode,
      errorMajorName: name === 'majorName' ? '' : prevState.errorMajorName,
    }));
  };

  handleEditingMajorChange = (e) => {
    const { name, value } = e.target;
    this.setState(prevState => ({
      editingMajor: {
        ...prevState.editingMajor,
        [name]: value,
      },
    }));
  };

  handleAddNewMajor = async (e) => {
    e.preventDefault();
    const { newMajor } = this.state;

    if (newMajor.majorName.trim() === '') {
      this.setState({ errorMajorName: 'Tên ngành không được để trống' });
      return;
    }

    try {
      const checkResponse = await axios.get(`/api/admin/major?majorName=${newMajor.majorName}`);
      if (checkResponse.data.length > 0) {
        this.setState({ errorMajorName: 'Tên ngành đã tồn tại' });
        return;
      }
      const response = await axios.post('/api/admin/majors', newMajor);
      if (response.data) {
        this.setState(prevState => ({
          majors: [...prevState.majors, response.data],
          newMajor: {
            majorName: '',
            subMajorName: '',
            status: 1,
            majorCode:'',
          },
          showModalAddMajor: false,
          errorMajorName: '',
          errormajorCode:'',
        }));
        this.showToast('Thêm mới thành công!');
        this.apiGetMajors();
      } else {
        this.showErrorToast('Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error adding new major:', error);
      this.showErrorToast('Có lỗi xảy ra');
    }
  };



  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSearch = () => {
    const { searchKeyword, majors } = this.state;
    const filteredMajors = majors.filter(major => 
      major.majorName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      major.majorCode.toLowerCase().includes(searchKeyword.toLowerCase())
    );
    this.setState({ filteredMajors, currentPage: 0 });
  };

  handlePageClick = (data) => {
    this.setState({ currentPage: data.selected });
  };

  handleTabClick = (tab) => {
    this.setState({ activeTab: tab });
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
    const { currentPage, majorsPerPage, filteredMajors, newMajor,showModalDelete, majorToDelete,showModalAddMajor,errorMajorName, showModalEditMajor, editingMajor} = this.state;
    const offset = currentPage * majorsPerPage;
    const currentPageMajors = filteredMajors.slice(offset, offset + majorsPerPage);
    const { userRole } = this.props;
    const majorRows = currentPageMajors.map((item, index) => (
      <tr key={item._id}>
        <td>{offset + index + 1}</td>
        <td>{item.majorCode}</td>
        <td>{item.majorName}</td>
        <td>{item.subMajorName}</td>
        {userRole !== 'Giảng viên' && userRole !== 'Sinh viên'  && (
                            <>
<td>
          <div className="form-group" style={{ display: 'flex', justifyContent: 'center' }}>
            <label className="switch">
              <input
                type="checkbox"
                checked={item.status === 1}
                onChange={(e) => this.handleStatusChange(e, item._id)}
              />
              <span className="slider round"></span>
            </label>
          </div>
        </td>
        <td>
          <div className="action-buttons">
            <button className="icon-button edit far fa-edit" onClick={() => this.handleEditClickMajor(item)} title='Sửa'></button>
            <button className="icon-button delete far fa-trash-alt" onClick={(e) => this.btnDeleteClick(e, item)} title='Xóa'></button>
          </div>
        </td>
                            </>
                          )}
        
      </tr>
    ));
    return (
      <div>
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1>Danh sách ngành</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <b><Link to='/admin/home' style={{ color: '#6B63FF' }}>Trang chủ</Link></b>
                  </li>
                  <li className="breadcrumb-item active">Danh sách ngành</li>
                </ol>
              </div>
            </div>
          </div>
        </section>
        <section className="content">
          <div className="card">
            <div className="card-body">
              <div className="tab-content p-0">
                  <div className="card-header">
                    <h3 className="card-title" style={{ float: 'right' }}>
                      <div className="input-group input-group-sm" >
                        <div className="input-group-append" >
                        {userRole !== 'Giảng viên' && userRole !== 'Sinh viên'  && (
                            <>
                            <button
                            className="btn btn-success"
                            style={{ backgroundColor: '#6B63FF', borderColor: '#6B63FF', color: '#ffffff', borderRadius: '4px' }}
                            onClick={this.toggleModalAddMajor}
                          >
                            <i className="fas fa" style={{
                              fontFamily: 'Roboto, Arial, sans-serif',
                              fontSize: '16px',
                              fontWeight: '400',
                            }}>+ Thêm mới ngành</i>
                          </button>                            </>
                          )}
                          
                        </div>
                      </div>
                    </h3>
                    <div className="card-tools" style={{ float: 'left' }}>
                      <div className="input-group input-group-sm" style={{ width: '200px' }}>
                        <input type="text" className="form-control float-right" placeholder="Tìm kiếm" name="searchKeyword" value={this.state.searchKeyword} onChange={this.handleInputChange} />
                        <div className="input-group-append">
                          <button type="submit" className="btn btn-default" onClick={this.handleSearch}>
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
                          <th>Mã ngành</th>
                          <th>Tên ngành</th>
                          <th>Tên viết tắt</th>
                          {userRole !== 'Giảng viên' && userRole !== 'Sinh viên'  && (
                            <>
                              <th>Trạng thái</th> 
                              <th></th>
                            </>
                          )}
                          
                         
                        </tr>
                      </thead>
                      <tbody>
                        {majorRows}
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
                        pageCount={Math.ceil(filteredMajors.length / majorsPerPage)}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={this.handlePageClick}
                        containerClassName={'pagination'}
                        subContainerClassName={'pages pagination'}
                        activeClassName={'active'}
                      />
                    </div>
                  </div>
                
                <ToastContainer />
                {showModalAddMajor && (
                  <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title">Thêm mới ngành</h5>
                          <button type="button" className="close" onClick={this.toggleModalAddMajor}>
                            <span>&times;</span>
                          </button>
                        </div>
                        <div className="modal-body">
                          <form onSubmit={this.handleAddNewMajor}>
                          <div className="form-group">
                              <label>Mã ngành</label>
                              <input
                                type="text"
                                className="form-control"
                                name="majorCode"
                                value={newMajor.majorCode}
                                onChange={this.handleNewMajorChange}
                                placeholder="Nhập mã ngành..."
                              />
                              {errorMajorName && <span className="text-danger">{errorMajorName}</span>}
                            </div>
                            <div className="form-group">
                              <label>Tên ngành</label>
                              <input
                                type="text"
                                className="form-control"
                                name="majorName"
                                value={newMajor.majorName}
                                onChange={this.handleNewMajorChange}
                                placeholder="Nhập tên ngành..."
                              />
                              {errorMajorName && <span className="text-danger">{errorMajorName}</span>}
                            </div>
                            <div className="form-group">
                              <label>Tên viết tắt</label>
                              <input
                                type="text"
                                className="form-control"
                                name="subMajorName"
                                value={newMajor.subMajorName}
                                onChange={this.handleNewMajorChange}
                                placeholder="Nhập tên viết tắt..."
                              />
                            </div>
                            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                              <button type="button" className="btn btn-danger" onClick={this.toggleModalAddMajor}>Hủy</button>
                              <button type="submit" className="btn btn-info" style={{ backgroundColor: '#6B63FF', borderColor: '#6B63FF' }}>Xác nhận</button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {showModalEditMajor && (
                  <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title">Chỉnh sửa ngành</h5>
                          <button type="button" className="close" onClick={this.toggleModalEditMajor}>
                            <span>&times;</span>
                          </button>
                        </div>
                        <div className="modal-body">
                          <form onSubmit={this.handleUpdateMajor}>
                            <div className="form-group">
                              <label>Tên ngành</label>
                              <input
                                type="text"
                                className="form-control"
                                name="majorName"
                                value={editingMajor.majorName}
                                onChange={this.handleEditingMajorChange}
                                placeholder="Nhập tên ngành..."
                              />
                            </div>
                            <div className="form-group">
                              <label>Tên viết tắt</label>
                              <input
                                type="text"
                                className="form-control"
                                name="subMajorName"
                                value={editingMajor.subMajorName}
                                onChange={this.handleEditingMajorChange}
                                placeholder="Nhập tên viết tắt..."
                              />
                            </div>
                            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                              <button type="button" className="btn btn-danger" onClick={this.toggleModalEditMajor}>Hủy</button>
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
                <button type="button" className="close" onClick={this.toggleModalDelete}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>Bạn có chắc chắn muốn xóa ngành {majorToDelete?.majorName}?</p>
              </div>
              <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn btn-danger" onClick={this.toggleModalDelete}>Hủy</button>
                <button type="button" className="btn btn-info" style={{ backgroundColor: '#6B63FF', borderColor: '#6B63FF' }} onClick={this.handleDeleteConfirm}>Xác nhận</button>
              </div>
            </div>
          </div>
        </div>
      )}
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default Major;