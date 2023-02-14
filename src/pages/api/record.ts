import type { NextApiRequest, NextApiResponse } from 'next'

import { getCollection }   from '@/lib/controller'
import { RecordModel }     from '@/model/Record'
import { normalizeParams } from '@/lib/utils'

export default async function handler (
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { string } = normalizeParams(req.query)

  if (string === undefined) {
    return res.status(404).end()
  }

  if (string.search(/^[0-9]+$/) !== 0) {
    console.log('name detected')
    // Need API to resolve name
  }

  try {
    const records = await getCollection(RecordModel)
    const record  = await records.findOne({ ordinal: })

    if (record === null) {
      return res.status(200).json({ isAvailable: true, record: {} })
    }

    return res.status(200).json({ isAvailable: false, record })
  } catch(err) { 
    console.error(err)
    res.status(500).end() 
  }
}
