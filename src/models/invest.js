import { mongoose, database } from './_db.js'
import { removeID, nextID } from './_helper.js'

const investSchema = new mongoose.Schema({
  id: { type: Number, default: 1, required: true },
  phone: { type: String, default: '', required: true },
  ts: { type: Number },
})

investSchema.pre('validate', async function(next) {
  if (this.isNew) {
    this.id = await nextID(Invest)
    this.ts = +Date.now()
    next()
  } else {
    next()
  }
})

investSchema.set('toJSON', removeID())
investSchema.set('toObject', removeID())

const Invest = database.model('invest_requests', investSchema, 'invest_requests')

export default Invest