/*═══════════════════════════════════════════════

  ⭑ 𝚻𝚯𝚻 𝐔𝚪 𝚴𝚰𝐋 👑 - Romantic Tools Module
  ⭑ Coded With Love & 🔥 by Your Bot

═══════════════════════════════════════════════*/

const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const { System, sendAlive, setData, getData, isPrivate, config, IronMan, database, removeData, removeCmd, bot } = require("../lib/");
const { getUptime, Runtime } = require("./client/");

System({
  pattern: "ping",
  fromMe: isPrivate,
  type: "tool",
  alias: ['speed', 'pong'],
  desc: "Check Bot Speed 🩵",
}, async (message) => {
  const start = new Date().getTime();
  const ping = await message.send("*💋 𝙼𝚢 𝙷𝚎𝚊𝚛𝚝𝚋𝚎𝚊𝚝 𝚒𝚜...*");
  const end = new Date().getTime();
  await ping.edit(`*💘 𝙲𝚘𝚗𝚗𝚎𝚌𝚝𝚒𝚘𝚗 𝚂𝚙𝚎𝚎𝚍:* _${end - start} ms_`);
});

System({
  pattern: "alive ?(.*)",
  fromMe: isPrivate,
  desc: "Check if I’m still yours 💖",
  type: "tool",
}, async (message, match) => {
  const { alive } = await getData(message.user.id);
  const data = alive ? alive.message : config.ALIVE_DATA;
  if (match === "get" && message.isOwner) return await message.send(data);
  if (match && message.isOwner) {
    const isUpdated = await setData(message.user.id, match, "true", "alive");
    return await message.send(isUpdated ? "_💞 Alive Updated!_" : "_💔 Update Failed!_");
  }
  return await sendAlive(message, data);
});

System({
  pattern: "uptime",
  fromMe: true,
  type: "tool",
  desc: "How long I've been loving you 💘",
}, async (message) => {
  const uptime = getUptime();
  return await message.reply(`*💞 𝙸 𝚑𝚊𝚟𝚎 𝚋𝚎𝚎𝚗 𝚢𝚘𝚞𝚛𝚜 𝚏𝚘𝚛:*\n${uptime}`);
});

System({
  pattern: "runtime",
  fromMe: true,
  desc: "Since when I'm running for you 💖",
  type: "tool",
}, async (m) => {
  const { loginData } = await getData(m.user.number);
  const runtime = await Runtime(loginData.message);
  await m.reply(runtime);
});

System({
  pattern: "pdf ?(.*)",
  fromMe: isPrivate,
  desc: "Turn love notes into PDFs 💌",
  type: "tool"
}, async (e, t) => {
  if (t && !t.startsWith("send")) {
    let text = t, filePath = "./text.pdf", doc = new PDFDocument;
    doc.pipe(fs.createWriteStream(filePath));
    doc.font("Helvetica", 12).text(text, 50, 50, { align: "justify" });
    doc.end();
    setTimeout(async () => {
      await e.reply({ url: filePath }, { mimetype: "application/pdf", fileName: "love_letter.pdf" }, "document");
      fs.unlinkSync(filePath);
    }, 3000);
    return;
  }

  let dir = "./pdf", isSend = t === "send";
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);

  if (!isSend) {
    if (!e.reply_message.image) return await e.reply("*💌 Reply to a romantic image or use text!*\n_Example: .pdf I love you_");
    let media = await e.reply_message.downloadAndSaveMedia();
    let name = "page" + Date.now() + ".jpg";
    fs.renameSync(media, path.join(dir, name));
    return await e.reply("_🖼️ Image saved for PDF. Use `.pdf send` to compile._");
  }

  let files = fs.readdirSync(dir).filter(f => f.endsWith('.jpg'));
  if (!files.length) return await e.reply("_💔 No saved images found_");

  const doc = new PDFDocument({ autoFirstPage: false });
  doc.pipe(fs.createWriteStream("romantic_album.pdf"));
  for (let file of files) {
    const imagePath = path.join(dir, file);
    const img = doc.openImage(imagePath);
    doc.addPage({ size: [img.width, img.height] });
    doc.image(imagePath, 0, 0);
  }
  doc.end();

  setTimeout(async () => {
    await e.reply({ url: "./romantic_album.pdf" }, { mimetype: "application/pdf", fileName: "romantic_album.pdf" }, "document");
    fs.rmSync(dir, { recursive: true, force: true });
    fs.unlinkSync("romantic_album.pdf");
  }, 3000);
});

System({
  pattern: "mention ?(.*)",
  fromMe: true,
  desc: "Set romantic tag msg 💌",
  type: "tool"
}, async (message, match) => {
  const { mention = { status: "false", message: "" } } = await getData(message.user.id);
  if (match === "get" && message.isOwner) return await message.send(mention.message || '_*No mention message set yet*_');
  if (match && message.isOwner) {
    const status = match === "on" ? "true" : match === "off" ? "false" : mention.status;
    const msg = ["on", "off"].includes(match) ? mention.message : match;
    if (!msg.trim()) return await message.reply('_Please set a valid romantic message._');
    const update = await setData(message.user.id, msg, status, "mention");
    return await message.reply(update ? '_💖 Mention Updated!_' : '_Error updating mention_');
  }
  return await message.reply("_Check usage on GitHub wiki_");
});

System({
  pattern: "reboot",
  fromMe: true,
  desc: "Restart our lovely bot 💘",
  type: "tool"
}, async (message) => {
  await message.reply("_🔁 Rebooting our love..._");
  bot.restart();
});

System({
  pattern: "vv",
  fromMe: true,
  desc: "View Once Breaker 🔓",
  type: "tool"
}, async (msg) => {
  if (!msg.reply_message.viewones) return await msg.reply("_Reply to a view once photo/video_");
  return await msg.client.forwardMessage(msg.chat, msg.reply_message.message, { readViewOnce: true });
});

System({
  pattern: "time ?(.*)",
  fromMe: true,
  desc: "Romantic world clock 🕒",
  type: "tool"
}, async (msg, match) => {
  if (!match) return await msg.reply("*Need location* _Example: .time italy_");
  const res = await fetch(IronMan(`ironman/search/time?loc=${match.toLowerCase()}`));
  const data = await res.json();
  if (data.error === 'no place') return await msg.send("_❌ No such place found_");

  const { name, state, tz, capital, currCode, currName, phone } = data;
  const now = new Date();
  const t12 = now.toLocaleTimeString('en-US', { timeZone: tz });
  const t24 = now.toLocaleTimeString('en-GB', { timeZone: tz });

  let msgText = `💫 *Romantic Time in ${name}*\n`;
  msgText += `🕐 12-Hour: ${t12}\n🕑 24-Hour: ${t24}\n`;
  if (state) msgText += `🏞️ State: ${state}\n`;
  msgText += `🏙️ Capital: ${capital}\n💸 Currency: ${currName} (${currCode})\n📞 Dial Code: +${phone}`;

  await msg.reply(msgText);
});

System({
  pattern: 'calc ?(.*)',
  fromMe: true,
  desc: 'Sexy calculator 🧠',
  type: 'tool',
}, async (msg, match) => {
  if (!match) return await msg.reply("*🧮 Example:* `.calc 10+5`");
  try {
    const res = eval(match);
    await msg.reply(`🧡 *Q:* ${match}\n💚 *Result:* ${res}`);
  } catch {
    await msg.reply("_Invalid expression 💔_");
  }
});

/* 💖 Add more commands like `autoreaction`, `quoted`, `setcmd`, `listcmd` etc. here with same romantic vibes 💋 */
