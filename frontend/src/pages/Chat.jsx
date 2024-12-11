import { useEffect, useRef, useState } from "react";
import useProfile from "../hooks/useProfile";
import useWebSocket from "react-use-websocket";
import {
  createConversation,
  getAllAvailableChatUsers,
  getAllConversations,
  saveAttachment,
} from "../apis/chat";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import classNames from "classnames";
import { API_URL } from "../apis/commons";
import { DateTime } from "luxon";
import demoMentorImage from "../assets/mentorImage.png";
import { LuSend } from "react-icons/lu";
import { GrAttachment } from "react-icons/gr";

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

function Conversation({ children, onClick, profilePicture }) {
  return (
    <div
      style={{ cursor: "pointer" }}
      className="d-flex gap-2 align-items-center px-1"
      onClick={onClick}
    >
      <img
        src={
          profilePicture
            ? `${API_URL}/api/images/${profilePicture.id}`
            : demoMentorImage
        }
        className="rounded-circle"
        style={{
          width: "32px",
          height: "32px",
          objectFit: "contain",
        }}

      />

      <span>{children}</span>

    </div>

  );
}

function Chat() {
  const { profile, isProfileLoading } = useProfile();

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
      setIsChatAtBottom(true);
    }
  };

  useEffect(() => {
    refetchConversations();
  }, []);

  const getConversationContents = (conversationId) => {
    sendJsonMessage({
      type: "RETRIEVE",
      content: conversationId,
    });
    setIsChatLoading(false);
  };

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

  const [showNewConversationModal, setShowNewConversationModal] =
    useState(false);

  const [availableChatUsers, setAvailableChatUsers] = useState([]);

  const [isAvailableChatUsersLoading, setIsAvailableChatUsersLoading] =
    useState(false);

  const openNewConversationModal = () => {
    setShowNewConversationModal(true);
    setIsAvailableChatUsersLoading(true);
    getAllAvailableChatUsers()
      .then((res) => {
        setAvailableChatUsers(res.data.users);
        setIsAvailableChatUsersLoading(false);
      })
      .catch((err) => console.error(err));
  };

  const closeNewConversationModal = () => {
    setShowNewConversationModal(false);
  };

  const startNewConversation = (user) => {
    createConversation({ type: "PRIVATE", otherUsers: [user] }).then((res) => {
      setConversations([res.data.conversation, ...conversations]);
      setSelectedConversation(0);
      getConversationContents(res.data.conversation.id);
    });
  };

  if (isProfileLoading || isConversationsLoading) {
    return (
      <div className="d-flex h-100 w-100 justify-content-center align-items-center">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <Modal
        size="xl"
        show={showNewConversationModal}
        onHide={closeNewConversationModal}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Start a new conversation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isAvailableChatUsersLoading ? (
            <Spinner />
          ) : (
            <div className="d-flex flex-column gap-2">
              <div>
                <Form.Check type="radio" label="Private" />
                <Form.Check type="radio" label="Group" />
              </div>
              <div
                style={{ height: "200px", overflowY: "auto" }}
                className="d-flex flex-column gap-2 mb-2"
              >
                {availableChatUsers.map((user) => (
                  <div
                    style={{
                      cursor: "pointer",

                    }}
                    className="d-flex border border-1 rounded px-4 py-2"
                    onClick={() => {
                      closeNewConversationModal();
                      startNewConversation(user);
                    }}
                  >
                    <span className="fw-bold fs-5">{user.name}</span>
                    <span className="ms-auto fs-6">
                      Joined on{" "}
                      {DateTime.fromISO(user.created_at).toFormat(
                        "dd/MM/yyyy HH:mm",
                      )}
                    </span>
                  </div>
                ))}
              </div>
              <Form.Control
                type="text"
                placeholder="Name..."
                onChange={(ev) => { }}
              />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => closeNewConversationModal()}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="d-flex h-100">
        <div className="d-flex flex-column border-end border-1 pe-4 me-4 gap-4"  >
          {conversations.map((conversation, index) => (
            <Conversation
              onClick={() => {
                setSelectedConversation(index);
                getConversationContents(conversation.id);
              }}
              profilePicture={conversation.profilePicture}
              key={conversation.id}

            >
              {conversation.title}

            </Conversation>

          ))}
          <hr />


          <Button onClick={() => openNewConversationModal()}>
            Start new conversation...
          </Button>
        </div>
        {selectedConversation > -1 ? (
          isChatLoading ? (
            <div className="d-flex justify-content-center align-items-center flex-grow-1">
              <p>Loading...</p>
            </div>
          ) : (
            <div className="d-flex flex-column flex-grow-1">
              <div className="d-flex gap-3 align-items-center">
                <img
                  src={
                    conversations[selectedConversation].profilePicture
                      ? `${API_URL}/api/images/${conversations[selectedConversation].profilePicture.id}`
                      : demoMentorImage
                  }
                  className="rounded-circle"
                  style={{
                    width: "32px",
                    height: "32px",
                    objectFit: "contain",
                  }}
                />
                <div className="d-flex flex-column">
                  <h5 className="m-0">
                    {conversations[selectedConversation].title}
                  </h5>
                  <h6 className="m-0">
                    {conversations[selectedConversation].role}
                  </h6>
                </div>
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
                    {messages[index - 1] === undefined || (messages[index - 1] !== undefined &&
                      messages[index - 1].sender.id !== msg.sender.id) ? (
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
                            msg.sender.id === profile.id
                              ? "#E1D9F3"
                              : "#F1F2F3",
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
                      <a
                        className="text-decoration-none"
                        href={`${API_URL}/api/chat/attachment/${msg.attachment.id}`}
                        download
                      >
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
                <div className="d-flex border rounded flex-grow-1 px-2 py-2">
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
                  <GrAttachment
                    style={{ cursor: "pointer" }}
                    className="ms-auto"
                    fontSize="24px"
                    onClick={() => filePicker.current.click()}
                  />
                </div>
                <LuSend
                  style={{ cursor: "pointer" }}
                  className="my-auto"
                  onClick={handleSubmitMessage}
                  fontSize="24px"
                />
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
      </div >
    </>
  );
}

export default Chat;
