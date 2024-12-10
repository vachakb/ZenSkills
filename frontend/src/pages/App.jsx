import { Outlet, useLocation } from "react-router-dom"; // Import only useLocation
import Header from "../components/Header";
import SideBar from "../components/SideBar";
import { useLayoutEffect, useRef, useState } from "react";
import classNames from "classnames";
import Dashboard from "./Dashboard";

// Define the excluded routes
const excludedRoutes = [
  { path: "/login" },
  { path: "/register" },
  { path: "/register/1" },
  { path: "/register/2" },
  { path: "/register/3" },
  { path: "/verify/callback" },
  { path: "/meeting" },
  { path: "/meeting/" },
  { path: "/meeting/:meetingId" },

];

function App() {
  const location = useLocation();

  const header = useRef(null);

  const [contentHeight, setContentHeight] = useState(0);

  const calculateContentHeight = () => {
    if (header.current) {
      setContentHeight(
        document.documentElement.scrollHeight - header.current.offsetHeight,
      );
    } else {
      setContentHeight(document.documentElement.scrollHeight);
    }
  };

  useLayoutEffect(() => {
    calculateContentHeight()
    window.addEventListener("resize", calculateContentHeight);

    return () => {
      window.removeEventListener("resize", calculateContentHeight);
    };
  }, [location]);

  // Check if the current route matches any excluded route
  const isExcluded = excludedRoutes.some((route) =>
    location.pathname.match(route.path),
  );

  const [showSideBar, setShowSideBar] = useState(false);

  const toggleSideBar = () => setShowSideBar((prev) => !prev);

  // Conditionally render Header and SideBar based on the route
  return (
    <>
      {!isExcluded && (
        <Header onToggleSideBar={toggleSideBar} headerRef={header} />
      )}

      <div className="d-flex flex-grow-1">
        {!isExcluded && <SideBar show={showSideBar} />}

        <div
          style={{
            overflowY: "auto",
            overflowX: "hidden",
            height: contentHeight,
          }}
          className={classNames({
            "flex-grow-1": true,
            "p-3": !isExcluded,
          })}
        >
          {/* Content for the page will go here, likely rendered using an <Outlet /> in your routing */}
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default App;
