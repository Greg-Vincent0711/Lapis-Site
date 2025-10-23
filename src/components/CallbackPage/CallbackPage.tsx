/**
 * TODO
 * - make the animations, error states, loading states look better
 */
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import "./CallbackPage.css"

export const CallbackPage = () => {
    const [status, setStatus] = useState("loading")
    const [searchParams, _] = useSearchParams();
    // on load, grab the code from the URL
    // send code to the backend
    // wait for response
    // if true, redirect to dashboard
    // if false, show error
    useEffect(() => {
        async () => {
            const authCode = searchParams.get("code");
            // switch to the API
            fetch('http://localhost:5000/api/auth/discord/callback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', // Important - this allows cookies
                body: JSON.stringify({ authCode })
            })
        }
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