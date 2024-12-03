import { useEffect, useRef, useState } from "react";
import useProfile from "../hooks/useProfile";
import useWebSocket from "react-use-websocket";
import {
  getAllConversations,
  saveAttachment,
} from "../apis/chat";
import { Button, Form } from "react-bootstrap";
import classNames from "classnames";
import { API_URL } from "../apis/commons";

const getFileSize = (size) => {
  const units = ["Bytes", "KB", "MB", "GB"];

  let i = 0;

  while (size > 900) {
    size /= 1024;
    i++;
  }

  const exactSize = Math.round(size * 100) / 100 + " " + units[i];

  return exactSize;
};

function Conversation({ children, onClick }) {
  return (
    <div style={{ cursor: "pointer" }} className="px-1" onClick={onClick}>
      {children}
    </div>
  );
}

function Chat() {
  const profile = useProfile();

  const [fileToUpload, setFileToUpload] = useState();

  const [isConversationsLoading, setIsConversationsLoading] = useState(true);

  const [isChatLoading, setIsChatLoading] = useState(true);

  const [conversations, setConversations] = useState([]);

  const [selectedConversation, setSelectedConversation] = useState(-1);

  const [messages, setMessages] = useState([]);

  const messagesContainer = useRef(null);

  const [isChatAtBottom, setIsChatAtBottom] = useState(true);

  useEffect(() => {
    if (isChatAtBottom && messagesContainer.current) {
      messagesContainer.current.scrollTop =
        messagesContainer.current.scrollHeight;
    }
  }, [messages]);

  const [message, setMessage] = useState("");

  const refetchConversations = () => {
    setIsConversationsLoading(true);
    getAllConversations().then((res) => {
      setConversations(res.data.conversations);
      setIsConversationsLoading(false);
    });
  };

  const handleSubmitMessage = () => {
    if (message.length > 0 || fileToUpload) {
      const payload = {
        type: "MESSAGE",
        content: message,
        conversation_id: conversations[selectedConversation].id,
        attachment_id: fileToUpload ? fileToUpload.id : undefined,
      };
      //setMessages([...messages, payload]);
      sendJsonMessage(payload);
      setMessage("");
      setFileToUpload(undefined);
    }
  };

  useEffect(() => {
    refetchConversations();
  }, []);

  const { sendJsonMessage } = useWebSocket(
    "ws://localhost:5000/api/chat/connect",
    {
      onMessage: (msg) => {
        msg = JSON.parse(msg.data);

        switch (msg.type) {
          case "RETRIEVE":
            setMessages(msg.content);
            break;
          case "USER":
          case "SYSTEM":
            console.log(msg);
            setMessages([...messages, msg]);
            break;
        }
      },
    },
    true,
  );

  const filePicker = useRef(null);

  const uploadFile = (file) => {
    saveAttachment(file).then((res) => setFileToUpload(res.data.attachment));
  };

  if (isConversationsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="d-flex h-100">
      <div className="d-flex flex-column border-end border-1 pe-4 me-4 gap-2">
        {conversations.map((conversation, index) => (
          <Conversation
            onClick={() => {
              setSelectedConversation(index);
              sendJsonMessage({
                type: "RETRIEVE",
                content: conversation.id,
              });
              setIsChatLoading(false);
            }}
            key={conversation.id}
          >
            {conversation.title}
          </Conversation>
        ))}
        <Conversation onClick={() => {}}>
          Start new conversation...
        </Conversation>
      </div>
      {selectedConversation > -1 ? (
        isChatLoading ? (
          <div className="d-flex justify-content-center align-items-center flex-grow-1">
            <p>Loading...</p>
          </div>
        ) : (
          <div className="d-flex flex-column flex-grow-1">
            <div>
              <h5>{conversations[selectedConversation].title}</h5>
            </div>
            <div
              className="d-flex flex-column flex-grow-1 p-2 gap-2 overflow-auto"
              onScroll={(ev) => {
                // https://stackoverflow.com/a/49573628
                setIsChatAtBottom(
                  Math.abs(
                    ev.currentTarget.scrollHeight -
                      (ev.currentTarget.scrollTop +
                        ev.currentTarget.clientHeight),
                  ) <= 1,
                );
              }}
              ref={messagesContainer}
            >
              {messages.map((msg, index) => (
                <div
                  className={classNames({
                    "d-flex flex-column gap-2": true,
                    "ms-auto me-2": msg.sender.id === profile.id,
                    "me-auto ms-2": msg.sender.id !== profile.id,
                  })}
                  key={msg.id}
                >
                  {messages[index - 1] &&
                  messages[index - 1].sender.id !== msg.sender.id ? (
                    <h6
                      style={{
                        textAlign:
                          msg.sender.id === profile.id ? "right" : "left",
                      }}
                      className="m-0"
                    >
                      {msg.sender.name}
                    </h6>
                  ) : null}
                  {msg.content && (
                    <div
                      style={{
                        backgroundColor:
                          msg.sender.id === profile.id ? "#E1D9F3" : "#F1F2F3",
                        borderRadius: "20px",
                        wordBreak: "break-word",
                      }}
                      className={classNames({
                        "px-3 py-2 fs-6": true,
                        "ms-auto": msg.sender.id === profile.id,
                        "me-auto": msg.sender.id !== profile.id,
                      })}
                    >
                      <span>{msg.content}</span>
                    </div>
                  )}
                  {msg.attachment && (
                    <a className="text-decoration-none" href={`${API_URL}/api/chat/attachment/${msg.attachment.id}`} download>
                      <div
                        style={{ cursor: "pointer" }}
                        className="d-flex gap-2 px-3 py-1"
                      >
                        <img src="/document.svg" width="24px" />
                        <div className="d-flex flex-column">
                          <span>{msg.attachment.filename}</span>
                          <span style={{ color: "#6695BC" }}>
                            {getFileSize(msg.attachment.size)}
                          </span>
                        </div>
                      </div>
                    </a>
                  )}
                </div>
              ))}
            </div>
            <div
              className="d-flex justify-content-center gap-2 w-100"
              onDragOver={(ev) => ev.preventDefault()}
              onDragEnter={(ev) => ev.preventDefault()}
              onDrop={(ev) => {
                if (ev.dataTransfer.files.length > 0) {
                  uploadFile(ev.dataTransfer.files[0]);
                }

                ev.preventDefault();
              }}
            >
              <div className="d-flex border rounded flex-grow-1 px-2">
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
            {fileToUpload && (
              <div className="d-flex gap-2 px-3 py-1">
                <img src="/document.svg" width="24px" />
                <div className="d-flex flex-column">
                  <span>{fileToUpload.filename}</span>
                  <span style={{ color: "#6695BC" }}>
                    {getFileSize(fileToUpload.size)}
                  </span>
                </div>
                <img
                  style={{ cursor: "pointer" }}
                  src="/close.svg"
                  width="24px"
                  onClick={() => setFileToUpload(undefined)}
                />
              </div>
            )}
          </div>
        )
      ) : (
        <div className="d-flex justify-content-center align-items-center flex-grow-1">
          <h4>Select a conversation or start a new one</h4>
        </div>
      )}
    </div>
  );
}

export default Chat;
