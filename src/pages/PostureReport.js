import React from "react";
import { sessions } from "../data/reportdata";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hours = Array.from({ length: 9 }, (_, i) => {
  const hour = 9 + i; // 9 to 17 (5PM)
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  const suffix = hour < 12 ? "AM" : "PM";
  return `${displayHour}${suffix}`;
});

  function getColor(score) {
    if (score >= 7) return "#82c596"; 
    if (score >= 4) return "#faae41";
    return "#e0e5e9";
  }

// Converts "10:05AM" or "1:45PM" to a number like 10.08
function parseTimeToHour(timeStr) {
  const match = timeStr.match(/^(\d+):?(\d{0,2})(AM|PM)$/);
  if (!match) return null;
  let [_, hour, minutes, meridiem] = match;
  hour = parseInt(hour);
  minutes = parseInt(minutes || "0");

  if (meridiem === "PM" && hour !== 12) hour += 12;
  if (meridiem === "AM" && hour === 12) hour = 0;

  return hour + minutes / 60;
}
const SessionOverview = () => {
  return (
    <div className="session-layout">
      <div className="container">
        <div className="top-row">
          <div className="session-box">
            <div className = "session-header">
              <h3>Session Overview</h3>
              <div className="legend">
                <span><div className="legend-box gray" /> Score 0-3</span>
                <span><div className="legend-box orange" /> Score 4-6</span>
                <span><div className="legend-box red" /> Score 7-10</span>
                
              </div>
            </div>
            

            <div className="session-grid">
              {/* Left: hour labels */}
              <div className="grid-hours">
                {hours.map((hour) => (
                  <div key={hour} className="hour-label">{hour}</div>
                ))}
                {/* Empty cell to align with day labels */}
                <div className = "hour-label"></div>
              </div>

              {/* Day columns */}
              <div className="grid-days">
                {days.map((day) => {
                  const daySessions = sessions.filter(s => s.day === day);

                  return (
                    <div key={day} className="day-column">
                      {Array.from({ length: 9 }).map((_, hourIndex) => {
                        // Check if any session includes this hour
                        const actualHour = 9 + hourIndex;
                        // Use actualHour for comparisons
                        const session = daySessions.find(s => {
                          const start = parseTimeToHour(s.start);
                          const end = parseTimeToHour(s.end);
                          return start < actualHour + 1 && end > actualHour;
                        });

                        const bg = session ? getColor(session.score) : "";

                        return (
                          <div key={hourIndex} className="hour-cell">
                            {session && (
                              <div
                                className="session-tooltip-wrapper"
                                style={{
                                  backgroundColor: getColor(session.score),
                                  opacity: 0.8,
                                  width: "100%",
                                  height: "100%",
                                }}
                              >
                                <div className="session-tooltip">
                                  {session.start}–{session.end}<br />
                                  <strong>Score: {session.score}</strong>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    <div className="day-label">{day}</div>
                  </div>
                  );
                })}
            </div>
          </div>
        </div>
        

          <div className="posture-graph"></div>
        </div>
      </div>
    </div>
  );
};
export default SessionOverview;