import { lazy, Suspense, useEffect, useState } from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import "./App.css";
import { FeedbackContext } from "./FeedbackContext";
const WebHomePage = lazy(() => import("./WebView/HomePage/WebHomePage.jsx"));
const WebSignUpPage = lazy(() => import("./WebView/Sign Up Page/WebSignUpPage.jsx"))
import MVHomePage from "./MobileView/HomePage/MVHomePage";

function App() {
  const isMobile = checkMobile();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(()=>{
    if(localStorage.getItem('token')==null)
    return setIsLoggedIn(false)
    async()=>{
      const token = localStorage.getItem('token');
      
    }
  }, [])
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
              <Route path="/sign" element={<WebSignUpPage />}/>
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
