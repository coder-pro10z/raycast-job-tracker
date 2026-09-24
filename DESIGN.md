# DESIGN.md — NextApply Visual Design System Reference

This document defines the visual design system, tokens, patterns, and UI component rules that all agents and developers MUST follow when generating or modifying frontend code.

---

## 1. Design Philosophy

- **Premium Dark-First**: The default palette draws from Google Material Dark and Apple HIG dark themes — deep blacks (`#0a0a0c`), subtle glass morphism, and muted text with high-contrast accents.
- **Light Mode Support**: A full `.light` class override palette exists for accessibility. Both themes share identical spacing, radius, and shadow tokens.
- **Icon-Only Controls**: All interactive elements use `lucide-react` SVG vector icons. Raw Unicode emojis are STRICTLY PROHIBITED in buttons, tabs, badges, and action controls (see `RULES.md`).
- **8-Point Grid**: All spacing uses multiples of 4px via `--space-*` tokens.

---

## 2. Color Palette Tokens

### Backgrounds

| Token | Dark Value | Light Value | Usage |
|---|---|---|---|
| `--bg-primary` | `#0a0a0c` | `#f8fafc` | Page / app background |
| `--bg-secondary` | `#121214` | `#ffffff` | Card / panel backgrounds |
| `--bg-tertiary` | `#151518` | `#f1f5f9` | Elevated sections, toolbars |
| `--bg-elevated` | `#1e1e22` | `#e2e8f0` | Floating menus, popovers |
| `--bg-hover` | `rgba(255,255,255,0.06)` | `rgba(0,0,0,0.04)` | Interactive hover states |
| `--bg-active` | `rgba(255,255,255,0.1)` | `rgba(0,0,0,0.08)` | Active / selected states |
| `--bg-glass` | `rgba(18,18,21,0.85)` | `rgba(255,255,255,0.85)` | Glassmorphism overlays |
| `--bg-glass-card` | `rgba(21,21,24,0.65)` | `rgba(248,250,252,0.75)` | Glass cards |

### Text

| Token | Dark Value | Light Value | Usage |
|---|---|---|---|
| `--text-primary` | `#f4f4f5` | `#0f172a` | Headings, primary content |
| `--text-secondary` | `#a1a1aa` | `#475569` | Secondary labels, descriptions |
| `--text-muted` | `#71717a` | `#94a3b8` | Captions, helper text, timestamps |
| `--text-accent` | `var(--primary-500)` | `var(--primary-500)` | Clickable links, active tabs |

### Borders & Focus

| Token | Dark Value | Light Value |
|---|---|---|
| `--border-color` | `rgba(255,255,255,0.05)` | `rgba(0,0,0,0.06)` |
| `--border-focus` | `rgba(59,130,246,0.6)` | `#3b82f6` |

### Primary Accent

| Token | Value | Usage |
|---|---|---|
| `--primary-500` | `#3b82f6` (dark) / `#2563eb` (light) | Primary buttons, active indicators |
| `--primary-bg` | `rgba(59,130,246,0.15)` | Primary background tint |

---

## 3. Semantic Status Colors

Used exclusively for application status badges and priority indicators.

### Application Status

| Status | BG Token | Text Token | Dark Text Color |
|---|---|---|---|
| Not Started | `--status-ready-bg` | `--status-ready-text` | `#e4e4e7` |
| Applied | `--status-applied-bg` | `--status-applied-text` | `#60a5fa` |
| Interviewing | `--status-interview-bg` | `--status-interview-text` | `#c084fc` |
| Offered | `--status-offer-bg` | `--status-offer-text` | `#34d399` |
| Rejected | `--status-rejected-bg` | `--status-rejected-text` | `#f87171` |

### Priority Levels

| Priority | BG Token | Text Token | Dark Text Color |
|---|---|---|---|
| High | `--priority-high-bg` | `--priority-high-text` | `#fb923c` |
| Medium | `--priority-medium-bg` | `--priority-medium-text` | `#facc15` |
| Low | `--priority-low-bg` | `--priority-low-text` | `#9ca3af` |

---

## 4. Brand Integration Tokens

| Brand | Primary | Hover | BG | Border |
|---|---|---|---|---|
| LinkedIn | `--linkedin-primary: #0a66c2` | `--linkedin-hover: #004182` | `--linkedin-bg: rgba(10,102,194,0.15)` | `--linkedin-border: rgba(10,102,194,0.35)` |
| Gmail | `#ea4335` | — | — | — |
| Claude/Anthropic | `#d97706` | — | — | — |
| GitHub/Terminal | `#10b981` / `#6366f1` | — | — | — |

---

## 5. Typography System

### Font Stacks

| Token | Value | Usage |
|---|---|---|
| `--font-sans` | `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif` | All UI text |
| `--font-serif` | `'Source Serif 4', Georgia, serif` | Long-form content (optional) |
| `--font-mono` | `'JetBrains Mono', monospace` | Code, commands, technical values |

### Type Scale

| Token | Size | Usage |
|---|---|---|
| `--text-xs` | `12px` | Micro badges, counter pills, timestamps |
| `--text-sm` | `14px` | Body text, form labels |
| `--text-base` | `16px` | Default body, inputs |
| `--text-lg` | `20px` | Section headings |
| `--text-xl` | `28px` | Page titles |
| `--text-2xl` | `36px` | Hero / dashboard headings |

### Font Weights

| Token | Value | Usage |
|---|---|---|
| `--weight-regular` | `400` | Body text |
| `--weight-medium` | `500` | Secondary labels |
| `--weight-semibold` | `600` | Buttons, nav items |
| `--weight-bold` | `700` | Headings, badges |

### Component Typography Rules

| Element | Size | Weight | Notes |
|---|---|---|---|
| Page/Modal headings | `1.0rem`–`1.125rem` | `700` | — |
| Section subtitles | `0.8125rem`–`0.875rem` | `500`–`600` | `color: var(--text-muted)` |
| Buttons & sidebar nav | `0.8125rem` (13px) | `600` | `font-family: inherit` always |
| Badge pills & counters | `0.6875rem`–`0.75rem` | `600`–`700` | `font-variant-numeric: tabular-nums` |
| Body text | `0.8125rem`–`0.875rem` | `400`–`500` | — |

---

## 6. Spacing & Layout

### 8-Point Grid Tokens

| Token | Value |
|---|---|
| `--space-1` | `4px` |
| `--space-2` | `8px` |
| `--space-3` | `12px` |
| `--space-4` | `16px` |
| `--space-5` | `20px` |
| `--space-6` | `24px` |
| `--space-8` | `32px` |
| `--space-10` | `40px` |
| `--space-12` | `48px` |
| `--space-16` | `64px` |

### Border Radius

| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | `8px` | Buttons, inputs, cards |
| `--radius-md` | `12px` | Modals, panels, larger cards |
| `--radius-full` | `9999px` | Pills, circular badges, avatars |

---

## 7. Shadows & Transitions

### Shadow Tokens

| Token | Value | Usage |
|---|---|---|
| `--shadow-sm` | `0 1px 3px rgba(0,0,0,0.1)` | Subtle card lift |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.1)` | Dropdown menus |
| `--shadow-lg` | `0 10px 15px rgba(0,0,0,0.1)` | Modals, drawers |
| `--shadow-xl` | `0 20px 25px rgba(0,0,0,0.1)` | Floating panels |
| `--shadow-glow` | `0 0 20px rgba(59,130,246,0.15)` | Primary accent glow effect |

### Transition Tokens

| Token | Value | Usage |
|---|---|---|
| `--transition-fast` | `150ms cubic-bezier(0.16,1,0.3,1)` | Hover states, micro-interactions |
| `--transition-normal` | `250ms cubic-bezier(0.16,1,0.3,1)` | Panel slides, fades |

---

## 8. Icon System

- **Library**: `lucide-react` (latest, currently v1.28+)
- **Standard sizes**:
  - Sidebar nav: `size={16}`
  - Inline buttons: `size={14}`–`size={15}`
  - Action buttons: `size={12}`–`size={14}`
  - Hero / empty state: `size={40}`–`size={48}`
- **Color**: Always use CSS variables (`style={{ color: 'var(--text-muted)' }}`), NEVER hardcode hex in icon color props unless it's a brand-specific accent.

### Commonly Used Icons

| Context | Icon | Import |
|---|---|---|
| Search | `<Search />` | `lucide-react` |
| External link | `<ExternalLink />` | `lucide-react` |
| Email/Draft | `<Mail />` | `lucide-react` |
| Status check | `<CheckCircle2 />` | `lucide-react` |
| Copy | `<Copy />` / `<Check />` | `lucide-react` |
| Close | `<X />` | `lucide-react` |
| Settings | `<Settings />` | `lucide-react` |
| AI/Magic | `<Sparkles />` | `lucide-react` |
| Company | `<Building2 />` | `lucide-react` |
| Terminal | `<Terminal />` | `lucide-react` |
| Refresh | `<RefreshCw />` | `lucide-react` |
| Trash | `<Trash2 />` | `lucide-react` |
| Minimize | `<Minus />` | `lucide-react` |
| Maximize | `<Maximize2 />` / `<Minimize2 />` | `lucide-react` |

---

## 9. Component Patterns

### Inline Styles vs CSS Classes

This project uses **inline styles** (`style={{ ... }}`) for component-scoped styling with CSS custom property references. Global reusable patterns (`.sidebar-nav-btn`, `.glow-hover`, `.icon-btn`) are defined in `index.css`.

### Button Pattern

```tsx
<button
  style={{
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 10px',
    fontSize: '0.75rem',
    fontWeight: 600,
    borderRadius: 'var(--radius-sm)',
    backgroundColor: 'rgba(59, 130, 246, 0.12)',
    color: '#3b82f6',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 120ms ease',
  }}
  className="glow-hover"
>
  <ExternalLink size={12} />
  <span>Open Draft</span>
</button>
```

### Badge Pattern

```tsx
<span style={{
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  padding: '2px 8px',
  borderRadius: 'var(--radius-full)',
  fontSize: '0.6875rem',
  fontWeight: 700,
  fontVariantNumeric: 'tabular-nums',
  backgroundColor: 'var(--status-applied-bg)',
  color: 'var(--status-applied-text)',
}}>
  Applied
</span>
```

### Card / Panel Pattern

```tsx
<div style={{
  backgroundColor: 'var(--bg-secondary)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-md)',
  padding: 'var(--space-4)',
  boxShadow: 'var(--shadow-sm)',
}}>
  {/* Card content */}
</div>
```

---

## 10. Mandatory Compliance Checklist

Before submitting any UI code, verify:

- [ ] All colors reference CSS custom properties, never hardcoded hex (except brand accents)
- [ ] All interactive controls use `lucide-react` icons, zero raw Unicode emojis
- [ ] All buttons have `font-family: inherit` (inherited from global rule)
- [ ] Numeric counters use `font-variant-numeric: tabular-nums`
- [ ] Spacing uses `--space-*` tokens or multiples of 4px
- [ ] Border radius uses `--radius-sm`, `--radius-md`, or `--radius-full`
- [ ] Dark mode AND light mode render correctly
- [ ] Build passes: `cd frontend && npm run build` (0 TypeScript errors)
