---
description: How to deploy the Ayushman SSG app to Vercel
---

# Deploying to Vercel

Since you have pushed your code to GitHub, the easiest way to deploy is via the Vercel Dashboard.

## Option 1: Vercel Dashboard (Recommended)

1.  **Log in** to [vercel.com](https://vercel.com).
2.  Click **"Add New..."** -> **"Project"**.
3.  Select **"Import Git Repository"**.
4.  Choose your repo: `abh1hi/aayushman-frontend`.
5.  **Configure Project**:
    *   **Framework Preset**: Select `Vite`.
    *   **Root Directory**: `./` (default).
    *   **Build Command**: `npm run build` (It might auto-detect `vite-ssg build`, which is correct).
    *   **Output Directory**: `dist` (default).
6.  Click **Deploy**.

## Option 2: Vercel CLI

If you prefer the terminal:

1.  Install Vercel CLI:
    ```bash
    npm i -g vercel
    ```
2.  Run deploy:
    ```bash
    vercel
    ```
3.  Follow the prompts:
    *   Set up and deploy? **Y**
    *   Which scope? (Select your account)
    *   Link to existing project? **N**
    *   Project Name? **ayushman-ambulance**
    *   In which directory? **./**
    *   Want to modify settings? **N** (It will read `vercel.json` automatically).

## Post-Deployment
- Vercel will provide a URL (e.g., `ayushman-ambulance.vercel.app`).
- Go to **Settings > Domains** to add your custom domain if needed.
