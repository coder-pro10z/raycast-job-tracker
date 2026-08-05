# ⚡ NextApply: Excel-Powered Job Tracker & Intelligence Workspace

![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite_8-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![SheetJS](https://img.shields.io/badge/SheetJS_(XLSX)-00A45A?style=for-the-badge&logo=microsoftexcel&logoColor=white)

An ultra-clean, keyboard-driven job application tracker built to solve the hardest question during an active job hunt: **"What should I apply to next?"** 

Engineered with a visual hierarchy inspired by **Linear**, **Notion**, and **Raycast**, this workspace uses your local Excel workbook (`Jobs-sheet.xlsx`) as the **Single Source of Truth**—zero backend databases, zero signup walls, and total data privacy.

---

## 💎 Key Highlights & Architecture

### 📊 1. Zero Backend & Excel Single Source of Truth
* **Direct Spreadsheet Parsing**: Leverages an abstract `IDataProvider` architecture powered by SheetJS (`xlsx`) to instantly stream all 23 attribute columns from your local spreadsheet.
* **Live Workbook Synchronization**: Hit **Reload** to reflect changes made directly to your Excel spreadsheet on disk, or click **Upload Excel** to switch between custom multi-column workbooks without rebooting the app.

### ⚡ 2. Raycast-Style Command Palette (`Ctrl + K`)
* Never reach for your mouse. Press `Ctrl + K` (or `Cmd + K`) anywhere in the application to summon an instant quick-action dialog.
* Execute system commands (*"Switch to Ready to Apply"*, *"Reload Excel Data"*, *"Toggle Theme"*) or type any company name to jump straight into its details drawer.

### 🚀 3. Locked 60 FPS Virtualized Grid
* **High-Performance Architecture**: Powered by `@tanstack/react-virtual`, the workspace renders only visible viewport rows, effortlessly handling 500+ (or 5,000+) job opportunities at a consistent 60 FPS.
* **Multi-Attribute Filter Engine**: Slice and dice pipeline leads with instantaneous filter pills across Priority (`High`, `Medium`, `Low`), Work Mode (`Hybrid`, `Remote`, `Onsite`), Application Statuses, and full-text input search.

### 📝 4. Smart JD & Application Link Pasting
* **Inline Table Editor**: Click `+ Add JD / Link` directly within any row to paste a URL or full text and press **Enter**.
* **Smart Content Detection**: 
  * Pasted web URLs automatically render as blue **🔗 Apply Link** badges that open the application portal in a new tab.
  * Pasted requirements or paragraph text render as **📄 JD Saved** tags that open the full document inside the side drawer.
* **Dedicated Details Editor**: A slide-over right panel categorizing all 23 spreadsheet fields into 7 organized sections (Overview, Direct Links, HR contacts, Referral pipelines, Timelines, and editable Notes & JDs).

### 🎨 5. Linear-Inspired Aesthetics & Vim Navigation
* Built upon custom vanilla CSS tokens featuring neutral zinc dark palettes (`#09090b`), slate light themes, glassmorphism card overlays, custom scrollbars, and micro-animations.
* **Vim Navigation**: Use `j` and `k` to step down and up across virtualized rows in real-time, hit `/` to jump to global search, and `Esc` to instantly dismiss open panels.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action | Context |
| :--- | :--- | :--- |
| `Ctrl + K` / `Cmd + K` | Toggle Raycast Command Palette | Global |
| `j` / `k` | Step Next / Previous row & refresh slide-over drawer | Table Navigation |
| `/` | Open Quick Search & Command Focus | Global |
| `Enter` | Save Inline JD / Link Edit | Table Cell Editor |
| `Esc` | Close Active Modal / Details Drawer | Overlays |

---

## 🛠️ Tech Stack

* **Core UI**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) (Strict `verbatimModuleSyntax`)
* **Build Engine**: [Vite 8](https://vitejs.dev/)
* **Data Layer**: [SheetJS (xlsx)](https://docs.sheetjs.com/) for buffer-level spreadsheet normalization
* **Virtualization**: [@tanstack/react-virtual](https://tanstack.com/virtual/latest)
* **Icons**: [Lucide React](https://lucide.dev/)
* **Styling**: Pure Vanilla CSS Custom Properties & Token Design System

---

## 🏁 Getting Started Locally

### 1. Clone & Install Dependencies
```bash
git clone <your-repo-url>
cd Job-Tracker
npm install
```

### 2. Launch the Development Workspace
```bash
npm run dev
```
Open your browser to **`http://localhost:5173/`**. By default, the application will load the bundled `Jobs-sheet.xlsx` sample data containing 430 curated opportunity leads.

### 3. Build for Production
To verify zero TypeScript errors and build the optimized static distribution bundle:
```bash
npm run build
```
The generated static assets in `dist/` can be hosted anywhere (GitHub Pages, Vercel, Netlify) while keeping local Excel parsing intact!

---

## 📋 Supported Excel Data Schema (23 Columns)

The `ExcelAdapter` service automatically sanitizes and normalizes the following default header columns from `.xlsx` workbooks:

| Column Name | Normalized Function | Example Data |
| :--- | :--- | :--- |
| `Company Name` | Primary Identifier & Search Title | *Microsoft, Google, Zeta* |
| `Target Role` | Position Description | *.NET Full Stack Developer (3 YoE)* |
| `Location` & `Work Mode` | Merged Smart Display Column | *Noida (Hybrid)*, *Delhi NCR ops (Remote)* |
| `JD` / `Job Application Link` | Interactive Link / Text Editor | *https://careers.company.com...* |
| `Priority` | Semantic Pill Taging | *High*, *Medium*, *Low* |
| `Application Status` | Pipeline Tracker Badge | *Not Started*, *Applied*, *Interviewing*, *Offered* |
| `Tech Stack` | Extracted Monospace Keyword Badges | *React, C#, Azure, SQL, Kubernetes* |
| `Referral Needed` | Urgent Action Identifier | *Yes / No* |
| `HR/Recruiter Contacts` | Email & LinkedIn Direct Launchers | *Recruiter Name, email@domain, LinkedIn URL* |

---
*Built with precision and high-performance design principles to supercharge your hiring pipeline.*
