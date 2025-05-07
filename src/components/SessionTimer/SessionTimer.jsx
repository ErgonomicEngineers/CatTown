// src/components/SessionTimer/SessionTimer.jsx
import React, { useState, useEffect, useRef } from 'react';
import './SessionTimer.css';
import catGif from "../../assets/cat_build0.gif"
import orangeCatIcon from "../../assets/catDot.png"


const SessionTimer = ({ initialTime = '08:00:00', timerState = 'stopped' }) => {
  // Parse initial time (format: "MM:SS" or "HH:MM:SS")
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
    // Default - ensure values are padded
    return { hours: 8, minutes: 0, seconds: 0 };
  };

  const initialTimeParsed = parseTime(initialTime);

  // Timer states
  const [hours, setHours] = useState(initialTimeParsed.hours);
  const [minutes, setMinutes] = useState(initialTimeParsed.minutes);
  const [seconds, setSeconds] = useState(initialTimeParsed.seconds);
  const [progress, setProgress] = useState(0);
  const [isEditing, setIsEditing] = useState(true);

  // Refs for timer calculation
  const timerRef = useRef(null);
  const totalSecondsRef = useRef(hours * 3600 + minutes * 60 + seconds);
  const startTimeRef = useRef(totalSecondsRef.current);

  // Update total seconds when time changes in edit mode
  useEffect(() => {
    if (timerState === 'stopped') {
      totalSecondsRef.current = hours * 3600 + minutes * 60 + seconds;
      startTimeRef.current = totalSecondsRef.current;
    }
  }, [hours, minutes, seconds, timerState]);

  // Timer effect
  useEffect(() => {
    // Clear previous interval if exists
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (timerState === 'running') {
      setIsEditing(false);

      timerRef.current = setInterval(() => {
        if (totalSecondsRef.current <= 0) {
          clearInterval(timerRef.current);
          return;
        }

        totalSecondsRef.current -= 1;

        // Calculate new hours, minutes, seconds
        const newHours = Math.floor(totalSecondsRef.current / 3600);
        const newMinutes = Math.floor((totalSecondsRef.current % 3600) / 60);
        const newSeconds = totalSecondsRef.current % 60;

        setHours(newHours);
        setMinutes(newMinutes);
        setSeconds(newSeconds);

        // Update progress
        const elapsedTime = startTimeRef.current - totalSecondsRef.current;
        const progressPercent = Math.min(100, (elapsedTime / startTimeRef.current) * 100);
        setProgress(progressPercent);
      }, 1000);
    } else if (timerState === 'paused') {
      // Just pause the timer - keep current values
      setIsEditing(false);
    } else if (timerState === 'stopped') {
      // Reset timer
      setHours(8);
      setMinutes(0);
      setSeconds(0);

      setIsEditing(true);
      setProgress(0);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timerState]);

  // Circle properties - Reduced radius to 300 for slightly smaller circle
  const radius = 250;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // Calculate position for the indicator dot - UPDATED coordinates to 325 to match SVG size
  const indicatorAngle = (progress / 100) * 2 * Math.PI - (Math.PI / 2);
  const indicatorX = 275 + radius * Math.cos(indicatorAngle);
  const indicatorY = 275 + radius * Math.sin(indicatorAngle);

  // Handle time input changes
  const handleTimeChange = (e) => {
    if (timerState !== 'stopped') return;

    const { name, value } = e.target;
    const numValue = parseInt(value, 10) || 0;

    switch (name) {
      case 'hours':
        setHours(Math.max(0, Math.min(23, numValue)));
        break;
      case 'minutes':
        setMinutes(Math.max(0, Math.min(59, numValue)));
        break;
      case 'seconds':
        setSeconds(Math.max(0, Math.min(59, numValue)));
        break;
      default:
        break;
    }
  };

  // Format time for display
  const formatTimeDisplay = () => {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="session-timer">
      <div className="timer-circle-container">
        {/* UPDATED SVG dimensions to 650x650 with viewBox to match */}
        <svg width="550" height="550" viewBox="0 0 550 550">

          {/* Background circle - updated cx, cy to 325 */}
          <circle
            cx="275"
            cy="275"
            r={radius}
            fill="none"
            stroke="#E6E6E6"
            strokeWidth="10" // Adjusted stroke width
          />

          {/* Progress circle - updated cx, cy to 325 */}
          <circle
            cx="275"
            cy="275"
            r={radius}
            fill="none"
            stroke="#222222"
            strokeWidth="10" // Adjusted stroke width
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 275 275)" // Updated coordinates
            className="progress-circle"
          />

          {/* Progress indicator cat */}
          <image
            href={orangeCatIcon}
            x={indicatorX - 25}
            y={indicatorY - 25}
            width="50" // Width is required for SVG images
            height="50" // Height for the image
            className="progress-indicator"
          />
        </svg>

        {/* Time Display */}
        <div className="time-display">
          <div className="time-label">Session Length</div>

          {/* Time labels row */}
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
                <input
                  type="number"
                  name="hours"
                  value={hours.toString().padStart(2, '0')}
                  onChange={handleTimeChange}
                  min="0"
                  max="23"
                  className="time-input"
                />
                <span className="colon">:</span>
              </div>
              <div className="time-group">
                <input
                  type="number"
                  name="minutes"
                  value={minutes.toString().padStart(2, '0')}
                  onChange={handleTimeChange}
                  min="0"
                  max="59"
                  className="time-input"
                />
                <span className="colon">:</span>
              </div>
              <div className="time-group">
                <input
                  type="number"
                  name="seconds"
                  value={seconds.toString().padStart(2, '0')}
                  onChange={handleTimeChange}
                  min="0"
                  max="59"
                  className="time-input"
                />
              </div>
            </div>
          ) : (
            <div className="time-value">{formatTimeDisplay()}</div>
          )}

        </div>

        {/* Cat animation image - kept in proportion with new size */}
        <div className="cat-animation">
          <img
            src={catGif}
            alt="Pixel cats on logs"
            className="cat-image"
          />
        </div>
      </div>
    </div>
  );
};

export default SessionTimer;