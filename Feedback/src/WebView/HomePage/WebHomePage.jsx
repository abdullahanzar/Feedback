import React from "react";
import Navbar from "./Components/Navbar";
import "./WebHomePage.css";
import HomeFeed from "./HomeFeed.png";

export default function WebHomePage() {
  return (
    <div className="WebHomePage">
      <Navbar />
      <div className="middle">
        <img src={HomeFeed} alt="Feedback" />
        <p>Add your products and give your valuable feedback</p>
        <p>
          Easily give your feedback in a matter of minutes. Access your audience
          on all platforms. Observe result manually in real time
        </p>
      </div>
    </div>
  );
}
