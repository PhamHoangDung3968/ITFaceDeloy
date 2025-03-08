import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../plugins/fontawesome-free/css/all.min.css';
import '../plugins/tempusdominus-bootstrap-4/css/tempusdominus-bootstrap-4.min.css';
import '../plugins/icheck-bootstrap/icheck-bootstrap.min.css';
import '../plugins/jqvmap/jqvmap.min.css';
import '../dist/css/adminlte.min.css';
import '../plugins/overlayScrollbars/css/OverlayScrollbars.min.css';
import '../plugins/daterangepicker/daterangepicker.css';
import '../plugins/summernote/summernote-bs4.min.css';

const AddMajor = () => {
  const navigate = useNavigate();
  const [major, setMajor] = useState({
    majorName: '',
    subMajorName: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMajor(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/admin/majors', major);
      alert('Thêm thành công!')
      navigate('/admin/semester_major');
    } catch (error) {
      console.error('Error adding major:', error);
    }
  };

  return (
    <div>
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Thêm ngành mới</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <b><Link to='/admin/home' style={{color: '#6B63FF'}}>Trang chủ</Link></b>
                </li>
                <li className="breadcrumb-item">
                  <b><Link to='/admin/semester_major' style={{color: '#6B63FF'}}>Quản lý học kỳ & ngành</Link></b>
                </li>
                <li className="breadcrumb-item active">Thêm ngành mới</li>
              </ol>
            </div>
          </div>
        </div>
      </section>
      <section className="content">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-sm-6">
                <div className="form-group">
                  <label>Tên ngành</label>
                  <input
                    type="text"
                    className="form-control"
                    name="majorName"
                    value={major.majorName}
                    onChange={handleChange}
                    placeholder="Nhập tên ngành..."
                  />
                </div>
              </div>
              <div className="col-sm-6">
                <div className="form-group">
                  <label>Tên ngành phụ</label>
                  <input
                    type="text"
                    className="form-control"
                    name="subMajorName"
                    value={major.subMajorName}
                    onChange={handleChange}
                    placeholder="Nhập tên ngành phụ..."
                  />
                </div>
              </div>
            </div>
            <div className="card-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', backgroundColor: 'transparent' }}>
              <Link to={`/admin/semester_major`} className="btn btn-danger" style={{
                  border: '2px solid #b8b8b8',
                  borderRadius: '8px',
                  color: '#333333',
                  backgroundColor: 'transparent',
                  padding: '5px 15px',
                  textDecoration: 'none'
                }}>Quay lại</Link>
              <button type="submit" className="btn btn-info float-right" style={{
                  border: 'none',
                  borderRadius: '8px',
                  backgroundColor: '#6B63FF',
                  color: '#ffffff',
                  padding: '5px 15px',
                }}>Xác nhận</button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};



export default AddMajor;