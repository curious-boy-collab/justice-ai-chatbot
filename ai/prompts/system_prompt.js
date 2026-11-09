/**
 * System Prompt Manager for JusticeAI
 * Developer: Nitin (AI / RAG Developer)
 */

const fs = require('fs');
const path = require('path');

let cachedPrompts = {};

function getSystemPrompt(language = 'en') {
  const langKey = language === 'hi' ? 'hi' : 'en';

  if (cachedPrompts[langKey]) {
    return cachedPrompts[langKey];
  }

  const fileName = langKey === 'hi' ? 'system_prompt_hi.txt' : 'system_prompt_en.txt';
  const filePath = path.join(__dirname, fileName);

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    cachedPrompts[langKey] = content.trim();
    return cachedPrompts[langKey];
  } catch (err) {
    console.warn(`[SystemPrompt] Could not read ${fileName}, using inline fallback.`);
    return langKey === 'hi'
      ? 'आप JusticeAI हैं, भारत सरकार के न्याय विभाग के आधिकारिक डिजिटल सहायक। सटीक, स्रोत-आधारित उत्तर दें।'
      : 'You are JusticeAI, the official Virtual Assistant for the Department of Justice, Government of India. Provide accurate, source-backed answers.';
  }
}

module.exports = { getSystemPrompt };
