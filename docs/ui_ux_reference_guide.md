# Job Tracker UI/UX Reference Guide

This document outlines the UI/UX architecture, design system tokens, animation specifications, and component structure for the Job Tracker application. It acts as a reference for replicating this aesthetic and architecture in future projects while adhering to **SOLID**, **YAGNI**, **KISS**, and **DRY** principles.

## 1. Core Principles

- **SOLID Principles in React**:
  - **Single Responsibility (SRP)**: Each component does one thing. For example, `StatusBadgeDropdown` handles only status updates; `FilterBar` handles only search state.
  - **Open/Closed (OCP)**: Components like `Badge` use a strategy pattern for types (`priority`, `status`) to allow new badge types without modifying the core component.
  - **Liskov Substitution & Interface Segregation**: Strict TypeScript interfaces (e.g., `JobItem`, `FilterState`) ensure props are predictable and minimal.
  - **Dependency Inversion**: Shared state (Zustand) acts as an abstraction layer, separating UI components from direct API or LocalStorage logic.
- **KISS (Keep It Simple, Stupid)**: Use native HTML elements with tailored CSS rather than heavy, bloated UI libraries. Example: Using native `<input type="date">` and triggering it via `.showPicker()` for a seamless calendar without importing date-picker libraries.
- **DRY (Don't Repeat Yourself)**: Extract common UI patterns into reusable micro-components (e.g., `.icon-btn` CSS class, `Badge` component).
- **YAGNI (You Aren't Gonna Need It)**: Do not build generalized components until a second use case arises. Avoid premature abstractions.

---

## 2. Design System Tokens (CSS Variables)

The application uses an 8-point grid system and a fluid typographic scale. All tokens are defined in `index.css`.

### Typography
- **Font Family**: 
  - Primary (Sans): `'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
  - Monospace: `'JetBrains Mono', monospace`
- **Font Sizes**:
  - `xs`: 12px (Secondary meta data, compact badges)
  - `sm`: 14px (Table headers, inputs)
  - `base`: 16px (Body text, standard buttons)
  - `lg`: 20px (Section titles)
  - `xl`: 28px (Page headers)
- **Font Weights**:
  - `400` (Regular): Body content
  - `500` (Medium): Secondary labels, table rows
  - `600` (Semi-Bold): Primary actions, component titles
  - `700` (Bold): Section headers, active states

### Spacing & Layout (8-Point Grid)
- **Tokens**: 4px (`--space-1`), 8px (`--space-2`), 12px (`--space-3`), 16px (`--space-4`), 24px (`--space-6`), 32px (`--space-8`), 48px (`--space-12`)
- **Border Radius**: 
  - `sm`: 8px (Buttons, cards, inputs)
  - `md`: 12px (Modals, large panels)
  - `full`: 9999px (Pills, badges, circular avatars)

### Colors (Premium Glassmorphism Palette)
The application leverages deep, low-contrast dark themes mixed with glowing semantic accents.

- **Backgrounds**:
  - `Primary`: `#0a0a0c` (App canvas)
  - `Secondary`: `#121214` (Sidebars, headers)
  - `Elevated / Tertiary`: `#151518` / `#1e1e22` (Cards, dropdowns)
- **Text**:
  - `Primary`: `#f4f4f5` (Zinc-50)
  - `Secondary`: `#a1a1aa` (Zinc-400)
  - `Muted`: `#71717a` (Zinc-500)
- **Semantic Accents** (Backgrounds use 15% opacity, text uses bright base color):
  - **Ready / Neutral**: `#e4e4e7` (White/Gray)
  - **Action / SDE / Applied**: `#3b82f6` (Blue-500)
  - **Cloud / DevOps**: `#38bdf8` (Sky-400)
  - **Interview**: `#c084fc` (Purple-400)
  - **Offer / Success**: `#34d399` (Emerald-400)
  - **Rejected / Error**: `#f87171` (Red-400)
  - **High Priority**: `#fb923c` (Orange-400)

---

## 3. UI/UX Animation & Effects

All animations are hardware-accelerated and adhere to the `--transition-fast` (150ms) and `--transition-normal` (250ms) tokens using a snappy `cubic-bezier(0.16, 1, 0.3, 1)` easing curve.

- **Glassmorphism**: Achieved via `backdrop-filter: blur(16px)` layered over semi-transparent backgrounds (`rgba(21, 21, 24, 0.65)`).
- **Glow Hover Effects** (`.glow-hover`): Interactive elements elevate and emit a soft semantic glow on hover (`box-shadow: 0 0 20px rgba(59, 130, 246, 0.15)`).
- **Micro-Interactions**:
  - `transform: translateY(-4px)` for lifting metric cards.
  - Scale transforms (`scale(0.95)` to `scale(1)`) on dropdown mounting (e.g., `dropdown-fade-in` keyframes).
  - Toast notifications slide up from the bottom (`translate(-50%, 20px)` to `0`).

---

## 4. Iconography library (Lucide-React)

We exclusively use **Lucide-React** for crisp, scalable, stroke-based SVG icons. Icons are strictly sized (typically 12px, 14px, 16px, or 18px) with specific stroke widths (1.5px or 2px).

**Live Valid Icons Used:**
- **Navigation & Layout**: `Menu`, `X`, `ChevronLeft`, `ChevronRight`, `ChevronDown`, `ArrowUp`, `ArrowDown`, `Layers`
- **Actions**: `Search`, `Plus`, `Pencil` (Edit), `Copy` (Clone), `Save`, `Filter`, `Download`, `Upload`, `RotateCcw`, `RefreshCw`, `RefreshCcw`
- **Domain & Tech**: `Code`, `Code2` (SDE), `Cloud` (DevOps), `Globe`, `Building2`, `Zap`
- **Status & Priority**: `Check`, `CheckCircle2`, `AlertCircle`, `XCircle`, `Target`, `Award`
- **Communication & Objects**: `Mail`, `Send`, `MessageSquare`, `MessageCircle`, `User`, `Users`, `Briefcase`, `FileText`, `FileSpreadsheet`, `Tag`, `Link`, `ExternalLink`, `MapPin`, `Phone`, `BadgeHelp`, `Archive`, `Bug`, `Lightbulb`, `Sparkles`
- **Theme**: `Sun`, `Moon`, `Settings`

**Usage Pattern**:
```tsx
<IconName size={16} strokeWidth={1.5} style={{ color: 'var(--text-muted)' }} />
```

---

## 5. Component Modularity

For reusability across other apps, break the UI into the following independent layers:

### A. Primitives (Dumb Components)
- `Badge.tsx`: Pure rendering of status/priority pills.
- `Toast.tsx`: Pure visual alert overlay.
- `.icon-btn`: CSS utility class for standard 24x24 square icon buttons.

### B. Composites (Smart UI)
- `StatusBadgeDropdown.tsx`: Combines `Badge` with a Radix/Custom headless popover to update state.
- `EditLinkPopover.tsx`: A positioned portal for inline table editing without disrupting the row layout.

### C. Layout Shell
- `Sidebar.tsx`: Fixed left navigation with mobile drawer states. Uses `100dvh` for mobile URL bar safety.
- `Header.tsx`: Top bar containing branding, global search triggers, and theme toggles.
- `MainWorkspace.tsx`: The fluid scrollable container for the active view.

---

## 6. Premium Standards & Best Practices

1. **Responsive Viewport Height**: Always use `100dvh` instead of `100vh` for full-screen containers to prevent mobile browser URL bars from cutting off the bottom of the app.
2. **Virtualized Rendering**: For tables or lists expected to exceed 50 items, use `@tanstack/react-virtual` to ensure smooth 60fps scrolling and strict memory limits.
3. **Optimized Re-Renders**: Use Zustand for state management outside of the React Tree. Only subscribe to the exact state slices required by a component.
4. **Keyboard Accessibility**: Implement global hotkeys (e.g., `/` for command palette, `j`/`k` for list navigation) for power users.
5. **Fluid Layouts**: Use Flexbox (`flex: 1`, `flex: '1.5 1 0%'`) for table columns rather than fixed pixel widths to ensure graceful resizing across desktop monitors.
