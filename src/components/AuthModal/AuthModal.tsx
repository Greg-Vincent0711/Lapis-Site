import "../../App.css";
import useAuth from "../../context/useAuth";
import "./AuthModal.css";
import type { FormEvent } from "react";
import { useState, useEffect } from "react";

export default function Login( {showLogin, toggle}: {showLogin: boolean, toggle: () => void} ) {
  const [isSignUp, setIsSignUp] = useState(false);
  
  const [error, setError] = useState("");
  const [modalData, setModalData] = useState({
    name: "",
    email: "",
    password: ""
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

  const updateLoginData = (field: "email" | "password" | "name", value: string) => {
    setModalData((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  /**
   * check if we're using isSignUp or not, switch the function called
   * validate the name, email and password
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();    
    setError("");
    const emailValid = validateEmail(modalData.email);
    const passwordValid = validatePassword(modalData.password)

    // somewhere check if a user is already signed up
    if(emailValid && passwordValid){
      if(isSignUp){
        if(validateName(modalData.name)){
          try{
            await userSignUp(modalData.name, modalData.email, modalData.password);
            // if this works, we need to confirm the signin
            // for that to work, we need to make it so that the auth fn called returns something

            toggle();
          // catch error if signUp fails
          } catch(error){
            setError("There was an error during signup.");
          }
        } else{
          // error state stating that name is invalid
          setError("The name you attempted to sign up with is invalid.");
        }
      } else{
        try{
          // signIn
          await userSignIn(modalData.email, modalData.password);
          toggle();
        } catch(error){
          setError("There was an error during signin.");
        }
      }
    }
    // render an error if a combo of email and password is invalid
    else{
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
          
          {error && <div className="error_message">{error}</div>}
          
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
        </form>
      </main>
    )
  )
}