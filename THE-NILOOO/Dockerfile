# 🛠️ BASE: Lightweight NodeJS image
FROM node:18

# 👑 Developer credit
LABEL author="𝚴𝚯𝚻 𝐔𝚪 𝚴𝚰𝐋" \
      description="Legendary WhatsApp Bot container by 𝚴𝚯𝚻 𝐔𝚪 𝚴𝚰𝐋"

# 📁 App directory
WORKDIR /app

# 📦 Copy project files from current repo into container
COPY . .

# 📦 Install dependencies safely
RUN yarn install --network-concurrency 1

# 🎥 Optional: Install media tools for WhatsApp bots
RUN apt-get update && apt-get install -y ffmpeg imagemagick

# 🚀 Start the bot using package.json's start script
CMD ["npm", "start"]
