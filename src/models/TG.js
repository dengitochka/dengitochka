import { mongoose, database } from './_db.js'
import { removeID, nextID } from './_helper.js'

const TGSchema = new mongoose.Schema({
  id: { type: Number, default: 1, required: true },
  phone: { type: Number, default: '', required: false},
  first_name: { type: String, default: '' },
  last_name: { type: String, default: '' },
  type: { type: String, default: '' },
  chatId: { type: Number },
})

TGSchema.pre('validate', async function(next) {
  if (this.isNew) {
    this.id = await nextID(TG)
    this.ts = +Date.now()
    next()
  } else {
    next()
  }
})

TGSchema.set('toJSON', removeID())
TGSchema.set('toObject', removeID())

const TG = database.model('TG_requests', TGSchema, 'TG_requests')

export default TG