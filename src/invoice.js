import config from './global/config.js'

export function getInvoice(chat_id, provider_token) {
    const invoice = {
        chat_id: chat_id,
        title: 'InvoiceTitle',
        description: 'InvoiceDescription',
        payload: {
            unique_id: `${chat_id}_${Number(new Date())}`,
            provider_token: provider_token
        },
        provider_token: provider_token,
        currency: 'RUB',
        prices: [{ label: 'Invoice Title', amount: 100 * 100 }],
        start_parameter: 'get_access',
        photo_url: 'https://s3.eu-central-1.wasabisys.com/ghashtag/JavaScriptBot/Unlock.png',
        photo_width: 500,
        photo_height: 281,
      }
    
    return invoice
}