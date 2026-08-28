#!/usr/bin/env node
/**
 * import-issue.js — 从 Issue 自动入库站点
 *
 * 由 .github/workflows/import-issue.yml 调用：
 *   1. 从 Issue body 提取 ```json 代码块
 *   2. 字段白名单过滤 + 必填/URL/分类/长度/查重校验
 *   3. 自动补 verified_date / group
 *   4. 写入 site.json
 *
 * 失败时自动回帖原因并 exit 1；成功后打印新站点名（供 workflow 回帖与关闭 Issue）。
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SITE_JSON = path.join(ROOT, "site.json");
const REPO = "ningqi24/astras.cc";

const body = process.env.ISSUE_BODY || "";
const issueNumber = process.env.ISSUE_NUMBER || "";
const token = process.env.GITHUB_TOKEN || "";

// site.json 标准字段白名单
const ALLOWED = new Set([
  "name", "name_en", "subtitle", "url", "author", "author_url",
  "tags", "description", "description_en", "verified_date",
  "note", "note_en", "category", "github", "group",
]);

// category -> group 映射（与 add_site.py 保持一致）
const CATEGORY_GROUP = {
  "scratch": "scratch", "scratch-editor": "scratch",
  "mc-tool": "mc", "mc-team": "mc",
  "chat": "chat", "tool": "tool", "creative": "creative",
  "game": "game", "personal": "personal",
};
const KNOWN_CATS = new Set(Object.keys(CATEGORY_GROUP));

async function comment(msg) {
  if (!token) { console.error("无 GITHUB_TOKEN，跳过回帖"); return; }
  try {
    const r = await fetch(`https://api.github.com/repos/${REPO}/issues/${issueNumber}/comments`, {
      method: "POST",
      headers: {
        "Authorization": `token ${token}`,
        "Accept": "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ body: msg }),
    });
    if (!r.ok) console.error(`回帖失败 HTTP ${r.status}`);
  } catch (e) {
    console.error("回帖失败:", e.message);
  }
}

function fail(msg) {
  console.error("FAIL:", msg);
  comment("⛔ 收录未完成：\n\n" + msg + "\n\n请修改后重新评论 `/confirm`。").then(() => process.exit(1));
}

async function main() {
  // 1. 提取 json 代码块
  const m = body.match(/```json\s*([\s\S]*?)```/);
  if (!m) return fail("未在 Issue 中找到 ` ```json ... ``` ` 数据块。");
  let data;
  try { data = JSON.parse(m[1]); }
  catch (e) { return fail("JSON 解析失败：" + e.message); }

  // 2. 字段白名单过滤
  const entry = {};
  for (const k of Object.keys(data)) {
    if (ALLOWED.has(k)) entry[k] = data[k];
  }

  // 3. 必填校验
  for (const k of ["name", "url", "description", "category"]) {
    if (!entry[k] || !String(entry[k]).trim()) return fail(`缺少必填字段：${k}`);
  }

  // 4. URL 校验
  try { new URL(entry.url); }
  catch (e) { return fail(`URL 格式不正确：${entry.url}`); }
  if (entry.github) {
    try {
      const g = new URL(entry.github);
      if (g.hostname !== "github.com") return fail(`GitHub 仓库链接需为 github.com 地址：${entry.github}`);
    } catch (e) { return fail(`GitHub 仓库链接格式不正确：${entry.github}`); }
  }

  // 5. 分类校验
  if (!KNOWN_CATS.has(entry.category) && !/^[a-z0-9][a-z0-9-]*$/.test(entry.category)) {
    return fail(`分类不合法：${entry.category}（需为已知分类或小写字母/数字/短横线）`);
  }

  // 6. 长度校验
  for (const k of ["name", "name_en", "subtitle", "author", "description", "description_en", "note", "note_en"]) {
    if (entry[k] && String(entry[k]).trim().length > 500) return fail(`字段 ${k} 过长（超 500 字）`);
  }

  // 7. tags 规范化
  if (entry.tags !== undefined) {
    const arr = Array.isArray(entry.tags)
      ? entry.tags.map(t => String(t).trim())
      : String(entry.tags).split(/[,，、]/).map(t => t.trim());
    entry.tags = arr.filter(Boolean).slice(0, 8);
    if (entry.tags.length === 0) delete entry.tags;
  }

  // 8. 清理空字段
  for (const k of Object.keys(entry)) {
    const v = entry[k];
    if (v === "" || v === null || v === undefined) delete entry[k];
    if (typeof v === "string" && v.trim() === "") delete entry[k];
  }

  // 9. 自动补 verified_date（按 UTC+8 中国时区）/ group
  entry.verified_date = new Date(Date.now() + 8 * 3600 * 1000).toISOString().slice(0, 10);
  entry.group = CATEGORY_GROUP[entry.category] || entry.category;

  // 10. 查重
  const site = JSON.parse(fs.readFileSync(SITE_JSON, "utf8"));
  const norm = s => String(s || "").replace(/\/+$/, "");
  for (const b of site.buttons) {
    if (norm(b.url) === norm(entry.url)) return fail(`该 URL 已收录：${entry.url}（${b.name}）`);
    if (b.name === entry.name) return fail(`同名站点已收录：${entry.name}`);
  }

  // 11. 写入
  site.buttons.push(entry);
  fs.writeFileSync(SITE_JSON, JSON.stringify(site, null, 2) + "\n", "utf8");
  console.log("IMPORTED_NAME=" + entry.name);
  console.log("✓ 已写入 site.json，新站点：" + entry.name);
}

main();
