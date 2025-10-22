/*  
╔═════════════════════════════════╗
║ 💠 Auto Module Loader - 𝚴𝚯𝚻 𝐔𝚪 𝚴𝚰𝐋 👑 Edition 💠
║ Loads & Exports All .js Files Dynamically
║ Designed with ❤️ by 𝚴𝚯𝚻 𝐔𝚪 𝚴𝚰𝐋 for Legendary Bot
╚═════════════════════════════════╝
*/

const fs = require("fs");
const path = require("path");

// 📁 Current directory (client/)
const clientPath = __dirname;

// 📦 Object to store all exported functions
const exportedModules = {};

// 📂 Read all files in this directory
fs.readdirSync(clientPath).forEach(file => {
  const filePath = path.join(clientPath, file);
  const stats = fs.statSync(filePath);

  // ✅ Only .js files
  if (stats.isFile() && path.extname(file) === ".js") {
    const moduleName = path.basename(file, ".js");
    const requiredModule = require(filePath);

    // 🔄 Handle named exports (multiple functions)
    if (typeof requiredModule === "object") {
      for (const func in requiredModule) {
        exportedModules[func] = requiredModule[func];
      }
    } else {
      // 🔄 Handle default exports
      exportedModules[moduleName] = requiredModule;
    }
  }
});

// 🚀 Export everything
module.exports = exportedModules;

/*
🔧 How It Works:
Put any .js file in this folder (e.g., antiword.js, welcome.js)
It will auto-load and export functions globally for bot system

💖 Created for 𝚴𝚯𝚻 𝐔𝚪 𝚴𝚰𝐋 👑
*/
