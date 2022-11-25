export function getInlineKeyboard({ keyboard }) {
  return {
    reply_markup: {
      inline_keyboard: keyboard
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
