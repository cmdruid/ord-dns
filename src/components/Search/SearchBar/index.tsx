import { ReactElement, useState } from 'react'
import useLookup from '@/hooks/useLookup'
import { ImSearch } from 'react-icons/im'


import styles from './styles.module.css'
import useStore from '@/hooks/useStore'

export default function SearchBar () : ReactElement {
  const { store, set } = useStore()
  const lookup = useLookup()

  const submit   = () : void => { lookup(store.param) }
  const setInput = (value : string) : void => { set('param', value) }

  return (
    <div className={styles.container}>
      <div className={styles.bar}>
        <input 
          className={styles.input}
          type="text" value={store.param}
          onChange={(e) => { setInput(e.target.value) }}
          placeholder={'enter an address, txid:vout, or ordinal name|number to search ...'}
        />
        <button className={styles.button} onClick={submit}><ImSearch className={styles.icon} />Search</button>
      </div>
    </div>
  )
}
