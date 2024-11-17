import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header";
import SideBar from "../components/SideBar";
import { useState } from "react";

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
          className={
            excludedRoutes.includes(path) ? "flex-grow-1" : "p-3 flex-grow-1"
          }
        >
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default App;
