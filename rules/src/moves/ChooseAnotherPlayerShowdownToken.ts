import GameState, { Direction, Location_None, Space_None, Space_Showdown1, Space_Showdown2, getNextSpace, getPreviousSpace } from '../GameState'
import PlayerColor from '../PlayerColor'
import MoveType from './MoveType'
import Phase from '../Phase'
import Meeple from '../Meeple'

/**
 * Here is a example a of move involving hidden information
 * On the backend side, there is no need to put the card inside the move. We know what it will be (first card on top of the deck)
 */
type ChooseAnotherPlayerShowdownToken = {
  type: MoveType.PlaceMeeple
  playerId: PlayerColor
}

export default ChooseAnotherPlayerShowdownToken

export function chooseAnotherPlayerToPlaceShowdownToken(state: GameState, move: ChooseAnotherPlayerShowdownToken) {
  if (state.players.find(player => player.color === move.playerId) === undefined) return console.error('Cannot apply', move, 'on', state, ': could not find player')

  if (state.previousMeeplePlacingSpace === Space_Showdown1) {
    state.showdowns[0].owner = move.playerId;
  } else if (state.previousMeeplePlacingSpace === Space_Showdown2) {
    state.showdowns[1].owner = move.playerId;
  }

  if (state.meeplesInHand.length == 0) {
    // no more meeples to place, time to resolve
    state.currentPhase = Phase.ResolveMeeples
    state.meeplesSourceLocation = Location_None
    state.meeplePlacingDirection = Direction.None
    state.previousMeeplePlacingSpace = Space_None
  } else {
    // place remaining meeples
    state.currentPhase = Phase.PlaceMeeples
  }
}

