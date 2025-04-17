// 📁 src/components/CalendarWithSessions.js

import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './CalendarWithSessions.css'; // Fichier pour la classe .dot

export default function CalendarWithSessions({ userId }) {
  const [sessions, setSessions] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/studySessions/user/${userId}`)
      .then(res => res.json())
      .then(data => setSessions(data))
      .catch(err => console.error(err));
  }, [userId]);

  const getSessionsForDate = (date) => {
    return sessions.filter(
      session => new Date(session.date).toDateString() === date.toDateString()
    );
  };

  return (
    <div className="calendar-container">
      <Calendar
        onClickDay={(date) => setSelectedDate(date)}
        tileContent={({ date }) => {
          const hasSession = getSessionsForDate(date).length > 0;
          return hasSession ? <div className="dot"></div> : null;
        }}
      />

      {selectedDate && (
        <div className="session-details">
          <h3>Sessions le {selectedDate.toLocaleDateString()} :</h3>
          <ul>
            {getSessionsForDate(selectedDate).map((session, index) => (
              <li key={index}>
                {session.subject} de {session.startTime} à {session.endTime}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
