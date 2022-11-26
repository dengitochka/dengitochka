export default {
  BOT_TOKEN: '5738109429:AAE4cczTVS8lHo-80APdCKk-CKqsGpqxjqQ', //`5772763513:AAH3_9czBKTEBnc64C_7L6rpL_GErKPvErA`
  BOT_LOGIN: 'dengitochka_bot', //`https://t.me/roszalog_bot`,
  DB_CONFIG: { useNewUrlParser: true, useUnifiedTopology: true },
  DB_URL: 'mongodb+srv://root:rViAmmjHisj7M9EW@roszalog.8llppu3.mongodb.net',
  DB_NAME: 'main',
  API_ROOT: 'https://server.dengitochka.ru',
  PORT: 7072,
  PROVIDER_TOKEN: '401643678:TEST:0508416f-dcbb-4995-a89a-cc641c5cef58'
  // CHAT_IDS: [1303646809, 2010840813],
  // ADMINS_IDS: [1303646809, 2010840813],
  //CHAT_ID: -1001654902402,
}

export const COMMANDS = {
  invest: 'invest',
  zalog: 'zalog',
  broker: 'broker',
  send: 'send',
  credit: 'credit'
}

export const PROVIDER_TOKEN_PAYMENTS = {
  sber: {
    name: 'Сбербанк',
    token: '401643678:TEST:76f4b9b7-685c-43e2-8538-2ad0782429ee'
  },
  payMaster: {
    name: 'PayMaster',
    token: '1744374395:TEST:500ee7556fce732f2909'
  },
  uCassa: {
    name: 'ЮКасса',
    token: '381764678:TEST:46023'
  }
}