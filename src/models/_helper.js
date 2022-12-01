import { v1 as uuidv4 } from 'uuid'
import { createHash } from 'crypto'

export function removeID() {
  return {
    transform: function(_, ret) {
      delete ret.__v
      delete ret._id
    }
  }
}

export const nextID = async(dbModel) => await dbModel.countDocuments({}) + 1

export const staticSalt = uuidv4()
export function getPasswordHash(password, salt) {
  return createHash('sha256').update(`${salt}_${password}_${staticSalt}`).digest('hex')
}