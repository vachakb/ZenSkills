import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { IoHomeOutline } from "react-icons/io5";
import { MdOutlineExplore } from "react-icons/md";
import { FaChalkboardTeacher, FaRegUserCircle } from "react-icons/fa";
import { FaRegClock } from "react-icons/fa6";
import { BiMessageDetail } from "react-icons/bi";
import { MdWorkOutline } from "react-icons/md";
import classNames from "classnames";

function SideBar(props) {
  const navbarClassname = classNames({
    "flex-column align-items-center d-md-block": true,
    "d-block": props.show,
    "d-none": !props.show
  });

  return (
    <Navbar
      bg="primary"
      expand="lg"
      className={navbarClassname}
      style={{ maxWidth: "18%" }}
    >
      <Nav
        className="flex-column align-items-center justify-content-between w-100"
        style={{ width: "100%", height: "100%" }}
      >
        <Nav.Link
          href=""
          className="d-flex flex-column align-items-center mb-2"
          style={{ color: "white", fontSize: "10px" }}
        >
          <IoHomeOutline color="white" size={"2.3em"} className="mb-1" />
          <span>Home</span>
        </Nav.Link>
        <Nav.Link
          href=""
          className="d-flex flex-column align-items-center mb-2"
          style={{ color: "white", fontSize: "10px" }}
        >
          <MdOutlineExplore color="white" size={"2.3em"} className="mb-1" />
          <span>Explore</span>
        </Nav.Link>
        <Nav.Link
          href=""
          className="d-flex flex-column align-items-center mb-2"
          style={{ color: "white", fontSize: "10px" }}
        >
          <FaChalkboardTeacher color="white" size={"2.3em"} className="mb-1" />
          <span>Workshops</span>
        </Nav.Link>
        <Nav.Link
          href=""
          className="d-flex flex-column align-items-center mb-2"
          style={{ color: "white", fontSize: "10px" }}
        >
          <FaRegClock color="white" size={"2em"} className="mb-1" />
          <span>Sessions</span>
        </Nav.Link>
        <Nav.Link
          href=""
          className="d-flex flex-column align-items-center mb-2"
          style={{ color: "white", fontSize: "10px" }}
        >
          <BiMessageDetail color="white" size={"2.3em"} className="mb-1" />
          <span>Messages</span>
        </Nav.Link>
        <Nav.Link
          href=""
          className="d-flex flex-column align-items-center mb-2"
          style={{ color: "white", fontSize: "10px" }}
        >
          <MdWorkOutline color="white" size={"2.3em"} className="mb-1" />
          <span>Jobs</span>
        </Nav.Link>
        <div className="mt-auto"></div>
        <Nav.Link
          href=""
          className="d-flex flex-column align-items-center mb-5 mt-auto"
          style={{ color: "white", fontSize: "10px" }}
        >
          <FaRegUserCircle color="white" size={"2.3em"} className="mb-1" />
          <span>Profile</span>
        </Nav.Link>
      </Nav>
    </Navbar>
  );
}

export default SideBar;
