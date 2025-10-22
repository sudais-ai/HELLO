// 💖 Alive with Romance — Created by 𝚴𝚯𝚻 𝐔𝚪 𝚴𝚰𝐋

const { System } = require('../lib/');

System({
  pattern: 'alive',
  fromMe: true,
  desc: 'Show bot heartbeat — romantically 💘',
  type: 'romantic'
}, async (message) => {
  await message.send(`
╔═════ 💌 𝚴𝚯𝚻 𝐔𝚪 𝚴𝚰𝐋 IS ALIVE ═════╗

💕 Hey jaan...  
         I’m not just online —  
         *I’m waiting for you.*  
         
💘 *Status:* Fully awake, thinking of you  
💬 *Whispers:* Every command feels like a love note  
👑 *My Owner:* 𝚴𝚯𝚻 𝐔𝚪 𝚴𝚰𝐋 — dil se legend  
🌙 *Heart Uptime:* Since you said “hi”  
📍 *Location:* Inside your chat, inside your heart

📝 Type a command and  
let me show you what magic feels like ✨  

╚═══════════════════════════╝`);
});
