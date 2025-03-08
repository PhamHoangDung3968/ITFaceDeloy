import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import '../plugins/fontawesome-free/css/all.min.css';
import '../plugins/tempusdominus-bootstrap-4/css/tempusdominus-bootstrap-4.min.css';
import '../plugins/icheck-bootstrap/icheck-bootstrap.min.css';
import '../plugins/jqvmap/jqvmap.min.css';
import '../dist/css/adminlte.min.css';
import '../plugins/overlayScrollbars/css/OverlayScrollbars.min.css';
import '../plugins/daterangepicker/daterangepicker.css';
import '../plugins/summernote/summernote-bs4.min.css';

const EditSubject = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [subject, setSubject] = useState({
    subjectCode: '',
    subjectName: '',
    credit: '',
    major: '',
    term: ''
  });
  const [majors, setMajors] = useState([]);
  const [terms, setTerms] = useState([]);

  useEffect(() => {
    apiGetMajors();
    apiGetTerms();
    apiGetSubject();
  }, []);

  const apiGetMajors = async () => {
    try {
      const response = await axios.get('/api/admin/majors');
      setMajors(response.data);
    } catch (error) {
      console.error('Error fetching majors:', error);
    }
  };

  const apiGetTerms = async () => {
    try {
      const response = await axios.get('/api/admin/terms');
      setTerms(response.data);
    } catch (error) {
      console.error('Error fetching terms:', error);
    }
  };

  const apiGetSubject = async () => {
    try {
      const response = await axios.get(`/api/admin/subjects/${id}`);
      setSubject(response.data);
    } catch (error) {
      console.error('Error fetching subject:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSubject(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/admin/subjects/edit/${id}`, subject);
      alert('Cập nhật thành công!');
      navigate('/admin/subject');
    } catch (error) {
      console.error('Error updating subject:', error);
    }
  };

  return (
    <div>
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Cập nhật môn học</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <b><Link to='/admin/home' style={{color:'#6B63FF'}}>Trang chủ</Link></b>
                  </li>
                <li className="breadcrumb-item">
                  <b><Link to='/admin/subject' style={{color:'#6B63FF'}}>Danh sách môn học</Link></b>
                  </li>
                <li className="breadcrumb-item active">Cập nhật môn học</li>
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
                  <label>Mã môn học</label>
                  <input
                    type="text"
                    className="form-control"
                    name="subjectCode"
                    value={subject.subjectCode}
                    onChange={handleChange}
                    placeholder="Nhập mã môn học..."
                  readOnly/>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="form-group">
                  <label>Tên môn học</label>
                  <input
                    type="text"
                    className="form-control"
                    name="subjectName"
                    value={subject.subjectName}
                    onChange={handleChange}
                    placeholder="Nhập tên môn học..."
                  />
                </div>
              </div>
            </div>
            
            <div className="row">
              <div className="col-sm-6">
                <div className="form-group">
                  <label>Số tín chỉ</label>
                  <input
                    type="number"
                    className="form-control"
                    name="credit"
                    value={subject.credit}
                    onChange={handleChange}
                    placeholder="Nhập số tín chỉ..."
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12 col-sm-6">
                <div className="form-group">
                  <label>Học kỳ</label>
                  <select
                    className="form-control select2 select2-danger"
                    data-dropdown-css-class="select2-danger"
                    style={{ width: '100%' }}
                    name="term"
                    value={subject.term}
                    onChange={handleChange}
                  >
                    <option value="">Chọn học kỳ</option>
                    {terms.map(term => (
                      <option key={term._id} value={term._id}>{term.term}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-12 col-sm-6">
                <div className="form-group">
                  <label>Ngành</label>
                  <select
                    className="form-control select2 select2-danger"
                    data-dropdown-css-class="select2-danger"
                    style={{ width: '100%' }}
                    name="major"
                    value={subject.major}
                    onChange={handleChange}
                  >
                    <option value="">Chọn ngành</option>
                    {majors.map(major => (
                      <option key={major._id} value={major._id}>{major.majorName}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="card-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', backgroundColor: 'transparent' }}>
              <Link to={`/admin/subject`} className="btn btn-danger" style={{
                  border: '2px solid #b8b8b8',
                  borderRadius: '8px',
                  color: '#333333',
                  backgroundColor: 'transparent',
                  padding: '5px 15px',
                  textDecoration: 'none'
                }}
                  >Quay lại</Link>
              <button type="submit" className="btn btn-info float-right" style={{
                  border: 'none',
                  borderRadius: '8px',
                  backgroundColor: '#6B63FF',
                  color: '#ffffff',
                  padding: '5px 15px',
                }}
                  >Xác nhận</button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default EditSubject;