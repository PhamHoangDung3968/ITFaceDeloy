import React from 'react';
import axios from 'axios';

const MainHeaderComponent = ({ user, handleLogout }) => {
  return (
    <nav className="main-header navbar navbar-expand navbar-white navbar-light">
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <a className="nav-link" data-widget="navbar-" href="#" role="button">
            <b>{user.givenName} {user.surname}</b> | <a href='/admin' onClick={handleLogout}>Đăng xuất</a>
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default MainHeaderComponent;