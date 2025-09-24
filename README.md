# Steam Tierlist Maker

A modern web application for creating custom tier lists of your Steam games. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Steam Integration**: Import games from your Steam library (public profiles) or use Family Sharing with Web API token
- **Drag & Drop**: Intuitive drag and drop interface with sortable positioning
- **Customization**: Custom tier colors, names, and tier list titles
- **Filtering & Sorting**: Advanced game library filtering and sorting options
- **Export**: Export your tier lists as high-quality PNG images
- **Responsive**: Works perfectly on desktop and mobile devices
- **Privacy-First**: All data stored locally, Web API tokens never logged or stored

## Live

Visit [Steam Tierlist Maker](https://steam-tierlist-maker.pages.dev) to try it out!

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS with custom Steam-themed colors
- **Drag & Drop**: @dnd-kit/sortable for smooth interactions
- **Image Processing**: html2canvas for tier list exports
- **Deployment**: Cloudflare Pages with Edge Runtime
- **API**: Steam Web API integration

## Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/Rid1cc/steam_tierlist_maker.git
   cd steam_tierlist_maker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Add your Steam Web API key to .env.local
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

## How to Use

1. **Import Games**: Click "Import Steam Games" and choose:
   - **Standard Import**: Enter your Steam ID or profile URL (profile must be public)
   - **Family Sharing**: Use your personal Web API token for family shared games

2. **Create Tiers**: Drag games from the library to different tier rows (S, A, B, C, D, F)

3. **Customize**: Use the settings panel to:
   - Change tier list name
   - Customize tier colors
   - Add/remove tiers
   - Reset the tier list

4. **Sort & Filter**: Use the library controls to:
   - Sort by name or playtime
   - Hide unplayed games
   - Reorder games within containers

5. **Export**: Click "Export as Image" to download your tier list as PNG

## Development

### Code Structure

- `src/app/` - Next.js app router pages and API routes
- `src/components/` - React components
- `src/hooks/` - Custom React hooks
- `src/types/` - TypeScript type definitions
- `src/data/` - Static data and sample games

### Key Components

- **`page.tsx`** - Main application with drag & drop logic
- **`useSteamApi.ts`** - Hook for Steam API integration
- **`TierList.tsx`** - Tier list display component
- **`GameLibrary.tsx`** - Game library with filtering/sorting
- **`SteamImport.tsx`** - Steam game import modal


## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Steam Web API** for game data
- **Valve Corporation** for Steam platform
- **Next.js Team** for React framework
- **@dnd-kit** for the drag and drop functionality

---

Made with ❤️ by [Ridicc](https://github.com/Rid1cc)

*This application is not affiliated with Valve Corporation. Steam and the Steam logo are trademarks of Valve Corporation.*