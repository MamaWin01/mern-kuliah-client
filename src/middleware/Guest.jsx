import { Navigate } from 'react-router-dom';
import authHelpers from '../helpers/auth';

const Guest = ({ children }) => {
    const token = authHelpers.isAuthenticated().token

    return token ? <Navigate to="/home" /> : children
}

export default Guest