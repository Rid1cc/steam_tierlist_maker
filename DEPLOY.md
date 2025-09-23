# Cloudflare Pages Deployment Guide

## Prerequisites

1. Install Wrangler CLI:
```bash
npm install -g wrangler
```

2. Login to Cloudflare:
```bash
wrangler login
```

## Quick Deploy

### Option 1: Automated Script
```bash
./deploy.sh
```

### Option 2: Manual Commands
```bash
# Build the project
npm run build

# Deploy to Cloudflare Pages
npm run deploy
```

## Setting up Environment Variables

After deployment, add your Steam API key:

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Pages** > **steam-tierlist-maker**
3. Go to **Settings** > **Environment variables**
4. Add:
   - **Variable name**: `STEAM_API_KEY`
   - **Value**: Your Steam Web API key from https://steamcommunity.com/dev/apikey

## Alternative: Deploy via GitHub Integration

1. Go to [Cloudflare Pages](https://dash.cloudflare.com/pages)
2. Create a new project
3. Connect your GitHub repository
4. Set build settings:
   - **Framework preset**: Next.js
   - **Build command**: `npm run build`
   - **Build output directory**: `.next`
   - **Root directory**: `/` (leave empty)
5. Add environment variables in the dashboard

## Configuration Files

- `wrangler.toml` - Wrangler configuration for Pages
- `next.config.js` - Next.js configuration optimized for Cloudflare
- `package.json` - Deploy scripts

## Features

✅ **Global CDN** - Lightning fast worldwide  
✅ **Automatic SSL** - HTTPS everywhere  
✅ **Serverless Functions** - API routes work automatically  
✅ **Git Integration** - Auto-deploy from GitHub  
✅ **Preview Deployments** - Every branch gets a preview URL  
✅ **Zero Config** - Just deploy and go!

## Troubleshooting

- Make sure you've built the project with `npm run build` first
- Ensure you're logged into Cloudflare with `wrangler whoami`
- Check that your Steam API key is set in environment variables