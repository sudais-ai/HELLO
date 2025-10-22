/*=======================================================================================================

🌟 AFK Handler Plugin — Developed by 𝚴𝚯𝚻 𝐔𝚪 𝚴𝚰𝐋
🛠️ License: GPL-3.0 | You may use or remix with proper credit.
📂 Module: plugins/afk.js

=======================================================================================================*/

const { System } = require('../lib/');
const { secondsToHms } = require('./client/');

const AFK = {
  isAfk: false,
  reason: null,
  lastseen: 0
};

// 🔁 Respond to incoming messages when AFK is active
System({ on: 'all', fromMe: false }, async (message) => {
  if (message.isBot || message.fromMe || !AFK.isAfk) return;

  const shouldRespond =
    (message.isGroup && message.mention.isBotNumber) ||
    (!message.isGroup) ||
    (message.reply_message && message.reply_message.sender === message.user.jid);

  if (!shouldRespond) return;

  let response = `*🔕 I'm currently AFK.*`;
  if (AFK.reason) response += `\n*📎 Reason:* \`\`\`${AFK.reason}\`\`\``;
  if (AFK.lastseen !== 0) {
    const duration = secondsToHms(Math.floor(Date.now() / 1000) - AFK.lastseen);
    response += `\n*⏱️ Last Seen:* \`\`\`${duration}\`\`\``;
  }

  await message.send(response, { quoted: message.data });
});

// 🔄 Reset AFK when owner sends a message
System({ on: 'text', fromMe: true }, async (message) => {
  if (message.isBot || message.sender !== message.user.jid || !AFK.isAfk) return;

  AFK.isAfk = false;
  AFK.reason = null;
  AFK.lastseen = 0;

  await message.send('*✅ Welcome back! AFK mode deactivated.*');
});

// 🔘 Command to activate AFK
System({
  pattern: 'afk ?(.*)',
  fromMe: true,
  desc: 'Set yourself Away From Keyboard',
}, async (message, match) => {
  if (AFK.isAfk || message.isBot) return;

  AFK.isAfk = true;
  AFK.reason = match || null;
  AFK.lastseen = Math.floor(Date.now() / 1000);

  const notice = AFK.reason
    ? `*_AFK mode activated._*\n*Reason:* ${AFK.reason}`
    : '*_AFK mode activated._*';

  await message.send(notice);
});
