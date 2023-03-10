import type { NextApiRequest, NextApiResponse } from 'next'

import { normalizeParams }  from '@/lib/utils'
import { AccountModel }     from '@/model/Account'
import { getCollection }    from '@/lib/controller'
import { config }           from '@/config'
import { withSessionRoute } from '@/lib/sessions'
import { createInvoice }    from '@/lib/lnd'

type DataResponse = {
  data ?: Record<string, string | number | boolean | null>
  err  ?: unknown
}

export default withSessionRoute(handler)

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DataResponse>
) {

  // Reject all methods other than GET.
  if (req.method !== 'GET') res.status(400).end()

  // Grab the slug and url from the post body.
  const { param, pubkey, duration } = normalizeParams(req.query)

  if (
    param    === undefined ||
    pubkey   === undefined ||
    duration === undefined
  ) {
    return res.status(200).json({ err: 'Invalid request!' })
  }

  try {
    const ordinal = param
    const records = await getCollection(AccountModel),
          record  = await records.findOne({ ordinal })

    if (record !== null) {
      return res.status(200).json({ err: 'Account already exists!' })
    }

    const amount = config.sub_cost * Number(duration) * 1000

    const memo = `DNS service for ordinal ${ordinal} x ${duration} months.`

    const response = await createInvoice({ amount, memo })

    if (response === undefined) {
      throw 'Create invoice returned undefined.'
    }

    const { payment_request, r_hash: hash } = response

    if (payment_request === undefined || hash === undefined) {
      return res.status(200).json({ err: 'Error fetching invoice from server!' })
    }

    req.session.pending = { hash, amount, ordinal, pubkey, duration, receipt: payment_request }

    await req.session.save()

    if (payment_request === undefined) {
      return res.status(200).json({ err: 'Error fetching invoice from server!' })
    }

    return res.status(200).json({ data: payment_request })
  } catch(err) {
    console.log(err)
    res.status(200).json({ err: 'Internal server error.' })
  }
}
