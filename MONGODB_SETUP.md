# MongoDB Atlas Quick Setup Script

## You need to do these 3 things manually (I can't automate account creation):

### 1. Create MongoDB Atlas Account (2 minutes)
- Go to: https://www.mongodb.com/cloud/atlas/register
- Sign up with Google (fastest)
- Choose FREE tier (M0)
- Create cluster named "TruEstate"
- Wait 3 minutes for cluster creation

### 2. Get Connection String (1 minute)
- Create database user:
  - Username: `truestate_user`
  - Password: (autogenerate and COPY it)
- Add IP: Click "Allow Access from Anywhere"
- Get connection string:
  - Click "Connect" → "Connect your application"
  - Copy the string (looks like: `mongodb+srv://truestate_user:PASSWORD@truestate.xxxxx.mongodb.net/`)
  - Replace `<password>` with your actual password
  - Add `/truestate` at the end before the `?`

### 3. Add to .env file
Open `backend/.env` and add:
```
MONGODB_URI=mongodb+srv://truestate_user:YOUR_PASSWORD@truestate.xxxxx.mongodb.net/truestate?retryWrites=true&w=majority
```

## Then I'll handle the rest!

Once you've done the above 3 steps, tell me and I'll:
- Import the data to MongoDB
- Deploy backend to Render
- Deploy frontend to Vercel
- Push everything to GitHub
- Give you the live URLs for submission
