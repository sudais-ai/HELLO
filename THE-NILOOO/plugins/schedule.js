/*───────────────────────────────────────────────╮
  🔰 𝚴𝚯𝚻 𝐔𝚪 𝚴𝚰𝐋 👑 — Schedule Module » schedule.js
  🔞 Stylish Scheduling | Romantic Reminder Magic ✨
╰───────────────────────────────────────────────*/

const { System, setSchedule, getSchedule, delSchedule, bot } = require('../lib/');
const { parsedJid, formatDateTime, reformatDateTime } = require('./client/');

// 🕰️ Set a schedule to deliver messages later
System({
    pattern: "setschedule",
    fromMe: true,
    desc: "💌 Set a scheduled message",
    type: "schedule"
}, async (message, match) => {
    if (!message.quoted) return await message.send('*🫧 Reply to a message you want to schedule.*');
    if (!match.includes(',')) return message.reply(`✨ 𝑬𝒙𝒂𝒎𝒑𝒍𝒆:\n.setschedule 9234xxxxxxx@s.whatsapp.net, 10:00 PM 22-06-2025`);

    const [id, time] = match.split(',');
    const [jid] = await parsedJid(id);
    const formatted = formatDateTime(time.trim());

    if (!jid || !formatted) return message.reply(`💫 𝑬𝒙𝒂𝒎𝒑𝒍𝒆:\n.setschedule 9234xxxxxxx@s.whatsapp.net, 10:00 PM 22-06-2025`);

    await setSchedule(jid, formatted, "true", message.reply_message.message);
    await message.send(`✅ *Scheduled Successfully!*\n\n📤 Will deliver at *${time.trim()}*`);
    bot.restart();
});

// 📜 View all scheduled messages
System({
    pattern: "getschedule",
    fromMe: true,
    desc: "📋 View scheduled messages",
    type: "schedule"
}, async (message) => {
    const { data } = await getSchedule();
    if (data.length === 0) return await message.reply("💔 No schedules found.");

    const fancyList = (await Promise.all(data.map(async (item) => {
        const date = reformatDateTime(item.date) || "Unknown Date";
        const contentType = Object.keys(item.content || {})[0] || 'Text';
        return `📌 *To:* ${item.jid}\n📅 *Date:* ${date}\n💬 *Message Type:* ${contentType}`;
    }))).join("\n\n");

    await message.reply(`🌟 *Scheduled Messages List*\n\n${fancyList}`);
});

// 🗑️ Delete a scheduled message
System({
    pattern: "delschedule",
    fromMe: true,
    desc: "❌ Delete a scheduled message",
    type: "schedule"
}, async (message, match) => {
    if (!match || !match.includes(',')) {
        return message.reply(`💡 𝑬𝒙𝒂𝒎𝒑𝒍𝒆:\n.delschedule 9234xxxxxxx@s.whatsapp.net, 10:00 PM 22-06-2025`);
    }

    const [id, time] = match.split(',');
    const [jid] = await parsedJid(id);
    const formatted = formatDateTime(time.trim());

    if (!jid || !formatted) return message.reply(`⚠️ Incorrect format. Please follow example:\n.delschedule 9234xxxxxxx@s.whatsapp.net, 10:00 PM 22-06-2025`);

    const result = await delSchedule(jid, formatted);
    if (!result.status) return await message.send('❌ No such schedule found.');
    await message.send('✅ Schedule deleted successfully.');
    bot.restart();
});
