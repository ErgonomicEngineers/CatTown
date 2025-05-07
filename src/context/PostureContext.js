// src/context/PostureContext.js
import React, { createContext, useState, useEffect, useRef } from 'react';

export const PostureContext = createContext();

export const PostureProvider = ({ children }) => {
  // Use a more descriptive name for the score to avoid confusion
  const [postureScore, setPostureScore] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  
  // Use a ref to store the interval ID
  const trackingIntervalRef = useRef(null);

  // Start tracking posture
  const startTracking = () => {
    console.log("Starting posture tracking");
    
    // Set tracking state
    setIsTracking(true);
    
    // Clear any existing interval to avoid duplicates
    if (trackingIntervalRef.current) {
      clearInterval(trackingIntervalRef.current);
    }
    
    // Fetch the initial score immediately
    fetchPostureScore();
    
    // Set up interval to periodically fetch the score
    trackingIntervalRef.current = setInterval(fetchPostureScore, 100); // Every 3 seconds
  };

  // Stop tracking posture
  const stopTracking = () => {
    console.log("Stopping posture tracking");
    
    // Update tracking state
    setIsTracking(false);
    
    // Clear the interval
    if (trackingIntervalRef.current) {
      clearInterval(trackingIntervalRef.current);
      trackingIntervalRef.current = null;
    }
  };

  // Fetch posture score from backend
  const fetchPostureScore = async () => {
    try {
      console.log("Fetching posture score...");
      const response = await fetch('http://localhost:5001/score');
      const data = await response.json();
      
      console.log("Received posture score:", data.score);
      
      // Update the score state with the new value
      if (data.score !== undefined) {
        setPostureScore(data.score);
      }
    } catch (error) {
      console.error("Error fetching posture score:", error);
    }
  };

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      if (trackingIntervalRef.current) {
        clearInterval(trackingIntervalRef.current);
      }
    };
  }, []);

  // Create a value object with all the context data
  // Important: Recreate this object on every render to ensure
  // consumers get updated when state changes
  const contextValue = {
    score: postureScore,
    isTracking,
    startTracking,
    stopTracking
  };

  return (
    <PostureContext.Provider value={contextValue}>
      {children}
    </PostureContext.Provider>
  );
};