import {Animations} from '@gamepark/react-client'
import GameState, { Location_Jail } from '../../rules/src/GameState'
import Move, { isBuildOrUpgradeMarqueeMove, isSelectSourceLocationMove } from '../../rules/src/moves/Move'
import MoveType from '../../rules/src/moves/MoveType'
import PlayerColor from '../../rules/src/PlayerColor'

// noinspection JSUnusedGlobalSymbols
const AFistfulOfMeeplesAnimations: Animations<GameState, Move, PlayerColor> = {
  getAnimationDuration(move: Move, { action, state, playerId: currentPlayerId }) {
    const isActivePlayer = action.playerId === state.activePlayer && action.playerId === currentPlayerId
    switch (move.type) {
      case MoveType.PlaceInitialMarqueeTile:
        return isActivePlayer ? 2 : 3
      case MoveType.SelectSourceLocation:
        return (isSelectSourceLocationMove(move) && move.location === Location_Jail) ? 2 : (isActivePlayer ? 0.3 : 0.5)
      case MoveType.PlaceMeeple:
        return isActivePlayer ? 0.1 : 0.5
      case MoveType.ChooseAnotherPlayerShowdownToken:
        return 0
      case MoveType.ResolveMeeple:
        return isActivePlayer ? 0.3 : 0.5
      case MoveType.BuildOrUpgradeMarquee:
        if (isBuildOrUpgradeMarqueeMove(move) && move.build) {
          if (state.marquees[move.space].owner === undefined) // build
            return isActivePlayer ? 2 : 3
          else // upgrade
            return isActivePlayer ? 1 : 2
        }
        return 0
      case MoveType.RerollShowdownDice:
        return 0
      case MoveType.DrawFromBag:
        return 2
      case MoveType.SendExtraMeeplesToSaloon:
        return 0    // TODO
      case MoveType.DynamiteExplosion:
        return 2.5

      case MoveType.MoveMeeples:
        return isActivePlayer ? 1 : 2
      case MoveType.ChangeCurrentPhase:
        return 0
      case MoveType.ResolveShowdown:
        return 0    // TODO
      case MoveType.RollShowdownDice:
        return 2.5
      case MoveType.ConvertGoldBar:
        return 2.5
      default:
        return move
    }
  },

  getUndoAnimationDuration(move: Move) {
    switch (move.type) {
      default:
        return 0
    }
  }
}

export default AFistfulOfMeeplesAnimations