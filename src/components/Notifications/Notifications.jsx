import React, { useEffect, useRef, useState } from 'react';
import './Notifications.css';
import notifGood from '../../assets/good-cat-notif.png';
import notifBad from '../../assets/bad-cat-notif.png';
import notifNeutral from '../../assets/neutral-cat-notif.png';

const Notification = ({ type, duration = 5000, onDismiss }) => {
    const [visible, setVisible] = useState(false);
    const [entryPosition, setEntryPosition] = useState({});
    const dismissTimeoutRef = useRef(null);

    const positionMap = {
        good: { top: '20px', left: '20px' },
        bad: { top: '20px', right: '5px' },
        neutral: { bottom: '20px', left: '5px' }
    };

    // Set position on type change
    useEffect(() => {
        setEntryPosition(positionMap[type] || { bottom: '20px', right: '20px' });

        // Restart the animation visibility
        setVisible(false);
        clearTimeout(dismissTimeoutRef.current);

        // Wait a tick to trigger animation again
        requestAnimationFrame(() => {
            setVisible(true);
        });

        // Auto-dismiss
        dismissTimeoutRef.current = setTimeout(() => {
            setVisible(false);
            setTimeout(() => {
                if (onDismiss) onDismiss();
            }, 500);
        }, duration);

        return () => clearTimeout(dismissTimeoutRef.current);
    }, [type, duration, onDismiss]);

    const getNotifImage = () => {
        if (type === 'good') return notifGood;
        if (type === 'bad') return notifBad;
        if (type === 'neutral') return notifNeutral;
        return notifGood;
    };

    return (
        <div
            className={`notification-container ${type} ${visible ? 'visible' : ''}`}
            style={{
                position: 'fixed',
                ...entryPosition,
                zIndex: 9999,
                pointerEvents: 'none',
            }}
        >
            <img
                src={getNotifImage()}
                alt={`${type} cat notification`}
                className={`cat-icon ${visible ? 'visible' : ''}`}
            />

        </div>
    );
};

export default Notification;
