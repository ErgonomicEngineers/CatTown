// src/pages/UserSessionPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/UserSessionPage.css';
import SessionTimer from '../components/SessionTimer/SessionTimer';
import pawIcon from '../assets/paw.png';
import reportIcon from '../assets/report_icon.png';
import catIcon from '../assets/cat.png';

const UserSessionPage = () => {
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [timerState, setTimerState] = useState('stopped'); // 'stopped', 'running', 'paused'

  const handleGiveUpClick = () => {
    setShowModal(true);
  };
  
  const handleCancel = () => {
    setShowModal(false);
  };
  
  const handleConfirmGiveUp = () => {
    handleTimerControl('stopped'); // resets the timer
    setShowModal(false);
  };

  // Simplified camera toggle
  const handleCameraToggle = async (e) => {
    const shouldEnable = e.target.checked;
    
    if (shouldEnable) {
      try {
        // Request camera access
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        
        // Stop the stream - we just needed to check access
        stream.getTracks().forEach(track => track.stop());
        
        // Enable camera if access is granted
        setCameraEnabled(true);
        console.log("Camera access granted and enabled");
      } catch (error) {
        console.error('Error accessing camera:', error);
        alert('Could not access camera. Please check your browser permissions.');
        // Make sure checkbox is unchecked if permission denied
        e.target.checked = false;
      }
    } else {
      // Turn off camera
      setCameraEnabled(false);
      console.log("Camera disabled");
    }
  };

  const handleTimerControl = (action) => {
    setTimerState(action);
  };

  return (
    <div className="session-page">
      <div className="session-card">
        {/* Camera permission toggle */}
        <div className="camera-permission">
          <span>For Cat Town to monitor your posture, please enable camera</span>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={cameraEnabled}
              onChange={handleCameraToggle}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        {/* Session Timer Component */}
        <SessionTimer
          initialTime="08:00:00"
          timerState={timerState}
          cameraEnabled={cameraEnabled} // Pass camera status to SessionTimer
        />

        {/* Timer Control Buttons */}
        <div className="timer-controls">
          {timerState === 'stopped' && (
            <button
              className="control-button start-button"
              onClick={() => handleTimerControl('running')}
            >
              Start
            </button>
          )}

          {timerState === 'running' && (
            <>
              <button
                className="control-button pause-button"
                onClick={() => handleTimerControl('paused')}
              >
                Pause
              </button>
              <button
                className="control-button stop-button"
                onClick={handleGiveUpClick}
              >
                Give Up
              </button>
            </>
          )}

          {timerState === 'paused' && (
            <>
              <button
                className="control-button resume-button"
                onClick={() => handleTimerControl('running')}
              >
                Resume
              </button>
              <button
                className="control-button stop-button"
                onClick={handleGiveUpClick}
              >
                Give Up
              </button>
            </>
          )}
        </div>

        {/* Item Buttons on the side */}
        <div className="side-buttons">
          <div className="tooltip-wrapper">
            <Link to="/townpreview" className="side-button">
              <img src={pawIcon} alt="Paw" />
            </Link>
            <span className="tooltip-text">Cat Town</span>
          </div>

          <div className="tooltip-wrapper">
            <Link to="/items" className="side-button">
              <img src={reportIcon} alt="Report" />
            </Link>
            <span className="tooltip-text">Posture Report</span>
          </div>

          <div className="tooltip-wrapper">
            <Link to="/videoposture" className="side-button">
              <img src={reportIcon} alt="Report" />
            </Link>
            <span className="tooltip-text">Posture Detection System</span>
          </div>
        </div>
        
        {/* Modal Overlay */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <img src={catIcon} alt="Cat Icon" className="modal-icon" />
              <h2>Are You Sure?</h2>
              <p>Your house won't get built, and the kitties won't have a cozy home!</p>
              <div className="modal-buttons">
                <button className="cancel-button" onClick={handleCancel}>Cancel</button>
                <button className="confirm-button" onClick={handleConfirmGiveUp}>Give Up</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserSessionPage;