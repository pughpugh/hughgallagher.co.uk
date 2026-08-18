# Developer & Agent Guidelines — hughgallagher.co.uk

> **For AI Assistants & Human Contributors**: This document outlines the technical architecture, design philosophy, CSS (BEM) conventions, JavaScript patterns, accessibility standards, and commit workflows for `hughgallagher.co.uk`. Always adhere to these guidelines when making modifications.

---

## 1. Project Overview & Philosophy

* **Purpose**: Personal portfolio, resume, and contact hub for Hugh Gallagher (Senior Software Engineer).
* **Domain**: `www.hughgallagher.co.uk` (managed via `CNAME`).
* **Hosting**: GitHub Pages (static site hosting).
* **Architecture Philosophy**:
  * **Zero Build Step**: No Webpack, Vite, Node bundlers, or CSS preprocessors needed for runtime or deployment.
  * **Pure Vanilla Web Standards**: Semantic HTML5, Modern CSS3 with Custom Properties, and Vanilla JavaScript (ES6+).
  * **Fast, Accessible, Lightweight**: 100/100 Lighthouse performance, WCAG AA contrast compliance, responsive, and print-optimized.

---

## 2. CSS Architecture & BEM Methodology

The project strictly follows the **BEM (Block Element Modifier)** methodology for all component styling in `css/screen.css`.

### BEM Naming Pattern
```css
.block { /* Standalone component */ }
.block__element { /* Child component tied to block context */ }
.block__element--modifier { /* Variant or state of the element */ }
.block--modifier { /* Variant or state of the block */ }
```

### Core Blocks in the Project
| Block | Purpose | Elements & Modifiers Examples |
| :--- | :--- | :--- |
| **`.nav`** | Sticky top navigation bar | `.nav__container`, `.nav__menu`, `.nav__link`, `.nav__link--active`, `.nav__sep` |
| **`.hero-banner`** | Full-width photo banner with identity | `.hero-banner__title-wrapper`, `.hero-banner__title`, `.hero-banner__subtitle` |
| **`.section`** | Content sections | `.section__title`, `.section__paragraph` |
| **`.skills`** | Grid layout for technical skills | `.skills__group`, `.skills__group-title`, `.skills__group-icon`, `.skills__group-icon--backend`, `.skills__tags`, `.skills__tag`, `.skills__tag--highlight` |
| **`.timeline`** | Work history list | `.timeline__item`, `.timeline__item-header`, `.timeline__company-group`, `.timeline__company`, `.timeline__role`, `.timeline__date`, `.timeline__list`, `.timeline__list-item` |
| **`.education`** | Education card container | `.education__card`, `.education__icon`, `.education__content`, `.education__degree`, `.education__meta` |
| **`.connect`** | Social / contact links | `.connect__links`, `.connect__btn`, `.connect__btn--primary`, `.connect__btn-icon`, `.connect__btn-icon--github` |
| **`.theme-toggle`** | Dark/Light mode button | `.theme-toggle__icon`, `.theme-toggle__icon--sun`, `.theme-toggle__icon--moon` |
| **`.site-footer`** | Bottom copyright and back-to-top | `.site-footer__text`, `.site-footer__link` |

### CSS Custom Properties (Theme Tokens)
All color, shadow, spacing, and radius values must use CSS variables declared in `:root` and `:root[data-theme="dark"]`:

```css
/* Color Palette */
--color-brand-green: #507525;
--color-brand-green-dark: #3a551a;
--color-brand-green-light: #f3f7ec;
--color-brand-green-border: #c9dd9f;

/* Surface Tokens */
--color-bg-page: #f1f5f0;
--color-bg-surface: #f9fbf9;
--color-border: #d4e2d3;
--color-text-main: #142017;
--color-text-body: #2f4033;
--color-text-muted: #5e7364;

/* Radius & Shadow */
--radius-xs: 4px;
--radius-sm: 6px;
--radius-md: 10px;
--radius-hero: var(--radius-md);
--radius-full: 9999px;
--shadow-sm: 0 1px 3px 0 rgba(20, 32, 23, 0.05);
--max-width: 980px;
```

### Dual-Layer Dark Mode Support
Dark mode styles **must always be declared twice** for full compatibility:
1. Explicit user override: `:root[data-theme="dark"] { ... }`
2. Automatic OS preference fallback: `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { ... } }`

### SVG Mask Engine for Icons
Vector icons in skills, education, and connect buttons use the CSS `mask-image` engine so icons automatically inherit `currentColor`:
```css
.connect__btn-icon--github {
  -webkit-mask-image: url('../img/icon-github.svg');
  mask-image: url('../img/icon-github.svg');
}
```

### Responsive Breakpoints
* **Desktop / Standard**: Base styles (`--max-width: 980px`).
* **Tablet / Small Laptop**: `@media only screen and (max-width: 980px)` (grid adjustments, margin resets).
* **Mobile**: `@media only screen and (max-width: 640px)` (single column skills, mobile header image switch).

### Dedicated Print Stylesheet (`@media print`)
When modifying HTML or CSS, ensure `@media print` remains clean:
* Body background forced to white (`#ffffff !important`).
* Hide interactive/decorative elements (`.nav`, `.theme-toggle`, vector icons).
* Hero banner converts to clean, monochrome resume title bar.
* Page breaks avoided inside `.timeline__item` and `.skills__group`.

---

## 3. HTML & Accessibility (a11y) Standards

### Semantic Landmarks & Heading Hierarchy
* Use exactly one `<h1>` inside `.hero-banner`.
* Every section uses `<section id="<name>" aria-labelledby="<name>-title">`.
* Section headings use `<h2 id="<name>-title" class="section__title">`.
* Job items use `<article class="timeline__item">` with `<h3>` for company names.

### Clean Anchor Links
* Section IDs and navigation links must use clean, simple anchor names:
  * `#about` (`About`)
  * `#skills` (`Skills`)
  * `#experience` (`Experience`)
  * `#education` (`Education`)
  * `#contact` (`Contact`)
* Do not prefix with `section-` (e.g., use `#about`, not `#section-about`).

### Links & External Targets
* External links opening in new tabs must include:
  * `target="_blank"`
  * `rel="me noopener noreferrer"`
  * Accessible label: `<span class="sr-only">(opens in a new tab)</span>`.

### Structured Data (SEO)
* Keep Schema.org `Person` JSON-LD in `<head>` synchronized with resume details (job title, employer, skills, sameAs links).

---

## 4. JavaScript Architecture (`js/app.js`)

* **Execution Scope**: Self-executing IIFE `(function () { 'use strict'; ... })();`.
* **FOUC Prevention**: The theme initialization script must run synchronously at the top of `js/app.js` (loaded in `<head>`) before DOM paint.
* **Event Handlers**: Interactive features (`initScrollSpy`, toggle listeners) initialize on `DOMContentLoaded`.
* **Scrollspy & URL Hash Updates**:
  * Tracks visible sections as the user scrolls.
  * Updates nav links with `.nav__link--active` and `aria-current="true"`.
  * Silently updates the address bar URL hash using `history.replaceState()` (never `location.hash` or `pushState`, to prevent polluting the browser history).
  * Automatically removes the hash when scrolled back to the top hero section.

---

## 5. Performance & Media

* **Images**:
  * High-res desktop hero: `img/header.webp` (1441×538px).
  * Lightweight mobile hero: `img/header-mobile.webp` (720px width, ~41KB).
  * Preload responsive headers in `<head>` using `<link rel="preload" as="image" type="image/webp" media="(max-width: 640px)" ...>`.
* **Icons & PWA**:
  * Vector icons stored in `img/*.svg`.
  * `site.webmanifest` defining standalone app config and icons (192px, 512px, SVG).
  * `sitemap.xml` with ISO 8601 `<lastmod>` dates.

---

## 6. Git Commit Conventions & Quality Verification

### Commit Message Standards
* Use the **imperative mood in the subject line** (e.g., "Add feature", "Fix bug", "Update styles", not "Added" or "Updates").
* Keep the subject line concise (under 72 characters) and capitalized.
* Specify the *what* and *why* clearly.
* **Examples**:
  * `Add Web App Manifest and nav scrollspy`
  * `Simplify section anchor IDs and update URL hash on scroll`
  * `Optimize mobile header image payload`

### Syntax Verification
* Before committing JavaScript changes, always verify syntax:
  ```bash
  node -c js/app.js
  ```
* Ensure the working tree is clean before and after changes (`git status`).
