#!/bin/bash

# Quick deployment script for Cloudflare Pages
# Make sure you have wrangler installed and logged in

echo "🚀 Steam Tierlist Maker - Cloudflare Pages Deploy"
echo "================================================"

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler CLI not found. Installing..."
    npm install -g wrangler
fi

# Check if logged in
echo "📝 Checking Cloudflare authentication..."
if ! wrangler whoami &> /dev/null; then
    echo "🔑 Please login to Cloudflare:"
    wrangler login
fi

# Build the project
echo "🔨 Building project..."
npm run build

# Deploy to Cloudflare Pages
echo "🚀 Deploying to Cloudflare Pages..."
wrangler pages deploy .next

echo ""
echo "✅ Deployment complete!"
echo "📋 Don't forget to set your Steam API key in Cloudflare Dashboard:"
echo "   Go to Pages > steam-tierlist-maker > Settings > Environment variables"
echo "   Add: STEAM_API_KEY = your_steam_api_key_here"