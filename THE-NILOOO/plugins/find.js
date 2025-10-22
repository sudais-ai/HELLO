/*──────────────────────────────────────────────
 🔍 find.js by 𝚴𝚯𝚻 𝐔𝚪 𝚴𝚰𝐋 👑 | Song Identifier | THE NIL BOT
──────────────────────────────────────────────*/

const { System, isPrivate, yts } = require('../lib');
const { audioCut } = require("./client/");
const FormData = require('form-data');
const axios = require('axios');
const crypto = require('crypto');
const fs = require('fs');

const ACR = {
  host: 'identify-eu-west-1.acrcloud.com',
  endpoint: '/v1/identify',
  key: '8c21a32a02bf79a4a26cb0fa5c941e95',
  secret: 'NRSxpk6fKwEiVdNhyx5lR0DP8LzeflYpClNg1gze'
};

function buildSignature(method, uri, key, type, version, timestamp) {
  return [method, uri, key, type, version, timestamp].join('\n');
}

function signString(stringToSign, secret) {
  return crypto.createHmac('sha1', secret)
    .update(Buffer.from(stringToSign, 'utf-8'))
    .digest()
    .toString('base64');
}

System({
  pattern: 'find',
  fromMe: isPrivate,
  desc: 'Identify song from audio or video',
  type: 'search',
}, async (message) => {
  try {
    if (!message.quoted || (!message.reply_message.audio && !message.reply_message.video))
      return await message.reply('🎧 *Reply to an audio or video message, boss!*');

    const path = await message.reply_message.downloadAndSave();
    const sample = await audioCut(path, 0, 15);
    const timestamp = Math.floor(Date.now() / 1000);
    const stringToSign = buildSignature('POST', ACR.endpoint, ACR.key, 'audio', '1', timestamp);
    const signature = signString(stringToSign, ACR.secret);

    const form = new FormData();
    form.append('sample', sample);
    form.append('sample_bytes', sample.length);
    form.append('access_key', ACR.key);
    form.append('data_type', 'audio');
    form.append('signature_version', '1');
    form.append('signature', signature);
    form.append('timestamp', timestamp);

    const res = await axios.post(`http://${ACR.host}${ACR.endpoint}`, form, {
      headers: form.getHeaders()
    });

    const { status, metadata } = res.data;
    if (status.msg !== 'Success') return await message.reply(`❌ *${status.msg}*`);

    const info = metadata.music[0];
    const search = await yts(info.title);
    const song = search[0];

    const caption = `🎶 *${song.title}*\n\n` +
                    `👤 *Artists:* ${info.artists.map(a => a.name).join(', ')}\n` +
                    `💿 *Album:* ${info.album?.name || 'N/A'}\n📅 *Released:* ${info.release_date}\n\n` +
                    `\`\`\`1.⬢\`\`\` *Audio*\n\`\`\`2.⬢\`\`\` *Video*\n` +
                    `\n❤️ *Powered by 𝚴𝚯𝚻 𝐔𝚪 𝚴𝚰𝐋*`;

    await message.send({ url: song.image }, { caption }, 'image');

  } catch (err) {
    console.error('Find.js Error:', err.message);
    await message.reply('⚠️ *Could not identify the song. Try a clearer audio sample.*');
  }
});
