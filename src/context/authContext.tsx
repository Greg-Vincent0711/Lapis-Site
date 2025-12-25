import { createContext } from "react";
import type { AuthContextType } from "../types/types";

// need defaults to define the context shape, but replaced by data from Cognito
const defaultValues: AuthContextType = {
    isLoading: false,
    currentUser: null,
    jwtToken: undefined,
    authReady: false,
    userSignUp:
        async () => {throw new Error('userSignUp must be used within AuthProvider')},
    userSignIn: 
        async () => {throw new Error('userSignIn must be used within AuthProvider')},
    userSignOut:
        async () => {throw new Error('userSignOut must be used within AuthProvider')}
}
const AuthContext = createContext(defaultValues);
export default AuthContext;