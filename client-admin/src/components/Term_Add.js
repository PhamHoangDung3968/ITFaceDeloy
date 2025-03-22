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

const AddTerm = () => {
  const navigate = useNavigate();
  const [term, setTerm] = useState({
    term: '',
    startWeek: '',
    startYear: '',
    endYear: '',
    startDate: '',
    maximumLessons: '',
    maximumClasses: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTerm(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert startDate to the desired format
      const formattedStartDate = new Date(term.startDate).toISOString();
      const termData = { ...term, startDate: formattedStartDate };

      await axios.post('/api/admin/terms', termData);
      alert('Thêm thành công!');
      navigate('/admin/semester_major');
    } catch (error) {
      console.error('Error adding term:', error);
    }
  };

  return (
    <div>
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Thêm học kỳ mới</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <b><Link to='/admin/home' style={{color:'#6B63FF'}}>Trang chủ</Link></b>
                  </li>
                <li className="breadcrumb-item">
                  <b><Link to='/admin/semester_major' style={{color:'#6B63FF'}}>Quản lý học kỳ & ngành</Link></b>
                  </li>
                <li className="breadcrumb-item active">Thêm học kỳ mới</li>
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
                  <label>Học kỳ</label>
                  <input
                    type="text"
                    className="form-control"
                    name="term"
                    value={term.term}
                    onChange={handleChange}
                    placeholder="Nhập học kỳ..."
                  />
                </div>
              </div>
              <div className="col-sm-6">
                <div className="form-group">
                  <label>Tuần bắt đầu</label>
                  <input
                    type="number"
                    className="form-control"
                    name="startWeek"
                    value={term.startWeek}
                    onChange={handleChange}
                    placeholder="Nhập tuần bắt đầu..."
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-6">
                <div className="form-group">
                  <label>Năm bắt đầu</label>
                  <input
                    type="text"
                    className="form-control"
                    name="startYear"
                    value={term.startYear}
                    onChange={handleChange}
                    placeholder="Nhập năm bắt đầu..."
                  />
                </div>
              </div>
              <div className="col-sm-6">
                <div className="form-group">
                  <label>Năm kết thúc</label>
                  <input
                    type="text"
                    className="form-control"
                    name="endYear"
                    value={term.endYear}
                    onChange={handleChange}
                    placeholder="Nhập năm kết thúc..."
                  />
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
                      value={term.startDate}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-6">
                <div className="form-group">
                  <label>Tiết tối đa: (Tiết tối đa trong 1 ngày)</label>
                  <input
                    type="number"
                    className="form-control"
                    name="maximumLessons"
                    value={term.maximumLessons}
                    onChange={handleChange}
                  />
                  
                </div>
              </div>
              <div className="col-sm-6">
                <div className="form-group">
                  <label>Lớp tối đa: (Lớp tối đa trong tuần)</label>
                  <input
                    type="number"
                    className="form-control"
                    name="maximumClasses"
                    value={term.maximumClasses}
                    onChange={handleChange}
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






export default AddTerm;