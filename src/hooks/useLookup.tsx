import useStore from '@/hooks/useStore'

export default function useLookup() {
  const { update } = useStore()

  return async (param : string) => {
    update({ param, status: 'searching' })
    const host = window.location.origin
    const res = await fetch(host + '/api/search?param=' + param)
    if (res.ok) {
      const { data, pubkey } = await res.json()
      update({ reqkey: pubkey, results: data, status: 'delivered' })
    } else {
      update({ 
        pubkey: undefined,
        results: [], 
        status: 'error' 
      })
    }
  }
}
