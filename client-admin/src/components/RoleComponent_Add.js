import React, { Component } from 'react';
import axios from 'axios';
import logo01 from '../dist/img/IT_VLU.svg'
import MyContext from '../contexts/MyContext';
import { Link } from 'react-router-dom';

import '../plugins/fontawesome-free/css/all.min.css'
import '../plugins/tempusdominus-bootstrap-4/css/tempusdominus-bootstrap-4.min.css'
import '../plugins/icheck-bootstrap/icheck-bootstrap.min.css'
import '../plugins/jqvmap/jqvmap.min.css'
import '../dist/css/adminlte.min.css'
import '../plugins/overlayScrollbars/css/OverlayScrollbars.min.css'
import '../plugins/daterangepicker/daterangepicker.css'
import '../plugins/summernote/summernote-bs4.min.css'
import background02 from '../dist/img/undraw_adventure_re_ncqp.svg'
class AddRole extends Component {
    static contextType = MyContext;
    constructor(props) {
        super(props);
        this.state = {
          txtID: '',
          txtName: ''
        };
      }
  render() {
    
    return (
        <div>
          
        <section class="content-header">
            <div class="container-fluid">
                <div class="row mb-2">
                    <div class="col-sm-6">
                        <h1>Quản lý quyền </h1>
                    </div>
                    <div class="col-sm-6">
                        <ol class="breadcrumb float-sm-right">
                            <li class="breadcrumb-item"><Link to='/admin/home'>Trang chủ</Link></li>
                            <li class="breadcrumb-item"><Link to='/admin/role'>Quyền</Link></li>
                            <li class="breadcrumb-item active">Thêm mới quyền</li>
                        </ol>
                    </div>
                </div>
            </div>
        </section>
        <section class="content">

<div class="card">
    <div class="card-header">
        <h3 class="card-title">Thông tin thêm mới quyền</h3>

        
    </div>
    <div class="card-body">
        <div class="bs-stepper-content">
            
            <div id="logins-part" class="content" role="tabpanel" aria-labelledby="logins-part-trigger">
            <div class="form-group">
                    <label for="exampleInputEmail1">id</label>
                    <input type="text" value={this.state.txtID} onChange={(e) => { this.setState({ txtID: e.target.value }) }} readOnly={true}  class="form-control" id="inputId"/>
                </div>
                <div class="form-group">
                    <label for="exampleInputEmail1">Tên quyền</label>
                    <input type="text" value={this.state.txtName} onChange={(e) => { this.setState({ txtName: e.target.value }) }}  class="form-control" id="inputCat"/>

                </div>
                
                <div class="form-group">
                    <Link to='/admin/role' class="btn btn-danger">Quay lại</Link>
                    <button type="submit" class="btn btn-primary" onClick={(e) => this.btnAddClick(e)}>Submit</button>
                </div>
            </div>
        </div>
    </div>
    <div class="card-footer">

    </div>
</div>

</section>        
</div>
      
    );
  }
  componentDidUpdate(prevProps) {
    if (this.props.item !== prevProps.item) {
      this.setState({ txtID: this.props.item._id, txtName: this.props.item.tenrole });
    }
  }
  updateRoles = (roles) => { 
    this.setState({ roles: roles });
  }
  
  btnAddClick(e) {
    e.preventDefault();
    const tenrole = this.state.txtName;
    if (tenrole) {
      const role = { tenrole: tenrole };
      this.apiPostRole(role);
    } else {
      alert('Vui lòng nhập tên danh mục');
    }
  }
  // apis
  apiPostRole(role) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.post('/api/admin/roles', role, config).then((res) => {
      const result = res.data;
      if (result) {
        alert('Thêm quyền mới thành công!!');
        // this.apiGetRoles();
      } else {
        alert('Có lỗi xảy ra');
      }
    });
  }
//   apiGetRoles() {
//     const config = { headers: { 'x-access-token': this.context.token } };
//     axios.get('/api/admin/roles', config).then((res) => {
//       const result = res.data;
//       this.props.updateRoles(result);
//     });
//   }
  // event-handlers
//   btnUpdateClick(e) {
//     e.preventDefault();
//     const id = this.state.txtID;
//     const name = this.state.txtName;
//     if (id && name) {
//       const cate = { name: name };
//       this.apiPutCategory(id, cate);
//     } else {
//       alert('Vui lòng điền đầy đủ thông tin!');
//     }
//   }
  // apis
//   apiPutCategory(id, cate) {
//     const config = { headers: { 'x-access-token': this.context.token } };
//     axios.put('/api/admin/categories/' + id, cate, config).then((res) => {
//       const result = res.data;
//       if (result) {
//         alert('Thao tác thành công!!');
//         this.apiGetCategories();
//       } else {
//         alert('Có lỗi xảy ra');
//       }
//     });
//   }

  // event-handlers
//   btnDeleteClick(e) {
//     e.preventDefault();
//     if (window.confirm('Xác nhận xóa?')) {
//       const id = this.state.txtID;
//       if (id) {
//         this.apiDeleteCategory(id);
//       } else {
//         alert('Vui lòng nhập ID!');
//       }
//     }
//   }
  // apis
//   apiDeleteCategory(id) {
//     const config = { headers: { 'x-access-token': this.context.token } };
//     axios.delete('/api/admin/categories/' + id, config).then((res) => {
//       const result = res.data;
//       if (result) {
//         alert('Thao tác thành công!!');
//         this.apiGetCategories();
//       } else {
//         alert('Có lỗi xảy ra');
//       }
//     });
//   }
  
}
export default AddRole;
