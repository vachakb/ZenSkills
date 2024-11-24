import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { GiHamburgerMenu } from "react-icons/gi";

function Header({ onToggleSideBar }) {
  return (
    <Navbar expand="lg" className="bg-primary px-4 d-flex align-items-center">
      <Navbar.Brand href="/" className="text-white">
        ZenSkills
      </Navbar.Brand>
      <Nav className="ms-auto d-flex align-items-center gap-3">
        <div className="d-flex align-items-center gap-3">
          <img src="/bell.svg" alt="Notifications" style={{ width: "28px" }} />
          <GiHamburgerMenu
            color="white"
            size="1.8em"
            onClick={onToggleSideBar}
            className="d-md-none"
            style={{ cursor: "pointer" }}
          />
        </div>
      </Nav>
    </Navbar>
  );
}

export default Header;
