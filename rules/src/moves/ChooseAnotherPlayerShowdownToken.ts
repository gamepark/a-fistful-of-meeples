import GameState, { Location_Showdown0, Location_Showdown1} from '../GameState'
import PlayerColor from '../PlayerColor'
import MoveType from './MoveType'

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
}

