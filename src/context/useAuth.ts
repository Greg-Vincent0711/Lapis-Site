// hook that allows provided components to use authentication
import { useContext } from "react";
import AuthContext from "./authContext";
const useAuth = () => {
    const authCTX = useContext(AuthContext);
    return authCTX;
}

export default useAuth;