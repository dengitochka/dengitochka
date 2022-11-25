import mongoose from 'mongoose'
import config from '../global/config.js'
const { DB_CONFIG, DB_URL, DB_NAME } = config
const database = mongoose.createConnection(`${DB_URL}/${DB_NAME}`, DB_CONFIG)
export { database, mongoose }