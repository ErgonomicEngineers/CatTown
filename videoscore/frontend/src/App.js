import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FaHome, FaCat, FaVideo } from 'react-icons/fa';
import './App.css';

function MainPage() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <button className="cattown-btn" onClick={() => navigate('/cattown')}><FaCat size={24} /></button>
      <button className="video-btn" onClick={() => navigate('/video')}><FaVideo size={24} /></button>
    </div>
  );
}

function CatTownPage() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <button className="back-btn" onClick={() => navigate('/')}><FaHome size={24} /></button>
      {/* Additional content for CatTown page can go here */}
    </div>
  );
}

function VideoPage() {
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
      <button className="back-btn" onClick={() => navigate('/')}><FaHome size={24} /></button>
      <div className="video-wrapper">
        <img src="http://localhost:5001/video" alt="Live posture feed" />
      </div>
        <div className={`score-label ${score !== null ? getScoreClass(score) : ''}`}>
          Posture Score: {score !== null ? score : ''}
        </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/video" element={<VideoPage />} />
        <Route path="/cattown" element={<CatTownPage />} />
      </Routes>
    </Router>
  );
}

export default App;
