//import bot from '../../bot.js'
import config from '../../global/config.js'
const { CHAT_ID } = config

export async function sendMessage({ chat_id = CHAT_ID, type, data, options = [] }) {
  const message = []

  if (type === 'invest') {
    const { phone } = data
    message.push('Получать заявки на инвестирование:')
    message.push('https://invest.dengitochka.ru')
    message.push(`Phone: ${phone}`)
  }

  if (type === 'zalog') {
    const { phone, secured_by, name, city } = data
    message.push('Взять займ:')
    message.push('https://zalog.dengitochka.ru')
    message.push(`Phone: ${phone}`)
    message.push(`Объект залога: ${secured_by}`)
    message.push(`Name: ${name}`)
    message.push(`City: ${city}`)
  }

  //bot.telegram.sendMessage(chat_id, message.join('\n'), ...options)
}

export async function sendDocument({ chat_id, document, message, options = []}) {
  //bot.telegram.sendMessage(chat_id, message)
  //bot.telegram.sendDocument(chat_id, {source: document, filename: "ki.pdf"}, ...options)
}
