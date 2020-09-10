import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import socketio from 'socket.io-client';
import api from '../../services/api';
import './styles.css';

export default function Dashboard() {
  const [spots, setSpots] = useState([]);
  const [requests, setRequests] = useState([]);

  const user_id = localStorage.getItem('aircnc:user');

  const socket = useMemo(
    () => socketio(process.env.REACT_APP_API_URL, { query: { user_id } }),
    [user_id]
  );

  useEffect(() => {
    socket.on('booking_request', data => {
      setRequests([...requests, data]);
    });
  }, [requests, socket]);

  useEffect(() => {
    async function loadSpots() {
      const response = await api.get('/dashboard', { headers: { user_id } });

      setSpots(response.data);
    }

    loadSpots();
  }, [user_id]);

  async function handleAccept(id) {
    await api.post(`/bookings/${id}/approvals`, null, { headers: { user_id } });

    setRequests(requests.filter(request => request._id !== id));
  }
  async function handleReject(id) {
    await api.post(`/bookings/${id}/rejections`, null, {
      headers: { user_id },
    });

    setRequests(requests.filter(request => request._id !== id));
  }

  return (
    <>
      <ul className="notifications">
        {requests.map(request => (
          <li key={request._id}>
            <p>
              <strong>{request.user.email}</strong> is requesting a reservation
              at <strong>{request.spot.company}</strong> to&nbsp;
              <strong>{request.date}</strong>.
            </p>
            <button
              type="button"
              className="accept"
              onClick={() => handleAccept(request._id)}
            >
              Accept
            </button>
            <button
              type="button"
              className="reject"
              onClick={() => handleReject(request._id)}
            >
              Reject
            </button>
          </li>
        ))}
      </ul>
      <ul className="spot-list">
        {spots.map(spot => (
          <li key={spot._id}>
            <header style={{ backgroundImage: `url(${spot.thumbnail_url})` }} />
            <strong>{spot.company}</strong>
            <span>{spot.price ? `$${spot.price} per day` : 'Free'}</span>
          </li>
        ))}
      </ul>

      <Link to="/add">
        <button type="button" className="btn">
          Add new spot
        </button>
      </Link>
    </>
  );
}
