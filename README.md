# 亲子英语大冒险 🚀

**亲子英语大冒险** - PWA Web App

📱 **在线访问**: [https://zhongguoyin.github.io/qinzi-english/](https://zhongguoyin.github.io/qinzi-english/)

基于《美国家庭万用亲子英文 8000 句》制作的亲子英语学习 App，支持音频播放、章节测试、全文搜索，可安装到手机桌面离线使用。

---

## ✨ 功能特色

- 📚 46 章 + 最常用 50 句，共 377 段 MP3 音频
- 🎧 点句播放 / 整节播放，支持进度条拖拽
- 📝 章节练习（听写 / 翻译 / 选择），自动积分
- 🔍 全文搜索（中英文均可）
- 📱 PWA 可安装到手机桌面，支持离线使用
- 🌙 手机端底部导航，桌面端侧边栏，自适应布局
- 🃏 墙卡相册：第1章配套墙卡图片，支持幻灯片浏览
- ⚙️ 设置面板：语言切换、积分查看、缓存管理

---

## 📋 版本更新历史

### v1.0.3（2026-03-31）
**桌面端布局优化 + 文字校对**
- 修复：桌面端底部"选择章节"抽屉默认显示且无法关闭的问题（CSS `display: flex` 冲突）
- 新增：桌面端侧边栏增加"⚙️ 设置"按钮（绿色），支持打开设置面板
- 修复：全文搜索将所有"丌"替换为"不"（共9处）

---

### v1.0.2（2026-03-30）
**修复欢迎页消失 + 电脑端抽屉问题**
- 修复：`window.onload` 不再自动加载第1章，欢迎页正常显示
- 修复：章节抽屉（`.chapter-drawer`）在桌面端强制隐藏，只在手机端显示
- 修复：欢迎页"开始学习"按钮 → 手机端打开章节抽屉，桌面端直接加载第1章
- 修复：练习按钮在未选章节时打开章节抽屉引导用户选择
- 修复：首页按钮未选章节时只滚动到顶，不强制刷新视图

---

### v1.0.1（2026-03-30）
**修复 Service Worker 缓存策略 + 底部导航 Bug**
- 根本原因：SW 旧版用"缓存优先"策略，更新 HTML 后用户看不到新内容
- 修复：SW 改为"网络优先"（HTML 每次从网络拉取，离线才用缓存）
- SW 安装时立即 `skipWaiting()`，激活后立即 `clients.claim()`
- 更新 `CACHE_VERSION: v1.0.0 → v1.0.2`，强制清除旧缓存
- 修复：首页按钮只 `scrollTop=0`，未还原章节视图 → 改为调用 `restoreChView()`
- 修复：练习按钮在 `curChKey=null` 时弹 alert → 改为自动取第1章
- 修复：`clearSearch()` 清空搜索后也同步还原章节内容视图

---

### v1.0.0（2026-03-30）
**PWA 打包 + GitHub Pages 部署**
- 生成 8 个尺寸 PNG 图标（72~512px）+ SVG
- HTML 加入 PWA meta 标签（manifest / theme-color / apple-mobile-web-app）
- 生成 `manifest.json`（App 名称 / 图标 / standalone 模式 / 主题色）
- 生成 `sw.js`（Service Worker，缓存本地文件，CDN 音频直接走网络）
- SW 支持自动检测新版本并弹出"立即更新"横幅
- HTML 内嵌"添加到桌面"安装横幅（`beforeinstallprompt` 事件）
- 部署到 GitHub Pages：`https://zhongguoyin.github.io/qinzi-english/`

---

### v0.9.0（2026-03-30）
**移动端全面优化**
- 侧边栏手机端隐藏，改用底部固定导航栏（首页 / 章节 / 搜索 / 练习 / 设置）
- 章节列表改为底部抽屉弹出（含搜索过滤）
- 桌面端侧边栏加左右折叠按钮（◀ / ▶）
- 手机端顶部内嵌搜索框（与侧边栏搜索双向同步）
- 新增"设置"弹窗（英文 / 中文显示切换、积分展示、使用技巧）
- 手机端字体加大（`sent-en: 16px`，`sent-zh: 14px`），按钮触摸区域增大
- `safe-area-inset` 适配 iPhone 刘海 / 底部条
- 章节内容末尾加版权页脚

---

### v0.8.0（2026-03-30）
**全面扫描 + 批量修复 + 校对报告**
- 全面扫描发现 68 条问题（重复 24 + 合并句 33 + 截断句 11）
- `apply_all_fixes.py` 批量修复全部 68 条
- `dedup_all.py` 追加清除 36 条附加重复，共修复 104 条错误
- 修复 Chapter 20 sec=6（介绍宠物）被误合并进 sec=5（介绍亲戚）的问题
- 生成 Word 版本对比校对报告（`Word版本对比校对报告.docx`）

---

### v0.7.0（2026-03-30）
**音频 CDN 化 + 修复 CDN 链接编码 Bug**
- 377 个 MP3 上传至 GitHub 仓库 `zhongguoyin/qinzi-audio`
- CDN 直链：`https://cdn.jsdelivr.net/gh/zhongguoyin/qinzi-audio@main/...`
- 修复：`encodeURIPath()` 对 `https://` 开头的链接也做了 URL 编码，导致音频失效
- 修复：对本地路径才做编码，`http/https` 开头直接返回原值

---

### v0.6.0（2026-03-30）
**Word 文档对比批量修复截断句**
- 从 Word 文档（190 个表格，7942 行）提取权威句子
- 对比 JSON 数据找出 74 条截断句，全部自动修复
- 修复花草章节 2 条错误合并句（`flower.` 残留前缀），各拆为完整 2 句
- 修复 dinner 合并句：`"dinner. If you eat too many sweets..."` 拆为 2 条完整句

---

### v0.5.0（2026-03-30）
**章节练习 TTS 朗读 + 数据修复**
- 练习模式 listen 题改用 Web Speech API 朗读当前题目英文句子
- 修复第 1 章音频错位（20 个小节只有 19 个音频，小节 16-20 全部错位）
- 修复第 0 章（最常用 50 句）拆分为爸妈 / 孩子两个小节，各配独立音频
- 修复第 1 章第 16 节"穿鞋子-鞋子种类"6 条词条数据格式

---

### v0.4.0（2026-03-30）
**半句合并 + JS Bug 修复**
- 发现 325 处 PDF 跨行导致一句话被拆成两句的问题，全部合并为完整句子
- 修复 46 处 `[MISSING]` 条目，清理 EN 字段残留标点和行号（66 处）
- 修复 JS 语法 Bug：Python `r"""` 原始字符串里 `Don\\'t` 导致整个 script 崩溃

---

### v0.3.0（2026-03-30）
**音频注入 + 播放功能**
- `inject_audio.py` 扫描本地音频，按章号 / 节号匹配写入 `audio_rel` 字段（358 条匹配）
- 修复 `generate_html_v4.py` 读错 JSON 文件的问题（改读 `chapters_data.json`）
- 修复 `data-audio` 属性里多余的 `replace(/"/g,'&quot;')` 截断路径问题
- 音频播放按钮、进度条、小节整体播放均已可用

---

### v0.2.0（2026-03-29）
**数据构建 + HTML 生成**
- `build_chapters.py` 解析 PDF / Word 数据，构建 `chapters_data.json`（46 章 + 第 0 章）
- `generate_html_v4.py` 生成本地版 HTML（795KB）
- `_gen_cdn.py` 生成 CDN 版 HTML（音频走 jsDelivr CDN）
- 章节练习功能（选择 / 翻译 / 听写三种题型，自动积分统计）
- 全文搜索（中英双语，实时高亮）

---

## 🛠 本地开发

```bash
# 修改数据后重新生成并部署（一键）
python update_all.py

# 或分步执行
python _gen_cdn.py           # 重新生成 HTML
python deploy_to_github_pages.py  # 上传配套文件（sw.js、manifest 等）
python upload_html.py        # 上传主 HTML（大文件专用，带重试）
```

---

## 📁 关键文件

| 文件 | 说明 |
|------|------|
| `_gen_cdn.py` | 主 HTML 生成脚本（读 `chapters_data_cdn.json`）|
| `chapters_data_cdn.json` | CDN 版章节数据（音频用 jsDelivr URL）|
| `gen_pwa_files.py` | 生成 `sw.js` + `manifest.json` + 图标 |
| `upload_html.py` | 上传大 HTML 到 GitHub（带重试）|
| `update_all.py` | 一键生成 + 部署脚本 |

---

*中国印整理制作，仅供学习交流使用。*
