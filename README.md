# Ember Quest

A complete React 19.3 / Phaser 4 canvas adventure, written in JSX. Guide Ember, a small wingless dragon, through ten worlds, earn embers, buy wings at the final summit, and fly home.

## Run

Requires Node 24+ and npm. Install with `npm ci`.

```bash
npm run dev       # Vite, http://localhost:5173
npm start         # React Scripts, http://localhost:3000
```

Both commands serve the same React application. In a cloud environment, use `BROWSER=none HOST=0.0.0.0 PORT=3000 npm start`. Vite is the preferred development tool; the requested React Scripts 5 path is also supported, though its upstream dependencies emit deprecation notices.

```bash
npm run build       # Vite production bundle → dist/
npm run build:cra   # React Scripts production bundle → build/
npm test            # Rules, progression, localization, persistence tests
npm run format      # Format JSX, helpers, CSS modules and documentation
```

Serve the resulting production directory from an HTTP server. No backend, account, API credentials, or remote sprite downloads are required. Google Fonts are optional; local font fallbacks keep the game usable without them. Phaser is loaded in a separate chunk.

## Play

- **A / D or ← / →:** move.
- **Space / W / ↑:** jump. Release and press again for each jump.
- **With wings:** hold jump to fly.
- **P:** pause or resume. **Escape:** pause or close a menu.
- Touch devices have left, right, and jump buttons.
- **Fireballs:** +25 score, +25 spendable embers, +6 strength.
- **Travelers without water:** +50 score, +50 embers, +12 strength.
- **Waterballs:** −22 strength, with a brief grace period after a hit.
- **Completing a level:** +150 score and embers; unlocks the next world.
- Rocks and fallen trees require jumping. Rivers have bridges.
- Fireball colors change with each world; levels 9 and 10 have floating, winged fireballs.
- Buy wings for 300 embers at **level 10**, then fly above the final signpost to finish.

The three JSON-backed shops sell healing, three-hit shields, and wings. Purchases spend embers without reducing your score. The UI prevents unavailable, unaffordable, and duplicate purchases.

Best score and unlocked worlds are saved locally when browser storage is available. An active run is session-only. You can replay any unlocked world from the map. Replaying level 10 starts with the 300 embers required for wings. Retry restores the current level's checkpoint so spending and pickups cannot be duplicated. New Adventure resets the run while preserving achievements.

## Project structure

```text
src/
  App.jsx                     Page composition
  App.module.css              Page layout
  index.jsx                   Shared React entry point
  index.css                   Fonts and global defaults
  components/
    Header/                   Fixed 100px header, language/audio controls
    Navigation/               Fixed 25px navigation
    GameStage/                Phaser canvas, HUD, game state overlays
    Controls/                 Keyboard hints and touch controls
    StatCard/                 Score, strength, collectible and best counters
    DragonCard/               Ember's portrait and wing progression
    Sprite/                   Shared original sprite rendering
    Journey/                  Current chapter group
    LevelCard/                Illustrated level entry
    Shop/                     Shop invitation
    ShopCard/                 Individual JSON-driven shop
    Modal/                    World map, guide, shops, help and reset dialog
    Footer/                   Fixed 75px footer
    Icon/                     Consistent interface icons
  data/shops.json              Three shop inventories and translations
  util/help.js                All game logic, hooks, artwork, audio and helpers
  util/help.test.mjs           Behavior tests
```

Each visual component has its own adjacent CSS module with camelCase class names. The Icon component uses the shared Lucide icon set. Components contain rendering and event bindings; reusable behavior lives in `util/help.js` as requested.

## Artwork and behavior

Original canvas artwork is generated locally into reusable Phaser textures: six-frame strong/weak/winged dragon animations, eight human designs with armed and unarmed variants, ten fireball styles, waterballs, trees, rocks, logs, bridge, and signpost. The world includes layered forest scenery, sunlight, fireflies, floating collectibles, collection particles, and hit feedback. The same sprite renderers power the field guide and companion portrait.

Levels increase travel distance, movement speed, enemy count, and throwing frequency. Water carriers aim projectiles horizontally at the dragon; the final two levels require aerial collection. The game pauses when opening a panel or hiding the browser tab. Dialogs trap keyboard focus and restore it on close. All gameplay labels and shop data support English and Arabic; Arabic uses a right-to-left interface while game movement remains consistent.

The game scene runs inside the area between navigation and footer. The surrounding dashboard scrolls on smaller screens; fullscreen expands the playable scene. A reduced-motion preference disables decorative CSS animations.
