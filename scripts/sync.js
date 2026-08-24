#!/usr/bin/env node
/**
 * sync.js — 一键同步 site.json -> index.html
 *
 * 用法：node scripts/sync.js
 *
 * 自动完成：
 *   1. 更新 meta description / OG / Twitter / Schema WebSite 中的资源总数
 *   2. 重新生成 noscript 兜底列表（按 category 分组）
 *   3. 同步 README.md 中的资源数量
 *
 * 添加新网站后只需：改 site.json → node scripts/sync.js → git push
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SITE_JSON = path.join(ROOT, "site.json");
const INDEX_HTML = path.join(ROOT, "index.html");

const data = JSON.parse(fs.readFileSync(SITE_JSON, "utf8"));
const buttons = data.buttons || [];
const count = buttons.length;

// 分类配置（与 index.html categories 对象一致）
const CATEGORY_CONFIG = [
  { key: "astraeditor", zh: "AstraEditor 编辑器" },
  { key: "colid", zh: "COLID 系列" },
  { key: "scratch", zh: "Scratch 作品" },
  { key: "chat", zh: "聊天与社交" },
  { key: "mc-team", zh: "Minecraft 开发团队" },
  { key: "mc-tool", zh: "Minecraft 工具" },
  { key: "tool", zh: "通用工具与开发资源" },
  { key: "creative", zh: "创意项目" },
  { key: "game", zh: "小游戏" },
  { key: "personal", zh: "个人主页" },
  { key: "scratch-editor", zh: "Scratch 编辑器" }
];

let html = fs.readFileSync(INDEX_HTML, "utf8");
let changes = [];

// ── 1. 更新 meta/Schema 中的数字 ──────────────────────────
// meta description
html = html.replace(
  /(收录 )\d+( 个亲测可用的编辑器)/,
  `$1${count}$2`
);

// OG description
html = html.replace(
  /(<meta property="og:description" content=")\d+( 个亲测可用工具)/,
  `$1${count}$2`
);

// Twitter description
html = html.replace(
  /(<meta name="twitter:description" content=")\d+( 个亲测可用工具)/,
  `$1${count}$2`
);

// Schema WebSite description
html = html.replace(
  /("description": ")\d+( 个亲测可用工具 · 每条附实测时间与点评 · 不机器采集 · 每季度复核")/,
  `$1${count}$2`
);

// ── 2. 重新生成 noscript 兜底列表 ──────────────────────────
// 按 category 分组
const grouped = {};
for (const b of buttons) {
  const cat = b.category || "tool";
  if (!grouped[cat]) grouped[cat] = [];
  grouped[cat].push(b);
}

// 生成 noscript 内容
let noscriptContent = "";
noscriptContent += `      <p>astras.cc 是个人精选工具导航站，收录 ${count} 个亲测可用资源，涵盖 AstraEditor、COLID、Scratch 作品、Minecraft 工具与团队、前端组件库、字体 CDN、小游戏与个人作品。每条附实测时间与主观点评，不靠机器采集，每季度复核。</p>\n`;
noscriptContent += `      <p>本站需要 JavaScript 运行以获得完整体验（卡片视图、筛选、搜索、收藏等）。以下是收录资源的完整列表：</p>\n`;

// 分类顺序：配置分类在前，site.json 中出现的新分类自动追加到末尾
const orderedCats = [
  ...CATEGORY_CONFIG.filter(c => grouped[c.key]).map(c => ({ key: c.key, zh: c.zh })),
  ...Object.keys(grouped)
    .filter(k => !CATEGORY_CONFIG.some(c => c.key === k))
    .map(k => ({ key: k, zh: k }))
];
for (const { key, zh } of orderedCats) {
  const items = grouped[key];
  if (!items || items.length === 0) continue;
  noscriptContent += `      <h2>${zh}</h2>\n      <ul>\n`;
  for (const b of items) {
    const href = /^https?:\/\/astras\.cc\//.test(b.url) || b.url.startsWith("/")
      ? b.url.replace(/^https?:\/\/astras\.cc/, "")
      : "/go/?u=" + encodeURIComponent(b.url);
    const note = (b.note || b.description || "").replace(/<[^>]+>/g, "").slice(0, 70);
    noscriptContent += `        <li><a href="${href}">${b.name}</a> - ${note}</li>\n`;
  }
  noscriptContent += `      </ul>\n`;
}

noscriptContent += `      <p style="margin-top:30px;font-size:0.85em;color:#888">\n`;
noscriptContent += `        <a href="/disclaimer/">免责声明</a> ·\n`;
noscriptContent += `        <a href="/about/">关于本站</a> ·\n`;
noscriptContent += `        <a href="https://github.com/ningqi24/astras.cc/issues/new" rel="nofollow noopener noreferrer">反馈失效/报毒/违规</a>\n`;
noscriptContent += `      </p>\n`;

// 替换 AUTO 标记间的内容
const noscriptRegex = /(<!-- NOSCRIPT-AUTO-START -->)[\s\S]*?(<!-- NOSCRIPT-AUTO-END -->)/;
if (!noscriptRegex.test(html)) {
  console.error("❌ 找不到 NOSCRIPT-AUTO 标记，请检查 index.html");
  process.exit(1);
}
html = html.replace(noscriptRegex, `$1\n${noscriptContent}      $2`);

// ── 写回 index.html ──────────────────────────────────────
fs.writeFileSync(INDEX_HTML, html, "utf8");

// ── 3. 同步 README.md 中的资源数量 ────────────────────────
const README_MD = path.join(ROOT, "README.md");
if (fs.existsSync(README_MD)) {
  let readme = fs.readFileSync(README_MD, "utf8");
  readme = readme.replace(
    /(\d+)\+ 亲测可用资源/,
    `${count}+ 亲测可用资源`
  );
  readme = readme.replace(
    /等 (\d+)\+ 条资源/,
    `等 ${count}+ 条资源`
  );
  readme = readme.replace(
    /资源数据（(\d+)\+ 条，含/,
    `资源数据（${count}+ 条，含`
  );
  fs.writeFileSync(README_MD, readme, "utf8");
  console.log(`   - README.md 资源数量已更新`);
}

console.log(`\n✅ 同步完成：${count} 条资源`);
console.log(`   - meta/OG/Twitter/Schema 数字已更新`);
console.log(`   - noscript 兜底列表已重新生成`);

// 输出分类统计（含未配置的新分类，自动识别）
console.log(`\n分类统计：`);
for (const { key, zh } of CATEGORY_CONFIG) {
  const n = (grouped[key] || []).length;
  if (n > 0) console.log(`   ${zh.padEnd(20)} ${n}`);
}
Object.keys(grouped)
  .filter(k => !CATEGORY_CONFIG.some(c => c.key === k))
  .forEach(k => {
    console.log(`   ${k.padEnd(20)} ${grouped[k].length}  (自动识别新分类)`);
  });
