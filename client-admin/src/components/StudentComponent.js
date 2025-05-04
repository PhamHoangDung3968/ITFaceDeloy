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


class Student extends Component {
  static contextType = MyContext;
  state = {
    users: [],
    newUser: '',
    editingUserId: null,
    editingEmail: '',
    editingRole: '',
    editingStatus: '',
    displayName: '', // Add this line
    fullName:'',
    userCode:'',
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

  };

  componentDidMount() {
    this.apiGetUsers();
    this.apiGetRoles();
  }

  // Fetch users from the API
  apiGetUsers = async () => {
    try {
      const response = await axios.get('/api/admin/users/student');
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
    if (newUser.trim() === '') {
      this.setState({ error: 'Email không được để trống' });
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
      userCode: user.userCode,
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
      userCode: user.userCode, // Add this line
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
      userCode: '', // Add this line
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
      userCode: '', // Add this line
      typeLecturer:'',
      accessToken:'',
      phone: '', // Add this line
      personalEmail: '', // Add this line
      showModal: false // Hide the modal
    });
  };

  saveEditing = async () => {
    const { editingUserId, userCode, fullName, phone, personalEmail, typeLecturer } = this.state;
    const updatedUser = {
      fullName,
      userCode,
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
          userCode: '', // Add this line

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

  render() {
    const { currentPage, usersPerPage, searchKeyword,showDeleteModal, filteredUsers, selectedRole, error, showModal, showModal1, editingEmail, editingRole, editingStatus } = this.state;
    const offset = currentPage * usersPerPage;
    const currentPageUsers = filteredUsers.slice(offset, offset + usersPerPage);

    const userRows = currentPageUsers.map((item, index) => (
      <tr key={item._id}>
         <td>{offset + index + 1}</td>
         <td>{item.userCode ? item.userCode : 'Chưa cập nhật'}</td>
         <td>{item.fullName ? item.fullName : 'Chưa cập nhật'}</td>
         <td><Link onClick={() => this.profileUser(item)} style={{ color: 'black' }}>{item.email}</Link></td>
         
        <td>{item.lastLogin ? moment(item.lastLogin).format('DD/MM/YYYY (HH:mm)') : '.../.../...'}</td>
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
          <Link className="icon-button" style={{padding:'1px 6px'}} onClick={() => this.profileUser(item)} title='Thông tin sinh viên' >
          <span><IonIcon name="information-circle-outline" style={{ fontSize: '20px',height: '1em',width: '1.3em'}} /></span>
          </Link>
          <button className="icon-button edit far fa-edit" onClick={() => this.startEditing(item)} title='Sửa'></button>
          <button className="icon-button delete far fa-trash-alt" onClick={(e) => this.btnDeleteClick(e, item)} title='Xóa'></button>
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
                <h1>Danh sách sinh viên</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <b><Link to='/admin/home' style={{color: '#6B63FF'}}>Trang chủ</Link></b>
                  </li>
                  <li className="breadcrumb-item active">Danh sách sinh viên</li>
                </ol>
              </div>
            </div>
          </div>
        </section>
        <section className="content">
          <div className="card">
            <div className="card-header">
              
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
            
            <div className="card-body table-responsive p-0">
              <table className="table table-hover text-nowrap">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Mã sinh viên</th>
                    <th>Họ tên</th>
                    <th>Email</th>
                    <th>Thời gian đăng nhập</th>
                    <th>Trạng thái</th>
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
            <label>Mã số SV</label>
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
            <label>Mã số SV</label>
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

              </div>
    );
  }
}

export default Student;