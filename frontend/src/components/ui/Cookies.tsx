import React from 'react';
import { Button, Modal } from 'react-bootstrap';

// onAction acts as bridge from parent comp notifing when
// user interact with cookies modal [REACT-GOOD-PRACTICES]
const Cookies: React.FC<{ onAction: (accepted: boolean) => void }> = ({
  onAction,
}) => {
  const handleAccept = () => {
    localStorage.setItem('cookies_consent_shown', 'true');
    onAction(true);
  };

  const handleDecline = () => {
    localStorage.setItem('cookies_consent_shown', 'false');
    onAction(false);
  };

  return (
    <Modal show centered backdrop="static">
      <Modal.Header>
        <Modal.Title>Cookies Consent</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          This site uses cookies to run properly and improve your experience. Do
          you allow it?
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
  );
};

export default Cookies;
