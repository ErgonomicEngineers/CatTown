// src/pages/UserSessionPage.jsx
import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/UserSessionPage.css';
import SessionTimer from '../components/SessionTimer/SessionTimer';
import pawIcon from '../assets/paw.png';
import reportIcon from '../assets/report_icon.png';
import catIcon from '../assets/cat.png';
import { PostureContext } from '../context/PostureContext';
import videoIcon from '../assets/video.png';
import homeIcon from '../assets/4-01.png';
import completedHouse from '../assets/completed-house.png';
import incompleteHouse from '../assets/incomplete_house.png'; // You'll need to add this image

const UserSessionPage = () => {
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [timerState, setTimerState] = useState('stopped'); // 'stopped', 'running', 'paused'
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [buildingCompleted, setBuildingCompleted] = useState(false);

  // Get posture tracking functions from context
  const { startTracking, stopTracking, isTracking } = useContext(PostureContext);

  // Check if tracking was previously enabled
  useEffect(() => {
    console.log("Current tracking state:", isTracking);
  }, [isTracking]);

  const handleGiveUpClick = () => {
    setShowModal(true);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const handleConfirmGiveUp = () => {
    // When giving up, show incomplete construction page
    setSessionCompleted(true);
    setBuildingCompleted(false); // Always incomplete when giving up

    handleTimerControl('stopped'); // Reset the timer
    setShowModal(false);
  };

  const handleCameraToggle = async (e) => {
    const shouldEnable = e.target.checked;

    if (shouldEnable) {
      try {
        // Request camera access
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });

        // Stop the stream - we just needed to check access
        stream.getTracks().forEach(track => track.stop());

        // Enable camera
        setCameraEnabled(true);

        // Start posture tracking in the context
        startTracking();

        console.log("Camera enabled and tracking started");
      } catch (error) {
        console.error('Error accessing camera:', error);
        alert('Could not access camera. Please check your browser permissions.');
        // Make sure checkbox is unchecked if permission denied
        e.target.checked = false;
      }
    } else {
      // Disable camera
      setCameraEnabled(false);

      // Stop posture tracking in the context
      stopTracking();

      console.log("Camera disabled and tracking stopped");
    }
  };

  const handleTimerControl = (action) => {
    setTimerState(action);

    if (action === 'paused') {
      stopTracking();           // Pause posture tracking
      setCameraEnabled(false);  // Also visually toggle the camera off
    }

    if (action === 'running' && cameraEnabled) {
      startTracking();
      setCameraEnabled(true);
      // Resume posture tracking
    }

    if (action === 'stopped') {
      stopTracking();           // Also stop posture tracking if timer is reset
      setCameraEnabled(false);  // And update camera switch UI
    }
  };

  // Handle session completion with building status
  const handleSessionComplete = (isFullyBuilt) => {
    // Log the received value immediately
    console.log(`Received building status from timer: ${isFullyBuilt}`);
    
    // Set session state
    setSessionCompleted(true);
    
    // Set building completion status - this determines which image is shown
    setBuildingCompleted(isFullyBuilt);
  
    // Also stop tracking when session completes
    stopTracking();
    setCameraEnabled(false);
  
    console.log(`Session completed with building ${isFullyBuilt ? 'COMPLETE' : 'INCOMPLETE'}`);
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
        {sessionCompleted ? (
          <div className="session-complete-wrapper">
            <h2>{buildingCompleted ? "New Building in Town!" : "Incomplete Construction "}</h2>
            <p>{buildingCompleted
              ? "Great job maintaining good posture! The cats have a cozy new home!"
              : "We need better posture to finish this building. We cats know you can do better next time!"}</p>
            <img
              src={buildingCompleted ? completedHouse : incompleteHouse}
              alt={buildingCompleted ? "Completed building" : "Incomplete building"}
              className="building-gif"
              style={{ width: '400px', height: '400px' }}
            />
            <button className="new-session-button" onClick={() => window.location.reload()}>
              New Session
            </button>
          </div>
        ) : (
          <>
            <SessionTimer
              initialTime="08:00:00"
              timerState={timerState}
              cameraEnabled={cameraEnabled}
              onSessionComplete={handleSessionComplete}
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
          </>
        )}


        {/* Item Buttons on the side */}
        <div className="side-buttons">
          <div className="tooltip-wrapper">
            <Link to="/" className="side-button">
              <img src={homeIcon} alt="Home" style={{ width: '50px', height: '50px' }} />
            </Link>
            <span className="tooltip-text">User Home</span>
          </div>
          <div className="tooltip-wrapper">
            {sessionCompleted && buildingCompleted && (
              <div className="speech-bubble">Try placing your new<br />building in Cat Town!</div>
            )}
            <Link to="/townpreview" className="side-button">
              <img src={pawIcon} alt="Paw" />
            </Link>
            <span className="tooltip-text">Cat Town</span>
          </div>

          <div className="tooltip-wrapper">
            <Link to="/posturereport" className="side-button">
              <img src={reportIcon} alt="Report" />
            </Link>
            <span className="tooltip-text">Posture Report</span>
    
          </div>

          <div className="tooltip-wrapper">
            <Link to="/videoposture" className="side-button">
              <img src={videoIcon} alt="Report" style={{ width: '100px', height: '100px' }} />
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