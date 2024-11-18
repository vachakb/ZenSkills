import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../styles/style.css";
import "../styles/custom.scss";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Upcoming from "./Upcoming.jsx";
import Register from "./Register.jsx";
import Login from "./Login.jsx";
import RegisterUserInfo from "./RegisterUserInfo.jsx";
import RegisterProfession from "./RegisterProfession.jsx";
import RegisterBio from "./RegisterBio.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import MenteeWelcome from "./MenteeWelcome.jsx";
import MentorWelcome from "./MentorWelcome.jsx";
import ExploreMentor from "./ExloreMentors.jsx";

import VerifyEmail from "./VerifyEmail.jsx";

import UserInfo from "../components/UserInfo.jsx";
import ProfileCard from "../components/ProfileCard.jsx";
import MenteeProfile from "./MenteeProfile.jsx";
import MenteeExploring from "./MenteeExploring.jsx";
import Milestone from "../components/Milestones.jsx";
import JobList from "./Jobs.jsx";
import Workshops from "./Workshop.jsx";


const mentor = {
  id: "id",
  name: "mentor",
  rating: 4.5,
  currentPost: "Test Architecture manager at Align",
  noOfSessions: 19,
  noOfReviews: 4,
  Experience: 23,
  creditScore: 95
}
const eventdetails={
  name:"Bergen International Film Festival",
  desc:" Films from all over the world gather all film enthusiasts for unique moments at the Bergen International Film Festival.",
  date: "28/11",
  time: "17:00"


};


const demoTags = [
  "Technology",
  "IT",
  "Computer",
  "Engineering",
  "Blockchain",
  "Gaming",
  "Education",
  "Web Development",
];

const mentors = Array(12).fill(mentor);
const events = Array(6).fill(eventdetails);

const timelineData = [
  {
    date: "May 2001",
    category: "The origin",
    title: "Acme was founded in Milan, Italy",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut pharetra pharetra massa.",
  },
  {
    date: "May 2007",
    category: "The milestone",
    title: "Reached 5K customers",
    description:
      "Praesent eu neque aliquam vestibulum morbi blandit cursus risus at ultrices.",
  },
  {
    date: "May 2012",
    category: "The acquisition",
    title: "Acquired various companies, including Technology Inc.",
    description:
      "Pellentesque habitant morbi tristique senectus et netus et malesuada.",
  },
  {
    date: "May 2022",
    category: "The IPO",
    title: "Went public at the New York Stock Exchange",
    description:
      "Adipiscing enim eu neque aliquam vestibulum morbi blandit cursus risus.",
  },
];


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "upcoming",
        element: <Upcoming />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register/1",
        element: <RegisterUserInfo />,
      },
      {
        path: "register/2",
        element: <RegisterProfession />,
      },
      {
        path: "register/3",
        element: <RegisterBio />,
      },
      {
        path: "mentee_welcome",
        element: <MenteeWelcome mentors_={mentors} events_={events} />,
      },
      {
        path: "mentor_welcome",
        element: <MentorWelcome />,
      },
      {
        path: "explore",
        // element: <ExploreMentor/>
        element: <ExploreMentor mentors_={mentors} demoTags={demoTags} />,
        // this array is just passed for test/preview
      },
      {
        path: "verify-email",
        element: <VerifyEmail />,
      },
      {
        path: "mentee_profile",
        element: <MenteeProfile/>
      },
      {
        path: "profilecard",
        element: <ProfileCard/>
      },
      {
        path: "mentee_exploring",
        element: <MenteeExploring />
      },
      {
        path: "milestone",
        element: <Milestone data={timelineData}/>
      },
      {
        path: "jobs",
        element: <JobList />
      },
      {
        path: "workshops",
        element: <Workshops/>
      }
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="172493269774-4qr965tabedoqajcv49jpu2btps6sg8v.apps.googleusercontent.com">
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  </StrictMode>
);
