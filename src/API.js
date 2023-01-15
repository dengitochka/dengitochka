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
const corsOptions ={
  origin: [config.WEB_APP_URL, "https://192.168.56.1:3000"], 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200,
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
  let port = process.env.PORT || PORT
  app.listen(port, () => {
    console.log(`API Server running locally at http://localhost:${port}...`)
  })
} else {
  const options = {
    key: fs.readFileSync(path.join(process.cwd(), './ssl/privkey.pem')),
    cert: fs.readFileSync(path.join(process.cwd(), './ssl/fullchain.pem'))
  }

  const server = https.createServer(options, app)
  server.listen(port, () => {
    console.log(`API Server running at ${API_ROOT} on port ${port}...`)
  })
}