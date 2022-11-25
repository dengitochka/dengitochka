import Zalog from '../models/zalog.js'
import { sendMessage } from './bot/sendMessage.js'

export async function onNewZalogRequest(req, res) {
  const { name, phone, object: secured_by, city } = req.body
  try {
    let zalog = await Zalog.create({ secured_by, name, phone, city })
    zalog = zalog.toObject()
    const data = { phone, secured_by, name, city }
    await sendMessage({ type: 'zalog', data })
    const { id } = zalog
    res.json({ success: true, id })
  } catch (err) {
    console.log(err)
    res.json({ success: false, err })
  }
}