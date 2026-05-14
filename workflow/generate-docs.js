/**
 * generate-docs.js
 * 
 * 任務：分析專案結構並更新 README.md
 * 執行方式：node generate-docs.js
 */

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.join(__dirname, '..');
const README_PATH = path.join(PROJECT_ROOT, 'README.md');

// 專案配置
const projects = [
    { dir: 'countdown-timer', icon: '⏱️' },
    { dir: 'quote-generator', icon: '✨' },
    { dir: 'marquee-board', icon: '📢' },
    { dir: 'mood-checkin', icon: '😊' }
];

function analyzeProjects() {
    console.log('🔍 正在分析專案文件...');
    const details = [];

    projects.forEach(p => {
        const indexPath = path.join(PROJECT_ROOT, p.dir, 'index.html');
        if (fs.existsSync(indexPath)) {
            const content = fs.readFileSync(indexPath, 'utf8');
            const titleMatch = content.match(/<title>(.*?)<\/title>/);
            const title = titleMatch ? titleMatch[1] : p.dir;
            details.push({ ...p, title });
            console.log(`✅ 找到專案：${title}`);
        }
    });

    return details;
}

function generateReadme(details) {
    console.log('📝 正在生成 README.md...');
    
    let toolsList = details.map(d => `- **${d.icon} ${d.title}**`).join('\n');

    const content = `# 🎓 數位教室工具箱 (Digital Classroom Toolbox)

> 提升課堂互動，讓教學變得更直觀、更有溫度。

這是一個專為教師設計的輕量化數位工具集合，旨在簡化課堂管理並增強與學生的互動。透過現代化的網頁技術，提供流暢且美觀的使用體驗。

---

## 1. 專案目的

本專案的核心目標是打造一個整合式的平台，包含以下功能：

${toolsList}

---

## 2. 實作步驟

本專案採用**模組化開發**與**原生技術優先**的原則：

### 第一步：基礎架構搭建
- 使用 **HTML5 Semantic Tags** 確保結構清晰。
- 採用 **CSS3 (Vanilla CSS)** 建立設計系統。

### 第二步：互動邏輯開發
- 使用 **Vanilla JavaScript** 處理各工具的核心邏輯。

### 第三步：響應式設計優化
- 實現 **RWD** 確保跨裝置相容性。

---

## 3. 注意事項

- **瀏覽器支援**：建議使用最新版本的 Chrome、Edge 或 Safari。
- **全螢幕體驗**：計時器工具在全螢幕模式下效果最佳。
- **資料儲存**：目前為純前端實現，重新整理後狀態將重置。

---
*數位教室工具箱 | 由 Antigravity 協作開發 | 更新於 ${new Date().toLocaleDateString('zh-TW')}*
`;

    fs.writeFileSync(README_PATH, content);
    console.log('✨ README.md 已成功優化並更新！');
}

// 執行工作流
const projectDetails = analyzeProjects();
generateReadme(projectDetails);
