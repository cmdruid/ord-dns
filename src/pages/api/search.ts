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

  let ret = { ok: false, data: undefined, pubkey: undefined }

  try {
    if (isAddress(param)) {
      ret = await lookupAddress(param)
    }

    if (isUTXO(param)) {
      const [ txid, vout ] = param.split(':')
      ret = await lookupUTXO(txid, vout)
    }

    if (isOrdinal(param)) {
      ret = await lookupOrdinal(param)
    }

    console.log(ret)

    return res.status(200).json(ret)
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
