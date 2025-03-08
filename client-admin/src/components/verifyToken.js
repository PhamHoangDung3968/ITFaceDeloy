import axios from 'axios';

const verifyToken = async (token) => {
    try {
        const response = await axios.post('/api/admin/verify-token', {}, {
            headers: {
                'x-access-token': token
            }
        });
        return response.status === 200;
    } catch (error) {
        console.error('Token verification error:', error);
        return false;
    }
};

export default verifyToken;