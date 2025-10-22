/*═══════════════════════════════════════════════◆
   💋 𝚻𝚮𝚵 𝐋𝚵𝐆𝚴𝚴𝚫𝚪𝐄 𝚴𝚰𝐋 𝚩𝚯𝚻 🔥 - stalk.js module
   💎 Copyright © 𝚴𝚯𝚻 𝐔𝚪 𝚴𝚰𝐋 👑
   🔞 Stylish | Romantic | Sexy Bot System
═══════════════════════════════════════════════◆*/

const { System, IronMan, isPrivate, getJson } = require("../lib/");

//💗 Instagram Stalk
System({
  pattern: 'ig ?(.*)',
  fromMe: isPrivate,
  desc: '✨ ɢᴇᴛ ɪɴꜱᴛᴀɢʀᴀᴍ ᴘʀᴏꜰɪʟᴇ ᴅᴇᴛᴀɪʟꜱ',
  type: 'stalk',
}, async (msg, text) => {
  if (!text) return await msg.reply("*💘 Darling... give me a username, please~*\n\n_Example: .ig sedboy.am_");
  const res = await getJson(IronMan(`ironman/igstalk?id=${encodeURIComponent(text.trim())}`));
  let caption = `🍓 *ɪɴꜱᴛᴀ ᴘʀᴏꜰɪʟᴇ ꜱᴇᴀʀᴄʜ ꜰᴏʀ @${text}* 💘\n\n`;
  if (res.name) caption += `• 𓆩 ɴᴀᴍᴇ: ${res.name}\n`;
  if (res.username) caption += `• 𓆩 ᴜꜱᴇʀɴᴀᴍᴇ: ${res.username}\n`;
  if (res.bio) caption += `• 𓆩 ʙɪᴏ: ${res.bio}\n`;
  if (res.pronouns?.length) caption += `• 𓆩 ᴘʀᴏɴᴏᴜɴꜱ: ${res.pronouns.join(', ')}\n`;
  if (res.followers) caption += `• 𓆩 ꜰᴏʟʟᴏᴡᴇʀꜱ: ${res.followers}\n`;
  if (res.following) caption += `• 𓆩 ꜰᴏʟʟᴏᴡɪɴɢ: ${res.following}\n`;
  if (res.private !== undefined) caption += `• 𓆩 ᴘʀɪᴠᴀᴛᴇ: ${res.private ? 'Yes 🔐' : 'No 🔓'}\n`;
  if (res.email) caption += `• 𓆩 ᴇᴍᴀɪʟ: ${res.email}\n`;
  if (res.contact) caption += `• 𓆩 ᴄᴏɴᴛᴀᴄᴛ: ${res.contact}\n`;
  await msg.send({ url: res.hdpfp }, { caption: caption.trim(), quoted: msg }, "image");
});

//💗 GitHub Stalk
System({
  pattern: 'gitinfo ?(.*)',
  fromMe: isPrivate,
  desc: '✨ ɢɪᴛʜᴜʙ ᴘʀᴏꜰɪʟᴇ ᴅᴇᴛᴀɪʟꜱ',
  type: 'stalk',
}, async (msg, text) => {
  if (!text) return await msg.reply("*🌹 Baby, give me a GitHub username 💻*");
  const user = await getJson(`https://api.github.com/users/${text}`);
  const caption = `🌟 *GitHub Profile: ${user.login}*\n\n`
    + `• 🧸 Name: ${user.name || "Unknown"}\n`
    + `• 🖋 Bio: ${user.bio || "No bio"}\n`
    + `• 🛠 Repos: ${user.public_repos}\n`
    + `• ⭐ Followers: ${user.followers}\n`
    + `• 💌 Email: ${user.email || "Not Public"}\n`
    + `• 📍 Location: ${user.location || "Hidden"}\n`
    + `• 🔗 Profile: ${user.html_url}\n`
    + `• 🕰 Joined: ${user.created_at}`;
  await msg.send({ url: user.avatar_url }, { caption }, "image");
});

//💗 TikTok Stalk
System({
  pattern: 'tkt ?(.*)',
  fromMe: isPrivate,
  desc: '✨ ᴛɪᴋᴛᴏᴋ ᴜꜱᴇʀ ᴅᴇᴛᴀɪʟꜱ',
  type: 'stalk',
}, async (msg, text) => {
  if (!text) return await msg.reply("*👅 Sweetheart, I need a TikTok username...*");
  const res = await getJson(IronMan(`ironman/stalk/tiktok?id=${encodeURIComponent(text)}`));
  const { user, stats } = res;
  const caption = `👑 *TikTok Love Scan for* @${user.uniqueId} 💘\n\n`
    + `• 💞 Nickname: ${user.nickname}\n`
    + `• 💬 Bio: ${user.signature}\n`
    + `• ✅ Verified: ${user.verified ? 'Yes 💯' : 'No ❌'}\n`
    + `• 🧚 Followers: ${stats.followerCount}\n`
    + `• 🔥 Hearts: ${stats.heartCount}\n`
    + `• 📸 Videos: ${stats.videoCount}`;
  await msg.send({ url: user.avatarLarger }, { caption }, "image");
});

//💗 Telegram Stalk
System({
  pattern: 'telegram ?(.*)',
  fromMe: isPrivate,
  desc: '✨ ᴛᴇʟᴇɢʀᴀᴍ ᴜꜱᴇʀ ɪɴꜰᴏ',
  type: 'stalk',
}, async (msg, text) => {
  if (!text) return await msg.reply("*👑 Baby tell me a Telegram username 💌*\n_Example: .telegram @Nil_");
  const { result } = await getJson(api + "stalk/telegram?query=" + text);
  const caption = `💫 *Telegram User Scan*\n\n`
    + `• 💘 User: ${result.userName}\n`
    + `• 🌸 Name: ${result.nickName}\n`
    + `• 💌 Bio: ${result.about}\n`
    + `• 🛜 Link: ${result.telegram}`;
  await msg.send({ url: result.profile }, { caption }, "image");
});
