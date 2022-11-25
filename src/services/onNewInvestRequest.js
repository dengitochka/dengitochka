import Invest from '../models/invest.js'
import { sendMessage } from './bot/sendMessage.js'

export async function onNewInvestRequest(req, res) {
  const { phone } = req.body
  try {
    let invest = await Invest.create({ phone })
    invest = invest.toObject()
    const data = { phone }
    await sendMessage({ type: 'invest', data })
    const { id } = invest
    res.json({ success: true, id })
  } catch (err) {
    console.log(err)
    res.json({ success: false, err })
  }
}