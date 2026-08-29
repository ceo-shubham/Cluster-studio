# Cluster Studio — Setup Guide

## 1. Clerk Setup (Auth)
1. Go to https://clerk.com → Create application
2. Enable **Email/Password** and **Google** sign-in
3. Copy your keys to `.env.local`:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
   CLERK_SECRET_KEY=sk_live_...
   ```

## 2. MongoDB Atlas Setup
1. Go to https://cloud.mongodb.com → Create cluster (free tier)
2. Create database user → Get connection string
3. Add to `.env.local`:
   ```
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/clusterstudio
   ```

## 3. Backblaze B2 Setup
1. Go to https://backblaze.com → Create account → Create bucket
2. Bucket name e.g. `cluster-studio-uploads`
3. Set bucket to **Public**
4. Go to App Keys → Create new key with Read+Write access
5. Add to `.env.local`:
   ```
   B2_KEY_ID=your_key_id
   B2_APP_KEY=your_app_key
   B2_BUCKET_NAME=cluster-studio-uploads
   B2_ENDPOINT=https://s3.us-east-005.backblazeb2.com
   B2_REGION=us-east-005
   ```
   (Check your bucket region — it may differ)

## 4. Add Logo
- Place your logo file at: `public/logo.png`
- Brown circle logo as discussed

## 5. Run Locally
```bash
cd cluster-studio-web
npm install
npm run dev
```
Open http://localhost:3000

## 6. Deploy to Vercel
1. Push this folder to GitHub
2. Go to https://vercel.com → New Project → Import repo
3. Add all environment variables from `.env.local`
4. Deploy!

## 7. Admin Panel
- URL: `yoursite.com/admin/login`
- Email: `admin@clusterstudio.in`
- Password: `clusteradmin00studio`

## Pages
| Route | Description |
|-------|-------------|
| `/` | Homepage with banner + products |
| `/product/[id]` | Product detail + image editor |
| `/cart` | Cart |
| `/checkout` | Checkout (requires login) |
| `/orders` | My orders (requires login) |
| `/orders/[orderId]` | Order detail |
| `/admin/login` | Admin login |
| `/admin` | Admin dashboard |
| `/admin/orders/[orderId]` | Admin order detail + status update |
