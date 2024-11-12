import { useState } from 'react'
import reactLogo from '../assets/react.svg'
import viteLogo from '../../public/vite.svg'
import { Button } from 'react-bootstrap'
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
