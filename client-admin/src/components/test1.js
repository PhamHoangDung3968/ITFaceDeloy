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
          <div className="card-body">
            <div className="row">
              <div className="col-lg-3 col-6">
                <div className="small-box bg-info">
                  <div className="inner">
                    <h3>{studentCount}</h3>
                    <p>Số lượng SV đi học</p>
                  </div>
                  <div className="icon">
                    <i className="fa fa-user-graduate"></i>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-6">
                <div className="small-box bg-success">
                  <div className="inner">
                    <h3>{classSectionCount}<sup></sup></h3>
                    <p>Số lượng LHP</p>
                  </div>
                  <div className="icon">
                    <i className="fa fa-book"></i>
                  </div>
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