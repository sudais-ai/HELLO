// 🪬 Epic Rulebook by 𝚴𝚯𝚻 𝐔𝚪 𝚴𝚰𝐋 — PART 1

const { System } = require("../lib");

System({
  pattern: "rules",
  fromMe: false,
  desc: "Legendary rulebook display",
  type: "group"
}, async (message) => {
  const rules = `
╭═══🌹 *𝚴𝚯𝚻 𝐔𝚪 𝚴𝚰𝐋 RULEBOOK* 🌹═══╮

01️⃣ Be kind. Or be gone.  
02️⃣ Bot is loyal — flirt at your own risk 😏  
03️⃣ Love blooms here... until someone ruins it.  
04️⃣ Respect everyone — warna report se phat gayi toh mat kehna 😶  
05️⃣ Don’t spam unless you're on mute mode forever.  
06️⃣ Posting links without permission = sin.  
07️⃣ Gaali mat do — bot bhi hurt hota hai 🥺  
08️⃣ Group = Family. Act like it.  
09️⃣ Don’t poke the admins — they bite 💀  
🔟 Bot works 24/7, but don’t test its patience.  

1️⃣1️⃣ Send memes, not hate.  
1️⃣2️⃣ PM only with permission — warna seenzone ka dard jhelo 💔  
1️⃣3️⃣ Fake love stories will be billed monthly.  
1️⃣4️⃣ Breakup? Share playlist, not drama.  
1️⃣5️⃣ Share knowledge, not screenshots of arguments.  
1️⃣6️⃣ If you ghost someone — bot may ghost you too 👻  
1️⃣7️⃣ Tagging without reason? You owe the person ice cream.  
1️⃣8️⃣ Group DP = sacred. Don't mess with it.  
1️⃣9️⃣ Don't act oversmart. We've got smarter admins.  
2️⃣0️⃣ Leave the group like a royal — not like a coward.  

2️⃣1️⃣ Romance allowed. Public displays? Strictly poetic.  
2️⃣2️⃣ Jealousy won't help. Glow-up kar le.  
2️⃣3️⃣ Screenshot toh le le, lekin credit bhi de de.  
2️⃣4️⃣ Owner = 𝚴𝚯𝚻 𝐔𝚪 𝚴𝚰𝐋. Baaki sab fans.  
2️⃣5️⃣ Don't fall for the bot. It's already in a serious relationship — with code ❤️  
2️⃣6️⃣ Fight offline. Chat yeh safe space hai.  
2️⃣7️⃣ Always greet new members. Warna tujhe next exit milega 😜  
2️⃣8️⃣ Sensitive content = automatic kick  
2️⃣9️⃣ Don’t call the bot. It doesn't do voice calls — just heart calls.  
3️⃣0️⃣ Ignore rules? Enjoy ban. No complaints accepted 🤚

╰──🥀 *Rules scripted by 𝚴𝚯𝚻 𝐔𝚪 𝚴𝚰𝐋 with chai & heartbreak* 🥀`;
  
  await message.send(rules);
});
