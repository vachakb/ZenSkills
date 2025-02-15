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
import Calendar from "../components/Calendar_copy";
import { getUserProfile } from "../apis/user";
import useProfile from "../hooks/useProfile";
import { getAllUserSessions, getAcceptedSessions } from "../apis/session";
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { BsLightning, BsCalendarCheck, BsClock, BsCollection } from 'react-icons/bs';

// Add this mock data at the top of the file, after the imports
const MOCK_DATA = {
  pendingSessions: [
    {
      id: 1,
      session: { name: "JavaScript Fundamentals" },
      user: { name: "John Doe" },
      date: new Date(Date.now() + 86400000).toISOString() // Tomorrow
    },
    {
      id: 2,
      session: { name: "React Hooks Deep Dive" },
      user: { name: "Jane Smith" },
      date: new Date(Date.now() + 172800000).toISOString() // Day after tomorrow
    },
    {
      id: 3,
      session: { name: "Node.js Best Practices" },
      user: { name: "Mike Johnson" },
      date: new Date(Date.now() + 259200000).toISOString() // 3 days from now
    }
  ],
  upcomingSessions: [
    {
      id: 4,
      session: { name: "Advanced React Patterns" },
      user: { name: "Sarah Wilson" },
      date: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
      room_id: "room-123"
    },
    {
      id: 5,
      session: { name: "TypeScript Workshop" },
      user: { name: "Alex Brown" },
      date: new Date(Date.now() + 7200000).toISOString(), // 2 hours from now
      room_id: "room-456"
    },
    {
      id: 6,
      session: { name: "GraphQL Fundamentals" },
      user: { name: "Emma Davis" },
      date: new Date(Date.now() + 10800000).toISOString(), // 3 hours from now
      room_id: "room-789"
    }
  ]
};

const LoadingSkeleton = () => (
  <div className="p-3 border rounded mb-3">
    <div className="d-flex justify-content-between align-items-center">
      <div className="w-75">
        <div className="skeleton-loading w-50 mb-2"></div>
        <div className="skeleton-loading w-25"></div>
      </div>
      <div className="skeleton-loading w-25"></div>
    </div>
  </div>
);

const ZenCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 28px rgba(0, 0, 0, 0.06);
  }
`;

const ActionButton = styled(Button)`
  border-radius: 12px;
  padding: 1rem;
  font-weight: 500;
  transition: all 0.2s ease;
  border: none;
  background: ${props => props.variant === 'primary' ?
    'linear-gradient(135deg, #6B8DE3 0%, #4A6FE3 100%)' :
    'rgba(106, 141, 227, 0.1)'};
  color: ${props => props.variant === 'primary' ? '#fff' : '#6B8DE3'};

  &:hover {
    transform: scale(1.02);
    background: ${props => props.variant === 'primary' ?
    'linear-gradient(135deg, #5A7DE3 0%, #3960E3 100%)' :
    'rgba(106, 141, 227, 0.15)'};
  }
`;

const StatCard = styled(motion.div)`
  padding: 1.5rem;
  border-radius: 12px;
  background: ${props => `rgba(${props.bgColor}, 0.08)`};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

export default function MentorWelcome({ events_ }) {
  const { profile, isProfileLoading } = useProfile();
  const userName = profile?.name || "User";
  const navigate = useNavigate();
  const [pendingSessions, setPendingSessions] = useState([]);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        // Comment out the actual API calls and use mock data instead
        // const [pendingRes, upcomingRes] = await Promise.all([
        //   getAllUserSessions("pending"),
        //   getAcceptedSessions()
        // ]);
        // setPendingSessions(pendingRes.data.bookings || []);
        // setUpcomingSessions(upcomingRes.data.bookings || []);

        // Use mock data
        setPendingSessions(MOCK_DATA.pendingSessions);
        setUpcomingSessions(MOCK_DATA.upcomingSessions);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (profile) {
      fetchSessions();
    }
  }, [profile]);

  if (isProfileLoading) {
    return (
      <div className="d-flex h-100 w-100 justify-content-center align-items-center">
        <Spinner />
      </div>
    );
  }

  return (
    <Container className="py-4" fluid>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Row className="g-4">
          <Col md={8}>
            <div className="d-flex flex-column gap-4">
              <ZenCard className="p-4">
                <h3 className="fw-bold mb-4">
                  <BsLightning className="me-2" />
                  Quick Actions
                </h3>
                <Row className="g-3">
                  {[
                    {
                      title: "Create Session",
                      icon: "bi-plus-circle",
                      path: "/createsession_1",
                      variant: "outline-primary"
                    },
                    {
                      title: "View All Sessions",
                      icon: "bi-calendar",
                      path: "/sessions",
                      variant: "outline-primary"
                    },
                    {
                      title: "Create Workshop",
                      icon: "bi-laptop",
                      path: "/create_workshop",
                      variant: "outline-primary"
                    },
                    {
                      title: "Update Time Slots",
                      icon: "bi-clock",
                      path: "/update_slots",
                      variant: "outline-primary"
                    }
                  ].map((action, index) => (
                    <Col md={6} key={index}>
                      <ActionButton
                        variant={action.variant}
                        className="w-100"
                        onClick={() => navigate(action.path)}
                      >
                        <i className={`bi ${action.icon} me-2`}></i>
                        {action.title}
                      </ActionButton>
                    </Col>
                  ))}
                </Row>
              </ZenCard>

              {/* Stats Section */}
              <ZenCard className="p-4">
                <h3 className="fw-bold mb-4">Overview</h3>
                <Row className="g-4">
                  {[
                    {
                      value: upcomingSessions.length,
                      label: "Upcoming",
                      icon: BsCalendarCheck,
                      color: "106, 141, 227"
                    },
                    {
                      value: pendingSessions.length,
                      label: "Pending",
                      icon: BsClock,
                      color: "240, 146, 53"
                    },
                    {
                      value: upcomingSessions.length + pendingSessions.length,
                      label: "Total",
                      icon: BsCollection,
                      color: "46, 204, 113"
                    }
                  ].map((stat, index) => (
                    <Col md={4} key={index}>
                      <StatCard
                        bgColor={stat.color}
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <stat.icon size={24} style={{ color: `rgb(${stat.color})` }} />
                        <h2 className="mb-0 fw-bold" style={{ color: `rgb(${stat.color})` }}>
                          {stat.value}
                        </h2>
                        <p className="text-muted mb-0">{stat.label}</p>
                      </StatCard>
                    </Col>
                  ))}
                </Row>
              </ZenCard>

              {/* Replace the existing Recent Session Requests Card */}
              <ZenCard className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <h3 className="fw-bold mb-1">Recent Session Requests</h3>
                    <p className="text-muted mb-0">Review and respond to pending requests</p>
                  </div>
                  {pendingSessions.length > 3 && (
                    <Button variant="link" className="text-decoration-none p-0" onClick={() => navigate('/sessions')}>
                      View all <i className="bi bi-arrow-right"></i>
                    </Button>
                  )}
                </div>
                {isLoading ? (
                  <>
                    <LoadingSkeleton />
                    <LoadingSkeleton />
                    <LoadingSkeleton />
                  </>
                ) : pendingSessions.length > 0 ? (
                  pendingSessions.slice(0, 3).map((session) => (
                    <div key={session.id} className="session-item p-3">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="mb-2">{session.session?.name}</h6>
                          <div className="d-flex align-items-center gap-3">
                            <small className="session-time">
                              <i className="bi bi-person"></i>
                              {session.user?.name}
                            </small>
                            <small className="session-time">
                              <i className="bi bi-calendar-event"></i>
                              {new Date(session.date).toLocaleDateString()}
                            </small>
                          </div>
                        </div>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="rounded-pill"
                          onClick={() => navigate(`/sessions/${session.id}`)}
                        >
                          <i className="bi bi-eye me-1"></i>
                          Review
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <i className="bi bi-inbox text-muted fs-1"></i>
                    <p className="text-muted mt-2 mb-0">No pending session requests</p>
                  </div>
                )}
              </ZenCard>

              {/* Replace the existing Upcoming Sessions Card */}
              <ZenCard className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <h3 className="fw-bold mb-1">Upcoming Sessions</h3>
                    <p className="text-muted mb-0">Your scheduled sessions for today</p>
                  </div>
                  {upcomingSessions.length > 3 && (
                    <Button variant="link" className="text-decoration-none" onClick={() => navigate('/sessions')}>
                      View all <i className="bi bi-arrow-right"></i>
                    </Button>
                  )}
                </div>
                {isLoading ? (
                  <>
                    <LoadingSkeleton />
                    <LoadingSkeleton />
                    <LoadingSkeleton />
                  </>
                ) : upcomingSessions.length > 0 ? (
                  upcomingSessions.slice(0, 3).map((session) => (
                    <div key={session.id} className="session-item p-3">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <div className="d-flex align-items-center gap-2 mb-2">
                            <h6 className="mb-0">{session.session?.name}</h6>
                            <span className="session-badge bg-primary bg-opacity-10 text-primary">
                              {new Date(session.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <div className="d-flex align-items-center gap-3">
                            <small className="session-time">
                              <i className="bi bi-person"></i>
                              {session.user?.name}
                            </small>
                            <small className="session-time">
                              <i className="bi bi-camera-video"></i>
                              Room: {session.room_id}
                            </small>
                          </div>
                        </div>
                        <Button
                          variant="primary"
                          size="sm"
                          className="rounded-pill"
                          onClick={() => navigate(`/meeting/${session.room_id}`)}
                        >
                          <i className="bi bi-play-fill me-1"></i>
                          Join
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <i className="bi bi-calendar2-check text-muted fs-1"></i>
                    <p className="text-muted mt-2 mb-0">No upcoming sessions</p>
                  </div>
                )}
              </ZenCard>
            </div>
          </Col>

          <Col md={4}>
            <div className="d-flex flex-column gap-4">
              <Calendar profile={profile} />
              {/* <Card className="shadow-sm">
                <Card.Body className="text-center">
                  <h5 className="fw-bold mb-3">Share Your Profile</h5>
                  <p className="text-muted">Showcase your expertise and get more bookings</p>
                  <Button variant="primary" className="hover-scale">
                    <i className="bi bi-share me-2"></i>
                    Copy Profile Link
                  </Button>
                </Card.Body>
              </Card> */}
            </div>
          </Col>
        </Row>
      </motion.div>
    </Container>
  );
}
