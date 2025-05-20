import React, { Component } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import moment from 'moment';
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
import IonIcon from '@reacticons/ionicons';


class User extends Component {
  static contextType = MyContext;
  state = {
    users: [],
    newUser: '',
    editingUserId: null,
    editingEmail: '',
    editingRole: '',
    editingStatus: '',
    displayName: '', // Add this line
    userCode:'',
    fullName:'',
    typeLecturer:'',
    accessToken:'',
    phone: '', // Add this line
    personalEmail: '', // Add this line
    roles: [],
    newRole: '',
    currentPage: 0,
    usersPerPage: 10,
    searchKeyword: '',
    filteredUsers: [],
    selectedRole: '',
    error: '',
    showModal: false, // Add this line
    showModal1: false,// Add this line
    showDeleteModal: false,
    userToDelete: null,
    showModalImport: false, // Add this line
    runtime: null,
    totalRowsChanged: null,
    totalRowsAdded: null,
    addedEmails: [],
    duplicateTeachers: [], // Thêm trạng thái duplicateTeachers

    isLoading: false, // Thêm trạng thái isLoading
    showModalKQIm: false, // Thêm trạng thái showModal
    showAddedEmails: false, // Thêm trạng thái showAddedEmails
    showDuplicateTeachers: false, // Thêm trạng thái showDuplicateTeachers
    addedEmailsCount: 0, // Thêm trạng thái addedEmailsCount
    duplicateTeachersCount: 0, // Thêm trạng thái duplicateTeachersCount



  };

  componentDidMount() {
    this.apiGetUsers();
    this.apiGetRoles();
  }

  // Fetch users from the API
  apiGetUsers = async () => {
    try {
      const response = await axios.get('/api/admin/users/unstudent');
      const reversedUsers = response.data.reverse(); // Reverse the order here
      this.setState({ users: reversedUsers, filteredUsers: reversedUsers });
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  apiGetRoles = async () => {
    try {
      const response = await axios.get('/api/admin/roles/unstudent');
      this.setState({ roles: response.data });
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  // Get role name by ID
  getRoleNameById = (roleId) => {
    const role = this.state.roles.find(role => role._id === roleId);
    return role ? role.tenrole : 'Unknown';
  };

  // Handle role change
  handleRoleChange = async (e, userId) => {
    const newRoleId = e.target.value;
    try {
      const response = await axios.put(`/api/admin/users/${userId}`, { role: newRoleId });
      if (response.data) {
        this.setState(prevState => ({
          users: prevState.users.map(user =>
            user._id === userId ? { ...user, role: newRoleId } : user
          ),
          filteredUsers: prevState.filteredUsers.map(user =>
            user._id === userId ? { ...user, role: newRoleId } : user
          )
        }));
        this.showToast('Cập nhật quyền thành công!');
      } else {
        alert('Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Có lỗi xảy ra');
    }
  };

  handleStatusChange = async (e, userId) => {
    const newStatus = e.target.checked ? 1 : 0; 
    try {
      const response = await axios.put(`/api/admin/users/${userId}`, { status: newStatus });
      if (response.data) {
        this.setState(prevState => ({
          users: prevState.users.map(user =>
            user._id === userId ? { ...user, status: newStatus } : user
          ),
          filteredUsers: prevState.filteredUsers.map(user =>
            user._id === userId ? { ...user, status: newStatus } : user
          )
        }));
        this.showToast(`Trạng thái đã được cập nhật thành công`);
      } else {
        alert('Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      alert('Có lỗi xảy ra');
    }
  };

  apiDeleteUser = async (id) => {
    try {
      const response = await axios.delete(`/api/admin/users/${id}`);
      if (response.data) {
        alert('Thao tác thành công!');
        this.apiGetUsers();
      } else {
        alert('Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error deleting role:', error);
    }
  };

  // btnDeleteClick = (e, item) => {
  //   e.preventDefault();
  //   const id = item._id;
  //   if (id) {
  //     if (window.confirm('Xác nhận xóa?')) {
  //       this.apiDeleteUser(id);
  //     }
  //   } else {
  //     alert('Không tìm thấy ID!');
  //   }
  // };
  btnDeleteClick = (e, item) => {
    e.preventDefault();
    this.showDeleteModal(item);
  };
  confirmDelete = async () => {
    const { userToDelete } = this.state;
    if (userToDelete) {
      try {
        const response = await axios.delete(`/api/admin/users/${userToDelete._id}`);
        if (response.data) {
          this.showToast('Xóa thành công!');
          this.apiGetUsers();
        } else {
          this.showErrorToast('Có lỗi xảy ra');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        this.showErrorToast('Có lỗi xảy ra');
      }
      this.hideDeleteModal();
    }
  };

  apiAddUser = async () => {
    const { newUser, users } = this.state;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    if (newUser.trim() === '') {
      this.setState({ error: 'Email không được để trống' });
      return;
    }
  
    if (!emailRegex.test(newUser)) {
      this.setState({ error: 'Email không hợp lệ' });
      return;
    }
  
    // Check if the email already exists
    const emailExists = users.some(user => user.email === newUser);
    if (emailExists) {
      this.setState({ error: 'Email đã tồn tại' });
      return;
    }
  
    try {
      const response = await axios.post('/api/admin/users', { email: newUser });
      if (response.data) {
        this.showToast('Thêm mới thành công!');
        this.setState({ newUser: '', error: '' });
        this.apiGetUsers();
      } else {
        this.showErrorToast({ error: 'Có lỗi xảy ra' });
      }
    } catch (error) {
      console.error('Error adding user:', error);
      this.setState({ error: 'Có lỗi xảy ra' });
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

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSearch = () => {
    const { searchKeyword, users, selectedRole } = this.state;
    const filteredUsers = users.filter(user => 
      (
        (user.email && user.email.toLowerCase().includes(searchKeyword.toLowerCase())) || 
        (user.userCode && user.userCode.toLowerCase().includes(searchKeyword.toLowerCase())) ||
        (user.fullName && user.fullName.toLowerCase().includes(searchKeyword.toLowerCase()))
      ) &&
      (selectedRole === '' || user.role === selectedRole)
    );
    this.setState({ filteredUsers, currentPage: 0 });
  };

  handlePageClick = (data) => {
    this.setState({ currentPage: data.selected });
  };

  handleRoleFilterChange = (e) => {
    this.setState({ selectedRole: e.target.value }, this.handleSearch);
  };

  startEditing = (user) => {
    this.setState({
      editingUserId: user._id,
      editingEmail: user.email,
      editingRole: user.role,
      editingStatus: user.status,
      fullName: user.fullName,
      userCode:user.userCode,
      typeLecturer:user.typeLecturer,
      accessToken:user.accessToken,
      phone: user.phone,
      personalEmail: user.personalEmail,
      showModal: true
    });
  };
  profileUser = (user) => {
    this.setState({
      editingUserId: user._id,
      editingEmail: user.email,
      editingRole: user.role,
      editingStatus: user.status,
      fullName: user.fullName, // Add this line
      userCode:user.userCode,
      typeLecturer:user.typeLecturer,
      accessToken:user.accessToken,
      phone: user.phone, // Add this line
      personalEmail: user.personalEmail, // Add this line
      showModal1: true // Show the modal
    });
  };
  cancelProfile = () => {
    this.setState({
      editingUserId: null,
      editingEmail: '',
      editingRole: '',
      editingStatus: '',
      fullName: '', // Add this line
      userCode:'',
      typeLecturer:'',
      accessToken:'',
      phone: '', // Add this line
      personalEmail: '', // Add this line
      showModal1: false // Hide the modal
    });
  };

  cancelEditing = () => {
    this.setState({
      editingUserId: null,
      editingEmail: '',
      editingRole: '',
      editingStatus: '',
      fullName: '', // Add this line
      userCode:'',
      typeLecturer:'',
      accessToken:'',
      phone: '', // Add this line
      personalEmail: '', // Add this line
      showModal: false // Hide the modal
    });
  };

  saveEditing = async () => {
    const { editingUserId, userCode,fullName, phone, personalEmail, typeLecturer } = this.state;
    const updatedUser = {
      userCode,
      fullName,
      phone,
      personalEmail,
      typeLecturer
    };
  
    console.log('Updating user with data:', updatedUser);
  
    try {
      const response = await axios.put(`/api/admin/users/edit/${editingUserId}`, updatedUser);
      if (response.data) {
        this.setState(prevState => ({
          users: prevState.users.map(user =>
            user._id === editingUserId ? { ...user, ...updatedUser } : user
          ),
          filteredUsers: prevState.filteredUsers.map(user =>
            user._id === editingUserId ? { ...user, ...updatedUser } : user
          ),
          editingUserId: null,
          editingEmail: '',
          editingRole: '',
          editingStatus: '',
          fullName: '',
          userCode:'',
          typeLecturer:'',
          phone: '',
          personalEmail: '',
          showModal: false
        }));
        this.showToast('Cập nhật thành công!');
      } else {
        this.showErrorToast('Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      this.showErrorToast('Có lỗi xảy ra');
    }
  };
  showDeleteModal = (user) => {
    this.setState({ showDeleteModal: true, userToDelete: user });
  };
  
  hideDeleteModal = () => {
    this.setState({ showDeleteModal: false, userToDelete: null });
  };
  showModalImport = () => { // Add this function
    this.setState({ showModalImport: true });
  };
    cancelImport = () => { // Add this function
    this.setState({ showModalImport: false });
  };
  handleFileChange = (event) => {
    this.setState({ file: event.target.files[0] });
  };

  fileInputRef = React.createRef();

  handleFileUpload = () => {
    this.setState({ isLoading: true }); // Bắt đầu hiệu ứng loading
    const formData = new FormData();
    formData.append('file', this.state.file);
  
    axios.post('/api/admin/upload/teachers', formData)
      .then(response => {
        console.log(response.data);
        this.setState({ 
          file: null, // Xóa tên file sau khi upload thành công
          isLoading: false, // Kết thúc hiệu ứng loading
          runtime: response.data.runtime,
          totalRowsChanged: response.data.totalRowsChanged,
          totalRowsAdded: response.data.totalRowsAdded,
          addedEmails: response.data.addedEmails,
          duplicateTeachers:response.data.duplicateTeachers,
          showModalKQIm: true, // Hiển thị modal sau khi upload thành công
          addedEmailsCount: (response.data.addedEmails).length, 
          duplicateTeachersCount: (response.data.duplicateTeachers).length,
        });
        this.fileInputRef.current.value = ''; // Đặt lại giá trị của input file
        this.showToast('Upload file thành công');
      })
      .catch(error => {
        console.error('Đã xảy ra lỗi khi tải tệp lên!', error);
        this.setState({ 
          isLoading: false // Kết thúc hiệu ứng loading
        });
        this.showErrorToast('Upload file thất bại');
      });
  };
  closeModalKQIM = () => {
    this.setState({ showModalKQIm: false });
  };
  toggleAddedEmails = () => {
    this.setState(prevState => ({ showAddedEmails: !prevState.showAddedEmails }));
  };

  toggleDuplicateTeachers = () => {
    this.setState(prevState => ({ showDuplicateTeachers: !prevState.showDuplicateTeachers }));
  };
  formatRuntime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  
    return `${hours}:${minutes}:${seconds}`;
  };


  render() {
    const { currentPage, usersPerPage, showModalKQIm,showDeleteModal, filteredUsers, selectedRole, error, showModal, showModal1, showModalImport, editingRole, editingStatus } = this.state;
    const offset = currentPage * usersPerPage;
    const currentPageUsers = filteredUsers.slice(offset, offset + usersPerPage);
    const { userRole } = this.props;

    const userRows = currentPageUsers.map((item, index) => (
      <tr key={item._id}>
         <td>{offset + index + 1}</td>
         <td>{item.userCode ? item.userCode : 'Chưa cập nhật'}</td>
         <td>{item.fullName ? item.fullName : 'Chưa cập nhật'}</td>
         <td><Link onClick={() => this.profileUser(item)} style={{ color: 'black' }}>{item.email}</Link></td>
         <td>
           <select
            value={item.role}
            onChange={(e) => this.handleRoleChange(e, item._id)}
            className="form-control"
          >
            {this.state.roles.map(role => (
              <option key={role._id} value={role._id}>
                {role.tenrole}
              </option>
            ))}
          </select>
        </td>
        <td>{item.lastLogin ? moment(item.lastLogin).format('DD/MM/YYYY (HH:mm)') : '.../.../...'}</td>
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
                            </>
                          )}
        
        <td>
          <div className="action-buttons" >
          <Link className="icon-button" onClick={() => this.profileUser(item)} title="Thông tin người dùng">
            <span><IonIcon name="information-circle-outline" style={{ fontSize: '20px',height: '1em',width: '1.3em',padding:'1px 4px'}} /></span>
          </Link>
          <button className="icon-button edit far fa-edit" onClick={() => this.startEditing(item)} title='Sửa'></button>
          {userRole !== 'Giảng viên' && userRole !== 'Sinh viên'  && (
                            <>
                            <button
                                className="icon-button delete far fa-trash-alt"
                                onClick={(e) => this.btnDeleteClick(e, item)}
                                title="Xóa"
                              ></button>

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
                <h1>Danh sách CBGVNV</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <b><Link to='/admin/home' style={{color: '#6B63FF'}}>Trang chủ</Link></b>
                  </li>
                  <li className="breadcrumb-item active">Danh sách CBGVNV</li>
                </ol>
              </div>
            </div>
          </div>
        </section>
        <section className="content">
          <div className="card">
            <div className="card-header">
            <h3 className="card-title" style={{ float: 'right' }}>
              <div className="input-group input-group-sm">
                <div className="input-group-append">
                {userRole !== 'Giảng viên' && userRole !== 'Sinh viên'  && (
                            <>
                              <button
                    type="submit"
                    className="btn btn-success text-nowrap"
                    onClick={this.showModalImport}
                    style={{ backgroundColor: '#6B63FF', borderColor: '#6B63FF', color: '#ffffff', marginLeft: '210px', borderRadius:'4px',backgroundColor: '#009900', borderColor: '#009900'}} // Adjust the margin as needed
                  >
                    + Import GV
                  </button>
                            </>
                          )}
                  
                </div>
              </div>
            </h3>
              <div className="card-tools" style={{ float: 'left' }}>
                <div className="input-group input-group-sm" style={{width: '200px'}}>
                  <input type="text" className="form-control float-right" placeholder="Tìm kiếm" name="searchKeyword" value={this.state.searchKeyword} onChange={this.handleInputChange} />
                  <div className="input-group-append">
                    <button type="submit" className="btn btn-default" onClick={this.handleSearch}>
                      <i className="fas fa-search"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-header">
            {error && <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
            {userRole !== 'Giảng viên' && userRole !== 'Sinh viên'  && (
                            <>
                              <h3 className="card-title" style={{float: 'right' }} >
                <div className="input-group input-group-sm" style={{width: '300px'}}>
                  <input type="text" className="form-control float-right" placeholder="Email mới" name="newUser" value={this.state.newUser} onChange={this.handleInputChange} />
                  <div className="input-group-append">
                    <button type="submit" className="btn btn-success text-nowrap" onClick={this.apiAddUser} style={{ backgroundColor: '#6B63FF', borderColor: '#6B63FF', color: '#ffffff',borderRadius:'4px'}}>
                      + Thêm mới
                    </button>
                  </div>
                </div>
              </h3>
                            </>
                          )}
              
              <div className="card-tools" style={{ float: 'left' }}>
                <div className="input-group input-group-sm" style={{width: '200px'}}>
                  <select className="form-control" value={selectedRole} onChange={this.handleRoleFilterChange}>
                    <option value="">Tất cả vai trò</option>
                    {this.state.roles.map(role => (
                      <option key={role._id} value={role._id}>
                        {role.tenrole}
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
                    <th>Mã</th>
                    <th>Họ tên</th>
                    <th>Email</th>
                    <th>Vai trò</th>
                    <th>Thời gian đăng nhập</th>
                    {userRole !== 'Giảng viên' && userRole !== 'Sinh viên'  && (
                            <>
                              <th>Trạng thái</th>
                            </>
                          )}
                    
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
        <ToastContainer />
        {showModal && (
  <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Chỉnh sửa người dùng</h5>
          <button type="button" className="close" onClick={this.cancelEditing}>
            <span>&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              name="editingEmail"
              value={this.state.editingEmail}
              onChange={this.handleInputChange}
              readOnly
            />
          </div>
          <div className="form-group">
            <label>Mã số</label>
            <input
              type="text"
              className="form-control"
              name="userCode"
              value={this.state.userCode}
              onChange={this.handleInputChange}
              placeholder="Chưa cập nhật thông tin..."
            />
          </div>
          <div className="form-group">
            <label>Tên người dùng</label>
            <input
              type="text"
              className="form-control"
              name="fullName"
              value={this.state.fullName}
              onChange={this.handleInputChange}
              placeholder="Chưa cập nhật thông tin..."
            />
          </div>
          <div className="form-group">
            <label>Số điện thoại</label>
            <input
              type="text"
              className="form-control"
              name="phone"
              value={this.state.phone}
              onChange={this.handleInputChange}
              placeholder="Chưa cập nhật thông tin..."
            />
          </div>
          <div className="form-group">
            <label>Email cá nhân</label>
            <input
              type="text"
              className="form-control"
              name="personalEmail"
              value={this.state.personalEmail}
              onChange={this.handleInputChange}
              placeholder="Chưa cập nhật thông tin..."
            />
          </div>
          
          <div className="form-group">
            <label>Loại giảng viên</label>
            <select
              className="form-control"
              name="typeLecturer"
              value={this.state.typeLecturer}
              onChange={this.handleInputChange}
            >
              <option value="">Chưa cập nhật thông tin...</option>
              <option value="Trưởng phó bộ môn">Trưởng phó bộ môn</option>
              <option value="GV thỉnh giảng">GV thỉnh giảng</option>
              <option value="GV cơ hữu">GV cơ hữu</option>
              <option value="Nhân viên">Nhân viên</option>
            </select>
          </div>
          
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={this.cancelEditing}>Hủy</button>
          <button type="button" className="btn btn-primary" onClick={this.saveEditing}>Lưu</button>
        </div>
      </div>
    </div>
    
  </div>
  
)}
{showModal1 && (
  <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Thông tin người dùng</h5>
          <button type="button" className="close" onClick={this.cancelProfile}>
            <span>&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              name="editingEmail"
              value={this.state.editingEmail}
              onChange={this.handleInputChange}
              readOnly
            />
          </div>
          <div className="form-group">
            <label>Tên người dùng</label>
            <input
              type="text"
              className="form-control"
              name="userCode"
              value={this.state.userCode}
              onChange={this.handleInputChange}
              placeholder="Chưa cập nhật thông tin..."
              readOnly
            
            />
          </div>
          <div className="form-group">
            <label>Tên người dùng</label>
            <input
              type="text"
              className="form-control"
              name="fullName"
              value={this.state.fullName}
              onChange={this.handleInputChange}
              placeholder="Chưa cập nhật thông tin..."
              readOnly
            
            />
          </div>
          <div className="form-group">
            <label>Số điện thoại</label>
            <input
              type="text"
              className="form-control"
              name="phone"
              value={this.state.phone}
              onChange={this.handleInputChange}
              placeholder="Chưa cập nhật thông tin..."
              readOnly
            />
          </div>
          <div className="form-group">
            <label>Email cá nhân</label>
            <input
              type="text"
              className="form-control"
              name="personalEmail"
              value={this.state.personalEmail}
              onChange={this.handleInputChange}
              placeholder="Chưa cập nhật thông tin..."
              readOnly
            />
          </div>
          <div className="form-group">
            <label>Loại giảng viên</label>
            <input
              type="text"
              className="form-control"
              name="typeLecturer"
              value={this.state.typeLecturer}
              onChange={this.handleInputChange}
              placeholder="Chưa cập nhật thông tin..."
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  </div>
)}
{showDeleteModal && (
  <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Xác nhận xóa</h5>
          <button type="button" className="close" onClick={this.hideDeleteModal}>
            <span>&times;</span>
          </button>
        </div>
        <div className="modal-body">
          Bạn có chắc chắn muốn xóa người dùng này không?
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={this.hideDeleteModal}>Hủy</button>
          <button type="button" className="btn btn-primary" onClick={this.confirmDelete}>Xóa</button>
        </div>
      </div>
    </div>
  </div>
)}
{showModalImport && (
  <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">IMPORT GIẢNG VIÊN</h5>
          <button type="button" className="close" onClick={this.cancelImport}>
            <span>&times;</span>
          </button>
        </div>
        <div className="modal-body">
            <input 
              type="file" 
              onChange={this.handleFileChange} 
              disabled={this.state.isLoading} // Vô hiệu hóa input khi đang upload
              ref={this.fileInputRef} // Thêm ref cho input file
            />
        </div >
        <div className="modal-body">
            <h6>Tải file mẫu import GV: <a href="https://docs.google.com/spreadsheets/d/1zLQrh0OXcT7ZH95lUlRSLkcYIwPTva3F/export?format=xlsx" download>Tải mẫu</a></h6>
        </div >
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={this.cancelImport}>Hủy</button>
          <button 
            type="button" 
            className="btn btn-primary" 
            onClick={this.handleFileUpload} 
            disabled={this.state.isLoading} // Vô hiệu hóa nút khi đang upload
          >
            
            {this.state.isLoading ? 'Uploading...' : 'Gửi'}
          </button>
        </div>
      </div>
    </div>
  </div>
)}
 {this.state.showModalKQIm && (
          <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Thông tin import</h5>
                  <button type="button" className="close" onClick={() => { this.closeModalKQIM(); this.cancelImport(); }}>
                  <span>&times;</span>
                  </button>
                </div>
                <div className="modal-body scrollable-modal-body">
                  <h3><b>Kết quả upload</b></h3>
                  <p><b>Thời gian chạy:</b> {this.formatRuntime(this.state.runtime)}</p>
                  <h4 onClick={this.toggleAddedEmails} style={{ cursor: 'pointer', color: 'rgb(0, 153, 0)' }}><b>Giảng viên mới được thêm:</b> ({this.state.addedEmailsCount})</h4>
                  {this.state.showAddedEmails && (
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
                        {this.state.addedEmails.map((emailteacher, index) => (
                          <tr key={index}>
                            <td>{emailteacher.email}</td>
                            <td>{emailteacher.fullName}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    
                  )}
                  <h4 onClick={this.toggleDuplicateTeachers} style={{ cursor: 'pointer', color: 'rgb(184, 190, 3)' }}><b>Giảng viên đã có trong data:</b>({this.state.duplicateTeachersCount})</h4>
                  {this.state.showDuplicateTeachers && (
                    <table className="table table-hover text-nowrap">
                      <thead>
                        <tr>
                          <th>Email</th>
                          <th>Full Name</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.duplicateTeachers.map((teacher, index) => (
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
{this.state.isLoading && (
          <div style={styles.loadingOverlay}>
            <div aria-label="Orange and tan hamster running in a metal wheel" role="img" class="wheel-and-hamster">
	<div class="wheel"></div>
	<div class="hamster">
		<div class="hamster__body">
			<div class="hamster__head">
				<div class="hamster__ear"></div>
				<div class="hamster__eye"></div>
				<div class="hamster__nose"></div>
			</div>
			<div class="hamster__limb hamster__limb--fr"></div>
			<div class="hamster__limb hamster__limb--fl"></div>
			<div class="hamster__limb hamster__limb--br"></div>
			<div class="hamster__limb hamster__limb--bl"></div>
			<div class="hamster__tail"></div>
		</div>
	</div>
	<div class="spoke"></div>
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
  }
}
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

export default User;