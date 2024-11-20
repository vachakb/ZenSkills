import { matchRoutes, Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header";
import SideBar from "../components/SideBar";
import { useState } from "react";
import classNames from "classnames";

const excludedRoutes = [
  { path: "/login" },
  { path: "/register" },
  { path: "/register/1" },
  { path: "/register/2" },
  { path: "/register/3" },
  { path: "/meeting" },
  { path: "/meeting/" },
  { path: "/meeting/:meetingId" },
];

function App() {
  const location = useLocation();

  const [showSideBar, setShowSideBar] = useState(false);

  const toggleSideBar = () => setShowSideBar(prevShowSideBar => !prevShowSideBar);

  return (
    <>
      {matchRoutes(excludedRoutes, location) ? null : <Header onToggleSideBar={toggleSideBar} />}
      <div className="d-flex flex-grow-1">
        {matchRoutes(excludedRoutes, location) ? null : <SideBar show={showSideBar} />}
        <div
          style={{ overflowY: "auto", overflowX: "hidden" }}
          className={classNames({
            "flex-grow-1 position-relative": true,
            "p-3": !matchRoutes(excludedRoutes, location),
          })}
        >
          <div className="position-absolute w-100">
          <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
