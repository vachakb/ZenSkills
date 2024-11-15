import { Outlet, useLocation } from 'react-router-dom'
import Header from '../components/Header'
import SideBar from '../components/SideBar';

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
      {excludedRoutes.includes(path) ? null: <Header/>}
      {excludedRoutes.includes(path) ? null: <SideBar/>}
      <div className={excludedRoutes.includes(path) ? '' : 'p-3'}>
        <Outlet />
      </div>
    </>

  )
}

export default App
