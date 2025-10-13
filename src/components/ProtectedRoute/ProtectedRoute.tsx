import type { ReactNode } from "react";
import useAuth from "../../context/useAuth"
import { Navigate } from "react-router-dom";
export const ProtectedRoute = ({children} : {children: ReactNode}) => {
    const {currentUser} = useAuth();
    return currentUser !== null ? children : <Navigate to="/"/>
}

export default ProtectedRoute;