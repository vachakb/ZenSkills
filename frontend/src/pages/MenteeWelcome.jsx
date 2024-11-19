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
import Calendar from "../components/Calendar";

const API_URL = "http://localhost:5000";

function MenteeWelcome({ mentors_, events_ }) {
  const [mentors, setMentors] = useState(mentors_);
  const location = useLocation();
  const userName = location.state?.name || "User";

  const [tasks, setTasks] = useState([
    { label: "Complete your profile", done: false },
    { label: "Book your first session", done: false },
  ]);
  const [isVisible, setIsVisible] = useState(true);
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
    <Container className="d-flex flex-column gap-4" fluid>
      <div className="pt-0">
        <div className="d-flex align-items-center gap-2">
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
      <div className="d-flex">
        <div
          style={{
            maxWidth: "75%",
          }}
          className="d-flex flex-column gap-4 flex-grow-1"
        >
          <>
            {isVisible && (
              <Card style={{ boxShadow: "1px 2px 9px gray" }}>
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
                    <Form.Group
                      key={index}
                      className="d-flex align-content-center gap-2"
                    >
                      <Form.Check
                        checked={value.done}
                        onChange={() => {
                          const copy = [...tasks];
                          copy[index].done = !copy[index].done;
                          setTasks(copy);

                          // Close card if all tasks are done
                          if (copy.every((task) => task.done)) {
                            handleClose();
                          }
                        }}
                      />
                      <Form.Label
                        style={{
                          color: "#037f7d",
                        }}
                        className={
                          value.done ? "text-decoration-line-through" : ""
                        }
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
            <h3 className="fw-bold">Recommended Mentors</h3>
            <h6 style={{ color: "#436DA7" }} className="m-0">
              Find the right mentor for your goals—handpicked by our AI,
              perfectly tailored to your needs!
            </h6>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            }}
            className="gap-4"
          >
            {mentors.length > 0 ? (
              mentors.map((mentor) => (
                <MentorCard key={mentor.mentor_id} mentor={mentor} />
              ))
            ) : (
              <p>No mentors available.</p>
            )}
          </div>
          <div>
            <h3 className="fw-bold">Events</h3>
            <h6 style={{ color: "#436DA7" }} className="m-0">
              To help you connect and grow.
            </h6>
          </div>
          <div
            className="d-flex flex-column flex-wrap justify-content-flex-start"
            style={{
              maxWidth: "100%",
              columnGap: "163px",
            }}
          >
            {events.length > 0 ? (
              events.map((event) => <EventCard key={event.id} event={event} />)
            ) : (
              <p>No events available.</p>
            )}
          </div>
        </div>

        <div
          className="flex-grow-0 ms-auto"
          style={{ position: "fixed", right: "15px" }}
        >
          <Card
            bg="primary"
            className="mb-5"
            style={{
              width: "320px",
              height: "130px",
              color: "#ffa426",
              boxShadow: "6px 6px 10px gray",
            }}
          >
            <Card.Title
              className="mx-4 mt-4 py-0 mb-0"
              style={{ fontSize: "15px" }}
            >
              Your profile strength
              <MdKeyboardArrowRight
                size={"30px"}
                style={{ verticalAlign: "middle", marginLeft: "90px" }}
                onClick={() => navigate("/upcoming")}
              />
            </Card.Title>
            <Card.Text className="mx-4 mt-2 fs-4">
              {profilestatus}
              <PiPlantFill className="mx-2" style={{ color: "#33a70d" }} />
            </Card.Text>
          </Card>
          <div className="mb-5">
            <Calendar />
          </div>
          <Card
            text="primary"
            bg="white"
            border="primary"
            style={{
              width: "320px",
              height: "130px",
              boxShadow: "4px 4px 10px gray",
            }}
          >
            <Card.Title
              className="mt-4 py-0 mb-0"
              style={{ fontSize: "15px", marginLeft: "20px" }}
            >
              <u>Complete your first session</u>
              <MdOutlineKeyboardDoubleArrowRight
                size={"2em"}
                style={{ verticalAlign: "middle", marginLeft: "50px" }}
                onClick={() => navigate("/")}
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
        </div>
      </div>
    </Container>
  );
}

export default MenteeWelcome;
