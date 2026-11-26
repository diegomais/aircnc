import Link from 'next/link'
import { useEffect, useState } from 'react'
import io from 'socket.io-client'
import { Layout } from '@/components/layout'
import { USER_KEY } from '@/constants/storage'
import { api } from '@/services/api'
import styles from './styles.module.scss'

type Request = {
  _id: string
  date: string
  user: {
    email: string
  }
  spot: {
    company: string
  }
}

type Spot = {
  _id: string
  company: string
  price: number
  thumbnail_url: string
}

const websocketUri = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'

export function DashboardTemplate() {
  const [spots, setSpots] = useState<Spot[]>([])
  const [requests, setRequests] = useState<Request[]>([])
  const [userId] = useState(() =>
    typeof window === 'undefined' ? '' : (localStorage.getItem(USER_KEY) ?? '')
  )

  useEffect(() => {
    if (!userId) return

    const socket = io(websocketUri, { query: { user_id: userId } })

    socket.on('booking_request', (incomingRequest: Request) => {
      setRequests(previousRequests => [...previousRequests, incomingRequest])
    })

    return () => {
      socket.disconnect()
      socket.removeAllListeners()
    }
  }, [userId])

  useEffect(() => {
    async function loadSpots() {
      const response = await api.get('/dashboard', {
        headers: { user_id: userId },
      })

      setSpots(response.data)
    }

    if (userId) {
      loadSpots()
    }
  }, [userId])

  async function handleAccept(id: string) {
    await api.post(`/bookings/${id}/approvals`, null, {
      headers: { user_id: userId },
    })

    setRequests(requests.filter((request) => request._id !== id))
  }
  async function handleReject(id: string) {
    await api.post(`/bookings/${id}/rejections`, null, {
      headers: { user_id: userId },
    })

    setRequests(requests.filter((request) => request._id !== id))
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
  )
}
