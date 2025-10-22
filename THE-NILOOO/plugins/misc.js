// 💋 MISC COMMANDS by The One & Only — 𝚴𝚯𝚻 𝐔𝚪 𝚴𝚰𝐋

const {
  isUrl,
  System,
  config,
  getJson,
  postJson,
  isPrivate,
  extractUrlsFromText
} = require("../lib/");
const api = config.BASE_URL;

// 🔗 WAME LINK GENERATOR
System({
  pattern: "wm",
  fromMe: isPrivate,
  desc: "Generate WhatsApp me link for user",
  type: "misc"
}, async (message) => {
  if (!message.quoted) return message.reply("💌 *Reply to someone's message to get their wame!*");
  let user = (message.reply_message.sender || message.mention[0] || message.text).split('@')[0];
  await message.reply(`🔗 *Link:* https://wa.me/${user}`);
});

// 🖼️ WEBSITE SCREENSHOT
System({
  pattern: "ss ?(.*)",
  fromMe: true,
  desc: "Take screenshot of webpage",
  type: "misc"
}, async (message, match) => {
  let url = (await extractUrlsFromText(match || message.reply_message.text))[0];
  if (!url || !isUrl(url)) return await message.reply("💋 *Babe, give me a proper link...* 😘");
  await message.sendFromUrl(api + "tools/ssweb?q=" + url, {
    caption: `📸 Here's your romantic screenshot of:\n${url}`
  });
});

// 💾 SAVE MESSAGES
System({
  pattern: "save",
  fromMe: true,
  desc: "Forward any quoted msg to your own DM",
  type: "misc"
}, async (message) => {
  if (!message.quoted) return;
  await message.client.forwardMessage(message.user.jid, message.reply_message.message);
});

// 🕵️‍♂️ WHOIS SEARCH
System({
  pattern: "whois ?(.*)",
  fromMe: isPrivate,
  desc: "Reveal someone's identity & about info",
  type: "info"
}, async (message, match) => {
  let user = message.quoted ? message.reply_message.sender : match.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
  if (!user) return message.reply("📍 *Mention or reply to check user info*");
  let status, profile;
  try { status = await message.client.fetchStatus(user); } catch { status = { status: "Hidden", setAt: Date.now() }; }
  try { profile = await message.getPP(user); } catch { profile = null; }

  const date = new Date(status.setAt).toLocaleString('en-US');
  const name = await message.store.getName(user);
  const link = "https://wa.me/" + user.split('@')[0];

  await message.send({ url: profile }, {
    caption: `👤 *Name:* ${name}\n💭 *Status:* ${status.status}\n🕓 *Since:* ${date}\n🔗 *Link:* ${link}`,
    quoted: message
  }, "image");
});

// 🎤 TEXT TO SPEECH FLIRT
System({
  pattern: "tts ?(.*)",
  fromMe: isPrivate,
  desc: "Make me whisper your text... in audio",
  type: "converter"
}, async (message, match) => {
  const input = match || message.reply_message?.text;
  if (!input) return await message.reply("👄 *Whisper something for me to say...*");

  let lang = config.LANG.toLowerCase();
  const detected = input.match("\\{([a-z]+)\\}");
  if (detected) {
    match = match.replace(detected[0], '');
    lang = detected[1];
  }

  const res = await fetch(api + 'tools/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: match, lang })
  });

  if (res.ok) {
    const buffer = await res.arrayBuffer();
    await message.reply(Buffer.from(buffer), { mimetype: 'audio/ogg; codecs=opus', ptt: true }, "audio");
  } else {
    await message.reply("⚠️ Something broke my romantic voice 💔");
  }
});

// 💌 TEMP MAIL ACCESS
System({
  on: 'text',
  fromMe: isPrivate,
  dontAddCommandList: true
}, async (message) => {
  if (!message.quoted && !message.body.includes('@') && !message.body.includes('‣')) return;

  if (message.body.includes("1")) {
    const q = message.body.split(" ")[2];
    const { result: mails } = await postJson(api + "tools/tempmail", { q });
    if (!mails || mails.length === 0) return message.reply("📪 *No fresh love letters found in your inbox...*");

    const formatted = mails.map((m, i) => `💌 *Mail ${i + 1}*\n• From: ${m.from}\n• Subject: ${m.subject}\n• Date: ${m.date}\n• ID: ${m.id}`).join("\n\n");
    await message.send(`✨ *Here's your sweet inbox:*\n\n${formatted}`);
  } else if (message.body.includes("2")) {
    const { result: box } = await getJson(api + "tools/tempmail");
    const user = await message.store.getName(message.sender);
    const { result: mails } = await postJson(api + "tools/tempmail", { q: box });

    await message.send(`📬 *Mail address:* ${box}\n👤 *User:* ${user}\n📨 *Total:* ${mails.length} mails\n\n\`\`\`1 ‣\`\`\` *Check mail*\n\`\`\`2 ‣\`\`\` *Next mail*\n\n💕 *Reply with a number to proceed*`);
  }
});
