import { useEffect, useState } from 'react';
import { getIdToken } from 'firebase/auth';
import { auth } from '../firebase';
import { Link } from 'react-router-dom';

const SessionsAcceptées = () => {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const fetchSessions = async () => {
      const token = await getIdToken(auth.currentUser);
      const res = await fetch('http://localhost:5000/api/sessions/public-accepted', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setSessions(data);
    };

    fetchSessions();
  }, []);

  const now = new Date();

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">📘 Sessions publiques acceptées</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th>Matière</th>
            <th>Date</th>
            <th>Heure</th>
            <th>Accès</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((s) => {
            const start = new Date(`${s.date}T${s.startTime}`);
            const end = new Date(`${s.date}T${s.endTime}`);
            const isAccessible = now >= start && now <= end;

            return (
              <tr key={s._id} className="text-center border-t">
                <td>{s.subject}</td>
                <td>{s.date}</td>
                <td>{s.startTime} - {s.endTime}</td>
                <td>
                  {isAccessible ? (
                    <Link to={`/session/${s._id}/live`} className="text-blue-600 underline">
                      Accéder
                    </Link>
                  ) : (
                    <span className="text-gray-500">Dès {s.startTime}</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default SessionsAcceptées;
