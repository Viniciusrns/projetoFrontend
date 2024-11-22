import { useContext } from 'react'
import { Navigate } from 'react-router-dom';

import { AuthContext } from './AuthProvider.jsx';
//import Login from '../pages/Login.jsx';




export const RequireAuth = ({ children }) => {
    const auth = useContext(AuthContext);
    console.log("USER: ", auth.user)

    if (auth.user === null) {
        return <Navigate to="/login" />;
    }

    return children;
}