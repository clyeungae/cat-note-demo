const TelegramBot = require("node-telegram-bot-api");
const sheet = require('../sheet');
const dayjs = require('dayjs');

const TOKEN = "";
const CHAT_ID = [];

const bot = new TelegramBot(TOKEN, {polling: true});

exports.init = () => {
  console.log('--- init telegram bot ---');
  bot.onText(/\/start$/, (msg) => {
    const chat_id = msg.chat.id;
    bot.sendMessage(chat_id, 'Welcome to Cat Note Demo');
  });

  bot.onText(/\/chatid$/, (msg) => {
    const chat_id = msg.chat.id;
    bot.sendMessage(chat_id, `${chat_id}`);
  });

  bot.onText(/\/feed$/, async (msg) => {
    const chat_id = msg.chat.id;
    // simple checking to limit function call be call by me / sister
    if (CHAT_ID.indexOf(chat_id) === -1) return;
    
    const now = dayjs().unix();
    await sheet.append('Sheet1!A:A', [[now]]);
    
    // notify all user in list
    CHAT_ID.map((id) => {
      bot.sendMessage(id, `Cats have fed at ${dayjs.unix(now).format('YYYY-MM-DD HH:mm:ss')}`);
    })
  });

  bot.onText(/\/lastfeed$/, async (msg) => {
    const chat_id = msg.chat.id;
    // simple checking to limit function call be call by me / sister
    if (CHAT_ID.indexOf(chat_id) === -1) return;

    let lastFeedTime = 0;
    const rs = await sheet.get('Sheet1!A:A');
    if (rs?.data?.values?.length > 0) {
      const lastRow = rs.data.values.pop();
      lastFeedTime = lastRow.pop();
    }

    // handle early stage of no data
    if (lastFeedTime <= 0) {
      return bot.sendMessage(chat_id, 'No one fed the cat');
    }
    
    // handle reply format
    const diff = dayjs().diff(dayjs.unix(lastFeedTime), 'hours');
    let reply = `Cats have been fed at ${dayjs.unix(lastFeedTime).format('YYYY-MM-DD HH:mm:ss')}`;
    if (diff > 0) {
      reply += ` which is ${diff} hour(s) before`;
    }

    bot.sendMessage(chat_id, reply);
  });
}
