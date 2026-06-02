# CloudSched Sandbox (分散式排程視覺化沙盒)

一個基於 **Next.js 14** 與 **FastAPI** 的高效能 Kubernetes / AWS 資源排程動態監控沙盒。本專案透過 WebSocket 達成前後端極速雙向數據串流。

---

##  技術棧 (Tech Stack)

- **Frontend:** Next.js (App Router), React, Tailwind CSS, TypeScript
- **Backend:** FastAPI (Python), Uvicorn, WebSockets

---

## 專案架構 (Architecture)

```text
📂 DistriViz (根目錄)
├── 📂 frontend           # Next.js 儀表板前端 (Port: 3000)
└── 📂 backend            # FastAPI 模擬引擎後端 (Port: 8000)
```


## 快速開始 (Quick Start)

快速在本機啟動前後端開發環境的最小步驟。

### 先決條件

- 安裝 `Node.js` / `npm`。
- 安裝 `Python 3.10+`。

### 後端（Windows PowerShell）

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
.venv\Scripts\python -m uvicorn app:app --reload --reload-dir .
```

### 後端（Bash / WSL）

```bash
cd backend
python -m venv .venv
source .venv/Scripts/activate
pip install -r requirements.txt
.venv/Scripts/python -m uvicorn app:app --reload --reload-dir .
```

### 前端（另一個終端）

```bash
cd frontend
npm install
npm run dev:frontend
```

### 本機網址

```text
前端面板: http://localhost:3000
後端 API / WebSocket: ws://localhost:8000 或 http://localhost:8000
```

若你希望我直接在本機啟動開發伺服器，或要我把指令改成符合你的偏好（例如使用 `conda`、PowerShell profile、或 WSL 路徑），請告訴我。

