export default {
  BOT_TOKEN: '5738109429:AAE4cczTVS8lHo-80APdCKk-CKqsGpqxjqQ', //`5738109429:AAE4cczTVS8lHo-80APdCKk-CKqsGpqxjqQ`
  BOT_LOGIN: 'https://t.me/dengitochka_bot', //`https://t.me/roszalog_bot`,
  DB_CONFIG: { useNewUrlParser: true, useUnifiedTopology: true },
  DB_URL: 'mongodb+srv://root:rViAmmjHisj7M9EW@roszalog.8llppu3.mongodb.net',
  DB_NAME: 'main',
  WEB_APP_URL: 'https://dengitochka-web-app.herokuapp.com', // https://dengitochka-web-app.herokuapp.com
  API_ROOT: 'https://server.dengitochka.ru',
  PORT: 8080,
  PROVIDER_TOKEN: '401643678:TEST:0508416f-dcbb-4995-a89a-cc641c5cef58'
  // CHAT_IDS: [1303646809, 2010840813],
  // ADMINS_IDS: [1303646809, 2010840813],
  //CHAT_ID: -1001654902402,
}

export const SCENARIOS = {
  invest: 'invest',
  zalog: 'zalog',
  broker: 'broker',
  send: 'send',
  getCreditHistory: 'creditHistory',
  updateCreditHistory: 'updateCreditHistory',
  admin: 'admin',
  changedPrice: 'changedPrice',
  changedPassword: 'changedPassword',
  approvalOfferConditional: 'approvalOfferConditional',
  disapprovalOfferConditional: 'disapprovalOfferConditional'
}

export const PROVIDER_TOKEN_PAYMENTS = {
  sber: {
    name: 'Сбер',
    token: '401643678:TEST:580db33c-3e49-4554-baf4-7c6f7e733270'
  },
  payMaster: {
    name: 'PayMaster',
    token: '1744374395:TEST:10936d181364e26cbe8d'
  }
}