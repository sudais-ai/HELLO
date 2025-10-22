/*═══════════════════════════════════════════╗
║        🔍 𝚺𝚨𝚴𝚵𝚯𝚯𝚺.𝙹𝚂 » 𝚴𝚯𝚻 𝐔𝚪 𝚴𝚰𝐋 👑        ║
╠═══════════════════════════════════════════╣
║  📦 Stylish Search Engine for Everything  ║
║  🌐 Google • 🎵 Spotify • 📚 Dictionary    ║
║  📸 Images • 📱 Playstore • 💦 NSFW Xnxx   ║
║  💖 Romantic, Bold & Branded Formatting   ║
╚═══════════════════════════════════════════╝*/

const {
  System,
  IronMan,
  isPrivate,
  getJson,
  Google,
  isUrl
} = require("../lib/");

System({
  pattern: "google ?(.*)",
  fromMe: isPrivate,
  desc: "Search Google like a Pro 🧠",
  type: "search",
}, async (m, q) => {
  if (!q) return m.reply("*💡 Type something to search, baby.*\n_E.g._: `.google who is furina`");
  const res = await Google(q);
  let msg = res.map((r, i) =>
    `*📍 ${i + 1}*\n🔹 *Title*: ${r.title}\n🔹 *Link*: ${r.link}\n🔹 *Info*: ${r.description}`
  ).join("\n\n");
  await m.send(msg);
});

System({
  pattern: "img ?(.*)",
  fromMe: isPrivate,
  desc: "Image search for your naughty fantasies 😉",
  type: "search",
}, async (m, q) => {
  const [text, limit] = q.split(',').map(x => x.trim());
  if (!text) return m.reply("*🍑 Give me something hot to search...*\n_E.g._: `.img furina, 3`");
  const count = limit ? parseInt(limit) : 3;
  const res = await getJson(IronMan(`ironman/s/google?image=${encodeURIComponent(text)}`));
  const list = res.length <= count ? res : res.sort(() => 0.5 - Math.random()).slice(0, count);
  for (const url of list) await m.sendFromUrl(url);
});

System({
  pattern: "dict ?(.*)",
  fromMe: isPrivate,
  desc: "Dictionary lookup 📚",
  type: "search",
}, async (m, q) => {
  if (!q) return m.reply("*🔤 Need a word to look up, cutie!*");
  try {
    const res = await getJson(`https://api.dictionaryapi.dev/api/v2/entries/en/${q}`);
    const d = res[0];
    const def = d.meanings[0].definitions[0];
    await m.reply(
      `*📖 Word*: ${d.word}\n*🎧 Phonetics*: ${d.phonetics[0]?.text || "N/A"}\n*💬 Meaning*: ${def.definition}\n${def.example ? `*📌 Example*: ${def.example}` : ""}`
    );
  } catch {
    await m.reply("*❌ No definition found, sweetheart.*");
  }
});

System({
  pattern: "lyrics (.*)",
  fromMe: isPrivate,
  desc: "Find song lyrics 🎶",
  type: "search",
}, async (m, q) => {
  if (!q) return m.reply("*🎵 Gimme a song name!*");
  const data = await getJson(IronMan(`ironman/song/lrc?track_name=${encodeURIComponent(q)}`));
  const { title, artist, lyrics, image } = data;
  await m.send({ url: image }, { caption: `*🎶 Title:* ${title}\n*🎤 Artist:* ${artist}\n\n${lyrics}` }, "image");
});

System({
  pattern: "scs ?(.*)",
  fromMe: isPrivate,
  desc: "Search SoundCloud 🔊",
  type: "search",
}, async (m, q) => {
  if (!q) return m.reply("*🎧 Need a SoundCloud song name!*");
  const full = q.startsWith("-full");
  const query = full ? q.replace("-full", "").trim() : q;
  const { result: results } = await getJson(IronMan(`ironman/s/soundcloud?query=${query}`));
  if (!results.length) return m.send("*🥺 No songs found.*");
  if (full) {
    return m.send(results.map(r => `*🎶 ${r.title}*\n👤 ${r.artist}\n🔗 ${r.url}`).join("\n\n"));
  } else {
    const { title, artist, url, thumb } = results[0];
    await m.send({ url: thumb }, { caption: `🎶 *${title}*\n👤 *${artist}*\n🔗 ${url}` }, "image");
  }
});

System({
  pattern: "sps ?(.*)",
  fromMe: isPrivate,
  desc: "Spotify search 💚",
  type: "search",
}, async (m, q) => {
  if (!q) return m.reply("*💚 Gimme a Spotify song name, darling.*");
  const result = await getJson(IronMan(`ironman/spotify/s?query=${q}`));
  const { title, artist, url, thumbnail } = result[0];
  await m.send({ url: thumbnail }, {
    caption: `🎶 *Title:* ${title}\n👤 *Artist:* ${artist}\n🔗 *URL:* ${url}`
  }, "image");
});

System({
  pattern: "ps ?(.*)",
  fromMe: isPrivate,
  desc: "PlayStore app search 📱",
  type: "search",
}, async (m, q) => {
  if (!q) return m.reply("*📲 App name needed, baby!*");
  const data = await getJson(IronMan(`ironman/search/playstore?app=${q}`));
  const { name, developer, link, img } = data[0];
  await m.send({ url: img }, {
    caption: `📱 *Name:* ${name}\n👨‍💻 *By:* ${developer}\n🔗 *Link:* ${link}`
  }, "image");
});

System({
  pattern: "xsearch ?(.*)",
  fromMe: isPrivate,
  nsfw: true,
  desc: "NSFW video search 🔞",
  type: "search",
}, async (m, q) => {
  if (!q || isUrl(q)) return m.reply("*😈 Naughty search term needed!*");
  const res = await getJson(IronMan(`search/xnxx?q=${encodeURIComponent(q)}`));
  const txt = res.result.map(r => `🍑 *${r.title}*\n🔗 ${r.link}`).join("\n\n");
  await m.send(txt);
});

System({
  pattern: "wallpaper ?(.*)",
  fromMe: isPrivate,
  desc: "Get some hot wallpapers 🖼️",
  type: "search",
}, async (m, q) => {
  if (!q) return m.reply("*🖼️ Wallpaper keyword, please.*\n_E.g._: `.wallpaper furina`");
  const data = await getJson(IronMan(`ironman/wallpaper/wlhven?name=${encodeURIComponent(q)}`));
  const list = data.filter(x => x.url).map(x => x.url).sort(() => 0.5 - Math.random()).slice(0, 5);
  for (const url of list) await m.send({ url }, {}, "image");
});
