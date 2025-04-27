import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../services/authService';

// onAction acts as bridge from parent comp notifing when
// user interact with cookies modal [REACT-GOOD-PRACTICES]
const Cookies: React.FC<{ onAction: () => void }> = ({ onAction }) => {
  const redirect = useNavigate();
  const [show, setShow] = useState(true);
  // eslint-disable-next-line
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAccept = () => {
    // save consent
    localStorage.setItem('cookies_consent_shown', 'true');
    setShow(false);
    setIsAuthenticated(true);
    onAction();
  };

  const handleDecline = () => {
    localStorage.setItem('cookies_consent_shown', 'false');
    setShow(false);
    setIsAuthenticated(false);
    onAction();
    // redirect to login if cookies not accepted
    logout(redirect, setIsAuthenticated);
  };

  return (
    // return cookies modal
    <>
      <Modal show={show} centered backdrop="static">
        <Modal.Header>
          <Modal.Title>Cookies Consent</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            This site uses cookies to run properly and improve your experience.
            Do you allow it?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDecline}>
            Deny Cookies
          </Button>
          <Button variant="primary" onClick={handleAccept}>
            Accept Cookies
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Cookies;
