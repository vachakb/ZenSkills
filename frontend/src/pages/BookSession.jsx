import { useEffect, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { bookSession, getSession } from "../apis/session";
import { DateTime, Duration } from "luxon";
import { LuClock3 } from "react-icons/lu";
import useProfile from "../hooks/useProfile";

function BookSession() {
  const dayOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const { availableSessionId } = useParams();

  const navigate = useNavigate();

  const [selectedDay, setSelectedDay] = useState();

  const [selectedSlot, setSelectedSlot] = useState();

  /**
   * @type {ReturnType<typeof useState<import("../apis/session").MentorSession>>}
   */
  const [session, setSession] = useState();

  const [isLoading, setIsLoading] = useState(true);

  const onLoad = () => {
    setIsLoading(true);

    getSession(availableSessionId)
      .then((res) => {
        setSession(res.data.session);
        setIsLoading(false);
      })
      .catch((err) => console.error(err));
  };

  const onSubmit = () => {
    if (selectedDay !== undefined && selectedSlot !== undefined) {
      const timeSlot = session.timeSlots[selectedDay][selectedSlot];

      bookSession(timeSlot.bookingId)
        .then(() => navigate(`/mentee_exploring/${session.mentor_id}`))
        .catch((err) => console.error(err));
    }
  };

  useEffect(() => {
    onLoad();
  }, []);

  if (isLoading) {
    return (
      <div className="d-flex h-100 w-100 justify-content-center align-items-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="d-flex h-100 position-relative">
      <img
        style={{ cursor: "pointer", right: "0", top: "0" }}
        className="position-absolute"
        src="/close.svg"
        width="32px"
        onClick={() => navigate(`/mentee_exploring/${session.mentor_id}`)}
      />
      <div
        style={{ width: "15%" }}
        className="d-flex flex-column gap-5 pe-4 me-4 border-end border-1"
      >
        <h4 className="m-0">{session.mentor.User.name}</h4>
        <h5 className="m-0">{session.name}</h5>
        <div className="d-flex align-items-center gap-1">
          <LuClock3 fontSize="24px" />
          <h6 className="m-0">
            {session.durationMinutes < 60
              ? `${session.durationMinutes} minutes`
              : `${Duration.fromObject({ minutes: session.durationMinutes }).shiftTo("hours").toObject().hours} hours`}
          </h6>
        </div>
        <div>
          <h5>About</h5>
          <h6 className="m-0">{session.description}</h6>
        </div>
      </div>
      <div
        style={{ color: "#7E5FC3" }}
        className="d-flex flex-column flex-grow-1"
      >
        <div className="d-flex gap-2 my-4">
          {Object.keys(session.timeSlots).map((key) => (
            <div
              style={{
                cursor: "pointer",
                boxShadow:
                  key === selectedDay
                    ? "rgba(0, 0, 0, 0.16) 0px 1px 4px, rgba(14, 0, 63, 0.52) 0px 0px 0px 3px"
                    : "unset",
              }}
              className="d-flex flex-column align-items-center p-4 rounded border border-1 gap-4"
              onClick={() => {
                setSelectedDay(key);
                setSelectedSlot(undefined);
              }}
            >
              <h5>{key.substring(0, 3)}</h5>
              <h5>{DateTime.now().minus({ days: (DateTime.now().weekday - (dayOfWeek.indexOf(key) + 1)) }).startOf('day').toFormat("dd/MM")}</h5>
              <h5>{session.timeSlots[key].filter(timeSlot => timeSlot.available).length}</h5>
            </div>
          ))}
        </div>
        <div className="d-flex gap-4">
          {selectedDay &&
            session.timeSlots[selectedDay].map((value, index) => (
              <div
                style={{
                  boxShadow:
                    index === selectedSlot
                      ? "rgba(0, 0, 0, 0.16) 0px 1px 4px, rgba(14, 0, 63, 0.52) 0px 0px 0px 3px"
                      : "unset",
                  cursor: value.available ? "pointer" : "unset",
                  opacity: !value.available ? "40%" : "unset"
                }}
                className="rounded px-2 py-1 border border-1"
                onClick={value.available ? () => setSelectedSlot(index) : undefined}
              >
                {value.from} - {value.to}
              </div>
            ))}
        </div>
        <Button className="mt-4 me-auto" onClick={onSubmit}>
          Book session
        </Button>
      </div>
    </div>
  );
}

export default BookSession;
