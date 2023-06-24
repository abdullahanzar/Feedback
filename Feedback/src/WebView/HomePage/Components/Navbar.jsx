import React, { useContext, useEffect, useState } from "react";
import { FeedbackContext } from "../../../FeedbackContext";
import Avatar from "./Avatar.png";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { isLoggedIn, setIsLoggedIn } = useContext(FeedbackContext);
  const [isSignUp, setIsSignUp] = useState(null);
  const nav = useNavigate();
  useEffect(() => {
    if (isSignUp !== null) {
      nav("/sign", { state: isSignUp });
    }
  }, [isSignUp]);
  return (
    <div className="navbar">
      <p>Feedback</p>
      {!isLoggedIn ? (
        <>
          <button
            onClick={() => {
              setIsSignUp(false);
            }}
          >
            Log in
          </button>
          <button
            onClick={() => {
              setIsSignUp(true);
            }}
          >
            Sign Up
          </button>
        </>
      ) : (
        <>
          <button
            style={{ left: "84%" }}
            onClick={() => {
              setIsLoggedIn(false);
              localStorage.removeItem("token");
            }}
          >
            Log Out
          </button>
          <button style={{ border: "none", left: "84%", width: "3.5rem" }}>
            Hello!
          </button>
          <>
            <img src={Avatar} alt="AVATAR" />
          </>
        </>
      )}
    </div>
  );
}
