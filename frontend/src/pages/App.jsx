import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header";
import SideBar from "../components/SideBar";

const excludedRoutes = [
  "/login",
  "/register",
  "/register/1",
  "/register/2",
  "/register/3",
];

function App() {
  const path = useLocation().pathname;
  return (
    <>
      {excludedRoutes.includes(path) ? null : <Header />}
      <div className="d-flex flex-grow-1">
        {excludedRoutes.includes(path) ? null : <SideBar />}
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
