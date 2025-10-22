// 💘 Welcome.js — Romantic Entry By 𝚴𝚯𝚻 𝐔𝚪 𝚴𝚰𝐋 👑

const { System, config } = require("../lib");
const fs = require("fs");
const dbPath = "./database/welcome.json";

let db = fs.existsSync(dbPath) ? JSON.parse(fs.readFileSync(dbPath)) : {};

function save() {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

System({
  pattern: "welcome ?(on|off)?",
  fromMe: true,
  desc: "Toggle romantic welcome system",
  type: "group"
}, async (msg, match) => {
  if (!msg.isGroup) return await msg.reply("Group only, jaanu 💌");

  if (!match) {
    const status = db[msg.jid] ? "ON 💘" : "OFF 💼";
    return await msg.reply(`💬 Welcome is currently: *${status}*`);
  }

  if (match === "on") {
    db[msg.jid] = true;
    save();
    return await msg.reply("✅ Sexy welcome system *enabled* 😏");
  }

  if (match === "off") {
    delete db[msg.jid];
    save();
    return await msg.reply("❌ Welcome system *disabled* 💔");
  }
});

// 🕊️ Trigger when user joins
System({
  on: "group-participants.update"
}, async (update, client) => {
  const metadata = await client.groupMetadata(update.id);
  const groupName = metadata.subject;

  if (!db[update.id] || !update.participants || !update.action) return;

  for (let user of update.participants) {
    if (update.action === "add") {
      const pfp = await client.profilePictureUrl(user, "image").catch(() =>
        "https://telegra.ph/file/21f5b4dbfc50c08d37702.jpg"
      );
      const name = (await client.getName(user)) || "New Bae 💋";
      const id = user.split("@")[0];

      const intro = `✨ Hey @${id}...
👀 We see you...
❤️ You just walked into *${groupName}*

┌───⋆⋅☆⋅⋆───┐
💘  *Name:* ${name}
🌍  *Country:* AutoDetect 🌐
🎂  *Age:* 18+ vibes detected 😏
💞  *Status:* Single & dangerously flirty
└───⋆⋅☆⋅⋆───┘

💌 _𝚴𝚯𝚻 𝐔𝚪 𝚴𝚰𝐋 Bot is watching you now..._  
_Type .menu to unlock pleasure 🥵_`;

      await client.sendMessage(update.id, {
        image: { url: pfp },
        caption: intro,
        mentions: 
