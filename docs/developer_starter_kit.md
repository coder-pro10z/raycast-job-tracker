# Job Tracker Developer Starter Kit

This starter kit contains the core boilerplates, exact dependencies, base CSS tokens, and primitive component code necessary to immediately kickstart a new project using this design system from scratch.

## 1. Project Dependencies (`package.json`)

Install these specific packages to align with the design architecture (using Vite + React + TypeScript):

```json
{
  "dependencies": {
    "react": "^19.2.8",
    "react-dom": "^19.2.8",
    "lucide-react": "^1.28.0",
    "@tanstack/react-query": "^5.101.4",
    "@tanstack/react-virtual": "^3.14.9",
    "zustand": "^4.5.0" // Alternative to Context API
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^6.0.4",
    "typescript": "~6.0.2",
    "vite": "^8.2.0"
  }
}
```

## 2. Core CSS Boilerplate (`index.css`)

Drop this directly into your `index.css` or `global.css` file. This establishes your fluid typographic scale, spacing tokens, and both Dark and Light glassmorphism themes.

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

:root {
  /* Typography */
  --font-sans: 'Inter', -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  
  --text-xs: 12px;
  --text-sm: 14px;
  --text-base: 16px;
  
  --weight-regular: 400;
  --weight-medium: 500;
  --weight-semibold: 600;
  --weight-bold: 700;

  /* 8-Point Grid Spacing Tokens */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;

  /* Border Radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-full: 9999px;

  /* Transitions & Shadows */
  --transition-fast: 150ms cubic-bezier(0.16, 1, 0.3, 1);
  --shadow-glow: 0 0 20px rgba(59, 130, 246, 0.15);
}

/* Dark Mode Palette */
.dark, :root {
  --bg-primary: #0a0a0c;
  --bg-secondary: #121214; 
  --bg-elevated: #1e1e22;
  --bg-hover: rgba(255, 255, 255, 0.06);
  --bg-active: rgba(255, 255, 255, 0.1);
  --bg-glass-card: rgba(21, 21, 24, 0.65);

  --border-color: rgba(255, 255, 255, 0.05);
  --border-focus: rgba(59, 130, 246, 0.6);

  --text-primary: #f4f4f5;
  --text-secondary: #a1a1aa;
  --text-muted: #71717a;
  --text-accent: #3b82f6;
  
  --status-ready-bg: rgba(255, 255, 255, 0.08);
  --status-ready-text: #e4e4e7;
  --status-applied-bg: rgba(59, 130, 246, 0.15);
  --status-applied-text: #60a5fa;
}

/* Light Mode Palette */
.light {
  --bg-primary: #f8fafc;
  --bg-secondary: #ffffff;
  --bg-elevated: #e2e8f0;
  --bg-hover: rgba(0, 0, 0, 0.04);
  --bg-active: rgba(0, 0, 0, 0.08);
  --bg-glass-card: rgba(248, 250, 252, 0.75);

  --border-color: rgba(0, 0, 0, 0.06);
  --border-focus: #3b82f6;

  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-muted: #94a3b8;
  --text-accent: #2563eb;
  
  --status-ready-bg: rgba(0, 0, 0, 0.05);
  --status-ready-text: #475569;
  --status-applied-bg: #dbeafe;
  --status-applied-text: #1d4ed8;
}

/* Base Body Resets */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-sans);
  background-color: var(--bg-primary);
  color: var(--text-primary);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  overflow: hidden;
}

/* Universal Primitive Classes */
.icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: var(--radius-sm);
  background: transparent;
  border: 1px solid transparent;
  color: var(--text-muted);
  cursor: pointer;
  transition: all var(--transition-fast);
}
.icon-btn:hover {
  background: var(--bg-hover);
  border-color: var(--border-color);
  color: var(--text-primary);
}

.glass-panel {
  background: var(--bg-glass-card);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--border-color);
}

.glow-hover {
  transition: all var(--transition-fast);
}
.glow-hover:hover {
  box-shadow: var(--shadow-glow);
  border-color: rgba(99, 102, 241, 0.4);
}
```

## 3. Core React Layout Shell (`App.tsx`)

This establishes a 100% mobile-safe viewport layout without scrolling overflow.

```tsx
import React from 'react';
// import { Sidebar } from './components/Sidebar';
// import { Header } from './components/Header';

export const App: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100vw', height: '100dvh', overflow: 'hidden' }}>
      {/* <Header /> */}
      <div style={{ display: 'flex', width: '100vw', flex: 1, overflow: 'hidden', backgroundColor: 'var(--bg-primary)' }}>
        {/* <Sidebar /> */}
        <main style={{ flex: '1', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
           {/* Your active view goes here */}
        </main>
      </div>
    </div>
  );
};

export default App;
```

## 4. Primitive Components

### `Badge.tsx`
The primary semantic status display pill. Extremely reusable.

```tsx
import React from 'react';

interface BadgeProps {
  type: 'status' | 'priority' | 'tech' | 'default';
  value: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ type, value, size = 'sm' }) => {
  const getStyle = () => {
    const v = value.toLowerCase();
    if (type === 'status') {
      if (v.includes('ready')) return { bg: 'var(--status-ready-bg)', color: 'var(--status-ready-text)' };
      if (v.includes('applied')) return { bg: 'var(--status-applied-bg)', color: 'var(--status-applied-text)' };
    }
    if (type === 'tech') {
      return { bg: 'var(--bg-elevated)', color: 'var(--text-accent)', border: '1px solid var(--border-color)' };
    }
    return { bg: 'var(--bg-elevated)', color: 'var(--text-primary)' };
  };

  const style = getStyle();
  const padding = size === 'sm' ? 'var(--space-1) var(--space-2)' : 'var(--space-1) var(--space-3)';
  const fontSize = size === 'sm' ? 'var(--text-xs)' : 'var(--text-sm)';

  return (
    <span
      className={type === 'tech' ? 'font-mono' : 'font-sans'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding,
        fontSize,
        fontWeight: 'var(--weight-semibold)',
        lineHeight: '1.25',
        borderRadius: 'var(--radius-full)',
        backgroundColor: style.bg,
        color: style.color,
        border: style?.border || 'none',
        whiteSpace: 'nowrap',
        transition: 'all 150ms ease'
      }}
    >
      {value}
    </span>
  );
};
```

### 5. Toast Notification Implementation

Drop this component near the root of your App, wired up to a lightweight state manager (like Zustand or Context) that manages a `toastMessage` string.

```css
/* Add to index.css */
@keyframes toast-slide-up {
  from { opacity: 0; transform: translate(-50%, 20px); }
  to { opacity: 1; transform: translate(-50%, 0); }
}
```

```tsx
import React from 'react';
import { CheckCircle2 } from 'lucide-react';
// import { useStore } from '../store';

export const Toast: React.FC = () => {
  // Replace with your global state hook
  const message = "Success! Action completed."; // const { message } = useStore();

  if (!message) return null;

  return (
    <div 
      className="glass-panel"
      style={{
        position: 'fixed',
        bottom: 'var(--space-6)',
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '10px 16px',
        borderRadius: 'var(--radius-full)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        color: 'var(--text-primary)',
        fontSize: 'var(--text-sm)',
        fontWeight: 500,
        zIndex: 9999,
        animation: 'toast-slide-up var(--transition-fast) ease-out forwards',
        boxShadow: 'var(--shadow-lg)'
      }}
    >
      <CheckCircle2 size={16} style={{ color: 'var(--text-accent)' }} />
      {message}
    </div>
  );
};
```
