const mineflayer = require('mineflayer');
const express = require('express');

function getRandomUsername() {
  const names = ['CoolBot', 'FunBot', 'MightyBot', 'StealthBot', 'SpeedyBot', 'PowerBot', 'SmartBot'];
  return names[Math.floor(Math.random() * names.length)] + Math.floor(Math.random() * 1000);
}

function createBot() {
  const bot = mineflayer.createBot({
    host: 'MineEarthians.aternos.me', // replace with your Aternos server IP
    port: 32203,                      // replace with your Aternos server port if needed
    username: getRandomUsername(),    // generate a random bot username
    version: '1.16.5',                // specify the Minecraft version
  });

  bot.on('login', () => {
    console.log('Bot has logged in as ' + bot.username);
  });

  bot.on('spawn', () => {
    console.log('Bot has spawned in the world.');

    function randomMovement() {
      const actions = ['jump', 'move', 'look'];
      const action = actions[Math.floor(Math.random() * actions.length)];

      if (action === 'jump') {
        bot.setControlState('jump', true);
        setTimeout(() => bot.setControlState('jump', false), 500);
      } else if (action === 'move') {
        const directions = ['forward', 'back', 'left', 'right'];
        const direction = directions[Math.floor(Math.random() * directions.length)];
        bot.setControlState(direction, true);
        setTimeout(() => bot.setControlState(direction, false), 1000);
      } else if (action === 'look') {
        const yaw = Math.random() * 2 * Math.PI;
        const pitch = (Math.random() - 0.5) * Math.PI;
        bot.look(yaw, pitch, true);
      }
    }

    function interactWithEnvironment() {
      const block = bot.blockAtCursor(4);
      if (block) {
        bot.dig(block);
      } else {
        const entity = bot.nearestEntity();
        if (entity) {
          bot.attack(entity);
        }
      }
    }

    setInterval(randomMovement, 5000); // Perform a random movement action every 5 seconds
    setInterval(randomMovement, 10000); // Perform a random movement action every 10 seconds
    setInterval(randomMovement, 15000); // Perform a random movement action every 15 seconds
    setInterval(interactWithEnvironment, 10000); // Interact with the environment every 10 seconds
  });

  bot.on('chat', (username, message) => {
    if (username === bot.username) return;
    console.log(`<${username}> ${message}`);
    if (message === 'hello') {
      bot.chat(`Hello ${username}, I am a bot!`);
    }
    if (message.startsWith('!ban ')) {
      const target = message.split(' ')[1];
      if (target) {
        bot.chat(`/ban ${target}`);
        console.log(`Banned player: ${target}`);
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
    console.log('Bot has disconnected. Reconnecting in 30 seconds with a new username...');
    setTimeout(createBot, 30000); // Reconnect after 30 seconds with a new username
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
