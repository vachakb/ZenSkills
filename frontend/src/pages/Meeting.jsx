import {
  createCameraVideoTrack,
  MeetingProvider,
  useFile,
  useMediaDevice,
  useMeeting,
  useParticipant,
  usePubSub,
} from "@videosdk.live/react-sdk";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Button, Form } from "react-bootstrap";
import ReactPlayer from "react-player";
import { useParams } from "react-router-dom";
import classNames from "classnames";
import { createRoom, getToken } from "../apis/meeting";
import {
  PiVideoCameraFill,
  PiVideoCameraSlashFill,
  PiMicrophoneFill,
  PiMicrophoneSlashFill,
  PiMonitorFill,
  PiChatFill,
  PiChatSlashFill,
  PiDoorOpenFill,
} from "react-icons/pi";

function Chat({ open, meetingId, localParticipantId }) {
  const { publish, messages } = usePubSub(meetingId);

  const { uploadBase64File, fetchBase64File } = useFile();

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = () => {
        resolve(reader.result);
      };

      reader.onerror = reject;
    });

  const getFileSize = (file) => {
    let size = file.size;

    const units = ["Bytes", "KB", "MB", "GB"];

    let i = 0;

    while (size > 900) {
      size /= 1024;
      i++;
    }

    const exactSize = Math.round(size * 100) / 100 + " " + units[i];

    return exactSize;
  };

  const uploadFile = async (file) => {
    const base64Data = await getBase64(file);

    const url = await uploadBase64File({
      base64Data,
      token: import.meta.env.VITE_VIDEOSDK_TOKEN,
      fileName: file.name,
    });

    publish(url, null, {
      isFile: true,
      fileName: file.name,
      fileSize: getFileSize(file),
    });
  };

  // https://stackoverflow.com/a/26601101
  const decodeBase64 = (base64Data) => {
    const s = base64Data;
    const e = {};
    let i,
      b = 0,
      c,
      x,
      l = 0,
      a,
      r = "",
      w = String.fromCharCode,
      L = s.length;
    const A =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

    for (i = 0; i < 64; i++) {
      e[A.charAt(i)] = i;
    }

    for (x = 0; x < L; x++) {
      c = e[s.charAt(x)];
      b = (b << 6) + c;
      l += 6;

      while (l >= 8) {
        ((a = (b >>> (l -= 8)) & 0xff) || x < L - 2) && (r += w(a));
      }
    }

    return r;
  };

  // https://stackoverflow.com/a/16245768
  const base64ToBlob = async (base64Data, contentType) => {
    const byteCharacters = decodeBase64(base64Data);
    const byteArrays = [];
    const sliceSize = 512;

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  };

  const downloadFile = async (url, fileName) => {
    const base64Data = await fetchBase64File({
      url,
      token: import.meta.env.VITE_VIDEOSDK_TOKEN,
    });

    const mimeTypeIndex = base64Data.indexOf("base64");

    const cleanBase64Data = base64Data.substring(mimeTypeIndex + 6);

    const mimeType = base64Data
      .substring(0, mimeTypeIndex + 6)
      .replace("data", "")
      .replace("base64", "")
      .replace(/\s/g, "");

    const blob = await base64ToBlob(cleanBase64Data, mimeType);

    console.log(blob);

    const blobUrl = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.style.display = "none";
    a.href = blobUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  const [message, setMessage] = useState("");

  const filePicker = useRef(null);

  const handleSubmitMessage = () => {
    publish(message);
    setMessage("");
  };

  return (
    <div
      style={{ display: open ? "flex" : "none", width: "20vw" }}
      className="flex-column bg-white vh-100"
    >
      <div className="d-flex justify-content-center align-items-center position-relative p-2">
        <h5 className="m-0">Chat</h5>
        <img className="position-absolute end-0 me-2" src="/close.svg" />
      </div>
      <div className="d-flex flex-column flex-grow-1 border-top border-bottom p-2 gap-2 overflow-auto">
        {messages.map((value) => (
          <div
            className={classNames({
              "d-flex flex-column gap-2": true,
              "ms-auto me-2": value.senderId === localParticipantId,
              "me-auto ms-2": value.senderId !== localParticipantId,
            })}
            key={value.id}
          >
            <h6
              style={{
                textAlign:
                  value.senderId === localParticipantId ? "right" : "left",
              }}
              className="m-0"
            >
              {value.senderName}
            </h6>
            <div className="d-flex gap-2">
              {value.senderId !== localParticipantId ? (
                <img src="/profile.svg" width="32px" />
              ) : null}
              <div
                style={{
                  backgroundColor:
                    value.senderId === localParticipantId
                      ? "#E1D9F3"
                      : "#F1F2F3",
                  borderRadius: "20px",
                  cursor:
                    value.payload && value.payload.isFile ? "pointer" : "unset",
                  wordBreak: "break-word",
                }}
                className="px-3 py-2 fs-6"
                onClick={
                  value.payload && value.payload.isFile
                    ? () => downloadFile(value.message, value.payload.fileName)
                    : undefined
                }
              >
                {value.payload && value.payload.isFile ? (
                  <div className="d-flex gap-2">
                    <img src="/document.svg" width="32px" />
                    <div className="d-flex flex-column">
                      <span>{value.payload.fileName}</span>
                      <span style={{ color: "#6695BC" }}>
                        {value.payload.fileSize}
                      </span>
                    </div>
                  </div>
                ) : (
                  <span>{value.message}</span>
                )}
              </div>
              {value.senderId === localParticipantId ? (
                <img src="/profile.svg" width="32px" />
              ) : null}
            </div>
          </div>
        ))}
      </div>
      <div
        className="d-flex justify-content-center p-2 gap-2"
        onDragOver={(ev) => ev.preventDefault()}
        onDragEnter={(ev) => ev.preventDefault()}
        onDrop={(ev) => {
          if (ev.dataTransfer.files.length > 0) {
            uploadFile(ev.dataTransfer.files[0]);
          }

          ev.preventDefault();
        }}
      >
        <div className="d-flex border flex-grow-1 px-2">
          <Form.Control
            style={{ boxShadow: "none" }}
            className="border-0 me-2 focus-ring p-0"
            type="text"
            placeholder="Type here..."
            value={message}
            onChange={(ev) => setMessage(ev.currentTarget.value)}
            onKeyDown={(ev) => {
              if (ev.key === "Enter") {
                handleSubmitMessage();
              }
            }}
          />
          <input
            className="d-none"
            type="file"
            onChange={(ev) => {
              if (ev.target.files.length > 0) {
                uploadFile(ev.target.files[0]);
              }
            }}
            ref={filePicker}
          />
          <img
            style={{ width: "1rem", cursor: "pointer" }}
            className="ms-auto"
            src="/attachment.svg"
            onClick={() => filePicker.current.click()}
          />
        </div>
        <Button onClick={handleSubmitMessage}>Send</Button>
      </div>
    </div>
  );
}

function ControlButton({ src, label, color, onClick }) {
  return (
    <div
      className="d-flex flex-column align-items-center gap-2"
      onClick={onClick}
    >
      <div
        style={{
          backgroundColor: color,
          borderRadius: "12px",
          cursor: "pointer",
          aspectRatio: "4/4",
        }}
        className="text-center p-2"
      >
        {src}
      </div>
      <h5 className="text-white">{label}</h5>
    </div>
  );
}

function Controls({ className, openChat, onToggleChat }) {
  const { leave, toggleMic, toggleWebcam, localMicOn, localWebcamOn } =
    useMeeting();

  return (
    <div className={classNames("d-flex gap-4", className)}>
      <ControlButton
        src={localWebcamOn ? <PiVideoCameraFill /> : <PiVideoCameraSlashFill />}
        label="Cam"
        color="#E4E6E8"
        onClick={() => toggleWebcam()}
      />
      <ControlButton
        src={localMicOn ? <PiMicrophoneFill /> : <PiMicrophoneSlashFill />}
        label="Mic"
        color="#E4E6E8"
        onClick={() => toggleMic()}
      />
      <ControlButton src={<PiMonitorFill />} label="Share" color="#E4E6E8" />
      <ControlButton
        src={openChat ? <PiChatFill /> : <PiChatSlashFill />}
        label="Chat"
        color="#E4E6E8"
        onClick={onToggleChat}
      />
      <ControlButton
        src={<PiDoorOpenFill />}
        label="Leave"
        color="#F04438"
        onClick={() => leave()}
      />
    </div>
  );
}

function Participant({ style, participantId, isMainParticipant }) {
  const micRef = useRef(null);

  const { webcamStream, micStream, webcamOn, micOn, isLocal, displayName } =
    useParticipant(participantId);

  const container = useRef();

  const videoPlayer = useRef();

  const [containerHeight, setContainerHeight] = useState();

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

  useEffect(() => {
    if (videoStream && videoPlayer.current) {
      videoPlayer.current.srcObject = videoStream;
    }
  }, [videoStream]);

  return (
    <div
      style={{
        backgroundColor: "#121212",
        maxWidth: "50%",
        borderRadius: "12px",
        flexBasis: "25%",
      }}
      className="position-relative d-flex w-100 h-auto justify-content-center align-items-center"
      ref={container}
    >
      <audio ref={micRef} autoPlay playsInline muted={isLocal} />
      <video
        style={{
          display: webcamOn ? "block" : "none",
          aspectRatio: "16/9",
          borderRadius: "12px",
        }}
        className="h-auto w-100 overflow-hidden object-fit-cover"
        playsInline
        muted
        autoPlay
        ref={videoPlayer}
      />
      <div
        style={{
          display: webcamOn ? "none" : "flex",
          aspectRatio: "16/9",
          backgroundColor: "#121212",
          width: "640px",
        }}
        className="justify-content-center align-items-center"
      >
        <h4 className="text-white">No video</h4>
      </div>
      <div
        style={{
          backgroundColor: "#12121264",

          borderRadius: "12px",
        }}
        className="position-absolute p-2 bottom-0 start-0"
      >
        <h5 className="m-0 text-white">{displayName}</h5>
      </div>
    </div>
  );
}

function JoinMeeting({
  cameraEnabled,
  setCameraEnabled,
  micEnabled,
  setMicEnabled,
  meetingId,
  onJoined,
  name,
  onNameChange,
}) {
  const { join } = useMeeting();

  const [videoTrack, setVideoTrack] = useState();

  const videoPlayer = useRef();

  const { checkPermissions, requestPermission, getCameras } = useMediaDevice();

  useEffect(() => {
    if (videoTrack && videoPlayer.current) {
      videoPlayer.current.srcObject = videoTrack;
    }
  }, [videoTrack]);

  const onSubmit = () => {
    if (name.length > 0) {
      join();
      onJoined();
    }
  };

  const setupVideoTrack = async () => {
    const cameras = await getCameras();

    if (cameras.length > 0) {
      const camera = cameras[0];

      setVideoTrack(
        await createCameraVideoTrack({
          cameraId: camera.deviceId,
          encoderConfig: "h540p_w960p",
          optimizationMode: "motion",
          multiStream: false,
        }),
      );

      setCameraEnabled(true);
    }
  };

  const setup = async () => {
    const permissions = await checkPermissions("audio_video");

    if (!permissions.get("video")) {
      const videoPermission = await requestPermission("video");
      if (videoPermission.get("video")) {
        setupVideoTrack();
      }
    } else {
      setupVideoTrack();
    }

    if (!permissions.get("audio")) {
      const audioPermission = await requestPermission("audio");
      if (audioPermission.get("audio")) {
        setMicEnabled(true);
      }
    } else {
      console.log("nice");
      setMicEnabled(true);
    }
  };

  useEffect(() => {
    setup();
  }, []);

  return (
    <div className="d-flex justify-content-evenly align-items-center vh-100">
      <div className="position-relative">
        <video
          style={{
            display: videoTrack ? "block" : "none",
            aspectRatio: "16/9",
            borderRadius: "12px",
          }}
          className="h-auto w-100 overflow-hidden object-fit-cover"
          playsInline
          muted
          autoPlay
          ref={videoPlayer}
        />
        <div
          style={{
            display: videoTrack ? "none" : "flex",
            aspectRatio: "16/9",
            backgroundColor: "#121212",
            width: "640px",
          }}
          className="justify-content-center align-items-center"
        >
          <h4 className="text-white">No video</h4>
        </div>
        <div
          style={{ bottom: "0" }}
          className="d-flex justify-content-center align-items-center gap-4 position-absolute w-100"
        >
          <ControlButton
            src={
              cameraEnabled ? <PiVideoCameraFill /> : <PiVideoCameraSlashFill />
            }
            label="Cam"
            color="#E4E6E8"
            onClick={() => {
              if (videoTrack) {
                videoTrack.getVideoTracks().forEach((track) => {
                  track.stop();
                  track.enabled = false;
                  videoTrack.removeTrack(track);
                });
                setVideoTrack(undefined);
                setCameraEnabled(false);
              } else {
                setupVideoTrack();
                setCameraEnabled(true);
              }
            }}
          />
          <ControlButton
            src={micEnabled ? <PiMicrophoneFill /> : <PiMicrophoneSlashFill />}
            label="Mic"
            color="#E4E6E8"
            onClick={() => setMicEnabled(!micEnabled)}
          />
        </div>
      </div>
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
  const { _, participants, localParticipant, mainParticipant } = useMeeting();

  const [openChat, setOpenChat] = useState(false);

  if (!localParticipant) {
    return (
      <div className="d-flex justify-content-center align-items-center vw-100 vh-100">
        <h3>The meeting ended.</h3>
      </div>
    );
  }

  return (
    <div
      style={{ backgroundColor: "#303438", overflow: "hidden" }}
      className="d-flex justify-content-center align-items-center vw-100 vh-100"
    >
      <div className="d-flex flex-column h-100 p-4 flex-grow-1">
        <div className="d-flex flex-wrap justify-content-evenly align-items-center flex-grow-1 gap-4">
          {[...participants.keys()].map((participantId) => (
            <Participant
              participantId={participantId}
              isMainParticipant={
                mainParticipant && participantId === mainParticipant.id
              }
              key={participantId}
            />
          ))}
        </div>
        <Controls
          className="mt-auto mx-auto"
          openChat={openChat}
          onToggleChat={() => setOpenChat(!openChat)}
        />
        <h6 className="text-white text-center m-0 mt-2">
          Meeting ID: {meetingId}
        </h6>
      </div>
      <Chat
        open={openChat}
        meetingId={meetingId}
        localParticipantId={localParticipant.id}
      />
    </div>
  );
}

function Meeting() {
  const { meetingId } = useParams();

  const [meetingIdToUse, setMeetingIdToUse] = useState();

  const [name, setName] = useState("");

  const [joined, setJoined] = useState(false);

  const [token, setToken] = useState();

  const [cameraEnabled, setCameraEnabled] = useState(false);

  const [micEnabled, setMicEnabled] = useState(false);

  const createMeeting = async () => {
    try {
      const roomRes = await createRoom(token);
      setMeetingIdToUse(roomRes.data.roomId);

      let currentUrl = window.location.href;

      if (currentUrl.charAt(currentUrl.length - 1) === "/") {
        currentUrl = currentUrl.substring(0, currentUrl.length - 1);
      }

      history.pushState(
        `meeting ${roomRes.data.roomId}`,
        "ZenSkills",
        `${currentUrl}/${roomRes.data.roomId}`,
      );
    } catch (err) {
      console.error(err);
    }
  };

  const generateToken = () => {
    getToken(meetingId)
      .then((res) => {
        setToken(res.data.token);
        setMeetingIdToUse(meetingId);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    if (!token) {
      generateToken();
    }
  }, []);

  if (meetingIdToUse) {
    return (
      <MeetingProvider
        config={{
          meetingId: meetingIdToUse,
          micEnabled: micEnabled,
          webcamEnabled: cameraEnabled,
          name: name,
        }}
        token={token}
      >
        {joined ? (
          <Room meetingId={meetingIdToUse} />
        ) : (
          <JoinMeeting
            meetingId={meetingIdToUse}
            onJoined={() => setJoined(true)}
            name={name}
            onNameChange={setName}
            cameraEnabled={cameraEnabled}
            setCameraEnabled={setCameraEnabled}
            micEnabled={micEnabled}
            setMicEnabled={setMicEnabled}
          />
        )}
      </MeetingProvider>
    );
  } else {
    return (
      <div className="d-flex justify-content-center align-items-center vw-100 vh-100">
        <Button onClick={createMeeting}>Create meeting</Button>
      </div>
    );
  }
}

export default Meeting;
