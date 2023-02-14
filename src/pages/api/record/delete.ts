import type { NextApiRequest, NextApiResponse } from 'next'
import { schnorr, utils } from '@noble/secp256k1'
import { getCollection }  from '@/lib/controller'
import { AccountModel }   from '@/model/Account'

const ec = new TextEncoder()

export default async function handler (
  req: NextApiRequest,
  res: NextApiResponse
) {
  
  const { method, body } = req

  if (method !== 'POST' || body === undefined) {
    return res.status(404).end()
  }

  try {
    const { pubkey, sig, ordinal, } = body

    const msg     = await utils.sha256(ec.encode(String(ordinal)))
    const isValid = await schnorr.verify(sig, msg, pubkey)

    if (!isValid) {
      return res.status(403).end()
    }

    const accounts = await getCollection(AccountModel)
    const account  = await accounts.findOne({ ordinal })

    if (account === null) {
      return res.status(400).send('Account not found!')
    }

    const result = await accounts.deleteOne(account)

    if (result === null) {
      return res.status(400).send('Failed to delete account!')
    }

    return res.status(200).json({ result })
  } catch(err) { 
    console.error(err)
    res.status(500).end() 
  }
}
