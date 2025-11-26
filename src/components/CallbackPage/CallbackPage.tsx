/**
 * TODO
 * - make the animations, error states, loading states look better
 */
import { useState, useEffect } from "react";
import useAuth from "../../context/useAuth";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./CallbackPage.css";

export const CallbackPage = () => {
    const [status, setStatus] = useState("loading")
    const [searchParams, _] = useSearchParams();
    const navigate = useNavigate();
    const {authToken} = useAuth();
    const API_ENDPOINT = import.meta.env.VITE_APP_API_ENDPOINT;
    /**
     * Explaning this useEffect call:
     * Dashboard page has a connect to discord button
     * This page is rendered on redirect back from Discord
     * Then, with the Discord facing accessToken, retrieve the author_ID
     * Now, two updates need to happen.
     * 
     * The frontend needs to send the cognito_id info through the authorization parameter
     * 
     * 
     * The backend needs to updated such that:
     *  - At the point we get the response from the discord API that 
     *    contains the user's data, we need to store both the author_id from the 
     *    discord oauth provider AND the cognito JWT in the backend
     * 
     *  With each request, we need to check if this combination already exists
     */
    useEffect(() => {
        (async () => {
            const discordOAuthCode = searchParams.get("code");
            // switch to the API after updating the backend code
            fetch(`${API_ENDPOINT}/auth/callback`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer: ${authToken}` 
                },
                credentials: 'include',
                // discordOAuthCode retrives discord info
                body: JSON.stringify({ discordOAuthCode })
            }).then((res) => res.json()).then((userData) => {
                if(!userData.error){
                    // save the author_ID and cognito_user_id together
                    const author_ID = userData.id;
                    // grab the cg_user_id
                    // console.log(ctx)
                    // then we need make a DB call. so should this not be done here? 
                    localStorage.setItem("user_name", userData.global_name);
                    setStatus("success")
                    setTimeout(() => {
                        navigate("/dashboard")
                    }, 500)
                } else {
                    setStatus("error")
                    setTimeout(() => {
                        navigate("/")
                    }, 500)
                }
                // recieve accessTokenback 
                // store in local storage
                // const accessToken = responseData.accessToken
                // console.log(responseData)
                // setStatus("success")
                // setTimeout(() => {
                //     navigate("/dashboard")
                // }, 500)
            }).catch((_error) => {
                // make this better
                setStatus("error")
                setTimeout(() => {
                    navigate("/")
                }, 500)
            })
        })();
    }, [])


    return (
        <main className="callback_page_content">
            {status === "loading" && <h1 className="loading_state">Connecting to your Discord account...</h1>}
            {status === "error" && <h1 className="error_state"> There was an error connecting to your Discord account. Try again later.</h1>}
            {status === "success" && <h1>Success! Redirecting you to your Dashboard.</h1>}
        </main>
    )

}

export default CallbackPage;