import { useEffect, useMemo, useRef, useState } from "react";
import useProfile from "../hooks/useProfile";
import useWebSocket from "react-use-websocket";
import { getAllConversations } from "../apis/chat";
import { Button, Form } from "react-bootstrap";
import classNames from "classnames";

function Conversation({ children, onClick }) {
  return (
    <div style={{ cursor: "pointer" }} className="px-1" onClick={onClick}>
      {children}
    </div>
  );
}

function Chat() {
  const profile = useProfile();

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
    const payload = {
      type: "MESSAGE",
      content: message,
      conversation_id: conversations[selectedConversation].id,
    };
    //setMessages([...messages, payload]);
    sendJsonMessage(payload);
    setMessage("");
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
              {messages.map((msg) => (
                <div
                  className={classNames({
                    "d-flex flex-column gap-2": true,
                    "ms-auto me-2": msg.sender.id === profile.id,
                    "me-auto ms-2": msg.sender.id !== profile.id,
                  })}
                  key={msg.id}
                >
                  <h6
                    style={{
                      textAlign:
                        msg.sender.id === profile.id ? "right" : "left",
                    }}
                    className="m-0"
                  >
                    {msg.sender.name}
                  </h6>
                  <div
                    style={{
                      backgroundColor:
                        msg.sender.id === profile.id ? "#E1D9F3" : "#F1F2F3",
                      borderRadius: "20px",
                      cursor:
                        // value.payload && value.payload.isFile
                        false ? "pointer" : "unset",
                      wordBreak: "break-word",
                    }}
                    className="px-3 py-2 fs-6"
                    onClick={
                      //value.payload && value.payload.isFile
                      false
                        ? () =>
                            downloadFile(value.message, value.payload.fileName)
                        : undefined
                    }
                  >
                    <span>{msg.content}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="d-flex justify-content-center gap-2 w-100">
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
