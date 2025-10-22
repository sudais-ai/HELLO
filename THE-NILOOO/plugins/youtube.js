/*───────────────────────────────────────────────

💫 𝚴𝚯𝚻 𝐔𝚪 𝚴𝚰𝐋 👑 YouTube Panel
📥 Powered by: Legendary Downloader Engine
🔞 Designed Flawlessly for Pure Elegance 🔥

───────────────────────────────────────────────*/

const {
  yts,
  isUrl,
  System,
  config,
  toAudio,
  getBuffer,
  isPrivate,
  YtInfo,
  youtube,
  AddMp3Meta,
  extractUrlsFromText
} = require('../lib/');

// 🔥 YOUTUBE VIDEO DOWNLOAD (.video / .ytv)
System({
  pattern: 'video ?(.*)',
  fromMe: isPrivate,
  desc: 'Download YouTube video',
  type: 'download'
}, async (message, match) => {
  match = match || message.reply_message.text;
  if (!match) return message.reply('_Give a YouTube video *URL* or *Query*_');

  const url = (await extractUrlsFromText(match))[0];
  const data = isUrl(url) ? await youtube(url, "video") : await youtube((await yts(match))[0].url, "video");

  await message.reply(`_🎬 Downloading: *${data.title}* 🔻_`);
  await message.send({ url: data.url }, { caption: '🎥 *Here’s your legendary clip by 𝚴𝚯𝚻 𝐔𝚪 𝚴𝚰𝐋 👑*' }, 'video');
});

// 🎧 YOUTUBE AUDIO DOWNLOAD (.yta / .song)
System({
  pattern: 'yta ?(.*)',
  fromMe: isPrivate,
  alias: ['song'],
  desc: 'Download YouTube audio',
  type: 'download'
}, async (message, match) => {
  match = match || message.reply_message.text;
  if (!match) return message.reply('_Send a YouTube *URL* or *Query*_');

  const url = (await extractUrlsFromText(match))[0];
  const data = isUrl(url) ? await YtInfo(url) : await yts(match).then(r => YtInfo(r[0].url));
  const downloadUrl = await youtube(data.url || url);

  const audioBuffer = await toAudio(await getBuffer(downloadUrl.url));
  const audio = await AddMp3Meta(audioBuffer, await getBuffer(data.thumbnail), { title: data.title, body: data.author.name || data.author });

  await message.reply(`_🎧 Downloading audio: *${data.title}*_`);
  await message.reply(audio, { mimetype: 'audio/mpeg' }, 'audio');
});

// 🎬 PLAY (.play) — User chooses audio/video
System({
  pattern: 'play ?(.*)',
  fromMe: isPrivate,
  desc: 'Play YouTube audio/video',
  type: 'download',
}, async (message, match) => {
  if (!match) return message.reply('_Send any song name or YouTube URL_');

  const yt = isUrl(match) ? await YtInfo((await extractUrlsFromText(match))[0]) : (await yts(match))[0];

  await message.reply(
    `🎶 *${yt.title}*\n\n🅰️ 1: Audio\n🅱️ 2: Video\n\n_Reply 1 or 2 to download_`,
    {
      contextInfo: {
        externalAdReply: {
          title: yt.author.name || yt.author,
          body: yt.duration || yt.ago,
          thumbnail: await getBuffer(yt.thumbnail || yt.image),
          mediaType: 1,
          sourceUrl: yt.url,
          showAdAttribution: false,
          renderLargerThumbnail: true
        }
      }
    }
  );
});

// 🔍 YTS — YouTube Search (.yts)
System({
  pattern: 'yts ?(.*)',
  fromMe: isPrivate,
  desc: 'Search YouTube videos',
  type: 'search',
}, async (message, match) => {
  if (!match) return message.reply('_Provide a keyword to search on YouTube_');
  const results = await yts(match);
  const list = results.map(v => `🎬 *${v.title}*\n📏 Duration: ${v.duration}\n🔗 Link: ${v.url}`).join('\n\n');

  await message.reply(`_🔍 Results for:_ *${match}*\n\n${list}`);
});

// 📺 Respond to choices from .play/.yts
System({
  on: 'text',
  fromMe: isPrivate,
  dontAddCommandList: true
}, async (message) => {
  if (!message.reply_message?.fromMe || !message.reply_message.text.includes('1') && !message.reply_message.text.includes('2')) return;

  const choice = parseInt(message.body.trim());
  if (![1, 2].includes(choice)) return;

  const query = message.reply_message.text.match(/https?:\/\/[^\s]+/g)?.[0] || null;
  const video = query ? await YtInfo(query) : (await yts(message.body))[0];

  if (choice === 1) {
    const audioBuffer = await toAudio(await getBuffer((await youtube(video.url)).url));
    const mp3 = await AddMp3Meta(audioBuffer, await getBuffer(video.thumbnail || video.image), { title: video.title, body: video.author.name || video.author });
    await message.reply(mp3, { mimetype: 'audio/mpeg' }, 'audio');
  } else {
    const vid = await getBuffer((await youtube(video.url, "video")).url);
    await message.send(vid, { caption: `🎬 *${video.title}*` }, 'video');
  }
});

// 🎯 High-Quality Video Picker (.ytv)
System({
  pattern: 'ytv ?(.*)',
  fromMe: isPrivate,
  desc: 'YouTube video download with quality list',
  type: 'youtube'
}, async (message, match) => {
  match = match || message.reply_message?.text;
  if (!match) return message.reply('_Send a YouTube video URL or query_');

  const url = (await extractUrlsFromText(match))[0] || (await yts(match))[0]?.url;
  const data = await youtube(url, 'mp4', 'all');

  if (!data.download?.length) return message.reply('_No quality options found_');
  const list = data.download.map((v, i) => `🔢 ${i + 1}. ${v.quality}`).join('\n');

  await message.reply(`🎬 *${data.title}*\n\nAvailable Qualities:\n${list}\n\n_Reply with number to choose_\n✧${url}`);
});

// 🎥 Respond to .ytv choice
System({
  on: 'text',
  fromMe: isPrivate,
  dontAddCommandList: true,
}, async (message) => {
  const text = message.reply_message?.text;
  if (!text?.includes("✧") || isNaN(message.body.trim())) return;

  const url = text.split("✧")[1];
  const num = parseInt(message.body.trim());
  const data = await youtube(url, 'mp4', 'all');
  const chosen = data.download[num - 1];

  if (!chosen) return;
  await message.reply(`🔻 *Downloading:* ${data.title}`);
  await message.send({ url: chosen.download }, { caption: `🎬 *${data.title}*\n📺 Quality: ${chosen.quality}` }, 'video');
});
