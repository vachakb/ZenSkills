import { DateTime, Interval } from "luxon";
import { useMemo, useState } from "react";
import { Card } from "react-bootstrap";
import classNames from "classnames";
import { Link } from "react-router-dom";

function Calendar() {
  const [weekOffset, setWeekOffset] = useState(0);

  const week = useMemo(() => {
    const weekDateTime = DateTime.local().plus({ week: weekOffset });

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
  }, [weekOffset]);

  return (
    <Card
      text="primary"
      bg="white"
      border="primary"
      style={{
        width: "320px",
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
          <h6 className="fw-bold m-0">
            {week[0].toFormat("dd MMM")} -{" "}
            {week[week.length - 1].toFormat("dd MMM")}
          </h6>
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
              className={classNames({
                "d-flex flex-column align-items-center": true,
                "fw-bold": day.hasSame(DateTime.local(), "day"),
              })}
            >
              <div
                style={{
                  backgroundColor: "#505581",
                  width: "4px",
                  height: "4px",
                }}
                className={classNames({
                  "rounded-circle": true,
                  visible: day.hasSame(DateTime.local(), "day"),
                  invisible: !day.hasSame(DateTime.local(), "day"),
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
        <div className="d-flex gap-2">
          <img style={{ width: "1.5em" }} src="/calendar.svg" />
          <div>
            <p className="m-0">You have no upcoming sessions</p>
            <Link style={{ color: "#037F7D" }} href="#">
              Book a session
            </Link>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

export default Calendar;
