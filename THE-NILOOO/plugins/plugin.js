/*───────────────────────────────────────────────╮
  🔌 𝚴𝚯𝚻 𝐔𝚪 𝚴𝚰𝐋 👑 — Plugin Control » plugin.js
  ✨ External Plugin Installer | Dynamic Add/Remove 💡
╰───────────────────────────────────────────────*/

const {
  System,
  setData,
  pluginList,
  removeData,
  isUrl,
  extractUrlsFromText,
  getData,
  sleep,
  bot
} = require("../lib/");
const axios = require("axios");
const util = require("util");
const fs = require("fs");

// 🌐 .plugin [url | list]
System({
  pattern: "plugin",
  fromMe: true,
  desc: "🔌 Install External Plugin via URL",
  type: "support",
}, async (message, match) => {
  match = match || message.reply_message?.text;
  if (!match) return await message.send("*💡 Send a plugin URL or use .plugin list*");

  if (match === "list") {
    const data = await pluginList();
    if (!data || data.length === 0) return message.send("*📂 No plugin installed yet.*");
    const plugins = data.map(p => `🔸 *${p.name}*\n🔗 ${p.url}`).join("\n\n");
    return message.send(`*📦 Installed Plugins:*\n\n${plugins}`);
  }

  // Handle URL-based plugin installation
  if (isUrl(match)) {
    const urls = await extractUrlsFromText(match);
    for (const urlText of urls) {
      try {
        let pluginUrl = new URL(urlText);
        if (pluginUrl.host === "gist.github.com") {
          pluginUrl.host = "gist.githubusercontent.com";
          pluginUrl = pluginUrl.toString() + "/raw";
        } else {
          pluginUrl = pluginUrl.toString();
        }

        const { data, status } = await axios.get(pluginUrl);
        if (status !== 200) throw new Error("Request failed");

        const name = (data.match(/(?<=pattern:) ["'](.*?)["']/g) || [])
          .map(p => p.trim().replace(/['"]/g, "").split(" ")[0])
          .join(",") || "__plugin_" + Math.random().toString(36).substring(7);

        const file = `${__dirname}/${name.split(',')[0]}.js`;
        fs.writeFileSync(file, data);

        try {
          require(`./${name.split(',')[0]}`);
        } catch (err) {
          fs.unlinkSync(file);
          return await message.send("❌ Invalid Plugin\n\n```" + util.format(err) + "```");
        }

        await setData(name.split(',')[0], pluginUrl, true, "plugin");
        await message.send(`✅ *Plugin Installed:* ${name}`);
        await sleep(1500);
      } catch (err) {
        return await message.send("⚠️ *Error installing plugin.*");
      }
    }
  } else {
    const { plugin } = await getData(match);
    if (!plugin) return message.reply("*❌ Plugin not found.*");
    await message.reply(plugin.message);
  }
});

// ❌ .remove <pluginName>
System({
  pattern: "remove(?: |$)(.*)",
  fromMe: true,
  desc: "🧹 Remove External Plugin",
  type: "support"
}, async (message, match) => {
  if (!match) return await message.send("*🔍 Please provide plugin name to remove.*");

  const file = `${__dirname}/${match}.js`;
  const removed = await removeData(match, "plugin");

  if (!fs.existsSync(file) && !removed) {
    return await message.send("*❌ Plugin not found.*");
  }

  try {
    delete require.cache[require.resolve(file)];
    fs.unlinkSync(file);
  } catch (e) {}

  await message.send(`🧹 *Plugin ${match} removed successfully!*\n\n🔁 Restarting bot...`);
  await bot.restart();
});
