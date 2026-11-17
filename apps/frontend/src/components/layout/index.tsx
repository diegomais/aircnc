import styles from './styles.module.scss'

type Props = {
  children: React.ReactNode
}

export function Layout({ children }: Props): JSX.Element {
  return (
    <div className={styles.container}>
      <img src="images/logo.svg" alt="aircnc" />
      <main className={styles.main}>{children}</main>
    </div>
  )
}
