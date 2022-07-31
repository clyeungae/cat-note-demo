const tgBot = require('./telegram');
const sheet = require('./sheet');

const start = async () => {
  console.log('--- start ---');
  await sheet.init();
  tgBot.init();
};

start();

