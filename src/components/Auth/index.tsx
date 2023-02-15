import useStore from '@/hooks/useStore';
import { ReactElement } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './styles.module.css';
import { FaUserCircle } from 'react-icons/fa';

interface Props {
  props ?: any
}

declare global {
  interface Window {
    nostr: {
      getPublicKey : () => Promise<string>
      signEvent    : (event : any) => Promise<any>
      getRelays    : () => Promise<string[]>
      nip04        : {
        encrypt: (peer : string, plaintext  : string) => Promise<string>
        decrypt: (peer : string, ciphertext : string) => Promise<string>
      }
    }
  }
}

export default function Auth (
  { props } : Props
) : ReactElement {

  const { store, update } = useStore();

  const submit = async () => {
    if (window.nostr.getPublicKey !== undefined) {
      update({ pubkey: undefined });
    }
  };

  return (
    <div className={styles.container}>
      { store.pubkey &&
        <div className={styles.headerLeft}>
          <p>Authenticated as:</p>
          <pre className={styles.key}>{ store.pubkey }...</pre>
        </div>
      }
      <div className={styles.headerRight}>
        <button className={styles.loginButton} onClick={submit}>
        <FaUserCircle />
        </button>
      </div>
    </div>
  );
}
