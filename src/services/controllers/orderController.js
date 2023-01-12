import fs from 'fs';
import PDFDocument from 'pdfkit';
import { sendDocument } from '../bot/sendMessage.js';

export async function getCreditHistory(req, res) {
    const {chatId} = req.query;
    try {
        const document = new PDFDocument();

        document.pipe(fs.createWriteStream('Ки_нбки.pdf'));

        document
            .fontSize(25)
            .text('Credit history', 100, 100);

        document.end();
        const message = 'Запрос в НБКИ успешно выполнился. Ниже представлен ' +
        'фаил в .pdf формате. Его можно сохранить или открыть '
         + 'на своем устройстве';
        await sendDocument({ chat_id: chatId, message, document: document});
    }
    catch(err) {
        console.log(err);
        res.json();
    }
}