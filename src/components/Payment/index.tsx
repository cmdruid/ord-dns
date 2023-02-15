import { ReactElement, useEffect, useState } from 'react'
import useStore   from '@/hooks/useStore'
import QRCode     from './QRCode'
import { sleep }  from '@/lib/utils'
import { config } from '@/config'
import styles from './styles.module.css'
import { BsFillLightningChargeFill } from 'react-icons/bs'

interface Props {
  props ?: any
}

export default function Payment (
  { props } : Props
) : ReactElement {
  const [ loading, setLoading ] = useState(false)
  const { store, set, update }  = useStore()

  const setDuration = (value : string) : void => { set('duration', value) }
  const setInvoice  = (value : string) : void => { set('pending', { ...store.pending, receipt:  value }) }
  
  const cancelInv   = () : void => {
    if (store.pending?.receipt !== undefined) {
      fetch(window.location.origin + '/api/invoice/cancel')
      set('pending', {})
    }
  }
 
  useEffect(() => {
    if (store.pending.receipt !== undefined && !loading) {
      (async () => {
        for (let i = 0; i < 24; i++) {
          setLoading(true)
          const url = window.location.origin + '/api/invoice/pending'
          const res = await fetch(url)
          if (res.ok) {
            setLoading(false)
            const { settled, newAcct } = await res.json()
            if (settled) {
              console.log('New Account:', newAcct)
              update({ status: 'registered', pending: {} })
              break
            }
          } else { break }
          await sleep(5000)
        }
        // Option to timeout and cancel invoice here.
      })()
    }
  }, [ store ])

  const submit = async () => {
    if (
      store.param  !== undefined &&
      store.pubkey !== undefined
    ) {
      const query = new URLSearchParams({
        param    : store.param,
        pubkey   : store.pubkey,
        duration : store.duration
      })
      const url = window.location.origin + '/api/invoice/request'
      const request = url + '?' + query.toString()
      console.log(request, query)
      const res = await fetch(request)
      if (res.ok) {
        const { err, data } = await res.json()
        console.log(err, data)
        if (err) {
          setInvoice('')
          update({ payment_err: err })
        } else { setInvoice(data) }
      }
    }
  }

  return (
    <div className={styles.gridContainer}>
    {store.results.length > 0 && 
      <div className={styles.leftSection}>
          <div className={styles.item}>
            { store.results?.length > 0 &&
              <p className={styles.name}>              
                {store.results[0].name}.ord
              </p>
            }
            <div className={styles.payment}>
              <label>Ownership Duration In Months</label>
              <input
                className={styles.input}
                type="number"
                min="1"
                max="60"
                value={store.duration}
                onChange={(e) => {
                  setDuration(e.target.value);
                }}
              />
            <div className={styles.quote}>
            <p>
              Total Price: <span className={styles.price}>
              {Number(store.duration) * 200}
              </span> sats
            </p>
            </div>
              <button onClick={submit} className={styles.button}>
                <BsFillLightningChargeFill className={styles.icon} />
                Generate Invoice
              </button>
          </div>
        </div>
      </div>
    }
    {/* {store.payment_err && (
      <div className={styles.error}>
        <p>{store.payment_err}</p>
      </div>
    )} */}
    {store.results.length > 0 && store.pending.receipt !== undefined && (
      <div className={styles.rightSection}>
        <QRCode
          data={store.pending.receipt}
          loading={loading}
          clear={cancelInv}
        />
        {store.status === 'registered' && (
          <p>You have registered {store.param}</p>
        )}
      </div>
    )}
  </div>
  )
}
