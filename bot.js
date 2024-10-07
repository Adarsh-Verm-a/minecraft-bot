const mineflayer = require('mineflayer');
const express = require('express');

function createBot(username) {
  const bot = mineflayer.createBot({
    host: 'MineEarthians.aternos.me', // replace with your Aternos server IP
    port: 32203,                      // replace with your Aternos server port if needed
    username: username,               // use the specified username
    version: '1.17.1',                // specify the Minecraft version
    // password: 'your_minecraft_password', // Uncomment if your bot uses a Minecraft account
  });

  bot.on('login', () => {
    console.log(`Bot has logged in as ${bot.username}.`);
  });

  bot.on('spawn', () => {
    console.log('Bot has spawned in the world.');

    function randomMovement() {
      const actions = ['jump'];
      const action = actions[Math.floor(Math.random() * actions.length)];

      if (action === 'jump') {
        bot.setControlState('jump', true);
        setTimeout(() => bot.setControlState('jump', false), 500);
      }
    }

    setInterval(randomMovement, 15000); // Perform a random movement action every 15 seconds
  });

  bot.on('chat', (username, message) => {
    if (username === bot.username) return;
    if (message === 'hello') {
      bot.chat(`Hello ${username}, I am a bot!`);
    }
    if (message.startsWith('!ban ')) {
      const target = message.split(' ')[1];
      if (target) {
        bot.chat(`/ban ${target}`);
      }
    }
  });

  bot.on('error', (err) => {
    console.error('Error:', err);
  });

  bot.on('kicked', (reason) => {
    console.log(`Kicked for ${reason}`);
  });

  bot.on('end', () => {
    console.log(`Bot has disconnected. Reconnecting in 60 seconds with the same username...`);
    setTimeout(() => createBot(bot.username), 60000); // Reconnect after 60 seconds with the same username
  });

  bot.on('health', () => {
    console.log(`Health: ${bot.health}, Food: ${bot.food}`);
  });
}

createBot('BehenKaLoda'); // Start the bot with the specified username

// HTTP server to keep Render happy
const app = express();
const port = process.env.PORT || 8080;
app.get('/', (req, res) => res.send('Minecraft bot is running'));
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
