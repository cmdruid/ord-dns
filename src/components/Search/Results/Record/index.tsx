import { ReactElement } from 'react'
import styles from './styles.module.css'

export interface OrdinalRecord {
  output : string
  start  : number
  size   : number
  rarity : string
  name   : string
}

interface Props {
  record : OrdinalRecord
}

export function Record (
  { record } : Props
) : ReactElement {

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <p>
          <label>Name</label>
          <span>{record.name}</span>
        </p>
        <p>
          <label>Ordinal</label>
          <span>{record.start}</span>
        </p>
        <p>
          <label>Size</label>
          <span>{record.size}</span>
        </p>
        <p>
          <label>Rarity</label>
          <span>{record.rarity}</span>
        </p>
        <p>
          <label>TxId</label>
          <span>{record.output}</span>
        </p>
        <div className={styles.claimWindow}>
          <p className={styles.claimStatus}></p>
          <button className={styles.viewBtn}>Details</button>
        </div>
        
      </div>
    </div>
  )
}
