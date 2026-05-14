# Blackjack (single player)

A single-player Blackjack game with a responsive casino-style UI, built with React, TypeScript, and Vite.

**Live site:** [https://black-jack-sp.vercel.app/](https://black-jack-sp.vercel.app/)

## Features

- Opening deal in **casino order** (player, dealer, player, dealer) with **staggered card reveal** and short deal-in motion
- **Betting** with chip bank, min / quarter / half / max quick picks, and stepper controls
- **Hit**, **Stand**, and **New round** flow with win, loss, and push outcomes
- **Scores** from visible cards during the deal, then full hands once play starts
- **Responsive** layout for smaller viewports, safe-area padding, and reduced-motion support for animations
- Custom **tab icon** and typography (Outfit + JetBrains Mono via Google Fonts)

## Tech stack

- React 19
- TypeScript
- Vite 6
- ESLint (flat config)

## Getting started

1. Clone the repository and install dependencies:

```bash
git clone <your-repo-url>
cd BlackJack-SP
npm install
```

2. Start the dev server:

```bash
npm run dev
```

3. Open the URL Vite prints (usually [http://localhost:5173](http://localhost:5173)).

### Other scripts

| Command        | Description              |
| -------------- | ------------------------ |
| `npm run build` | Typecheck + production build |
| `npm run preview` | Serve the production build locally |
| `npm run lint`  | Run ESLint               |

## How to play

1. Choose a bet and select **Deal cards**.
2. Use **Hit** or **Stand** when it is your turn.
3. Try to beat the dealer without going over 21.
4. Use **New round** to return to betting.

## Project structure

```
src/
├── models/
│   ├── Deck.ts      # Card types, deck, shuffle, draw
│   ├── Player.ts    # Hand, chips, bets, blackjackScore helper
│   ├── Dealer.ts    # Dealer + shoe behavior
│   └── Game.ts      # Round flow, outcomes
├── App.tsx          # UI, deal animation timing
├── main.tsx
└── styles/
    ├── index.css    # Global base styles
    └── App.css      # Game UI styles
public/
└── blackjack-icon.svg   # Favicon
```

## Game rules (implemented)

- Dealer draws while their score is **below 17** (stands on **17+**).
- **Push** returns the bet; a **player win** pays **1:1** on the wager (you receive your bet back plus winnings equal to the bet).
- Starting bank: **100 chips**; minimum bet: **1 chip**.

## Contributing

Contributions are welcome. Open a pull request with a short description of the change and any testing you ran.
