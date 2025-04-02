// import React, { useEffect, useState } from 'react';
// import { Route, Navigate } from 'react-router-dom';
// import verifyToken from './verifyToken'; // Import hàm kiểm tra mã thông báo

// const ProtectedRoute = ({ element: Component, ...rest }) => {
//     const [isAuthenticated, setIsAuthenticated] = useState(false);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const token = localStorage.getItem('token'); // Hoặc sessionStorage
//         console.log('Token from storage:', token);
//         if (token) {
//             verifyToken(token).then(isValid => {
//                 console.log('Token verification result:', isValid);
//                 setIsAuthenticated(isValid);
//                 setLoading(false);
//             });
//         } else {
//             setLoading(false);
//         }
//     }, []);

//     if (loading) {
//         return <div>Loading...</div>; // Hoặc một spinner loading
//     }

//     return (
//         isAuthenticated ? (
//             <Component {...rest} />
//         ) : (
//             <Navigate to="/admin/home" /> // Hoặc trang khác mà bạn muốn điều hướng đến
//         )
//     );
// };

// export default ProtectedRoute;
import React, { useEffect, useState } from 'react';
import { Route, Navigate, useLocation } from 'react-router-dom';
import verifyToken from './verifyToken'; // Import hàm kiểm tra mã thông báo

const ProtectedRoute = ({ element: Component, ...rest }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const token = new URLSearchParams(location.search).get('token')// Lấy token từ URL hoặc localStorage
        console.log('Token from storage or URL:', token);
        if (token) {
            verifyToken(token).then(isValid => {
                console.log('Token verification result:', isValid);
                setIsAuthenticated(isValid);
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, [location.search]);

    if (loading) {
        return <div>Loading...</div>; // Hoặc một spinner loading
    }

    return (
        isAuthenticated ? (
            <Component {...rest} />
        ) : (
            <Navigate to="/admin/home" state={{ authFailed: true }}  /> // Hoặc trang khác mà bạn muốn điều hướng đến
        )
    );
};

export default ProtectedRoute;