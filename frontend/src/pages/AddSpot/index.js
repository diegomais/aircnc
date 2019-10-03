/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import api from '../../services/api';
import camera from '../../assets/camera.svg';
import './styles.css';

export default function AddSpot({ history }) {
  const [thumbnail, setThumbnail] = useState(null);
  const [company, setCompany] = useState('');
  const [techs, setTechs] = useState('');
  const [price, setPrice] = useState('');

  const preview = useMemo(() => {
    return thumbnail ? URL.createObjectURL(thumbnail) : null;
  }, [thumbnail]);

  async function handleSubmit(e) {
    e.preventDefault();

    const user_id = localStorage.getItem('aircnc:user');
    const data = new FormData();

    data.append('thumbnail', thumbnail);
    data.append('company', company);
    data.append('techs', techs);
    data.append('price', price);

    await api.post('/spots', data, { headers: { user_id } });

    history.push('/dashboard');
  }

  return (
    <form onSubmit={handleSubmit}>
      <label
        id="thumbnail"
        style={{ backgroundImage: `url(${preview})` }}
        className={thumbnail ? 'has-thumbnail' : ''}
      >
        <input type="file" onChange={e => setThumbnail(e.target.files[0])} />
        <img src={camera} alt="Select img" />
      </label>
      <label htmlFor="company">
        Company
        <input
          id="company"
          placeholder="Company name"
          value={company}
          onChange={e => setCompany(e.target.value)}
        />
      </label>
      <label htmlFor="techs">
        Technologies <span>(comma separated)</span>
        <input
          id="techs"
          placeholder="Techs used by company"
          value={techs}
          onChange={e => setTechs(e.target.value)}
        />
      </label>
      <label htmlFor="price">
        Price <span>(blank for free)</span>
        <input
          id="price"
          placeholder="Price per day"
          value={price}
          onChange={e => setPrice(e.target.value)}
        />
      </label>

      <button type="submit" className="btn">
        Add new spot
      </button>
    </form>
  );
}

AddSpot.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};
