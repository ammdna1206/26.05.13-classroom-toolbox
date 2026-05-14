# 🔄 generate-docs 工作流指南

本專案包含一個名為 `generate-docs` 的工作流，用於自動化分析專案文件並更新教學說明 (README.md)。

## 任務目標
1. **自動分析**：讀取各子專案目錄下的 `index.html` 獲取最新標題。
2. **優化文字**：以具備美感的繁體中文生成結構化的教學說明。
3. **保持更新**：確保 README.md 內容與專案結構同步。

## 如何執行
您可以透過 Node.js 執行此工作流：

```bash
node generate-docs.js
```

## 工作流邏輯
- **掃描目錄**：遍歷 `countdown-timer`, `quote-generator`, `marquee-board`, `mood-checkin`。
- **提取資訊**：從 HTML 標籤中提取 `<title>`。
- **模板生成**：將資訊填入高品質的 Markdown 模板中。

## 產出檔案
- [README.md](./README.md)：主要的教學說明文件。

---
*此工作流旨在保持專案文件的專業性與一致性。*
