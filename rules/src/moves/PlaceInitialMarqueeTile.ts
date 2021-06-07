import GameState, { getPreviousPlayer } from '../GameState'
import PlayerColor from '../PlayerColor'
import MoveType from './MoveType'
import Phase, { setCurrentPhase } from '../Phase'

/**
 * Here is a example a of move involving hidden information
 * On the backend side, there is no need to put the card inside the move. We know what it will be (first card on top of the deck)
 */
type PlaceInitialMarqueeTile = {
  type: MoveType.PlaceInitialMarqueeTile
  playerId: PlayerColor
  location: number
}

export default PlaceInitialMarqueeTile

export function placeInitialMarqueeTile(state: GameState, move: PlaceInitialMarqueeTile) {
  if (state.players.find(player => player.color === move.playerId) === undefined) return console.error('Cannot apply', move, 'on', state, ': could not find player')
  if (![1, 6, 7, 12].includes(move.location)) return console.error('Invalid location ', move.location, ' for initial marquee tile')
  if (state.marquees[move.location].owner != PlayerColor.None) return console.error('Location already occupied ', move.location, 'for inital marquee')

  // record marquee for player
  state.marquees[move.location].owner = move.playerId

  if (state.activePlayer == state.startingPlayer) {
    setCurrentPhase(Phase.SelectSourceLocation, state)  // all players have placed their initial marquee, begin first turn of the game
  } else {
    state.activePlayer = getPreviousPlayer(state, state.activePlayer); // switch to next player in reverse order
  }
}

