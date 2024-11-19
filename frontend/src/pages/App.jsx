import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header";
import SideBar from "../components/SideBar";
import { useState } from "react";
import classNames from "classnames";

const excludedRoutes = [
  "/login",
  "/register",
  "/register/1",
  "/register/2",
  "/register/3",
];

function App() {
  const path = useLocation().pathname;

  const [showSideBar, setShowSideBar] = useState(false);

  const toggleSideBar = () => setShowSideBar(prevShowSideBar => !prevShowSideBar);

  return (
    <>
      {excludedRoutes.includes(path) ? null : <Header onToggleSideBar={toggleSideBar} />}
      <div className="d-flex flex-grow-1">
        {excludedRoutes.includes(path) ? null : <SideBar show={showSideBar} />}
        <div
          style={{ overflowY: "auto", overflowX: "hidden" }}
          className={classNames({
            "flex-grow-1 position-relative": true,
            "p-3": !excludedRoutes.includes(path)
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
