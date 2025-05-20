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
import IonIcon from '@reacticons/ionicons';


class Subject extends Component {
  static contextType = MyContext;
  state = {
    subjects: [],
    majors: [],
    newSubject: '',
    currentPage: 0,
    subjectsPerPage: 10,
    searchKeyword: '',
    filteredSubjects: [],
    selectedMajor: '',
    selectedSemester: '',
    // error: '',
    activeTab: 'area',
    errorCode: '',
    errorName: '',
    errorTinChi:'',
    errorMajor:'',
    showModal: false,
    showModal1: false,
    showModalImport: false, // Add this line
    addingSubject: {
      subjectCode: '',
      subjectName: '',
      credit: '',
      major: '',
      description: ''
    },
    editingSubject: {
      subjectCode: '',
      subjectName: '',
      credit: '',
      major: '',
      description: ''
    },
        subjects: [],
    subjectterm: [],
    majors: [],
    semesters: [],
    newSubject: '',
    currentPagesubjectterm: 0,
    subjectsPerPagesubjectterm: 10,
    searchKeyword: '',
    searchKeyword1: '',
    filteredSubjectssubjectterm: [],
    selectedSemester: '',
    showModalSubjectTerm3: false,
    addingSubject: {
      subjectName: '',
      term: '',
      subjectCode: ''
    },
    showModalSubjectTerm4: false,
    editingSubject: {
      _id: '',
      subjectName: '',
      term: '',
      subjectCode: ''
    },
    errorCode: '',
    errorName: '',
    errorTinChi: '',
    errorMajor: '',
    errorTerm: '',
    subjectterms: [],
    modalMessage: '',
    file: null,
    showModal: false,
    isLoading: false, // Thêm trạng thái isLoading
    runtime: null,
    totalRowsChanged: null,
    addedEmails: [],
    duplicateTeachers: [], // Thêm trạng thái duplicateTeachers
    addedSubjectCodes: [],
    addedSubjectTermCodes: [],
    addedClassCodes: [],
    selectedMajor1: '',
    duplicateClasses:[],
    showModalKQIm: false, // Thêm trạng thái showModal
    showAddedClassCodes: false, // Thêm trạng thái showAddedEmails
    showduplicateClasses: false, // Thêm trạng thái showDuplicateTeachers
    addedClassCodesCount: 0, // Thêm trạng thái addedEmailsCount
    duplicateClassesCount: 0, // Thêm trạng thái duplicateTeachersCount
  };

  componentDidMount() {
    this.apiGetSubjects();
    this.apiGetMajors();
    this.apiGetSubjectTerms();
    this.apiGetSemesters();
    this.apiGetSubjectss();
    this.filterSubjectsBySemester(); // Add this line
    
  }


  apiGetSubjects = async () => {
    try {
      const response = await axios.get('/api/admin/subjects');
      this.setState({ subjects: response.data.reverse(), filteredSubjects: response.data });
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  apiGetMajors = async () => {
    try {
      const response = await axios.get('/api/admin/majors');
      this.setState({ majors: response.data });
    } catch (error) {
      console.error('Error fetching majors:', error);
    }
  };
  handleTabClick = (tab) => {
    this.setState({ activeTab: tab });
  };
  

  apiDeleteSubject = async (id) => {
    try {
      const response = await axios.delete(`/api/admin/subjects/${id}`);
      if (response.data) {
        this.showToast('Thao tác thành công!');
        this.apiGetSubjects();
      } else {
        this.showErrorToast('Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error deleting subjects:', error);
    }
  };

  btnDeleteClick = (e, item) => {
    e.preventDefault();
    const id = item._id;
    if (id) {
      if (window.confirm('Xác nhận xóa?')) {
        this.showToast('Xóa thành công!')
        this.apiDeleteSubject(id);
      }
    } else {
      alert('Không tìm thấy ID!');
    }
  };
  handleInputChange1 = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState(prevState => {
      const updatedSubject = {
        ...prevState[prevState.showModal ? 'addingSubject' : 'editingSubject'],
        [name]: value
      };
      return {
        [prevState.showModal ? 'addingSubject' : 'editingSubject']: updatedSubject,
        errorCode: name === 'subjectCode' ? '' : prevState.errorCode,
        errorName: name === 'subjectName' ? '' : prevState.errorName,
        errorTinChi: name === 'credit' ? '' : prevState.errorTinChi,
        errorMajor: name === 'major' ? '' : prevState.errorMajor,
      };
    });
  };
  handleSearch = (e) => {
    const searchKeyword = e.target.value.toLowerCase();
    this.setState({ searchKeyword }, this.filterSubjects);
  };
  
  filterSubjects = () => {
    const { searchKeyword, subjects } = this.state;
    const filteredSubjects = subjects.filter(subject =>
      subject.subjectCode.toLowerCase().includes(searchKeyword) ||
      subject.subjectName.toLowerCase().includes(searchKeyword) ||
      this.getMajorName(subject.major).toLowerCase().includes(searchKeyword)
    );
    this.setState({ filteredSubjects });
  };

  handlePageClick = (data) => {
    this.setState({ currentPage: data.selected });
  };

  getMajorName = (majorCode) => {
    const major = this.state.majors.find(m => m._id === majorCode);
    return major ? major.majorName : majorCode;
  };

  handleMajorChange = (e) => {
    const selectedMajor = e.target.value;
    this.filterSubjects(selectedMajor, this.state.selectedSemester);
  };

  handleSemesterChange = (e) => {
    const selectedSemester = e.target.value;
    this.setState({ selectedSemester }, this.filterSubjectsBySemester);
  };
  
  filterSubjectsBySemester = () => {
    const { selectedSemester, selectedMajor1, subjectterms } = this.state;
    let filteredSubjectssubjectterm = subjectterms;
  
    if (selectedSemester) {
      filteredSubjectssubjectterm = filteredSubjectssubjectterm.filter(subject => subject.termID === selectedSemester);
    }
  
    if (selectedMajor1) {
      filteredSubjectssubjectterm = filteredSubjectssubjectterm.filter(subject => subject.subjectID.major === selectedMajor1);
    }
  
    this.setState({ filteredSubjectssubjectterm });
  };
  handleMajorChange1 = (e) => {
    const selectedMajor1 = e.target.value;
    this.setState({ selectedMajor1 }, this.filterSubjectsBySemester);
  };


  filterSubjects = (selectedMajor, selectedSemester) => {
    let filteredSubjects = this.state.subjects;

    if (selectedMajor) {
      filteredSubjects = filteredSubjects.filter(subject => subject.major === selectedMajor);
    }


    this.setState({ selectedMajor, filteredSubjects });
  };

  startAdding = () => {
    this.setState({
      addingSubject: {
        subjectCode: '',
        subjectName: '',
        credit: '',
        major: '',
        description: ''
      },
      showModal: true
    });
  };

  startEditing = (subject) => {
    this.setState({
      editingSubject: subject,
      showModal1: true
    });
  };

  cancelAdding = () => {
     this.setState({
       addingSubject: { 
         subjectCode: '', 
         subjectName: '', 
         credit: '', 
         major: '', 
         description:'' 
       }, 
       showModal:false 
     }); 
   }; 

   cancelEditing=()=>{ 
     this.setState({ 
       editingSubject:{ 
         subjectCode:'', 
         subjectName:'', 
         credit:'', 
         major:'', 
         description:'' 
       }, 
       showModal1:false 
     }); 
   }; 

   saveAdding = async (e) => {
    e.preventDefault();
    const { addingSubject } = this.state;
  
    if (addingSubject.subjectName.trim() === '') {
      this.setState({ errorName: 'Tên môn học không được để trống' });
      return;
    }
    if (addingSubject.credit === '') {
      this.setState({ errorTinChi: 'Số tín chỉ không được để trống' });
      return;
    }
    if (addingSubject.major.trim() === '') {
      this.setState({ errorMajor: 'Ngành không được để trống' });
      return;
    }
    
  
    try {
      // Kiểm tra xem mã môn học đã tồn tại hay chưa
      const checkResponse = await axios.get(`/api/admin/subject?subjectCode=${addingSubject.subjectCode}`);
      if (checkResponse.data.length > 0) {
        this.setState({ errorCode: 'Mã môn học đã tồn tại' });
        return;
      }
  
      // Thêm mới môn học
      const response = await axios.post('/api/admin/subjects', addingSubject);
      
      if (response.data) {
        this.setState(prevState => ({
          subjects: [...prevState.subjects, response.data],
          filteredSubjects: [...prevState.filteredSubjects, response.data],
          addingSubject: {
            subjectCode: '',
            subjectName: '',
            credit: '',
            major: '',
            description: ''
          },
          showModal: false,
          errorCode: '', // Xóa lỗi nếu thêm mới thành công
          errorName: '', // Xóa lỗi nếu thêm mới thành công
          errorTinChi: '', // Xóa lỗi nếu thêm mới thành công
          errorMajor: '', // Xóa lỗi nếu thêm mới thành công
        }));
        this.showToast('Thêm mới thành công!');
        this.apiGetSubjects();
      } else {
        this.showErrorToast('Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error adding subject:', error);
      this.showErrorToast('Có lỗi xảy ra');
    }
  };
  handleTabClick = (tab) => {
    this.setState({ activeTab: tab });
  };
   saveEditing=async(e)=>{e.preventDefault();const{editingSubject}=this.state;try{const response=await axios.put(`/api/admin/subjects/edit/${editingSubject._id}`,editingSubject);if(response.data){this.setState(prevState=>({subjects:
     prevState.subjects.map(subject=>subject._id===editingSubject._id?response.data:
     subject),filteredSubjects:
     prevState.filteredSubjects.map(subject=>subject._id===editingSubject._id?response.data:
     subject),editingSubject:{subjectCode:'',subjectName:'',credit:'',major:'',description:''},showModal1:false}));this.showToast('Sửa thành công!');this.apiGetSubjects();}else{this.showErrorToast('Có lỗi xảy ra');}}catch(error){console.error('Error editing subject:',error);this.showErrorToast('Có lỗi xảy ra');}}; 

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
    
  //   apiGetSubjectTerms = async () => {
  //   try {
  //     const response = await axios.get('/api/admin/subjectterms');
  //     this.setState({ subjectterm: response.data, filteredSubjectssubjectterm: response.data });
  //   } catch (error) {
  //     console.error('Error fetching subjects:', error);
  //   }
  // };


  apiGetSubjectTerms = async () => {
    try {
      const response = await axios.get('/api/admin/subjectterms');
      const subjectterms = response.data;
  
      // Fetch terms to get the term information
      const termsResponse = await axios.get('/api/admin/terms');
      const terms = termsResponse.data;
  
      // Map subject terms to include term information
      const termsMap = terms.reduce((map, term) => {
        map[term._id] = term;
        return map;
      }, {});
  
      const subjecttermsWithTerms = subjectterms.map(subjectterm => ({
        ...subjectterm,
        term: termsMap[subjectterm.termID]
      }));
  
      // Sort terms by termID in descending order to get the latest term
      const sortedTerms = terms.sort((a, b) => b.term - a.term);
      const latestTermID = sortedTerms[0]?._id;
  
      // Filter subject terms to include only those with the latest term ID
      const filteredSubjectssubjectterm = subjecttermsWithTerms.filter(subject => subject.termID === latestTermID);
  
      this.setState({ subjectterms: subjecttermsWithTerms, filteredSubjectssubjectterm });
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  

  apiGetMajors = async () => {
    try {
      const response = await axios.get('/api/admin/majors');
      this.setState({ majors: response.data });
    } catch (error) {
      console.error('Error fetching majors:', error);
    }
  };

  apiGetSubjectss = async () => {
    try {
      const response = await axios.get('/api/admin/subjects');
      this.setState({ subjects: response.data });
    } catch (error) {
      console.error('Error fetching majors:', error);
    }
  };

  apiGetSemesters = async () => {
    try {
      const response = await axios.get('/api/admin/terms');
      const semesters = response.data;
  
      // Sort semesters by term in descending order to get the latest semester
      const sortedSemesters = semesters.sort((a, b) => b.term - a.term);
      const latestSemester = sortedSemesters[0]?._id;
  
      this.setState({ semesters: sortedSemesters, selectedSemester: latestSemester }, this.filterSubjectsBySemester);
    } catch (error) {
      console.error('Error fetching semesters:', error);
    }
  };

  apiGetSubjectTermById = async (id) => {
    try {
      const response = await axios.get(`/api/admin/subjectterms/${id}`);
      const subjectData = response.data;
  
      // Ensure the response data has the expected structure
      const editingSubject = {
        _id: subjectData._id || '',
        subjectName: subjectData.subjectID || '',
        term: subjectData.termID || '',
        subjectCode: subjectData.subjectTermCode || ''
      };
  
      this.setState({ editingSubject });
    } catch (error) {
      console.error('Error fetching subject by ID:', error);
    }
  };

  apiUpdateSubjectTerm = async (id, updatedSubject) => {
    try {
      const response = await axios.put(`/api/admin/subjectterms/edit/${id}`, updatedSubject);
      console.log('Updated subject:', response.data);
      this.apiGetSubjectTerms(); // Refresh the list
    } catch (error) {
      console.error('Error updating subject:', error);
    }
  };

  handleSearchSubjectTerm = () => {
    const { searchKeyword, subjectterms } = this.state;
    const lowercasedKeyword = searchKeyword.toLowerCase();
    const filteredSubjectssubjectterm = subjectterms.filter(subject => {
      const subjectName = subject.subjectID.subjectName.toLowerCase();
      const subjectTermCode = subject.subjectTermCode.toLowerCase();
      return subjectTermCode.includes(lowercasedKeyword) || subjectName.includes(lowercasedKeyword);
    });
    this.setState({ filteredSubjectssubjectterm });
  };

  handleSearchSubject = () => {
    const { searchKeyword1, subjects } = this.state;
    const filteredSubjects = subjects.filter(subject =>
    subject.subjectCode.toLowerCase().includes(searchKeyword1) ||
    subject.subjectName.toLowerCase().includes(searchKeyword1) ||
    this.getMajorName(subject.major).toLowerCase().includes(searchKeyword1)
  );
  this.setState({ filteredSubjects });
};


  handlePageClickSubjectTerm = (data) => {
    this.setState({ currentPagesubjectterm: data.selected });
  };

  getMajorName = (majorCode) => {
    const major = this.state.majors.find(m => m._id === majorCode);
    return major ? major.majorName : majorCode;
  };

  getTermName = (termID) => {
    const term = this.state.semesters.find(t => t._id === termID);
    return term ? term.term : termID;
  };

  getSubjectName = (subjectID) => {
    const subject = this.state.subjects.find(s => s._id === subjectID);
    return subject ? subject.subjectName : subjectID;
  };

  handleInputChangeSubjectTerm = (e) => {
    const { name, value } = e.target;
    this.setState(prevState => ({
      addingSubject: {
        ...prevState.addingSubject,
        [name]: value
      },
      editingSubject: {
        ...prevState.editingSubject,
        [name]: value
      }
    }));
  };

  showModalSubjectTerm = () => {
    this.setState({ showModalSubjectTerm3: true });
  };

  cancelAddingSubjectTerm = () => {
    this.setState({ showModalSubjectTerm3: false, addingSubject: { subjectName: '', term: '', subjectCode: '' } });
  };

  saveAddingSubjectTerm = async (e) => {
    e.preventDefault();
    const { addingSubject, subjects, semesters, subjectterm } = this.state;
  
    if (!addingSubject.subjectName) {
      this.setState({ errorName: 'Vui lòng chọn tên môn học' });
      return;
    }
  
    if (!addingSubject.term) {
      this.setState({ errorTerm: 'Vui lòng chọn học kỳ' });
      return;
    }
  
    const selectedSubject = subjects.find(subject => subject._id === addingSubject.subjectName);
    const selectedTerm = semesters.find(term => term._id === addingSubject.term);
  
    if (selectedSubject && selectedTerm) {
      const subjectID = selectedSubject._id;
      const termID = selectedTerm._id;
  
      // Check for duplicates
      const isDuplicate = subjectterm.some(
        subject => subject.subjectID === subjectID && subject.termID === termID
      );
  
      if (isDuplicate) {
        this.setState({ errorName: 'Môn học này đã tồn tại trong học kỳ này' });
        return;
      }
  
      try {
        const response = await axios.post('/api/admin/subjectterm', {
          subjectID,
          termID,
          subjectTermCode: `${selectedTerm.term}_${selectedSubject.subjectCode}`
        });
        console.log('Response:', response.data);
        this.showToast("Thêm mới thành công!")
        this.apiGetSubjectTerms(); // Refresh the list
      } catch (error) {
        console.error('Error saving subject term:', error);
      }
    }
  
    this.setState({ showModalSubjectTerm3: false, errorName: '', errorTerm: '' });
  };

  startEditingSubjectTerm = async (item) => {
    await this.apiGetSubjectTermById(item._id);
    this.setState({ showModalSubjectTerm4: true });
  };

  cancelEditingSubjectTerm = () => {
    this.setState({ showModalSubjectTerm4: false, editingSubject: { _id: '', subjectName: '', term: '', subjectCode: '' } });
  };

  saveEditingSubjectTerm = async (e) => {
    e.preventDefault();
    const { editingSubject, subjects, semesters, subjectterm } = this.state;
  
    if (!editingSubject.subjectName) {
      this.setState({ errorName: 'Vui lòng chọn tên môn học' });
      return;
    }
  
    if (!editingSubject.term) {
      this.setState({ errorTerm: 'Vui lòng chọn học kỳ' });
      return;
    }
  
    const selectedSubject = subjects.find(subject => subject._id === editingSubject.subjectName);
    const selectedTerm = semesters.find(term => term._id === editingSubject.term);
  
    if (selectedSubject && selectedTerm) {
      const subjectID = selectedSubject._id;
      const termID = selectedTerm._id;
  
      // Check for duplicates
      const isDuplicate = subjectterm.some(
        subject => subject.subjectID === subjectID && subject.termID === termID && subject._id !== editingSubject._id
      );
  
      if (isDuplicate) {
        this.setState({ errorName: 'Môn học này đã tồn tại trong học kỳ này' });
        return;
      }
  
      const updatedSubject = {
        subjectID,
        termID,
        subjectTermCode: `${selectedTerm.term}_${selectedSubject.subjectCode}`
      };
  
      try {
        await this.apiUpdateSubjectTerm(editingSubject._id, updatedSubject);
        this.setState({ showModalSubjectTerm4: false, errorName: '', errorTerm: '' });
        this.apiGetSubjectTerms(); // Refresh the list
        this.showToast('Chỉnh sửa thành công!');
      } catch (error) {
        console.error('Error saving edited subject:', error);
      }
    }
  };
    apiDeleteSubjectTerm = async (id) => {
    try {
      const response = await axios.delete(`/api/admin/subjectterms/${id}`);
      if (response.data) {
        this.showToast('Xóa thành công!');
        this.apiGetSubjectTerms();
      } else {
        alert('Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error deleting subject term:', error);
    }
  };

  btnDeleteClickSubjectTerm = (e, item) => {
    e.preventDefault();
    const id = item._id;
    if (id) {
      if (window.confirm('Xác nhận xóa?')) {
        this.apiDeleteSubjectTerm(id);
      }
    } else {
      alert('Không tìm thấy ID!');
    }
  };
    showModalImport = () => { // Add this function
    this.setState({ showModalImport: true });
  };
    cancelImport = () => { // Add this function
    this.setState({ showModalImport: false });
  };
  handleFileChange = (event) => {
    this.setState({ file: event.target.files[0] });
  };
  fileInputRef = React.createRef();
  handleFileUpload = () => {
    this.setState({ isLoading: true }); // Bắt đầu hiệu ứng loading
    const formData = new FormData();
    formData.append('file', this.state.file);
  
    axios.post('/api/admin/upload', formData)
      .then(response => {
        console.log(response.data);
        this.setState({ 
          file: null, // Xóa tên file sau khi upload thành công
          isLoading: false, // Kết thúc hiệu ứng loading
          runtime: response.data.runtime,
          
          addedClassCodes: response.data.addedClassCodes,
          duplicateClasses:response.data.duplicateClasses,
          showModalKQIm: true, // Hiển thị modal sau khi upload thành công
          addedClassCodesCount: (response.data.addedClassCodes).length, 
          duplicateClassesCount: (response.data.duplicateClasses).length,
        });
        this.fileInputRef.current.value = ''; // Đặt lại giá trị của input file
        this.showToast('Upload file thành công');
      })
      .catch(error => {
        console.error('Đã xảy ra lỗi khi tải tệp lên!', error);
        this.setState({ 
          isLoading: false // Kết thúc hiệu ứng loading
        });
        this.showErrorToast('Upload file thất bại');
      });
  };
  closeModalKQIM = () => {
    this.setState({ showModalKQIm: false });
  };
  toggleAddedClassCodes = () => {
    this.setState(prevState => ({ showAddedClassCodes: !prevState.showAddedClassCodes }));
  };

  toggleduplicateClasses = () => {
    this.setState(prevState => ({ showduplicateClasses: !prevState.showduplicateClasses }));
  };
  formatRuntime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  
    return `${hours}:${minutes}:${seconds}`;
  };
  render() {
    const { currentPagesubjectterm,
      subjectsPerPagesubjectterm,
      currentPage, 
      subjectsPerPage, 
      activeTab,
      searchKeyword, 
      searchKeyword1, 
      filteredSubjects, 
      filteredSubjectssubjectterm,
      majors, 
      subjects,
      semesters, 
      selectedMajor, 
      selectedSemester, 
      showModal, 
      showModal1, 
      showModalSubjectTerm3,
      showModalSubjectTerm4,
      showModalImport,
      selectedMajor1,
      addingSubject,
      editingSubject,
      errorCode,
      errorName,
      errorTinChi,
      errorTerm,
      errorMajor } = this.state;
    const offset = currentPage * subjectsPerPage;
    const currentPageSubjects = filteredSubjects.slice(offset, offset + subjectsPerPage);
    const offset2 = currentPagesubjectterm * subjectsPerPagesubjectterm;
    const currentPagesubjecttermSubjects = filteredSubjectssubjectterm.slice(offset2, offset2 + subjectsPerPagesubjectterm);
    const { userRole } = this.props; // Get userRole from props


    const subjectRows = currentPageSubjects.map((item, index) => (
      <tr key={item._id}>
        <td>{offset + index + 1}</td>
        <td>{item.subjectCode}</td>
        <td>{item.subjectName}</td>
        <td>{item.credit}</td>
        <td>{this.getMajorName(item.major)}</td>
        <td><Link to={`/admin/subject/profile/${item._id}`} style={{ color: 'black' }}>{item.name}</Link></td>
        <td>
          <div className="action-buttons">
            
            {userRole !== 'Giảng viên' && userRole !== 'Sinh viên'  && (
              <>
                <Link onClick={() => this.startEditing(item)} className="icon-button edit far fa-edit"></Link>
                <button className="icon-button delete far fa-trash-alt" onClick={(e) => this.btnDeleteClick(e, item)}></button>
            </>
            )}
          </div>
        </td>
      </tr>
    ));
        const subjecttermRows = currentPagesubjecttermSubjects.map((item, index) => (
      <tr key={item._id}>
        <td>{offset + index + 1}</td>
        <td>{item.subjectTermCode}</td>
        <td>{item.subjectID.subjectName}</td> {/* Accessing subjectName property */}
        <td>
          <div className="action-buttons">
            
            {userRole !== 'Giảng viên'  && userRole !== 'Sinh viên' && (
              <>
                <Link  onClick={() => this.startEditingSubjectTerm(item)} title='Sửa' className="icon-button edit far fa-edit"></Link>
                <button className="icon-button delete far fa-trash-alt" onClick={(e) => this.btnDeleteClickSubjectTerm(e, item)} title='Xóa'></button>
              </>
            )}
            <Link 
            className="icon-button" 
            to={`/admin/classsections/${item._id}`} 
            title="Danh sách lớp học phần"
          >
            <IonIcon name="list-circle-outline" style={{ fontSize: '26px', marginTop: '-16px' }} />
          </Link>

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
                <h1>Danh sách môn học & lớp HP</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <b><Link to='/admin/home' style={{color:'#6B63FF'}}>Trang chủ</Link></b></li>
                  <li className="breadcrumb-item active">Danh sách môn học & lớp HP</li>
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
                  <ul className="nav nav-pills ml-auto" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    <li className="nav-item">
                      <a
                        href="#semester"
                        onClick={() => this.handleTabClick('area')}
                        style={{
                          border: 'none',
                          padding: '10px 15px',
                          cursor: 'pointer',
                          textDecoration: 'none',
                          color: activeTab === 'area' ? '#6B63FF' : '#000',
                          borderBottom: activeTab === 'area' ? '2px solid #6B63FF' : 'none'
                        }}
                      >
                        Lớp HP
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        href="#subjects"
                        onClick={() => this.handleTabClick('donut')}
                        style={{
                          border: 'none',
                          padding: '10px 15px',
                          cursor: 'pointer',
                          textDecoration: 'none',
                          color: activeTab === 'donut' ? '#6B63FF' : '#000',
                          borderBottom: activeTab === 'donut' ? '2px solid #6B63FF' : 'none'
                        }}
                      >
                        Môn học
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
                   {/* <div className="card-header" style={{ display: 'flex', alignItems: 'center', paddingBottom: '23px', paddingTop: '3px' }}>
                    <div className="card-tools" style={{ marginRight: 'auto' }}>
                      <div className="input-group input-group-sm">
                        <input type="text" className="form-control" placeholder="Tìm kiếm" value={searchKeyword} onChange={(e) => this.setState({ searchKeyword: e.target.value }, this.handleSearchSubjectTerm)} />
                        <div className="input-group-append">
                          <button type="submit" className="btn btn-default">
                            <i className="fas fa-search"></i>
                          </button>
                        </div>
                      </div>
                    </div>

                    <h3 className="card-title" style={{ display: 'flex', gap: '10px', marginLeft: 'auto' }}>
                      <div className="input-group input-group-sm">
                        <div className="input-group-append">
                          <button
                            className="btn btn-success"
                            style={{ backgroundColor: '#009900', borderColor: '#009900', color: '#ffffff', borderRadius: '4px' }}
                            onClick={this.showModalImport}
                          >
                            <i className="fas fa" style={{ fontFamily: 'Roboto, Arial, sans-serif', fontSize: '16px', fontWeight: '400' }}>
                              + Import file
                            </i>
                          </button>
                        </div>
                      </div>

                      <div className="input-group input-group-sm">
                        <div className="input-group-append">
                        <button
                          className="btn btn-success"
                          style={{
                            backgroundColor: "#6B63FF",
                            borderColor: "#6B63FF",
                            color: "#ffffff",
                            borderRadius: "4px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            whiteSpace: "nowrap",
                            minWidth: "max-content",
                            padding: "5px 12px",
                          }}
                          onClick={this.showModalSubjectTerm}
                        >
                          <i
                            className="fas fa"
                            style={{
                              fontFamily: "Roboto, Arial, sans-serif",
                              fontSize: "16px",
                              fontWeight: "400",
                            }}
                          >
                            + Thêm mới
                          </i>
                        </button>

                        </div>
                      </div>
                    </h3>
                  </div>

                  <div className="card-header" style={{ display: 'flex', alignItems: 'center', paddingBottom: '23px', paddingTop: '3px' }}>
                      <div className="form-group">
                <select className="form-control select2 select2-danger" data-dropdown-css-class="select2-danger" style={{ width: '100%' }} onChange={this.handleSemesterChange} value={selectedSemester}>
                  <option value="">Tất cả</option>
                  {semesters.map(semester => (
                    <option key={semester._id} value={semester._id}>{semester.term}</option>
                  ))}
                </select>
              </div>                        
                  </div> */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', paddingBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div className="input-group input-group-sm" style={{ maxWidth: '250px', height: '32px' }}>
                      <input type="text" className="form-control" placeholder="Tìm kiếm" value={searchKeyword} onChange={(e) => this.setState({ searchKeyword: e.target.value }, this.handleSearchSubjectTerm)} style={{ height: '100%' }} />
                      <div className="input-group-append">
                        <button type="submit" className="btn btn-default" style={{ height: '100%' }}>
                          <i className="fas fa-search"></i>
                        </button>
                      </div>
                    </div>
                    <div className="form-group" style={{ width: '150px', height: '32px' }}>
                      <select className="form-control select2 select2-danger" onChange={this.handleSemesterChange} value={selectedSemester} style={{ width: '100%', height: '100%', marginTop:'9px' }}>
                        <option value="">Tất cả</option>
                        {semesters.map(semester => (<option key={semester._id} value={semester._id}>{semester.term}</option>))}
                      </select>
                    </div>
                    <div className="form-group" style={{ width: '150px', height: '32px' }}>
                      <select className="form-control select2 select2-danger" onChange={this.handleMajorChange1} value={selectedMajor1} style={{ width: '100%', height: '100%', marginTop:'9px' }}>
                        <option value="">Tất cả</option>
                        {majors.map(major => (<option key={major._id} value={major._id}>{major.majorName}</option>))}
                      </select>
                    </div>

                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: 'auto' }}>
                  {userRole !== 'Giảng viên' && userRole !== 'Sinh viên'  && (
                <>
                    <button className="btn btn-success" onClick={this.showModalImport} style={{ backgroundColor: '#009900', borderColor: '#009900', color: '#fff', borderRadius: '4px' }}>+ Import file</button>
                    <button className="btn btn-success" onClick={this.showModalSubjectTerm} style={{ backgroundColor: '#6B63FF', borderColor: '#6B63FF', color: '#fff', borderRadius: '4px' }}>+ Thêm mới</button>

                </>
              )}
                  </div>
                </div>
                <div style={{ borderBottom: '1px solid rgba(0, 0, 0, .125)', marginTop: '10px' }}></div>



                  <div className="card-body table-responsive p-0" >
                    <table className="table table-hover text-nowrap">
                      <thead>
                      <tr>
                     <th>STT</th>
                     <th>Mã môn theo học kỳ</th>
                     <th>Tên môn</th>
                     <th></th>
                   </tr>
                      </thead>
                      <tbody>
                      {subjecttermRows}
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
                      pageCount={Math.ceil(filteredSubjectssubjectterm.length / subjectsPerPagesubjectterm)}
                      marginPagesDisplayed={2}
                      pageRangeDisplayed={5}
                      onPageChange={this.handlePageClickSubjectTerm}
                      containerClassName={'pagination'}
                      subContainerClassName={'pages pagination'}
                      activeClassName={'active'}
                    />
                    </div>
                  </div>
                </div>
                <div
                  className={`chart tab-pane ${activeTab === 'donut' ? 'active' : ''}`}
                  id="subjects"
                  style={{ position: 'relative' }}
                >
                 <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0, 0, 0, 0.125)', paddingBottom: '19px', paddingTop:'2.5px' }}>
  {/* Bên trái: Tìm kiếm và chọn ngành */}
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    <div className="input-group input-group-sm" style={{ width: '220px' }}>
      <input type="text" className="form-control" placeholder="Tìm kiếm" value={searchKeyword1} onChange={(e) => this.setState({ searchKeyword1: e.target.value }, this.handleSearchSubject)} />
      <div className="input-group-append">
        <button type="submit" className="btn btn-default">
          <i className="fas fa-search"></i>
        </button>
      </div>
    </div>
    <div className="input-group input-group-sm" style={{ width: '130px' }}>
      <select className="form-control select2 select2-danger" style={{ width: '100%' }} onChange={this.handleMajorChange} value={selectedMajor}>
        <option value="">Chọn ngành</option>
        {majors.map(major => (<option key={major._id} value={major._id}>{major.majorName}</option>))}
      </select>
    </div>
  </div>
  {/* Bên phải: Nút thêm mới */}
  <div style={{ marginLeft: 'auto' }}>
  {userRole !== 'Giảng viên' && userRole !== 'Sinh viên'  && (
                <>
<button className="btn btn-success" style={{ backgroundColor: '#6B63FF', borderColor: '#6B63FF', color: '#ffffff', borderRadius: '4px' }} onClick={() => this.setState({ showModal: true })}>
      <i className="fas fa" style={{ fontFamily: 'Roboto, Arial, sans-serif', fontSize: '16px', fontWeight: '400' }}>+ Thêm mới</i>
    </button>
                </>
              )}
    
  </div>
</div>

                  <div className="card-body table-responsive p-0">
                    <table className="table table-hover text-nowrap">
                      <thead>
                        <tr>
                        <th>STT</th>
                        <th>Mã môn học</th>
                        <th>Tên môn học</th>
                        <th>Số TC</th>
                        <th>Ngành</th>
                        <th></th>
                        </tr>
                      </thead>
                      <tbody>
                      {subjectRows}
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
                  pageCount={Math.ceil(filteredSubjects.length / subjectsPerPage)}
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
              </div>
            </div>
          </div>
        </section>
        <ToastContainer />

        {showModal && (
  <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Thêm mới môn học</h5>
          <button type="button" className="close" onClick={this.cancelAdding}>
            <span>&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <form onSubmit={this.saveAdding}>
            <div className="row">
              <div className="col-sm-6">
              <div className="form-group">
              <label>
                Mã môn học <span style={{ color: 'red' }}>{this.state.errorCode ? `(${this.state.errorCode})` : '*'}</span>
              </label>
            <input
              type="text"
              className="form-control"
              name="subjectCode"
              value={this.state.addingSubject.subjectCode}
              onChange={this.handleInputChange}
              placeholder="Nhập mã môn học..."
            />
          </div>
              </div>
              <div className="col-sm-6">
                <div className="form-group">
                  <label>Tên môn học <span style={{ color: 'red' }}>{this.state.errorName ? `(${this.state.errorName})` : '*'}</span></label>
                  <input
                    type="text"
                    className="form-control"
                    name="subjectName"
                    value={this.state.addingSubject.subjectName}
                    onChange={this.handleInputChange}
                    placeholder="Nhập tên môn học..."
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-6">
                <div className="form-group">
                  <label>Số tín chỉ <span style={{ color: 'red' }}>{this.state.errorTinChi ? `(${this.state.errorTinChi})` : '*'}</span></label>
                  <input
                    type="number"
                    className="form-control"
                    name="credit"
                    value={this.state.addingSubject.credit}
                    onChange={this.handleInputChange}
                    placeholder="Nhập số tín chỉ..."
                  />
                </div>
                
              </div>
              <div className="col-12 col-sm-6">
                <div className="form-group">
                  <label>Ngành <span style={{ color: 'red' }}>{this.state.errorMajor ? `(${this.state.errorMajor})` : '*'}</span></label>
                  <select
                    className="form-control select2 select2-danger"
                    data-dropdown-css-class="select2-danger"
                    style={{ width: '100%' }}
                    name="major"
                    value={this.state.addingSubject.major}
                    onChange={this.handleInputChange}
                  >
                    <option value="">Chọn ngành</option>
                    {this.state.majors.map(major => (
                      <option key={major._id} value={major._id}>{major.majorName}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            <div className="card-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', backgroundColor: 'transparent' }}>
              <button type="button" className="btn btn-secondary" onClick={this.cancelAdding}>Hủy</button>
              <button type="submit" className="btn btn-primary">Xác nhận</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
)}
{showModal1 && (
  <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Chỉnh sửa môn học</h5>
          <button type="button" className="close" onClick={this.cancelEditing}>
            <span>&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <form onSubmit={this.saveEditing}>
            <div className="row">
              <div className="col-sm-6">
                <div className="form-group">
                  <label>Mã môn học</label>
                  <input
                    type="text"
                    className="form-control"
                    name="subjectCode"
                    value={this.state.editingSubject.subjectCode}
                    onChange={this.handleInputChange}
                    placeholder="Nhập mã môn học..."
                    readOnly
                  />
                </div>
              </div>
              <div className="col-sm-6">
                <div className="form-group">
                  <label>Tên môn học</label>
                  <input
                    type="text"
                    className="form-control"
                    name="subjectName"
                    value={this.state.editingSubject.subjectName}
                    onChange={this.handleInputChange}
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
                    value={this.state.editingSubject.credit}
                    onChange={this.handleInputChange}
                    placeholder="Nhập số tín chỉ..."
                  />
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
                    value={this.state.editingSubject.major}
                    onChange={this.handleInputChange}
                  >
                    <option value="">Chọn ngành</option>
                    {this.state.majors.map(major => (
                      <option key={major._id} value={major._id}>{major.majorName}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="card-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', backgroundColor: 'transparent' }}>
              <button type="button" className="btn btn-secondary" onClick={this.cancelEditing}>Hủy</button>
              <button type="submit" className="btn btn-primary">Xác nhận</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
)}
        {showModalSubjectTerm3 && (
          <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Thêm mới môn học</h5>
                  <button type="button" className="close" onClick={this.cancelAddingSubjectTerm}>
                    <span>&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <form onSubmit={this.saveAddingSubjectTerm}>
                    <div className="form-group">
                      <label>Tên môn học <span style={{ color: 'red' }}>{errorName ? `(${errorName})` : '*'}</span></label>
                      <select
                        className="form-control"
                        name="subjectName"
                        value={addingSubject.subjectName}
                        onChange={this.handleInputChangeSubjectTerm}
                      >
                        <option value="">Chọn tên môn học</option>
                        {subjects.map(subject => (
                          <option key={subject._id} value={subject._id}>{subject.subjectName}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Học kỳ <span style={{ color: 'red' }}>{errorTerm ? `(${errorTerm})` : '*'}</span></label>
                      <select
                        className="form-control"
                        name="term"
                        value={addingSubject.term}
                        onChange={this.handleInputChangeSubjectTerm}
                      >
                        <option value="">Chọn học kỳ</option>
                        {semesters.map(semester => (
                          <option key={semester._id} value={semester._id}>{semester.term}</option>
                        ))}
                      </select>
                    </div>
                    <div className="card-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', backgroundColor: 'transparent' }}>
                      <button type="button" className="btn btn-secondary" onClick={this.cancelAddingSubjectTerm}>Hủy</button>
                      <button type="submit" className="btn btn-primary">Xác nhận</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
        {showModalSubjectTerm4 && (
  <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Chỉnh sửa môn học</h5>
          <button type="button" className="close" onClick={this.cancelEditingSubjectTerm}>
            <span>&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <form onSubmit={this.saveEditingSubjectTerm}>
            <div className="form-group">
              <label>Tên môn học <span style={{ color: 'red' }}>{errorName ? `(${errorName})` : '*'}</span></label>
              <select
                className="form-control"
                name="subjectName"
                value={editingSubject.subjectName}
                onChange={this.handleInputChangeSubjectTerm}
              >
                <option value="">Chọn tên môn học</option>
                {subjects.map(subject => (
                  <option key={subject._id} value={subject._id}>{subject.subjectName}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Học kỳ <span style={{ color: 'red' }}>{errorTerm ? `(${errorTerm})` : '*'}</span></label>
              <select
                className="form-control"
                name="term"
                value={editingSubject.term}
                onChange={this.handleInputChangeSubjectTerm}
              >
                <option value="">Chọn học kỳ</option>
                {semesters.map(semester => (
                  <option key={semester._id} value={semester._id}>{semester.term}</option>
                ))}
              </select>
            </div>
            <div className="card-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', backgroundColor: 'transparent' }}>
              <button type="button" className="btn btn-secondary" onClick={this.cancelEditingSubjectTerm}>Hủy</button>
              <button type="submit" className="btn btn-primary">Xác nhận</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
)}
{showModalImport && (
  <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">IMPORT LỚP HỌC PHẦN</h5>
          <button type="button" className="close" onClick={this.cancelImport}>
            <span>&times;</span>
          </button>
        </div>
        <div className="modal-body">
            <input 
              type="file" 
              onChange={this.handleFileChange} 
              disabled={this.state.isLoading} // Vô hiệu hóa input khi đang upload
              ref={this.fileInputRef} // Thêm ref cho input file
            />
        </div>
        <div className="modal-body">
        <h6>Tải file mẫu import lớp HP và môn học: <a href="https://docs.google.com/spreadsheets/d/1Yhgx3WBa8sLrfoHfQLspa3FVs8vKKPBo/export?format=xlsx" download>Tải mẫu</a></h6>
        </div>
        {/* {this.state.runtime && (
  <div className="modal-body">
    <h3>Kết quả upload</h3>
    <p>Thời gian chạy: {this.formatRuntime(this.state.runtime)}</p>
    <p><b>Email của GV mới được thêm vào:</b></p>
    <ul>
      {this.state.addedEmails.map((email, index) => (
        <li key={index}>{email}</li>
      ))}
    </ul>
    <p><b>Mã môn học mới được thêm vào:</b></p>
    <ul>
      {this.state.addedSubjectCodes.map((code, index) => (
        <li key={index}>{code}</li>
      ))}
    </ul>
    <p><b>Mã học phần mới được thêm vào:</b></p>
    <ul>
      {this.state.addedSubjectTermCodes.map((code, index) => (
        <li key={index}>{code}</li>
      ))}
    </ul>
    <p><b>Mã lớp mới được thêm vào:</b></p>
    <ul>
      {this.state.addedClassCodes.map((code, index) => (
        <li key={index}>{code}</li>
      ))}
    </ul>
  </div>
)} */}
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={this.cancelImport}>Hủy</button>
          <button 
            type="button" 
            className="btn btn-primary" 
            onClick={this.handleFileUpload} 
            disabled={this.state.isLoading} // Vô hiệu hóa nút khi đang upload
          >
            {this.state.isLoading ? 'Uploading...' : 'Gửi'}
          </button>
        </div>
      </div>
    </div>
  </div>
)}
{this.state.showModalKQIm && (
          <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Thông tin import</h5>
                  <button type="button" className="close" onClick={() => { this.closeModalKQIM(); this.cancelImport(); }}>
                  <span>&times;</span>
                  </button>
                </div>
                <div className="modal-body scrollable-modal-body">
                  <h3><b>Kết quả upload</b></h3>
                  <p><b>Thời gian chạy:</b> {this.formatRuntime(this.state.runtime)}</p>
                  <h4 onClick={this.toggleAddedClassCodes} style={{ cursor: 'pointer', color: 'rgb(0, 153, 0)' }}><b>Lớp HP mới được thêm:</b>({this.state.addedClassCodesCount})</h4>
                  {this.state.showAddedClassCodes && (
                    // <ul>
                    //   {this.state.addedEmails.map((email, index) => (
                    //     <li key={index}>{email}</li>
                    //   ))}
                    // </ul>
                    <table className="table table-hover text-nowrap">
                      <thead>
                        <tr>
                          <th>Mã lớp</th>
                          <th>Tên môn</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.addedClassCodes.map((emailteacher, index) => (
                          <tr key={index}>
                            <td>{emailteacher.classCode}</td>
                            <td>{emailteacher.subjectName}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    
                  )}
                  <h4 onClick={this.toggleduplicateClasses} style={{ cursor: 'pointer', color: 'rgb(184, 190, 3)' }}><b>Lớp HP đã có trong data:</b>({this.state.duplicateClassesCount})</h4>
                  {this.state.showduplicateClasses && (
                    <table className="table table-hover text-nowrap">
                      <thead>
                        <tr>
                          <th>Mã lớp</th>
                          <th>Tên môn</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.duplicateClasses.map((teacher, index) => (
                          <tr key={index}>
                            <td>{teacher.classCode}</td>
                            <td>{teacher.subjectName}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
{this.state.isLoading && (
          <div style={styles.loadingOverlay}>
            <div aria-label="Orange and tan hamster running in a metal wheel" role="img" class="wheel-and-hamster">
	<div class="wheel"></div>
	<div class="hamster">
		<div class="hamster__body">
			<div class="hamster__head">
				<div class="hamster__ear"></div>
				<div class="hamster__eye"></div>
				<div class="hamster__nose"></div>
			</div>
			<div class="hamster__limb hamster__limb--fr"></div>
			<div class="hamster__limb hamster__limb--fl"></div>
			<div class="hamster__limb hamster__limb--br"></div>
			<div class="hamster__limb hamster__limb--bl"></div>
			<div class="hamster__tail"></div>
		</div>
	</div>
	<div class="spoke"></div>
</div>

          </div>
        )}
        
        <style jsx>{`
          /* From Uiverse.io by KSAplay */ 
/* From Uiverse.io by Nawsome */ 
.scrollable-modal-body {
  max-height: 400px; /* Adjust the height as needed */
  overflow-y: auto;
}
.wheel-and-hamster {
  --dur: 1s;
  position: relative;
  width: 12em;
  height: 12em;
  font-size: 14px;
}

.wheel,
.hamster,
.hamster div,
.spoke {
  position: absolute;
}

.wheel,
.spoke {
  border-radius: 50%;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.wheel {
  background: radial-gradient(100% 100% at center,hsla(0,0%,60%,0) 47.8%,hsl(0,0%,60%) 48%);
  z-index: 2;
}

.hamster {
  animation: hamster var(--dur) ease-in-out infinite;
  top: 50%;
  left: calc(50% - 3.5em);
  width: 7em;
  height: 3.75em;
  transform: rotate(4deg) translate(-0.8em,1.85em);
  transform-origin: 50% 0;
  z-index: 1;
}

.hamster__head {
  animation: hamsterHead var(--dur) ease-in-out infinite;
  background: hsl(30,90%,55%);
  border-radius: 70% 30% 0 100% / 40% 25% 25% 60%;
  box-shadow: 0 -0.25em 0 hsl(30,90%,80%) inset,
		0.75em -1.55em 0 hsl(30,90%,90%) inset;
  top: 0;
  left: -2em;
  width: 2.75em;
  height: 2.5em;
  transform-origin: 100% 50%;
}

.hamster__ear {
  animation: hamsterEar var(--dur) ease-in-out infinite;
  background: hsl(0,90%,85%);
  border-radius: 50%;
  box-shadow: -0.25em 0 hsl(30,90%,55%) inset;
  top: -0.25em;
  right: -0.25em;
  width: 0.75em;
  height: 0.75em;
  transform-origin: 50% 75%;
}

.hamster__eye {
  animation: hamsterEye var(--dur) linear infinite;
  background-color: hsl(0,0%,0%);
  border-radius: 50%;
  top: 0.375em;
  left: 1.25em;
  width: 0.5em;
  height: 0.5em;
}

.hamster__nose {
  background: hsl(0,90%,75%);
  border-radius: 35% 65% 85% 15% / 70% 50% 50% 30%;
  top: 0.75em;
  left: 0;
  width: 0.2em;
  height: 0.25em;
}

.hamster__body {
  animation: hamsterBody var(--dur) ease-in-out infinite;
  background: hsl(30,90%,90%);
  border-radius: 50% 30% 50% 30% / 15% 60% 40% 40%;
  box-shadow: 0.1em 0.75em 0 hsl(30,90%,55%) inset,
		0.15em -0.5em 0 hsl(30,90%,80%) inset;
  top: 0.25em;
  left: 2em;
  width: 4.5em;
  height: 3em;
  transform-origin: 17% 50%;
  transform-style: preserve-3d;
}

.hamster__limb--fr,
.hamster__limb--fl {
  clip-path: polygon(0 0,100% 0,70% 80%,60% 100%,0% 100%,40% 80%);
  top: 2em;
  left: 0.5em;
  width: 1em;
  height: 1.5em;
  transform-origin: 50% 0;
}

.hamster__limb--fr {
  animation: hamsterFRLimb var(--dur) linear infinite;
  background: linear-gradient(hsl(30,90%,80%) 80%,hsl(0,90%,75%) 80%);
  transform: rotate(15deg) translateZ(-1px);
}

.hamster__limb--fl {
  animation: hamsterFLLimb var(--dur) linear infinite;
  background: linear-gradient(hsl(30,90%,90%) 80%,hsl(0,90%,85%) 80%);
  transform: rotate(15deg);
}

.hamster__limb--br,
.hamster__limb--bl {
  border-radius: 0.75em 0.75em 0 0;
  clip-path: polygon(0 0,100% 0,100% 30%,70% 90%,70% 100%,30% 100%,40% 90%,0% 30%);
  top: 1em;
  left: 2.8em;
  width: 1.5em;
  height: 2.5em;
  transform-origin: 50% 30%;
}

.hamster__limb--br {
  animation: hamsterBRLimb var(--dur) linear infinite;
  background: linear-gradient(hsl(30,90%,80%) 90%,hsl(0,90%,75%) 90%);
  transform: rotate(-25deg) translateZ(-1px);
}

.hamster__limb--bl {
  animation: hamsterBLLimb var(--dur) linear infinite;
  background: linear-gradient(hsl(30,90%,90%) 90%,hsl(0,90%,85%) 90%);
  transform: rotate(-25deg);
}

.hamster__tail {
  animation: hamsterTail var(--dur) linear infinite;
  background: hsl(0,90%,85%);
  border-radius: 0.25em 50% 50% 0.25em;
  box-shadow: 0 -0.2em 0 hsl(0,90%,75%) inset;
  top: 1.5em;
  right: -0.5em;
  width: 1em;
  height: 0.5em;
  transform: rotate(30deg) translateZ(-1px);
  transform-origin: 0.25em 0.25em;
}

.spoke {
  animation: spoke var(--dur) linear infinite;
  background: radial-gradient(100% 100% at center,hsl(0,0%,60%) 4.8%,hsla(0,0%,60%,0) 5%),
		linear-gradient(hsla(0,0%,55%,0) 46.9%,hsl(0,0%,65%) 47% 52.9%,hsla(0,0%,65%,0) 53%) 50% 50% / 99% 99% no-repeat;
}

/* Animations */
@keyframes hamster {
  from, to {
    transform: rotate(4deg) translate(-0.8em,1.85em);
  }

  50% {
    transform: rotate(0) translate(-0.8em,1.85em);
  }
}

@keyframes hamsterHead {
  from, 25%, 50%, 75%, to {
    transform: rotate(0);
  }

  12.5%, 37.5%, 62.5%, 87.5% {
    transform: rotate(8deg);
  }
}

@keyframes hamsterEye {
  from, 90%, to {
    transform: scaleY(1);
  }

  95% {
    transform: scaleY(0);
  }
}

@keyframes hamsterEar {
  from, 25%, 50%, 75%, to {
    transform: rotate(0);
  }

  12.5%, 37.5%, 62.5%, 87.5% {
    transform: rotate(12deg);
  }
}

@keyframes hamsterBody {
  from, 25%, 50%, 75%, to {
    transform: rotate(0);
  }

  12.5%, 37.5%, 62.5%, 87.5% {
    transform: rotate(-2deg);
  }
}

@keyframes hamsterFRLimb {
  from, 25%, 50%, 75%, to {
    transform: rotate(50deg) translateZ(-1px);
  }

  12.5%, 37.5%, 62.5%, 87.5% {
    transform: rotate(-30deg) translateZ(-1px);
  }
}

@keyframes hamsterFLLimb {
  from, 25%, 50%, 75%, to {
    transform: rotate(-30deg);
  }

  12.5%, 37.5%, 62.5%, 87.5% {
    transform: rotate(50deg);
  }
}

@keyframes hamsterBRLimb {
  from, 25%, 50%, 75%, to {
    transform: rotate(-60deg) translateZ(-1px);
  }

  12.5%, 37.5%, 62.5%, 87.5% {
    transform: rotate(20deg) translateZ(-1px);
  }
}

@keyframes hamsterBLLimb {
  from, 25%, 50%, 75%, to {
    transform: rotate(20deg);
  }

  12.5%, 37.5%, 62.5%, 87.5% {
    transform: rotate(-60deg);
  }
}

@keyframes hamsterTail {
  from, 25%, 50%, 75%, to {
    transform: rotate(30deg) translateZ(-1px);
  }

  12.5%, 37.5%, 62.5%, 87.5% {
    transform: rotate(10deg) translateZ(-1px);
  }
}

@keyframes spoke {
  from {
    transform: rotate(0);
  }

  to {
    transform: rotate(-1turn);
  }
}

        `}</style>
      </div>
    );
  }
}
const styles = {
  loadingOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
};

export default Subject;
