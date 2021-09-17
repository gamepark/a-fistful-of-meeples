import GameState, { Location_Showdown0, Location_Showdown1} from '../GameState'
import Phase, { setCurrentPhase } from '../Phase'
import PlayerColor from '../PlayerColor'
import MoveType from './MoveType'

/**
 * Here is a example a of move involving hidden information
 * On the backend side, there is no need to put the card inside the move. We know what it will be (first card on top of the deck)
 */
type ChooseAnotherPlayerShowdownToken = {
  type: MoveType.ChooseAnotherPlayerShowdownToken
  playerId: PlayerColor
}

export default ChooseAnotherPlayerShowdownToken

export function getChooseAnotherPlayerShowdownTokenMove(player: PlayerColor): ChooseAnotherPlayerShowdownToken {
  return { type: MoveType.ChooseAnotherPlayerShowdownToken, playerId: player }
}

export function chooseAnotherPlayerToPlaceShowdownToken(state: GameState, move: ChooseAnotherPlayerShowdownToken) {
  if (state.players.find(player => player.color === move.playerId) === undefined) return console.error('Cannot apply', move, 'on', state, ': could not find player')

  if (state.previousMeepleLocation === Location_Showdown0) {
    state.showdowns[0].owner = move.playerId;
  } else if (state.previousMeepleLocation === Location_Showdown1) {
    state.showdowns[1].owner = move.playerId;
  }

  if (state.meeplesInHand.length === 0)  // if it was the last meeple placed who triggered this, go to resolution phase
    setCurrentPhase(Phase.ResolveMeeples, state)
}

