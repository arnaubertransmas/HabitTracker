import React from 'react';
import { Link } from 'react-router-dom';

const Welcome = () => {
  const linkStyle = {
    backgroundColor: '#4169E1',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1.1rem',
  };
  return (
    <div className="container text-center py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h1 className="display-4 fw-bold mb-4">
            Track your habits
            <br />
            Elevate your life
          </h1>

          <p className="lead mb-5">
            Take control of your daily routines to boost productivity and reach
            your goals faster.
          </p>

          <Link
            to="/signup"
            role="button"
            className="btn btn-primary btn-lg px-5 py-3"
            style={linkStyle}
          >
            Try Habit Tracker
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
