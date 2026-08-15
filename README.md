# astras.cc

> 个人精选工具导航站 · 49+ 亲测可用资源 · 不机器采集 · 每季度复核

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Site](https://img.shields.io/badge/site-astras.cc-66ccff.svg)](https://astras.cc/)
[![Status](https://img.shields.io/badge/status-live-brightgreen.svg)](https://astras.cc/)

`astras.cc` 是由 [@ningqi24](https://github.com/ningqi24) 个人维护的聚合导航站。收录 AstraEditor、Scratch 衍生项目（OS / UI）、前端工具、聊天服务、字体 CDN、小游戏与个人作品等 49+ 条资源。每条均附"亲测时间徽章 + 主观点评"，每季度复核，不靠机器采集。

---

## 项目特性

- **人工精选** — 每个链接均由站长亲自访问验证，附 `verified_date` + `note` 双语手写点评
- **状态徽章** — 90 天内 ✅ / 91–180 天 ⚠️ 待复核 / 超 180 天 🔴 长期未复核，状态自动降级
- **外链安全** — 所有第三方外链通过 `/go/?u=` 中转页跳转，含白名单校验、风险提示、死链反馈入口
- **法律合规** — 独立 `/disclaimer/` 免责声明页 + `rel="noopener noreferrer nofollow"` 防权值外流
- **SEO 完整** — canonical / meta description / Open Graph / Twitter Card / Schema.org `ItemList` 富摘要 / noscript 兜底
- **双语切换** — 全站中英文（含卡片 note、footer、Hero slogan）
- **三视图** — 列表视图 / 网格视图 / 横向滚动，可切换
- **零依赖** — 纯 HTML / CSS / JS，无构建步骤，直接静态托管

---

## 项目结构

```
astras.cc/
├── index.html              # 导航首页（Hero + 筛选栏 + 卡片列表 + Footer）
├── site.json               # 资源数据（49+ 条，含 verified_date / note / note_en）
├── sitemap.xml             # 站点地图
├── CNAME                   # 自定义域名 astras.cc
├── favicon.ico
├── robots.txt              # 爬虫规则（如有）
│
├── go/                     # 外链中转页（白名单校验 + 风险提示 + 死链反馈）
│   └── index.html
├── disclaimer/             # 免责声明页（法律兜底）
│   └── index.html
├── about/                  # 关于本站（站长介绍 + 联系 + 反馈入口）
│   └── index.html
│
├── signgenerator/          # 高速编号牌生成器
├── sendemail/              # 域名邮件发送工具子站
├── game/shas/              # 鲨鲨幸存者小游戏
└── images/                 # 图片资源
```

---

## 资源数据格式

编辑 `site.json` 即可增删条目。每条字段：

```jsonc
{
  "name": "AstraEditor 官网(.top)",
  "name_en": "AstraEditor Official(.top)",
  "subtitle": "editors.astras.top",
  "url": "https://editors.astras.top/",
  "author": "AstraTeam",
  "author_url": "https://github.com/AstraEditor",
  "tags": ["Scratch", "编辑器"],
  "description": "中文描述……",
  "description_en": "English description...",
  "verified_date": "2026-07-31",   // 亲测日期，YYYY-MM-DD
  "note": "≤30 字主观点评",          // 中文点评
  "note_en": "Short English note"   // 英文点评
}
```

**状态徽章自动降级规则**：

| `verified_date` 距今 | 徽章 | 含义 |
|---|---|---|
| ≤ 90 天 | ✅ `2026-07` | 亲测可用 |
| 91–180 天 | ⚠️ `待复核` | 已过期，待复核 |
| > 180 天 | 🔴 `长期未复核` | 需重新验证 |
| 无日期 | `未测` | 未亲测 |

---

## 添加新站点流程

> 零手动改 HTML，三步走：

```bash
# 1. 编辑 site.json，按上方格式新增条目
vim site.json

# 2. 运行 sync 脚本，自动更新 index.html（meta 数字 / noscript 列表）
node scripts/sync.js

# 3. 推送
git add site.json index.html
git commit -m "site: add xxx"
git push
```

注释：`scripts/sync.js` 会读取 `site.json` 自动更新 `index.html` 中的资源总数和 noscript 兜底 HTML，**禁止手改 index.html 中的数字**。

---

## 外链中转机制

所有非 `astras.cc` 域名的外链均不直接跳转，而是先到 `/go/?u=<url>` 中转页：

1. **白名单校验** — `u` 参数必须与 `site.json` 中某条 `url` 完全匹配，否则拒绝跳转（防钓鱼者借用本站洗白任意链接）
2. **风险提示** — 展示目标域名，提示"本站不对外链内容负责"
3. **死链反馈** — 提供反馈入口，便于用户报失效 / 报毒

---

## 本地运行

```bash
git clone https://github.com/ningqi24/astras.cc.git
cd astras.cc
python3 -m http.server 8080
```

浏览器访问 http://localhost:8080

---

## 部署

GitHub Pages + CNAME = `astras.cc`，纯静态无构建。直接 `git push` 到 `main` 即可生效。

---

## 季度维护流程

每 3 个月执行一次：

1. 打开首页，对照卡片列表逐条点击访问
2. 验证后，修改 `site.json` 中对应条目的 `verified_date` 为当天日期
3. （可选）补充或更新 `note` / `note_en` 点评内容
4. `git commit -m "chore: quarterly recheck YYYY-MM"` 并推送
5. 徽章会自动从黄/红回到绿色，无需改任何代码

---

## 技术栈

- 纯 HTML / CSS / 原生 JS（无框架、无构建）
- CSS 变量系统（`--accent-color` / `--radius-card` / `--shadow-hover` 等）
- 玻璃拟态（`backdrop-filter: blur`）
- Schema.org JSON-LD 结构化数据
- 双语切换基于 `data-i18n` 属性 + `translations` 对象

---

## 贡献

- 提交新资源建议：[GitHub Issues](https://github.com/ningqi24/astras.cc/issues/new)
- 报死链 / 报毒 / 报违规：[GitHub Issues](https://github.com/ningqi24/astras.cc/issues/new)
- 收录标准：① 站长亲测可访问 ② 有明确来源 ③ 与 AstraEditor / Scratch / 前端工具相关

---

## 许可证

MIT © [ningqi](https://github.com/ningqi24)
