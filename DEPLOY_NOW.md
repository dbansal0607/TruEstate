# Quick Deployment Guide

## ✅ What's Ready
- MongoDB Atlas: 358,000 transactions loaded
- Backend: Connected to MongoDB, all APIs working
- Frontend: Tested locally, all features working
- Git: All changes committed

## 🚀 Deploy Now (15 minutes total)

### Step 1: Deploy Backend to Render (7 minutes)

**I've opened Render for you.** Follow these steps:

1. **Sign up** with GitHub at https://render.com/
2. Click "New +" → "Web Service"
3. Connect repository: `dbansal0607/TruEstate`
4. **Settings**:
   - Name: `truestate-backend`
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Instance Type: **Free**

5. **Environment Variables** (click "Advanced"):
   ```
   MONGODB_URI = (your MongoDB connection string from .env file)
   PORT = 5000
   NODE_ENV = production
   CORS_ORIGIN = *
   ```

6. Click "Create Web Service"
7. **COPY YOUR URL**: `https://truestate-backend-xxxx.onrender.com`

---

### Step 2: Deploy Frontend to Vercel (5 minutes)

1. Go to https://vercel.com/ and sign up with GitHub
2. Click "Add New" → "Project"
3. Import: `dbansal0607/TruEstate`
4. **Settings**:
   - Framework: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

5. **Environment Variable**:
   ```
   VITE_API_BASE_URL = https://truestate-backend-xxxx.onrender.com/api
   ```
   (Use YOUR backend URL from Step 1)

6. Click "Deploy"
7. **COPY YOUR URL**: `https://truestate-xxxx.vercel.app`

---

### Step 3: Update CORS (2 minutes)

1. Go back to Render dashboard
2. Open your backend service
3. Go to "Environment"
4. Update `CORS_ORIGIN` to: `https://truestate-xxxx.vercel.app`
5. Save (auto-redeploys)

---

### Step 4: Push to GitHub (1 minute)

1. Download GitHub Desktop: https://desktop.github.com/
2. Sign in as `dbansal0607`
3. Add repository: `C:\Users\Dhruv Bansal\Desktop\TruEstate`
4. Publish (make sure it's PUBLIC)

---

### Step 5: Submit (1 minute)

**Form**: https://docs.google.com/forms/d/e/1FAIpQLSe8rA-cVCYBoqvc9pKpRUnA0qewwDrTpkOWI8cWuoHLIJmQUw/viewform

**Submit**:
- GitHub: `https://github.com/dbansal0607/TruEstate`
- Live App: `https://truestate-xxxx.vercel.app`
- Backend: `https://truestate-backend-xxxx.onrender.com/api`

---

## ✅ You're Done!

All requirements met:
- ✅ Database (MongoDB Atlas)
- ✅ Multi-select filters
- ✅ Live deployment
- ✅ Professional UI
