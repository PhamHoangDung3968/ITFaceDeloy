// import React, { useState, useEffect } from 'react';
// import { Line, Bar } from 'react-chartjs-2';
// import axios from 'axios';
// import { Link } from 'react-router-dom';

// const Test = () => {
//     const [lineData, setLineData] = useState({ labels: [], datasets: [] });
//     const [barData, setBarData] = useState({ labels: [], datasets: [] });
//     const [stackedBarData, setStackedBarData] = useState({ labels: [], datasets: [] });
//     const [filter, setFilter] = useState('top10'); // Default filter is top 10
  
//     useEffect(() => {
//       const fetchLineData = async () => {
//         try {
//           const response = await axios.get('/api/admin/thongke-soluong-diemdanh/fiveweeks');
//           const data = response.data;
  
//           const labels = ['5 tuần trước', '4 tuần trước', '3 tuần trước', '2 tuần trước', 'Hiện tại'];
//           const counts = data.map(item => item.count);
  
//           setLineData({
//             labels,
//             datasets: [
//               {
//                 label: 'Tổng số lượng buổi điểm danh trong 5 tuần gần đây',
//                 backgroundColor: 'rgba(75,192,192,0.4)',
//                 borderColor: 'rgba(75,192,192,1)',
//                 data: counts,
//               },
//             ],
//           });
//         } catch (error) {
//           console.error('Error fetching attendance statistics:', error);
//         }
//       };
  
//       const fetchBarData = async () => {
//         try {
//           const response = await axios.get('/api/admin/thongke-soluong-diemdanh-faceid/fiveweeks');
//           const data = response.data;
  
//           const labels = ['Hiện tại', '2 tuần trước', '3 tuần trước', '4 tuần trước', '5 tuần trước'];
//           const counts = data.map(item => item.count);
  
//           setBarData({
//             labels,
//             datasets: [
//               {
//                 label: 'Tổng số lượng SV tham gia điểm danh FaceID trong 5 tuần gần đây',
//                 backgroundColor: 'rgba(75,192,192,0.4)',
//                 borderColor: 'rgba(75,192,192,1)',
//                 data: counts,
//               },
//             ],
//           });
//         } catch (error) {
//           console.error('Error fetching FaceID attendance statistics:', error);
//         }
//       };
  
//       const fetchStackedBarData = async () => {
//         try {
//           const response = await axios.get('/api/admin/thongke-top-vanghoc');
//           const data = response.data;
  
//           const labels = data.map(item => [item.classCode, item.subjectName, item.teacherName]);
//           const dataset1 = data.map(item => (item.totalAbsences / (item.totalStudents * item.totalClasses)) * 100);
//           const dataset2 = data.map(item => 100 - ((item.totalAbsences / (item.totalStudents * item.totalClasses)) * 100));
  
//           const combinedData = data.map((item, index) => ({
//             label: labels[index],
//             dataset1: dataset1[index],
//             dataset2: dataset2[index],
//           }));
  
//           const sortedData = combinedData.sort((a, b) => b.dataset1 - a.dataset1);
  
//           let filteredData;
//           if (filter === 'top10') {
//             filteredData = sortedData.slice(0, 10);
//           } else if (filter === 'top20') {
//             filteredData = sortedData.slice(0, 20);
//           } else {
//             filteredData = sortedData;
//           }
  
//           setStackedBarData({
//             labels: filteredData.map(item => item.label),
//             datasets: [
//               {
//                 label: 'Tỷ lệ vắng học (%)',
//                 backgroundColor: 'rgba(255,99,132,0.2)',
//                 borderColor: 'rgba(255,99,132,1)',
//                 data: filteredData.map(item => item.dataset1),
//               },
//               {
//                 label: 'Tỷ lệ tham gia học (%)',
//                 backgroundColor: 'rgba(54,162,235,0.2)',
//                 borderColor: 'rgba(54,162,235,1)',
//                 data: filteredData.map(item => item.dataset2),
//               },
//             ],
//           });
//         } catch (error) {
//           console.error('Error fetching top absent classes:', error);
//         }
//       };
  
//       fetchLineData();
//       fetchBarData();
//       fetchStackedBarData();
//     }, [filter]);
  
//     const handleFilterChange = (event) => {
//       setFilter(event.target.value);
//     };
  
//     const stackedBarOptions = {
//       indexAxis: 'y', // This makes the bar chart horizontal
//       scales: {
//         x: {
//           stacked: true,
//         },
//         y: {
//           stacked: true,
//         },
//       },
//       plugins: {
//         tooltip: {
//           callbacks: {
//             label: function (context) {
//               let label = context.dataset.label || '';
//               if (label) {
//                 label += ': ';
//               }
//               if (context.parsed.x !== null) {
//                 label += context.parsed.x + '%';
//               }
//               return label;
//             },
//           },
//         },
//       },
//     };

//   return (
//     <div>
      
//       <section className="content">
//         <div className="container-fluid">
//           <div className="row">
//             <div className="col-lg-6">
//               <div className="card">
//                 <div className="card-body">
//                   <Line data={lineData} />
//                 </div>
//               </div>
//             </div>
//             <div className="col-lg-6">
//               <div className="card">
//                 <div className="card-body">
//                   <Bar data={barData} />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="card">
//           <div className="card-header">
//             <h3 className="card-title">Top các lớp học phần có số lượng sv vắng học nhiều</h3>
//             <div className="card-tools">
//               <div className="input-group input-group-sm" style={{ width: '200px' }}>
//                 <select className="form-control" value={filter} onChange={handleFilterChange}>
//                   <option value="top10">Top 10</option>
//                   <option value="top20">Top 20</option>
//                   <option value="all">Tất cả</option>
//                 </select>
//               </div>
//               <div className="input-group input-group-sm" style={{ width: '200px' }}>
//                 <select className="form-control">
                  
//                 </select>
//               </div>
//             </div>
//           </div>
//           <div className="card-body">
//             <Bar data={stackedBarData} options={stackedBarOptions} />
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Test;

import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Test1 from './test1'

const Test = () => {
  const [lineData, setLineData] = useState({ labels: [], datasets: [] });
  const [barData, setBarData] = useState({ labels: [], datasets: [] });
  const [stackedBarData, setStackedBarData] = useState({ labels: [], datasets: [] });
  const [filter, setFilter] = useState('top10'); // Default filter is top 10
  const [termFilter, setTermFilter] = useState(''); // Default term filter
  const [terms, setTerms] = useState([]); // List of terms

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
    const fetchLineData = async () => {
      try {
        const response = await axios.get('/api/admin/thongke-soluong-diemdanh/fiveweeks');
        const data = response.data.reverse();

        const labels = ['5 tuần trước', '4 tuần trước', '3 tuần trước', '2 tuần trước', 'Hiện tại'];
        const counts = data.map(item => item.count);

        setLineData({
          labels,
          datasets: [
            {
              label: 'Tổng số lượt điểm danh',
              backgroundColor: '#FF9900',
              borderColor: '#FF9900',
              data: counts,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching attendance statistics:', error);
      }
    };

    const fetchBarData = async () => {
      try {
        const response = await axios.get('/api/admin/thongke-soluong-diemdanh-faceid/fiveweeks');
        const data = response.data.reverse();

        const labels = ['Hiện tại', '2 tuần trước', '3 tuần trước', '4 tuần trước', '5 tuần trước'].reverse();
        const counts = data.map(item => item.count);

        setBarData({
          labels,
          datasets: [
            {
              label: 'Tổng số lượng SV tham gia điểm danh FaceID trong 5 tuần gần đây',
              backgroundColor: '#DCD800',
              borderColor: '#DCD800',
              data: counts,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching FaceID attendance statistics:', error);
      }
    };

    const fetchStackedBarData = async () => {
      try {
        const response = await axios.get('/api/admin/thongke-top-vanghoc');
        const data = response.data;

        const filteredData = termFilter
          ? data.filter(item => item.termID === termFilter)
          : data;

        const labels = filteredData.map(item => [item.classCode, item.subjectName, item.teacherName]);
        const dataset1 = filteredData.map(item => (item.totalAbsences / (item.totalStudents * item.totalClasses)) * 100);
        const dataset2 = filteredData.map(item => 100 - ((item.totalAbsences / (item.totalStudents * item.totalClasses)) * 100));

        const combinedData = filteredData.map((item, index) => ({
          label: labels[index],
          dataset1: dataset1[index],
          dataset2: dataset2[index],
        }));

        const sortedData = combinedData.sort((a, b) => b.dataset1 - a.dataset1);

        let finalData;
        if (filter === 'top10') {
          finalData = sortedData.slice(0, 10);
        } else if (filter === 'top20') {
          finalData = sortedData.slice(0, 20);
        } else {
          finalData = sortedData;
        }

        setStackedBarData({
          labels: finalData.map(item => item.label),
          datasets: [
            {
              label: 'Tỷ lệ vắng học (%)',
              backgroundColor: '#FF6B6B',
              borderColor: '#FF6B6B)',
              data: finalData.map(item => item.dataset1),
            },
            {
              label: 'Tỷ lệ tham gia học (%)',
              backgroundColor: '#40E0D0',
              borderColor: '#40E0D0)',
              data: finalData.map(item => item.dataset2),
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching top absent classes:', error);
      }
    };

    fetchLineData();
    fetchBarData();
    fetchStackedBarData();
  }, [filter, termFilter]);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleTermFilterChange = (event) => {
    setTermFilter(event.target.value);
  };
// Biểu dồ 3
  const stackedBarOptions = {
    indexAxis: 'y', // This makes the bar chart horizontal
    scales: {
      x: {
        stacked: true,
        ticks: {
          color: '#000000', // Màu chữ trên trục X
        },
      },
      y: {
        stacked: true,
        ticks: {
          color: '#000000', // Màu chữ trên trục Y
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: '#000000', // Màu chữ của tiêu đề legend
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.x !== null) {
              label += context.parsed.x + '%';
            }
            return label;
          },
        },
      },
    },
  };
  

  return (
    <div>
      <section className="content">
       <div className="container-fluid">
      <div className="row">
        <div className="col-lg-6">
          <div className="card">
            <div className="card-body">
            <Line 
                    data={lineData} 
                    options={{
                      scales: {
                        x: { ticks: { color: '#000000' } },
                        y: { ticks: { color: '#000000' } }
                      },
                      plugins: {
                        legend: { 
                          labels: { 
                            color: '#000000',
                            font: { size: 13}, // Làm tiêu đề biểu đồ 1
                          } 
                        },
                        tooltip: { 
                          titleColor: '#FFFFFF', 
                          bodyColor: '#FFFFFF',
                          backgroundColor: '#000000',
                          borderColor: '#FFFFFF', 
                          borderWidth: 1 
                        }
                    
                  }
                }} 
              />
            </div>
          </div>
        </div>
            <div className="col-lg-6">
  <div className="card">
    <div className="card-body">
      <Bar 
        data={{
          ...barData,
          datasets: barData.datasets.map(dataset => ({
            ...dataset,
            borderRadius: 10, // Điều chỉnh giá trị để bo tròn nhiều hay ít
          }))
        }} 
        options={{
          scales: {
            x: { ticks: { color: '#000000' } },
            y: { ticks: { color: '#000000' } }
          },
          plugins: {
            legend: { 
              labels: { 
                color: '#000000',
                font: { size: 13}, // Làm tiêu đề biểu đồ 2
              } 
            },
            tooltip: { 
              titleColor: '#FFFFFF', 
              bodyColor: '#FFFFFF',
              backgroundColor: '#000000',
              borderColor: '#FFFFFF', 
              borderWidth: 1 
            }
            
          }
        }} 
      />
    </div>
  </div>
</div>

          </div>
        </div>
        
        <Test1/>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Top các lớp học phần có số lượng sv vắng học nhiều</h3>
            <div className="card-tools" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <div className="input-group input-group-sm" style={{ width: '200px' }}>
                <select className="form-control" value={filter} onChange={handleFilterChange}>
                  <option value="top10">Top 10</option>
                  <option value="top20">Top 20</option>
                  <option value="all">Tất cả</option>
                </select>
              </div>
              <div className="input-group input-group-sm" style={{ width: '200px' }}>
                <select className="form-control" value={termFilter} onChange={handleTermFilterChange}>
                  <option value="">Tất cả học kỳ</option>
                  {terms.map(term => (
                    <option key={term._id} value={term._id}>{term.term}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="card-body">
            <Bar data={stackedBarData} options={stackedBarOptions} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Test;