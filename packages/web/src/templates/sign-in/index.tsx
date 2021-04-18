import { useRouter } from 'next/router'
import { useState } from 'react'
import { Layout } from '../../components/layout'
import { USER_KEY } from '../../constants/storage'
import { api } from '../../services/api'
import styles from './styles.module.scss'

export function SignInTemplate(): JSX.Element {
  const router = useRouter()
  const [email, setEmail] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()

    const response = await api.post('/sessions', { email })

    localStorage.setItem(USER_KEY, response.data._id)

    router.push('/dashboard')
  }

  return (
    <Layout>
      <p className={styles.description}>
        Offer <strong>spots</strong> for software developers and find
        <strong> talents</strong> for your company.
      </p>

      <form onSubmit={handleSubmit}>
        <label htmlFor="email">
          E-mail
          <input
            id="email"
            type="email"
            placeholder="Enter your e-mail address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <button className={styles.btn} type="submit">
          Sign in
        </button>
      </form>
    </Layout>
  )
}
