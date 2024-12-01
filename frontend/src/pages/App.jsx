import { Outlet, useLocation } from "react-router-dom"; // Import only useLocation
import Header from "../components/Header";
import SideBar from "../components/SideBar";
import { useState } from "react";
import classNames from "classnames";
import userContext from "../components/userContext";
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

function Layout({ children }) {
  const location = useLocation();

  // Check if the current route matches any excluded route
  const isExcluded = excludedRoutes.some((route) =>
    location.pathname.match(route.path)
  );

  const [showSideBar, setShowSideBar] = useState(false);

  const toggleSideBar = () => setShowSideBar((prev) => !prev);

  // Conditionally render Header and SideBar based on the route
  return (
    <userContext.Provider>
      {!isExcluded && <Header onToggleSideBar={toggleSideBar} />}

      <div className="d-flex flex-grow-1">
        {!isExcluded && <SideBar show={showSideBar} />}

        <div
          style={{ overflowY: "auto", overflowX: "hidden" }}
          className={classNames({
            "flex-grow-1 position-relative": true,
            "p-3": !isExcluded,
          })}
        >
          <div className="position-absolute w-100">
            {/* Content for the page will go here, likely rendered using an <Outlet /> in your routing */}
            {children}
          </div>
        </div>
      </div>
    </userContext.Provider>
  );
}

function App() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

export default App;
