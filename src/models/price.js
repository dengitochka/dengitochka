import { mongoose, database } from './_db.js'
import { removeID, nextID } from './_helper.js'

const priceSchema = new mongoose.Schema({
  id: { type: Number, default: 1, required: true },
  product_name: { type: String, default: '', required: true },
  price: { type: Number, required: true },
  ts: { type: Number},
})

priceSchema.pre('validate', async function(next) {
  if (this.isNew) {
    this.id = await nextID(ProductPrice)
    this.ts = +Date.now()
    next()
  } else {
    next()
  }
})

priceSchema.set('toJSON', removeID())
priceSchema.set('toObject', removeID())

const ProductPrice = database.model('price_requests', priceSchema, 'price_requests')

async function SetDefaultPrice(productName, price) {
    await ProductPrice.deleteMany({product_name: productName})
    await ProductPrice.create({product_name: productName, price: price})
}

export { SetDefaultPrice, ProductPrice }  