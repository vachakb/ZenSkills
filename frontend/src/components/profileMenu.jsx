import React, { useState, useEffect, useRef } from "react";
import { Card, Button } from "react-bootstrap";
import { FaRegUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";


function ProfileMenu({ session }) {
  const [showMenu, setShowMenu] = useState(false);
  const isEditing = useLocation().state?.isEditing??false;
 
  const navigate = useNavigate();
 

  const menuRef = useRef(null);

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
      {/* Profile Icon */}
      <div
        onClick={toggleMenu}
        className="d-flex flex-column align-items-center"
        style={{ cursor: "pointer", color: "white" }}
      >
        <FaRegUserCircle size={"2.3em"} />
      </div>

      {/* Stylish Menu */}
      {showMenu && (
        <Card
          className="position-absolute start-50  mt-4"
          style={{
            backgroundColor: "#fff",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            width: "200px",
            borderRadius: "10px",
            zIndex: 10,
            transform: "translateX(-90%)",
          
          }}
        >
          <Card.Body className="d-flex flex-column align-items-center p-3">
            <div className="text-center mb-3">
              <FaRegUserCircle size={"3em"} className="mb-2" color="gray" />
              <h6 className="m-0">{session?.user?.name || "User"}</h6>
              <small className="text-muted">{session?.user?.email}</small>
            </div>
            <Button
              variant="outline-primary"
              className="w-100 mb-2"
             
              style={{ borderRadius: "20px" }}
              onClick={() => navigate("user_profile", { state: { isEditing: false} })}
            >
              View Profile
            </Button>
            <Button
              variant="outline-primary"
              className="w-100 mb-2"
              onClick={() => navigate("user_profile", { state: { isEditing: true } })}
              style={{ borderRadius: "20px" }}
              
            >
              {console.log(isEditing)}
              Edit Profile
            </Button>
            <Button
              variant="outline-primary"
              className="w-100 mb-2"
              href="/profile"
              style={{ borderRadius: "20px" }}
            >
              Settings
            </Button>
            <Button
              variant="outline-primary"
              className="w-100"
              onClick={() => {
                console.log("Logging out...");
              }}
              style={{ borderRadius: "20px" }}
            >
              Logout
            </Button>
            
          </Card.Body>
        </Card>
      )}
    </div>
  );
}

export default ProfileMenu;
