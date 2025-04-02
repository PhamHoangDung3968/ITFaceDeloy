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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProtectedRoute = ({ element: Component, ...rest }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const showToast = (message) => {
        toast.success(message, { position: "top-right" });
    };

    const showErrorToast = (message) => {
        toast.error(message, { position: "top-right" });
    };

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
    if (!isAuthenticated) {
        showErrorToast('Authentication failed. Redirecting to home page.');
        return (
            <>
                <Navigate to="/admin/home" /> // Hoặc trang khác mà bạn muốn điều hướng đến
                <ToastContainer />
            </>
        );
    }

    return (
        // isAuthenticated ? (
        //     <Component {...rest} />
        // ) : (
        //     <Navigate to="/admin/home" /> // Hoặc trang khác mà bạn muốn điều hướng đến
        // )
        <>
            <Component {...rest} />
            <ToastContainer />
        </>

    );
};

export default ProtectedRoute;