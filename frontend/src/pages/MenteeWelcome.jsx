import {
  Col,
  Container,
  Row,
  Form,
  Button,
  Card,
  ProgressBar,
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
import useSession from "../hooks/useSession";
import { getUserProfile } from "../apis/user";

const API_URL = "http://localhost:5000";

function MenteeWelcome({ mentors_, events_ }) {
  const [mentors, setMentors] = useState(mentors_);

  const [profile, setProfile] = useState();

  const onLoad = async () => {
    try {
      const res = await getUserProfile();
      setProfile(res.data.profile);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    onLoad()
  }, [])

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
          axios.get(`${API_URL}/api/mentors`),
          // axios.get(`${API_URL}/api/events`),
        ]);
        setMentors(mentorsResponse.data.mentors || []);
        // setEvents(eventsResponse.data.events || []);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    }
    fetchData();
  }, []);

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
                  className={`${
                    value.done ? "text-decoration-line-through" : ""
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
        className="gap-4"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        }}
      >
        {mentors.length > 0 ? (
          mentors.map((mentor) => <MentorCard key={mentor.mentor_id} mentor={mentor} />)
        ) : (
          <p>No mentors available.</p>
        )}
      </div>

      {/* Events Section */}
      <div>
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
      </div>
    </Col>

    {/* Sidebar Section */}
    <Col md={4} className="d-flex flex-column gap-4">
      <div className="position-sticky" style={{ top: "20px" }}>
        {/* First Sidebar Card */}
        <Card
          bg="white"
          border="primary"
          className="shadow-sm mb-4"
          style={{ width: "100%", height: "130px" }}
        >
          <Card.Body>
            <Card.Title
              className="d-flex justify-content-between align-items-center"
              style={{ fontSize: "15px" }}
            >
              <u>Complete your first session</u>
              <MdOutlineKeyboardDoubleArrowRight
                size={"2em"}
                onClick={() => navigate("/")}
              />
            </Card.Title>
            <Card.Text className="mt-2" style={{ fontSize: "13px" }}>
              <RiCopperCoinLine
                size={"2em"}
                style={{ color: "#f1dc2e", marginRight: "10px" }}
              />
              Unlock other milestones
            </Card.Text>
          </Card.Body>
        </Card>
      </div>
    </Col>
  </Row>
</Container>

  );
}

export default MenteeWelcome;
