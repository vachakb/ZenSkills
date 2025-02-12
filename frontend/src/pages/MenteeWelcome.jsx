import {
  Col,
  Container,
  Row,
  Form,
  Button,
  Card,
  ProgressBar,
  Spinner,
} from "react-bootstrap";
import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { GiHand } from "react-icons/gi";
import { MdKeyboardArrowRight, MdClose } from "react-icons/md";
import { PiPlantFill } from "react-icons/pi";
import { Link } from "react-router-dom";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import { RiCopperCoinLine } from "react-icons/ri";
import EventCard from "../components/Events";
import MentorCard from "../components/MentorCard";
import axios from "axios";
import useProfile from "../hooks/useProfile";
import Calendar from "../components/Calendar";
import { axiosInstance } from "../apis/commons";

const API_URL = "http://localhost:5000";

function MenteeWelcome({ mentors_, events_ }) {
  const [mentors, setMentors] = useState(mentors_);

  const { profile, isProfileLoading } = useProfile();

  const userName = profile?.name || "User";

  const [tasks, setTasks] = useState([
    { label: "Complete your profile", done: true },
    { label: "Book your first session", done: false },
  ]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (isVisible) {
      setIsVisible(!tasks.every((task) => task.done));
    }
  }, [tasks])

  const [events, setEvents] = useState(events_);
  const progress = useMemo(() => {
    let done = 0;
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].done) {
        done++;
      }
    }
    return (done / tasks.length) * 100;
  }, [tasks]);

  const handleClose = () => {
    setIsVisible(false);
  };

  const allCompleted = tasks.every((task) => task.done);

  const profilestatus = "Beginner";

  const navigate = useNavigate();

  // Fetch mentors and events
  useEffect(() => {
    async function fetchData() {
      try {
        const [mentorsResponse, eventsResponse] = await Promise.all([
          axios.post(`${API_URL}/api/mentors/recommendations`),
          // axios.get(`${API_URL}/api/events`),
        ]);
        const fetchedMentors = mentorsResponse.data.mentors;
        setMentors(fetchedMentors && fetchedMentors.length > 0 ? fetchedMentors : mentors_);
        // setEvents(eventsResponse.data.events || []);
      } catch (error) {
        console.error("Error fetching data: ", error);
        setMentors(mentors_);
      }
    }
    fetchData();
  }, []);

  // async function getMentors(){
  //   try{
  //     const responce = await axiosInstance.get("");
  //     if(responce.status===200 || responce.status===201){
  //       console.log("extracted: ", responce.data.mentors)
  //     }
  //   }catch(error){
  //     console.log("error extractibg recommanded mentors: ", error)
  //   }
  // }

  // useEffect(()=>{
  //   setMentors(getMentors())
  // }, [])

  if (isProfileLoading) {
    return (
      <div className="d-flex h-100 w-100 justify-content-center align-items-center">
        <Spinner />
      </div>
    );
  }

  return (
    <Container className="d-flex flex-column gap-4 px-md-4" fluid>
      {/* Greeting Section */}
      <div className="pt-0">
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <h2 className="fw-bold">Hello, {userName}!</h2>
          <GiHand size={"2rem"} color="#ffa426" />
        </div>
        <div>
          {mentors.length === 0 && (
            <h6 style={{ color: "#436DA7" }} className="m-0">
              You have no upcoming sessions.
            </h6>
          )}
        </div>
      </div>

      <Row>
        {/* Main Content Section */}
        <Col md={8} className="d-flex flex-column gap-4">
          {/* Progress Card */}
          {isVisible && (
            <Card className="shadow-sm">
              <Card.Body className="d-flex flex-column gap-3">
                <div className="d-flex">
                  <div className="flex-grow-1">
                    <h3 className="fw-bold">Let's start with the basics</h3>
                    <h6 style={{ color: "#436DA7" }}>
                      Get more by setting up a profile you love.
                    </h6>
                  </div>
                  <div className="d-flex flex-column justify-content-between align-items-end ms-auto">
                    <MdClose style={{ cursor: "pointer" }} onClick={handleClose} />
                    <h6 style={{ color: "#436DA7" }}>{Math.floor(progress)}% completed</h6>
                  </div>
                </div>
                <ProgressBar now={progress} />
                {tasks.map((value, index) => (
                  <Form.Group
                    key={index}
                    className="d-flex align-content-center gap-2"
                  >
                    <Form.Check className="pe-none" checked={value.done} />
                    <Form.Label
                      className={`${value.done ? "text-decoration-line-through" : ""
                        }`}
                      style={{ color: "#037f7d" }}
                    >
                      {value.label}
                    </Form.Label>
                  </Form.Group>
                ))}
              </Card.Body>
            </Card>
          )}

          {/* Mentors Section */}
          <div>
            <h3 className="fw-bold">Recommended Mentors</h3>
            <h6 style={{ color: "#436DA7" }} className="m-0">
              Find the right mentor for your goals—handpicked by our AI, perfectly tailored to your needs!
            </h6>
          </div>
          <div
            className="d-flex flex-wrap justify-content-start flex-row"
            style={{
              maxHeight: "500px",
              columnGap: "70px",
              rowGap: "20px"
            }}
          >
            {mentors.length > 0 ? (
              mentors.map((mentor) => <MentorCard key={mentor.mentor_id} mentor={mentor} width_={250} />)
            ) : (
              <p>No mentors available.</p>
            )}
          </div>

          {/* Events Section */}
          {/* <div>
            <h3 className="fw-bold">Events</h3>
            <h6 style={{ color: "#436DA7" }} className="m-0">
              To help you connect and grow.
            </h6>
          </div>
          <div
            className="d-flex flex-wrap gap-4 justify-content-start"
            style={{ maxWidth: "100%" }}
          >
            {events.length > 0 ? (
              events.map((event) => <EventCard key={event.id} event={event} />)
            ) : (
              <p>No events available.</p>
            )}
          </div> */}
        </Col>

        {/* Sidebar Section */}
        <Col md={4} className="d-flex flex-column gap-4">
          <div className="flex-grow-0 ms-auto" style={{ right: '15px' }}>

            <Calendar profile={profile} />
            <Card
              text="primary"
              bg="white"
              border="primary"
              className="mb-5 mt-5"
              style={{ width: "320px", height: "160px", color: "#ffa426", boxShadow: '6px 6px 10px gray' }}
            >
              <Card.Body>
                <Card.Title className="mt-3 py-0 mb-0"
                  style={{ fontSize: "15px", textAlign: 'center' }}>Showcase wins, amplify your impact</Card.Title>
                <Card.Text className="mx-3 mt-2" style={{ fontSize: "13px", textAlign: 'center' }}>
                  Share profile, get more bookings
                </Card.Text>
                <div className="d-flex justify-content-center">
                  <Button
                    className="custom-hover-button"
                    style={{
                      backgroundColor: "white",
                      color: "#0E003F",
                      fontWeight: "bold",
                      borderRadius: "10px",
                      border: "1px solid #0E003F",

                    }}
                  >
                    Copy Link
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>
    </Container >

  );
}

export default MenteeWelcome;
