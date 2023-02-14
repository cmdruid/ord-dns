import useStore from '@/hooks/useStore'

export default function useLookup() {
  const { update } = useStore()

  return async (param : string) => {
    update({ param, status: 'searching' })
    const host = window.location.origin
    const res = await fetch(host + '/api/record?param=' + param)
    if (res.ok) {
      const { record } = await res.json()
      update({ record, status: 'delivered' })
    } else {
      update({ 
        record: {},
        status: 'error' 
      })
    }
  }
}
