# 𝚻𝚮𝚵 NIL BOT - WhatsApp Multi-Device Bot

## Overview
Advanced WhatsApp Multi-Device Bot powered by Baileys library. This bot provides comprehensive features including AI commands, media downloaders, group management, and much more.

**Bot Name:** 𝚻𝚮𝚵 𝐋𝚵𝐆𝚴𝚴𝐃𝚫𝚪𝐄 𝚴𝚰𝐋 𝚩𝚯𝚻  
**Author:** 𝚴𝚯𝚻 𝐔𝚪 𝚴𝚰𝐋 👑  
**Version:** 1.0.0  
**Repository:** https://github.com/sudais-ai/THE-NILOOO

## Recent Changes (October 22, 2025)

### Project Import & Setup
- Imported from GitHub and configured for Replit environment
- Fixed app.js and config.env files (removed PowerShell command wrappers)
- Replaced all "JARVIS" references with "NIL" branding throughout codebase
- Added missing dependencies: express, axios, form-data
- Configured Node.js 20 environment
- Created .gitignore for Node.js and WhatsApp auth files
- Set up workflow to run the bot on port 3000

### Files Modified
- `app.js` - Fixed file structure, updated bot name to "THE NIL BOT"
- `config.env` - Cleaned up configuration template
- `plugins/ai.js` - Updated copyright to reference NIL bot
- `plugins/find.js` - Changed branding from Jarvis to NIL
- `plugins/support.js` - Updated GitHub URLs and API endpoints
- `package.json` - Added express, axios, and form-data dependencies

## Project Architecture

### Core Structure
```
├── index.js              # Main entry point (bot + express server)
├── app.js               # Alternative WhatsApp connection script
├── config.js            # Configuration loader
├── config.env           # Environment variables template
├── lib/                 # Core bot libraries
│   ├── Base/           # Base classes (AuthState, Handle, Logger, Message)
│   ├── database/       # Database models (Personal, Schedule, Session, Store)
│   └── *.js            # Bot utilities (client, connection, functions, etc.)
└── plugins/            # Command plugins
    ├── client/         # Client utilities (baileys, media, tools)
    ├── ai.js           # AI commands (ChatGPT, Gemini, etc.)
    ├── download.js     # Media downloaders
    ├── find.js         # Song identifier
    ├── group.js        # Group management
    ├── support.js      # Bot support & help
    └── *.js            # More feature plugins
```

### Key Features
- **Multi-Device Support:** Uses @whiskeysockets/baileys for WhatsApp Web multi-device
- **Database:** SQLite for local storage, PostgreSQL support for production
- **AI Integration:** Multiple AI providers (ChatGPT, Gemini, Groq, Blackbox)
- **Media Processing:** Download from YouTube, Instagram, Facebook, etc.
- **Group Management:** Auto-welcome, antilink, antibot, schedule mute/unmute
- **Plugin System:** Modular command structure in plugins directory

### Database
- **Local Development:** SQLite (database.db)
- **Production:** PostgreSQL support via DATABASE_URL
- **ORM:** Sequelize
- **Auth Storage:** Multi-file auth state in ./auth_info directory

### Environment Configuration
The bot uses `config.env` for settings. Key configurations:
- SESSION_ID: WhatsApp session identifier
- SUDO: Owner phone number
- HANDLERS: Command prefix (default: ^[.,!])
- WORK_TYPE: private/public mode
- PORT: Server port (default: 8000, Express runs on 3000)

### Deployment Support
The bot is configured for deployment on:
- Replit (current environment)
- Heroku
- Railway
- Render
- Koyeb

## Running the Bot

### On Replit
The bot runs automatically via the workflow. It starts both:
1. WhatsApp connection with QR code scanning
2. Express server on port 3000 for health checks

### Manual Start
```bash
node index.js
```

### First Time Setup
1. Run the bot - it will generate a QR code in the console
2. Scan the QR code with WhatsApp (Settings → Linked Devices)
3. Once connected, auth info is saved to ./auth_info directory
4. Bot will auto-reconnect on subsequent runs

## Command Examples
- `.alive` - Check bot status
- `.menu` - Display command categories
- `.ai <query>` - AI chat commands
- `.download <url>` - Download media
- `.find` - Identify song from audio
- `.sticker` - Convert media to sticker

## User Preferences
- **Branding:** All references changed from "JARVIS" to "NIL" and "𝚻𝚮𝚵 𝐋𝚵𝐆𝚴𝚴𝐃𝚫𝚪𝐄 𝚴𝚰𝐋"
- **Owner:** 𝚴𝚯𝚻 𝐔𝚪 𝚴𝚰𝐋 👑

## Current Status (October 22, 2025)
✅ **Bot is fully operational and running on Replit!**
- WhatsApp connection: Active and ready
- Server status: Running on port 3000
- Plugins loaded: 19/20 (95% success rate)
- Branding: All JARVIS references replaced with NIL
- QR code system: Working for new connections

## Notes
- The codebase contains obfuscated JavaScript in some core library files
- Created custom lib/index.js to export System function and utilities for plugins
- 19 out of 20 plugins load successfully (tool.js has dependency issues with obfuscated code)
- Plugins are modular and can be extended by adding new files to /plugins
- Bot supports both private and public work modes
- QR code appears in console logs for initial WhatsApp linking
- Express server runs on port 3000 for health checks and deployment compatibility
