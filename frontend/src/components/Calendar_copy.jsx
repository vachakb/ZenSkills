import { DateTime, Interval } from "luxon";
import { useEffect, useMemo, useRef, useState } from "react";
import { Card, Modal, Button } from "react-bootstrap";
import classNames from "classnames";
import { Link, useNavigate } from "react-router-dom";
import { getAllUserSessions, getAcceptedSessions } from "../apis/session";
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as ReactCalendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const StyledCalendarWrapper = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
  padding: 1.5rem;

  .react-calendar {
    width: 100%;
    border: none;
    background: transparent;
    font-family: 'Inter', sans-serif;

    &__navigation {
      margin-bottom: 1rem;
      
      button {
        min-width: 44px;
        background: none;
        font-size: 1.2rem;
        color: #6B8DE3;
        
        &:enabled:hover,
        &:enabled:focus {
          background-color: rgba(107, 141, 227, 0.1);
          border-radius: 8px;
        }
      }
    }

    &__month-view {
      &__weekdays {
        text-transform: uppercase;
        font-weight: 600;
        font-size: 0.75rem;
        color: #6B8DE3;
        
        abbr {
          text-decoration: none;
          border: none;
        }
      }

      &__days {
        &__day {
          border-radius: 8px;
          padding: 0.75rem;
          font-size: 0.875rem;
          color: #4A5568;

          &:hover {
            background: rgba(107, 141, 227, 0.1) !important;
          }

          &--weekend {
            color: #718096;
          }

          &--neighboringMonth {
            color: #CBD5E0;
          }
        }
      }
    }

    &__tile {
      padding: 0.75rem;
      border-radius: 8px;
      transition: all 0.2s ease;

      &--now {
        background: rgba(107, 141, 227, 0.1) !important;
        color: #6B8DE3 !important;
      }

      &--active,
      &--active:enabled:hover,
      &--active:enabled:focus {
        background: #6B8DE3 !important;
        color: white !important;
      }

      &--hasContent {
        position: relative;
        font-weight: 600;
        
        &::after {
          content: '';
          position: absolute;
          bottom: 4px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #6B8DE3;
        }
      }
    }
  }
`;

const CalendarHeader = styled.div`
  margin-bottom: 1rem;
  
  h3 {
    font-weight: 600;
    color: #2D3748;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: #718096;
    font-size: 0.875rem;
    margin: 0;
  }
`;

const SessionModal = styled(Modal)`
  .modal-content {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  .session-item {
    border-radius: 12px;
    background: rgba(106, 141, 227, 0.05);
    margin-bottom: 0.5rem;
    transition: all 0.2s ease;
    
    &:hover {
      background: rgba(106, 141, 227, 0.1);
    }
  }
`;

const SessionBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${props => props.type === 'upcoming' ?
    'rgba(46, 204, 113, 0.1)' :
    'rgba(240, 146, 53, 0.1)'};
  color: ${props => props.type === 'upcoming' ?
    'rgb(46, 204, 113)' :
    'rgb(240, 146, 53)'};
`;

const SessionsList = styled(motion.div)`
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(107, 141, 227, 0.1);
`;

const SessionItem = styled.div`
  padding: 1rem;
  border-radius: 8px;
  background: rgba(107, 141, 227, 0.05);
  margin-bottom: 0.75rem;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(107, 141, 227, 0.08);
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

export default function Calendar({ events, profile }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const navigate = useNavigate();

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const getSessionsForDate = (date) => {
    return events?.filter(event => 
      new Date(event.date).toDateString() === date.toDateString()
    ) || [];
  };

  return (
    <>
      <StyledCalendarWrapper>
        <CalendarHeader>
          <h3>Calendar</h3>
          <p>Your upcoming schedule</p>
        </CalendarHeader>
        <ReactCalendar
          className="rounded-calendar"
          onClickDay={handleDateClick}
          tileClassName={({ date }) => {
            return events?.some(event =>
              new Date(event.date).toDateString() === date.toDateString()
            ) ? 'has-events' : '';
          }}
        />
      </StyledCalendarWrapper>

      {selectedDate && (
        <SessionsList
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="mb-0 fw-bold">
              Sessions on {selectedDate.toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric' 
              })}
            </h6>
            <Button 
              variant="link" 
              className="p-0 text-muted" 
              onClick={() => setSelectedDate(null)}
            >
              <i className="bi bi-x-lg"></i>
            </Button>
          </div>

          {getSessionsForDate(selectedDate).map((session) => (
            <SessionItem key={session.id}>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="mb-2">{session.session?.name}</h6>
                  <div className="d-flex align-items-center gap-3">
                    <small className="text-muted">
                      <i className="bi bi-person me-1"></i>
                      {session.user?.name}
                    </small>
                    <small className="text-muted">
                      <i className="bi bi-clock me-1"></i>
                      {new Date(session.date).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </small>
                  </div>
                </div>
                <div>
                  {session.room_id ? (
                    <Button
                      variant="primary"
                      size="sm"
                      className="rounded-pill"
                      onClick={() => navigate(`/meeting/${session.room_id}`)}
                    >
                      <i className="bi bi-play-fill me-1"></i>
                      Join
                    </Button>
                  ) : (
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="rounded-pill"
                      onClick={() => navigate(`/sessions/${session.id}`)}
                    >
                      <i className="bi bi-check-lg me-1"></i>
                      Review
                    </Button>
                  )}
                </div>
              </div>
            </SessionItem>
          ))}

          {getSessionsForDate(selectedDate).length === 0 && (
            <div className="text-center py-3">
              <p className="text-muted mb-0">No sessions scheduled for this date</p>
            </div>
          )}
        </SessionsList>
      )}
    </>
  );
}
