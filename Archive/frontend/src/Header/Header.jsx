import React from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import doctorLogo from "../assets/Doctor-Tool.png";

const Header = () => {
    return ( 
        <>
        <Navbar bg="dark" data-bs-theme="dark" sticky="top">
        <Container>
          <Navbar.Brand href="#home">
            <img
              alt="Doctor App Header Logo"
              src={doctorLogo}
              width="100"
              className="d-inline-block align-top"
            />{' '}
            Dr. App
          </Navbar.Brand>
        </Container>
      </Navbar>
        </>
     );
}

export default Header;