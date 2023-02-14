import useStore from '@/hooks/useStore'
import { ReactElement } from 'react'
import styles from './styles.module.css'

interface Props {
  props ?: any
}

export default function ResultsMeta (
  { props } : Props
) : ReactElement {

  const { store } = useStore()

  const resultTxt = (len : number) => len === 1 ? 'result' : 'results'

  return (
    <div className={styles.container}>
      <p className={styles.results}>
        <span>{store.results.length}</span>
        <span> {resultTxt(store.results.length)} found belonging to pubkey:</span>
      </p>
      <p className={styles.pubkey}>
        <span>{store.pubkey}</span>
      </p>
      <button>Authenticate</button>
    </div>
  )
}
