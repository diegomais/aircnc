import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Layout } from '../../components/layout';
import { USER_KEY } from '../../constants/storage';
import io from 'socket.io-client';
import { api } from '../../services/api';
import styles from './styles.module.scss';

export function DashboardTemplate() {
  const [spots, setSpots] = useState([]);
  const [requests, setRequests] = useState([]);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    setUserId(localStorage.getItem(USER_KEY));
  }, []);

  const socket = useMemo(
    () => io(process.env.NEXT_PUBLIC_API_URL, { query: { user_id: userId } }),
    [userId]
  );

  useEffect(() => {
    socket.on('booking_request', (data) => {
      setRequests([...requests, data]);
    });
  }, [requests, socket]);

  useEffect(() => {
    async function loadSpots() {
      const response = await api.get('/dashboard', {
        headers: { user_id: userId },
      });

      setSpots(response.data);
    }

    loadSpots();
  }, [userId]);

  async function handleAccept(id) {
    await api.post(`/bookings/${id}/approvals`, null, {
      headers: { user_id: userId },
    });

    setRequests(requests.filter((request) => request._id !== id));
  }
  async function handleReject(id) {
    await api.post(`/bookings/${id}/rejections`, null, {
      headers: { user_id: userId },
    });

    setRequests(requests.filter((request) => request._id !== id));
  }

  return (
    <Layout>
      <ul className={styles.notifications}>
        {requests.map((request) => (
          <li key={request._id}>
            <p>
              <strong>{request.user.email}</strong> is requesting a reservation
              at <strong>{request.spot.company}</strong> to&nbsp;
              <strong>{request.date}</strong>.
            </p>
            <button
              type="button"
              className={styles.accept}
              onClick={() => handleAccept(request._id)}
            >
              Accept
            </button>
            <button type="button" onClick={() => handleReject(request._id)}>
              Reject
            </button>
          </li>
        ))}
      </ul>
      <ul className={styles.spots}>
        {spots.map((spot) => (
          <li key={spot._id}>
            <header style={{ backgroundImage: `url(${spot.thumbnail_url})` }} />
            <strong>{spot.company}</strong>
            <span>{spot.price ? `$${spot.price} per day` : 'Free'}</span>
          </li>
        ))}
      </ul>

      <Link href="/add">
        <button className={styles.btn}>Add new spot</button>
      </Link>
    </Layout>
  );
}
