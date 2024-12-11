import { ButtonGroup, Spinner, ToggleButton } from "react-bootstrap";
import ProfileCard from "../components/ProfileCard";
import UserInfo from "../components/UserInfo";
import { useState, useEffect } from "react";
import Statistics from "../components/Statistics";
import Achievements from "../components/Achievements";
import Milestones from "../components/Milestones";
import MenteeSessions from "../components/MenteeSessions";
import useProfile from "../hooks/useProfile";
import { Form, Formik } from "formik";
import { getAllAvailableSessions } from "../apis/session";
import { editUserProfile } from "../apis/user";
import { uploadImage } from "../apis/commons";

function UserProfile({ _isEditing }) {
  const [isEditing, setIsEditing] = useState(_isEditing);

  const [radioValue, setRadioValue] = useState("1");
  const [sessions, setSessions] = useState([]); // Initialize sessions state
  const [isLoading, setIsLoading] = useState(false); // Initialize loading state

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

  const { profile, isProfileLoading, refetchProfile } = useProfile();

  const onLoad = async () => {
    setIsLoading(true);
    try {
      const mentorId = profile?.mentor.id;

      const resAvailableSessions = await getAllAvailableSessions(mentorId);

      setSessions(resAvailableSessions.data.sessions);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (profile) {
      onLoad();
    }
  }, [profile]);

  if (isProfileLoading || isLoading) {
    return (
      <div className="d-flex h-100 w-100 justify-content-center align-items-center">
        <Spinner />
      </div>
    );
  }

  return (
    <Formik
      initialValues={{
        name: profile.name,
        title: profile.isMentor
          ? profile.mentor.mentor_job_title
          : profile?.mentee?.mentee_title,
        occupation: profile.isMentor
          ? profile.mentor.company
          : profile.mentee.company,
        skills: profile.isMentor
          ? profile.mentor.expertise
          : profile.mentee.interests,
        bio: profile.isMentor ? profile.mentor.bio : profile.mentee.bio,
        profilePicture: null,
        profilePictureId: null,
      }}
      onSubmit={async (data) =>  {
        try {
          if (data.profilePicture) {
            const uploadRes = await uploadImage(data.profilePicture);
            console.log(uploadRes)
            data.profilePictureId = uploadRes.data.image.id;
          }
          delete data.profilePicture;
          await editUserProfile(data)
          refetchProfile();
          setIsEditing(false);
        } catch ( err ) {
          console.error(err)
        }
      }}
    >
      {(formikProps) => (
        <Form
          noValidate
          className="container-fluid"
          onSubmit={formikProps.handleSubmit}
        >
          <div className="row" style={{ display: "flex" }}>
            {/* Main Content */}
            <div className="col-lg" style={{ flex: "1", marginRight: "10px" }}>
              <ProfileCard
                profile={profile}
                isCurrentUser={true}
                isEditing={isEditing}
                formikProps={formikProps}
              />
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
                {radioValue === "1" && (
                  <UserInfo
                    profile={profile}
                    isEditing={isEditing}
                    formikProps={formikProps}
                  />
                )}
                {radioValue === "2" && <Milestones data={timelineData} />}
              </div>
            </div>

            {/* Sidebar */}
            <div
              className="col-lg-auto"
              style={{
                flex: "0 0 50%",
                maxWidth: "500px",
                marginRight: "30px",
              }}
            >
              <div
                className="d-flex flex-column"
                style={{ gap: "30px", marginTop: "30px" }}
              >
                <Statistics />

                {profile.isMentor && <MenteeSessions sessions={sessions} />}
                {/* Display the fetched sessions */}
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
