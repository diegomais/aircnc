import { useRouter } from 'next/router';
import React, { useMemo, useState } from 'react';
import { Layout } from '../../components/layout';
import { USER_KEY } from '../../constants/storage';
import { api } from '../../services/api';
import styles from './styles.module.scss';

export function AddSpotTemplate() {
  const router = useRouter();
  const [thumbnail, setThumbnail] = useState(null);
  const [company, setCompany] = useState('');
  const [techs, setTechs] = useState('');
  const [price, setPrice] = useState('');

  const preview = useMemo(() => {
    return thumbnail ? URL.createObjectURL(thumbnail) : null;
  }, [thumbnail]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user_id = localStorage.getItem(USER_KEY);

    const data = new FormData();
    data.append('thumbnail', thumbnail);
    data.append('company', company);
    data.append('techs', techs);
    data.append('price', price);

    await api.post('/spots', data, { headers: { user_id } });

    router.push('/dashboard');
  };

  return (
    <Layout>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label
          style={thumbnail && { backgroundImage: `url(${preview})` }}
          className={thumbnail ? styles['has-thumbnail'] : styles.thumbnail}
        >
          <input
            type="file"
            onChange={(e) => setThumbnail(e.target.files[0])}
          />
          <img src={'images/camera.svg'} alt="Select img" />
        </label>

        <label htmlFor="company">
          Company
          <input
            id="company"
            placeholder="Company name"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </label>

        <label htmlFor="techs">
          Technologies <span>(comma separated)</span>
          <input
            id="techs"
            placeholder="Techs used by company"
            value={techs}
            onChange={(e) => setTechs(e.target.value)}
          />
        </label>

        <label htmlFor="price">
          Price <span>(blank for free)</span>
          <input
            id="price"
            placeholder="Price per day"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </label>

        <button type="submit" className="btn">
          Add new spot
        </button>
      </form>
    </Layout>
  );
}
