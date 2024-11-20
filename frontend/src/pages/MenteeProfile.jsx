import { ButtonGroup, ToggleButton } from "react-bootstrap";
import ProfileCard from "../components/ProfileCard";
import UserInfo from "../components/UserInfo";
import { useState, useEffect } from "react";
import Statistics from "../components/Statistics";
import Achievements from "../components/Achievements";

import axios from "axios";
import { useParams } from "react-router-dom";

import Milestones from "../components/Milestones";


const profile = {
  isMentor: false,
  name: "Mentee 1",
  bio: "As a final-year Computer Science student at ABC University, I'm eager to expand my skills and transition into the tech industry. I have a solid foundation in Java, Python, and web...",
  occupation: "Student at XYZ University",
  interests: ["Web Dev", "React", "Bootstrap"]
}
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

function MenteeProfile() {
  const { menteeId } = useParams();
  const [radioValue, setRadioValue] = useState("1");
  const [profile, setProfile] = useState({
    bio: "",
    name: "",
    occupation: "",
    title: "",
    interests: [],
    isMentor: false,
  });
  const radios = [
    { name: "Overview", value: "1" },
    { name: "Milestones", value: "2" },
  ];

  // Fetch profile data from backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // const menteeId = "mentee-1-id";
        const response = await axios.get(
          `http://localhost:5000/api/mentee/${menteeId}`
        );
        setProfile(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, []);

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

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Main Content */}
        <div className="col-lg-8 col-md-12 mb-4">
          <ProfileCard profile={profile} />
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
            {radioValue === "1" && <UserInfo profile={profile} />}
            {radioValue === "2" && <Milestones data={timelineData}/> }
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-lg-4 col-md-12">
          <div
            className="d-flex flex-column"
            style={{
              gap: "30px",
              marginTop: "30px",
            }}
          >
            <Statistics />
            <Achievements />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MenteeProfile;
