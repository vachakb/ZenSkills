import { ButtonGroup, ToggleButton } from "react-bootstrap";
import ProfileCard from "../components/ProfileCard";
import UserInfo from "../components/UserInfo";
import { useState } from "react";
import Statistics from "../components/Statistics";
import Achievements from "../components/Achievements";

const profile = {
  isMentor: false,
  name: "Mentee 1",
  occupation: "Student at XYZ University",
  interests: ["Web Dev", "React", "Bootstrap"]
}

function MenteeProfile() {
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
          <div className="pt-0 mt-0" style={{ width: "100%", borderBottom: "1px solid grey" }}>
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
            {radioValue === "1" && <UserInfo />}
           
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
            <Statistics />
            <Achievements />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MenteeProfile;
