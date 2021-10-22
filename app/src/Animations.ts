import {Animations} from '@gamepark/react-client'
import GameState from '../../rules/src/GameState'
import Move from '../../rules/src/moves/Move'
import MoveType from '../../rules/src/moves/MoveType'
import PlayerColor from '../../rules/src/PlayerColor'

// noinspection JSUnusedGlobalSymbols
const AFistfulOfMeeplesAnimations: Animations<GameState, Move, PlayerColor> = {
  getAnimationDuration(move: Move, { action, state, playerId: currentPlayerId }) {
    switch (move.type) {
      case MoveType.MoveMeeples: {
        return (action.playerId === state.activePlayer && action.playerId === currentPlayerId) ? 0.5 : 0.3
      }
      default:
        return 0
    }
  },

  getUndoAnimationDuration(move: Move) {
    switch (move.type) {
      case MoveType.MoveMeeples:
      case MoveType.DrawFromBag:
        return 0.3
      default:
        return 0
    }
  }
}

export default AFistfulOfMeeplesAnimations