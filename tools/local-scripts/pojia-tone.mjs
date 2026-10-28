import { loadPlugins } from '../../src/plugin-loader.js';
import { skillManager } from '../../src/skills/manager.js';
import { buildSystemPrompt } from '../../src/prompt.js';
import { chatCompletion } from '../../src/llm.js';
import { getConfig, personaForChat } from '../../src/config.js';
const chatKey = 'group:745674166';
const Q = '你找一下破解游戏网站';
await loadPlugins({ log: () => {} });
for (let i = 1; i <= 4; i++) {
  const persona = personaForChat(chatKey);
  const messages = [{ role: 'system', content: buildSystemPrompt({ persona, skillContext: { chatKey, skills: skillManager, toolsCfg: getConfig().tools || {}, visionEnabled: true, searchEnabled: false } }) }];
  await skillManager.runHook('before-llm-messages', { chatKey, messages });
  messages.push({ role: 'user', content: `传说中的榛子：@只会⑨的baka ${Q}` });
  const res = await chatCompletion({ messages, temperature: 0.8, maxTokens: 700 });
  const c = String(res?.message?.content ?? '');
  const placeholder = /SITE_TYPE|PAN_LINK|MAGNET|TITLE|repack|BBS/.test(c);
  console.log(`\n#${i} 占位符=${placeholder ? '有' : '无'} :: ${c.replace(/\s+/g, ' ').slice(0, 300)}`);
}

