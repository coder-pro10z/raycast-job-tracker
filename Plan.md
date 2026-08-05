# Project: Job Application Tracker Prototype (Excel-Powered)

## Objective

Build a high-fidelity prototype of a Job Application Tracker that reads data directly from an Excel workbook and presents it in a clean, modern, productivity-focused interface.

This is **NOT** the production application.

Its purpose is to validate the user experience, workflows, layouts, and information architecture before building the full production system.

The UI should closely resemble the intended final product so user feedback can be applied with minimal redesign.

---

# Primary Goal

Transform a large Excel spreadsheet into a clean workspace with minimal visual noise.

The prototype should help answer one question:

> **"What should I apply to next?"**

Everything in the interface should support that goal.

---

# Data Source

The application must treat the Excel file as the single source of truth.

Requirements:

* Read data directly from the Excel workbook.
* Reflect changes after refresh (or via a manual "Reload Data" action).
* Do not use a database.
* Do not create backend persistence.
* Do not modify the Excel file unless explicitly requested.
* Keep the data access layer abstract so Excel can later be replaced by an API or database.

---

# Prototype Scope

The prototype focuses on:

* UI validation
* UX validation
* Navigation
* Information Architecture
* Filtering
* Searching
* Sorting
* Dashboard concepts
* Details panel
* Visual hierarchy

Do **NOT** build production features such as:

* Authentication
* Role-based access
* Notifications
* Email automation
* AI integrations
* Browser extensions
* Background jobs
* Audit logs
* Analytics engine

Stub these features with placeholders if needed.

---

# Expected UI

Design the interface similar to modern productivity applications such as:

* Linear
* Notion
* GitHub Projects
* Raycast
* Vercel Dashboard

The interface must feel clean, minimal, and keyboard-friendly.

---

# Layout

Top Header

* Global Search
* Reload Excel
* Theme Toggle
* Settings (placeholder)

Left Sidebar

* Dashboard
* All Jobs
* Ready to Apply
* Applied
* Interview Pipeline
* Offers
* Rejected
* Archived

Center Workspace

A data table showing only the most important fields:

* Company
* Role
* Location
* Work Mode
* Priority
* Status
* Next Action

Support:

* Sorting
* Filtering
* Multi-select
* Sticky header
* Row hover
* Keyboard navigation

Right Details Panel

Selecting a row opens a details drawer with grouped information:

## Overview

* Company
* Role
* Tech Stack

## Links

* Career Page
* Apply Link

## Application

* Status
* Applied Date
* Response Status
* Interview Stage

## Recruiter

* Name
* Email
* LinkedIn

## Referral

* Needed
* Contact Name
* Role
* Email
* LinkedIn

## Timeline

* Applied Date
* Follow-up Date

## Notes

Free-form notes from Excel.

---

# Design System

Typography

* Primary: Inter
* Secondary: Source Serif 4
* Monospace: JetBrains Mono

Icons

* Lucide Icons only

Spacing

* 8-point grid

Border Radius

* Design tokens (6px, 8px, 12px, 16px, 20px)

Colors

* Neutral-first palette with semantic status colors

No hardcoded design values.

---

# User Experience

The interface should:

* Reduce cognitive load.
* Maximize signal-to-noise ratio.
* Show only actionable information by default.
* Hide secondary information behind the details panel.
* Minimize clicks.
* Be responsive.
* Support keyboard shortcuts where practical.

---

# Functional Requirements

Implement:

* Load Excel data.
* Search across all columns.
* Column filters.
* Sort columns.
* Saved views (client-side only).
* Status badges.
* Priority badges.
* Sticky table header.
* Details drawer.
* Dark mode.
* Responsive layout.
* Manual data reload.

Do not implement editing or persistence.

---

# Non-Functional Requirements

* Responsive.
* Accessible.
* Fast with 5,000+ rows.
* Virtualized table rendering.
* Modular components.
* Reusable UI.
* Clean naming.
* Strong typing (if using TypeScript).
* No duplicated logic.

---

# Engineering Principles

Even though this is a prototype, follow:

* OOP
* SOLID
* DRY
* KISS
* YAGNI
* Composition over inheritance
* Separation of concerns

Keep the codebase modular enough that the Excel data provider can later be replaced without changing the UI.

---

# Deliverables

Produce the project in the following order:

1. Information Architecture
2. Screen Layouts
3. Component Tree
4. Folder Structure
5. Data Models
6. Excel Data Adapter Design
7. UI Components
8. Navigation
9. Filtering & Search Design
10. Prototype Implementation Plan

Only after these artifacts are approved should implementation begin.

---

# Success Criteria

The prototype is successful if:

* It visually resembles the intended production application.
* It reads data directly from Excel.
* It makes browsing hundreds of job opportunities effortless.
* It demonstrates the complete workflow without requiring a database.
* Replacing the Excel adapter with a future API requires minimal changes to the UI and business logic.

Focus on validating the product experience—not on building production infrastructure.
