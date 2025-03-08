import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import '../plugins/fontawesome-free/css/all.min.css';
import '../plugins/tempusdominus-bootstrap-4/css/tempusdominus-bootstrap-4.min.css';
import '../plugins/icheck-bootstrap/icheck-bootstrap.min.css';
import '../plugins/jqvmap/jqvmap.min.css';
import '../dist/css/adminlte.min.css';
import '../plugins/overlayScrollbars/css/OverlayScrollbars.min.css';
import '../plugins/daterangepicker/daterangepicker.css';
import '../plugins/summernote/summernote-bs4.min.css';

const Profile = () => {
  const { id } = useParams();
  const [user, setUser] = useState({
    displayName: '',
    email: '',
    phone: '',
    personalEmail: '',
    role: '',
    status: ''
  });
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const apiGetUser = async () => {
      try {
        const response = await axios.get(`/api/admin/users/profile/${id}`);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const apiGetRoles = async () => {
      try {
        const response = await axios.get('/api/admin/roles');
        setRoles(response.data);
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };

    apiGetUser();
    apiGetRoles();
  }, [id]);

  const getRoleNameById = (roleId) => {
    const role = roles.find(role => role._id === roleId);
    return role ? role.tenrole : 'Chưa cập nhật thông tin...';
  };

  const getStatusText = (status) => {
    return status === 1 ? 'Hoạt động' : 'Không hoạt động';
  };

  return (
    <div>
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Thông tin người dùng</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item"><Link to='/admin/home'>Trang chủ</Link></li>
                <li className="breadcrumb-item"><Link to='/admin/user'>Danh sách người dùng</Link></li>
                <li className="breadcrumb-item active">Thông tin người dùng</li>
              </ol>
            </div>
          </div>
        </div>
      </section>
      <section className="content">
        <div className="card-body">
          <form>
            <div className="row">
              <div className="col-sm-6">
                <div className="form-group">
                  <label>Tên người dùng</label>
                  <input type="text" className="form-control" value={user.displayName} placeholder="Chưa cập nhật thông tin..." readOnly />
                </div>
              </div>
              <div className="col-sm-6">
                <div className="form-group">
                  <label>Email</label>
                  <input type="text" className="form-control" value={user.email} placeholder="Chưa cập nhật thông tin..." readOnly />
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className="card-body">
          <form>
            <div className="row">
              <div className="col-sm-6">
                <div className="form-group">
                  <label>Số điện thoại</label>
                  <input type="text" className="form-control" value={user.phone} placeholder="Chưa cập nhật thông tin..." readOnly />
                </div>
              </div>
              <div className="col-sm-6">
                <div className="form-group">
                  <label>Email cá nhân</label>
                  <input type="text" className="form-control" value={user.personalEmail} placeholder="Chưa cập nhật thông tin..." readOnly />
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className="card-body">
          <form>
            <div className="row">
              <div className="col-sm-6">
                <div className="form-group">
                  <label>Quyền người dùng</label>
                  <input type="text" className="form-control" value={getRoleNameById(user.role)} placeholder="Chưa cập nhật thông tin..." readOnly />
                </div>
              </div>
              <div className="col-sm-6">
                <div className="form-group">
                  <label>Trạng thái tài khoản</label>
                  <input type="text" className="form-control" value={getStatusText(user.status)} placeholder="Chưa cập nhật thông tin..." readOnly />
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};


export default Profile;