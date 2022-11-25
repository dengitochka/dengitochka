import { mongoose, database } from './_db.js'
import { removeID, nextID } from './_helper.js'

const zalogSchema = new mongoose.Schema({
  id: { type: Number, default: 1, required: true },
  phone: { type: String, default: '', required: true },
  city: { type: String, default: '' },
  secured_by: { type: String, default: '' },
  name: { type: String, default: '', required: true },
  ts: { type: Number },
  chatId: { type: Number },
})

zalogSchema.pre('validate', async function(next) {
  if (this.isNew) {
    this.id = await nextID(Zalog)
    this.ts = +Date.now()
    next()
  } else {
    next()
  }
})

zalogSchema.set('toJSON', removeID())
zalogSchema.set('toObject', removeID())

const Zalog = database.model('zalog_requests', zalogSchema, 'zalog_requests')

export default Zalog