export function getInlineKeyboard({ keyboard }) {
  return {
    reply_markup: {
      inline_keyboard: keyboard,
      resize_keyboard: false
    }
  }
}
export function getPhone({ keyboard }) {
  return {
    reply_markup: {
      one_time_keyboard: true,
      resize_keyboard: true
    }
  }
}
