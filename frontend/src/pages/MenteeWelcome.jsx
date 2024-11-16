import {
  Col,
  Container,
  Row,
  Form,
  Button,
  Card,
  ProgressBar,
} from "react-bootstrap";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { GiHand } from "react-icons/gi";
import { MdKeyboardArrowRight, MdClose } from "react-icons/md";
import { PiPlantFill } from "react-icons/pi";
import { Link } from "react-router-dom";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import { RiCopperCoinLine } from "react-icons/ri";
import EventCard from "../components/Events";

function MenteeWelcome() {
  const location = useLocation();

  const userName = location.state?.name || "User";

  const sessiondata = [
    /*{name:"test1",date:new Date()},
        {name:"test2",date:new Date()},*/
  ];

  const [tasks, setTasks] = useState([
    { label: "Verify email", done: true },
    { label: "Book your first session", done: false },
    { label: "Customize profile", done: false },
  ]);

  const progress = useMemo(() => {
    let done = 0;

    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].done) {
        done++;
      }
    }

    return (done / tasks.length) * 100;
  }, [tasks]);

  const profilestatus = "Beginner";

  const navigate = useNavigate();

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
          <Card>
            <Card.Body className="d-flex flex-column gap-3">
              <div className="d-flex">
                <div className="flex-grow-1">
                  <h3 className="fw-bold">Let's start with the basics</h3>
                  <h6 style={{ color: "#436DA7" }}>
                    Get more by setting up a profile you love.
                  </h6>
                </div>
                <div className="d-flex flex-column justify-content-between align-items-end ms-auto">
                  <MdClose style={{ cursor: "pointer" }} />
                  <h6 style={{ color: "#436DA7" }}>
                    {Math.floor(progress)}% completed
                  </h6>
                </div>
              </div>
              <ProgressBar now={progress} />
              {tasks.map((value, index) => (
                <Form.Group className="d-flex align-content-center gap-2">
                  <Form.Check
                    checked={value.done}
                    onChange={() => {
                      const copy = [...tasks];
                      copy[index].done = !copy[index].done;
                      setTasks(copy);
                    }}
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
          <div>
            <h3 className="fw-bold">Recommended Mentors</h3>
            <h6 style={{ color: "#436DA7" }} className="m-0">
              Find the right mentor for your goals—handpicked by our AI,
              perfectly tailored to your needs!
            </h6>
          </div>
          <div className="d-flex"></div>
        </div>
        <div className="flex-grow-0 ms-auto">
          <Card
            bg="primary"
            className="mb-5"
            style={{ width: "320px", height: "130px", color: "#ffa426" }}
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
          <Card
            text="primary"
            bg="white"
            border="primary"
            style={{ width: "320px", height: "130px" }}
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
