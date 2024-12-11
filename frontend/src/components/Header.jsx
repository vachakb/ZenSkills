import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { GiHamburgerMenu } from "react-icons/gi";
import ProfileMenu from "./profileMenu";
import { useLocation } from "react-router-dom";
import useProfile from "../hooks/useProfile";
import NotificationMenu from "./NotificationMenu";
import { FaCoins, FaCreditCard } from 'react-icons/fa';
import CreditsModal from "./CreditsModal";

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
        <div className="d-flex align-items-center gap-4">
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

          {/* <Credits/> */}
          <div
            // onClick={toggleMenu}
            className="d-flex align-items-center gap-2 bg-light bg-opacity-25 rounded p-1 px-2"
            style={{ cursor: "pointer", color: "white" }}
            data-bs-toggle="modal" data-bs-target="#credits-modal"
          >
            <FaCoins style={{ fontSize: '18px', color: 'white' }} />
            {/* add api call here */}
            <span>100</span>
          </div>

          {/* credits modal */}
          <CreditsModal id="credits-modal"/>

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
