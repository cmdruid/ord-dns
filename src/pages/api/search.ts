import type { NextApiRequest, NextApiResponse } from 'next'

import { normalizeParams } from '@/lib/utils'

import { 
  lookupAddress, 
  lookupOrdinal, 
  lookupUTXO 
} from '@/lib/ord'

export default async function handler (
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { param } = normalizeParams(req.query)

  if (param === undefined) {
    return res.status(404).end()
  }

  try {
    if (isAddress(param)) {
      const ret = await lookupAddress(param)
      return res.status(200).json({ ...ret, type: 'utxo' })
    }

    if (isUTXO(param)) {
      const [ txid, vout ] = param.split(':')
      const ret = await lookupUTXO(txid, vout)
      return res.status(200).json({ ...ret, type: 'utxo' })
    }

    if (isOrdinal(param)) {
      const ret = await lookupOrdinal(param)
      return res.status(200).json({ ...ret, type: 'utxo' })
    }

    return res.status(200).json({ ok: false, err: 'Format not recognized!'})
  } catch(err) { 
    console.error(err)
    res.status(500).end() 
  }
}

function isAddress(str : string) : boolean {
  return (
    str.startsWith('bc1') ||
    str.startsWith('bcrt1')
  )
}

function isUTXO(str : string) : boolean {
  return str.includes(':')
}

function isOrdinal(str : string) {
  return str.search(/^[0-9]+$/) === 0
}
