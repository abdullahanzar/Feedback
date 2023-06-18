import React, { useContext } from "react";
import { FeedbackContext } from "../../../FeedbackContext";
import Avatar from "./Avatar.png";
import "./Navbar.css";

export default function Navbar() {
  const { isLoggedIn } = useContext(FeedbackContext);
  return (
    <div className="navbar">
      <p>Feedback</p>
      {!isLoggedIn ? (
        <>
          <button>Log in</button>
          <button>Sign Up</button>
        </>
      ) : (
        <>
          <button style={{ left: "84%" }}>Log Out</button>
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
