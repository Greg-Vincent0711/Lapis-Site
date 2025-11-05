/**
 * TODO
 * - make the animations, error states, loading states look better
 */
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./CallbackPage.css";

export const CallbackPage = () => {
    const [status, setStatus] = useState("loading")
    const [searchParams, _] = useSearchParams();
    const navigate = useNavigate();
    const API_ENDPOINT = import.meta.env.VITE_APP_API_ENDPOINT;
    console.log("API ENDPOINT: ", API_ENDPOINT)

    useEffect(() => {
        // send code to the backend, retrieve back accessToken
        (async () => {
            const authCode = searchParams.get("code");
            // switch to the API after updating the backend code
            fetch(`${API_ENDPOINT}/auth/callback`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ authCode })
            }).then((res) => {
                if(res.ok){
                    return res.json()
                } else {
                    console.log('Response not ok!');
                    throw new Error('Request failed');
                }
            }).then((responseData) => {
                // recieve accessTokenback
                // store in local storage
                // const accessToken = responseData.accessToken
                console.log(responseData)
                setStatus("success")
                setTimeout(() => {
                    navigate("/dashboard")
                }, 500)
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
            {status === "success" && <h1>Success! Redirecting you to the Dashboard.</h1>}
        </main>
    )

}

export default CallbackPage;