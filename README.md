# The Dawn-Breakers Study Companion

An offline-first, interactive study companion and index of names, titles, cities, and connections for *The Dawn-Breakers* (Nabíl’s Narrative of the early days of the Bahá'í Revelation).

This project is deployed to GitHub Pages and is designed to link with the Morn & Eve repository, acting as a standalone reference guide that can also be integrated into other study applications.

---

## 📖 The Project Vision

The primary goal of this companion guide is to help readers navigate the complex historical landscape of *The Dawn-Breakers* by cataloging and clarifying every name, title, city, and connection mentioned in the narrative.

### Core Objectives:
1. **Comprehensive Individual Cataloging:** Identify every individual mentioned in the book. Ensure similar or identical names referring to different historical figures are separated clearly to prevent reader confusion.
2. **Title & Alias Merging:** Avoid confusing titles with names. When the text introduces an individual by name and later references them by a title (or vice versa), these are combined into a single, unified profile.
3. **Interconnected Relationships:** Detail relationships and interactions between characters (disciples, Apostles, Manifestations, and opponents), providing an interactive network graph to explore these links visually.
4. **Geographical Tracking:** Separately identify cities mentioned in the book and list the high-level events that occurred in each, mapped to page references.
5. **Detailed Contextual Bios:** Provide a brief summary (1–2 paragraphs max) for each figure, detailing who they are, what they did, and the specific historical stories they are part of.
6. **Alphabetical Organization:** Sort all figures and locations alphabetically for quick reference.
7. **Offline Accessibility:** Ensure the guide works offline, featuring exporting tools to download the entire directory as a Microsoft Word (`.docx`) file or generate a printable booklet/PDF.
8. **Accent-Insensitive & Fuzzy Search:** Allow searching for names using standard English spelling (e.g. typing "Mulla" or "Bahaullah" without diacritics like "Mullá" or "Bahá'u'lláh") and support typo tolerance (e.g., "mula").

---

## 🛠️ Technology Stack

*   **Frontend Library:** React (v19)
*   **Build Tool:** Vite (v8)
*   **Icons:** Lucide React
*   **Document Export:** `docx` (Microsoft Word generator)
*   **Interactive Visualizations:** Canvas-based Force-Directed Graph simulation
*   **Test Suite:** Vitest & JSDOM (for automated verification of user stories)

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v20+ recommended).

### Installation
Clone the repository and install the dependencies:
```bash
git clone https://github.com/Skillith/dawn-breakers-companion.git
cd dawn-breakers-companion
npm install
```

### Run Locally (Development)
Start the local development server:
```bash
npm run dev
```

### Build for Production
Generate optimized static files in the `dist/` directory (ready for GitHub Pages):
```bash
npm run build
```

---

## 🧪 Running Automated Tests

We use **Vitest** to run automated unit and integration tests checking each of our core user stories (US-01 through US-07):

```bash
# Run tests once
npm run test

# Run tests in watch mode
npx vitest
```
