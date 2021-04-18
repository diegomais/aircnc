import styles from './styles.module.scss';

export function Layout({ children }) {
  return (
    <div className={styles.container}>
      <img src={'images/logo.svg'} alt="AirCnC" />

      <main className={styles.main}>{children}</main>
    </div>
  );
}
