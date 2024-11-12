import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import '../styles/style.css'
import '../styles/custom.scss'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Upcoming from './Upcoming.jsx'
import Register from './Register.jsx'
import Login from './Login.jsx'

const router = createBrowserRouter([
  {
    path:'/',
    element: <App/>,
    children: [
      {
        path:'upcoming',
        element: <Upcoming/>
      },
      {
        path:'register',
        element: <Register/>
      },
      {
        path: 'login',
        element: <Login />
      }
    ]
  }
]);

createRoot(document.getElementById('root')).render(

  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
