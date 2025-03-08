// import axios from 'axios';
// import React, { Component } from 'react';
// import MyContext from '../contexts/MyContext';
// import { Link } from 'react-router-dom';

// class Role extends Component {
//   static contextType = MyContext;

//   constructor(props) {
//     super(props);
//     this.state = {
//       roles: [],
//       itemSelected: null
//     };
//   }

//   componentDidMount() {
//     this.apiGetRoles();
//   }

//   // Event handlers
//   btnDeleteClick = (e, item) => {
//     e.preventDefault();
//     const id = item._id;
//     if (id) {
//       this.setState({ itemSelected: item });
//       if (window.confirm('Xác nhận xóa?')) {
//         this.apiDeleteRole(id);
//       }
//     } else {
//       alert('Không tìm thấy ID!');
//     }
//   };

//   // APIs
//   apiGetRoles = () => {
//     const config = { headers: { 'x-access-token': this.context.token } };
//     axios.get('/api/admin/roles', config).then((res) => {
//       const result = res.data;
//       this.setState({ roles: result });
//     }).catch((error) => {
//       console.error('Error fetching roles:', error);
//     });
//   };

//   apiDeleteRole = (id) => {
//     const config = { headers: { 'x-access-token': this.context.token } };
//     axios.delete(`/api/admin/roles/${id}`, config).then((res) => {
//       const result = res.data;
//       if (result) {
//         alert('Thao tác thành công!');
//         this.apiGetRoles();
//       } else {
//         alert('Có lỗi xảy ra');
//       }
//     }).catch((error) => {
//       console.error('Error deleting role:', error);
//     });
//   };

//   render() {
//     const roles = this.state.roles.map((item, index) => (
//       <tr key={item._id}>
//         <td>{index + 1}</td>
//         <td>{item.tenrole}</td>
//         <td>
//           <Link to={`/admin/role/edit/${item._id}`} className="btn btn-sm btn-primary">Sửa</Link>
//           <button className="btn btn-sm btn-danger btnDelete" onClick={(e) => this.btnDeleteClick(e, item)}>Xóa</button>
//         </td>
//       </tr>
//     ));

//     return (
//       <div>
//         <section className="content-header">
//           <div className="container-fluid">
//             <div className="row mb-2">
//               <div className="col-sm-6">
//                 <h1>Quản lý quyền</h1>
//               </div>
//               <div className="col-sm-6">
//                 <ol className="breadcrumb float-sm-right">
//                   <li className="breadcrumb-item"><Link to='/admin/home'>Trang chủ</Link></li>
//                   <li className="breadcrumb-item active">Quyền</li>
//                 </ol>
//               </div>
//             </div>
//           </div>
//         </section>
//         <section className="content">
//           <div className="card">
//             <div className="card-header">
//               <h3 className="card-title">Danh sách quyền</h3>
//               <div className="card-tools">
//                 <Link className="btn btn-primary" to='/admin/role/add'>Thêm mới</Link>
//               </div>
//             </div>
//             <div className="card-body">
//               <table className="table table-hover">
//                 <thead>
//                   <tr>
//                     <th>STT</th>
//                     <th>Tên danh mục</th>
//                     <th></th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {roles}
//                 </tbody>
//               </table>
//             </div>
//             <div className="card-footer"></div>
//           </div>
//         </section>
//       </div>
//     );
//   }
// }

// export default Role;
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

class Role extends Component {
  static contextType = MyContext; // using this.context to access global state

  state = {
    roles: [],
    newRole: ''
  };

  componentDidMount() {
    this.apiGetRoles();
  }

  // Fetch roles from the API
  apiGetRoles = async () => {
    try {
      const response = await axios.get('/api/admin/roles'); // Đảm bảo đường dẫn API đúng
      console.log('Roles data:', response.data); // Log dữ liệu để kiểm tra
      this.setState({ roles: response.data });
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  // Add new role
  apiAddRole = async () => {
    try {
      const { newRole } = this.state;
      if (newRole.trim() === '') {
        alert('Tên vai trò không được để trống');
        return;
      }
      const response = await axios.post('/api/admin/roles', { tenrole: newRole });
      if (response.data) {
        alert('Thêm mới thành công!');
        this.setState({ newRole: '' });
        this.apiGetRoles();
      } else {
        alert('Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error adding role:', error);
    }
  };

  // Delete role
  apiDeleteRole = async (id) => {
    try {
      const response = await axios.delete(`/api/admin/roles/${id}`);
      if (response.data) {
        alert('Thao tác thành công!');
        this.apiGetRoles();
      } else {
        alert('Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error deleting role:', error);
    }
  };

  // Handle delete button click
  btnDeleteClick = (e, item) => {
    e.preventDefault();
    const id = item._id;
    if (id) {
      if (window.confirm('Xác nhận xóa?')) {
        this.apiDeleteRole(id);
      }
    } else {
      alert('Không tìm thấy ID!');
    }
  };

  // Handle input change
  handleInputChange = (e) => {
    this.setState({ newRole: e.target.value });
  };

  render() {
    const roles = this.state.roles.map((item, index) => (
      <tr key={item._id}>
        <td>{index + 1}</td>
        <td>{item.tenrole}</td>
        <td>
        <style>
        {`
          .action-buttons {
            display: flex;
            flex-direction: row; 
            align-items: center; 
            justify-content: center;
            gap: 8px; 
            height: 100%;
          }

          .icon-button {
            background: none;
            border: none;
            cursor: pointer;
            font-size: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .icon-button.delete {
            color: #dc3545; /* Màu đỏ */
          }

          .icon-button:hover {
            opacity: 0.8; /* Giảm độ trong suốt khi hover */
            transform: scale(1.1); /* Tăng nhẹ kích thước khi hover */
          }
        `}
        </style>
        <div className="action-buttons"></div>
          {/* <Link to={`/admin/role/edit/${item._id}`} className="btn btn-sm btn-primary">Sửa</Link> */}
          <button className="icon-button delete far fa-trash-alt" onClick={(e) => this.btnDeleteClick(e, item)}></button>
        </td>
      </tr>
    ));

    return (
      <div>
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1>Danh sách quyền</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <b><Link to='/admin/home' style={{color: '#6B63FF'}}>Trang chủ</Link></b>
                    </li>
                  <li className="breadcrumb-item active">Danh sách quyền</li>
                </ol>
              </div>
            </div>
          </div>
        </section>
        <section className="content">
          <div className="card">
            <div className="card-header">
              <div className="form-group">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Tên vai trò mới"
                    value={this.state.newRole}
                    onChange={this.handleInputChange}
                  />
                  <div className="input-group-append">
                    <button className="btn btn-primary" onClick={this.apiAddRole} style={{
                      backgroundColor: '#6B63FF',
                      borderColor: '#6B63FF',
                      color: '#ffffff',
                    }}
                    >+ Thêm mới</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-body">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Tên quyền</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {roles}
                </tbody>
              </table>
            </div>
            <div className="card-footer"></div>
          </div>
        </section>
      </div>
    );
  }
}

export default Role;