import {
  MeetingProvider,
  useMeeting,
  useParticipant,
} from "@videosdk.live/react-sdk";
import axios from "axios";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button, Form } from "react-bootstrap";
import ReactPlayer from "react-player";
import { useParams } from "react-router-dom";
import classNames from "classnames";

function Chat({ open }) {
  return (
    <div
      style={{ display: open ? "block" : "none", width: "20vw" }}
      className="bg-white vh-100 p-2"
    >
      <h3>Coming soon!</h3>
    </div>
  );
}

function ControlButton({ src, label, color, onClick }) {
  return (
    <div className="d-flex flex-column align-items-center gap-2">
      <div
        style={{
          backgroundColor: color,
          borderRadius: "12px",
          cursor: "pointer",
        }}
        className="p-2 rounded-lg"
      >
        <img src={src} onClick={onClick} />
      </div>
      <h5 className="text-white">{label}</h5>
    </div>
  );
}

function Controls({ className, onToggleChat }) {
  const { leave, toggleMic, toggleWebcam } = useMeeting();

  return (
    <div className={classNames("d-flex gap-4", className)}>
      <ControlButton
        src="/cam.svg"
        label="Cam"
        color="#E4E6E8"
        onClick={() => toggleWebcam()}
      />
      <ControlButton
        src="/mic.svg"
        label="Mic"
        color="#E4E6E8"
        onClick={() => toggleMic()}
      />
      <ControlButton src="/share.svg" label="Share" color="#E4E6E8" />
      <ControlButton
        src="/chat.svg"
        label="Chat"
        color="#E4E6E8"
        onClick={onToggleChat}
      />
      <ControlButton
        src="/leave.svg"
        label="Leave"
        color="#F04438"
        onClick={() => leave()}
      />
    </div>
  );
}

function Participant({ style, participantId }) {
  const micRef = useRef(null);

  const { webcamStream, micStream, webcamOn, micOn, isLocal, displayName } =
    useParticipant(participantId);

  const videoStream = useMemo(() => {
    if (webcamOn && webcamStream) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(webcamStream.track);
      return mediaStream;
    }
  }, [webcamStream, webcamOn]);

  useEffect(() => {
    if (micRef.current) {
      if (micOn && micStream) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(micStream.track);

        micRef.current.srcObject = mediaStream;
        micRef.current
          .play()
          .catch((error) =>
            console.error("videoElem.current.play() failed", error),
          );
      } else {
        micRef.current.srcObject = null;
      }
    }
  }, [micStream, micOn]);

  return (
    <div style={{ ...style, position: "relative" }}>
      <audio ref={micRef} autoPlay playsInline muted={isLocal} />
      {webcamOn && (
        <ReactPlayer
          style={{ position: "absolute", width: "100%", height: "100%" }}
          playsInline
          pip={false}
          light={false}
          controls={false}
          muted={true}
          playing={true}
          url={videoStream}
          width="100%"
          height="100%"
          onError={(err) => {
            console.log(err, "participant video error");
          }}
        />
      )}
    </div>
  );
}

function JoinMeeting({ meetingId, onJoined, onNameChange }) {
  const { join, _ } = useMeeting();

  const onSubmit = () => {
    join();
    onJoined();
  };

  return (
    <div className="d-flex justify-content-center align-items-center vw-100 vh-100">
      <div className="d-flex flex-column gap-2">
        <h3 className="m-0">Meeting ID: {meetingId}</h3>
        <div className="d-flex mx-auto gap-2">
          <Form.Control
            type="text"
            placeholder="Name"
            onChange={(ev) => onNameChange(ev.currentTarget.value)}
            onKeyDown={(ev) => {
              if (ev.key === "Enter") {
                onSubmit();
              }
            }}
            required
          />
          <Button onClick={onSubmit}>Join</Button>
        </div>
      </div>
    </div>
  );
}

function Room({ meetingId }) {
  const { _, participants } = useMeeting();

  const [openChat, setOpenChat] = useState(false);

  return (
    <div
      style={{ backgroundColor: "#303438", overflow: "hidden" }}
      className="d-flex justify-content-center align-items-center vw-100 vh-100"
    >
      <div className="d-flex flex-column h-100 p-4">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(250px, 1fr))",
            width: !openChat ? "100vw" : "80vw",
          }}
          className="flex-grow-1 gap-2"
        >
          {[...participants.keys()].map((participantId) => (
            <Participant participantId={participantId} key={participantId} />
          ))}
        </div>
        <Controls
          className="mt-4 mx-auto"
          onToggleChat={() => setOpenChat(!openChat)}
        />
      </div>
      <Chat open={openChat} />
    </div>
  );
}

function Meeting() {
  const { meetingId } = useParams();

  const [meetingIdToUse, setMeetingIdToUse] = useState(meetingId);

  const [name, setName] = useState("");

  const [joined, setJoined] = useState(false);

  const createMeeting = async () => {
    const res = await axios.post("https://api.videosdk.live/v2/rooms", null, {
      headers: { Authorization: import.meta.env.VITE_VIDEOSDK_TOKEN },
    });

    setMeetingIdToUse(res.data.roomId);
  };

  if (meetingIdToUse) {
    return (
      <MeetingProvider
        config={{
          meetingId: meetingIdToUse,
          micEnabled: true,
          webcamEnabled: true,
          name: name,
        }}
        token={import.meta.env.VITE_VIDEOSDK_TOKEN}
      >
        {joined ? (
          <Room meetingId={meetingIdToUse} />
        ) : (
          <JoinMeeting
            meetingId={meetingIdToUse}
            onJoined={() => setJoined(true)}
            onNameChange={setName}
          />
        )}
      </MeetingProvider>
    );
  } else {
    return <Button onClick={createMeeting}>Create meeting</Button>;
  }
}

export default Meeting;
