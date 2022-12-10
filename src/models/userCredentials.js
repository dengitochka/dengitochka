import { mongoose, database } from './_db.js'
import { v1 as uuidv4 } from 'uuid'
import { removeID, nextID, getPasswordHash } from './_helper.js'
import error from 'mongoose/lib/error/index.js'

const UserCredentialsScheme = new mongoose.Schema({
  id: { type: Number, default: 1, required: true },
  user_login: { type: String, default: '', required: true },
  password: { type: String, required: true },
  salt: {type: String, required: true}
})

UserCredentialsScheme.pre('validate', async function(next) {
  if (this.isNew) {
    this.id = await nextID(UserCredentials)
    next()
  } else {
    next()
  }
})

UserCredentialsScheme.set('toJSON', removeID())
UserCredentialsScheme.set('toObject', removeID())

const UserCredentials = database.model('userCredentials_requests', UserCredentialsScheme, 'userCredentials_requests')

export default UserCredentials

export async function UpdateAdminPassword(password) {
  const salt = uuidv4()
  const passwordHash = getPasswordHash(password.trim(), salt)
  try {
    let res = await UserCredentials.updateOne({ user_login: 'admin' }, { $set: { password: passwordHash, salt: salt } })
    if (res.matchedCount === 0) {
      throw new Error(`This user login was not found. User login: ${'admin'}`)
    }
  }
  catch (ex) {
    console.error(`User credentials is not update. User login: ${'admin'}, Error: ${ex}`)
    return false
  }

  return true
}

export async function InitializeAdminCredentialsAsync() {
  const login = 'admin'
  const password = 'admin'
  const salt = uuidv4()
  await UserCredentials.deleteMany({user_login: login})
  const passwordHash = getPasswordHash(password, salt)
  await UserCredentials.create({user_login: login, password: passwordHash, salt: salt})
}