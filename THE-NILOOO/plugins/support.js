/*═════════════════════════════════════════════❥
   🔮 𝚴𝚯𝚻 𝐔𝚪 𝚴𝚰𝐋 👑 | 𝚻𝚮𝚵 𝐋𝚵𝐆𝚴𝚴𝐃𝚫𝚪𝐄 𝚴𝚰𝐋 𝚩𝚯𝚻 🔮
═════════════════════════════════════════════❥
     Sexy Romantic Support & Plugin Module 💕
═════════════════════════════════════════════❥*/

const { getJson, getBuffer, System, isPrivate, sleep } = require("../lib/");

System({
    pattern: "help",
    fromMe: isPrivate,
    desc: "Bot support 💌",
    type: "support"
}, async (message) => {
    const name = '💘 𝚴𝚯𝚻 𝐔𝚪 𝚴𝚰𝐋 👑';
    const title = "❤️ 𝚺𝚄𝙿𝙿𝙾𝚁𝚃 𝙵𝙾𝚁 𝚼𝙾𝚄 💫";
    const number = '923474810818';
    const body = "𝚴𝚯𝚻 𝐔𝚪 𝚴𝚰𝐋 👑";
    const image = "https://graph.org/file/58ea74675af7836579a3a.jpg";
    const sourceUrl = 'https://github.com/sudais-ai/THE-NILOOO';
    const logo = await getBuffer(image);

    const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nORG: Powered by ${body};\nTEL;type=CELL;type=VOICE;waid=${number}:${number}\nEND:VCARD`;
    const adon = {
        title,
        body: "📞 Romantic Bot Helpdesk",
        thumbnail: logo,
        mediaType: 1,
        mediaUrl: sourceUrl,
        sourceUrl,
        showAdAttribution: true,
        renderLargerThumbnail: true,
    };

    await message.send({ displayName: name, contacts: [{ vcard }] }, {
        contextInfo: { externalAdReply: adon },
        quoted: message
    }, "contacts");
});

System({
    pattern: "allplugin",
    fromMe: isPrivate,
    desc: "Get all plugins 📦",
    type: "support"
}, async (message) => {
    const api = "https://nil-api.techno.niloo/";
    const { result: allPluginsData } = await getJson(api + 'bot/plugin?query=allplugin');
    const { result: externalPluginsData } = await getJson(api + 'bot/plugin?query=pluginlist');

    const formatPluginData = (pluginData, isExternal = false) => {
        return Object.entries(pluginData).map(([key, value], index) => 
            `💖 *${index + 1}. ${key}* \n🔗 ${value.url}`
        ).join('\n\n');
    };

    const fancyThumb = { url: "https://graph.org/file/30ab5e1e228a9636ce7f5.jpg" };
    const externalInfo = {
        title: "✨ External Plugins",
        body: "💋 Ready to spice up your bot 💦",
        thumbnail: fancyThumb,
        mediaType: 1,
        mediaUrl: 'https://github.com/sudais-ai/THE-NILOOO',
        sourceUrl: 'https://github.com/sudais-ai/THE-NILOOO',
        showAdAttribution: true,
    };

    const internalInfo = {
        title: "💌 Custom Plugins",
        body: "🔧 Edit before play 😉",
        thumbnail: fancyThumb,
        mediaType: 1,
        mediaUrl: 'https://github.com/sudais-ai/THE-NILOOO',
        sourceUrl: 'https://github.com/sudais-ai/THE-NILOOO',
        showAdAttribution: true,
    };

    await message.send(formatPluginData(externalPluginsData), {
        quoted: message,
        contextInfo: { externalAdReply: externalInfo }
    });

    await sleep(500);

    await message.send(formatPluginData(allPluginsData), {
        quoted: message,
        contextInfo: { externalAdReply: internalInfo }
    });
});

/*═════════════════════════════════════════════❥
   💕 Module by 𝚴𝚯𝚻 𝐔𝚪 𝚴𝚰𝐋 👑 | Stay Flirty 💌
═════════════════════════════════════════════❥*/
