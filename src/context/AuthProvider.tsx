/**
 * Component provides the data context wrapped components have access to 
 * manages auth state and communication with cognito
 */
import React, { useState, useEffect } from "react";
// import AuthContext from "./authContext";
import type { AuthContextType, User } from "../types/types";
import { getCurrentUser, signIn, signOut, signUp, fetchAuthSession, fetchUserAttributes, type SignInOutput } from "@aws-amplify/auth";
import AuthContext from "./authContext";
export default function AuthProvider({ children } : {children: React.ReactNode}){
    const [isLoading, setIsLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    // we need a useEffect to look for the current user on app load
    useEffect(() => {
        const checkAuth = async () => {
            try{
                const { tokens } = await fetchAuthSession();
                if (tokens){
                    const user = await getCurrentUser();
                    const name = (await fetchUserAttributes()).name;
                    setCurrentUser({...user, name});
                }
            } catch(error){
                // nothing catches this error, maybe show a toast in the future
                console.error("Error retrieving session: ", error);
            }
        };
        checkAuth();
    }, [])

    
    const userSignUp = async (name: string, email: string, password: string) => {
        try{
            /**
             * we need to return SignUpOutput
             * so that email verification can be completed
             */
            const signUpResult =  await signUp({
                username: email,
                password: password,
                options: {
                    userAttributes: {
                        name: name
                    }
                }
            });
            return signUpResult;
        // errors bubble up for frontend to handle
        } catch(error){
            throw error;
        }
    }

    /**
     * 
     * @param email 
     * @param password 
     * validate the two fields
     * await auth sign in
     * give the current user context for other applications to use
     */
    const userSignIn = async (email: string, password: string) => {
        // error is caught by the login component
        setIsLoading(true);
        try{    
                await signIn({username: email, password: password})
                const user = await getCurrentUser();
                const name = (await fetchUserAttributes()).name;
                setCurrentUser({...user, name});
            } 
        finally{
            setIsLoading(false);
        }   
    }

    const userSignOut = async () => {
        try {
            await signOut();
        } finally {
            // Always clear user, even if signOut failed
            setCurrentUser(null);
        }
    }

    const value: AuthContextType = {
        isLoading,
        currentUser,
        userSignUp,
        userSignIn,
        userSignOut
    }

    return(
        // provider is a property on context object
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}  