const mineflayer = require('mineflayer');
const express = require('express');

function createBot() {
  const bot = mineflayer.createBot({
    host: 'MineEarthians.aternos.me', // replace with your Aternos server IP
    port: 32203,                      // replace with your Aternos server port if needed
    username: 'BehenKaLda',          // replace with the bot's username
    version: '1.16.5',                // specify the Minecraft version
    // password: 'your_minecraft_password', // Uncomment if your bot uses a Minecraft account
  });

  bot.on('login', () => {
    console.log('Bot has logged in.');
  });

  bot.on('spawn', () => {
    console.log('Bot has spawned in the world.');
    // Make the bot jump continuously
    function keepJumping() {
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 500);
      setTimeout(keepJumping, 1000); // Adjust the interval as needed
    }
    keepJumping();
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

  bot.on('health', () => {
    console.log(`Health: ${bot.health}, Food: ${bot.food}`);
  });
}

createBot();

// HTTP server to keep Render happy
const app = express();
const port = process.env.PORT || 8080;
app.get('/', (req, res) => res.send('Minecraft bot is running'));
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
