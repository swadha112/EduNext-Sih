import React from 'react';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import './navbar.css'
const Mynavbar = () => {
  return (
    <Navbar bg="light" expand="lg" className="custom-navbar">
      <Container>
        
      
      <Navbar.Brand href="#home" className="ml-auto">EduNext</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
            <Nav.Link href="#about">About</Nav.Link>
            <NavDropdown title="Services" id="basic-nav-dropdown">
              <NavDropdown.Item href="#service1">Service 1</NavDropdown.Item>
              <NavDropdown.Item href="#service2">Service 2</NavDropdown.Item>
              <NavDropdown.Item href="#service3">Service 3</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href="#contact">Contact Us</Nav.Link>
          </Nav>
          <Nav className="mr-auto">
          <Nav.Link href="#login" className="custom-link">Login</Nav.Link>
          <Nav.Link href="#signup" className="custom-link">Signup</Nav.Link>
        </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Mynavbar;