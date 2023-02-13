import type { NextApiRequest, NextApiResponse } from 'next'

import { getCollection }   from '@/lib/controller'
import { RecordModel }     from '@/model/Record'
import { normalizeParams } from '@/lib/utils'

export default async function handler (
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { nickname } = normalizeParams(req.query)

  if (nickname === undefined) {
    return res.status(404).end()
  }

  try {
    const records = await getCollection(RecordModel)
    const record  = await records.findOne({ name: nickname })

    if (record === null) {
      return res.status(200).json({ isAvailable: true, record: {} })
    }

    return res.status(200).json({ isAvailable: false, record })
  } catch(err) { 
    console.error(err)
    res.status(500).end() 
  }
}
