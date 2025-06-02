# React Blackjack 🎰

A modern implementation of Blackjack built with React, TypeScript, and Vite.

## 🎮 Features

- Classic Blackjack gameplay
- Real-time score calculation
- Betting system with chip tracking
- Dealer AI following casino rules (hits on 16, stands on 17)

## 🛠️ Tech Stack

- React 18
- TypeScript
- Vite
- Modern CSS

## 🚀 Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/react-blackjack.git
```

2. Install dependencies:
```bash
cd react-blackjack
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## 🎲 How to Play

1. Place your bet
2. Start a new game
3. Choose to Hit or Stand based on your cards
4. Beat the dealer's hand without going over 21
5. Win chips and try to build your fortune!

## 🏗️ Project Structure

```
src/
├── models/         # Game logic and classes
│   ├── Card.ts
│   ├── Deck.ts
│   ├── Player.ts
│   └── Game.ts
├── App.tsx
└── styles/        # CSS styles
```

## 📝 Game Rules

- Blackjack pays 2x
- Dealer must hit on 16 and stand on 17
- Players start with 100 chips
- Minimum bet: 1 chips

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.