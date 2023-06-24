import React, { useContext, useEffect, useState } from "react";
import "./WebSignUpPage.css";
import { useLocation, useNavigate } from "react-router-dom";
import email from "./Components/email.png";
import mobile from "./Components/mobile.png";
import password from "./Components/password.png";
import user from "./Components/user.png";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { FeedbackContext } from "../../FeedbackContext";

export default function WebSignUpPage(props) {
  const location = useLocation();
  const [isSignUp, setIsSignUp] = useState(location.state);
  const [formData, setformData] = useState({});
  const { setIsLoggedIn } = useContext(FeedbackContext);
  const nav = useNavigate();
  useEffect(() => {
    console.log(isSignUp);
  }, [isSignUp]);
  const notify = (message) => toast(message);
  return (
    <div className="sign">
      <div className="feed">
        <p>Feedback</p>
        <p>Add your products and give us your valuable feedback</p>
      </div>
      {isSignUp
        ? signup(setIsSignUp, setformData, formData, notify)
        : login(setIsSignUp, setformData, formData, notify, setIsLoggedIn, nav)}
      <Toaster />
    </div>
  );
}

function signup(setIsSignUp, setFormData, formData, notify) {
  return (
    <div className="signup">
      <form
        action="https://feedback-d89u.onrender.com/register"
        method="post"
        onSubmit={(e) => submitForm(e, formData, notify)}
        onChange={(e) => {
          setFormData({ ...formData, [e.target.name]: e.target.value });
        }}
      >
        <div>
          <label htmlFor="name">
            <img src={user} alt="name" />
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Name"
            required
          />
        </div>
        <div>
          <label htmlFor="email">
            <img src={email} alt="email" />
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            required
          />
        </div>
        <div>
          <label htmlFor="mobile">
            <img src={mobile} alt="mobile" />
          </label>
          <input
            type="tel"
            id="mobile"
            name="mobile"
            placeholder="Mobile"
            required
          />
        </div>
        <div>
          <label htmlFor="password">
            <img src={password} alt="password" />
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            required
          />
        </div>
        <p className="signtext">
          Already have an account?&nbsp;
          <span
            style={{
              color: "#36416A",
              textDecorationLine: "underline",
              cursor: "pointer",
            }}
            onClick={() => setIsSignUp(false)}
          >
            Log in
          </span>
        </p>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

function login(setIsSignUp, setformData, formData, notify, setIsLoggedIn, nav) {
  return (
    <div className="signup">
      <form
        className="login"
        onChange={(e) => {
          setformData({ ...formData, [e.target.name]: e.target.value });
        }}
        onSubmit={(e) => {
          LogIn(e, formData, notify, setIsLoggedIn, nav);
        }}
        method="post"
        action="https://feedback-d89u.onrender.com/login"
      >
        <div>
          <label htmlFor="email">
            <img src={email} alt="email" />
          </label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            required
          />
        </div>
        <div>
          <label htmlFor="password" name="password" id="password">
            <img src={password} alt="password" />
          </label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            required
          />
        </div>
        <p className="signtext">
          Don't have an account?{" "}
          <span
            style={{
              color: "#36416A",
              textDecorationLine: "underline",
              cursor: "pointer",
            }}
            onClick={() => setIsSignUp(true)}
          >
            Sign Up
          </span>
        </p>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

async function submitForm(e, formData, notify) {
  e.preventDefault();
  try {
    const response = await axios.post(
      "https://feedback-d89u.onrender.com/register",
      formData,
      {
        headers: {
          "content-type": "application/x-www-form-urlencoded",
        },
      }
    );
    console.log(response);
    if (response.data.error) notify(String(response.data.error));
    else notify(String(response.data.Success));
  } catch (e) {
    console.log(e);
  }
}

async function LogIn(e, formData, notify, setIsLoggedIn, nav) {
  e.preventDefault();
  try {
    const response = await axios.post(
      "https://feedback-d89u.onrender.com/login",
      formData,
      {
        headers: {
          "content-type": "application/x-www-form-urlencoded",
        },
      }
    );
    if (response.data.error)
      notify(String(response.data.error) + "\n Wrong Email/Password");
    else {
      localStorage.setItem("token", response.data.token);
      setIsLoggedIn(true);
      nav("/");
    }
  } catch (e) {
    console.log(e);
  }
}
