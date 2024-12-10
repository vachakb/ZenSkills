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
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { GiHand } from "react-icons/gi";
import { MdKeyboardArrowRight, MdClose } from "react-icons/md";
import { PiPlantFill } from "react-icons/pi";
import { Link } from "react-router-dom";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import { RiCopperCoinLine } from "react-icons/ri";
import EventCard from "../components/Events";
import MentorCard from "../components/MentorCard"
import "../styles/style.css";
import Calendar from "../components/Calendar";
import { getUserProfile } from "../apis/user";
import useProfile from "../hooks/useProfile";
export default function MentorWelcome({ events_ }) {
  const [events, setEvents] = useState(events_);



  const sessiondata = [
    /*{name:"test1",date:new Date()},
        {name:"test2",date:new Date()},*/
  ];

  const { profile, isProfileLoading } = useProfile();

  const userName = profile?.name || "User";

  const [tasks, setTasks] = useState([
    { label: "Complete your profile", done: true },
    { label: "Setup your calendar", done: false },
    { label: "Create your first session", done: false },



  ]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (isVisible) {
      setIsVisible(!tasks.every((task) => task.done));
    }
  }, [tasks])

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
  const allCompleted = tasks.every(task => task.done);


  const profilestatus = "Beginner";

  const navigate = useNavigate();
  // Fetch mentors and events
  /*useEffect(() => {
    async function fetchData() {
      try {
        const [eventsResponse] = await Promise.all([
       
          axios.get("/api/events"),
        ]);
      
        setEvents(eventsResponse.data.events || []);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    }
    fetchData();
  }, []);*/

  if (isProfileLoading) {
    return (
      <div className="d-flex h-100 w-100 justify-content-center align-items-center">
        <Spinner />
      </div>
    );
  }

  return (
    <Container className="d-flex flex-column gap-4" fluid>
      <div className="pt-0">
        <div className="d-flex align-items-center gap-2">
          <h2 className="fw-bold">Hello, {userName}!</h2>
          <GiHand size={"2rem"} color="#ffa426" />
        </div>
        {sessiondata.length === 0 ? (
          <h6 style={{ color: "#436DA7" }} className="m-0">
            You have no upcoming sessions.
          </h6>
        ) : null}
      </div>
      <div className="d-flex">
        <div
          style={{
            maxWidth: "75%",
          }}
          className="d-flex flex-column gap-4 flex-grow-1"
        >

          <>
            {isVisible && (
              <Card style={{ boxShadow: '1px 2px 9px gray' }}>
                <Card.Body className="d-flex flex-column gap-3">
                  <div className="d-flex">
                    <div className="flex-grow-1">
                      <h3 className="fw-bold">Let's start with the basics</h3>
                      <h6 style={{ color: "#436DA7" }}>
                        Get more by setting up a profile you love.
                      </h6>
                    </div>
                    <div className="d-flex flex-column justify-content-between align-items-end ms-auto">
                      <MdClose
                        style={{ cursor: "pointer" }}
                        onClick={handleClose}
                      />
                      <h6 style={{ color: "#436DA7" }}>
                        {Math.floor(progress)}% completed
                      </h6>
                    </div>
                  </div>
                  <ProgressBar now={progress} />
                  {tasks.map((value, index) => (
                    <Form.Group key={index} className="d-flex align-content-center gap-2">
                      <Form.Check
                        className="pe-none"
                        checked={value.done}
                      />
                      <Form.Label
                        style={{
                          color: "#037f7d",
                        }}
                        className={value.done ? "text-decoration-line-through" : ""}
                      >
                        {value.label}
                      </Form.Label>
                    </Form.Group>
                  ))}
                </Card.Body>
              </Card>
            )}
          </>

          <div>
            <h3 className="fw-bold">Events</h3>
            <h6 style={{ color: "#436DA7" }} className="m-0">
              To help you connect and grow.
            </h6>
          </div>
          <div className="d-flex flex-column flex-wrap justify-content-flex-start" style={{
            maxWidth: "100%",
            columnGap: '163px'
          }}>
            {events.length > 0 ? (
              events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))
            ) : (
              <p>No events available.</p>
            )}
          </div>
        </div>



        <div className="flex-grow-0 ms-auto" style={{ right: '15px' }}>
          <div className="mb-5">
            <Calendar profile={profile} />
          </div>

          <Card
            text="primary"
            bg="white"
            border="primary"
            className="mb-5"
            style={{ width: "320px", height: "130px", boxShadow: '4px 4px 10px gray' }}
          >
            <Card.Title
              className="mt-4 py-0 mb-0"
              style={{ fontSize: "15px", marginLeft: "20px" }}
            >
              <u>Complete your first session</u>
              <MdOutlineKeyboardDoubleArrowRight
                size={"2em"}
                style={{ verticalAlign: "middle", marginLeft: "50px" }}
                onClick={() => navigate("/sessions")}
              />
            </Card.Title>
            <Card.Text className="mx-3 mt-2" style={{ fontSize: "13px" }}>
              <RiCopperCoinLine
                size={"2em"}
                style={{ color: "#f1dc2e", marginRight: "10px" }}
              />
              Unlock other milestones
            </Card.Text>
          </Card>
          <Card
            text="primary"
            bg="white"
            border="primary"
            className="mb-5"
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
      </div>
    </Container >
  );




}
