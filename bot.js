const mineflayer = require('mineflayer');
const express = require('express');

// List of admins who can use special commands
const allowedUsers = ['YourMinecraftUsername']; // Replace with your Minecraft username(s)

// Bot creation function
function createBot(username) {
  const bot = mineflayer.createBot({
    host: 'OBS-AURORA.aternos.me', // Replace with your Aternos server IP
    port: 56634,                      // Replace with your Aternos server port
    username: NodejsBot,               // Replace with a valid username or bot name
    version: '1.21.4',                 // Make sure this matches your server version
    // password: 'your_minecraft_password', // Uncomment if using a Minecraft account
  });

  bot.on('login', () => {
    console.log(`✅ Bot ${bot.username} has logged in.`);
  });

  bot.on('spawn', () => {
    console.log('✅ Bot has spawned in the world.');

    function randomMovement() {
      const actions = ['jump'];
      const action = actions[Math.floor(Math.random() * actions.length)];

      if (action === 'jump') {
        bot.setControlState('jump', true);
        setTimeout(() => bot.setControlState('jump', false), 500);
      }
    }

    setInterval(randomMovement, 15000); // Perform a random movement every 15 seconds
  });

  // Chat command handling
  bot.on('chat', (username, message) => {
    if (username === bot.username) return; // Ignore its own messages

    if (message === 'hello') {
      bot.chat(`Hello ${username}, I am a bot!`);
    }

    // Ban command (Only allowed users can use it)
    if (message.startsWith('!ban ')) {
      if (!allowedUsers.includes(username)) {
        bot.chat(`@${username}, you are not allowed to use this command!`);
        return;
      }
      const target = message.split(' ')[1];
      if (target) {
        bot.chat(`/ban ${target}`);
      }
    }
  });

  // Auto-respawn when bot dies
  bot.on('death', () => {
    console.log('⚰️ Bot died! Respawning in 5 seconds...');
    setTimeout(() => bot.chat('/respawn'), 5000);
  });

  // Error handling
  bot.on('error', (err) => {
    console.error('❌ Error:', err);
  });

  bot.on('kicked', (reason) => {
    console.log(`❌ Kicked for: ${reason}`);
  });

  // Auto-reconnect with increasing delay
  let reconnectDelay = 60000; // Start with 60 seconds

  bot.on('end', () => {
    console.log(`🔄 Bot disconnected. Reconnecting in ${reconnectDelay / 1000} seconds...`);
    setTimeout(() => {
      createBot(bot.username);
      reconnectDelay = Math.min(reconnectDelay * 2, 300000); // Increase delay up to 5 minutes
    }, reconnectDelay);
  });

  bot.on('health', () => {
    console.log(`❤️ Health: ${bot.health}, 🍗 Food: ${bot.food}`);
  });
}

// Start the bot with the specified username
createBot('BehenKaLoda'); // Change username if necessary

// Express server to prevent sleep mode (useful for hosting on free services)
const app = express();
const port = process.env.PORT || 8080;
app.get('/', (req, res) => res.send('Minecraft bot is running 🚀'));
app.listen(port, () => {
  console.log(`🌐 Server is running on port ${port}`);
});
