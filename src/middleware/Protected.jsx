import { Navigate } from 'react-router-dom';
import authHelpers from '../helpers/auth';

const Protected = ({ children }) => {
    const token = authHelpers.isAuthenticated().token

    return token ? children : <Navigate to="/" />
}

export default Protected