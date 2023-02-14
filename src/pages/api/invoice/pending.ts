import type { NextApiRequest, NextApiResponse } from 'next'

import dayjs from 'dayjs'

import { lookupInvoice }    from '@/lib/lnd'
import { AccountModel }      from '@/model/Record'
import { getCollection }    from '@/lib/controller'
import { withSessionRoute } from '@/lib/sessions'
import { MongoServerError } from 'mongodb'

export default withSessionRoute(handler)

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') res.status(400).end()

  try {
    const { pending } = req.session

    if (pending === undefined) {
      return res.status(200).json({ err: 'Session has expired!' })
    }

    const { hash, ordinal, pubkey, duration } = pending ?? {}

    const invoice = await lookupInvoice(hash)

    if (invoice === undefined) {
      return res.status(200).json({ err: 'Invoice not found!' })
    }

    const { settled } = invoice

    if (settled) {
      const records = await getCollection(AccountModel),
            record  = await records.findOne({ ordinal })

      if (record !== null) {
        return res.status(200).json({ err: 'Active record already exists!' })
      }

      const expires = Math.floor(
        dayjs
          .unix(Date.now())
          .add(duration, 'months')
          .unix() 
        / 1000
      )

      const newRecord = {
        pubkey,
        expires,
        ordinal,
        purchased : Math.floor(Date.now() / 1000),
        receipt   : invoice.r_hash,
        status    : 'active'
      }

      const created = await records.insertOne(newRecord)

      if (!created) throw new Error('Failed to save new record to db.')

      req.session.destroy()

      return res.status(200).json({ settled: true, newRecord })
    }

    return res.status(200).json({ settled: false })

  } catch(err) {
    if (err instanceof MongoServerError) {
      const rules = err.errInfo?.details?.schemaRulesNotSatisfied
      if (rules !== undefined) {
        console.log('[ Mongo ] Document failed validation rules:')
        console.dir(rules, { depth: null })
      }
    } else { console.error(err) }
    res.status(200).json({ err: 'Internal server error.' })
  }
}
