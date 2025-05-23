import { DateTime, Interval } from "luxon";
import { useEffect, useMemo, useRef, useState } from "react";
import { Card } from "react-bootstrap";
import classNames from "classnames";
import { Link } from "react-router-dom";
import { getAllUserSessions, getAcceptedSessions } from "../apis/session";

function Calendar({ profile }) {
  const [bookings, setBookings] = useState([]);

  const onLoad = () => {
    getAcceptedSessions()
      .then((res) => setBookings(res.data.bookings))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    if (profile) {
      onLoad();
    }
  }, [profile])

  const [selectedDate, setSelectedDate] = useState(DateTime.local());

  const selectedDateBookings = useMemo(() => {
    return bookings.filter((booking) =>
      selectedDate.hasSame(DateTime.fromISO(booking.date), "day"),
    );
  }, [selectedDate]);

  const [weekOffset, setWeekOffset] = useState(0);

  const [showDatePicker, setShowDatePicker] = useState(false);

  const datePicker = useRef(null);

  const week = useMemo(() => {
    const weekDateTime = selectedDate.plus({ week: weekOffset });

    const weekStart = weekDateTime.startOf("week", {
      useLocaleWeeks: true,
    });
    const weekEnd = weekDateTime.endOf("week", { useLocaleWeeks: true });

    const interval = Interval.fromDateTimes(weekStart, weekEnd);

    let cursor = interval.start.startOf("day");

    const days = [];

    while (cursor < interval.end) {
      days.push(cursor);
      cursor = cursor.plus({ day: 1 });
    }

    return days;
  }, [selectedDate, weekOffset]);

  useEffect(() => {
    if (showDatePicker) {
      datePicker.current.focus();
    }
  }, [showDatePicker]);

  return (
    <Card
      text="primary"
      bg="white"
      border="primary"
      style={{
        width: "400px",
        height: "275px",
        boxShadow: "4px 4px 10px gray",
      }}
    >
      <Card.Body className="d-flex flex-column gap-2">
        <div className="d-flex justify-content-between align-items-center">
          <img
            style={{ cursor: "pointer" }}
            src="/arrow-left.svg"
            onClick={() => setWeekOffset(weekOffset - 1)}
          />
          {showDatePicker ? (
            <input
              style={{ boxShadow: "none" }}
              className="border-0 focus-ring"
              type="date"
              onChange={(ev) => {
                setSelectedDate(
                  DateTime.fromFormat(ev.currentTarget.value, "yyyy-MM-dd"),
                );
                setWeekOffset(0);
                setShowDatePicker(false);
              }}
              onBlur={() => setShowDatePicker(false)}
              ref={datePicker}
            />
          ) : (
            <h6
              style={{ cursor: "pointer" }}
              className="fw-bold m-0"
              onClick={() => setShowDatePicker(true)}
            >
              {week[0].toFormat("dd MMM")} -{" "}
              {week[week.length - 1].toFormat("dd MMM")}
            </h6>
          )}
          <img
            style={{
              cursor: "pointer",
              WebkitTransform: "scaleX(-1)",
              transform: "scaleX(-1)",
            }}
            src="/arrow-left.svg"
            onClick={() => setWeekOffset(weekOffset + 1)}
          />
        </div>
        <div className="d-flex justify-content-between">
          {week.map((day) => (
            <div
              style={{
                cursor: "pointer",
              }}
              className={classNames({
                "d-flex flex-column align-items-center": true,
                "fw-bold": day.hasSame(selectedDate, "day"),
              })}
              onClick={() => {
                setSelectedDate(day);
                setWeekOffset(0);
              }}
              key={day.weekdayShort}
            >
              <div
                style={{
                  backgroundColor: "#505581",
                  width: "4px",
                  height: "4px",
                }}
                className={classNames({
                  "rounded-circle": true,
                  visible: day.hasSame(selectedDate, "day"),
                  invisible: !day.hasSame(selectedDate, "day"),
                })}
              ></div>
              <span
                style={{
                  color: "#505581",
                }}
                className="text-uppercase"
              >
                {day.weekdayShort}
              </span>
              <span
                style={{
                  color: "#505581",
                }}
              >
                {day.day}
              </span>
            </div>
          ))}
        </div>
        <hr />
        <div
          className={classNames({
            "d-flex gap-2": true,
            "flex-column": selectedDateBookings.length > 0,
          })}
        >
          <img
            style={{
              width: "1.5em",
              display: selectedDateBookings.length > 0 ? "none" : "block",
            }}
            src="/calendar.svg"
          />
          <div
            style={{
              height: selectedDateBookings.length > 0 ? "150px" : "unset",
            }}
            className="d-flex flex-column gap-4 overflow-auto"
          >
            {selectedDateBookings.length > 0
              ? selectedDateBookings.map((booking) => (
                <div className="d-flex flex-column gap-2" key={booking.id}>
                  <div className="d-flex gap-2 align-items-center">
                    <h6 className="m-0">At {DateTime.fromISO(booking.start_time).toFormat("h:mm a")}</h6>
                    <div
                      style={{ borderRadius: "24px" }}
                      className={classNames({
                        "px-2 py-1 text-white": true,
                        "bg-secondary": true,
                        "bg-success": booking.status === "accepted",
                        "bg-warning": booking.status === "pending",
                        "bg-primary": booking.status === "completed",
                        "bg-danger": booking.status === "cancelled",
                      })}
                    >
                      <span>{booking.status}</span>
                    </div>
                  </div>

                  <div className="d-flex">
                    <h6 className="m-0">
                      <b>{booking.session.name}</b> - {booking.session.mentor.User.name}
                    </h6>
                  </div>
                </div>
              ))
              : null}
          </div>
          <div className="d-flex flex-column align-items-start">
            <p
              style={{
                display: selectedDateBookings.length > 0 ? "none" : "block",
              }}
              className="m-0"
            >
              You have no upcoming sessions for {selectedDate.toLocaleString()}
            </p>
            <Link
              style={{
                color: "#037F7D",
              }}
              to="/sessions"
            >
              Go to all session
            </Link>
            {profile.isMentor && (
              <Link style={{ color: "#037F7D" }} to="/createsession_1">
                Create a session
              </Link>
            )}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

export default Calendar;
