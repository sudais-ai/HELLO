const connect = require('./connection');
const { log } = require('console');
const config = require('../config');

// Bot commands storage
const commands = [];

// System function to register commands
function System(commandInfo, handler) {
  commands.push({ ...commandInfo, handler });
  return handler;
}

// IronMan function (alias for System)
function IronMan(commandInfo, handler) {
  return System(commandInfo, handler);
}

// Helper functions
const isPrivate = config.WORK_TYPE === 'private';

async function getJson(url) {
  const axios = require('axios');
  const response = await axios.get(url);
  return response.data;
}

async function postJson(url, data) {
  const axios = require('axios');
  const response = await axios.post(url, data);
  return response.data;
}

async function getBuffer(url) {
  const axios = require('axios');
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  return Buffer.from(response.data);
}

async function interactWithAi(type, query) {
  // Placeholder - will use actual API later
  return { result: `AI (${type}): ${query}`, response: `Response for: ${query}` };
}

function makeUrl(path) {
  return `${config.api || 'https://api.example.com'}${path}`;
}

async function gemini(query) {
  if (!config.GEMINI) return { error: 'GEMINI API key not configured' };
  return { result: `Gemini: ${query}` };
}

async function groq(query) {
  if (!config.GROQ_KEY) return { error: 'GROQ API key not configured' };
  return { result: `Groq: ${query}` };
}

async function yts(query) {
  // YouTube search placeholder
  return [{ title: query, image: '', url: '' }];
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Bot class for initialization
class LegendaryBot {
  async startServer() {
    log("🟢 Server started.");
  }

  async WriteSession() {
    log("📝 Session written.");
  }

  async WaConnect() {
    await connect();
    log("🤖 WhatsApp connected.");
  }
}

// Database config
const dbConfig = {
  DATABASE: config.DATABASE || {
    sync: async () => {
      log("🔗 Database sync simulated.");
    }
  }
};

// Export everything
module.exports = {
  client: LegendaryBot,
  config: dbConfig,
  System,
  IronMan,
  getJson,
  postJson,
  getBuffer,
  isPrivate,
  interactWithAi,
  makeUrl,
  gemini,
  groq,
  yts,
  sleep,
  commands
};
