import { ButtonGroup, Spinner, ToggleButton } from "react-bootstrap";
import ProfileCard from "../components/ProfileCard";
import UserInfo from "../components/UserInfo";
import { useState, useEffect } from "react";
import Statistics from "../components/Statistics";
import AvailableSessions from "../components/AvailableSessions";
import { DateTime } from "luxon";

import axios from "axios";
import { useParams } from "react-router-dom";

import Milestones from "../components/Milestones";
import ReviewsTab from "../components/ReviewsTab";
import ResourcesTab from "../components/Resources";
import { axiosInstance } from "../apis/commons";
import { getMentorProfile } from "../apis/mentors";
import { getAllAvailableSessions } from "../apis/session";




const profile = {
  isMentor: true,
  name: "Mentor 1",
  bio: "As a Senior Software Engineer with over 8 years of experience, I'm passionate about guiding aspiring developers in full-stack web development, cloud computing, and career...",
  rating: 4.9,
  occupation: "Senior Software Engineer at XYZ Corp",
  expertise: ["Web Dev", "React", "Bootstrap"],
  workExperiences: [
    {
      title: "Business Development",
      company: "Meta",
      from: DateTime.fromObject({ year: 2022, month: 6 }),
      to: DateTime.fromObject({ year: 2024, month: 8 }),
    },
    {
      title: "UX/UI Designer",
      company: "Amazon",
      from: DateTime.fromObject({ year: 2024, month: 8 }),
      to: null,
    },
  ],
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

function MenteeExploring() {
  const { mentorId } = useParams();
  const [radioValue, setRadioValue] = useState("1");
  const [profile, setProfile] = useState({
    bio: "",
    name: "",
    occupation: "",
    title: "",
    expertise: [],
    isMentor: true,
    rating: 0,
    workExperiences: [],
  });

  const [sessions, setSessions] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const radios = [
    { name: "Overview", value: "1" },
    { name: "Milestones", value: "2" },
    { name: "Reviews", value: "3" },
    { name: "Resources", value: "4" },
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

  const onLoad = async () => {
    setIsLoading(true);

    try {
      const resMentorProfile = await getMentorProfile(mentorId);
      setProfile({ ...resMentorProfile.data.profile, isMentor: true });
      const resAvailableSessions = await getAllAvailableSessions(mentorId);

      setSessions(resAvailableSessions.data.sessions);

    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    onLoad();
  }, []);

  if (isLoading) {
    return (
      <div className="d-flex h-100 w-100 justify-content-center align-items-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Main Content */}
        <div
          className=" col-lg-8 col-md-12 mb-4"
        >
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
          <div className="mt-3" style={{ width: "100%" }}>
            {radioValue === "1" && <UserInfo profile={profile} />}
            {radioValue === "2" && <Milestones data={timelineData} />}
            {radioValue === "3" && <ReviewsTab mentorId={mentorId} />}
            {radioValue === "4" && <ResourcesTab />}
          </div>
        </div>

        {/* Sidebar */}
        <div
          className="col-lg-4 col-md-12"

        >
          <div
            className="d-flex flex-column"
            style={{
              gap: "30px",
              marginTop: "30px",

            }}
          >
            <Statistics />
            <AvailableSessions sessions={sessions} />
          </div>
        </div>
      </div>
    </div >
  );
}

export default MenteeExploring;
