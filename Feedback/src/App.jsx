import { lazy, Suspense, useState } from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import "./App.css";
import { FeedbackContext } from "./FeedbackContext";
const WebHomePage = lazy(() => import("./WebView/HomePage/WebHomePage.jsx"));
import MVHomePage from "./MobileView/HomePage/MVHomePage";

function App() {
  const isMobile = checkMobile();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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
