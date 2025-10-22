// 🔱 𝚴𝚯𝚻 𝐔𝚪 𝚴𝚰𝐋 👑 WHATSAPP CORE CONTROL MODULE

const { System, setData } = require("../lib");
const { parsedJid } = require("./client/");

// 💠 GET JID
System({
    pattern: "jid",
    fromMe: true,
    type: "whatsapp",
    desc: "Give JID of chat/user",
}, async (message) => {
	if (message.quoted && message.reply_message?.sender) return await message.send(message.reply_message.sender);
	return await message.send(message.jid);
});

// 💠 SET PROFILE PHOTO
System({
    pattern: "pp$",
    fromMe: true,
    alias: ['fullpp', 'setpp'],
    type: "whatsapp",
    desc: "Set full screen profile picture",
}, async (message, match) => {
    if (match === "remove") {
        await message.client.removeProfilePicture(message.user.jid);
        return await message.reply("_Profile Picture Removed_");
    }
    if (!message.reply_message?.image) return await message.reply("_Reply to a photo_");
    let media = await message.reply_message.download();
    await message.client.updateProfile(media, message.user.jid);
    return await message.reply("_Profile Picture Updated!_");
});

// 💠 DELETE REPLIED MESSAGE
System({
    pattern: "dlt",
    fromMe: true,
    type: "whatsapp",
    desc: "Deletes a message",
}, async (message) => {
    if (!message.quoted) return await message.reply("_Reply to a message to delete it!_");
    await message.reply(message.reply_message.data.key, {}, "delete");
});

// 💠 ANTI VIEW ONCE TOGGLE
System({
    pattern: "antiviewones",
    fromMe: true,
    type: "manage",
    desc: "Enable or disable anti view once"
}, async (message, match) => {
    if (match === "on") { 
      await setData(message.user.id, "active", "true", "antiviewones");
      return await message.send("_*Antiviewonce activated*_");
    } else if (match === "off") {
      await setData(message.user.id, "disactive", "false", "antiviewones");
      return await message.send("_*Antiviewonce deactivated*_");
    } else {
      if (!message.isGroup) return message.send("_*Use antiviewones on/off*_");
      await message.send(`\n*Choose antiviewones setting*`, {
        values: [
          { displayText: "*on*", id: "antiviewones on" },
          { displayText: "*off*", id: "antiviewones off" }
        ],
        withPrefix: true,
        participates: [message.sender]
      }, "poll");
    }
});

// 💠 PROFILE CONTROL: Bio & Name
System({
    pattern: "setbio",
    fromMe: true,
    desc: "Change profile bio",
    type: "whatsapp",
}, async (message, match) => {
    match = match || message.reply_message?.text;
    if (!match) return await message.send('*Need Status!*\n*Example: setbio I’m amazing!*');
    await message.client.updateProfileStatus(match);
    await message.reply('_Bio updated_');
});

System({
    pattern: 'setname ?(.*)',
    fromMe: true,
    desc: 'Change profile name',
    type: 'whatsapp',
}, async (message, match) => {
    match = match || message.reply_message?.text;
    if (!match) return await message.send('*Need Name!*\n*Example: setname 𝚴𝚯𝚻 𝐔𝚪 𝚴𝚰𝐋*');
    await message.client.updateProfileName(match);
    await message.reply('_Name updated_');
});

// 💠 FORWARD MESSAGE TO ANY JID
System({
    pattern: "forward",
    fromMe: true,
    desc: "Forwards replied message",
    type: "whatsapp",
}, async (message, match) => {
    if (!message.quoted) return await message.reply('Reply to message');
    if (!match) return await message.reply("*Provide a JID; use 'jid' command to get JID*");
    let jids = parsedJid(match);
    for (let jid of jids) await message.client.forwardMessage(jid, message.reply_message.message);
    await message.reply("_Message forwarded_");
});

// 💠 PIN / UNPIN CHAT
System({ pattern: 'chatpin', fromMe: true, type: 'whatsapp', desc: 'Pin chat' },
  async (message) => await message.client.chatModify({ pin: true }, message.jid));

System({ pattern: 'unpin', fromMe: true, type: 'whatsapp', desc: 'Unpin chat' },
  async (message) => await message.client.chatModify({ pin: false }, message.jid));

// 💠 CHAT CLEAR / ARCHIVE
System({ pattern: 'clear', fromMe: true, desc: 'Clear chat', type: 'whatsapp' },
  async (message) => {
    await message.client.chatModify({ delete: true, lastMessages: [{ key: message.data.key, messageTimestamp: message.messageTimestamp }] }, message.jid);
    await message.reply('_Cleared_');
  });

System({ pattern: 'archive', fromMe: true, desc: 'Archive chat', type: 'whatsapp' },
  async (message) => {
    await message.client.chatModify({ archive: true, lastMessages: [{ key: message.data.key, messageTimestamp: message.messageTimestamp }] }, message.jid);
    await message.reply('_Archived_');
  });

System({ pattern: 'unarchive', fromMe: true, desc: 'Unarchive chat', type: 'whatsapp' },
  async (message) => {
    await message.client.chatModify({ archive: false, lastMessages: [{ key: message.data.key, messageTimestamp: message.messageTimestamp }] }, message.jid);
    await message.reply('_Unarchived_');
  });

// 💠 BLOCK / UNBLOCK USERS
System({
    pattern: "block",
    fromMe: true,
    alias: ['blk'],
    type: "whatsapp",
    desc: "Block a user",
}, async (message, match) => {
    if (match === "list") {
       const numbers = await message.client.fetchBlocklist();
       if (!numbers?.length) return message.reply("_*No block list found*_");
       const blockList = `_*Block List*_\n\n${numbers.map(n => `- +${n.replace('@s.whatsapp.net', '')}`).join('\n')}`;
       return await message.reply(blockList);
    }
    let jid = message.quoted ? message.reply_message.sender : !message.isGroup ? message.jid : false;
    if(!jid) return message.reply("*Reply to user or use 'block list'*");
    await message.client.updateBlockStatus(jid, "block");
    await message.reply("_*Blocked!*_");
});

System({
    pattern: "unblock",
    fromMe: true,
    alias: ['unblk'],
    type: "whatsapp",
    desc: "Unblock a user"
}, async (message, match) => {
    if (match === "all") {
        const numbers = await message.client.fetchBlocklist();
        if (!numbers?.length) return message.reply("_*No block list found*_");
        await Promise.all(numbers.map(jid => message.client.updateBlockStatus(jid, "unblock")));
        return await message.reply("_*All unblocked!*_");
    }
    let jid = message.quoted ? message.reply_message.sender : !message.isGroup ? message.jid : false;
    if(!jid) return message.reply("*Reply to unblock or use 'unblock all'*");
    await message.client.updateBlockStatus(jid, "unblock");
    await message.reply("_*Unblocked!*_");
});

// 💠 GET MY PRIVACY STATUS
System({
    pattern: 'getprivacy',
    fromMe: true,
    desc: 'View current privacy settings',
    type: 'privacy'
}, async (message) => {
	const p = await message.client.fetchPrivacySettings(true);
	let pp = await message.client.profilePictureUrl(message.user.jid, 'image').catch(() => "https://i.ibb.co/sFjZh7S/6883ac4d6a92.jpg");
	let msg = `💠 *𝚴𝚯𝚻 𝐔𝚪 𝚴𝚰𝐋 Privacy Panel*\n\n` +
	          `👤 *Name:* ${message.client.user.name}\n` +
	          `🟢 *Online:* ${p.online}\n🕵️‍♂️ *Last Seen:* ${p.last}\n📸 *Profile:* ${p.profile}\n📶 *Status:* ${p.status}\n📩 *Receipts:* ${p.readreceipts}\n👥 *Group Add:* ${p.groupadd}\n📞 *Call Add:* ${p.calladd}`;
	await message.send(pp, { caption: msg }, 'image');
});

// 💠 More privacy toggles like: lastseen, mypp, mystatus, online, groupadd, read... you already have written — shall I wrap them also fully under your brand style?
