import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = ({ userID, userRole }) => {
  const [user, setUser] = useState(null);
  const [roleName, setRoleName] = useState('chưa cập nhật');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    userCode: '',
    phone: '',
    personalEmail: '',
    typeLecturer: ''
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/api/admin/users/profile/${userID}`);
        setUser(response.data);
        setFormData({
          fullName: response.data.fullName || '',
          userCode: response.data.userCode || '',
          phone: response.data.phone || '',
          personalEmail: response.data.personalEmail || '',
          typeLecturer: response.data.typeLecturer || ''
        });
        if (response.data.role) {
          fetchRoleName(response.data.role);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const fetchRoleName = async (roleId) => {
      try {
        const response = await axios.get(`/api/admin/roles/${roleId}`);
        setRoleName(response.data.tenrole || 'chưa cập nhật');
      } catch (error) {
        console.error('Error fetching role name:', error);
      }
    };

    fetchUser();
  }, [userID]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(`/api/admin/users/edit/${userID}`, formData);
      setUser(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const handleCancel = () => {
    setFormData({
      fullName: user.fullName || '',
      userCode: user.userCode || '',
      phone: user.phone || '',
      personalEmail: user.personalEmail || '',
      typeLecturer: user.typeLecturer || ''
    });
    setIsEditing(false);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const getValueOrDefault = (value, defaultValue = 'chưa cập nhật') => value || defaultValue;

  return (
    <div>
      <section className="content">
        <div className="card card-outline">
          <div className="card-body box-profile">
            <div className="text-center">
              <i className="far fa-user-circle" style={{ fontSize: '100px' }}></i>
            </div>

            <h3 className="profile-username text-center">{getValueOrDefault(user.displayName)}</h3>

            <p className="text-muted text-center">{roleName}</p>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <table className="table table-bordered" style={{ width: '80%' }}>
                <tbody>
                  <tr>
                    <td className="text-center table-cell"><b>Họ và tên</b></td>
                    <td className="text-center table-cell">
                      {isEditing ? (
                        <div className="form-group">
                          <input
                            type="text"
                            className="form-control"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            placeholder="Chưa cập nhật thông tin..."
                          />
                        </div>
                      ) : (
                        getValueOrDefault(user.fullName)
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-center table-cell"><b>Mã số</b></td>
                    <td className="text-center table-cell">
                      {isEditing ? (
                        <div className="form-group">
                          <input
                            type="text"
                            className="form-control"
                            name="userCode"
                            value={formData.userCode}
                            onChange={handleInputChange}
                            placeholder="Chưa cập nhật thông tin..."
                          />
                        </div>
                      ) : (
                        getValueOrDefault(user.userCode)
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-center table-cell"><b>Email</b></td>
                    <td className="text-center table-cell">{getValueOrDefault(user.email)}</td>
                  </tr>
                  <tr>
                    <td className="text-center table-cell"><b>Email cá nhân</b></td>
                    <td className="text-center table-cell">
                      {isEditing ? (
                        <div className="form-group">
                          <input
                            type="text"
                            className="form-control"
                            name="personalEmail"
                            value={formData.personalEmail}
                            onChange={handleInputChange}
                            placeholder="Chưa cập nhật thông tin..."
                          />
                        </div>
                      ) : (
                        getValueOrDefault(user.personalEmail)
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-center table-cell"><b>Số điện thoại</b></td>
                    <td className="text-center table-cell">
                      {isEditing ? (
                        <div className="form-group">
                          <input
                            type="text"
                            className="form-control"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="Chưa cập nhật thông tin..."
                          />
                        </div>
                      ) : (
                        getValueOrDefault(user.phone)
                      )}
                    </td>
                  </tr>
                  {userRole !== 'Sinh viên'  && (
                            <>
                              <tr>
                    <td className="text-center table-cell"><b>Loại giảng viên</b></td>
                    <td className="text-center table-cell">
                      {isEditing ? (
                        <div className="form-group">
                          <select
                            className="form-control"
                            name="typeLecturer"
                            value={formData.typeLecturer}
                            onChange={handleInputChange}
                          >
                            <option value="">Chọn loại giảng viên</option>
                            <option value="Trưởng phó bộ môn">Trưởng phó bộ môn</option>
                            <option value="GV thỉnh giảng">GV thỉnh giảng</option>
                            <option value="GV cơ hữu">GV cơ hữu</option>
                            <option value="Nhân viên">Nhân viên</option>
                          </select>
                        </div>
                      ) : (
                        getValueOrDefault(user.typeLecturer)
                      )}
                    </td>
                  </tr>
                            </>
                          )}
                  
                </tbody>
              </table>
            </div>
            <br />
            {isEditing ? (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button onClick={handleCancel} className="btn btn-danger">
                  <b>Hủy</b>
                </button>
                <button onClick={handleUpdate} className="btn btn-primary">
                  <b>Lưu</b>
                </button>
              </div>
            ) : (
              <button onClick={() => setIsEditing(true)} className="btn btn-success btn-block">
                <b>Cập nhật</b>
              </button>
            )}
          </div>
        </div>
      </section>
      <style jsx>{`
        .table-cell {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 150px; /* Điều chỉnh độ rộng tối đa theo nhu cầu */
        }
      `}</style>
    </div>
  );
};

export default Profile;