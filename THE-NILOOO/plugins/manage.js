/*═════════════════════════════════════════════
🔥 𝚴𝚯𝚻 𝐔𝚪 𝚴𝚰𝐋 👑 — manage.js v2
🔐 Ultimate Group Protection & Greetings
═════════════════════════════════════════════*/

const {
  System, setData, getData, transformData, makeInDb
} = require('../lib');
const { parsedJid, isAdmin } = require("./client/");
const moment = require('moment-timezone');

const actions = ['kick','warn','null'];
const brand = msg => `_*𝚴𝚯𝚻 𝐔𝚪 𝚴𝚰𝐋 👑*_ ${msg}`;

// 1️⃣ Anti Tools
async function handleToggle(msg, key, input, opts = {}) {
  const data = await transformData(msg.jid, key);
  const cmd = input.trim().toLowerCase();

  if (!cmd) {
    throw `Usage: .${key} <on/off/get/action/keywords>`;
  }
  if (cmd === 'on' || cmd === 'off') {
    await makeInDb(msg.jid, { status: cmd === 'on' ? 'true' : 'false', action: data?.action ?? 'null', value: data?.value ?? '' }, key);
    return brand(`${key} ${cmd === 'on'? 'Activated ✅' : 'Deactivated ❌'}`);
  }
  if (cmd === 'get') {
    if (!data?.value) return brand(`No ${key} data set.`);
    return brand(`${key.toUpperCase()}: ${data.value}`);
  }
  if (cmd.startsWith('action')) {
    const act = cmd.split(' ')[1];
    if (!actions.includes(act)) throw `Invalid action. Allowed: ${actions.join(', ')}`;
    await makeInDb(msg.jid, { status: data?.status ?? 'true', action: act, value: data?.value ?? '' }, key);
    return brand(`${key} Action set to ${act}`);
  }
  // keywords/values
  await makeInDb(msg.jid, { status: data?.status ?? 'true', action: data?.action ?? 'null', value: input }, key);
  return brand(`${key} value updated.`);
}

['antiword','antilink','antibot'].forEach(key => {
  System({
    pattern: `${key} ?(.*)`,
    fromMe: true, type: 'manage', onlyGroup: true, adminAccess: true,
    desc: `Configure ${key}`
  }, async (msg, match) => {
    try {
      const res = await handleToggle(msg, key, match || '');
      await msg.send(res);
    } catch (err) {
      await msg.reply(`⚠️ ${err}`);
    }
  });
});

System({
  pattern: 'antifake ?(.*)',
  fromMe: true, type: 'manage', onlyGroup: true, adminAccess: true,
  desc: '🚫 Restrict fake number prefixes'
}, async (msg, match) => {
  const data = await getData(msg.jid);
  const cmd = match.trim().toLowerCase();
  if (!cmd) return msg.reply('Usage: .antifake on/off/get or list prefixes');
  if (['on','off'].includes(cmd)) {
    await setData(msg.jid, data?.antifake?.message ?? '', cmd === 'on'? 'true':'false', 'antifake');
    return msg.send(brand(`Antifake ${cmd === 'on'? 'activated':'deactivated'}`));
  }
  if (cmd === 'get') {
    return data?.antifake?.message
      ? msg.send(brand(`Restricted prefixes: ${data.antifake.message}`))
      : msg.send(brand('No prefixes set.'));
  }
  const prefixes = cmd.replace(/[^0-9,]/g,'');
  await setData(msg.jid, prefixes, data?.antifake?.status ?? 'true', 'antifake');
  return msg.send(brand(`Antifake prefixes updated.`));
});

// 2️⃣ Anti Admin Abuse
['antidemote','antipromote'].forEach(key => {
  System({
    pattern: `${key} ?(.*)`,
    fromMe: true, type: 'manage', onlyGroup: true, adminAccess: true,
    desc: `Enable/disable ${key}`
  }, async (msg, match) => {
    if (!match) return msg.send({
      values: [{displayText:'on',id:`${key} on`},{displayText:'off',id:`${key} off`}],
      withPrefix:true, onlyOnce:true, participates:[msg.sender]
    }, 'poll');
    const cmd = match.trim().toLowerCase();
    if (!['on','off'].includes(cmd)) return msg.reply(`Usage: .${key} on/off`);
    await setData(msg.jid, 'active', cmd==='on'?'true':'false', key);
    return msg.send(brand(`${key} ${cmd==='on'? 'activated':'deactivated'}`));
  });
});

System({
  pattern: 'antidelete ?(.*)',
  fromMe: true, type: 'manage', onlyGroup: false, adminAccess: false,
  desc: 'Prevent message deletions'
}, async (msg, match) => {
  const uid = msg.user.jid;
  const data = await getData(uid);
  if (!match) return msg.reply(`Usage:\n.antidelete on/off/\n.antidelete jid/chat/pm`);
  const parts = match.split(' ');
  const cmd=parts[0], dest=parts[1] || 'chat';
  if (!['on','off'].includes(cmd) || !['id','chat','pm','jid'].includes(dest)) return msg.reply(`Invalid usage`);
  await setData(uid, dest, cmd==='on'?'true':'false','antidelete');
  return msg.send(brand(`Antidelete ${cmd==='on'? 'enabled':'disabled'} => ${dest}`));
});

// 3️⃣ Group Protection
['pdm','gcaccess'].forEach(key => {
  System({
    pattern: `${key} ?(.*)`,
    fromMe: true, type: 'manage', onlyGroup: true, adminAccess: true,
    desc: `Toggle ${key}`
  }, async (msg, match) => {
    if (!match) {
      return msg.send({
        values:[{displayText:'on',id:`${key} on`},{displayText:'off',id:`${key} off`}],
        withPrefix:true, onlyOnce:true, participates:[msg.sender]
      }, 'poll');
    }
    const cmd = match.trim().toLowerCase();
    if (!['on','off'].includes(cmd)) return msg.reply(`Usage: .${key} on/off`);
    await setData(msg.jid, 'active', cmd==='on'?'true':'false', key);
    return msg.send(brand(`${key} ${cmd==='on'? 'activated':'deactivated'}`));
  });
});

// 4️⃣ Greetings
['welcome','goodbye'].forEach(key => {
  System({
    pattern: `${key} ?(.*)`,
    type: 'greetings', fromMe: true, onlyGroup: true, adminAccess: true,
    desc: `Set ${key} message`
  }, async (msg, match) => {
    const data = await getData(msg.jid);
    const cmd = match.trim();
    if (cmd.toLowerCase() === 'get') {
      const cur = data[key]?.message;
      return msg.send(cur? brand(`${key} msg: ${cur}`) : brand(`No ${key} set`));
    }
    if (['on','off'].includes(cmd.toLowerCase())) {
      const val = data[key]?.message ?? '';
      await setData(msg.jid, val, cmd==='on'?'true':'false', key);
      return msg.send(brand(`${key} ${cmd==='on'? 'activated':'deactivated'}`));
    }
    await setData(msg.jid, cmd, data[key]?.status ?? 'true', key);
    return msg.send(brand(`${key} message set.`));
  });
});

// 5️⃣ Auto Tasks
['automute','autounmute'].forEach(key => {
  System({
    pattern: `${key} ?(.*)`,
    type: 'manage', fromMe: true, onlyGroup: true, adminAccess: true,
    desc: `Schedule ${key}`
  }, async (msg, match) => {
    const data = await getData(msg.jid);
    const time = match?.trim().toUpperCase();
    if (!time) {
      return msg.reply(`Usage: .${key} HH:MM AM/PM or .${key} on/off`);
    }
    if (time==='ON' || time==='OFF') {
      await setData(msg.jid, data[key]?.message ?? '', time === 'ON'?'true':'false', key);
      return msg.send(brand(`${key} ${time==='ON'? 'enabled':'disabled'}`));
    }
    if (!/^(\d{1,2}:\d{2})\s?(AM|PM)$/i.test(time)) {
      return msg.send("Invalid time format. Use 12-hr format: 05:30 PM");
    }
    await setData(msg.jid, time, 'true', key);
    return msg.send(brand(`${key} scheduled at ${time}`));
  });
});

System({
  pattern: "getmute ?(.*)",
  fromMe: true, onlyGroup: true, adminAccess: true, type: 'manage',
  desc: "Get auto mute/unmute settings"
}, async (msg) => {
  const data = await getData(msg.jid);
  const ms = [];
  if (data.automute?.status === 'true') ms.push(`🔇 auto mute at ${data.automute.message}`);
  if (data.autounmute?.status === 'true') ms.push(`🔊 auto unmute at ${data.autounmute.message}`);
  if (!ms.length) return msg.send(brand("No auto-schedule set"));
  return msg.send(brand(ms.join('\n')));
});

// 6️⃣ Final Info
System({
  pattern: "manageinfo",
  fromMe: true, type: "manage", onlyGroup: false,
  desc: "Show your settings"
}, async (msg) => {
  const data = await getData(msg.jid);
  const keys = ['antiword','antilink','antibot','antifake','pdm','gcaccess','welcome','goodbye'];
  let txt = "*✅ Current Manage Settings*\n\n";
  keys.forEach(k => {
    const d = data[k];
    if (!d) return;
    txt += `*${k}:* ${d.status || 'false'}${d.value ? ` • ${d.value}` : ''}\n`;
  });
  msg.send(brand(txt));
});
