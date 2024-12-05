import React, { useState, useEffect, useRef } from "react";
import { Card } from "react-bootstrap";
import { IoNotificationsOutline } from "react-icons/io5"; // Icon for notifications
import { useNavigate } from "react-router-dom";

function NotificationMenu({ notifications }) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  const navigate = useNavigate();

  const toggleMenu = () => setShowMenu((prev) => !prev);

  // Close the menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="position-relative" ref={menuRef}>
      {/* Notification Icon */}
      <div
        onClick={toggleMenu}
        className="d-flex flex-column align-items-center"
        style={{ cursor: "pointer", color: "white" }}
      >
        <IoNotificationsOutline size={"1.6em"} />
      </div>

      {/* Notification Menu */}
      {showMenu && (
        <Card
          className="position-absolute start-50 mt-4"
          style={{
            backgroundColor: "#fff",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            width: "300px",
            borderRadius: "10px",
            zIndex: 10,
            transform: "translateX(-90%)",
          }}
        >
          <Card.Body className="p-3">
            <h6 className="text-center">Notifications</h6>
            <div className="notification-list">
              {notifications && notifications.length > 0 ? (
                notifications.map((notif, index) => (
                  <div
                    key={index}
                    className="d-flex align-items-center mb-3"
                    style={{
                      cursor: "pointer",
                      borderBottom: "1px solid #eaeaea",
                      paddingBottom: "8px",
                    }}
                    onClick={() => navigate(notif.link)}
                  >
                    {/* <img
                      src={notif.icon || "/notification-default.svg"}
                      alt="Notification Icon"
                      style={{ width: "40px", marginRight: "10px" }}
                    /> */}
                    <div>
                      <p className="mb-1" style={{ fontSize: "14px" }}>
                        {notif.message}
                      </p>
                      <small className="text-muted">{notif.time}</small>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted">No notifications</p>
              )}
            </div>
          </Card.Body>
        </Card>
      )}
    </div>
  );
}

export default NotificationMenu;
