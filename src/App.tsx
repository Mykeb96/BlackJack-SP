import './styles/App.css'
import { useEffect, useMemo, useState } from 'react'
import { Game, type GameState } from './models/Game'
import type { Card as CardModel, Suit } from './models/Deck'
import { blackjackScore } from './models/Player'

function suitGlyph(suit: Suit): string {
  switch (suit) {
    case 'hearts':
      return '♥'
    case 'diamonds':
      return '♦'
    case 'clubs':
      return '♣'
    case 'spades':
      return '♠'
  }
}

function isRedSuit(suit: Suit): boolean {
  return suit === 'hearts' || suit === 'diamonds'
}

function CardFace({ card, dealIn }: { card: CardModel; dealIn?: boolean }) {
  const red = isRedSuit(card.suit)
  return (
    <div
      className={`bj-card ${red ? 'bj-card--red' : 'bj-card--black'}${dealIn ? ' bj-card--deal-in' : ''}`}
      aria-label={`${card.rank} of ${card.suit}`}
    >
      <span className="bj-card__rank">{card.rank}</span>
      <span className="bj-card__suit" aria-hidden="true">
        {suitGlyph(card.suit)}
      </span>
    </div>
  )
}

function statusTone(winner: string, status: GameState['status']): string {
  if (status !== 'finished') return 'bj-status--neutral'
  if (winner === 'Player wins') return 'bj-status--win'
  if (winner === 'Dealer wins') return 'bj-status--lose'
  if (winner === 'Push') return 'bj-status--push'
  return 'bj-status--neutral'
}

/** Initial deal: step 0 = no cards yet; 1–4 = alternating reveal; 5 = done. */
const INITIAL_DEAL_MS = 340

function visibleCounts(dealStep: number, playerLen: number, dealerLen: number) {
  if (dealStep >= 5) {
    return { player: playerLen, dealer: dealerLen }
  }
  const player = Math.min(playerLen, Math.floor((dealStep + 1) / 2))
  const dealer = Math.min(dealerLen, Math.floor(dealStep / 2))
  return { player, dealer }
}

function App() {
  const [game] = useState<Game>(() => new Game('Mykael'))
  const [gameState, setGameState] = useState<GameState>(() => game.getGameState())
  const [betAmount, setBetAmount] = useState(1)
  const [dealStep, setDealStep] = useState(5)

  const { player: pVis, dealer: dVis } = visibleCounts(dealStep, game.player.hand.length, game.dealer.hand.length)
  const playerCards = game.player.hand.slice(0, pVis)
  const dealerCards = game.dealer.hand.slice(0, dVis)
  const playerScore = blackjackScore(playerCards)
  const dealerScore = blackjackScore(dealerCards)

  const initialDealIncomplete = gameState.status === 'playerTurn' && dealStep < 5

  useEffect(() => {
    if (gameState.status !== 'playerTurn') return
    if (dealStep >= 5) return

    const id = window.setTimeout(() => {
      setDealStep((s) => (s >= 4 ? 5 : s + 1))
    }, INITIAL_DEAL_MS)

    return () => window.clearTimeout(id)
  }, [gameState.status, dealStep])

  const buttonDisabled =
    gameState.status === 'betting' || gameState.status === 'finished' || initialDealIncomplete
  const chips = game.player.chips

  const quickBets = useMemo(() => {
    const half = Math.max(1, Math.floor(chips / 2))
    const quarter = Math.max(1, Math.floor(chips / 4))
    return [
      { label: 'Min', value: 1 },
      { label: '¼ stack', value: quarter },
      { label: '½ stack', value: half },
      { label: 'Max', value: chips },
    ]
  }, [chips])

  const clampBet = (n: number) => Math.min(chips, Math.max(1, Math.floor(n)))

  const handleHit = () => {
    game.playerHit()
    setGameState(game.getGameState())
  }

  const handleStand = () => {
    game.playerStand()
    setGameState(game.getGameState())
  }

  const startNewRound = () => {
    game.setBettingStatus()
    setDealStep(5)
    setGameState(game.getGameState())
  }

  const handleGameStart = () => {
    game.placeBet(betAmount)
    game.startNewRound()
    setBetAmount(1)
    setDealStep(0)
    setGameState(game.getGameState())
  }

  if (gameState.status === 'betting') {
    return (
      <div className="bj-root">
        <div className="bj-bg" aria-hidden="true" />
        <main className="bj-shell bj-shell--betting">
          <header className="bj-hero">
            <p className="bj-eyebrow">Single player</p>
            <h1 className="bj-title">Blackjack</h1>
            <p className="bj-subtitle">Set your stake, then take your seat at the table.</p>
          </header>

          <section className="bj-panel bj-panel--betting" aria-labelledby="bet-heading">
            <h2 id="bet-heading" className="bj-panel__title">
              Place your bet
            </h2>

            <div className="bj-bank" role="status">
              <span className="bj-bank__label">Your bank</span>
              <span className="bj-bank__value">{chips} chips</span>
            </div>

            <div className="bj-bet-row">
              <button type="button" className="bj-icon-btn" onClick={() => setBetAmount((b) => clampBet(b - 1))} disabled={betAmount <= 1} aria-label="Decrease bet">
                −
              </button>
              <div className="bj-bet-input-wrap">
                <label htmlFor="bet-input" className="visually-hidden">
                  Bet amount
                </label>
                <input
                  id="bet-input"
                  className="bj-bet-input"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={chips}
                  value={betAmount}
                  onChange={(e) => {
                    const raw = Number(e.target.value)
                    if (Number.isNaN(raw)) return
                    setBetAmount(clampBet(raw))
                  }}
                />
              </div>
              <button type="button" className="bj-icon-btn" onClick={() => setBetAmount((b) => clampBet(b + 1))} disabled={betAmount >= chips} aria-label="Increase bet">
                +
              </button>
            </div>

            <div className="bj-quick-bets" role="group" aria-label="Quick bet amounts">
              {quickBets.map((q) => (
                <button key={q.label} type="button" className="bj-chip-btn" onClick={() => setBetAmount(clampBet(q.value))}>
                  {q.label}
                </button>
              ))}
            </div>

            <button type="button" className="bj-btn bj-btn--primary bj-btn--block" onClick={handleGameStart} disabled={chips < 1}>
              Deal cards
            </button>
          </section>
        </main>
      </div>
    )
  }

  return (
    <div className="bj-root">
      <div className="bj-bg" aria-hidden="true" />
      <main className="bj-shell bj-shell--table">
        <header className="bj-topbar">
          <div className="bj-topbar__brand">
            <span className="bj-topbar__mark" aria-hidden="true">
              ♠
            </span>
            <span className="bj-topbar__name">Blackjack</span>
          </div>
          <div className="bj-topbar__stats">
            <div className="bj-stat">
              <span className="bj-stat__label">Bank</span>
              <span className="bj-stat__value">{game.player.chips}</span>
            </div>
            <div className="bj-stat">
              <span className="bj-stat__label">Bet</span>
              <span className="bj-stat__value">{game.betAmount}</span>
            </div>
          </div>
        </header>

        <div className="bj-felt">
          <section className="bj-hand-block" aria-labelledby="dealer-name">
            <div className="bj-hand-block__head">
              <h2 id="dealer-name" className="bj-hand-block__title">
                {game.dealer.name}
              </h2>
              <span className="bj-score-pill">
                <span className="visually-hidden">Dealer score</span>
                {dealerCards.length === 0 ? '—' : dealerScore}
              </span>
            </div>
            <div className="bj-hand" role="list">
              {dealerCards.map((card, index) => (
                <div key={`d-${index}-${card.rank}-${card.suit}`} role="listitem">
                  <CardFace card={card} dealIn={dealStep === 2 * index + 2} />
                </div>
              ))}
            </div>
          </section>

          <div className="bj-felt__divider" aria-hidden="true" />

          <section className="bj-hand-block" aria-labelledby="player-name">
            <div className="bj-hand-block__head">
              <h2 id="player-name" className="bj-hand-block__title">
                {game.player.name}
              </h2>
              <span className="bj-score-pill bj-score-pill--player">
                <span className="visually-hidden">Your score</span>
                {playerCards.length === 0 ? '—' : playerScore}
              </span>
            </div>
            <div className="bj-hand" role="list">
              {playerCards.map((card, index) => (
                <div key={`p-${index}-${card.rank}-${card.suit}`} role="listitem">
                  <CardFace card={card} dealIn={dealStep === 2 * index + 1} />
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className={`bj-status ${statusTone(gameState.winner, gameState.status)}`} role="status" aria-live="polite">
          {gameState.winner}
        </div>

        <div className="bj-actions">
          <button type="button" className="bj-btn bj-btn--hit" onClick={handleHit} disabled={buttonDisabled}>
            Hit
          </button>
          <button type="button" className="bj-btn bj-btn--stand" onClick={handleStand} disabled={buttonDisabled}>
            Stand
          </button>
          <button type="button" className="bj-btn bj-btn--ghost" onClick={startNewRound}>
            New round
          </button>
        </div>
      </main>
    </div>
  )
}

export default App
