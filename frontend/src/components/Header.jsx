import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { GiHamburgerMenu } from "react-icons/gi";
import ProfileMenu from "./profileMenu";
import { useLocation } from "react-router-dom";
import useProfile from "../hooks/useProfile";
import NotificationMenu from "./NotificationMenu";

function Header({ onToggleSideBar, headerRef }) {
  const { profile } = useProfile();
  const location = useLocation();
  return (
    <Navbar
      expand="lg"
      className="bg-primary px-4 d-flex align-items-center"
      ref={headerRef}
    >
      <Navbar.Brand href="/" className="text-white">
        ZenSkills
      </Navbar.Brand>
      <Nav className="ms-auto d-flex align-items-center gap-4">
        <div className="d-flex align-items-center gap-3">
          {/* <img src="/bell.svg" alt="Notifications" style={{ width: "28px" }} /> */}
          {/* Notifications */}
          <NotificationMenu
            notifications={[
              {
                // icon: "/alert-icon.svg",
                message: "New comment on your post",
                time: "2 mins ago",
                link: "/comments",
              },
              {
                // icon: "/info-icon.svg",
                message: "System update available",
                time: "1 hour ago",
                link: "/updates",
              },
            ]}
          />

          <GiHamburgerMenu
            color="white"
            size="1.8em"
            onClick={onToggleSideBar}
            className="d-md-none"
            style={{ cursor: "pointer" }}
          />

          <Nav.Link
            // href="/register"  // Link to user profile page
            className="d-flex flex-column align-items-center mb-0"
            style={{ color: "white", fontSize: "10px" }}
          >
            <ProfileMenu profile={profile} />
            {/* <FaRegUserCircle color="white" size={"2.3em"} className="mb-1" /> */}
            {/* <span>Profile</span> */}
          </Nav.Link>
        </div>
      </Nav>
    </Navbar>
  );
}

export default Header;
