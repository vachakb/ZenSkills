import { Outlet, useLocation } from 'react-router-dom'
import Header from '../components/Header'

function App() {

const path = useLocation().pathname;
  return (
    <>
      {path == "/register" ? null: <Header/>}
      <div className={path == "/register" ? '' : 'p-3'}>
      <Outlet />
      </div>
    </>

  )
}

export default App
