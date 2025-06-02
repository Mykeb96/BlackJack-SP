import './styles/App.css'
import { useState } from 'react';
import { Game, type GameState } from './models/Game';

function App() {
  const [game] = useState<Game>(new Game('Mykael'));
  const [gameState, setGameState] = useState<GameState>(game.getGameState());
  const [betAmount, setBetAmount] = useState<number>(1);
  const buttonDisabled = gameState.status === 'betting' || gameState.status === 'finished';

  const handleHit = () => {
    game.playerHit();
    setGameState(game.getGameState());
  };

  const handleStand = () => {
    game.playerStand();
    setGameState(game.getGameState());
  };

  const startNewRound = () => {
    game.setBettingStatus();
    setGameState(game.getGameState());
  }

  const handleGameStart = () => {
    game.placeBet(betAmount);
    game.startNewRound();
    setBetAmount(1);
    setGameState(game.getGameState());
  };

  if (gameState.status === 'betting') {
    return (
      <div id='betting'>
        <h1>Place your bet</h1>
        <div className='betting-input'>
          <input
            type="number"
            min={1}
            max={game.player.chips}
            value={betAmount}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const value = Number(e.target.value);
              if (value < 1) {
                setBetAmount(1);
              } else if (value > game.player.chips) {
                setBetAmount(game.player.chips);
              } else {
                setBetAmount(value);
              }
            }}
            />
          <button onClick={handleGameStart}>Start Game</button>
        </div>
        <span className='chip-count'>Chips: {game.player.chips}</span>
      </div>
    )
  } else {
    return (
      <div id='game'>
        <div className='game-board'>
          <div className='dealer'>
            <h4>{game.dealer.name}</h4>
            <div className='hand'>
              {game.dealer.hand.map((card, index) => (
                <span key={index}>{card.rank} of {card.suit}</span>
              ))}
            </div>
            <h4>Score: {game.dealer.score}</h4>
          </div>
          <div className='player'>
            <h4>{game.player.name}</h4>
            <div className='hand'>
              {game.player.hand.map((card, index) => (
                <span key={index}>{card.rank} of {card.suit}</span>
              ))}
            </div>
            <h4>Score: {game.player.score}</h4>
            <h4>Chips: {game.player.chips}</h4>
          </div>
        </div>
        <div className='buttons'>
          <button onClick={handleHit} disabled={buttonDisabled}>Hit</button>
          <button onClick={handleStand} disabled={buttonDisabled}>Stand</button>
          <button onClick={startNewRound}>New Round</button>
        </div>
        <div className='game-state-container'>
          <div className='bet-amount'>Bet: {game.betAmount}</div>
          <div className='game-state'>{gameState.winner}</div>
        </div>
      </div>
    )
  }
}

export default App
