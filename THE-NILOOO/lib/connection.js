const { makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const pino = require('pino');
const qrcode = require('qrcode-terminal');
const fs = require('fs');

let sock = null;

module.exports = async function connect() {
  try {
    console.log('\n╔═══════════════════════════════════════╗');
    console.log('║  🔌 𝚆𝙷𝙰𝚃𝚂𝙰𝙿𝙿 𝙲𝙾𝙽𝙽𝙴𝙲𝚃𝙸𝙾𝙽 𝚂𝚃𝙰𝚁𝚃𝙸𝙽𝙶...  ║');
    console.log('╚═══════════════════════════════════════╝\n');
    
    const { state, saveCreds } = await useMultiFileAuthState('./auth_info');
    const { version } = await fetchLatestBaileysVersion();
    
    sock = makeWASocket({
      version: version,
      logger: pino({ level: 'silent' }),
      printQRInTerminal: false,
      auth: state,
      browser: ['𝚻𝚮𝚵 𝐍𝐈𝐋 𝐁𝐎𝐓', 'Chrome', '1.0.0']
    });

    sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update;
      
      if (qr) {
        console.log('\n╔═══════════════════════════════════════╗');
        console.log('║  📱 𝚂𝙲𝙰𝙽 𝚃𝙷𝙸𝚂 𝚀𝚁 𝙲𝙾𝙳𝙴             ║');
        console.log('╠═══════════════════════════════════════╣');
        console.log('║  🔥 𝚴𝚯𝚻 𝐔𝚪 𝚴𝚰𝐋 👑                ║');
        console.log('╚═══════════════════════════════════════╝\n');
        
        qrcode.generate(qr, { small: true });
        
        console.log('\n╔═══════════════════════════════════════╗');
        console.log('║  📸 STEPS TO CONNECT:                 ║');
        console.log('║  1️⃣  Open WhatsApp on your phone      ║');
        console.log('║  2️⃣  Go to Settings → Linked Devices  ║');
        console.log('║  3️⃣  Tap "Link a Device"              ║');
        console.log('║  4️⃣  Scan the QR code above ☝️         ║');
        console.log('╚═══════════════════════════════════════╝\n');
      }

      if (connection === 'close') {
        const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
        const statusCode = lastDisconnect?.error?.output?.statusCode;
        
        console.log('\n⚠️  Connection closed. Status code:', statusCode);
        console.log('Reason:', lastDisconnect?.error?.output?.payload?.message || 'Unknown');
        
        if (shouldReconnect) {
          console.log('🔄 Reconnecting in 10 seconds...\n');
          setTimeout(() => connect(), 10000);
        } else {
          console.log('❌ Logged out. Delete auth_info folder and restart to get new QR code.\n');
        }
      } else if (connection === 'open') {
        console.log('\n╔═══════════════════════════════════════╗');
        console.log('║  ✅ 𝚆𝙷𝙰𝚃𝚂𝙰𝙿𝙿 𝙲𝙾𝙽𝙽𝙴𝙲𝚃𝙴𝙳!         ║');
        console.log('║  🤖 𝚻𝚮𝚵 𝐍𝐈𝐋 𝐁𝐎𝐓 𝙸𝚂 𝚁𝙴𝙰𝙳𝚈!       ║');
        console.log('║  🔥 𝚴𝚯𝚻 𝐔𝚪 𝚴𝚰𝐋 👑                ║');
        console.log('╚═══════════════════════════════════════╝\n');
        
        // Load all plugins here
        console.log('📦 Loading bot plugins...');
        try {
          const fs = require('fs');
          const path = require('path');
          const pluginDir = path.join(__dirname, '../plugins');
          
          if (fs.existsSync(pluginDir)) {
            const pluginFiles = fs.readdirSync(pluginDir).filter(file => file.endsWith('.js'));
            let loadedCount = 0;
            
            for (const file of pluginFiles) {
              try {
                require(path.join(pluginDir, file));
                loadedCount++;
              } catch (err) {
                console.log(`⚠️  Could not load plugin ${file}: ${err.message}`);
              }
            }
            
            console.log(`✅ Loaded ${loadedCount}/${pluginFiles.length} plugins successfully!\n`);
          } else {
            console.log('⚠️  Plugins directory not found\n');
          }
        } catch (err) {
          console.log('⚠️  Plugin loading error: ', err.message);
        }
      }
    });

    sock.ev.on('creds.update', saveCreds);
    
    // Handle messages
    sock.ev.on('messages.upsert', async ({ messages }) => {
      try {
        const msg = messages[0];
        if (!msg.message) return;
        
        // Get message text
        const messageText = msg.message.conversation || 
                           msg.message.extendedTextMessage?.text || 
                           msg.message.imageMessage?.caption || 
                           msg.message.videoMessage?.caption || '';
        
        console.log(`\n📨 Received message: "${messageText}" from ${msg.key.remoteJid}`);
        
        if (!messageText) return;
        
        // Load commands from lib
        const { commands } = require('./index');
        const config = require('../config');
        
        // Get sender number
        const senderNumber = (msg.key.participant || msg.key.remoteJid).split('@')[0];
        const sudoNumbers = config.SUDO.split(',').map(n => n.trim());
        const isOwner = sudoNumbers.includes(senderNumber);
        const isFromMe = msg.key.fromMe;
        
        console.log(`👤 Sender: ${senderNumber}, Owner: ${isOwner}, FromMe: ${isFromMe}, WorkType: ${config.WORK_TYPE}`);
        
        // Check for command prefix
        const prefixRegex = new RegExp(config.HANDLERS);
        const hasPrefix = prefixRegex.test(messageText);
        
        if (!hasPrefix) {
          console.log('❌ No command prefix found');
          return;
        }
        
        // Extract command and args
        const prefix = messageText.match(prefixRegex)[0];
        const args = messageText.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        const match = args.join(' ');
        
        console.log(`🔍 Looking for command: "${commandName}"`);
        console.log(`📝 Total commands registered: ${commands.length}`);
        
        // Find and execute command
        for (const cmd of commands) {
          // Skip commands without valid patterns
          if (!cmd.pattern) continue;
          
          const patterns = Array.isArray(cmd.pattern) ? cmd.pattern : [cmd.pattern];
          
          for (const pattern of patterns) {
            // Skip undefined patterns
            if (!pattern) continue;
            
            const regex = typeof pattern === 'string' ? new RegExp(pattern, 'i') : pattern;
            
            if (regex.test(commandName) || (cmd.alias && cmd.alias.includes(commandName))) {
              console.log(`✅ Command found: ${commandName}`);
              
              // Check permissions
              if (cmd.fromMe) {
                // Command requires owner/fromMe
                if (config.WORK_TYPE === 'private' && !isOwner && !isFromMe) {
                  console.log(`🔒 Command "${commandName}" requires owner permission - denied`);
                  return;
                }
              }
              
              console.log(`⚡ Executing command: ${commandName}`);
              
              // Create message helper object
              const messageHelper = {
                client: sock,
                from: msg.key.remoteJid,
                sender: msg.key.participant || msg.key.remoteJid,
                text: messageText,
                isGroup: msg.key.remoteJid.endsWith('@g.us'),
                isOwner: isOwner,
                reply: async (text) => {
                  await sock.sendMessage(msg.key.remoteJid, { text }, { quoted: msg });
                },
                send: async (text) => {
                  return await sock.sendMessage(msg.key.remoteJid, { text });
                },
                react: async (emoji) => {
                  await sock.sendMessage(msg.key.remoteJid, { 
                    react: { text: emoji, key: msg.key } 
                  });
                }
              };
              
              // Execute command handler
              try {
                await cmd.handler(messageHelper, match);
                console.log(`✔️  Command "${commandName}" executed successfully`);
              } catch (err) {
                console.error(`❌ Command error (${commandName}):`, err.message);
                console.error(err.stack);
                await messageHelper.reply(`❌ Error: ${err.message}`);
              }
              
              return; // Exit after executing command
            }
          }
        }
        
        console.log(`❌ Command "${commandName}" not found`);
      } catch (error) {
        console.error('❌ Message processing error:', error.message);
        console.error(error.stack);
      }
    });
    
    return sock;
    
  } catch (error) {
    console.error("❌ Failed to initialize WhatsApp connection:", error.message);
    console.log('🔄 Retrying in 5 seconds...\n');
    setTimeout(() => connect(), 5000);
  }
};
