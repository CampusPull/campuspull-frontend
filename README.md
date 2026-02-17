# CampusPull Frontend

This repository contains the frontend application for CampusPull.

Built using React + Vite and connected to the CampusPull backend APIs.

---

## 🚀 Tech Stack

- React
- Vite
- Tailwind CSS
- Axios
- React Router

---

## 📦 Prerequisites

Make sure you have installed:

- Node.js (v18+ recommended)
- npm or yarn

Check version:

```bash
node -v
npm -v
🛠️ Local Setup
1️⃣ Clone the repository
git clone <FRONTEND_REPO_LINK>
cd campuspull-frontend
2️⃣ Install dependencies
npm install
3️⃣ Create Environment File
Create a file named:
.env
Inside the root directory.
Add:

VITE_API_URL=http://localhost:5000
For dev backend deployment:

VITE_API_URL=https://your-dev-backend-url
For production:

VITE_API_URL=https://your-prod-backend-url
4️⃣ Start Development Server
npm run dev
App will run at:

http://localhost:5173
