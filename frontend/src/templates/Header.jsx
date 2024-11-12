import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { ServiceBell16Filled } from '@fluentui/react-icons';
function Header() {
    return (
        <Navbar expand="lg" className='bg-primary'>
        <Container>
          <Navbar.Brand href="/" className='text-white'>ZenSkills</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Nav>
            <Nav.Link><img src="/bell.svg" style={{width:'28px'}} /></Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    
    )
    
}
export default Header;