# ⬡ Mesh Circular Shift Visualizer

An interactive web application that simulates and visualizes **circular q-shift** on a 2D mesh topology.

## 🔗 Live Demo
> **[ADD YOUR DEPLOYMENT URL HERE AFTER DEPLOYING]**

---

## 📋 What is Circular Q-Shift?

A circular q-shift on `p` nodes means: node `i` sends its data to node `(i + q) mod p`.

On a **2D Mesh**, this is done in 2 stages:
- **Stage 1 (Row Shift):** Each node shifts within its row by `q mod √p` positions
- **Stage 2 (Col Shift):** Each node shifts within its column by `⌊q / √p⌋` positions

This is much more efficient than a naive ring shift!

---

## 🚀 How to Run Locally

1. **Clone the repo**
   ```bash
   git clone https://github.com/YOUR_USERNAME/mesh-shift-visualizer.git
   cd mesh-shift-visualizer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start local server**
   ```bash
   npm start
   ```

4. Open your browser and go to `http://localhost:3000`

> ⚠️ **Important:** You must open via a server (not by double-clicking index.html) because the app uses ES6 modules which require HTTP.

---

## 📁 Project Structure

```
mesh-shift-visualizer/
├── public/
│   └── index.html          ← Entry HTML page
├── src/
│   ├── components/
│   │   ├── MeshGrid.js      ← Grid rendering + animation
│   │   ├── ControlPanel.js  ← User inputs (p, q) + validation
│   │   └── ComplexityPanel.js ← Analysis panel
│   ├── utils/
│   │   └── shiftLogic.js   ← Pure shift algorithm (testable)
│   ├── App.js              ← Wires everything together
│   └── index.js            ← Entry point
├── style.css               ← All styles
├── README.md
└── package.json
```

---

## 🧮 Complexity: Mesh vs Ring

| p  | q | Mesh Steps | Ring Steps |
|----|---|------------|------------|
| 16 | 3 | 3          | 3          |
| 16 | 5 | 3          | 5          |
| 16 | 7 | 5          | 7          |
| 64 | 3 | 3          | 3          |
| 64 | 5 | 5          | 5          |
| 64 | 7 | 7          | 7          |

---

## 🛠 Tech Stack

- **Vanilla HTML + CSS + JavaScript** (ES6 modules, no framework needed)
- **Deployed on:** Netlify / Vercel (free tier)
