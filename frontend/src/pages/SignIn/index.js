import React, { useState } from 'react';
import PropTypes from 'prop-types';
import api from '../../services/api';

export default function SignIn({ history }) {
  const [email, setEmail] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();

    const response = await api.post('/sessions', { email });

    localStorage.setItem('aircnc:user', response.data._id);

    history.push('/dashboard');
  }

  return (
    <>
      <p>
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
            onChange={e => setEmail(e.target.value)}
          />
        </label>
        <button type="submit" className="btn">
          Sign in
        </button>
      </form>
    </>
  );
}

SignIn.propTypes = {
  history: PropTypes.func.isRequired,
};
