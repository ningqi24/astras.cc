# astras.cc

> 个人精选工具导航站 · 57+ 亲测可用资源 · 人工筛选 · 每季度复核

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Site](https://img.shields.io/badge/site-astras.cc-66ccff.svg)](https://astras.cc/)
[![Status](https://img.shields.io/badge/status-live-brightgreen.svg)](https://astras.cc/)

`astras.cc` 是由 [@ningqi24](https://github.com/ningqi24) 个人维护的聚合导航站。收录 AstraEditor、Scratch 衍生项目（OS / UI / 编辑器）、Minecraft 工具与团队、前端工具、聊天服务、小游戏与个人作品等 57+ 条资源。每条均附「亲测时间徽章 + 双语主观点评 + GitHub 仓库链接」，每季度复核，不靠机器采集。

---

## 项目特性

- **人工精选** — 每个链接均由站长亲自访问验证，附 `verified_date` + `note`/`note_en` 双语手写点评
- **状态徽章** — 90 天内 ✅ / 91–180 天 ⚠️ 待复核 / 超 180 天 🔴 长期未复核，状态自动降级
- **两级分类** — 大分类（个人 / 工具 / Scratch / 聊天 / 游戏 / 创意 / MC）下再细分中分类，如 Scratch 分「作品」与「编辑器」，MC 分「团队」与「工具」
- **提交网站自动入库** — 站内「提交网站」表单弹窗生成 Issue，站长评论 `/confirm` 后由 GitHub Actions 自动校验并合入 `site.json`、同步部署、回帖关闭 Issue，全程零手动改代码
- **外链安全** — 所有第三方外链通过 `/go/?u=` 中转页跳转，含白名单校验、风险提示、死链反馈入口
- **GitHub 仓库按钮** — 有开源仓库的站点在详情弹窗展示仓库链接（`github` 字段），无仓库自动隐藏
- **法律合规** — 独立 `/disclaimer/` 免责声明页 + `rel="noopener noreferrer nofollow"` 防权值外流
- **SEO 完整** — canonical / meta description / Open Graph / Twitter Card / Schema.org `ItemList` 富摘要 / noscript 兜底
- **双语切换** — 全站中英文（含卡片 note、footer、Hero slogan）
- **主题切换** — 日 / 夜间模式 + 可自定义主题色（调色盘选择）
- **三视图** — 列表视图 / 网格视图 / 横向滚动，可切换
- **零依赖** — 纯 HTML / CSS / JS，无构建步骤，直接静态托管

---

## 项目结构

```
astras.cc/
├── index.html                  # 导航首页（Hero + 筛选栏 + 卡片列表 + 提交表单弹窗 + Footer）
├── site.json                   # 资源数据（57+ 条，15 字段，含 verified_date / note / note_en / github / group）
├── sitemap.xml                 # 站点地图
├── CNAME                       # 自定义域名 astras.cc
├── favicon.ico
├── robots.txt                  # 爬虫规则
│
├── go/                         # 外链中转页（白名单校验 + 风险提示 + 死链反馈）
│   └── index.html
├── disclaimer/                 # 免责声明页（法律兜底）
│   └── index.html
├── about/                      # 关于本站（站长介绍 + 联系 + 反馈入口）
│   └── index.html
│
├── scripts/
│   ├── sync.js                 # 数据同步：读取 site.json 自动生成 index.html 数据与 noscript 兜底
│   ├── import-issue.js         # Issue 自动入库：解析 /confirm 确认的 Issue，校验并合入 site.json
│   └── add_site.py             # （备用）命令行添加站点脚本
├── .github/
│   └── workflows/
│       └── import-issue.yml    # Issue 自动入库工作流（issue_comment 触发）
│
├── signgenerator/              # 高速编号牌生成器
├── sendemail/                  # 域名邮件发送工具子站
├── game/shas/                  # 鲨鲨幸存者小游戏
└── images/                     # 图片资源
```

---

## 资源数据格式

数据全部集中在 `site.json`（根对象为 `{"buttons": [...]}`），编辑后运行 `node scripts/sync.js` 即可自动同步到页面。每条字段：

```jsonc
{
  "name": "AstraEditor 官网(.top)",       // 站点名称
  "name_en": "AstraEditor Official(.top)", // 英文名称
  "subtitle": "editors.astras.top",        // 副标题（域名 / 一句话）
  "url": "https://editors.astras.top/",    // 站点地址
  "author": "AstraTeam",                   // 作者 / 团队
  "author_url": "https://github.com/AstraEditor", // 作者主页（可空）
  "tags": ["Scratch", "编辑器"],           // 标签
  "description": "中文描述……",            // 中文简介
  "description_en": "English description...", // 英文简介
  "category": "scratch-editor",            // 中分类（见下表）
  "group": "scratch",                      // 大分类（见下表）
  "github": "https://github.com/...",      // 开源仓库链接（可空，空则不显示仓库按钮）
  "verified_date": "2026-07-31",           // 亲测日期，YYYY-MM-DD
  "note": "≤30 字主观点评",                // 中文点评
  "note_en": "Short English note"          // 英文点评
}
```

**两级分类体系**（`group` 大分类 → `category` 中分类）：

| 大分类 group | 中分类 category |
|---|---|
| `personal` 个人 | personal |
| `tool` 工具 | tool |
| `scratch` Scratch | scratch（作品）、scratch-editor（编辑器） |
| `chat` 聊天 | chat |
| `game` 游戏 | game |
| `creative` 创意 | creative |
| `mc` Minecraft | mc-team（团队）、mc-tool（工具） |

**状态徽章自动降级规则**：

| `verified_date` 距今 | 徽章 | 含义 |
|---|---|---|
| ≤ 90 天 | ✅ `2026-07` | 亲测可用 |
| 91–180 天 | ⚠️ `待复核` | 已过期，待复核 |
| > 180 天 | 🔴 `长期未复核` | 需重新验证 |
| 无日期 | `未测` | 未亲测 |

---

## 添加新站点：网页提交（推荐）

> 站长与访客均可通过浏览器提交，无需终端、无需手改代码：

1. 打开 [astras.cc](https://astras.cc/) → 点击「提交网站」按钮
2. 在表单弹窗中填写站点信息（名称、网址、作者、简介、分类、标签、GitHub 仓库等），可点「翻译」按钮一键用必应生成中英文对照，分类支持自定义输入
3. 提交后自动创建一条 GitHub Issue，内容为标准 `site.json` 格式 JSON + 字段核对表
4. 站长在 Issue 下评论 `/confirm`（或 `/ok`），GitHub Actions 自动完成：
   - 校验评论者权限（仅仓库拥有者 / 协作者有效）
   - 提取 JSON → 白名单过滤字段 → 校验必填 / URL 格式 / 分类白名单 / 长度 / 查重
   - 自动补充 `verified_date`（UTC+8 当日）与 `group` 字段，写入 `site.json`
   - 运行 `sync.js` 同步页面 → 提交推送 → 回帖结果并关闭 Issue

> 提交 ≠ 立即入库：访客提交只生成 Issue，只有站长确认后才合入，防止恶意刷库；非法数据会被工作流自动拒绝并在 Issue 中回帖原因。

---

## 添加新站点：手动编辑（备用）

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

GitHub Pages + CNAME = `astras.cc`，纯静态无构建。直接 `git push` 到 `main` 即可生效（含「提交网站」Issue 自动入库推送的部署）。

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
- CSS 变量系统（`--accent-color` / `--radius-card` / `--shadow-hover` 等）+ 玻璃拟态（`backdrop-filter: blur`）
- 日 / 夜间模式 + 自定义主题色（调色盘）
- Schema.org JSON-LD 结构化数据
- 双语切换基于 `data-i18n` 属性 + `translations` 对象
- 提交自动入库：GitHub Issues + GitHub Actions（`issue_comment` 触发 / `contains` 权限校验 / Node 脚本合库）

---

## 贡献

- 提交新资源建议：点击站内「提交网站」按钮，按 `site.json` 标准字段填写后自动生成 Issue；站长确认后自动入库；亦可直接 [GitHub Issues](https://github.com/ningqi24/astras.cc/issues/new)
- 报死链 / 报毒 / 报违规：[GitHub Issues](https://github.com/ningqi24/astras.cc/issues/new)
- 收录标准：① 站长亲测可访问 ② 有明确来源 ③ 与 AstraEditor / Scratch / Minecraft / 前端工具相关

---

## 许可证

MIT © [ningqi](https://github.com/ningqi24)
