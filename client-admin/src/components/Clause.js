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

const Clause = () => {
  return (
    <div>
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Điều khoản ITFace</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <b><Link to='/admin/home' style={{color:'#6B63FF'}}>Trang chủ</Link></b>
                  </li>
                
                <li className="breadcrumb-item active">Điều khoản ITFace</li>
              </ol>
            </div>
          </div>
        </div>
      </section>
      <section className="content">
      <div class="card">
      <div class="card">
  <div class="card-body">
    <h4 style={{ textAlign:'center' }}>Điều khoản sử dụng hình ảnh người dùng</h4>
    <p>
      Chào mừng bạn đến với ứng dụng điểm danh ITFace. Chúng tôi cam kết bảo vệ quyền riêng tư và bảo mật thông tin cá nhân của bạn. Dưới đây là các điều khoản chi tiết liên quan đến việc sử dụng hình ảnh của bạn:
    </p>
    <h6><strong>Mục đích sử dụng</strong></h6>
    <p>
      Hình ảnh của bạn sẽ chỉ được sử dụng cho mục đích điểm danh và xác thực danh tính trong các lớp học thuộc hệ thống ITFace. Việc sử dụng hình ảnh giúp chúng tôi đảm bảo rằng chỉ những sinh viên đã đăng ký mới có thể tham gia lớp học và nhận được các quyền lợi liên quan.
    </p>
    <h6><strong>Bảo mật thông tin</strong></h6>
    <p>
      Chúng tôi cam kết bảo mật tuyệt đối hình ảnh của bạn. Hình ảnh sẽ được mã hóa và lưu trữ an toàn trong hệ thống của chúng tôi. Chúng tôi không sử dụng hình ảnh của bạn cho bất kỳ mục đích thương mại nào hoặc làm ảnh hưởng đến danh dự cá nhân của bạn.
    </p>
    <h6><strong>Quyền riêng tư</strong></h6>
    <p>
      Hình ảnh của bạn sẽ không được chia sẻ với bất kỳ bên thứ ba nào mà không có sự đồng ý của bạn, trừ khi có yêu cầu từ cơ quan pháp luật. Chúng tôi tôn trọng quyền riêng tư của bạn và sẽ chỉ sử dụng hình ảnh trong phạm vi đã được bạn đồng ý.
    </p>
    <h6><strong>Thời gian lưu trữ</strong></h6>
    <p>
      Hình ảnh của bạn sẽ được lưu trữ trong hệ thống của chúng tôi chỉ trong thời gian cần thiết để phục vụ cho mục đích điểm danh. Sau khi kết thúc khóa học hoặc khi bạn yêu cầu, chúng tôi sẽ xóa bỏ hình ảnh của bạn khỏi hệ thống.
    </p>
    <h6><strong>Quyền lợi và trách nhiệm của người dùng</strong></h6>
    <p>
      Bạn có quyền yêu cầu truy cập, chỉnh sửa hoặc xóa bỏ hình ảnh của mình khỏi hệ thống bất kỳ lúc nào. Nếu bạn có bất kỳ thắc mắc hoặc yêu cầu nào liên quan đến quyền riêng tư và bảo mật thông tin, vui lòng liên hệ với chúng tôi qua các kênh hỗ trợ chính thức.
    </p>
    <h6><strong>Cơ sở pháp lý</strong></h6>
    <p>
      Việc thu thập và sử dụng hình ảnh của bạn tuân thủ các quy định của pháp luật về bảo vệ dữ liệu cá nhân, bao gồm nhưng không giới hạn ở:
    </p>
    <ul>
      <li>
        <strong>Luật An toàn thông tin mạng:</strong> Quy định về việc bảo vệ thông tin cá nhân trên mạng, đảm bảo rằng dữ liệu của bạn được bảo mật và không bị lạm dụng.
      </li>
      <li>
        <strong>Luật Bảo vệ quyền riêng tư:</strong> Các quy định về quyền riêng tư của cá nhân, đảm bảo rằng hình ảnh của bạn không bị sử dụng cho các mục đích không được phép.
      </li>
    </ul>
    <p>
      Bằng việc sử dụng ứng dụng ITFace, bạn đồng ý với các điều khoản trên. Nếu bạn có bất kỳ câu hỏi hoặc cần hỗ trợ thêm, vui lòng liên hệ với chúng tôi qua email hoặc số điện thoại được cung cấp trên trang web chính thức của ITFace. Chúng tôi luôn sẵn sàng hỗ trợ bạn.
    </p>
    <p>
      <em>ITFace Team - Khoa Công nghệ Thông tin Trường Đại học Văn Lang</em>
    </p>
  </div>
</div>  
            </div>
      </section>
    </div>
  );
};
export default Clause;