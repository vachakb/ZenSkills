import { ButtonGroup, ToggleButton } from "react-bootstrap";
import ProfileCard from "../components/ProfileCard";
import UserInfo from "../components/UserInfo";
import { useState } from "react";
import Statistics from "../components/Statistics";
import AvailableSessions from "../components/AvailableSessions";
import { DateTime } from "luxon";

const profile = {
  isMentor: true,
  name: "Mentor 1",
  bio: "As a Senior Software Engineer with over 8 years of experience, I’m passionate about guiding aspiring developers in full-stack web development, cloud computing, and career...",
  rating: 4.9,
  occupation: "Senior Software Engineer at XYZ Corp",
  expertise: ["Web Dev", "React", "Bootstrap"],
  workExperiences: [
    {
      title: "Business Development",
      from: DateTime.fromObject({ year: 2022, month: 6 }),
      to: DateTime.fromObject({ year: 2024, month: 8 }),
    },
    {
      title: "UX/UI Designer",
      from: DateTime.fromObject({ year: 2024, month: 8 }),
      to: null,
    },
  ],
};

function MenteeExploring() {
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

            {radioValue === "2" && <div>Milestones Content Coming Soon!</div>}
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
            {/* TODO mentor statistics */}
            <Statistics />
            <AvailableSessions />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MenteeExploring;
