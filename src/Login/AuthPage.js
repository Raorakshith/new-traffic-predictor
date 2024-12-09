import React, { useState } from "react";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AuthForm.css";
import { useNavigate, useNavigation } from "react-router-dom";
import { doc, setDoc, getDoc } from "firebase/firestore"; // Firestore functions


const AuthPage = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState(""); // For signup username

  const navigate = useNavigate();

  const toggleForm = () => setIsSignup((prev) => !prev);
  const validatePassword = (password) => {
    const minLength = 8;
    const specialChar = /[!@#$%^&*(),.?":{}|<>]/;
    const upperCase = /[A-Z]/;
    const number = /[0-9]/;

    if (password.length < minLength) {
      return "Password must be at least 8 characters long.";
    }
    if (!specialChar.test(password)) {
      return "Password must contain at least one special character.";
    }
    if (!upperCase.test(password)) {
      return "Password must contain at least one uppercase letter.";
    }
    if (!number.test(password)) {
      return "Password must contain at least one numerical value.";
    }
    return null;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const validationError = validatePassword(password);
    if (validationError) {
      toast.error(validationError);
      setLoading(false);
      return;
    }
    try {
      if (isSignup) {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        const userRef = doc(db, "TrafficXUsers", user.uid);
        await setDoc(userRef, {
          email,
          username,
          userType: "user", // Default userType
        });
        navigate('/dashboard')
        toast.success("Signup successful!");
      } else {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        // Fetch user details from Firestore
        const userRef = doc(db, "TrafficXUsers", user.uid);
        console.log('docdetail', user.uid)
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          // Store user data in localStorage
          localStorage.setItem("user", JSON.stringify(userData));
          toast.success("Login successful!");
          navigate("/dashboard");
        } else {
          toast.error("User data not found!");
        }
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
          {isSignup && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{ width: "90%" }}
            />
          )}
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
