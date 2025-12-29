import type { ReactNode } from "react";
import useAuth from "../../context/useAuth"
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({children} : {children: ReactNode}) => {
    const {currentUser, authReady} = useAuth();
    
    if (!authReady) {
        return <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh',
            fontSize: '18px'
        }}>Loading...</div>;
    }
    
    return currentUser !== null ? children : <Navigate to="/"/>
}

export default ProtectedRoute;
