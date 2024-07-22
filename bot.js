const mineflayer = require('mineflayer');

function createBot() {
  const bot = mineflayer.createBot({
    host: 'MineEarthians.aternos.me', // replace with your Aternos server IP
    port: 32203,                      // replace with your Aternos server port if needed
    username: 'GANDU',                  // replace with the bot's username
    version: '1.16.1',                // specify the Minecraft version
    // password: 'your_minecraft_password', // Uncomment if your bot uses a Minecraft account
  });

  bot.on('login', () => {
    console.log('Bot has logged in.');
  });

  bot.on('spawn', () => {
    console.log('Bot has spawned in the world.');
    // Move around to avoid being kicked for inactivity
    setInterval(() => {
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 500);
    }, 60000); // Jump every 60 seconds
  });

  bot.on('chat', (username, message) => {
    if (username === bot.username) return;
    console.log(`<${username}> ${message}`);
    if (message === 'hello') {
      bot.chat(`Hello ${username}, I am a bot!`);
    }
  });

  bot.on('error', (err) => {
    console.error('Error:', err);
  });

  bot.on('end', () => {
    console.log('Bot has disconnected. Reconnecting in 30 seconds...');
    setTimeout(createBot, 30000); // Reconnect after 30 seconds
  });
}

createBot();
