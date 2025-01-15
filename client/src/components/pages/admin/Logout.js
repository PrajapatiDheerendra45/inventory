import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Logout() {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Clear session storage
    sessionStorage.removeItem("dauth");

    // Show the "Thank you" popup
    setShowPopup(true);

    // Hide popup after 5 seconds and reload the page
    const timer = setTimeout(() => {
      setShowPopup(false);
      navigate('/');
      window.location.reload(); // Reload the page
  
    }, 5000);

    // Redirect to home after logout
   

    // Cleanup the timer on component unmount
    return () => clearTimeout(timer);
  }, [navigate]);

  // Function to manually close the popup
  const handleClosePopup = () => {
    setShowPopup(false);
    window.location.reload(); // Reload the page when closed
  };

  return (
    <div>
      Logging out...
      {showPopup && (
        <div style={popupStyles}>
          <div>Thank you for being with us! We look forward to welcoming you back soon..!</div>
          <button onClick={handleClosePopup} style={buttonStyles}>Close</button>
        </div>
      )}
    </div>
  );
}

// Simple inline styles for the popup
const popupStyles = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  color: 'red',
  padding: '50px',
  borderRadius: '10px',
  zIndex: 1000,
  textAlign: 'center',
  fontSize: '28px'
};

// Styles for the Close button
const buttonStyles = {
  marginTop: '15px',
  padding: '10px 20px',
  backgroundColor: '#f44336',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer'
};

export default Logout;
