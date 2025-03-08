// import React, { Component } from 'react';
// import axios from 'axios';
// import ReactPaginate from 'react-paginate';
// import MyContext from '../contexts/MyContext';
// import { Link } from 'react-router-dom';
// import '../plugins/fontawesome-free/css/all.min.css';
// import '../plugins/tempusdominus-bootstrap-4/css/tempusdominus-bootstrap-4.min.css';
// import '../plugins/icheck-bootstrap/icheck-bootstrap.min.css';
// import '../plugins/jqvmap/jqvmap.min.css';
// import '../dist/css/adminlte.min.css';
// import '../plugins/overlayScrollbars/css/OverlayScrollbars.min.css';
// import '../plugins/daterangepicker/daterangepicker.css';
// import '../plugins/summernote/summernote-bs4.min.css';
// import '../dist/css/pagination.css';

// class semester_major extends Component {
//   static contextType = MyContext;

//   constructor(props) {
//     super(props);
//     this.state = {
//       terms: [],
//       majors: [],
//       currentPage: 0,
//       majorsPerPage: 5,
//       searchKeyword: '',
//       filteredMajors: [],
//       filteredTerms: [],
//       activeTab: 'area',
//     };
//   }

//   componentDidMount() {
//     this.apiGetMajors();
//     this.apiGetTerms();
//   }

//   apiGetMajors = async () => {
//     try {
//       const response = await axios.get('/api/admin/majors');
//       this.setState({ majors: response.data, filteredMajors: response.data });
//     } catch (error) {
//       console.error('Error fetching majors:', error);
//     }
//   };

//   apiGetTerms = async () => {
//     try {
//       const response = await axios.get('/api/admin/terms');
//       this.setState({ terms: response.data, filteredTerms: response.data });
//     } catch (error) {
//       console.error('Error fetching terms:', error);
//     }
//   };

//   handleStatusChange = async (e, majorId) => {
//     const newStatus = e.target.value ? 1 : 0;
//     console.log(`Updating major ID: ${majorId} with status: ${newStatus}`);
  
//     try {
//       const response = await axios.put(`/api/admin/majors/${majorId}`, { status: newStatus });
//       if (response.data) {
//         this.setState(prevState => ({
//           majors: prevState.majors.map(major =>
//             major._id === majorId ? { ...major, status: newStatus } : major
//           ),
//           filteredTerms: prevState.filteredTerms.map(major =>
//             major._id === majorId ? { ...major, status: newStatus } : major
//           )
//         }));
//         alert('Trạng thái đã được cập nhật thành công');
//         this.apiGetMajors();
//       } else {
//         alert('Có lỗi xảy ra');
//       }
//     } catch (error) {
//       console.error('Error updating major status:', error);
//       alert('Có lỗi xảy ra');
//     }
//   };

//   handleStatusChange = async (e, majorId) => {
//     const newStatus = e.target.checked ? 1 : 0;
//     try {
//       const response = await axios.put(`/api/admin/majors/${majorId}`, { status: newStatus });
//       if (response.data) {
//         this.setState(prevState => ({
//           majors: prevState.majors.map(major =>
//             major._id === majorId ? { ...major, status: newStatus } : major
//           ),
//           filteredMajors: prevState.filteredMajors.map(major =>
//             major._id === majorId ? { ...major, status: newStatus } : major
//           )
//         }));
//         alert('Trạng thái đã được cập nhật thành công');
//       } else {
//         alert('Có lỗi xảy ra');
//       }
//     } catch (error) {
//       console.error('Error updating major status:', error);
//       alert('Có lỗi xảy ra');
//     }
//   };

//   btnDeleteClick = (e, item) => {
//     e.preventDefault();
//     const id = item._id;
//     if (id) {
//       if (window.confirm('Xác nhận xóa?')) {
//         this.apiDeleteMajor(id);
//       }
//     } else {
//       alert('Không tìm thấy ID!');
//     }
//   };

//   apiDeleteMajor = async (id) => {
//     try {
//       const response = await axios.delete(`/api/admin/majors/${id}`);
//       if (response.data) {
//         alert('Thao tác thành công!');
//         this.apiGetMajors();
//       } else {
//         alert('Có lỗi xảy ra');
//       }
//     } catch (error) {
//       console.error('Error deleting major:', error);
//     }
//   };
//   handleStatusChangeTerm = async (e, termId) => {
//     const newStatus = e.target.checked ? 1 : 0;
//     try {
//       const response = await axios.put(`/api/admin/terms/${termId}`, { status: newStatus });
//       if (response.data) {
//         this.setState(prevState => ({
//           terms: prevState.terms.map(term =>
//             term._id === termId ? { ...term, status: newStatus } : term
//           ),
//           filteredTerms: prevState.filteredTerms.map(term =>
//             term._id === termId ? { ...term, status: newStatus } : term
//           )
//         }));
//         alert('Trạng thái đã được cập nhật thành công');
//       } else {
//         alert('Có lỗi xảy ra');
//       }
//     } catch (error) {
//       console.error('Error updating term status:', error);
//       alert('Có lỗi xảy ra');
//     }
//   };


//   btnDeleteClick1 = (e, item) => {
//     e.preventDefault();
//     const id = item._id;
//     if (id) {
//       if (window.confirm('Xác nhận xóa?')) {
//         this.apiDeleteTerm(id);
//       }
//     } else {
//       alert('Không tìm thấy ID!');
//     }
//   };

//   apiDeleteTerm = async (id) => {
//     try {
//       const response = await axios.delete(`/api/admin/terms/${id}`);
//       if (response.data) {
//         alert('Thao tác thành công!');
//         this.apiGetTerms();
//       } else {
//         alert('Có lỗi xảy ra');
//       }
//     } catch (error) {
//       console.error('Error deleting major:', error);
//     }
//   };

//   handleInputChange = (e) => {
//     this.setState({ [e.target.name]: e.target.value });
//   };

//   handleSearch = () => {
//     const { searchKeyword, majors } = this.state;
//     const filteredMajors = majors.filter(major => major.majorName.toLowerCase().includes(searchKeyword.toLowerCase()));
//     this.setState({ filteredMajors, currentPage: 0 });
//   };
//   handleSearch1 = () => {
//     const { searchKeyword, terms } = this.state;
//     const filteredTerms = terms.filter(term =>
//       term.term.toString().toLowerCase().includes(searchKeyword.toLowerCase())
//     );
//     this.setState({ filteredTerms, currentPage: 0 });
//   };

//   handlePageClick = (data) => {
//     this.setState({ currentPage: data.selected });
//   };

//   handleTabClick = (tab) => {
//     this.setState({ activeTab: tab });
//   };

//   render() {
//     const { currentPage, majorsPerPage, filteredMajors, filteredTerms, activeTab } = this.state;
//     const offset = currentPage * majorsPerPage;
//     const currentPageMajors = filteredMajors.slice(offset, offset + majorsPerPage);
//     const currentPageTerms = filteredTerms.slice(offset, offset + majorsPerPage);

//     const majorRows = currentPageMajors.map((item, index) => (
//       <tr key={item._id}>
//         <td>{offset + index + 1}</td>
//         <td>{item.majorName}</td>
//         <td>{item.subMajorName}</td>
//         <td>
//           <div className="form-group" style={{ display: 'flex', justifyContent: 'center' }}>
//              <label className="switch">
//               <input
//                 type="checkbox"
//                 checked={item.status === 1}
//                 onChange={(e) => this.handleStatusChange(e, item._id)}
//               />
//               <span className="slider round"></span>
//             </label>
//           </div>
//         </td>
//         <td>
//         <style>
//         {`
//           .action-buttons {
//             display: flex;
//             flex-direction: row; 
//             align-items: center; 
//             justify-content: center;
//             gap: 8px; 
//             height: 100%;
//           }

//           .icon-button {
//             background: none;
//             border: none;
//             cursor: pointer;
//             font-size: 20px;
//             display: flex;
//             justify-content: center;
//             align-items: center;
//           }

//           .icon-button.edit {
//             color: #28a745; /* Màu xanh lá */
//           }

//           .icon-button.delete {
//             color: #dc3545; /* Màu đỏ */
//           }

//           .icon-button:hover {
//             opacity: 0.8; /* Giảm độ trong suốt khi hover */
//             transform: scale(1.1); /* Tăng nhẹ kích thước khi hover */
//           }
//           .switch {
//             position: relative;
//             display: inline-block;
//             width: 34px;
//             height: 20px;
//           }

//           .switch input {
//             opacity: 0;
//             width: 0;
//             height: 0;
//           }

//           .slider {
//             position: absolute;
//             cursor: pointer;
//             top: 0;
//             left: 0;
//             right: 0;
//             bottom: 0;
//             background-color: #ccc;
//             transition: .4s;
//           }

//           .slider:before {
//             position: absolute;
//             content: "";
//             height: 12px;
//             width: 12px;
//             left: 4px;
//             bottom: 4px;
//             background-color: white;
//             transition: .4s;
//           }

//           input:checked + .slider {
//             background-color: #ffbe98;
//           }

//           input:checked + .slider:before {
//             transform: translateX(14px);
//           }

//           .slider.round {
//             border-radius: 34px;
//           }

//           .slider.round:before {
//             border-radius: 50%;
//           }
//         `}
//       </style>
//           <div className="action-buttons">
//           <Link to={`/admin/major/edit/${item._id}`} className="icon-button edit far fa-edit"></Link>
//           <button className="icon-button delete far fa-trash-alt"  onClick={(e) => this.btnDeleteClick(e, item)}></button>
//           </div>
//         </td>
//       </tr>
//     ));

//     const formatDate = (dateString) => {
//       const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
//       return new Date(dateString).toLocaleDateString('en-GB', options);
//     };
    
//     const termRows = currentPageTerms.map((item, index) => (
//       <tr key={item._id}>
//         <td>{item.term}</td>
//         <td>{item.startYear}</td>
//         <td>{item.endYear}</td>
//         <td>{item.startWeek}</td>
//         <td>{formatDate(item.startDate)}</td>
//         <td>{item.maximumLessons}</td>
//         <td>{item.maximumClasses}</td>
//         <td>
//           <div className="form-group" style={{display:'flex' , justifyContent:'center'}} >
//             <label className="switch">
//               <input
//                 type="checkbox"
//                 checked={item.status === 1}
//                 onChange={(e) => this.handleStatusChangeTerm(e, item._id)}
//               />
//               <span className="slider round"></span>
//             </label>
//           </div>
//         </td>
//         <td>
//         <style>
//         {`
//           .action-buttons {
//             display: flex;
//             flex-direction: row; 
//             align-items: center; 
//             justify-content: center;
//             gap: 8px; 
//             height: 100%;
//           }

//           .icon-button {
//             background: none;
//             border: none;
//             cursor: pointer;
//             font-size: 20px;
//             display: flex;
//             justify-content: center;
//             align-items: center;
//           }

//           .icon-button.edit {
//             color: #28a745; /* Màu xanh lá */
//           }

//           .icon-button.delete {
//             color: #dc3545; /* Màu đỏ */
//           }

//           .icon-button:hover {
//             opacity: 0.8; /* Giảm độ trong suốt khi hover */
//             transform: scale(1.1); /* Tăng nhẹ kích thước khi hover */
//           }
//           .switch {
//             position: relative;
//             display: inline-block;
//             width: 34px;
//             height: 20px;
//           }

//           .switch input {
//             opacity: 0;
//             width: 0;
//             height: 0;
//           }

//           .slider {
//             position: absolute;
//             cursor: pointer;
//             top: 0;
//             left: 0;
//             right: 0;
//             bottom: 0;
//             background-color: #ccc;
//             transition: .4s;
//           }

//           .slider:before {
//             position: absolute;
//             content: "";
//             height: 12px;
//             width: 12px;
//             left: 4px;
//             bottom: 4px;
//             background-color: white;
//             transition: .4s;
//           }

//           input:checked + .slider {
//             background-color: #ffbe98;
//           }

//           input:checked + .slider:before {
//             transform: translateX(14px);
//           }

//           .slider.round {
//             border-radius: 34px;
//           }

//           .slider.round:before {
//             border-radius: 50%;
//           }
//             .tab-container .nav-item a:hover {
//               color: #6B63FF !important; /* Màu chữ khi di chuột vào tab */
//             }

//             .tab-container .nav-item a.active {
//               background-color: #6B63FF !important; /* Màu nền khi tab được chọn */
//               color: #fff !important; /* Màu chữ khi tab được chọn */
//             }
//         `}
//       </style>
//           <div className="action-buttons">
//           <Link to={`/admin/term/edit/${item._id}`} className="icon-button edit far fa-edit"></Link>
//           <button className="icon-button delete far fa-trash-alt" onClick={(e) => this.btnDeleteClick1(e, item)}></button>
//           </div>
//         </td>
//       </tr>
//     ));

//     return (
//       <div>
//         <section className="content-header">
//           <div className="container-fluid">
//             <div className="row mb-2">
//               <div className="col-sm-6">
//                 <h1>Quản lý học kỳ & ngành</h1>
//               </div>
//               <div className="col-sm-6">
//                 <ol className="breadcrumb float-sm-right">
//                   <li className="breadcrumb-item">
//                     <b><Link to='/admin/home' style={{color: '#6B63FF'}}>Trang chủ</Link></b>
//                     </li>
//                   <li className="breadcrumb-item active">Quản lý học kỳ & ngành</li>
//                 </ol>
//               </div>
//             </div>
//           </div>
//         </section>
//         <section className="content">
//           <div className="card">
//             <div className="card-header">
//               <h3 className="card-title">
//               <div className="card-tools tab-container">
//                   <ul className="nav nav-pills ml-auto">
//                     <li className="nav-item">
//                       <a
//                         className={`nav-link ${activeTab === 'area' ? 'active' : ''}`}
//                         href="#semester"
//                         onClick={() => this.handleTabClick('area')}
//                       >
//                         Học kỳ
//                       </a>
//                     </li>
//                     <li className="nav-item">
//                       <a
//                         className={`nav-link ${activeTab === 'donut' ? 'active' : ''}`}
//                         href="#major"
//                         onClick={() => this.handleTabClick('donut')}
//                       >
//                         Ngành
//                       </a>
//                     </li>
//                   </ul>
//                 </div>
//               </h3>
//             </div>
//             <div className="card-body">
//             <div className="tab-content p-0">
//                 <div
//                   className={`chart tab-pane ${activeTab === 'area' ? 'active' : ''}`}
//                   id="semester"
//                   style={{ position: 'relative' }}
//                 >
//                   <div className="card-header">
//                     <h3 className="card-title">
//                       <div className="input-group input-group-sm" style={{ width: '300px' }}>
//                         <div className="input-group-append">
//                         <Link to='/admin/term/add' className="btn btn-success" style={{ backgroundColor: '#6B63FF', borderColor: '#6B63FF', color: '#ffffff', borderRadius: '4px'}}>
//                         <i className="fas fa" style={{
//                                 fontFamily: 'Roboto, Arial, sans-serif',
//                                 fontSize: '16px', // Kích thước tùy chỉnh
//                                 fontWeight: '400', // Độ dày của chữ
//                               }}>+ Thêm mới
//                             </i>
//                           </Link>
//                         </div>
//                       </div>
//                     </h3>
//                     <div className="card-tools">
//                       <div className="input-group input-group-sm">
//                         <input type="text" className="form-control float-right" placeholder="Tìm kiếm" name="searchKeyword" value={this.state.searchKeyword} onChange={this.handleInputChange} />
//                         <div className="input-group-append">
//                           <button type="submit" className="btn btn-default" onClick={this.handleSearch1}>
//                             <i className="fas fa-search"></i>
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="card-body table-responsive p-0">
//                     <table className="table table-hover text-nowrap">
//                       <thead>
//                         <tr>
//                           <th>Học kỳ</th>
//                           <th>Năm bắt đầu</th>
//                           <th>Năm kết thúc</th>
//                           <th>Tuần bắt đầu</th>
//                           <th>Ngày bắt đầu</th>
//                           <th>Tiết tối đa</th>
//                           <th>Lớp tối đa</th>
//                           <th>Trạng thái</th>
//                           <th></th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {termRows}
//                       </tbody>
//                     </table>
//                     <div className="pagination-container"
//                         style={{
//                           display: 'flex',
//                           justifyContent: 'center',
//                           alignItems: 'center',
//                           margin: '20px 0',
//                         }}
//                       >
//                       <ReactPaginate
//                         previousLabel={<span style={{ fontSize: "16px" }}>‹</span>}
//                         nextLabel={<span style={{ fontSize: "16px" }}>›</span>}
//                         breakLabel={'...'}
//                         breakClassName={'break-me'}
//                         pageCount={Math.ceil(filteredTerms.length / majorsPerPage)}
//                         marginPagesDisplayed={2}
//                         pageRangeDisplayed={5}
//                         onPageChange={this.handlePageClick}
//                         containerClassName={'pagination'}
//                         subContainerClassName={'pages pagination'}
//                         activeClassName={'active'}
//                       />
//                     </div>
//                   </div>
//                 </div>
//                 <div
//                   className={`chart tab-pane ${activeTab === 'donut' ? 'active' : ''}`}
//                   id="major"
//                   style={{ position: 'relative' }}
//                 >
//                   <div className="card-header">
//                     <h3 className="card-title">
//                       <div className="input-group input-group-sm" style={{ width: '300px' }}>
//                         <div className="input-group-append">
//                           <Link to='/admin/major/add' className="btn btn-success"style={{ backgroundColor: '#6B63FF', borderColor: '#6B63FF', color: '#ffffff', borderRadius: '4px'}}>
//                           <i className="fas fa" style={{
//                             fontFamily: 'Roboto, Arial, sans-serif',
//                             fontSize: '16px', // Kích thước tùy chỉnh
//                             fontWeight: '400', // Độ dày của chữ
//                             }}>+ Thêm mới
//                         </i>
//                           </Link>
//                         </div>
//                       </div>
//                     </h3>
//                     <div className="card-tools">
//                       <div className="input-group input-group-sm" style={{ width: '200px' }}>
//                         <input type="text" className="form-control float-right" placeholder="Tìm kiếm" name="searchKeyword" value={this.state.searchKeyword} onChange={this.handleInputChange} />
//                         <div className="input-group-append">
//                           <button type="submit" className="btn btn-default" onClick={this.handleSearch}>
//                             <i className="fas fa-search"></i>
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="card-body table-responsive p-0">
//                     <table className="table table-hover text-nowrap">
//                       <thead>
//                         <tr>
//                           <th>STT</th>
//                           <th>Tên ngành</th>
//                           <th>Tên viết tắt</th>
//                           <th>Trạng thái</th>
//                           <th></th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {majorRows}
//                       </tbody>
//                     </table>
//                     <div className="pagination-container"
//                         style={{
//                           display: 'flex',
//                           justifyContent: 'center',
//                           alignItems: 'center',
//                           margin: '20px 0',
//                         }}
//                       >
//                       <ReactPaginate
//                          previousLabel={<span style={{ fontSize: "16px" }}>‹</span>}
//                          nextLabel={<span style={{ fontSize: "16px" }}>›</span>}
//                         breakLabel={'...'}
//                         breakClassName={'break-me'}
//                         pageCount={Math.ceil(filteredMajors.length / majorsPerPage)}
//                         marginPagesDisplayed={2}
//                         pageRangeDisplayed={5}
//                         onPageChange={this.handlePageClick}
//                         containerClassName={'pagination'}
//                         subContainerClassName={'pages pagination'}
//                         activeClassName={'active'}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>
//         <style>
//         {`
//           .pagination {
//             display: flex;
//             list-style: none;
//             padding: 0;
//             background-color: #f6f6fb; /* Màu nền nhạt */
//             border-radius: 20px; /* Bo góc */
//             padding: 4px 8px;
//           }

//           .pagination li {
//             margin: 0 5px;
//             display: flex;
//             justify-content: center;
//             align-items: center;
//             cursor: pointer;
//           }

//           .pagination li a {
//             text-decoration: none;
//             color: #6b6b6b;
//             font-size: 14px;
//           }

//           .pagination li.active a {
//             background-color: #6B63FF; /* Màu tím */
//             color: #fff;
//             border-radius: 50%; /* Làm tròn nút */
//             width: 30px;
//             height: 30px;
//             display: flex;
//             justify-content: center;
//             align-items: center;
//           }

//           .pagination li:hover a {
//             border-radius: 50%;
//           }

//           /* Xóa khung và nền của nút Previous và Next */
//           .pagination li span {
//             font-size: 16px;
//             color: #6b6b6b;
//             border: none;
//             padding: 0;
//             background: none; /* Xóa nền */
//             outline: none; /* Xóa đường viền */
//             box-shadow: none; /* Xóa hiệu ứng khung */
//           }
//         `}
//       </style>
//       </div>
//     );
//   }
// }

// export default semester_major;

// import React, { Component } from 'react';
// import axios from 'axios';
// import ReactPaginate from 'react-paginate';
// import MyContext from '../contexts/MyContext';
// import { Link } from 'react-router-dom';
// import '../plugins/fontawesome-free/css/all.min.css';
// import '../plugins/tempusdominus-bootstrap-4/css/tempusdominus-bootstrap-4.min.css';
// import '../plugins/icheck-bootstrap/icheck-bootstrap.min.css';
// import '../plugins/jqvmap/jqvmap.min.css';
// import '../dist/css/adminlte.min.css';
// import '../plugins/overlayScrollbars/css/OverlayScrollbars.min.css';
// import '../plugins/daterangepicker/daterangepicker.css';
// import '../plugins/summernote/summernote-bs4.min.css';
// import '../dist/css/pagination.css';
// import '../dist/css/buttonIcon.css';

// class semester_major extends Component {
//   static contextType = MyContext;

//   constructor(props) {
//     super(props);
//     this.state = {
//       terms: [],
//       majors: [],
//       currentPage: 0,
//       majorsPerPage: 5,
//       searchKeyword: '',
//       filteredMajors: [],
//       filteredTerms: [],
//       activeTab: 'area',
//       showModal: false,
//       newTerm: {
//         term: '',
//         startYear: '',
//         endYear: '',
//         startWeek: '',
//         startDate: '',
//         maximumLessons: '',
//         maximumClasses: '',
//         status: 1,
//       },
//       newMajor: {
//         majorName: '',
//         subMajorName: '',
//         status: 1,
//       },
//       isEditing: false,
//       editingTermId: null,
//       editingMajorId: null,
//       errorMajorName: '',
//     };
//   }

//   componentDidMount() {
//     this.apiGetMajors();
//     this.apiGetTerms();
//   }

//   apiGetMajors = async () => {
//     try {
//       const response = await axios.get('/api/admin/majors');
//       this.setState({ majors: response.data, filteredMajors: response.data });
//     } catch (error) {
//       console.error('Error fetching majors:', error);
//     }
//   };

//   apiGetTerms = async () => {
//     try {
//       const response = await axios.get('/api/admin/terms');
//       this.setState({ terms: response.data, filteredTerms: response.data });
//     } catch (error) {
//       console.error('Error fetching terms:', error);
//     }
//   };

//   handleStatusChange = async (e, majorId) => {
//     const newStatus = e.target.value ? 1 : 0;
//     console.log(`Updating major ID: ${majorId} with status: ${newStatus}`);
  
//     try {
//       const response = await axios.put(`/api/admin/majors/${majorId}`, { status: newStatus });
//       if (response.data) {
//         this.setState(prevState => ({
//           majors: prevState.majors.map(major =>
//             major._id === majorId ? { ...major, status: newStatus } : major
//           ),
//           filteredTerms: prevState.filteredTerms.map(major =>
//             major._id === majorId ? { ...major, status: newStatus } : major
//           )
//         }));
//         alert('Trạng thái đã được cập nhật thành công');
//         this.apiGetMajors();
//       } else {
//         alert('Có lỗi xảy ra');
//       }
//     } catch (error) {
//       console.error('Error updating major status:', error);
//       alert('Có lỗi xảy ra');
//     }
//   };

//   handleStatusChange = async (e, majorId) => {
//     const newStatus = e.target.checked ? 1 : 0;
//     try {
//       const response = await axios.put(`/api/admin/majors/${majorId}`, { status: newStatus });
//       if (response.data) {
//         this.setState(prevState => ({
//           majors: prevState.majors.map(major =>
//             major._id === majorId ? { ...major, status: newStatus } : major
//           ),
//           filteredMajors: prevState.filteredMajors.map(major =>
//             major._id === majorId ? { ...major, status: newStatus } : major
//           )
//         }));
//         alert('Trạng thái đã được cập nhật thành công');
//       } else {
//         alert('Có lỗi xảy ra');
//       }
//     } catch (error) {
//       console.error('Error updating major status:', error);
//       alert('Có lỗi xảy ra');
//     }
//   };

//   btnDeleteClick = (e, item) => {
//     e.preventDefault();
//     const id = item._id;
//     if (id) {
//       if (window.confirm('Xác nhận xóa?')) {
//         this.apiDeleteMajor(id);
//       }
//     } else {
//       alert('Không tìm thấy ID!');
//     }
//   };

//   apiDeleteMajor = async (id) => {
//     try {
//       const response = await axios.delete(`/api/admin/majors/${id}`);
//       if (response.data) {
//         alert('Thao tác thành công!');
//         this.apiGetMajors();
//       } else {
//         alert('Có lỗi xảy ra');
//       }
//     } catch (error) {
//       console.error('Error deleting major:', error);
//     }
//   };

//   handleStatusChangeTerm = async (e, termId) => {
//     const newStatus = e.target.checked ? 1 : 0;
//     try {
//       const response = await axios.put(`/api/admin/terms/${termId}`, { status: newStatus });
//       if (response.data) {
//         this.setState(prevState => ({
//           terms: prevState.terms.map(term =>
//             term._id === termId ? { ...term, status: newStatus } : term
//           ),
//           filteredTerms: prevState.filteredTerms.map(term =>
//             term._id === termId ? { ...term, status: newStatus } : term
//           )
//         }));
//         alert('Trạng thái đã được cập nhật thành công');
//       } else {
//         alert('Có lỗi xảy ra');
//       }
//     } catch (error) {
//       console.error('Error updating term status:', error);
//       alert('Có lỗi xảy ra');
//     }
//   };

//   btnDeleteClick1 = (e, item) => {
//     e.preventDefault();
//     const id = item._id;
//     if (id) {
//       if (window.confirm('Xác nhận xóa?')) {
//         this.apiDeleteTerm(id);
//       }
//     } else {
//       alert('Không tìm thấy ID!');
//     }
//   };

//   apiDeleteTerm = async (id) => {
//     try {
//       const response = await axios.delete(`/api/admin/terms/${id}`);
//       if (response.data) {
//         alert('Thao tác thành công!');
//         this.apiGetTerms();
//       } else {
//         alert('Có lỗi xảy ra');
//       }
//     } catch (error) {
//       console.error('Error deleting major:', error);
//     }
//   };

//   handleInputChange = (e) => {
//     this.setState({ [e.target.name]: e.target.value });
//   };

//   handleSearch = () => {
//     const { searchKeyword, majors } = this.state;
//     const filteredMajors = majors.filter(major => major.majorName.toLowerCase().includes(searchKeyword.toLowerCase()));
//     this.setState({ filteredMajors, currentPage: 0 });
//   };

//   handleSearch1 = () => {
//     const { searchKeyword, terms } = this.state;
//     const filteredTerms = terms.filter(term =>
//       term.term.toString().toLowerCase().includes(searchKeyword.toLowerCase())
//     );
//     this.setState({ filteredTerms, currentPage: 0 });
//   };

//   handlePageClick = (data) => {
//     this.setState({ currentPage: data.selected });
//   };

//   handleTabClick = (tab) => {
//     this.setState({ activeTab: tab });
//   };

//   toggleModal = () => {
//     this.setState(prevState => ({ showModal: !prevState.showModal, isEditing: false, editingTermId: null }));
//   };
//   toggleModal1 = () => {
//     this.setState(prevState => ({ showModal1: !prevState.showModal1, isEditing: false, editingMajorId: null }));
//   };

//   handleNewTermChange = (e) => {
//     const { name, value } = e.target;
//     this.setState(prevState => ({
//       newTerm: {
//         ...prevState.newTerm,
//         [name]: value,
//       },
//     }));
//   };

//   handleAddNewTerm = async (e) => {
//     e.preventDefault();
//     if (this.state.isEditing) {
//       this.handleUpdateTerm();
//     } else {
//       try {
//         const response = await axios.post('/api/admin/terms', this.state.newTerm);
//         if (response.data) {
//           alert('Thêm mới thành công!');
//           this.apiGetTerms();
//           this.toggleModal();
//         } else {
//           alert('Có lỗi xảy ra');
//         }
//       } catch (error) {
//         console.error('Error adding new term:', error);
//         alert('Có lỗi xảy ra');
//       }
//     }
//   };
  

//   handleEditClick = (term) => {
//     console.log('Editing term:', term);
//     this.setState({
//       showModal: true,
//       isEditing: true,
//       editingTermId: term._id,
//       newTerm: {
//         term: term.term,
//         startYear: term.startYear,
//         endYear: term.endYear,
//         startWeek: term.startWeek,
//         startDate: term.startDate ? term.startDate.split('T')[0] : '',
//         maximumLessons: term.maximumLessons,
//         maximumClasses: term.maximumClasses,
//         status: term.status,
//       },
//     });
//   };
//   handleEditClickMajor = (major) => {
//     console.log('Editing major:', major);
//     this.setState({
//       showModal1: true,
//       isEditing: true,
//       editingMajorId: major._id,
//       newMajor: {
//         majorName: major.majorName,
//         subMajorName: major.subMajorName,
//         status: major.status,
//       },
//     });
//   };
  
//   handleUpdateTerm = async () => {
//     try {
//       console.log('Updating term with ID:', this.state.editingTermId);
//       console.log('Payload:', this.state.newTerm);
  
//       const formattedStartDate = new Date(this.state.newTerm.startDate).toISOString();
//       const termData = {
//         startYear: this.state.newTerm.startYear,
//         endYear: this.state.newTerm.endYear,
//         startWeek: this.state.newTerm.startWeek,
//         startDate: formattedStartDate,
//         maximumLessons: this.state.newTerm.maximumLessons,
//         maximumClasses: this.state.newTerm.maximumClasses,
//       };
  
//       const response = await axios.put(`/api/admin/terms/edit/${this.state.editingTermId}`, termData);
//       console.log('Response:', response);
  
//       if (response.data) {
//         console.log('Updated term:', response.data);
//         alert('Cập nhật thành công!');
//         this.apiGetTerms();
//         this.toggleModal();
//       } else {
//         alert('Có lỗi xảy ra');
//       }
//     } catch (error) {
//       console.error('Error updating term:', error);
//       alert('Có lỗi xảy ra');
//     }
//   };
//   handleUpdateMajor = async () => {
//     try {
//       console.log('Updating major with ID:', this.state.editingMajorId);
//       console.log('Payload:', this.state.newMajor);
  
//       const response = await axios.put(`/api/admin/majors/edit/${this.state.editingMajorId}`, this.state.newMajor);
//       console.log('Response:', response);
  
//       if (response.data) {
//         console.log('Updated major:', response.data);
//         alert('Cập nhật thành công!');
//         this.apiGetMajors();
//         this.toggleModal1();
//       } else {
//         alert('Có lỗi xảy ra');
//       }
//     } catch (error) {
//       console.error('Error updating major:', error);
//       alert('Có lỗi xảy ra');
//     }
//   };
//   handleNewMajorChange = (e) => {
//     const { name, value } = e.target;
//     this.setState(prevState => ({
//       newMajor: {
//         ...prevState.newMajor,
//         [name]: value,
//       },
//       errorMajorName: name === 'majorName' ? '' : prevState.errorMajorName,
//     }));
//   };
//   handleAddNewMajor = async (e) => {
//     e.preventDefault();
//     const { newMajor } = this.state;
  
//     if (newMajor.majorName.trim() === '') {
//       this.setState({ errorMajorName: 'Tên ngành không được để trống' });
//       return;
//     }
  
//     try {
//       // Kiểm tra xem tên ngành đã tồn tại hay chưa
//       const checkResponse = await axios.get(`/api/admin/major?majorName=${newMajor.majorName}`);
//       if (checkResponse.data.length > 0) {
//         this.setState({ errorMajorName: 'Tên ngành đã tồn tại' });
//         return;
//       }
  
//       // Thêm mới ngành
//       const response = await axios.post('/api/admin/majors', newMajor);
      
//       if (response.data) {
//         this.setState(prevState => ({
//           majors: [...prevState.majors, response.data],
//           newMajor: {
//             majorName: '',
//             subMajorName: '',
//             status: 1
//           },
//           showModal1: false,
//           errorMajorName: '', // Xóa lỗi nếu thêm mới thành công
//         }));
//         alert('Thêm mới thành công!');
//         this.apiGetMajors();
//       } else {
//         alert('Có lỗi xảy ra');
//       }
//     } catch (error) {
//       console.error('Error adding new major:', error);
//       alert('Có lỗi xảy ra');
//     }
//   };

//   render() {
//     const { currentPage, majorsPerPage, filteredMajors, filteredTerms, activeTab, showModal, showModal1, newTerm, isEditing } = this.state;
//     const offset = currentPage * majorsPerPage;
//     const currentPageMajors = filteredMajors.slice(offset, offset + majorsPerPage);
//     const currentPageTerms = filteredTerms.slice(offset, offset + majorsPerPage);

//     const majorRows = currentPageMajors.map((item, index) => (
//       <tr key={item._id}>
//         <td>{offset + index + 1}</td>
//         <td>{item.majorName}</td>
//         <td>{item.subMajorName}</td>
//         <td>
//           <div className="form-group" style={{ display: 'flex', justifyContent: 'center' }}>
//              <label className="switch">
//               <input
//                 type="checkbox"
//                 checked={item.status === 1}
//                 onChange={(e) => this.handleStatusChange(e, item._id)}
//               />
//               <span className="slider round"></span>
//             </label>
//           </div>
//         </td>
//         <td>
//           <div className="action-buttons">
//           <button className="icon-button edit far fa-edit" onClick={() => this.handleEditClickMajor(item)}></button>
//             <button className="icon-button delete far fa-trash-alt" onClick={(e) => this.btnDeleteClick(e, item)}></button>
//           </div>
//         </td>
//       </tr>
//     ));

//     const formatDate = (dateString) => {
//       const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
//       return new Date(dateString).toLocaleDateString('en-GB', options);
//     };

//     const termRows = currentPageTerms.map((item, index) => (
//       <tr key={item._id}>
//         <td>{item.term}</td>
//         <td>{item.startYear}</td>
//         <td>{item.endYear}</td>
//         <td>{item.startWeek}</td>
//         <td>{formatDate(item.startDate)}</td>
//         <td>{item.maximumLessons}</td>
//         <td>{item.maximumClasses}</td>
//         <td>
//           <div className="form-group" style={{ display: 'flex', justifyContent: 'center' }}>
//             <label className="switch">
//               <input
//                 type="checkbox"
//                 checked={item.status === 1}
//                 onChange={(e) => this.handleStatusChangeTerm(e, item._id)}
//               />
//               <span className="slider round"></span>
//             </label>
//           </div>
//         </td>
//         <td>
//           <div className="action-buttons">
//             <button className="icon-button edit far fa-edit" onClick={() => this.handleEditClick(item)}></button>
//             <button className="icon-button delete far fa-trash-alt" onClick={(e) => this.btnDeleteClick1(e, item)}></button>
//           </div>
//         </td>
//       </tr>
//     ));

//     return (
//       <div>
//         <section className="content-header">
//           <div className="container-fluid">
//             <div className="row mb-2">
//               <div className="col-sm-6">
//                 <h1>Quản lý học kỳ & ngành</h1>
//               </div>
//               <div className="col-sm-6">
//                 <ol className="breadcrumb float-sm-right">
//                   <li className="breadcrumb-item">
//                     <b><Link to='/admin/home' style={{ color: '#6B63FF' }}>Trang chủ</Link></b>
//                   </li>
//                   <li className="breadcrumb-item active">Quản lý học kỳ & ngành</li>
//                 </ol>
//               </div>
//             </div>
//           </div>
//         </section>
//         <section className="content">
//           <div className="card">
//             <div className="card-header">
//               <h3 className="card-title">
//                 <div className="card-tools tab-container">
//                   <ul className="nav nav-pills ml-auto">
//                     <li className="nav-item">
//                       <a
//                         className={`nav-link ${activeTab === 'area' ? 'active' : ''}`}
//                         href="#semester"
//                         onClick={() => this.handleTabClick('area')}
//                       >
//                         Học kỳ
//                       </a>
//                     </li>
//                     <li className="nav-item">
//                       <a
//                         className={`nav-link ${activeTab === 'donut' ? 'active' : ''}`}
//                         href="#major"
//                         onClick={() => this.handleTabClick('donut')}
//                       >
//                         Ngành
//                       </a>
//                     </li>
//                   </ul>
//                 </div>
//               </h3>
//             </div>
//             <div className="card-body">
//               <div className="tab-content p-0">
//                 <div
//                   className={`chart tab-pane ${activeTab === 'area' ? 'active' : ''}`}
//                   id="semester"
//                   style={{ position: 'relative' }}
//                 >
//                   <div className="card-header">
//                     <h3 className="card-title">
//                       <div className="input-group input-group-sm" style={{ width: '300px' }}>
//                         <div className="input-group-append">
//                           <button
//                             className="btn btn-success"
//                             style={{ backgroundColor: '#6B63FF', borderColor: '#6B63FF', color: '#ffffff', borderRadius: '4px' }}
//                             onClick={this.toggleModal}
//                           >
//                             <i className="fas fa" style={{
//                               fontFamily: 'Roboto, Arial, sans-serif',
//                               fontSize: '16px',
//                               fontWeight: '400',
//                             }}>+ Thêm mới</i>
//                           </button>
//                         </div>
//                       </div>
//                     </h3>
//                     <div className="card-tools">
//                       <div className="input-group input-group-sm">
//                         <input type="text" className="form-control float-right" placeholder="Tìm kiếm" name="searchKeyword" value={this.state.searchKeyword} onChange={this.handleInputChange} />
//                         <div className="input-group-append">
//                           <button type="submit" className="btn btn-default" onClick={this.handleSearch1}>
//                             <i className="fas fa-search"></i>
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="card-body table-responsive p-0">
//                     <table className="table table-hover text-nowrap">
//                       <thead>
//                         <tr>
//                           <th>Học kỳ</th>
//                           <th>Năm bắt đầu</th>
//                           <th>Năm kết thúc</th>
//                           <th>Tuần bắt đầu</th>
//                           <th>Ngày bắt đầu</th>
//                           <th>Tiết tối đa</th>
//                           <th>Lớp tối đa</th>
//                           <th>Trạng thái</th>
//                           <th></th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {termRows}
//                       </tbody>
//                     </table>
//                     <div className="pagination-container"
//                       style={{
//                         display: 'flex',
//                         justifyContent: 'center',
//                         alignItems: 'center',
//                         margin: '20px 0',
//                       }}
//                     >
//                       <ReactPaginate
//                         previousLabel={<span style={{ fontSize: "16px" }}>‹</span>}
//                         nextLabel={<span style={{ fontSize: "16px" }}>›</span>}
//                         breakLabel={'...'}
//                         breakClassName={'break-me'}
//                         pageCount={Math.ceil(filteredTerms.length / majorsPerPage)}
//                         marginPagesDisplayed={2}
//                         pageRangeDisplayed={5}
//                         onPageChange={this.handlePageClick}
//                         containerClassName={'pagination'}
//                         subContainerClassName={'pages pagination'}
//                         activeClassName={'active'}
//                       />
//                     </div>
//                   </div>
//                 </div>
//                 {showModal && (
//                   <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
//                     <div className="modal-dialog">
//                       <div className="modal-content">
//                         <div className="modal-header">
//                           <h5 className="modal-title">{isEditing ? 'Chỉnh sửa học kỳ' : 'Thêm mới học kỳ'}</h5>
//                           <button type="button" className="close" onClick={this.toggleModal}>
//                             <span>&times;</span>
//                           </button>
//                         </div>
//                         <div className="modal-body">
//                           <form onSubmit={this.handleAddNewTerm}>
//                           <div className="row">
//                               <div className="col-sm-6">
//                                 <div className="form-group">
//                                   <label>Học kỳ</label>
//                                   <input
//                                     type="text"
//                                     className="form-control"
//                                     name="term"
//                                     value={newTerm.term}
//                                     onChange={this.handleNewTermChange}
//                                     placeholder="Nhập học kỳ..."
//                                     disabled={isEditing} // Disable the input field when editing
//                                   />
//                                 </div>
//                               </div>
//                               <div className="col-sm-6">
//                                 <div className="form-group">
//                                   <label>Tuần bắt đầu</label>
//                                   <input
//                                     type="number"
//                                     className="form-control"
//                                     name="startWeek"
//                                     value={newTerm.startWeek}
//                                     onChange={this.handleNewTermChange}
//                                     placeholder="Nhập tuần bắt đầu..."
//                                   />
//                                 </div>
//                               </div>
//                             </div>
//                             <div className="row">
//                               <div className="col-sm-6">
//                                 <div className="form-group">
//                                   <label>Năm bắt đầu</label>
//                                   <input
//                                     type="text"
//                                     className="form-control"
//                                     name="startYear"
//                                     value={newTerm.startYear}
//                                     onChange={this.handleNewTermChange}
//                                     placeholder="Nhập năm bắt đầu..."
//                                   />
//                                 </div>
//                               </div>
//                               <div className="col-sm-6">
//                                 <div className="form-group">
//                                   <label>Năm kết thúc</label>
//                                   <input
//                                     type="text"
//                                     className="form-control"
//                                     name="endYear"
//                                     value={newTerm.endYear}
//                                     onChange={this.handleNewTermChange}
//                                     placeholder="Nhập năm kết thúc..."
//                                   />
//                                 </div>
//                               </div>
//                             </div>
//                             <div className="row">
//                               <div className="col-sm-6">
//                                 <div className="form-group">
//                                   <label>Ngày bắt đầu</label>
//                                   <div className="input-group">
//                                     <div className="input-group-prepend">
//                                       <span className="input-group-text"><i className="far fa-calendar-alt"></i></span>
//                                     </div>
//                                     <input
//                                       type="date"
//                                       className="form-control"
//                                       name="startDate"
//                                       value={newTerm.startDate}
//                                       onChange={this.handleNewTermChange}
//                                     />
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                             <div className="row">
//                               <div className="col-sm-6">
//                                 <div className="form-group">
//                                   <label>Tiết tối đa: (Tiết tối đa trong 1 ngày)</label>
//                                   <input
//                                     type="number"
//                                     className="form-control"
//                                     name="maximumLessons"
//                                     value={newTerm.maximumLessons}
//                                     onChange={this.handleNewTermChange}
//                                   />
//                                 </div>
//                               </div>
//                               <div className="col-sm-6">
//                                 <div className="form-group">
//                                   <label>Lớp tối đa: (Lớp tối đa trong tuần)</label>
//                                   <input
//                                     type="number"
//                                     className="form-control"
//                                     name="maximumClasses"
//                                     value={newTerm.maximumClasses}
//                                     onChange={this.handleNewTermChange}
//                                   />
//                                 </div>
//                               </div>
//                             </div>
//                             <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', backgroundColor: 'transparent' }}>
//                               <button type="button" className="btn btn-secondary" onClick={this.toggleModal}>Hủy</button>
//                               <button type="submit" className="btn btn-primary">{isEditing ? 'Cập nhật' : 'Lưu'}</button>
//                             </div>
//                           </form>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//                 <div
//                   className={`chart tab-pane ${activeTab === 'donut' ? 'active' : ''}`}
//                   id="major"
//                   style={{ position: 'relative' }}
//                 >
//                   <div className="card-header">
//                     <h3 className="card-title">
//                       <div className="input-group input-group-sm" style={{ width: '300px' }}>
//                         <div className="input-group-append">
//                         <button
//                             className="btn btn-success"
//                             style={{ backgroundColor: '#6B63FF', borderColor: '#6B63FF', color: '#ffffff', borderRadius: '4px' }}
//                             onClick={this.toggleModal1}
//                           >
//                             <i className="fas fa" style={{
//                               fontFamily: 'Roboto, Arial, sans-serif',
//                               fontSize: '16px',
//                               fontWeight: '400',
//                             }}>+ Thêm mới</i>
//                           </button>
//                         </div>
//                       </div>
//                     </h3>
//                     <div className="card-tools">
//                       <div className="input-group input-group-sm" style={{ width: '200px' }}>
//                         <input type="text" className="form-control float-right" placeholder="Tìm kiếm" name="searchKeyword" value={this.state.searchKeyword} onChange={this.handleInputChange} />
//                         <div className="input-group-append">
//                           <button type="submit" className="btn btn-default" onClick={this.handleSearch}>
//                             <i className="fas fa-search"></i>
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="card-body table-responsive p-0">
//                     <table className="table table-hover text-nowrap">
//                       <thead>
//                         <tr>
//                           <th>STT</th>
//                           <th>Tên ngành</th>
//                           <th>Tên viết tắt</th>
//                           <th>Trạng thái</th>
//                           <th></th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {majorRows}
//                       </tbody>
//                     </table>
//                     <div className="pagination-container"
//                         style={{
//                           display: 'flex',
//                           justifyContent: 'center',
//                           alignItems: 'center',
//                           margin: '20px 0',
//                         }}
//                       >
//                       <ReactPaginate
//                          previousLabel={<span style={{ fontSize: "16px" }}>‹</span>}
//                          nextLabel={<span style={{ fontSize: "16px" }}>›</span>}
//                         breakLabel={'...'}
//                         breakClassName={'break-me'}
//                         pageCount={Math.ceil(filteredMajors.length / majorsPerPage)}
//                         marginPagesDisplayed={2}
//                         pageRangeDisplayed={5}
//                         onPageChange={this.handlePageClick}
//                         containerClassName={'pagination'}
//                         subContainerClassName={'pages pagination'}
//                         activeClassName={'active'}
//                       />
//                     </div>
//                   </div>
//                 </div>
//                 {showModal1 && (
//   <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
//     <div className="modal-dialog">
//       <div className="modal-content">
//         <div className="modal-header">
//           <h5 className="modal-title">{isEditing ? 'Chỉnh sửa ngành' : 'Thêm mới ngành'}</h5>
//           <button type="button" className="close" onClick={this.toggleModal1}>
//             <span>&times;</span>
//           </button>
//         </div>
//         <div className="modal-body">
//           <form onSubmit={isEditing ? this.handleUpdateMajor : this.handleAddNewMajor}>
//             <div className="form-group">
//               <label>
//                 Tên ngành <span style={{ color: 'red' }}>{this.state.errorMajorName ? `(${this.state.errorMajorName})` : '*'}</span>
//               </label>
//               <input
//                 type="text"
//                 className="form-control"
//                 name="majorName"
//                 value={this.state.newMajor.majorName}
//                 onChange={this.handleNewMajorChange}
//                 placeholder="Nhập tên ngành..."
//                 readOnly={isEditing}
//               />
//               {this.state.errorMajorName && <div className="error-message" style={{ color: 'red' }}>{this.state.errorMajorName}</div>}
//             </div>
//             <div className="form-group">
//               <label>
//                 Tên viết tắt
//               </label>
//               <input
//                 type="text"
//                 className="form-control"
//                 name="subMajorName"
//                 value={this.state.newMajor.subMajorName}
//                 onChange={this.handleNewMajorChange}
//                 placeholder="Nhập tên viết tắt..."
//               />
//             </div>
//             <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', backgroundColor: 'transparent' }}>
//               <button type="button" className="btn btn-secondary" onClick={this.toggleModal1}>Hủy</button>
//               <button type="submit" className="btn btn-primary">{isEditing ? 'Cập nhật' : 'Lưu'}</button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   </div>
// )}
//               </div>
//             </div>
//           </div>
//         </section>
//       </div>
//     );
//   }
// }

// export default semester_major;



//----------------------------------------------------------------------------------------------
//Thành công
// import React, { Component } from 'react';
// import axios from 'axios';
// import ReactPaginate from 'react-paginate';
// import MyContext from '../contexts/MyContext';
// import { Link } from 'react-router-dom';
// import '../plugins/fontawesome-free/css/all.min.css';
// import '../plugins/tempusdominus-bootstrap-4/css/tempusdominus-bootstrap-4.min.css';
// import '../plugins/icheck-bootstrap/icheck-bootstrap.min.css';
// import '../plugins/jqvmap/jqvmap.min.css';
// import '../dist/css/adminlte.min.css';
// import '../plugins/overlayScrollbars/css/OverlayScrollbars.min.css';
// import '../plugins/daterangepicker/daterangepicker.css';
// import '../plugins/summernote/summernote-bs4.min.css';
// import '../dist/css/pagination.css';
// import '../dist/css/buttonIcon.css';

// class semester_major extends Component {
//   static contextType = MyContext;

//   constructor(props) {
//     super(props);
//     this.state = {
//       terms: [],
//       majors: [],
//       currentPage: 0,
//       majorsPerPage: 5,
//       searchKeyword: '',
//       filteredMajors: [],
//       filteredTerms: [],
//       activeTab: 'area',
//       showModalAddMajor: false,
//       showModalEditMajor: false,
//       newMajor: {
//         majorName: '',
//         subMajorName: '',
//         status: 1,
//       },
//       editingMajor: {
//         majorName: '',
//         subMajorName: '',
//         status: 1,
//       },
//       isEditing: false,
//       editingMajorId: null,
//       errorMajorName: '',
//     };
//   }

//   componentDidMount() {
//     this.apiGetMajors();
//     // this.apiGetTerms();
//   }

//   apiGetMajors = async () => {
//     try {
//       const response = await axios.get('/api/admin/majors');
//       this.setState({ majors: response.data, filteredMajors: response.data });
//     } catch (error) {
//       console.error('Error fetching majors:', error);
//     }
//   };

//   handleStatusChange = async (e, majorId) => {
//     const newStatus = e.target.checked ? 1 : 0;
//     try {
//       const response = await axios.put(`/api/admin/majors/${majorId}`, { status: newStatus });
//       if (response.data) {
//         this.setState(prevState => ({
//           majors: prevState.majors.map(major =>
//             major._id === majorId ? { ...major, status: newStatus } : major
//           ),
//           filteredMajors: prevState.filteredMajors.map(major =>
//             major._id === majorId ? { ...major, status: newStatus } : major
//           )
//         }));
//         alert('Trạng thái đã được cập nhật thành công');
//       } else {
//         alert('Có lỗi xảy ra');
//       }
//     } catch (error) {
//       console.error('Error updating major status:', error);
//       alert('Có lỗi xảy ra');
//     }
//   };

//   btnDeleteClick = (e, item) => {
//     e.preventDefault();
//     const id = item._id;
//     if (id) {
//       if (window.confirm('Xác nhận xóa?')) {
//         this.apiDeleteMajor(id);
//       }
//     } else {
//       alert('Không tìm thấy ID!');
//     }
//   };

//   apiDeleteMajor = async (id) => {
//     try {
//       const response = await axios.delete(`/api/admin/majors/${id}`);
//       if (response.data) {
//         alert('Thao tác thành công!');
//         this.apiGetMajors();
//       } else {
//         alert('Có lỗi xảy ra');
//       }
//     } catch (error) {
//       console.error('Error deleting major:', error);
//     }
//   };

//   handleInputChange = (e) => {
//     this.setState({ [e.target.name]: e.target.value });
//   };

//   handleSearch = () => {
//     const { searchKeyword, majors } = this.state;
//     const filteredMajors = majors.filter(major => major.majorName.toLowerCase().includes(searchKeyword.toLowerCase()));
//     this.setState({ filteredMajors, currentPage: 0 });
//   };

//   handlePageClick = (data) => {
//     this.setState({ currentPage: data.selected });
//   };

//   handleTabClick = (tab) => {
//     this.setState({ activeTab: tab });
//   };

//   toggleModalAddMajor = () => {
//     this.setState(prevState => ({ showModalAddMajor: !prevState.showModalAddMajor }));
//   };

//   toggleModalEditMajor = () => {
//     this.setState(prevState => ({ showModalEditMajor: !prevState.showModalEditMajor }));
//   };

//   handleEditClickMajor = (major) => {
//     console.log('Editing major:', major);
//     this.setState({
//       showModalEditMajor: true,
//       isEditing: true,
//       editingMajorId: major._id,
//       editingMajor: {
//         majorName: major.majorName,
//         subMajorName: major.subMajorName,
//         status: major.status,
//       },
//     });
//   };

//   handleUpdateMajor = async (e) => {
//     e.preventDefault();
//     try {
//       console.log('Updating major with ID:', this.state.editingMajorId);
//       console.log('Payload:', this.state.editingMajor);

//       const response = await axios.put(`/api/admin/majors/edit/${this.state.editingMajorId}`, this.state.editingMajor);
//       console.log('Response:', response);

//       if (response.data) {
//         console.log('Updated major:', response.data);
//         alert('Cập nhật thành công!');
//         this.apiGetMajors();
//         this.toggleModalEditMajor();
//       } else {
//         alert('Có lỗi xảy ra');
//       }
//     } catch (error) {
//       console.error('Error updating major:', error);
//       alert('Có lỗi xảy ra');
//     }
//   };

//   handleNewMajorChange = (e) => {
//     const { name, value } = e.target;
//     this.setState(prevState => ({
//       newMajor: {
//         ...prevState.newMajor,
//         [name]: value,
//       },
//       errorMajorName: name === 'majorName' ? '' : prevState.errorMajorName,
//     }));
//   };

//   handleEditingMajorChange = (e) => {
//     const { name, value } = e.target;
//     this.setState(prevState => ({
//       editingMajor: {
//         ...prevState.editingMajor,
//         [name]: value,
//       },
//     }));
//   };

//   handleAddNewMajor = async (e) => {
//     e.preventDefault();
//     const { newMajor } = this.state;

//     if (newMajor.majorName.trim() === '') {
//       this.setState({ errorMajorName: 'Tên ngành không được để trống' });
//       return;
//     }

//     try {
//       const checkResponse = await axios.get(`/api/admin/major?majorName=${newMajor.majorName}`);
//       if (checkResponse.data.length > 0) {
//         this.setState({ errorMajorName: 'Tên ngành đã tồn tại' });
//         return;
//       }
//       const response = await axios.post('/api/admin/majors', newMajor);
//       if (response.data) {
//         this.setState(prevState => ({
//           majors: [...prevState.majors, response.data],
//           newMajor: {
//             majorName: '',
//             subMajorName: '',
//             status: 1
//           },
//           showModalAddMajor: false,
//           errorMajorName: '',
//         }));
//         alert('Thêm mới thành công!');
//         this.apiGetMajors();
//       } else {
//         alert('Có lỗi xảy ra');
//       }
//     } catch (error) {
//       console.error('Error adding new major:', error);
//       alert('Có lỗi xảy ra');
//     }
//   };

//   render() {
//     const { currentPage, majorsPerPage, filteredMajors, activeTab, showModalAddMajor, showModalEditMajor, newMajor, editingMajor, errorMajorName } = this.state;
//     const offset = currentPage * majorsPerPage;
//     const currentPageMajors = filteredMajors.slice(offset, offset + majorsPerPage);

//     const majorRows = currentPageMajors.map((item, index) => (
//       <tr key={item._id}>
//         <td>{offset + index + 1}</td>
//         <td>{item.majorName}</td>
//         <td>{item.subMajorName}</td>
//         <td>
//           <div className="form-group" style={{ display: 'flex', justifyContent: 'center' }}>
//             <label className="switch">
//               <input
//                 type="checkbox"
//                 checked={item.status === 1}
//                 onChange={(e) => this.handleStatusChange(e, item._id)}
//               />
//               <span className="slider round"></span>
//             </label>
//           </div>
//         </td>
//         <td>
//           <div className="action-buttons">
//             <button className="icon-button edit far fa-edit" onClick={() => this.handleEditClickMajor(item)}></button>
//             <button className="icon-button delete far fa-trash-alt" onClick={(e) => this.btnDeleteClick(e, item)}></button>
//           </div>
//         </td>
//       </tr>
//     ));

//     return (
//       <div>
//         <section className="content-header">
//           <div className="container-fluid">
//             <div className="row mb-2">
//             <div className="col-sm-6">
//                 <h1>Quản lý học kỳ & ngành</h1>
//               </div>
//               <div className="col-sm-6">
//                 <ol className="breadcrumb float-sm-right">
//                   <li className="breadcrumb-item">
//                     <b><Link to='/admin/home' style={{ color: '#6B63FF' }}>Trang chủ</Link></b>
//                   </li>
//                   <li className="breadcrumb-item active">Quản lý học kỳ & ngành</li>
//                 </ol>
//               </div>
//             </div>
//           </div>
//         </section>
//         <section className="content">
//           <div className="card">
//             <div className="card-header">
//               <h3 className="card-title">
//                 <div className="card-tools tab-container">
//                   <ul className="nav nav-pills ml-auto">
//                     <li className="nav-item">
//                       <a
//                         className={`nav-link ${activeTab === 'area' ? 'active' : ''}`}
//                         href="#semester"
//                         onClick={() => this.handleTabClick('area')}
//                       >
//                         Học kỳ
//                       </a>
//                     </li>
//                     <li className="nav-item">
//                       <a
//                         className={`nav-link ${activeTab === 'donut' ? 'active' : ''}`}
//                         href="#major"
//                         onClick={() => this.handleTabClick('donut')}
//                       >
//                         Ngành
//                       </a>
//                     </li>
//                   </ul>
//                 </div>
//               </h3>
//             </div>
//             <div className="card-body">
//               <div className="tab-content p-0">
//                 <div
//                   className={`chart tab-pane ${activeTab === 'donut' ? 'active' : ''}`}
//                   id="major"
//                   style={{ position: 'relative' }}
//                 >
//                   <div className="card-header">
//                     <h3 className="card-title">
//                       <div className="input-group input-group-sm" style={{ width: '300px' }}>
//                         <div className="input-group-append">
//                           <button
//                             className="btn btn-success"
//                             style={{ backgroundColor: '#6B63FF', borderColor: '#6B63FF', color: '#ffffff', borderRadius: '4px' }}
//                             onClick={this.toggleModalAddMajor}
//                           >
//                             <i className="fas fa" style={{
//                               fontFamily: 'Roboto, Arial, sans-serif',
//                               fontSize: '16px',
//                               fontWeight: '400',
//                             }}>+ Thêm mới</i>
//                           </button>
//                         </div>
//                       </div>
//                     </h3>
//                     <div className="card-tools">
//                       <div className="input-group input-group-sm" style={{ width: '200px' }}>
//                         <input type="text" className="form-control float-right" placeholder="Tìm kiếm" name="searchKeyword" value={this.state.searchKeyword} onChange={this.handleInputChange} />
//                         <div className="input-group-append">
//                           <button type="submit" className="btn btn-default" onClick={this.handleSearch}>
//                             <i className="fas fa-search"></i>
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="card-body table-responsive p-0">
//                     <table className="table table-hover text-nowrap">
//                       <thead>
//                         <tr>
//                           <th>STT</th>
//                           <th>Tên ngành</th>
//                           <th>Tên viết tắt</th>
//                           <th>Trạng thái</th>
//                           <th></th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {majorRows}
//                       </tbody>
//                     </table>
//                     <div className="pagination-container"
//                       style={{
//                         display: 'flex',
//                         justifyContent: 'center',
//                         alignItems: 'center',
//                         margin: '20px 0',
//                       }}
//                     >
//                       <ReactPaginate
//                         previousLabel={<span style={{ fontSize: "16px" }}>‹</span>}
//                         nextLabel={<span style={{ fontSize: "16px" }}>›</span>}
//                         breakLabel={'...'}
//                         breakClassName={'break-me'}
//                         pageCount={Math.ceil(filteredMajors.length / majorsPerPage)}
//                         marginPagesDisplayed={2}
//                         pageRangeDisplayed={5}
//                         onPageChange={this.handlePageClick}
//                         containerClassName={'pagination'}
//                         subContainerClassName={'pages pagination'}
//                         activeClassName={'active'}
//                       />
//                     </div>
//                   </div>
//                 </div>
//                 {showModalAddMajor && (
//                   <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
//                     <div className="modal-dialog">
//                       <div className="modal-content">
//                         <div className="modal-header">
//                           <h5 className="modal-title">Thêm mới ngành</h5>
//                           <button type="button" className="close" onClick={this.toggleModalAddMajor}>
//                             <span>&times;</span>
//                           </button>
//                         </div>
//                         <div className="modal-body">
//                           <form onSubmit={this.handleAddNewMajor}>
//                             <div className="form-group">
//                               <label>Tên ngành</label>
//                               <input
//                                 type="text"
//                                 className="form-control"
//                                 name="majorName"
//                                 value={newMajor.majorName}
//                                 onChange={this.handleNewMajorChange}
//                                 placeholder="Nhập tên ngành..."
//                               />
//                               {errorMajorName && <span className="text-danger">{errorMajorName}</span>}
//                             </div>
//                             <div className="form-group">
//                               <label>Tên ngành phụ</label>
//                               <input
//                                 type="text"
//                                 className="form-control"
//                                 name="subMajorName"
//                                 value={newMajor.subMajorName}
//                                 onChange={this.handleNewMajorChange}
//                                 placeholder="Nhập tên ngành phụ..."
//                               />
//                             </div>
//                             <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
//                               <button type="button" className="btn btn-danger" onClick={this.toggleModalAddMajor}>Hủy</button>
//                               <button type="submit" className="btn btn-info" style={{ backgroundColor: '#6B63FF', borderColor: '#6B63FF' }}>Xác nhận</button>
//                             </div>
//                           </form>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//                 {showModalEditMajor && (
//                   <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
//                     <div className="modal-dialog">
//                       <div className="modal-content">
//                         <div className="modal-header">
//                           <h5 className="modal-title">Chỉnh sửa ngành</h5>
//                           <button type="button" className="close" onClick={this.toggleModalEditMajor}>
//                             <span>&times;</span>
//                           </button>
//                         </div>
//                         <div className="modal-body">
//                           <form onSubmit={this.handleUpdateMajor}>
//                             <div className="form-group">
//                               <label>Tên ngành</label>
//                               <input
//                                 type="text"
//                                 className="form-control"
//                                 name="majorName"
//                                 value={editingMajor.majorName}
//                                 onChange={this.handleEditingMajorChange}
//                                 placeholder="Nhập tên ngành..."
//                               />
//                             </div>
//                             <div className="form-group">
//                               <label>Tên ngành phụ</label>
//                               <input
//                                 type="text"
//                                 className="form-control"
//                                 name="subMajorName"
//                                 value={editingMajor.subMajorName}
//                                 onChange={this.handleEditingMajorChange}
//                                 placeholder="Nhập tên ngành phụ..."
//                               />
//                             </div>
//                             <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
//                               <button type="button" className="btn btn-danger" onClick={this.toggleModalEditMajor}>Hủy</button>
//                               <button type="submit" className="btn btn-info" style={{ backgroundColor: '#6B63FF', borderColor: '#6B63FF' }}>Xác nhận</button>
//                             </div>
//                           </form>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </section>
//       </div>
//     );
//   }
// }

// export default semester_major;


import React, { Component } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
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

class semester_major extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      terms: [],
      majors: [],
      currentPage: 0,
      majorsPerPage: 5,
      searchKeyword: '',
      filteredMajors: [],
      filteredTerms: [],
      activeTab: 'area',
      showModalAddTerm: false,
      showModalEditTerm: false,
      showModalAddMajor: false,
      showModalEditMajor: false,
      newTerm: {
        term: '',
        startYear: '',
        endYear: '',
        startWeek: '',
        startDate: '',
        maximumLessons: '',
        maximumClasses: '',
        status: 1,
      },
      editingTerm: {
        term: '',
        startYear: '',
        endYear: '',
        startWeek: '',
        startDate: '',
        maximumLessons: '',
        maximumClasses: '',
        status: 1,
      },
      newMajor: {
        majorName: '',
        subMajorName: '',
        status: 1,
        majorCode:'',
      },
      editingMajor: {
        majorName: '',
        subMajorName: '',
        status: 1,
      },
      isEditing: false,
      editingTermId: null,
      editingMajorId: null,
      errorMajorName: '',
      errormajorCode:'',
      errorTerm: '',
      errorStartWeek: '',
      errorStartYear: '',
      errorEndYear: '',
      errorStartDate: '',
    };
  }

  componentDidMount() {
    this.apiGetMajors();
    this.apiGetTerms();
  }

  apiGetMajors = async () => {
    try {
      const response = await axios.get('/api/admin/majors');
      this.setState({ majors: response.data, filteredMajors: response.data });
    } catch (error) {
      console.error('Error fetching majors:', error);
    }
  };
  handleStatusChange = async (e, majorId) => {
    const newStatus = e.target.checked ? 1 : 0;
    try {
      const response = await axios.put(`/api/admin/majors/${majorId}`, { status: newStatus });
      if (response.data) {
        this.setState(prevState => ({
          majors: prevState.majors.map(major =>
            major._id === majorId ? { ...major, status: newStatus } : major
          ),
          filteredMajors: prevState.filteredMajors.map(major =>
            major._id === majorId ? { ...major, status: newStatus } : major
          )
        }));
        this.showToast('Trạng thái đã được cập nhật thành công');
      } else {
        this.showErrorToast('Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error updating major status:', error);
      this.showErrorToast('Có lỗi xảy ra');
    }
  };
  btnDeleteClick = (e, item) => {
    e.preventDefault();
    const id = item._id;
    if (id) {
      if (window.confirm('Xác nhận xóa?')) {
        this.apiDeleteMajor(id);
      }
    } else {
      alert('Không tìm thấy ID!');
    }
  };

  apiDeleteMajor = async (id) => {
    try {
      const response = await axios.delete(`/api/admin/majors/${id}`);
      if (response.data) {
        alert('Thao tác thành công!');
        this.apiGetMajors();
      } else {
        alert('Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error deleting major:', error);
    }
  };

  toggleModalAddMajor = () => {
    this.setState(prevState => ({ showModalAddMajor: !prevState.showModalAddMajor }));
  };

  toggleModalEditMajor = () => {
    this.setState(prevState => ({ showModalEditMajor: !prevState.showModalEditMajor }));
  };
  handleEditClickMajor = (major) => {
    console.log('Editing major:', major);
    this.setState({
      showModalEditMajor: true,
      isEditing: true,
      editingMajorId: major._id,
      editingMajor: {
        majorName: major.majorName,
        subMajorName: major.subMajorName,
        status: major.status,
      },
    });
  };

  handleUpdateMajor = async (e) => {
    e.preventDefault();
    try {
      console.log('Updating major with ID:', this.state.editingMajorId);
      console.log('Payload:', this.state.editingMajor);

      const response = await axios.put(`/api/admin/majors/edit/${this.state.editingMajorId}`, this.state.editingMajor);
      console.log('Response:', response);

      if (response.data) {
        console.log('Updated major:', response.data);
        this.showToast('Cập nhật thành công!');
        this.apiGetMajors();
        this.toggleModalEditMajor();
      } else {
        this.showErrorToast('Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error updating major:', error);
      this.showErrorToast('Có lỗi xảy ra');
    }
  };

  handleNewMajorChange = (e) => {
    const { name, value } = e.target;
    this.setState(prevState => ({
      newMajor: {
        ...prevState.newMajor,
        [name]: value,
      },
      errormajorCode: name === 'majorCode' ? '' : prevState.errormajorCode,
      errorMajorName: name === 'majorName' ? '' : prevState.errorMajorName,
    }));
  };

  handleEditingMajorChange = (e) => {
    const { name, value } = e.target;
    this.setState(prevState => ({
      editingMajor: {
        ...prevState.editingMajor,
        [name]: value,
      },
    }));
  };

  handleAddNewMajor = async (e) => {
    e.preventDefault();
    const { newMajor } = this.state;

    if (newMajor.majorName.trim() === '') {
      this.setState({ errorMajorName: 'Tên ngành không được để trống' });
      return;
    }

    try {
      const checkResponse = await axios.get(`/api/admin/major?majorName=${newMajor.majorName}`);
      if (checkResponse.data.length > 0) {
        this.setState({ errorMajorName: 'Tên ngành đã tồn tại' });
        return;
      }
      const response = await axios.post('/api/admin/majors', newMajor);
      if (response.data) {
        this.setState(prevState => ({
          majors: [...prevState.majors, response.data],
          newMajor: {
            majorName: '',
            subMajorName: '',
            status: 1,
            majorCode:'',
          },
          showModalAddMajor: false,
          errorMajorName: '',
          errormajorCode:'',
        }));
        this.showToast('Thêm mới thành công!');
        this.apiGetMajors();
      } else {
        this.showErrorToast('Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error adding new major:', error);
      this.showErrorToast('Có lỗi xảy ra');
    }
  };




  apiGetTerms = async () => {
    try {
      const response = await axios.get('/api/admin/terms');
      this.setState({ terms: response.data, filteredTerms: response.data });
    } catch (error) {
      console.error('Error fetching terms:', error);
    }
  };

  handleStatusChangeTerm = async (e, termId) => {
    const newStatus = e.target.checked ? 1 : 0;
    try {
      const response = await axios.put(`/api/admin/terms/${termId}`, { status: newStatus });
      if (response.data) {
        this.setState(prevState => ({
          terms: prevState.terms.map(term =>
            term._id === termId ? { ...term, status: newStatus } : term
          ),
          filteredTerms: prevState.filteredTerms.map(term =>
            term._id === termId ? { ...term, status: newStatus } : term
          )
        }));
        this.showToast('Trạng thái đã được cập nhật thành công');
      } else {
        this.showErrorToast('Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error updating term status:', error);
      this.showErrorToast('Có lỗi xảy ra');
    }
  };

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSearch = () => {
    const { searchKeyword, majors } = this.state;
    const filteredMajors = majors.filter(major => major.majorName.toLowerCase().includes(searchKeyword.toLowerCase()));
    this.setState({ filteredMajors, currentPage: 0 });
  };

  handleSearch1 = () => {
    const { searchKeyword, terms } = this.state;
    const filteredTerms = terms.filter(term =>
      term.term.toString().toLowerCase().includes(searchKeyword.toLowerCase())
    );
    this.setState({ filteredTerms, currentPage: 0 });
  };

  handlePageClick = (data) => {
    this.setState({ currentPage: data.selected });
  };

  handleTabClick = (tab) => {
    this.setState({ activeTab: tab });
  };

  toggleModalAddTerm = () => {
    this.setState(prevState => ({ showModalAddTerm: !prevState.showModalAddTerm }));
  };

  toggleModalEditTerm = () => {
    this.setState(prevState => ({ showModalEditTerm: !prevState.showModalEditTerm }));
  };

  handleNewTermChange = (e) => {
    const { name, value } = e.target;
    this.setState(prevState => ({
      newTerm: {
        ...prevState.newTerm,
        [name]: value,
      },
      [`error${name.charAt(0).toUpperCase() + name.slice(1)}`]: '',
    }));
  };

  handleEditingTermChange = (e) => {
    const { name, value } = e.target;
    this.setState(prevState => ({
      editingTerm: {
        ...prevState.editingTerm,
        [name]: value,
      },
    }));
  };

  validateTerm = (term) => {
    let isValid = true;
    const errors = {};

    if (!term.term || typeof term.term !== 'string' || !term.term.trim()) {
      errors.errorTerm = 'Học kỳ không được để trống';
      isValid = false;
    }

    if (!term.startWeek || typeof term.startWeek !== 'string' || !term.startWeek.trim()) {
      errors.errorStartWeek = 'Tuần bắt đầu không được để trống';
      isValid = false;
    }

    if (!term.startYear || typeof term.startYear !== 'string' || !term.startYear.trim()) {
      errors.errorStartYear = 'Năm bắt đầu không được để trống';
      isValid = false;
    }

    if (!term.endYear || typeof term.endYear !== 'string' || !term.endYear.trim()) {
      errors.errorEndYear = 'Năm kết thúc không được để trống';
      isValid = false;
    }

    if (!term.startDate || typeof term.startDate !== 'string' || !term.startDate.trim()) {
      errors.errorStartDate = 'Ngày bắt đầu không được để trống';
      isValid = false;
    }

    this.setState(errors);
    return isValid;
  };

  handleAddNewTerm = async (e) => {
    e.preventDefault();
    const { newTerm } = this.state;

    if (!this.validateTerm(newTerm)) {
      return;
    }

    try {
      const checkResponse = await axios.get(`/api/admin/term?term=${newTerm.term}`);
      if (checkResponse.data.length > 0) {
        this.setState({ errorTerm: 'Học kỳ đã tồn tại' });
        return;
      }

      const formattedStartDate = new Date(newTerm.startDate).toISOString();
      const termData = { ...newTerm, startDate: formattedStartDate };

      const response = await axios.post('/api/admin/terms', termData);
      if (response.data) {
        this.showToast('Thêm mới thành công!');
        this.apiGetTerms();
        this.toggleModalAddTerm();
      } else {
        this.showErrorToast('Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error adding new term:', error);
      this.showErrorToast('Có lỗi xảy ra');
    }
  };

  handleEditClick = (term) => {
    console.log('Editing term:', term);
    this.setState({
      showModalEditTerm: true,
      isEditing: true,
      editingTermId: term._id,
      editingTerm: {
        term: term.term,
        startYear: term.startYear,
        endYear: term.endYear,
        startWeek: term.startWeek,
        startDate: term.startDate ? term.startDate.split('T')[0] : '',
        maximumLessons: term.maximumLessons,
        maximumClasses: term.maximumClasses,
        status: term.status,
      },
    });
  };

  handleUpdateTerm = async (e) => {
    e.preventDefault();
    const { editingTerm, editingTermId } = this.state;

    try {
      console.log('Updating term with ID:', editingTermId);
      console.log('Payload:', editingTerm);

      const formattedStartDate = new Date(editingTerm.startDate).toISOString();
      const termData = {
        term: editingTerm.term,
        startYear: editingTerm.startYear,
        endYear: editingTerm.endYear,
        startWeek: editingTerm.startWeek,
        startDate: formattedStartDate,
        maximumLessons: editingTerm.maximumLessons,
        maximumClasses: editingTerm.maximumClasses,
      };

      const response = await axios.put(`/api/admin/terms/edit/${editingTermId}`, termData);
      console.log('Response:', response);

      if (response.data) {
        console.log('Updated term:', response.data);
        this.showToast('Cập nhật thành công!');
        this.apiGetTerms();
        this.toggleModalEditTerm();
      } else {
        this.showErrorToast('Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error updating term:', error);
      this.showErrorToast('Có lỗi xảy ra');
    }
  };
    btnDeleteClick1 = (e, item) => {
    e.preventDefault();
    const id = item._id;
    if (id) {
      if (window.confirm('Xác nhận xóa?')) {
        this.apiDeleteTerm(id);
      }
    } else {
      alert('Không tìm thấy ID!');
    }
  };
    apiDeleteTerm = async (id) => {
    try {
      const response = await axios.delete(`/api/admin/terms/${id}`);
      if (response.data) {
        alert('Thao tác thành công!');
        this.apiGetTerms();
      } else {
        alert('Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error deleting major:', error);
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
  render() {
    const { currentPage, majorsPerPage, filteredMajors, filteredTerms, activeTab, showModalAddTerm, newMajor,showModalAddMajor,errorMajorName, showModalEditTerm, showModalEditMajor, editingMajor, newTerm, editingTerm, errorTerm, errorStartWeek, errorStartYear, errorEndYear, errorStartDate } = this.state;
    const offset = currentPage * majorsPerPage;
    const currentPageTerms = filteredTerms.slice(offset, offset + majorsPerPage).reverse();
    const currentPageMajors = filteredMajors.slice(offset, offset + majorsPerPage).reverse();

    const formatDate = (dateString) => {
      const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
      return new Date(dateString).toLocaleDateString('en-GB', options);
    };

    const termRows = currentPageTerms.map((item, index) => (
      <tr key={item._id}>
        <td>{item.term}</td>
        <td>{item.startYear}</td>
        <td>{item.endYear}</td>
        <td>{item.startWeek}</td>
        <td>{formatDate(item.startDate)}</td>
        <td>{item.maximumLessons}</td>
        <td>{item.maximumClasses}</td>
        <td>
          <div className="form-group" style={{ display: 'flex', justifyContent: 'center' }}>
            <label className="switch">
              <input
                type="checkbox"
                checked={item.status === 1}
                onChange={(e) => this.handleStatusChangeTerm(e, item._id)}
              />
              <span className="slider round"></span>
            </label>
          </div>
        </td>
        <td>
          <div className="action-buttons">
            <button className="icon-button edit far fa-edit" onClick={() => this.handleEditClick(item)}></button>
            <button className="icon-button delete far fa-trash-alt" onClick={(e) => this.btnDeleteClick1(e, item)}></button>
          </div>
        </td>
      </tr>
    ));
    const majorRows = currentPageMajors.map((item, index) => (
      <tr key={item._id}>
        <td>{offset + index + 1}</td>
        <td>{item.majorCode}</td>
        <td>{item.majorName}</td>
        <td>{item.subMajorName}</td>
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
            <button className="icon-button edit far fa-edit" onClick={() => this.handleEditClickMajor(item)}></button>
            <button className="icon-button delete far fa-trash-alt" onClick={(e) => this.btnDeleteClick(e, item)}></button>
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
                <h1>Quản lý học kỳ & ngành</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <b><Link to='/admin/home' style={{ color: '#6B63FF' }}>Trang chủ</Link></b>
                  </li>
                  <li className="breadcrumb-item active">Quản lý học kỳ & ngành</li>
                </ol>
              </div>
            </div>
          </div>
        </section>
        <section className="content">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <div className="card-tools tab-container">
                  <ul className="nav nav-pills ml-auto">
                    <li className="nav-item">
                      <a
                        className={`nav-link ${activeTab === 'area' ? 'active' : ''}`}
                        href="#semester"
                        onClick={() => this.handleTabClick('area')}
                      >
                        Học kỳ
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className={`nav-link ${activeTab === 'donut' ? 'active' : ''}`}
                        href="#major"
                        onClick={() => this.handleTabClick('donut')}
                      >
                        Ngành
                      </a>
                    </li>
                  </ul>
                </div>
              </h3>
            </div>
            <div className="card-body">
              <div className="tab-content p-0">
                <div
                  className={`chart tab-pane ${activeTab === 'area' ? 'active' : ''}`}
                  id="semester"
                  style={{ position: 'relative' }}
                >
                  <div className="card-header">
                    <h3 className="card-title" style={{ float: 'right' }}>
                      <div className="input-group input-group-sm" >
                        <div className="input-group-append" >
                          <button
                            className="btn btn-success"
                            style={{ backgroundColor: '#6B63FF', borderColor: '#6B63FF', color: '#ffffff', borderRadius: '4px' }}
                            onClick={this.toggleModalAddTerm}
                          >
                            <i className="fas fa" style={{
                              fontFamily: 'Roboto, Arial, sans-serif',
                              fontSize: '16px',
                              fontWeight: '400',
                            }}>+ Thêm mới</i>
                          </button>
                        </div>
                      </div>
                    </h3>
                    <div className="card-tools" style={{ float: 'left' }}>
                      <div className="input-group input-group-sm">
                        <input type="text" className="form-control float-right" placeholder="Tìm kiếm" name="searchKeyword" value={this.state.searchKeyword} onChange={this.handleInputChange} />
                        <div className="input-group-append">
                          <button type="submit" className="btn btn-default" onClick={this.handleSearch1}>
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
                          <th>Học kỳ</th>
                          <th>Năm bắt đầu</th>
                          <th>Năm kết thúc</th>
                          <th>Tuần bắt đầu</th>
                          <th>Ngày bắt đầu</th>
                          <th>Tiết tối đa</th>
                          <th>Lớp tối đa</th>
                          <th>Trạng thái</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {termRows}
                      </tbody>
                    </table>
                    <div className="pagination-container"
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
                        pageCount={Math.ceil(filteredTerms.length / majorsPerPage)}
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
                
                
                {showModalAddTerm && (
                  <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title">Thêm mới học kỳ</h5>
                          <button type="button" className="close" onClick={this.toggleModalAddTerm}>
                            <span>&times;</span>
                          </button>
                        </div>
                        <div className="modal-body">
                          <form onSubmit={this.handleAddNewTerm}>
                            <div className="row">
                              <div className="col-sm-6">
                                <div className="form-group">
                                  <label>Học kỳ</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="term"
                                    value={newTerm.term}
                                    onChange={this.handleNewTermChange}
                                    placeholder="Nhập học kỳ..."
                                  />
                                  {errorTerm && <span className="text-danger">{errorTerm}</span>}
                                </div>
                              </div>
                              <div className="col-sm-6">
                                <div className="form-group">
                                  <label>Tuần bắt đầu</label>
                                  <input
                                    type="number"
                                    className="form-control"
                                    name="startWeek"
                                    value={newTerm.startWeek}
                                    onChange={this.handleNewTermChange}
                                    placeholder="Nhập tuần bắt đầu..."
                                  />
                                  {errorStartWeek && <span className="text-danger">{errorStartWeek}</span>}
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
                                    value={newTerm.startYear}
                                    onChange={this.handleNewTermChange}
                                    placeholder="Nhập năm bắt đầu..."
                                  />
                                  {errorStartYear && <span className="text-danger">{errorStartYear}</span>}
                                </div>
                              </div>
                              <div className="col-sm-6">
                                <div className="form-group">
                                <label>Năm kết thúc</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="endYear"
                                    value={newTerm.endYear}
                                    onChange={this.handleNewTermChange}
                                    placeholder="Nhập năm kết thúc..."
                                  />
                                  {errorEndYear && <span className="text-danger">{errorEndYear}</span>}
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
                                      value={newTerm.startDate}
                                      onChange={this.handleNewTermChange}
                                    />
                                  </div>
                                  {errorStartDate && <span className="text-danger">{errorStartDate}</span>}
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
                                    value={newTerm.maximumLessons}
                                    onChange={this.handleNewTermChange}
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
                                    value={newTerm.maximumClasses}
                                    onChange={this.handleNewTermChange}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                              <button type="button" className="btn btn-danger" onClick={this.toggleModalAddTerm}>Hủy</button>
                              <button type="submit" className="btn btn-info" style={{ backgroundColor: '#6B63FF', borderColor: '#6B63FF' }}>Xác nhận</button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
               {showModalEditTerm && (
                <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">Chỉnh sửa học kỳ</h5>
                        <button type="button" className="close" onClick={this.toggleModalEditTerm}>
                          <span>&times;</span>
                        </button>
                      </div>
                      <div className="modal-body">
                        <form onSubmit={this.handleUpdateTerm}>
                          <div className="row">
                            <div className="col-sm-6">
                              <div className="form-group">
                                <label>Học kỳ</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="term"
                                  value={editingTerm.term}
                                  readOnly
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
                                  value={editingTerm.startWeek}
                                  onChange={this.handleEditingTermChange}
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
                                  value={editingTerm.startYear}
                                  onChange={this.handleEditingTermChange}
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
                                  value={editingTerm.endYear}
                                  onChange={this.handleEditingTermChange}
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
                                    value={editingTerm.startDate}
                                    onChange={this.handleEditingTermChange}
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
                                  value={editingTerm.maximumLessons}
                                  onChange={this.handleEditingTermChange}
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
                                  value={editingTerm.maximumClasses}
                                  onChange={this.handleEditingTermChange}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                            <button type="button" className="btn btn-danger" onClick={this.toggleModalEditTerm}>Hủy</button>
                            <button type="submit" className="btn btn-info" style={{ backgroundColor: '#6B63FF', borderColor: '#6B63FF' }}>Xác nhận</button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              )}

                <div
                  className={`chart tab-pane ${activeTab === 'donut' ? 'active' : ''}`}
                  id="major"
                  style={{ position: 'relative' }}
                >
                  <div className="card-header">
                    <h3 className="card-title" style={{ float: 'right' }}>
                      <div className="input-group input-group-sm" >
                        <div className="input-group-append" >
                          <button
                            className="btn btn-success"
                            style={{ backgroundColor: '#6B63FF', borderColor: '#6B63FF', color: '#ffffff', borderRadius: '4px' }}
                            onClick={this.toggleModalAddMajor}
                          >
                            <i className="fas fa" style={{
                              fontFamily: 'Roboto, Arial, sans-serif',
                              fontSize: '16px',
                              fontWeight: '400',
                            }}>+ Thêm mới ngành</i>
                          </button>
                        </div>
                      </div>
                    </h3>
                    <div className="card-tools" style={{ float: 'left' }}>
                      <div className="input-group input-group-sm" style={{ width: '200px' }}>
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
                          <th>Mã ngành</th>
                          <th>Tên ngành</th>
                          <th>Tên viết tắt</th>
                          <th>Trạng thái</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {majorRows}
                      </tbody>
                    </table>
                    <div className="pagination-container"
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
                        pageCount={Math.ceil(filteredMajors.length / majorsPerPage)}
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
                <ToastContainer />
                {showModalAddMajor && (
                  <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title">Thêm mới ngành</h5>
                          <button type="button" className="close" onClick={this.toggleModalAddMajor}>
                            <span>&times;</span>
                          </button>
                        </div>
                        <div className="modal-body">
                          <form onSubmit={this.handleAddNewMajor}>
                          <div className="form-group">
                              <label>Mã ngành</label>
                              <input
                                type="text"
                                className="form-control"
                                name="majorCode"
                                value={newMajor.majorCode}
                                onChange={this.handleNewMajorChange}
                                placeholder="Nhập mã ngành..."
                              />
                              {errorMajorName && <span className="text-danger">{errorMajorName}</span>}
                            </div>
                            <div className="form-group">
                              <label>Tên ngành</label>
                              <input
                                type="text"
                                className="form-control"
                                name="majorName"
                                value={newMajor.majorName}
                                onChange={this.handleNewMajorChange}
                                placeholder="Nhập tên ngành..."
                              />
                              {errorMajorName && <span className="text-danger">{errorMajorName}</span>}
                            </div>
                            <div className="form-group">
                              <label>Tên ngành phụ</label>
                              <input
                                type="text"
                                className="form-control"
                                name="subMajorName"
                                value={newMajor.subMajorName}
                                onChange={this.handleNewMajorChange}
                                placeholder="Nhập tên ngành phụ..."
                              />
                            </div>
                            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                              <button type="button" className="btn btn-danger" onClick={this.toggleModalAddMajor}>Hủy</button>
                              <button type="submit" className="btn btn-info" style={{ backgroundColor: '#6B63FF', borderColor: '#6B63FF' }}>Xác nhận</button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {showModalEditMajor && (
                  <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title">Chỉnh sửa ngành</h5>
                          <button type="button" className="close" onClick={this.toggleModalEditMajor}>
                            <span>&times;</span>
                          </button>
                        </div>
                        <div className="modal-body">
                          <form onSubmit={this.handleUpdateMajor}>
                            <div className="form-group">
                              <label>Tên ngành</label>
                              <input
                                type="text"
                                className="form-control"
                                name="majorName"
                                value={editingMajor.majorName}
                                onChange={this.handleEditingMajorChange}
                                placeholder="Nhập tên ngành..."
                              />
                            </div>
                            <div className="form-group">
                              <label>Tên ngành phụ</label>
                              <input
                                type="text"
                                className="form-control"
                                name="subMajorName"
                                value={editingMajor.subMajorName}
                                onChange={this.handleEditingMajorChange}
                                placeholder="Nhập tên ngành phụ..."
                              />
                            </div>
                            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                              <button type="button" className="btn btn-danger" onClick={this.toggleModalEditMajor}>Hủy</button>
                              <button type="submit" className="btn btn-info" style={{ backgroundColor: '#6B63FF', borderColor: '#6B63FF' }}>Xác nhận</button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                )}


              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default semester_major;