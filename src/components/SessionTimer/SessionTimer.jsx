// src/components/SessionTimer/SessionTimer.jsx
import React, { useState, useEffect, useRef, useContext } from 'react';
import './SessionTimer.css';
import catGif from "../../assets/cat_build0.gif";
import orangeCatIcon from "../../assets/catDot.png";
import Notification from '../Notifications/Notifications';
import { PostureContext } from '../../context/PostureContext';
import completedHouse from '../../assets/completed-house.png';

const SessionTimer = ({ initialTime = '08:00:00', timerState = 'stopped', cameraEnabled = false }) => {
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
  const [currentGif, setCurrentGif] = useState(catGif);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  const timerRef = useRef(null);
  const totalSecondsRef = useRef(hours * 3600 + minutes * 60 + seconds);
  const startTimeRef = useRef(totalSecondsRef.current);
  const lastNotificationTimeRef = useRef(0);
  const badPostureCountRef = useRef(0);
  const goodPostureStreakRef = useRef(0);
  const badPostureDurationRef = useRef(0);
  const lastScoreRef = useRef(null);
  const lastScoreTimeRef = useRef(0);

  useEffect(() => {
    if (timerState === 'stopped') {
      totalSecondsRef.current = hours * 3600 + minutes * 60 + seconds;
      startTimeRef.current = totalSecondsRef.current;
    }
  }, [hours, minutes, seconds, timerState]);

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
    if (timerRef.current) clearInterval(timerRef.current);

    if (timerState === 'running') {
      setIsEditing(false);
      setSessionCompleted(false);
      if (cameraEnabled) {
        setTimeout(() => showNotification("neutral"), 1000);
      }
      timerRef.current = setInterval(() => {
        if (totalSecondsRef.current <= 0) {
          clearInterval(timerRef.current);
          handleSessionEnd();
          return;
        }
        totalSecondsRef.current -= 1;
        const newHours = Math.floor(totalSecondsRef.current / 3600);
        const newMinutes = Math.floor((totalSecondsRef.current % 3600) / 60);
        const newSeconds = totalSecondsRef.current % 60;
        setHours(newHours);
        setMinutes(newMinutes);
        setSeconds(newSeconds);
        const elapsedTime = startTimeRef.current - totalSecondsRef.current;
        const progressPercent = Math.min(100, (elapsedTime / startTimeRef.current) * 100);
        setProgress(progressPercent);
      }, 1000);
    } else if (timerState === 'paused') {
      setIsEditing(false);
    } else if (timerState === 'stopped') {
      setHours(8);
      setMinutes(0);
      setSeconds(0);
      setIsEditing(true);
      setProgress(0);
      setSessionCompleted(false);
      badPostureCountRef.current = 0;
      goodPostureStreakRef.current = 0;
      badPostureDurationRef.current = 0;
      lastScoreRef.current = null;
      setCurrentGif(catGif);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerState, cameraEnabled]);

  const handleSessionEnd = () => {
    setSessionCompleted(true);
    const isSuccessful = badPostureCountRef.current < 5;
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
          <img src={currentGif} alt="Cat animation" className="cat-image" />
        </div>
      </div>
      {sessionCompleted && (
          <div className="session-complete-ui">
          <h2>New Building in Town!</h2>
          <p>We cats know you can do this, human!</p>
          <img
            src={completedHouse} // change to your final asset
            alt="New building"
            className="building-gif"
          />
          <button
            className="new-session-button"
            onClick={() => window.location.reload()} // or optionally reset internal state
          >
            New Session
          </button>
        </div>
      )}
    </div>
  );
};

export default SessionTimer;