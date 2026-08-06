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
* **Smart Import & Auto-Deduplication**: Download a clean **Sample Template Workbook** directly from the UI. When uploading new spreadsheets, an intelligent deduplication engine evaluates `CompanyName|TargetRole` signatures to merge new opportunities cleanly without duplicating existing entries.

### ✉️ 2. Cold Outreach & Pitch Studio
* **Domain-Aware Message Generator**: Switch to the **Outreach Pitch Studio** tab inside any job details drawer to dynamically synthesize highly personalized recruiter pitches in real time!
* **Persistent Candidate Profile**: Configure your professional profile once (Years of Experience, Key Technical Strengths, Portfolio URL); settings automatically save to browser `localStorage` and adapt across every job listing.
* **Four Multi-Channel Templates**:
  1. **LinkedIn Connection Note (&lt;300 chars)**: Ultra-concise introduction featuring a real-time character limit safeguard that turns red if edits exceed LinkedIn's invitation cap.
  2. **LinkedIn InMail / Direct Message**: Engaging paragraph emphasizing practical problem-solving alignment and immediate application readiness.
  3. **Cold Email to Hiring Manager**: Complete package featuring an auto-generated Subject Line (`Application & Intro: [Role] ([YoE] in [Tech Stack]) — [Name]`) and structured competency bullet points.
  4. **Peer Referral Request**: Respectful note directed to fellow software or DevOps engineers inquiring about internal team culture and an employee referral link.
* **One-Click Execution**: Instantly copy generated pitches to clipboard with visual confirmation or click **Launch Email App** (`mailto:` support) to open Gmail or Outlook with pre-filled subjects and body payloads.

### 🌐 3. Multi-Domain Intelligence & Strict Track Segregation
* **Domain Badge Identifiers**: Easily differentiate roles at a glance with minimalist icon tags: **`</>`** for Software Engineering (SDE) roles and the **`Cloud`** icon for DevOps/Infrastructure tracks.
* **Track Filters**: Toggle between **SDE Track**, **Cloud/DevOps Track**, and **Dual Domain** opportunities to maintain hyper-focused application sessions.

### ⚡ 4. Raycast-Style Command Palette (`Ctrl + K`)
* Never reach for your mouse. Press `Ctrl + K` (or `Cmd + K`) anywhere in the application to summon an instant quick-action dialog.
* Execute system commands (*"Switch to Ready to Apply"*, *"Reload Excel Data"*, *"Toggle Theme"*) or type any company name to jump straight into its details drawer.

### 🚀 5. Locked 60 FPS Virtualized Grid & Edge-to-Edge Design
* **High-Performance Architecture**: Powered by `@tanstack/react-virtual`, the workspace renders only visible viewport rows, effortlessly handling 5,000+ job leads at a consistent 60 FPS.
* **Edge-to-Edge Horizontal Table**: Removes side padding restrictions to utilize 100% of available monitor horizontal real estate.
* **Default Priority Sorting & Session Memory**: Automatically opens sorted by **Priority Descending** (`High > Medium > Low`). Your active domain track, view mode section, and custom sort choices automatically synchronize to browser `localStorage` across reloads.
* **Full Phone Responsiveness**: Features mobile hamburger navigation with an off-canvas slide-out menu and adaptive flex-wrapping for filter pills on smaller screens.

### 📝 6. Smart JD & Application Link Pasting
* **Inline Table Editor**: Click `+ Add JD / Link` directly within any row to paste a URL or full requirements text and press **Enter**.
* **Smart Content Detection**: 
  * Pasted web URLs automatically render as blue **🔗 Apply Link** badges that open the application portal in a new tab.
  * Pasted requirements or paragraph text render as **📄 JD Saved** tags that open the full document inside the side drawer.

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
* **Data Layer**: [SheetJS (xlsx)](https://docs.sheetjs.com/) for buffer-level spreadsheet normalization & deduplication
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
