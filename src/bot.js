import { Telegraf, session } from 'telegraf'
import { getInlineKeyboard } from './services/bot/_helper.js'
import { COMMANDS, PROVIDER_TOKEN_PAYMENTS } from './global/config.js'
import config from './global/config.js'
import TG from './models/TG.js'
import { SetDefaultPrice, ProductPrice} from './models/price.js'
import { getPasswordHash } from './models/_helper.js'
import UserCredentials from './models/userCredentials.js'
import { getInvoice } from './invoice.js'
import { InitializeAdminCredentialsAsync, UpdateAdminPassword } from './models/userCredentials.js'

const { BOT_TOKEN, CHAT_ID} = config
const bot =  new Telegraf(BOT_TOKEN)

let sendPhone = ctx => {
  ctx.reply('Отправьте ваш номер телефона в формате +7(ваш номер)', {
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

bot.start(async (ctx, next) => {
  ctx.session = {scenario: null, nextCommand: null, login: null}

  /*const keyboard = [
    [{ text: '💸 Я Инвестор', callback_data: COMMANDS.invest }],
    [{ text: '📈 Я Брокер', callback_data: COMMANDS.broker }],
    [{ text: '📊 Мне нужен кредит', callback_data: COMMANDS.zalog }],
    [{ text: '📊 Мне нужна кредитная история', callback_data: COMMANDS.credit }]
  ]*/

  const keyboard = [
    [{ text: 'Хочу получить кредитный отчет', callback_data: COMMANDS.credit}],
    [{ text: 'Открыть webapp', web_app: {url: config.WEB_APP_URL}}]
  ]

  ctx.reply(`Здравствуйте, какой у вас вопрос? С радостью поможем`, getInlineKeyboard({ keyboard }))

  return await next()
})

function getAvailableAdminCommands(ctx, additionalString) {
  return ctx.sendMessage(`Админка ${additionalString ?? ''}` + 
  `\n\nИспользуйте команды, доступные для данной учетной записи: 
/changedPrice - изменение цены получения КИ
/changePassword - изменение пароля от учетной записи`)
}

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

  if(ctx.session?.scenario === COMMANDS.admin 
    && ctx.session?.nextCommand === 'adminAuthorize' 
    && ctx.message.text?.startsWith('/changePrice')) {
      ctx.sendMessage('Для изменения прайса получения КИ введите определенную стоимость в рублях')
  }

  if(ctx.message.text?.startsWith('/admin')) {
      ctx.session = {scenario: null, nextCommand: null, login: null}
    ctx.session.scenario = COMMANDS.admin
    ctx.session.nextCommand = 'adminLogin'
    ctx.sendMessage('Вы перешли в сценарий входа в профиль администратора. Введите логин и пароль от учетной записи')
    ctx.sendMessage('Введите логин')
  } else if (ctx.session?.scenario === COMMANDS.admin 
    && ctx.session?.nextCommand === 'adminLogin') {
      let login = ctx.message.text.trim();
      let admin = await UserCredentials.findOne({user_login: login})
      if (admin === null) {
        return ctx.sendMessage('Пользователя с таким логином не существует. Пожалуйста, введите корректный логин')
      }

      ctx.session.login = login
      ctx.session.nextCommand = 'adminPassword'
      ctx.sendMessage('Введите пароль')

  } else if (ctx.session?.scenario === COMMANDS.admin
    && ctx.session?.nextCommand === 'adminPassword') {
      let adminPassword = ctx.message.text.trim();
      const { password, salt } = await UserCredentials.findOne({user_login: ctx.session.login})
      if (password !== getPasswordHash(adminPassword, salt)) {
        return ctx.sendMessage('Неверный пароль. Пожалуйста, введите корректный пароль');
      }

      ctx.session.nextCommand = 'adminAuthorize'
      getAvailableAdminCommands(ctx, `Вы успешно авторизировались под пользователем ${ctx.session.login}.`)
  
    } else if(ctx.session?.scenario === COMMANDS.admin 
      && ctx.session?.nextCommand === 'adminAuthorize' 
      && ctx.message.text?.startsWith('/changePassword')) {
        ctx.session.scenario = COMMANDS.changedPassword
        ctx.sendMessage('Введите новый пароль для текущей учетной записи')
    }else if(ctx.session?.nextCommand === 'adminAuthorize' 
    && ctx.session.scenario === COMMANDS.changedPassword) {
      if (UpdateAdminPassword(ctx.message.text.trim()))
        ctx.sendMessage('Пароль от учетной записи успешно обновлен')
      else  
        ctx.sendMessage('Пароль от учетной записи не удалось обновить. Попробуйте обновить пароль позже.')
      
      getAvailableAdminCommands(ctx)
      
      ctx.session.scenario = COMMANDS.admin
      ctx.session.nextCommand = 'adminAuthorize'
    }
    else if (ctx.message.text?.startsWith('/changedPrice')
    && ctx.session?.nextCommand === 'adminAuthorize') {
      ctx.session.scenario = COMMANDS.changedPrice
      ctx.sendMessage('Для изменения прайса получения КИ введите определенную стоимость в рублях')
    
    } else if (ctx.session?.nextCommand === 'adminAuthorize' 
    && ctx.session.scenario === COMMANDS.changedPrice) {
      try {
        let productName = 'creditHistory'
        let res = await ProductPrice.updateOne({ product_name: productName }, { $set: { price: Number(ctx.message.text.trim()) } })
        if (res.modifiedCount === 0) {
          console.log(`Parameters in documents ${Object.keys({ProductPrice})} didn't update. Product name - ${Object.keys({productName})}, price - ${ctx.message.text.trim()}`)
          return ctx.sendMessage('Для изменения прайса получения КИ введите определенную стоимость в рублях')
        }
      }
      catch (ex) {
        console.log(ex)
      }

      ctx.session.scenario = COMMANDS.admin
      ctx.session.nextCommand = 'adminAuthorize'

      ctx.sendMessage(`Прайс выбранной услуги успешно изменен. Текущая стоимость услуги - ${ctx.message.text.trim()} руб.`)
      getAvailableAdminCommands(ctx)
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
    ctx.reply('Напишите ваш пароль от госуслуг')
    ctx.session.nextCommand = 'sendLoginDataToGosuslugi'

  } else if (ctx.session?.nextCommand === 'sendLoginDataToGosuslugi') {
    ctx.session.nextCommand = 'pay'
    let keyboard = []
    //Object.keys(PROVIDER_TOKEN_PAYMENTS).forEach(payment => keyboard.push([{text: PROVIDER_TOKEN_PAYMENTS[payment].name, callback_data: payment}]));

    //ctx.reply("Оплатите услугу получения КИ", getInlineKeyboard({keyboard}));
  }

  return await next();
})
bot.on('callback_query', onSentInvoice)
bot.on('callback_query', onNewCommand)

async function onSentInvoice(ctx, next) {
  if (ctx.session?.nextCommand === 'pay' 
    && ctx.session?.scenario === COMMANDS.credit) {
    let invoice = await getInvoice(ctx.from.id, PROVIDER_TOKEN_PAYMENTS[ctx.update.callback_query.data].token);

    return ctx.replyWithInvoice(invoice)
  }

  return next()
}

async function onNewCommand(ctx, next) {
  if (ctx.session === undefined)
    ctx.session = {scenario: null, nextCommand: null, login: null}
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

InitializeAdminCredentialsAsync()
await SetDefaultPrice("creditHistory", "НБКИ", 100, true)
await SetDefaultPrice("creditHistory", "ОКБ", 100)
await SetDefaultPrice("creditHistory", "БКИ СБ", 100)
await SetDefaultPrice("creditHistory", "СКБ", 100)
await SetDefaultPrice("creditHistory", "ВЕБКИ", 100)
await SetDefaultPrice("creditHistory", "МБКИ «КРЕДО»", 100)
await SetDefaultPrice("creditHistory", "Кредитное Бюро Русский Стандарт", 100)

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

export default bot
