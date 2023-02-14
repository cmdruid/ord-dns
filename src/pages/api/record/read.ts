import type { NextApiRequest, NextApiResponse } from 'next'

import { getCollection }   from '@/lib/controller'
import { AccountModel }     from '@/model/Account'
import { normalizeParams } from '@/lib/utils'

export default async function handler (
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { param } = normalizeParams(req.query)

  if (param === undefined) {
    return res.status(404).end()
  }

  if (isOrdinalName(param)) {
    console.log('name detected')
    // Need API to conver to number
  }

  if (!isOrdinalNumber(param)) {
    console.log('wordtag detected')
    // Need API to convert to number
  }

  try {
    const ordinal = Number(param)
    const accounts = await getCollection(AccountModel)
    const record  = await accounts.findOne({ ordinal })

    if (record === null) {
      return res.status(200).json({ record: undefined })
    }

    return res.status(200).json({ record })
  } catch(err) { 
    console.error(err)
    res.status(500).end() 
  }
}

function isOrdinalName(param : string) : boolean {
  return (param.search(/^[a-zA-Z]+$/) === 0)
}

function isOrdinalNumber(param : string) : boolean {
  return (param.search(/^[0-9]+$/) === 0)
}
