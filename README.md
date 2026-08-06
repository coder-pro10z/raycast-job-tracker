# ⚡ NextApply: Excel-Powered Job Tracker & Intelligence Workspace

![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite_8-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![SheetJS](https://img.shields.io/badge/SheetJS_(XLSX)-00A45A?style=for-the-badge&logo=microsoftexcel&logoColor=white)
![Responsive](https://img.shields.io/badge/Mobile_Responsive-10B981?style=for-the-badge&logo=css3&logoColor=white)

An ultra-clean, keyboard-driven job application tracker built to solve the hardest question during an active job hunt: **"What should I apply to next?"** 

Engineered with a visual hierarchy inspired by **Linear**, **Notion**, and **Raycast**, this workspace uses your local Excel workbooks (`Master_Job_Tracker_Verified.xlsx` & `Master_Job_Tracker.xlsx`) as the **Single Source of Truth**—zero backend databases, zero signup walls, and total data privacy.

---

## 💎 Key Highlights & Architecture

### 📊 1. Zero Backend & Excel Single Source of Truth
* **Direct Spreadsheet Parsing**: Leverages an abstract architecture powered by SheetJS (`xlsx`) to instantly stream all attribute columns from your local spreadsheet.
* **Live Workbook Synchronization**: Hit **Reload** to reflect changes made directly to your Excel spreadsheet on disk, or click **Upload Excel** to switch between custom multi-column workbooks without rebooting the app.
* **Export Backups**: Click the **Export** button in the header to instantly back up your live workspace state back into a properly formatted `.xlsx` workbook.
* **Smart Import & Auto-Deduplication**: Download a clean **Sample Template Workbook** directly from the UI. When uploading new spreadsheets, an intelligent deduplication engine evaluates `CompanyName|TargetRole` signatures to merge new opportunities cleanly.

### ✉️ 2. The Cold Outreach Workspace & Pitch Studio
* **100+ Auto-Generated Templates**: Navigate to the **Cold Templates** tab in the sidebar to access a massive library of 5 Cold Email and 5 LinkedIn Connection templates for 10 distinct software engineering profiles (SDE, DevOps, Full Stack .NET, Cloud Engineer, etc.).
* **Global Professional Settings Modal**: Configure your identity once (Full Name, Experience, Key Strengths, Contact Links) via the top-right Settings gear. These details automatically save to your browser's local storage and dynamically inject into every template!
* **Domain-Aware Message Generator**: Switch to the **Outreach Pitch Studio** tab inside any individual job details drawer to dynamically synthesize highly personalized recruiter pitches based on that specific role.
* **Dynamic Signatures**: All templates now automatically generate and append a clean, context-aware email signature built from your Application Settings.

### 🌐 3. Multi-Domain Intelligence & Strict Track Segregation
* **Domain Badge Identifiers**: Easily differentiate roles at a glance with minimalist icon tags: **`</>`** for Software Engineering (SDE) roles and the **`Cloud`** icon for DevOps/Infrastructure tracks.
* **Track Filters**: Toggle between **SDE Track**, **Cloud/DevOps Track**, and **Dual Domain** opportunities to maintain hyper-focused application sessions.

### 🎨 4. Premium Workspace UI (Linear-Inspired)
* **Auto-Collapsing Sidebar**: Maximize your screen real estate! When you scroll down your Job Table, the sidebar intelligently senses the movement and auto-collapses into a sleek, icon-only rail.
* **Glassmorphism Status Menus**: The interactive status dropdown badge utilizes a beautiful frosted glass backdrop filter (`backdrop-filter: blur`) to dynamically diffuse the table rows beneath it, preventing any text overlap or bleeding.
* **Flawless State Persistence**: Your Active Track, View Mode, Theme (Dark/Light), Sidebar Width, and Profile settings are synchronized flawlessly to `localStorage` via native React `useEffect` hooks, guaranteeing they persist securely across every tab reload.

### ⚡ 5. High-Performance Virtualized Grid & Keyboard Commands
* **Locked 60 FPS**: Powered by `@tanstack/react-virtual`, the workspace renders only visible viewport rows, effortlessly handling 5,000+ job leads smoothly.
* **Raycast-Style Command Palette (`Ctrl + K`)**: Press `Ctrl + K` (or `Cmd + K`) anywhere to summon an instant quick-action dialog to execute system commands or jump straight to a company.
* **Smart JD Pasting**: Click `+ Add JD / Link` directly within any row to paste a URL or full requirements text. Web URLs instantly render as blue **🔗 Apply Link** badges, while raw text renders as **📄 JD Saved** tags.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action | Context |
| :--- | :--- | :--- |
| `Ctrl + K` / `Cmd + K` | Toggle Raycast Command Palette | Global |
| `j` / `k` | Step Next / Previous row & refresh slide-over drawer | Table Navigation |
| `/` | Open Quick Search (*"Search Companies..."*) | Global |
| `Enter` | Save Inline JD / Link Edit | Table Cell Editor |
| `Esc` | Close Active Modal / Details Drawer | Overlays |

---

## 🛠️ Tech Stack

* **Core UI**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) (Strict `verbatimModuleSyntax`)
* **Build Engine**: [Vite 8](https://vitejs.dev/)
* **Data Layer**: [SheetJS (xlsx)](https://docs.sheetjs.com/) for buffer-level spreadsheet normalization & exporting
* **Virtualization**: [@tanstack/react-virtual](https://tanstack.com/virtual/latest)
* **Icons**: [Lucide React](https://lucide.dev/)
* **Styling**: Pure Vanilla CSS Custom Properties & Token Design System (Dark Zinc `#09090b` / Light Slate)

---

## 🏁 Getting Started Locally & Cloud Hosting

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
Open your browser to **`http://localhost:5173/`**. By default, the application will load the bundled `Master_Job_Tracker_Verified.xlsx` dataset located inside the `public/` folder.

### 3. Build for Production & Vercel Deployment
To verify zero TypeScript errors and build the optimized static distribution bundle:
```bash
npm run build
```
All static assets and Excel datasets located inside `public/` are seamlessly bundled into `dist/`. This allows hassle-free hosting on **Vercel**, **GitHub Pages**, or **Netlify** while preserving full client-side Excel reading capabilities!

---
*Built with precision, high-performance design principles, and developer empathy to supercharge your hiring pipeline.*
