import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { IoHomeOutline } from "react-icons/io5";
import { MdOutlineExplore } from "react-icons/md";
import { FaChalkboardTeacher, FaRegUserCircle } from "react-icons/fa";
import { FaRegClock } from "react-icons/fa6";
import { BiMessageDetail } from "react-icons/bi";
import { MdWorkOutline } from "react-icons/md";
import classNames from "classnames";
import { useLocation } from "react-router-dom";  // To track current route
import ProfileMenu from "./profileMenu";
import useProfile from "../hooks/useProfile";

function SideBar(props) {
  const { profile } = useProfile();
  const location = useLocation();  // Get current route for conditional checks

  // Classnames for sidebar visibility (controlled by `show` prop passed from parent)
  const navbarClassname = classNames({
    "flex-column align-items-center d-md-block": true,
    "d-block": props.show,      // Sidebar visible when `show` is true
    "d-none": !props.show,      // Sidebar hidden when `show` is false
  });

  return (
    <Navbar
      bg="primary"
      expand="lg"
      className={navbarClassname}
      style={{ maxWidth: "18%" }}
    >
      <Nav
        className="flex-column align-items-center justify-content-between w-100 mt-1"
        style={{ width: "100%", height: "100%" }}
      >
        {/* Home link - Conditional based on session */}
        <Nav.Link
          href={profile?.role === "mentor" ? "/mentor_welcome" : "/mentee_welcome"}
          className="d-flex flex-column align-items-center mb-2"
          style={{ color: "white", fontSize: "10px" }}
        >
          <IoHomeOutline color="white" size={"2.3em"} className="mb-1" />
          <span>Home</span>
        </Nav.Link>

        {/* Explore link - Conditional for mentees */}
        <Nav.Link
          href={"/explore"}
          className="d-flex flex-column align-items-center mb-2"
          style={{ color: "white", fontSize: "10px" }}
        >
          <MdOutlineExplore color="white" size={"2.3em"} className="mb-1" />
          <span>Explore</span>
        </Nav.Link>

        {/* Workshops link */}
        <Nav.Link
          href="/workshops"
          className="d-flex flex-column align-items-center mb-2"
          style={{ color: "white", fontSize: "10px" }}
        >
          <FaChalkboardTeacher color="white" size={"2.3em"} className="mb-1" />
          <span>Workshops</span>
        </Nav.Link>

        {/* Sessions link */}
        <Nav.Link
          href="/sessions"
          className="d-flex flex-column align-items-center mb-2"
          style={{ color: "white", fontSize: "10px" }}
        >
          <FaRegClock color="white" size={"2em"} className="mb-1" />
          <span>Sessions</span>
        </Nav.Link>

        {/* Messages link */}
        <Nav.Link
          href="/chat"
          className="d-flex flex-column align-items-center mb-2"
          style={{ color: "white", fontSize: "10px" }}
        >
          <BiMessageDetail color="white" size={"2.3em"} className="mb-1" />
          <span>Messages</span>
        </Nav.Link>

        {/* Jobs link */}
        <Nav.Link
          href="/jobs"
          className="d-flex flex-column align-items-center mb-2"
          style={{ color: "white", fontSize: "10px" }}
        >
          <MdWorkOutline color="white" size={"2.3em"} className="mb-1" />
          <span>Jobs</span>
        </Nav.Link>

        {/* Profile link */}
        <div className="mt-auto"></div>

      </Nav>
    </Navbar>
  );
}

export default SideBar;
