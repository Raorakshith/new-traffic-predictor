import React, { useState } from "react";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AuthForm.css";
import { useNavigate, useNavigation } from "react-router-dom";

const AuthPage = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const toggleForm = () => setIsSignup((prev) => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
        navigate('/dashboard')
        toast.success("Signup successful!");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        navigate('/dashboard')
        toast.success("Login successful!");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="auth-container">
      <ToastContainer />
      <div className="auth-left">
        <h1>Welcome to TraffiX</h1>
        <p>Analyze and predict traffic patterns with the power of AI.</p>
      </div>
      <div className="auth-right">
        <form onSubmit={handleSubmit} className="auth-form">
          <h2>{isSignup ? "Sign Up" : "Login"}</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{width:"90%"}}
          />
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="password-toggle"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Processing..." : isSignup ? "Sign Up" : "Login"}
          </button>
          <p onClick={toggleForm} className="toggle-text">
            {isSignup
              ? "Already have an account? Login"
              : "Don't have an account? Sign Up"}
          </p>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
