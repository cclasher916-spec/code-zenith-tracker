# Code Zenith Tracker - Deployment Guide

## Vercel Deployment with Firebase

This guide will help you deploy the Code Zenith Tracker to Vercel using Firebase (free tier).

### Prerequisites

1. **Firebase Project**: Create a free Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. **Vercel Account**: Sign up at [Vercel](https://vercel.com/)

### Step 1: Set Up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Click on the **Web** icon (</>) to add Firebase to your web app
4. Register your app and copy the Firebase configuration values
5. Enable **Authentication** and **Firestore Database** in the Firebase Console

### Step 2: Configure Environment Variables Locally

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your Firebase credentials in `.env`:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

### Step 3: Test Locally

```bash
npm install
npm run dev
```

Visit `http://localhost:5173` to verify everything works.

### Step 4: Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click **Add New Project**
4. Import your GitHub repository
5. **Important**: Add Environment Variables:
   - Go to **Settings** → **Environment Variables**
   - Add each variable from your `.env` file:
     - `VITE_FIREBASE_API_KEY`
     - `VITE_FIREBASE_AUTH_DOMAIN`
     - `VITE_FIREBASE_PROJECT_ID`
     - `VITE_FIREBASE_STORAGE_BUCKET`
     - `VITE_FIREBASE_MESSAGING_SENDER_ID`
     - `VITE_FIREBASE_APP_ID`
   - Make sure to add them for **Production**, **Preview**, and **Development**
6. Click **Deploy**

#### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (from project root)
vercel

# Add environment variables
vercel env add VITE_FIREBASE_API_KEY
vercel env add VITE_FIREBASE_AUTH_DOMAIN
vercel env add VITE_FIREBASE_PROJECT_ID
vercel env add VITE_FIREBASE_STORAGE_BUCKET
vercel env add VITE_FIREBASE_MESSAGING_SENDER_ID
vercel env add VITE_FIREBASE_APP_ID

# Deploy to production
vercel --prod
```

### Step 5: Configure Firebase Security Rules

#### Firestore Rules

Go to Firebase Console → Firestore Database → Rules and set:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Add more rules based on your collections
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

#### Storage Rules

Go to Firebase Console → Storage → Rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Troubleshooting

#### Build Fails on Vercel

1. Check that all environment variables are set correctly in Vercel
2. Verify variable names match exactly (including `VITE_` prefix)
3. Make sure you've added variables to all environments (Production, Preview, Development)
4. Redeploy after adding environment variables

#### Firebase Connection Issues

1. Verify Firebase config values are correct
2. Check that Authentication and Firestore are enabled in Firebase Console
3. Ensure Firebase project is on the free Spark plan or paid Blaze plan
4. Check browser console for specific Firebase errors

#### Environment Variables Not Working

- For Vite projects, all client-side environment variables MUST start with `VITE_`
- After adding new environment variables in Vercel, redeploy the project
- Clear browser cache and try again

### Firebase Free Tier Limits

The Firebase Spark (free) plan includes:

- **Authentication**: Unlimited users
- **Firestore**: 1 GB storage, 50K reads/day, 20K writes/day
- **Storage**: 5 GB storage, 1 GB/day downloads
- **Hosting**: 10 GB/month transfer

These limits are generous for small to medium projects.

### Useful Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Deploy to Vercel
vercel --prod
```

### Support

If you encounter issues:

1. Check Vercel deployment logs
2. Verify all environment variables are set
3. Check Firebase Console for quota limits
4. Review browser console for client-side errors

### Project Structure

```
code-zenith-tracker/
├── src/
│   ├── lib/
│   │   └── firebase.ts        # Firebase configuration
│   ├── services/
│   │   ├── auth.ts            # Authentication service
│   │   └── database.ts        # Database operations
│   ├── components/            # React components
│   ├── pages/                 # Page components
│   └── main.tsx              # App entry point
├── .env.example              # Environment variables template
├── vercel.json              # Vercel configuration
└── package.json             # Dependencies
```

---

**Note**: Never commit your `.env` file to GitHub. It's already in `.gitignore` to prevent accidental commits.
