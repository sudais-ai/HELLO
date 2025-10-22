//═══════════════════════//
//      𝚴𝚯𝚻 𝐔𝚪 𝚴𝚰𝐋 👑 — ULTRA GROUP MANAGEMENT
//═══════════════════════//
const {
    bot, Vote, isUrl, sleep, System, config, getData,
    setData, isPrivate, warnMessage, extractUrlsFromText
} = require("../lib/");
const {
    parsedJid, isAdmin, isBotAdmins, getAllGroups
} = require("./client/");
const moment = require("moment-timezone");

// PREFIX FOR BRANDING
const brand = (msg) => `_*𝚴𝚯𝚻 𝐔𝚪 𝚴𝚰𝐋 👑*_ ${msg}`;

// ——— Add member ————————————————————————————————————————————————————————————
System({ pattern: "add ?(.*)", type: "group", fromMe: true, onlyGroup: true, desc: "Add a member" }, async (m, match) => {
  match = m.reply_message?.sender || match;
  if(!await isAdmin(m, m.user.jid)) return m.reply(brand("_🚫 You must be admin_"));
  if(!match) return m.reply(brand("_💬 Tag or provide number_"));
  const id = match.replace(/\D/g,"")+"@s.whatsapp.net";
  const okay = await m.client.onWhatsApp(id);
  if(!okay.length) return m.reply(brand("User not on WhatsApp"));
  const res = await m.client.groupParticipantsUpdate(m.jid, [id], "add");
  const status = res[0].status;
  const notes = {
    "403": "Invite sent privately.",
    "408": "User left recently — sending invite link.",
    "401": "User has blocked the bot.",
    "200": "User added successfully.",
    "409": "User already in group."
  };
  let resp = notes[status] || JSON.stringify(res);
  if(status == "408") {
    let code = await m.client.groupInviteCode(m.jid);
    resp += `\n🔗 Invite: https://chat.whatsapp.com/${code}`;
  }
  return m.send(brand(resp), { mentions: [id] });
});

// ——— Kick members ————————————————————————————————————————————————————————————
System({ pattern: "kick$", fromMe: true, type: "group", onlyGroup: true, adminAccess: true, desc: "Kick members" }, async (m, match) => {
  if(!await isAdmin(m, m.user.jid)) return m.reply(brand("_🚫 You must be admin_"));
  match = m.mention?.jid?.[0]||m.reply_message?.sender||match;
  if(!match) return m.reply(brand("_✅ Tag or 'all'_"));
  if(match === "all") {
    let {participants} = await m.client.groupMetadata(m.jid);
    let list = participants.map(p=>parsedJid(p.id));
    for(let x of list) {
      await m.client.groupParticipantsUpdate(m.jid, x, "remove");
      if(config.KICK_BLOCK) await m.client.updateBlockStatus(x[0], "block");
    }
    return m.send(brand("🧹 Removed all members."));
  } else {
    let x = parsedJid(match);
    await m.client.groupParticipantsUpdate(m.jid, x, "remove");
    if(config.KICK_BLOCK) await m.client.updateBlockStatus(x[0], "block");
    return m.send(brand(`✅ Kicked @${x[0].split("@")[0]}`), { mentions: x });
  }
});

// ——— Promote / Demote ——————————————————————————————————————————————————————
["promote","demote"].forEach(act=>{
  System({ pattern: `${act}$`, type: "group", fromMe:true, onlyGroup:true, adminAccess:true, desc: act }, async (m) => {
    if(!await isAdmin(m, m.user.jid)) return m.reply(brand("_🚫 You must be admin_"));
    let j = parsedJid(m.mention?.jid?.[0]||m.reply_message?.sender);
    await m.client.groupParticipantsUpdate(m.jid, j, act);
    return m.send(brand(`✅ @${j[0].split("@")[0]} ${act}d`), { mentions: j });
  });
});

// ——— Mute / Unmute —————————————————————————————————————————————————————————
System({ pattern:"mute",fromMe:true,onlyGroup:true,adminAccess:true,type:"group",desc:"Mute group" }, async m=>{
  if(!await isAdmin(m,m.user.jid)) return m.reply(brand("_🚫 You must be admin_"));
  await m.client.groupSettingUpdate(m.jid, "announcement");
  m.send(brand("🔇 Group is now muted."));
});
System({ pattern:"unmute",fromMe:true,onlyGroup:true,adminAccess:true,type:"group",desc:"Unmute group" }, async m=>{
  if(!await isAdmin(m,m.user.jid)) return m.reply(brand("_🚫 You must be admin_"));
  await m.client.groupSettingUpdate(m.jid, "not_announcement");
  m.send(brand("🔊 Group is now unmuted."));
});

// ——— Lock / Unlock —————————————————————————————————————————————————————————
System({ pattern:"lock",fromMe:true,type:"group",onlyGroup:true,adminAccess:true,desc:"Lock group settings" }, async m=>{
  if(!await isAdmin(m,m.user.jid)) return m.reply(brand("_🚫 You must be admin_"));
  const meta = await m.client.groupMetadata(m.jid);
  if(meta.restrict) return m.send(brand("_🔐 Already locked_"));
  await m.client.groupSettingUpdate(m.jid,"locked");
  m.send(brand("🔐 Group settings locked."));
});
System({ pattern:"unlock",fromMe:true,type:"group",onlyGroup:true,adminAccess:true,desc:"Unlock group settings" }, async m=>{
  if(!await isAdmin(m,m.user.jid)) return m.reply(brand("_🚫 You must be admin_"));
  const meta = await m.client.groupMetadata(m.jid);
  if(!meta.restrict) return m.send(brand("_🔓 Already unlocked_"));
  await m.client.groupSettingUpdate(m.jid,"unlocked");
  m.send(brand("🔓 Group settings unlocked."));
});

// ——— Invite Link —————————————————————————————————————————————————————————
System({ pattern:"invite ?(.*)",type:"group",fromMe:true,onlyGroup:true,adminAccess:true,desc:"Get group invite" }, async m=>{
  if(!await isAdmin(m,m.user.jid)) return m.reply(brand("_🚫 You must be admin_"));
  const code = await m.client.groupInviteCode(m.jid);
  m.send(brand(`🔗 Invite link: https://chat.whatsapp.com/${code}`));
});

// ——— Tag Everyone ——————————————————————————————————————————————————————
System({ pattern:"tag",type:"group",fromMe:true,adminAccess:true,desc:"Mention group members" }, async (m, match) => {
  if(!m.isGroup) return m.send(`@${m.sender.split("@")[0]}`,{mentions:[m.sender]});
  const {participants} = await m.client.groupMetadata(m.jid);
  const list = participants.map(p=>p.id);
  let txt = "";
  if(["all","everyone"].includes(match)) {
    txt = list.map((id,i)=>`${i+1}. @${id.split("@")[0]}`).join("\n");
    return m.send(brand(txt),{mentions:list});
  } else if(["admin","admins"].includes(match)) {
    const admins=list.filter(p=>participants.find(x=>x.id===p).admin);
    txt=admins.map((id,i)=>`${i+1}. @${id.split("@")[0]}`).join("\n");
    return m.send(brand(txt),{mentions:admins});
  } else if(["me","mee"].includes(match)) {
    return m.send(brand(`@${m.sender.split("@")[0]}`),{mentions:[m.sender]});
  } else if(match||m.reply_message?.text) {
    return m.send(brand(match||m.reply_message.text),{mentions:list});
  }
  m.reply(brand("*Usage:* .tag all/admins/me/text"));  
});

// ── More commands continued in next message due to size ──
