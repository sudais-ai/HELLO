/*
═════════════════════════════════════════════
💠 Created for: 𝚴𝚯𝚻 𝐔𝚪 𝚴𝚰𝐋 👑
💠 Module: Multi-Platform Media Downloader
💠 Platforms: YouTube, IG, FB, Pinterest, Mediafire, etc.
💠 Note: Stylish & clean responses for elite usage
═════════════════════════════════════════════
*/

const {
  System,
  getJson,
  getBuffer,
  isPrivate
} = require("../lib");

const sendError = async (msg) => {
  return await msg.send("*🚫 Failed to fetch. Please try another link/url.*");
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔥 YouTube Downloader (.ytmp4 / .ytmp3)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

System({
  pattern: "ytmp4 ?(.*)",
  fromMe: isPrivate,
  desc: "Download YouTube video",
  type: "downloader"
}, async (msg, match) => {
  if (!match) return await msg.send("*Give me a YouTube link*");
  const res = await getJson(`https://api.lokiserver.xyz/dl/ytmp4?url=${match}`);
  if (!res.status) return sendError(msg);
  await msg.send(res.result.videoUrl, {
    caption: `*📹 Title:* ${res.result.title}\n*📦 Size:* ${res.result.size}`
  }, "video");
});

System({
  pattern: "ytmp3 ?(.*)",
  fromMe: isPrivate,
  desc: "Download YouTube audio",
  type: "downloader"
}, async (msg, match) => {
  if (!match) return await msg.send("*Give me a YouTube link*");
  const res = await getJson(`https://api.lokiserver.xyz/dl/ytmp3?url=${match}`);
  if (!res.status) return sendError(msg);
  await msg.send(res.result.audioUrl, {
    caption: `🎵 *Title:* ${res.result.title}\n🧠 *Size:* ${res.result.size}`
  }, "audio");
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📸 Instagram Reels / Videos (.igdl)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

System({
  pattern: "igdl ?(.*)",
  fromMe: isPrivate,
  desc: "Download IG video/reel",
  type: "downloader"
}, async (msg, match) => {
  if (!match.includes("instagram.com")) return await msg.send("*🔗 Give valid Instagram URL*");
  const res = await getJson(`https://api.lokiserver.xyz/dl/instagram?url=${match}`);
  if (!res.status || !res.result || !res.result[0]) return sendError(msg);
  await msg.send(res.result[0], {
    caption: "*🎬 Here's your Insta video!*"
  }, "video");
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🟦 Facebook Video (.fb)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

System({
  pattern: "fb ?(.*)",
  fromMe: isPrivate,
  desc: "Download Facebook video",
  type: "downloader"
}, async (msg, match) => {
  if (!match) return await msg.send("*Provide a Facebook link*");
  const res = await getJson(`https://api.lokiserver.xyz/dl/fb?url=${match}`);
  if (!res.status) return sendError(msg);
  await msg.send(res.result.url, {
    caption: "*🎥 Facebook video ready!*"
  }, "video");
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📍 Pinterest Downloader (.pin)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

System({
  pattern: "pin ?(.*)",
  fromMe: isPrivate,
  desc: "Download Pinterest image",
  type: "downloader"
}, async (msg, match) => {
  if (!match) return await msg.send("*Give me a Pinterest link or keyword*");
  const res = await getJson(`https://api.lokiserver.xyz/dl/pinterest?url=${match}`);
  if (!res.status) return sendError(msg);
  await msg.send(res.result.url, {
    caption: "*🖼️ Here's your Pin*"
  }, "image");
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📦 MediaFire File Downloader (.mediafire)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

System({
  pattern: "mediafire ?(.*)",
  fromMe: isPrivate,
  desc: "Download from Mediafire",
  type: "downloader"
}, async (msg, match) => {
  if (!match.includes("mediafire.com")) return await msg.send("*Invalid Mediafire link!*");
  const res = await getJson(`https://api.lokiserver.xyz/dl/mediafire?url=${match}`);
  if (!res.status) return sendError(msg);
  await msg.send(`*🗂️ File:* ${res.result.filename}\n📦 *Size:* ${res.result.filesize}\n📥 *Link:* ${res.result.url}`);
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🧠 GitHub File Downloader (.gitdl)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

System({
  pattern: "gitdl ?(.*)",
  fromMe: isPrivate,
  desc: "Download GitHub file as zip",
  type: "downloader"
}, async (msg, match) => {
  if (!match.includes("github.com")) return await msg.send("*Invalid GitHub link*");
  await msg.send(`*⬇️ Download ZIP:* https://minhaskamal.github.io/DownGit/#/home?url=${match}`);
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🧑‍💻 Final Touch: Owner Tag + Footer
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

System({
  pattern: "dlinfo",
  fromMe: isPrivate,
  desc: "Show downloader info",
  type: "tools"
}, async (msg) => {
  await msg.send(`╭═══〘 🔰 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳 𝙼𝙾𝙳𝚄𝙻𝙴 🔰 〙═══╮
┃
┃ 🧠 *Owner:* 𝚴𝚯𝚻 𝐔𝚪 𝚴𝚰𝐋 👑
┃ 🔥 *Status:* Active
┃ 🛠️ *Tools:* YT, IG, FB, Pin, Mediafire, Git
┃ 💎 *Type:* Private/Elite Build
┃
╰═════════════════════╯`);
});
