import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Test1 = () => {
  const [terms, setTerms] = useState([]); // List of terms
  const [termFilter, setTermFilter] = useState(''); // Default term filter
  const [studentCount, setStudentCount] = useState(0); // Total student count
  const [classSectionCount, setClassSectionCount] = useState(0); // Total class section count

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const response = await axios.get('/api/admin/terms');
        const semesters = response.data;
        const largestTerm = semesters.reduce((max, term) => term.term > max.term ? term : max, semesters[0]);
        setTerms(semesters);
        setTermFilter(largestTerm._id); // Set default term to the largest term
      } catch (error) {
        console.error('Error fetching terms:', error);
      }
    };

    fetchTerms();
  }, []);

  useEffect(() => {
    const fetchStudentCount = async () => {
      try {
        const response = await axios.get('/api/admin/thongke-soluong-sinhvien-hocky-hientai');
        const data = response.data;

        const termData = data.find(item => item.termID === termFilter);
        const filteredData = termData ? termData.totalStudentCount : 0;

        setStudentCount(filteredData);
      } catch (error) {
        console.error('Error fetching student count:', error);
      }
    };

    if (termFilter) {
      fetchStudentCount();
    }
  }, [termFilter]);

  useEffect(() => {
    const fetchClassSectionCount = async () => {
      try {
        const response = await axios.get('/api/admin/classsections');
        const data = response.data;

        const filteredData = data.filter(item => item.subjecttermID.termID === termFilter);
        setClassSectionCount(filteredData.length);
      } catch (error) {
        console.error('Error fetching class sections:', error);
      }
    };

    if (termFilter) {
      fetchClassSectionCount();
    }
  }, [termFilter]);

  const handleTermFilterChange = (event) => {
    setTermFilter(event.target.value);
  };

  return (
    <div>
      <section className="content">
        <div className="card">
          <div className="card-header">
          <h3 className="card-title">Thống kê theo học kỳ</h3>

            <div className="card-tools">
              <div className="input-group input-group-sm" style={{ width: '200px' }}>
                <select className="form-control" value={termFilter} onChange={handleTermFilterChange}>
                  {terms.map(term => (
                    <option key={term._id} value={term._id}>{term.term}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        <div className="row" style={{ margin: "15px 5px 0 5px" }}>
            <div className="col-12 col-sm-6 col-md-3">
              <div className="info-box">
                <span className="info-box-icon bg-info elevation-1"><i className="fas fa-user-graduate"></i></span>
                <div className="info-box-content">
                  <span className="info-box-text">Số lượng SV</span>
                  <span className="info-box-number">{studentCount} SV</span>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-md-3">
              <div className="info-box mb-3">
                <span className="info-box-icon bg-success elevation-1"><i className="fas fa-book"></i></span>
                <div className="info-box-content">
                  <span className="info-box-text">Số lượng LHP</span>
                  <span className="info-box-number">{classSectionCount} Lớp</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Test1;