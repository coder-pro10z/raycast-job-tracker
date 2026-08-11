# Design System Documentation

## Theme Architecture

The application utilizes a robust theming architecture based on CSS custom properties (variables). These properties are defined on the `:root`, `.dark`, and `.light` classes. 
Theme switching is accomplished by toggling these classes on the `document.documentElement`.
- **Default Theme**: Dark Mode.
- **Persistence**: The user's theme preference is stored in `localStorage` under the key `job_tracker_theme`.

## Color Tokens

| Dark Mode | Light Mode | Token | Purpose |
|-----------|------------|-------|---------|
| `#09090b` | `#ffffff` | `--bg-primary` | Page background |
| `#121215` | `#f8fafc` | `--bg-secondary` | Header, drawer, cards |
| `#18181b` | `#f1f5f9` | `--bg-tertiary` | Inputs, table rows |
| `#27272a` | `#e2e8f0` | `--bg-elevated` | Popovers, dropdowns |
| `rgba(18,18,21,0.85)` | `rgba(255,255,255,0.85)` | `--bg-glass` | Glassmorphic overlays |
| `rgba(24,24,27,0.65)` | `rgba(248,250,252,0.75)` | `--bg-glass-card` | Frosted glass cards |
| `rgba(255,255,255,0.08)` | `rgba(0,0,0,0.08)` | `--border-color` | General borders |
| `rgba(99,102,241,0.6)` | `rgba(99,102,241,0.6)` | `--border-focus` | Focus rings, active states |
| `#f4f4f5` | `#0f172a` | `--text-primary` | Body text |
| `#a1a1aa` | `#475569` | `--text-secondary` | Subtitles, labels |
| `#71717a` | `#94a3b8` | `--text-muted` | Placeholders, captions |
| `#818cf8` | `#6366f1` | `--text-accent` | Links, highlights, icons |

## Status Color Tokens

Application statuses are color-coded for quick visual identification (Background / Text):
- **Not Started / Ready**: Indigo
- **Applied**: Blue
- **Interviewing**: Purple
- **Offered**: Green
- **Rejected**: Red

## Priority Color Tokens

Job priorities utilize distinct colors to indicate urgency/importance:
- **High**: Orange
- **Medium**: Yellow
- **Low**: Gray

## Spacing Scale

The design system is built on a strict 8-point grid spacing scale:
- `--space-1`: 4px
- `--space-2`: 8px
- `--space-3`: 12px
- `--space-4`: 16px
- `--space-5`: 20px
- `--space-6`: 24px
- `--space-8`: 32px
- `--space-10`: 40px
- `--space-12`: 48px
- `--space-16`: 64px

## Border Radius Tokens

Standardized radii for rounded corners across UI elements:
- `--radius-xs`: 6px
- `--radius-sm`: 8px
- `--radius-md`: 12px
- `--radius-lg`: 16px
- `--radius-xl`: 20px
- `--radius-full`: 9999px (Pill/Circle)

## Shadow Tokens

Elevations and depth are represented by the following shadows:
- `--shadow-sm`: `0 1px 2px 0 rgba(0, 0, 0, 0.05)`
- `--shadow-md`: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`
- `--shadow-lg`: `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)`
- `--shadow-xl`: `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)`
- `--shadow-glow`: `0 0 15px rgba(99, 102, 241, 0.5)`

## Typography

Typography is clean, modern, and purposeful, loaded via Google Fonts:
- **Sans-serif (Primary)**: `Inter` — Used for body, headers, and UI elements.
- **Monospace (Code)**: `JetBrains Mono` — Used for code snippets, IDs, and tabular data.
- **Serif (Display)**: `Source Serif 4` — Used for specific display headings or editorial content.

## Glassmorphism Pattern

Glassmorphism provides a premium, modern feel.
- **When to use**: Portal overlays, sticky headers, dropdown menus (e.g., Recency filter dropdown).
- **Implementation**: Combine `--bg-glass-card` with `backdrop-filter: blur(12px)` and `-webkit-backdrop-filter: blur(12px)` for Safari support.

## Key CSS Classes

- `.icon-btn` — A 24×24 transparent icon button with a distinct hover state.
- `.leads-menu-item` — A full-width button featuring a gradient hover shimmer effect.
- `.glow-hover` — Applies a glow effect on hover using the `--shadow-glow` token.
- `.glass-panel` — A container applying the standard glassmorphic styling.
- `.dark` / `.light` — Root theme context classes.
- Responsive Utilities: `.mobile-px`, `.mobile-only`, `.desktop-only`, `.hide-on-mobile`.

## Transition Tokens

Consistent animations and state changes use standard transition tokens:
- `--transition-fast`: `150ms cubic-bezier(0.16, 1, 0.3, 1)`
- `--transition-normal`: `250ms cubic-bezier(0.16, 1, 0.3, 1)`
- `--transition-slow`: `400ms cubic-bezier(0.16, 1, 0.3, 1)`

## Gradient Patterns

Different sections utilize specific gradients to establish visual hierarchy and context:
- **Persona Headers**: Uses vibrant, identity-focused gradients (e.g., `linear-gradient(135deg, #818cf8 0%, #c084fc 100%)`).
- **Job Search Header**: Uses subtle, professional gradients designed to frame content without distracting from data.
