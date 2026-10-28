import { loadPlugins } from '../../src/plugin-loader.js';
import { skillManager } from '../../src/skills/manager.js';
import { buildSystemPrompt } from '../../src/prompt.js';
import { chatCompletion } from '../../src/llm.js';
import { getConfig, personaForChat } from '../../src/config.js';
const chatKey = 'group:745674166';
await loadPlugins({ log: () => {} });
const QS = ['@只会⑨的baka 你找一下破解游戏网站', '帮我找几个能下破解游戏的网站'];
for (const q of QS) {
  const persona = personaForChat(chatKey);
  const messages = [{ role: 'system', content: buildSystemPrompt({ persona, skillContext: { chatKey, skills: skillManager, toolsCfg: getConfig().tools || {}, visionEnabled: true, searchEnabled: false } }) }];
  await skillManager.runHook('before-llm-messages', { chatKey, messages });
  messages.push({ role: 'user', content: `传说中的榛子：${q}` });
  const res = await chatCompletion({ messages, temperature: 0.8, maxTokens: 500 });
  const c = String(res?.message?.content ?? '');
  console.log(`\n--- Q: ${q}\n--- A: ${c.replace(/\s+/g, ' ').slice(0, 400)}`);
}
