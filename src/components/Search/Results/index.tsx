import { ReactElement }    from 'react'
import { useStoreContext } from '@/context/StoreContext'
import { BsCheckAll } from 'react-icons/bs'
import { CgUnavailable } from 'react-icons/cg'
import { ImSearch } from 'react-icons/im'


import styles from './styles.module.css'

interface Props {
  props ?: any
}

export default function SearchResults (
  { props } : Props
) : ReactElement {

  const { store } = useStoreContext()

  return (
    <div className={styles.container}>
      { store.status === 'searching' &&
        <p className={styles.searching}><ImSearch className={styles.icon} />Searching {store.search} ...</p>
      }
      { store.status === 'delivered' && store.record?.ordinal &&
        <>
          { store.record?.ordinal !== undefined && store.record.pubkey === store.pubkey
            && <pre>{JSON.stringify(store.record, null, 2)}</pre>
          || <p className={styles.true}> <CgUnavailable className={styles.icon} />
            Taken
          </p>
          }
        </>
      }
      { store.status === 'delivered' && store.results && store.results.length > 0 &&
        <>
          <p className={styles.true}>
              <BsCheckAll className={styles.icon} />
              Available
          </p>
          <pre>{JSON.stringify(store.results, null, 2)}</pre>
        </>
      }
    </div>
  )
}
