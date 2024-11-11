import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import './style.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Upcoming from './Upcoming.jsx'
const router = createBrowserRouter([
  {
    path:'/',
    element: <App/>,
    children: [
      {
        path:'upcoming',
        element: <Upcoming/>
      }
    ]
  }
]);

createRoot(document.getElementById('root')).render(

  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
