import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Button } from 'react-bootstrap'
import { Outlet } from 'react-router-dom'
import Header from './Header'

function App() {


  return (
    <>
      <Header />
      <div className='p-3'>
      <Outlet />
      </div>
    </>

  )
}

export default App
