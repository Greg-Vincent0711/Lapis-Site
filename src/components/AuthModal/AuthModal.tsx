/**
 * Login button + form 
 */
import "../../App.css";
import type { FormEvent } from "react";
import { useState } from "react";
export default function Login( {showLogin, toggle}: {showLogin: boolean, toggle: () => void} ) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginData, setLoginData] = useState({
    name: "",
    email: "",
    password: ""
  });
  
  const validateEmail = (email: string) => {
    // basic email validation, think of any random email address
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  /**
   * one lowercase, one uppercase, one digit, min of 8 characters, max of 20s
   */
  const validatePassword = (password: string) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,20}$/.test(password)
  }

  const updateLoginData = (field: "email" | "password" | "name", value: string) => {
    setLoginData((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  // validate email and password
  // call auth sign in
  // show the user that we signed in
  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();    
    setIsLoading(true);
  };

  const handleSignUp = async (e: FormEvent) => {

  }

  return (
    showLogin && (
      <div>
        <form >
          <input placeholder="Email" value={loginData.email} onChange={(e) => updateLoginData("email", e.target.value)}/>
          <input placeholder="Password" type="password" value={loginData.password} onChange={(e) => updateLoginData("password", e.target.value)}/>
          {isSignUp && <input placeholder="name" value={loginData.name} onChange={(e) => updateLoginData("name", e.target.value)}/>}
          {/** On hover, highlight one of these two */}
          <button onClick={() => setIsSignUp(!isSignUp)}>Sign In</button> / <button onClick={() => setIsSignUp(!isSignUp)}>Sign Up</button>
        </form>
      </div>
    )
  )
}
