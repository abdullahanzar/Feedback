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
    <div className="MV_navbar">
      <p>Feedback</p>
      {!isLoggedIn ? (
        <div>
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
        </div>
      ) : (
        <div className="lgInBt">
          <button
            style={{ left: "84%" }}
            onClick={() => {
              setIsLoggedIn(false);
              localStorage.removeItem("token");
            }}
          >
            Log Out
          </button>
          <>
            <img src={Avatar} alt="AVATAR" />
          </>
        </div>
      )}
    </div>
  );
}
