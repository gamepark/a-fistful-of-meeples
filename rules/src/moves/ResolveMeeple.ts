import GameState from '../GameState'
import PlayerColor from '../PlayerColor'
import MoveType from './MoveType'

/**
 * Here is a example a of move involving hidden information
 * On the backend side, there is no need to put the card inside the move. We know what it will be (first card on top of the deck)
 */
type ResolveMeeple = {
  type: MoveType.ResolveMeeple
  playerId: PlayerColor
}

export default ResolveMeeple

export function resolveMeeple(state: GameState, move: ResolveMeeple) {
  console.log(`${move.playerId} is drawing a card in ${state}`)
  /* That's executed on backend side. Example:
  const player = state.players.find(player => player.id === move.playerId)
  if (!player) return console.error(`Unexpected player id: ${move.playerId} inside ${state}`)
  player.hand.push(game.deck.shift())
   */
}

