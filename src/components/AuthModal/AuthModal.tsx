import { confirmSignUp } from "@aws-amplify/auth";
import useAuth from "../../context/useAuth";
import "./AuthModal.css";
import type { FormEvent } from "react";
import { useState, useEffect } from "react";

export default function Login( {showLogin, toggle}: {showLogin: boolean, toggle: () => void} ) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [confirmEmail, setConfirmEmail] = useState(false);
  const [modalData, setModalData] = useState({
    name: "",
    email: "",
    password: "",
    confirmationCode: ""
  });
  const {isLoading, userSignIn, userSignUp} = useAuth();
  
  useEffect(() => { 
    if(error !== ""){
      const timer = setTimeout(() => {
        setError("")
      }, 3000);
      return () => clearTimeout(timer)
    }
  }, [error])

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // one lowercase, one uppercase, one number, 8-20 characters
  const validatePassword = (password: string) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,20}$/.test(password);
  }
  
  const validateName = (name: string) => {
    return /^[A-Za-z\s'-]{1,20}$/.test(name.trim());
  };

  const updateLoginData = (field: "email" | "password" | "name" | "confirmationCode", value: string) => {
    setModalData((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();    
    setError("");    

    if (confirmEmail) {
      try {
        const { nextStep } = await confirmSignUp({
          username: modalData.email,
          confirmationCode: modalData.confirmationCode
        });
        if (nextStep.signUpStep === "DONE") {
          setConfirmEmail(false);
          toggle();
        } else {
          setError("Email confirmation incomplete. Please try again.");
        }
      } catch (error) {
        setError("Invalid confirmation code. Please try again.");
      }
      return;
    }
  
    const emailValid = validateEmail(modalData.email);
    const passwordValid = validatePassword(modalData.password);
  
    if (emailValid && passwordValid) {
      if (isSignUp) {
        if (validateName(modalData.name)) {
          try {
            const { nextStep } = await userSignUp(modalData.name, modalData.email, modalData.password);
            
            if (nextStep.signUpStep === "CONFIRM_SIGN_UP") {
              // Just show the confirmation form, don't call confirmSignUp yet
              setConfirmEmail(true);
            } else if (nextStep.signUpStep === "DONE") {
              // Sign up completed without confirmation needed
              toggle();
            }
          } catch (error) {
            console.log(error)
            setError("There was an error during signup.");
          }
        } else {
          setError("The name you attempted to sign up with is invalid.");
        }
      } else {
        try {
          await userSignIn(modalData.email, modalData.password);
          /** Check if the user is connected to discord */
          toggle();
        } catch (error) {
          setError("There was an error during signin.");
        }
      }
    } else {
      setError(
        !emailValid && !passwordValid
          ? "Invalid email & password."
          : !emailValid
          ? "Invalid email."
          : !passwordValid
          ? "Invalid password."
          : ""
      );      
    }
  };

  return (
    showLogin && (
      // clicking off the overlay disables
      <main className="overlay" onClick={toggle}>
        <form className="modal_form" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
          
          {confirmEmail ? (
            <>
              <h2 className="modal_title">Confirm Your Email</h2>
              <p style={{ color: 'rgba(255, 255, 255, 0.9)', textAlign: 'center' }}>
                Please enter the confirmation code sent to your email
              </p>
              <input 
                placeholder="Confirmation Code" 
                type="text"
                value={modalData.confirmationCode || ''}
                onChange={(e) => updateLoginData("confirmationCode", e.target.value)}
                required
              />
              {error && <p className="error_message">{error}</p>}
              <button 
                type="submit" 
                className="submit_button" 
                disabled={isLoading}
              >
                {isLoading ? "Verifying..." : "Confirm Email"}
              </button>
            </>
          ) : (
            // Regular sign in/up view
            <>
              <h2 className="modal_title">{isSignUp ? "Create an Account" : "Welcome Back"}</h2>
              <input 
                placeholder="Email" 
                type="email"
                value={modalData.email} 
                onChange={(e) => updateLoginData("email", e.target.value)}
                required
              />
              <input 
                placeholder="Password" 
                type="password" 
                value={modalData.password} 
                onChange={(e) => updateLoginData("password", e.target.value)}
                required
              />
              {isSignUp && (
                <input 
                  placeholder="Name" 
                  value={modalData.name} 
                  onChange={(e) => updateLoginData("name", e.target.value)}
                  required
                />
              )}
              
              {error && <p className="error_message">{error}</p>}
              
              <button 
                type="submit" 
                className="submit_button" 
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
              </button>
              
              <div className="sign_in">
                {isSignUp ? "Already have an account?" : "Don't have an account?"}
                <button type="button" onClick={() => setIsSignUp(!isSignUp)}>
                  {isSignUp ? "Sign In" : "Sign Up"}
                </button>
              </div>
            </>
          )}
          
        </form>
      </main>
    )
  )
}