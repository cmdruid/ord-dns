import useStore from '@/hooks/useStore'

export default function useLookup() {
  const { update } = useStore()

  return async (param : string) => {
    update({ param, status: 'searching' })
    const host = window.location.origin
    const res = await fetch(host + '/api/search?param=' + param)
    if (res.ok) {
      const ret = await res.json()
      if (ret.type === 'utxo') {
        const { type, data } = ret
        update({ type, results: data, status: 'delivered' })
      }
      if (ret.type === 'record') {
        const { type, record } = ret
        update({ type, record, status: 'delivered' })
      }
    } else {
      update({ 
        isAvailable: false, 
        record: {}, 
        status: 'error' 
      })
    }
  }
}
