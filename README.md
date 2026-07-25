```markdown
# astras.cc

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 简介 (Introduction)

`astras.cc` 是一个个人导航站与实用工具集合项目。它通过简洁的首页集中展示精选资源（技术文档、设计工具等），并通过 `site.json` 统一管理链接数据；同时还包含了多个独立的小工具页面。

**English:** `astras.cc` is a personal navigation hub and tool collection. It provides a clean front‑end homepage that aggregates useful resources (technical docs, design tools, etc.) through a `site.json` configuration file, along with several standalone utility sub‑applications.

---

## 功能特性 (Features)

- **导航首页** – 一站式展示常用工具、技术文档、设计资源等精选链接。  
  **Navigation Homepage** – Centralized display of curated links to tools, tech references, and design resources.

- **SignGenerator** – 签名/标识生成工具（位于 `/SignGenerator`）。  
  **SignGenerator** – A signature / badge generator (available at `/SignGenerator`).

- **sendemail** – 邮件发送工具页面（位于 `/sendemail`）。  
  **sendemail** – A simple email sending tool page (available at `/sendemail`).

- **中英文双语数据** – `site.json` 中的标题、描述和标签均支持中英文。  
  **Bilingual Resource Data** – `site.json` stores titles, descriptions and tags in both Chinese and English.

- **SEO 支持** – 包含 `sitemap.xml` 站点地图，利于搜索引擎收录。  
  **SEO Ready** – Includes a `sitemap.xml` for better search engine indexing.

---

## 项目结构 (Project Structure)

```

astras.cc/
├── index.html          # 导航首页 / Main navigation page
├── site.json           # 资源链接配置（双语） / Resource configuration (bilingual)
├── sitemap.xml         # 站点地图 / Sitemap
├── CNAME               # 自定义域名（astras.cc）/ Custom domain (astras.cc)
├── favicon.ico         # 网站图标 / Site icon
├── SignGenerator/      # 签名生成工具 / Signature generator tool
│   ├── index.html
│   ├── assets/
│   └── fonts/
├── sendemail/          # 邮件发送工具 / Email tool page
│   └── index.html
├── images/             # 图片资源 / Image assets
└── LICENSE             # MIT 许可证 / MIT License

```

---

## 技术栈 (Tech Stack)

- 纯前端静态页面（HTML / CSS / JavaScript）  
  **Pure static pages (HTML / CSS / JavaScript)**

- 无需后端，可部署在任何静态托管服务上  
  **No back‑end dependencies – can be hosted anywhere**

---

## 本地运行 (Run Locally)

```bash
# 克隆仓库 / Clone the repository
git clone https://github.com/ningqi24/astras.cc.git

# 进入项目目录 / Enter the project directory
cd astras.cc

# 使用任意静态服务器，例如： / Use any static server, e.g.:
python3 -m http.server 8080
```

然后在浏览器中访问 http://localhost:8080。
Then open http://localhost:8080 in your browser.

---

自定义导航链接 (Customize Navigation Links)

编辑 site.json，按以下格式添加或修改资源：
Edit site.json and follow this format:

```json
{
  "name": "资源名称",
  "name_en": "Resource Name",
  "subtitle": "subtitle.domain",
  "url": "https://example.com",
  "author": "作者",
  "author_url": "https://author.com",
  "tags": ["标签1", "标签2"],
  "description": "中文描述",
  "description_en": "English description"
}
```

所有字段均支持中英文，首页可根据用户偏好展示对应语言版本。
All fields support both languages – the homepage can display either version based on user preference.

---

部署 (Deployment)

可轻松部署到 GitHub Pages、Netlify、Vercel 或任何静态托管服务。CNAME 文件已配置为 astras.cc。
Easily deploy to GitHub Pages, Netlify, Vercel, or any static hosting service. The CNAME file is already set for astras.cc.

---

贡献 (Contributing)

欢迎提交 Issue 和 Pull Request。
Issues and pull requests are welcome.

---

许可证 (License)

MIT © ningqi