import { ReactElement } from 'react'
import styles from './styles.module.css'

interface Props {
  props ?: any
}

export default function Hero (
  { props } : Props
) : ReactElement {

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>ordinary.space</h1>
      <div className={styles.box}>
        <h2>Claim your ordinal and join the namespace.</h2>
      </div>
    </div>
  )
}
