import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { PostureContext } from '../context/PostureContext';
import { Link } from 'react-router-dom';
import '../styles/VideoPosturePage.css'; // optional for styles
import pawIcon from '../assets/paw.png';
import reportIcon from '../assets/report_icon.png';
import catIcon from '../assets/cat.png';
import videoIcon from '../assets/video.png';
import homeIcon from '../assets/4-01.png';


function VideoPosturePage() {
    const { score, setScore } = useContext(PostureContext);
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
        if (score >= 8) return 'good';
        if (score >= 5) return 'neutral';
        return 'poor';
    };

    return (
        <div className="video-page">
            <div className="video-wrapper">
                <img src="http://localhost:5001/video" alt="Live posture feed" />
            </div>
            <div className={`score-label ${score !== null ? getScoreClass(score) : ''}`}>
                Posture Score: {score !== null ? score : ''}
            </div>

            {/* Item Buttons on the side */}

            <div className="side-buttons">
                <div className="tooltip-wrapper">
                    <Link to="/" className="side-button">
                        <img src={homeIcon} alt="Home" style={{ width: '50px', height: '50px' }} />
                    </Link>
                    <span className="tooltip-text">User Home</span>
                </div>
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
                        <img src={videoIcon} alt="Video" style={{ width: '100px', height: '100px' }} />
                    </Link>
                    <span className="tooltip-text">Posture Detection System</span>
                </div>
            </div>
        </div>

    );
}

export default VideoPosturePage;
