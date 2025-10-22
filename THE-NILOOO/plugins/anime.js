const { System, getJson, getBuffer, isOwner } = require("../lib/");

const NSFW_RESPONSES = {
  anal: "🍑 *A little backdoor treat for you, Owner...* 🔥",
  blowjob: "👄 *Mouth magic time, Owner...* 😈",
  hentai: "🔞 *Hentai heaven, just for you...* 💋",
  cum: "💦 *Here’s your creamy fantasy, Owner...* 🔥",
  ecchi: "👙 *Soft, naughty and seductive...* 🥵",
  gifsex: "🎞️ *Animated pleasure for your wild side...* 😍",
  lewdpic: "📸 *Lewd alert, you naughty legend...* 🤤",
  sexvid: "🎬 *HD action for the night, exclusively yours...* 💣",
  xvid: "🔞 *X-clusive content unlocked, enjoy Owner...* 💌",
  moan: "🎧 *Listen close... they moan your name...* 🔊💦"
};

const NSFW_LINKS = {
  anal: "https://nekos.life/api/v2/img/anal",
  blowjob: "https://nekos.life/api/v2/img/blowjob",
  hentai: "https://nekos.life/api/v2/img/hentai",
  cum: "https://nekos.life/api/v2/img/cum",
  ecchi: "https://nekos.life/api/v2/img/lewd",
  gifsex: "https://nekos.life/api/v2/img/random_hentai_gif",
  lewdpic: "https://nekos.life/api/v2/img/lewd",
  sexvid: "https://raw.githubusercontent.com/NekoLoveBot/Database/master/nsfw/sex.json",
  xvid: "https://raw.githubusercontent.com/NekoLoveBot/Database/master/nsfw/xvideo.json",
  moan: "https://raw.githubusercontent.com/NekoLoveBot/Database/master/nsfw/moan.json"
};

for (const cmd in NSFW_LINKS) {
  System({
    pattern: cmd,
    fromMe: true,
    desc: `NSFW: ${cmd} command`,
    type: "18+"
  }, async (message) => {
    if (!isOwner(message)) return message.send("*Only the bot owner can use this command.* 🚫");

    const urlData = await getJson(NSFW_LINKS[cmd]);
    let mediaUrl = urlData?.url || (Array.isArray(urlData) ? urlData[Math.floor(Math.random() * urlData.length)] : null);

    if (!mediaUrl) return message.send("_Failed to fetch media. Try again later._");

    const fileType = mediaUrl.endsWith(".gif") || mediaUrl.includes("gif") ? "gif" :
                     mediaUrl.endsWith(".mp4") ? "video" : "image";

    const sexyReply = `*💦 𝙾𝚠𝚗𝚎𝚛 𝚂𝙴𝚇 𝙼𝙾𝙳𝙴 𝙾𝙽 🔞*\n${NSFW_RESPONSES[cmd]}`;

    if (fileType === "video") {
      await message.send(mediaUrl, { caption: sexyReply }, "video");
    } else if (fileType === "gif") {
      await message.send(mediaUrl, { caption: sexyReply }, "gif");
    } else {
      await message.send(mediaUrl, { caption: sexyReply }, "image");
    }
  });
}
