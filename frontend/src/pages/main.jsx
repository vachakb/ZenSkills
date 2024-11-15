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
import RegisterUserInfo from './RegisterUserInfo.jsx'
import RegisterProfession from './RegisterProfession.jsx'
import RegisterBio from './RegisterBio.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';
import MenteeWelcome from './MenteeWelcome.jsx'

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
      },
      {
        path: 'register/1',
        element: <RegisterUserInfo />
      },
      {
        path: 'register/2',
        element: <RegisterProfession />
      },
      {
        path: 'register/3',
        element: <RegisterBio />
      },
      {
        path:'mentee_welcome',
        element: <MenteeWelcome/>
      }

    ]
  }
]);

createRoot(document.getElementById('root')).render(

  <StrictMode>
    <GoogleOAuthProvider clientId="172493269774-4qr965tabedoqajcv49jpu2btps6sg8v.apps.googleusercontent.com">
    <RouterProvider router={router}/>
      </GoogleOAuthProvider>;
  </StrictMode>,
)
