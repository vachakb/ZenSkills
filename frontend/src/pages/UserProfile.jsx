import { ButtonGroup, Spinner, ToggleButton } from "react-bootstrap";
import ProfileCard from "../components/ProfileCard";
import UserInfo from "../components/UserInfo";
import { useState } from "react";
import Statistics from "../components/Statistics";
import Achievements from "../components/Achievements";
import { useLocation } from "react-router-dom";
import Milestones from "../components/Milestones";
import MenteeSessions from "../components/MenteeSessions";
import useProfile from "../hooks/useProfile"
import { Form, Formik } from "formik";

const profile = {
  isMentor: false,
  name: "Mentee 1",
  bio: "As a final-year Computer Science student at ABC University, I'm eager to expand my skills and transition into the tech industry. I have a solid foundation in Java, Python, and web...",
  occupation: "Student at XYZ University",
  interests: ["Web Dev", "React", "Bootstrap"],
};
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

function UserProfile() {
  const isEditing = useLocation().state?.isEditing??false;
  
  const [radioValue, setRadioValue] = useState("1");
  
  const radios = [
    { name: "Overview", value: "1" },
    { name: "Milestones", value: "2" },
  ];

  const getButtonStyle = (value) => {
    if (radioValue === value) {
      return {
        color: "green",
        border: "none",
        borderBottom: "2px solid green",
        backgroundColor: "white",
      };
    }
    return {
      color: "black",
      border: "none",
      borderBottom: "none",
      backgroundColor: "white",
    };
  };

  const { profile, isProfileLoading } = useProfile();

  if (isProfileLoading) {
    return (
      <div className="d-flex h-100 w-100 justify-content-center align-items-center">
        <Spinner />
      </div>
    );
  }

  return (
    <Formik initialValues={{
      name: profile.name,
      title: profile.isMentor ? profile.mentor.mentor_job_title : profile?.mentee?.mentee_title,
      occupation: profile.isMentor ? profile.mentor.company : profile.mentee.company,
      skills: profile.isMentor ? profile.mentor.expertise : profile.mentee.interests,
      bio: profile.isMentor ? profile.mentor.bio : profile.mentee.bio,
    }}
    onSubmit={data => console.log(data)}>
    {(formikProps) => (
    <Form noValidate className="container-fluid" onSubmit={formikProps.handleSubmit}>
      <div className="row" style={{ display: "flex" }}>
        {/* Main Content */}
        <div
          className="col-lg"
          style={{
            flex: "1",
            marginRight: "10px",

          }}
        >
          <ProfileCard profile={profile} isCurrentUser= {true} isEditing={isEditing} formikProps={formikProps}/>
          <div
            className="pt-0 mt-0"
            style={{ width: "100%", borderBottom: "1px solid grey" }}
          >
            <ButtonGroup className="d-flex flex-row justify-content-start">
              {radios.map((radio, idx) => (
                <ToggleButton
                  key={idx}
                  id={`radio-${idx}`}
                  type="radio"
                  variant="light"
                  name="radio"
                  value={radio.value}
                  checked={radioValue === radio.value}
                  onChange={(e) => setRadioValue(e.currentTarget.value)}
                  style={getButtonStyle(radio.value)}
                >
                  {radio.name}
                </ToggleButton>
              ))}
            </ButtonGroup>
          </div>
          <div className="mt-3">
            {radioValue === "1" && <UserInfo profile={profile} isEditing={isEditing} formikProps={formikProps} />}
            {radioValue === "2" && <Milestones data={timelineData}/> }

          </div>
        </div>

        {/* Sidebar */}
        <div
          className="col-lg-auto"
          style={{
            flex: "0 0 50%", // Sidebar width is 22% of the parent container
            maxWidth: "500px",
            marginRight:'30px' // Optional max width for sidebar
          }}
        >
          <div
            className="d-flex flex-column"
            style={{
              gap: "30px",
              marginTop: "30px",
            }}
          >
            <Statistics />
            <MenteeSessions />
            <Achievements />
          </div>
        </div>
      </div>
    </Form>
    )}
    </Formik>
  );
}

export default UserProfile;
