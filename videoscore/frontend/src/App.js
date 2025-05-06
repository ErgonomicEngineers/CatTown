import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [score, setScore] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch('http://localhost:5001/score')
        .then(res => res.json())
        .then(data => {
          // Ensure that we only set a valid score
          if (data.score !== undefined && data.score !== null) {
            setScore(data.score);
          }
        })
        .catch(err => console.error('Failed to fetch score:', err));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const toggleWidget = () => {
    setIsOpen(!isOpen);
  };

  // Function to determine background color based on posture
  const getScoreBackgroundColor = (score) => {
    if (score >= 80) {
      return 'green'; // Good posture
    } else if (score >= 50) {
      return 'orange'; // Neutral posture
    } else {
      return 'red'; // Bad posture
    }
  };

  return (
    <div className="container">
      <button className="widget-btn" onClick={toggleWidget}>
        {isOpen ? 'X' : '+'}
      </button>

      {isOpen && (
        <div className="widget">
          <div 
            className="score-label"
            style={{
              backgroundColor: score !== null ? getScoreBackgroundColor(score) : 'gray', // Default background if score is null
              color: 'white', // White text on colored background
              padding: '5px 10px', // Padding for the label
              borderRadius: '5px',
            }}
          >
            <strong>Posture Score: </strong>
            <span>
              {score !== null ? score : 'Loading...'}
            </span>
          </div>
          <div className="video-wrapper">
            <img src="http://localhost:5001/video" alt="Live posture feed" />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;