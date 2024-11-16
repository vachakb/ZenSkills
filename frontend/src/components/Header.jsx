import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { ServiceBell16Filled } from "@fluentui/react-icons";
import { GiTwoCoins } from "react-icons/gi";
function Header() {
  return (
    <Navbar expand="lg" className="bg-primary px-4">
      <Navbar.Brand href="/" className="text-white">
        ZenSkills
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Nav className="ms-auto">
        <Nav.Link>
          <img src="/bell.svg" style={{ width: "28px", marginRight: "20px" }} />
        </Nav.Link>
        <Nav.Link>
          <GiTwoCoins
            color="#ffa426"
            size={"1.5em"}
            style={{ width: "28px" }}
          />
        </Nav.Link>
      </Nav>
    </Navbar>
  );
}
export default Header;
