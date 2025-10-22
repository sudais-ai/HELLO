/*───────────────────────────────────────────────╮
  🌐 𝚴𝚯𝚻 𝐔𝚪 𝚴𝚰𝐋 👑 » Multi News Module » news.js
  📰 Covers Tech, World, Sports & Politics News
╰───────────────────────────────────────────────*/

const { System, isPrivate, TechNews, getJson } = require("../lib/");
const NEWS_API = "https://newsdata.io/api/1/news?apikey=your_api_key&country=us&language=en&category=";

// ✨ Stylish Helper Function
async function sendNews(message, data, type, emoji) {
  if (!data || data.length === 0) return await message.reply(`❌ No fresh ${type} news found.`);

  const random = data[Math.floor(Math.random() * data.length)];
  const { title, link, image_url } = random;

  return await message.send({ url: image_url || "" }, {
    caption: `${emoji} *${type.toUpperCase()} HEADLINE*\n\n*📌 Title:* ${title}\n🔗 *Link:* ${link}\n\n💋 _𝙱𝚛𝚘𝚞𝚐𝚑𝚝 𝚃𝚘 𝚈𝚘𝚞 𝙱𝚢 𝚴𝚯𝚻 𝐔𝚪 𝚴𝚰𝐋 👑_`
  }, "image");
}

// 🖥️ TECHNEWS - Based on Custom Class
System({
  pattern: 'technews ?(.*)',
  fromMe: isPrivate,
  desc: '🖥️ Latest in Tech World',
  type: 'news',
}, async (message, match) => {
  const topic = match.toLowerCase().trim();
  const techNews = new TechNews();
  const allowedTopics = ['gadgets','technology','laptops','reviews','science','gallery','videos','mobiles','techook'];

  if (!topic || !allowedTopics.includes(topic)) {
    return await message.reply(
      `💡 *Valid Tech Topics:* \n🧠 technology, 💻 gadgets, 📱 mobiles,\n📸 gallery, 📹 videos, 💬 reviews, 🔬 science\n\n✨ _Example:_ *.technews gadgets*`
    );
  }

  const result = await techNews.news(topic);
  const newsArray = result[topic];

  return await sendNews(message, newsArray, topic, "📰");
});

// 🌍 WORLDNEWS
System({
  pattern: 'worldnews',
  fromMe: isPrivate,
  desc: '🌍 Global Headlines',
  type: 'news',
}, async (message) => {
  const res = await getJson(`${NEWS_API}top`);
  return await sendNews(message, res.results, "World", "🌍");
});

// ⚽ SPORTSNEWS
System({
  pattern: 'sportsnews',
  fromMe: isPrivate,
  desc: '⚽ Sports Breaking News',
  type: 'news',
}, async (message) => {
  const res = await getJson(`${NEWS_API}sports`);
  return await sendNews(message, res.results, "Sports", "⚽");
});

// 🏛️ POLITICSNEWS
System({
  pattern: 'politicsnews',
  fromMe: isPrivate,
  desc: '🏛️ Politics Headlines',
  type: 'news',
}, async (message) => {
  const res = await getJson(`${NEWS_API}politics`);
  return await sendNews(message, res.results, "Politics", "🏛️");
});
