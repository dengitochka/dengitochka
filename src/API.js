import fs from 'fs'
import path from 'path'
import express from 'express'
import cors from 'cors'
import https from 'https'
import bodyParser from 'body-parser'
import order from './services/routes/order.js'
import product from './services/routes/product.js'

import { onNewZalogRequest } from './services/onNewZalogRequest.js'
import { onNewInvestRequest } from './services/onNewInvestRequest.js'

import config from './global/config.js'
const { API_ROOT, PORT } = config

const app = express()
let corsOptions = {
  origin: [config.WEB_APP_URL],
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  console.log("Online");
  res.json({ status: 'Online', port: PORT })
})

app.use('/order', order);
app.use('/products', product);
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV.trim() === "development") {
  app.listen(PORT, () => {
    console.log(`API Server running locally at http://localhost:${PORT}...`)
  })
} else {
  const options = {
    key: fs.readFileSync(path.join(process.cwd(), './ssl/privkey.pem')),
    cert: fs.readFileSync(path.join(process.cwd(), './ssl/fullchain.pem'))
  }

  let port = process.env.PORT || 3000;
  const server = https.createServer(options, app)
  server.listen(port, () => {
    console.log(`API Server running at ${API_ROOT} on port ${PORT}...`)
  })
}