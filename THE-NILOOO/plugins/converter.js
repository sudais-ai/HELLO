/*-----------------------------------------------------------------------
𝚻𝚮𝚵 𝐋𝚵𝐆𝚴𝚴𝐃𝚫𝚪𝐘 𝚴𝚰𝐋 𝚩𝚯𝚻 — NSFW Anime Module 🔞
Only accessible by the bot owner: 923474810818
🔥 Stylish, Sexy, Flirty — For private pleasure only 🔥
-----------------------------------------------------------------------*/

const { System, getJson, isOwner, getBuffer } = require("../lib/");

const NSFW_API = async (endpoint) => {
  try {
    const res = await getJson(`https://fantox-apis.vercel.app/${endpoint}`);
    if (!res || !res.url) return null;
    return res.url;
  } catch (err) {
    return null;
  }
};

const sendNSFW = async (message, type, endpoint, caption) => {
  if (message.sender !== "923474810818@s.whatsapp.net") {
    return await message.send("*🚫 NSFW MODE is restricted to 𝙾𝚠𝚗𝚎𝚛 only!*");
  }

  const media = await NSFW_API(endpoint);
  if (!media) return await message.send("_*⚠️ Failed to load media*_");

  const responseCaption = `*💦 𝙾𝚠𝚗𝚎𝚛 𝚂𝙴𝚇 𝙼𝙾𝙳𝙴 𝙾𝙽 🔞*\n${caption || "Here’s something to heat up your night... 🔥"}`;
  return await message.send(media, { caption: responseCaption, quoted: message.data }, type);
};

// List of sexy commands
const commands = [
  { cmd: "anal", endpoint: "anal", caption: "*Anal treat incoming 💋*" },
  { cmd: "blowjob", endpoint: "blowjob", caption: "*Blowjob bliss loading... 😮‍💨💦*" },
  { cmd: "hentai", endpoint: "hentai", caption: "*Hentai heaven for you senpai 💖*" },
  { cmd: "cum", endpoint: "cum", caption: "*Cum drip drop... 🍯*" },
  { cmd: "lewdpic", endpoint: "lewd", caption: "*Lewd tease for the night 🌙*" },
  { cmd: "sexvid", endpoint: "sex", caption: "*NSFW 🔥 Let’s get dirty...*" },
  { cmd: "xvid", endpoint: "pussy", caption: "*X-rated video pleasure 💦*" },
  { cmd: "moan", endpoint: "moan", caption: "*Moaning audio loading... 🎧*" },
  { cmd: "gifsex", endpoint: "hentaigif", caption: "*Looped hot action in GIF 🔥*" },
  { cmd: "ecchi", endpoint: "ecchi", caption: "*Spicy ecchi vibes 🔞💋*" },
];

// Register all commands
commands.forEach(({ cmd, endpoint, caption }) => {
  System({
    pattern: cmd,
    fromMe: true,
    desc: `NSFW - ${cmd}`,
    type: "nsfw-anime"
  }, async (message) => {
    const type = endpoint.includes("gif") ? "gif" :
                 endpoint === "moan" ? "audio" :
                 endpoint.includes("vid") || endpoint === "sex" ? "video" : "image";

    await sendNSFW(message, type, endpoint, caption);
  });
});
