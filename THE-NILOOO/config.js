const { Sequelize } = require('sequelize');
const fs = require('fs');

if (fs.existsSync('config.env')) {
  require('dotenv').config({ path: './config.env' });
}

global.api = 'https://enthusiastic-ag-lokiking-524102b4.koyeb.app/';

const toBool = (x) => (x && (x.toLowerCase() === 'true' || x.toLowerCase() === 'on')) || false;
const DATABASE_URL = process.env.DATABASE_URL === undefined ? "./database.db" : process.env.DATABASE_URL;

module.exports = {
  VERSION: require('./package.json').version,
  BAN_CHATS: process.env.BAN_CHATS || "",
  PORT: process.env.PORT || 8000,
  PM_BLOCKER: toBool(process.env.PM_BLOCKER || "false"),
  PM_BLOCKER_MSG: process.env.PM_BLOCKER_MSG || "🚫 *PM Blocker is Active!*",
  AUDIO_DATA: process.env.AUDIO_DATA || '𝚴𝚯𝚻 𝐔𝚪 𝚴𝚰𝐋;𝚻𝚮𝚵 𝐋𝚵𝐆𝚴𝚴𝐃𝚫𝚪𝐘;https://graph.org/file/1506e5842805b0968c5cf.mp4',
  WARN_COUNT: process.env.WARN_COUNT || '3',
  AUTOMUTE_MSG: process.env.AUTOMUTE_MSG || '_🔇 Group auto-muted!_',
  AUTOUNMUTE_MSG: process.env.AUTOUNMUTE_MSG || '_🔊 Group auto-unmuted!_',
  ANTILINK_MSG: process.env.ANTILINK_MSG || "🚫 *Links not allowed here!*",
  ANTIBOT_MSG: process.env.ANTIBOT_MSG || "🤖 *Antibot kicked successfully!*",
  ANTIWORD_MSG: process.env.ANTIWORD_MSG || "⚠️ *Blocked word deleted!*",
  ALIVE_DATA: process.env.ALIVE_DATA || "_✨ *Hello &sender,*\n\n🤖 I am alive!\n🧠 Platform: &platform\n⏱ Runtime: &runtime\n\n_Use `.alive` to check again_",
  SESSION_ID: process.env.SESSION_ID || '',
  LANG: (process.env.LANGUAGE || 'EN').toLowerCase(),
  SETVV: process.env.SETVV || 'DM',
  ELEVENLABS: process.env.ELEVENLABS || "",
  HANDLERS: (process.env.HANDLERS || process.env.HANDLER || process.env.PREFIX || "^[.,!]").trim(),
  ALLWAYS_ONLINE: toBool(process.env.ALLWAYS_ONLINE || "false"),
  READ_MSG: toBool(process.env.READ_MSG || "false"),
  BRANCH: "main",
  LINKPREVIEW: toBool(process.env.LINKPREVIEW || "false"),
  CONTEXTINFO: process.env.CONTEXTINFO || `{"title": "𝚻𝚮𝚵 𝐁𝐎𝐓", "body": "𝚴𝚯𝚻 𝐔𝚪 𝚴𝚰𝐋 🔥", "thumbnailUrl": "https://graph.org/file/1506e5842805b0968c5cf.mp4", "renderLargerThumbnail": true, "mediaType": 1, "mediaUrl": "", "sourceUrl": "https://wa.me/923474810818", "showAdAttribution": true}`,
  RAILWAY_API: process.env.RAILWAY_API || '',
  KOYEB_API: process.env.KOYEB_API || '',
  KOYEB_APP_NAME: process.env.KOYEB_APP_NAME || '',
  RENDER_API: process.env.RENDER_API || '',
  RENDER_APP_NAME: process.env.RENDER_APP_NAME || '',
  BRAINSHOP: process.env.BRAINSHOP || '172372,nbjE0YAlyw3cpoMl',
  TGTOKEN: process.env.TGTOKEN || '',
  STICKER_PACKNAME: process.env.STICKER_PACKNAME || '𝚻𝚮𝚵 𝐋𝚵𝐆𝚴𝚴𝐃𝚫𝚪𝐘;𝚴𝚯𝚻 𝐔𝚪 𝚴𝚰𝐋',
  CALL_BLOCK: toBool(process.env.CALL_BLOCK || "false"),
  SAVE_STATUS: toBool(process.env.SAVE_STATUS || "false"),
  STATUS_VIEW: process.env.STATUS_VIEW || "false",
  REJECT_CALL: toBool(process.env.REJECT_CALL || "false"),
  ERROR_MSG: toBool(process.env.ERROR_MSG) || true,
  WELCOME_MSG: process.env.WELCOME_MSG || "🌟 *Welcome &mention to* _&gname_ 🥳\n— from 𝚻𝚮𝚵 𝐁𝐎𝐓",
  GOODBYE_MSG: process.env.GOODBYE_MSG || "👋 *Goodbye $mention!* We'll miss you!\n— 𝚻𝚮𝚵 𝐁𝐎𝐓",
  MEDIA_DATA: process.env.MEDIA_DATA || '💎 𝐌𝐞𝐧𝐮;𝚻𝚮𝚵 𝐁𝐎𝐓;https://graph.org/file/1506e5842805b0968c5cf.mp4',
  MENU_FONT: process.env.MENU_FONT || "1;1",
  SUDO: process.env.SUDO || '923474810818',
  AUTH_FILE: process.env.AUTH_FILE,
  DISABLE_PM: toBool(process.env.DISABLE_PM || "false"),
  DISABLE_GRP: toBool(process.env.DISABLE_GRP || "false"),
  STATUS_REPLY: toBool(process.env.STATUS_REPLY || "true"),
  STATUS_REPLY_MSG: process.env.STATUS_REPLY_MSG || "🔥 *𝚻𝚮𝚵 𝐁𝐎𝐓 noticed your status!*",
  KICK_BLOCK: toBool(process.env.KICK_BLOCK || "false"),
  CMD_REACTION: toBool(process.env.CMD_REACTION || "true"),
  TIMEZONE: process.env.TIMEZONE || "Asia/Karachi",
  STARTING_MSG: toBool(process.env.STARTING_MSG || "true"),
  STATUS_REACTION_EMOJI: process.env.STATUS_REACTION_EMOJI || "🔥,💫,💎",
  STATUS_REACTION: toBool(process.env.STATUS_REACTION || "true"),
  GEMINI: process.env.GEMINI || "",
  GROQ_KEY: process.env.GROQ_KEY || "",
  GROQ_MODEL: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
  LOG_MSG: toBool(process.env.LOG_MSG) || true,
  HEROKU_APP_NAME: process.env.HEROKU_APP_NAME || '',
  HEROKU_API_KEY: process.env.HEROKU_API_KEY || '',
  BOT_INFO: process.env.BOT_INFO || '𝚻𝚮𝚵 𝐁𝐎𝐓;𝚴𝚯𝚻 𝐔𝚪 𝚴𝚰𝐋;https://graph.org/file/1506e5842805b0968c5cf.mp4&gif',
  WORK_TYPE: process.env.WORK_TYPE || 'private',
  NSFW: toBool(process.env.NSFW || "false"),
  DATABASE: DATABASE_URL === "./database.db"
    ? new Sequelize({ dialect: "sqlite", storage: DATABASE_URL, logging: false })
    : new Sequelize(DATABASE_URL, {
        dialect: "postgres",
        ssl: true,
        protocol: "postgres",
        dialectOptions: {
          native: true,
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        },
        logging: false,
      }),
};
