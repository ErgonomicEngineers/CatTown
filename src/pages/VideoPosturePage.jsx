import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import homeIcon from '../assets/4-01.png'
import '../styles/VideoPosturePage.css'; // optional for styles

function VideoPosturePage() {
  const [score, setScore] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      fetch('http://localhost:5001/score')
        .then(res => res.json())
        .then(data => {
          if (data.score !== undefined && data.score !== null) {
            setScore(data.score);
          }
        })
        .catch(err => console.error('Failed to fetch score:', err));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const getScoreClass = (score) => {
    if (score >= 8) return 'poor';
    if (score >= 5) return 'neutral';
    return 'good';
  };

  return (
    <div className="video-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
      <img src={homeIcon} alt="Back" style={{ width: '24px', height: '24px' }} />
      </button>
      <div className="video-wrapper">
        <img src="http://localhost:5001/video" alt="Live posture feed" />
      </div>
      <div className={`score-label ${score !== null ? getScoreClass(score) : ''}`}>
        Posture Score: {score !== null ? score : ''}
      </div>
    </div>
  );
}

export default VideoPosturePage;
