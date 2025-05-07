// src/components/SessionTimer/SessionTimer.jsx
import React, { useState, useEffect, useRef, useContext } from 'react';
import './SessionTimer.css';
import catGif0 from "../../assets/build0.gif";
import catGif1 from "../../assets/build1.gif";
import catGif2 from "../../assets/build2.gif";
import catGif3 from "../../assets/build3.gif";
import catGif4 from "../../assets/build4.gif";
import orangeCatIcon from "../../assets/catDot.png";
import Notification from '../Notifications/Notifications';
import { PostureContext } from '../../context/PostureContext';

const SessionTimer = ({ initialTime = '08:00:00', timerState = 'stopped', cameraEnabled = false, onSessionComplete }) => {
  const parseTime = (timeString) => {
    const parts = timeString.split(':');
    if (parts.length === 2) {
      return {
        hours: 0,
        minutes: parseInt(parts[0], 10) || 0,
        seconds: parseInt(parts[1], 10) || 0
      };
    } else if (parts.length === 3) {
      return {
        hours: parseInt(parts[0], 10) || 0,
        minutes: parseInt(parts[1], 10) || 0,
        seconds: parseInt(parts[2], 10) || 0
      };
    }
    return { hours: 8, minutes: 0, seconds: 0 };
  };

  const initialTimeParsed = parseTime(initialTime);
  const [hours, setHours] = useState(initialTimeParsed.hours);
  const [minutes, setMinutes] = useState(initialTimeParsed.minutes);
  const [seconds, setSeconds] = useState(initialTimeParsed.seconds);
  const [progress, setProgress] = useState(0);
  const [isEditing, setIsEditing] = useState(true);

  const postureContext = useContext(PostureContext);
  const postureScore = postureContext ? postureContext.score : null;
  const [notification, setNotification] = useState({ type: null, key: 0 });

  // Building progress state
  const [buildLevel, setBuildLevel] = useState(0);
  const [currentGif, setCurrentGif] = useState(catGif0);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  // Array of building GIFs for easy access (5 total including build0)
  const buildGifs = [catGif0, catGif1, catGif2, catGif3, catGif4];

  // Refs for timer and posture tracking
  const timerRef = useRef(null);
  const totalSecondsRef = useRef(hours * 3600 + minutes * 60 + seconds);
  const startTimeRef = useRef(totalSecondsRef.current);
  const lastNotificationTimeRef = useRef(0);
  const badPostureCountRef = useRef(0);
  const goodPostureStreakRef = useRef(0);
  const badPostureDurationRef = useRef(0);
  const lastScoreRef = useRef(null);
  const lastScoreTimeRef = useRef(0);

  // Refs for tracking consecutive good/bad posture for building changes
  const goodPostureTimeRef = useRef(0);
  const badPostureTimeRef = useRef(0);
  const buildingUpdateTimeRef = useRef(0);

  useEffect(() => {
    if (timerState === 'stopped') {
      totalSecondsRef.current = hours * 3600 + minutes * 60 + seconds;
      startTimeRef.current = totalSecondsRef.current;
    }
  }, [hours, minutes, seconds, timerState]);

  // Effect to start with build1 when timer starts
  useEffect(() => {
    if (timerState === 'running' && buildLevel === 0) {
      setBuildLevel(1);
      setCurrentGif(buildGifs[1]);
    }
  }, [timerState, buildLevel]);

  // Effect to update building based on posture score
  useEffect(() => {
    if (!cameraEnabled || postureScore === null || timerState !== 'running') {
      // Reset tracking times when conditions not met
      goodPostureTimeRef.current = 0;
      badPostureTimeRef.current = 0;
      return;
    }

    const now = Date.now();
    const timeSinceLastUpdate = now - buildingUpdateTimeRef.current;
    buildingUpdateTimeRef.current = now;

    // Update posture tracking time based on score
    if (postureScore >= 8) { // Good posture
      goodPostureTimeRef.current += timeSinceLastUpdate;
      badPostureTimeRef.current = 0; // Reset bad time counter

      // If good posture maintained for 5 seconds (5000ms)
      if (goodPostureTimeRef.current >= 200) {
        // Increment building level up to max (level 4)
        if (buildLevel < 4) {
          const newLevel = buildLevel + 1;
          setBuildLevel(newLevel);
          setCurrentGif(buildGifs[newLevel]);
          console.log(`Building upgraded to level ${newLevel} due to good posture!`);
        }
        goodPostureTimeRef.current = 0; // Reset counter after upgrade
      }
    }
    // Update the poor posture section in the useEffect for updating building based on posture score

    // Modify this part:
    else if (postureScore < 3) { // Bad posture
      badPostureTimeRef.current += timeSinceLastUpdate;
      goodPostureTimeRef.current = 0; // Reset good time counter

      // CHANGE THIS TO 200ms to match the good posture upgrade speed
      if (badPostureTimeRef.current >= 200) {
        // Decrement building level down to min (level 0)
        if (buildLevel > 0) {
          const newLevel = buildLevel - 1;
          setBuildLevel(newLevel);
          setCurrentGif(buildGifs[newLevel]);
          console.log(`Building downgraded to level ${newLevel} due to bad posture!`);
        }
        badPostureTimeRef.current = 0; // Reset counter after downgrade
      }
    }
    else { // Neutral posture
      // Reset both counters - building stays the same
      goodPostureTimeRef.current = 0;
      badPostureTimeRef.current = 0;
    }
  }, [postureScore, cameraEnabled, timerState, buildLevel]);

  // Effect for notifications based on posture score
  useEffect(() => {
    if (!cameraEnabled || postureScore === null || timerState !== 'running') return;

    const interval = setInterval(() => {
      const now = Date.now();
      const timeSinceLastScore = now - lastScoreTimeRef.current;
      lastScoreTimeRef.current = now;

      // POSTURE NOTIFICATION LOGIC
      if (postureScore < 3) {
        showNotification('bad');
        badPostureCountRef.current += 1;
        goodPostureStreakRef.current = 0;
        lastScoreRef.current = postureScore;
        return;
      }

      if (postureScore >= 3 && postureScore <= 7) {
        showNotification('neutral');
        badPostureDurationRef.current = 0;
        lastScoreRef.current = postureScore;
        return;
      }

      if (postureScore > 7) {
        showNotification('good');
        goodPostureStreakRef.current += 1;
        badPostureDurationRef.current = 0;
        lastScoreRef.current = postureScore;
      }
    }, 5000); // every 5 seconds

    return () => clearInterval(interval);
  }, [postureScore, cameraEnabled, timerState]);

  const showNotification = (type) => {
    setNotification({ type, key: Date.now() });
  };

  const handleNotificationDismiss = () => {
    setNotification({ type: null, key: 0 });
  };

  useEffect(() => {
    if (!cameraEnabled || postureScore === null || timerState !== 'running') {
      // Reset tracking times when conditions not met
      goodPostureTimeRef.current = 0;
      badPostureTimeRef.current = 0;
      return;
    }

    const now = Date.now();
    const timeSinceLastUpdate = now - buildingUpdateTimeRef.current;
    buildingUpdateTimeRef.current = now;

    // Update posture tracking time based on score
    if (postureScore >= 8) { // Good posture
      goodPostureTimeRef.current += timeSinceLastUpdate;
      badPostureTimeRef.current = 0; // Reset bad time counter

      // If good posture maintained for 200ms (reduced for faster upgrades)
      if (goodPostureTimeRef.current >= 200) {
        // Increment building level up to max (level 4)
        if (buildLevel < 4) {
          const newLevel = buildLevel + 1;
          setBuildLevel(newLevel);
          setCurrentGif(buildGifs[newLevel]);
          console.log(`Building upgraded to level ${newLevel} due to good posture!`);
        }
        goodPostureTimeRef.current = 0; // Reset counter after upgrade
      }
    }
    else if (postureScore < 3) { // Bad posture
      badPostureTimeRef.current += timeSinceLastUpdate;
      goodPostureTimeRef.current = 0; // Reset good time counter

      // If bad posture maintained for 200ms (reduced for faster downgrades)
      if (badPostureTimeRef.current >= 200) {
        // Decrement building level down to min (level 0)
        if (buildLevel > 0) {
          const newLevel = buildLevel - 1;
          setBuildLevel(newLevel);
          setCurrentGif(buildGifs[newLevel]);
          console.log(`Building downgraded to level ${newLevel} due to bad posture!`);
        }
        badPostureTimeRef.current = 0; // Reset counter after downgrade
      }
    }
    else { // Neutral posture
      // Reset both counters - building stays the same
      goodPostureTimeRef.current = 0;
      badPostureTimeRef.current = 0;
    }
  }, [postureScore, cameraEnabled, timerState, buildLevel]);

  const handleSessionEnd = () => {
    setSessionCompleted(true);


    // Log the current build level for debugging
    console.log(`Session ended with building level: ${buildLevel}`);

    // Pass building completion status to parent component
    if (onSessionComplete) {
      const isFullyBuilt = buildLevel === 4;
      console.log(`Sending completion status to parent: ${isFullyBuilt}`);
      onSessionComplete(isFullyBuilt);
    }

    // Show a completion notification based on building level
    const isSuccessful = buildLevel === 4;
    showNotification(isSuccessful ? 'good' : 'bad');
  };

  const radius = 250;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  const indicatorAngle = (progress / 100) * 2 * Math.PI - Math.PI / 2;
  const indicatorX = 275 + radius * Math.cos(indicatorAngle);
  const indicatorY = 275 + radius * Math.sin(indicatorAngle);

  const handleTimeChange = (e) => {
    if (timerState !== 'stopped') return;
    const { name, value } = e.target;
    const numValue = parseInt(value, 10) || 0;
    if (name === 'hours') setHours(Math.max(0, Math.min(23, numValue)));
    else if (name === 'minutes') setMinutes(Math.max(0, Math.min(59, numValue)));
    else if (name === 'seconds') setSeconds(Math.max(0, Math.min(59, numValue)));
  };

  const formatTimeDisplay = () => {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getProgressColor = () => {
    if (!cameraEnabled || postureScore === null) return "#222222";
    if (postureScore >= 8) return "#4CAF50";
    if (postureScore >= 5) return "#FF9800";
    return "#F44336";
  };

  const getPostureScoreLabel = () => {
    if (!cameraEnabled || postureScore === null) return "Posture Tracking Off";
    if (postureScore >= 8) return "Excellent Posture";
    if (postureScore >= 5) return "Average Posture";
    return "Poor Posture";
  };

  const getPostureScoreClass = () => {
    if (!cameraEnabled || postureScore === null) return "off";
    if (postureScore >= 8) return "good";
    if (postureScore >= 5) return "neutral";
    return "bad";
  };

  return (
    <div className="session-timer">
      {notification.type && (
        <Notification
          key={notification.key}
          type={notification.type}
          duration={7000}
          onDismiss={handleNotificationDismiss}
        />
      )}

      <div className="timer-circle-container">
        <svg width="550" height="550" viewBox="0 0 550 550">
          <circle cx="275" cy="275" r={radius} fill="none" stroke="#E6E6E6" strokeWidth="10" />
          <circle
            cx="275"
            cy="275"
            r={radius}
            fill="none"
            stroke={getProgressColor()}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 275 275)"
            className="progress-circle"
          />
          <image href={orangeCatIcon} x={indicatorX - 25} y={indicatorY - 25} width="50" height="50" className="progress-indicator" />
        </svg>
        <div className="time-display">
          {/* Posture Score Widget instead of Session Length label */}
          <div className={`posture-score-widget ${getPostureScoreClass()}`}>
            {cameraEnabled && postureScore !== null ? (
              <>
                <span className="posture-score-value">{postureScore}/10</span>
                <span className="posture-score-label">{getPostureScoreLabel()}</span>
              </>
            ) : (
              <span className="posture-tracking-off">Session Length</span>
            )}
          </div>

          <div className="time-labels-row">
            <span className="time-unit-label">hr</span>
            <span className="time-unit-label time-unit-spacer"></span>
            <span className="time-unit-label">m</span>
            <span className="time-unit-label time-unit-spacer"></span>
            <span className="time-unit-label">s</span>
          </div>
          {isEditing ? (
            <div className="time-input-container">
              <div className="time-group">
                <input type="number" name="hours" value={hours.toString().padStart(2, '0')} onChange={handleTimeChange} min="0" max="23" className="time-input" />
                <span className="colon">:</span>
              </div>
              <div className="time-group">
                <input type="number" name="minutes" value={minutes.toString().padStart(2, '0')} onChange={handleTimeChange} min="0" max="59" className="time-input" />
                <span className="colon">:</span>
              </div>
              <div className="time-group">
                <input type="number" name="seconds" value={seconds.toString().padStart(2, '0')} onChange={handleTimeChange} min="0" max="59" className="time-input" />
              </div>
            </div>
          ) : (
            <div className="time-value">{formatTimeDisplay()}</div>
          )}
        </div>

        <div className="cat-animation">
          <img
            src={currentGif}
            alt={`Building level ${buildLevel}`}
            className="cat-image"
            style={{
              transition: 'width 0.3s'  // Smooth transition when size changes
            }}
          />
          <div className="building-level-indicator">
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionTimer;