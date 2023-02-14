
const API_HOST = process.env.LOOKUP_HOST

export async function lookupUTXO(
  txid : string,
  vout : string | number
) {
  if (typeof vout === 'number') vout = String(vout)
  return fetchAPI('/ord/fromUTXO', { txid, vout })
}

export async function lookupAddress(
  address : string
) {
  return fetchAPI('/ord/fromAddress', { address })
}

export async function lookupOrdinal(
  start : string | number,
  stop  : string | number = start
) {
  return fetchAPI('/ord/fromRange', {
     start : String(start), 
     stop  : String(stop) 
  })
}

export async function fetchAPI(
  endpoint : string,
  params   : Record<string, string>
) {
  try {
    const query = new URLSearchParams(params)
    const url   = `${API_HOST}${endpoint}?${query}`
    const res = await fetch(url)
    if (res.ok) {
      const json = await res.json()
      return json
    }
    console.log('Query:', query)
    throw `${endpoint} ${res.status} ${res.statusText}`
  } catch(err) {
    console.log(err)
    new Error('Request failed: ' + err) 
  }
}
