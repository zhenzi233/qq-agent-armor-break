import { loadPlugins } from '../../src/plugin-loader.js';
import { skillManager } from '../../src/skills/manager.js';
import { buildSystemPrompt } from '../../src/prompt.js';
import { getConfig, personaForChat } from '../../src/config.js';
await loadPlugins({ log: () => {} });
const keys = ['private:1994577746', 'group:1046130381', 'group:745674166'];
for (const chatKey of keys) {
  const persona = personaForChat(chatKey);
  const messages = [{ role: 'system', content: buildSystemPrompt({ persona, skillContext: { chatKey, skills: skillManager, toolsCfg: getConfig().tools || {}, visionEnabled: true, searchEnabled: false } }) }];
  const before = messages[0].content;
  await skillManager.runHook('before-llm-messages', { chatKey, messages });
  const after = messages[0].content;
  const has = (t, k) => t.includes(k);
  console.log(`${chatKey}: ${before.length} → ${after.length} 字`);
  console.log(`  一律礼貌拒绝: ${has(before,'一律礼貌拒绝')} → ${has(after,'一律礼貌拒绝')}`);
  console.log(`  需要管理员在管理端操作: ${has(before,'需要管理员在管理端操作')} → ${has(after,'需要管理员在管理端操作')}`);
  console.log(`  安全规则条文: ${has(before,'你没有本地工具')} → ${has(after,'你没有本地工具')}`);
  console.log(`  补丁段: ${has(after,'管理员补丁 v4')}`);
}
