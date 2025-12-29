/**
 * this page should only render conditionally if the user hasn't already connected to discord oauth
 */
import { useState, useEffect } from "react";
import useAuth from "../../context/useAuth";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./CallbackPage.css";

export const CallbackPage = () => {
    const [status, setStatus] = useState<"loading" | "error" | "success">("loading")
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const {jwtToken, authReady} = useAuth(); // cognito jwt
    const API_ENDPOINT = import.meta.env.VITE_APP_API_ENDPOINT;
    
    if (!API_ENDPOINT) {
        throw new Error('VITE_APP_API_ENDPOINT is not defined');
    }
    /**
     * Explaining this useEffect call:
     * Dashboard page has a connect to discord button
     * This page is rendered on redirect back from Discord
     * Then, with the Discord facing accessToken, retrieve the author_ID
     * 
     * From here: 
     * The frontend sends the cognito_id info through the authorization parameter
     * The backend:
     * checks if the author_ID/JWT combination exists in the backend. if it does not
     *  - store both the author_id from the discord oauth provider AND the cognito JWT in the backend
     *  With each request, only the JWT is an authentication mechanism
     */
    useEffect(() => {
        (async () => {
            if (!authReady) {
                return;
            }
            
            const discordOAuthCode = searchParams.get("code");
            // we need a jwt from user sign in 

            if (!jwtToken) {
                console.log("No jwt!")
                setStatus("error");
                setTimeout(() => navigate("/"), 500);
                return;
            }
            try {
                // swap to use correct fetch api
                const discordCallBackReq = await fetch(`${API_ENDPOINT}/auth/callback`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${jwtToken}`
                    },
                    credentials: 'include',
                    body: JSON.stringify({ authCode: discordOAuthCode })
                });
                console.log("after discord oauth call:", discordCallBackReq)
                if (discordCallBackReq.status === 200) {
                    setStatus("success");
                    setTimeout(() => {
                        navigate("/dashboard");
                    }, 500);
                } else {
                    setStatus("error");
                    setTimeout(() => {
                        navigate("/");
                    }, 500);
                }
            } catch (error) {
                console.log("TESTING", error)
                setStatus("error");
                setTimeout(() => {
                    navigate("/");
                }, 500);
            }
        })();
        // reauthenticate if need be
    }, [jwtToken, authReady, searchParams, navigate, API_ENDPOINT]);


    if (!authReady) {
        return (
            <main className="callback_page_content">
                <h1 className="loading_state">Initializing...</h1>
            </main>
        );
    }

    return (
        <main className="callback_page_content">
            {status === "loading" && <h1 className="loading_state">Connecting to your Discord account...</h1>}
            {status === "error" && <h1 className="error_state"> There was an error connecting to your Discord account. Try again later.</h1>}
            {status === "success" && <h1>Success! Redirecting you to your Dashboard.</h1>}
        </main>
    )
}

export default CallbackPage;