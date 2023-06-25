import { lazy, Suspense, useEffect, useState } from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import "./App.css";
import { FeedbackContext } from "./FeedbackContext";
const WebHomePage = lazy(() => import("./WebView/HomePage/WebHomePage.jsx"));
const WebSignUpPage = lazy(() =>
  import("./WebView/Sign Up Page/WebSignUpPage.jsx")
);
import MVHomePage from "./MobileView/HomePage/MVHomePage";
import axios from "axios";

function App() {
  const isMobile = checkMobile();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    if (localStorage.getItem("token") == null) return setIsLoggedIn(false);
    const check = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.post(
          "https://feedback-d89u.onrender.com/verify-token",
          {},
          {
            headers: {
              "content-type": "application/x-www-form-urlencoded",
              token: token,
            },
          }
        );
        if (!response.data.error) setIsLoggedIn(true);
      } catch (e) {
        console.log(e);
      }
    };
    check();
  }, []);
  return (
    <FeedbackContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {isMobile ? (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MVHomePage />} />
          </Routes>
        </BrowserRouter>
      ) : (
        <Suspense fallback={<div>Loading...</div>}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<WebHomePage />} />
              <Route path="/sign" element={<WebSignUpPage />} />
            </Routes>
          </BrowserRouter>
        </Suspense>
      )}
    </FeedbackContext.Provider>
  );
}

function checkMobile() {
  if (
    window.navigator.userAgent.includes("Windows") ||
    window.navigator.userAgent.includes("Mac")
  )
    return false;
  else return true;
}

export default App;
