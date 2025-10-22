// 🛡️ Antilink Protector by 𝚴𝚯𝚻 𝐔𝚪 𝚴𝚰𝐋 👑

const { System, isPrivate, config } = require("../lib");
const fs = require("fs");

const filePath = "./database/antilink.json";
let db = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath)) : {};

const saveDb = () => fs.writeFileSync(filePath, JSON.stringify(db, null, 2));

System({
  pattern: "antilink ?(on|off)?",
  fromMe: true,
  desc: "Enable/disable anti-link protection",
  type: "group"
}, async (message, match) => {
  if (!message.isGroup) return await message.reply("Group-only command, boss.");
  if (!match) return await message.reply(`Antilink is currently: *${db[message.jid] ? "ON" : "OFF"}*`);
  if (match === "on") {
    db[message.jid] = { warn: {} };
    saveDb();
    return await message.reply("✅ Antilink is now *enabled* in this group.");
  }
  if (match === "off") {
    delete db[message.jid];
    saveDb();
    return await message.reply("❌ Antilink has been *disabled* in this group.");
  }
});

// Monitor all group messages
System({
  on: "text",
  fromMe: false
}, async (message) => {
  try {
    if (!message.isGroup || !db[message.jid]) return;

    const body = message.text || "";
    if (!/https?:\/\/chat\.whatsapp\.com\//i.test(body)) return;

    if (!message.participant || message.participant === message.user) return;

    const groupMeta = await message.client.groupMetadata(message.jid);
    const isAdmin = groupMeta.participants.find(p => p.id === message.participant && p.admin);

    // Don't react to admin links
    if (isAdmin) return;

    const group = db[message.jid];
    group.warn = group.warn || {};
    const id = message.participant;
    group.warn[id] = (group.warn[id] || 0) + 1;

    // Delete the message
    await message.client.sendMessage(message.jid, { delete: message.key });

    if (group.warn[id] >= 3) {
      await message.client.groupParticipantsUpdate(message.jid, [id], "remove");
      await message.send(`🚫 *User removed for sharing group links 3 times*\nUser: @${id.split("@")[0]}`, { mentions: [id] });
      delete group.warn[id];
    } else {
      const left = 3 - group.warn[id];
      await message.send(
        `⚠️ *Warning ${group.warn[id]}/3*\n❌ Sharing WhatsApp group links is not allowed here!\nUser: @${id.split("@")[0]}\n${left === 0 ? "⏳ Kicking next time!" : `🚫 You have ${left} warning(s) left.`}`,
        { mentions: [id] }
      );
    }

    saveDb();
  } catch (err) {
    console.error("Antilink error:", err);
  }
});
