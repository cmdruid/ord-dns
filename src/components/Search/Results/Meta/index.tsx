import useStore from '@/hooks/useStore'
import { ReactElement } from 'react'
import styles from './styles.module.css'
import { IoMdKey } from 'react-icons/io'

interface Props {
  props ?: any
}

export default function ResultsMeta (
  { props } : Props
) : ReactElement {

  const { store, update } = useStore()

  const submit = async () => {
    if (window.nostr.getPublicKey !== undefined) {
      console.log('fired')
      window.nostr.getPublicKey().then(pubkey => {
        update({ pubkey })
      }) 
    }
  };

  const resultTxt = (len : number) => len === 1 ? 'result' : 'results'

  return (
    <div className={styles.container}>
      <p className={styles.results}>
        <span>{store.results.length}</span>
        <span> {resultTxt(store.results.length)} found belonging to pubkey:</span>
      </p>
    <div className={styles.row}>
      { store.reqkey !== undefined &&
      <>
        <p className={styles.pubkey}>
          <span>{store.reqkey.slice(0,40)}...</span>
        </p>
          <p className={styles.alignRight}>
          <button 
            className={styles.button}
            onClick={submit}
          >
            <IoMdKey className={styles.icon}/>Authenticate
          </button>
        </p>
        </>
      }
    </div>
  </div>
  )
}
