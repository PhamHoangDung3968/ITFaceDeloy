import React, { Component } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import MyContext from '../contexts/MyContext';

class EditRole extends Component {
    static contextType = MyContext;
    constructor(props) {
        super(props);
        this.state = {
            txtID: '',
            txtName: '',
        };
    }

    componentDidMount() {
        const { id } = this.props.params;
        this.setState({ txtID: id });
        this.fetchRoleData(id);
    }

    fetchRoleData(id) {
        const config = { headers: { 'x-access-token': this.context.token } };
        axios.get('/api/admin/roles/' + id, config).then((res) => {
            const result = res.data;
            if (result) {
                this.setState({ txtName: result.tenrole, txtTenRole: result.tenrole });
            } else {
                alert('Không tìm thấy dữ liệu!');
            }
        }).catch((error) => {
            console.error('Có lỗi xảy ra:', error);
        });
    }

    render() {
        return (
            <div>
                <section className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h1>Quản lý quyền</h1>
                            </div>
                            <div className="col-sm-6">
                                <ol className="breadcrumb float-sm-right">
                                    <li className="breadcrumb-item"><Link to='/admin/home'>Trang chủ</Link></li>
                                    <li className="breadcrumb-item"><Link to='/admin/role'>Quyền</Link></li>
                                    <li className="breadcrumb-item active">Cập nhật quyền</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="content">
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">Thông tin cập nhật quyền</h3>
                        </div>
                        <div className="card-body">
                            <div className="bs-stepper-content">
                                <div id="logins-part" className="content" role="tabpanel" aria-labelledby="logins-part-trigger">
                                    <div className="form-group">
                                        <label htmlFor="inputId">ID</label>
                                        <input type="text" value={this.state.txtID} onChange={(e) => { this.setState({ txtID: e.target.value }) }} readOnly={true} className="form-control" id="inputId"/>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="inputName">Tên quyền</label>
                                        <input type="text" value={this.state.txtName} onChange={(e) => { this.setState({ txtName: e.target.value }) }} className="form-control" id="inputName"/>
                                    </div>
                                    
                                    <div className="form-group">
                                        <Link to='/admin/role' className="btn btn-danger">Quay lại</Link>
                                        <button type="submit" className="btn btn-primary" onClick={(e) => this.btnUpdateClick(e)}>Submit</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-footer"></div>
                    </div>
                </section>
            </div>
        );
    }

    componentDidUpdate(prevProps) {
        if (this.props.item !== prevProps.item) {
            this.setState({ txtID: this.props.item._id, txtName: this.props.item.tenrole, txtTenRole: this.props.item.tenrole });
        }
    }

    // event-handlers
    btnUpdateClick(e) {
        e.preventDefault();
        const id = this.state.txtID;
        const tenrole = this.state.txtName;
        if (id && tenrole) {
            const role = { tenrole: tenrole}; // Added tenrole field
            this.apiPutRole(id, role);
        } else {
            alert('Vui lòng điền đầy đủ thông tin!');
        }
    }

    apiPutRole(id, role) {
        const config = { headers: { 'x-access-token': this.context.token } };
        axios.put('/api/admin/roles/' + id, role, config).then((res) => {
            const result = res.data;
            if (result) {
                alert('Thao tác thành công!!');
                // this.apiGetCategories();
            } else {
                alert('Có lỗi xảy ra');
            }
        });
    }
}

// Wrap the component with withRouter to access params
export default (props) => (
    <EditRole {...props} params={useParams()} />
);
