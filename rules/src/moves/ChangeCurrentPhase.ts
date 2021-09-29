import GameState, { Direction, Location_None, PendingEffect, PendingEffectType } from '../GameState'
import Phase from '../Phase'
import PlayerColor from '../PlayerColor'
import MoveType from './MoveType'

type ChangeCurrentPhase = {
  type: MoveType.ChangeCurrentPhase,
  phase: Phase
}

export default ChangeCurrentPhase


export function changeCurrentPhase(state: GameState, move: ChangeCurrentPhase): void {
  switch (move.phase) {
    case Phase.PlaceInitialMarqueeTiles:
      break
    case Phase.SelectSourceLocation:
      break
    case Phase.PlaceMeeples:
      break
    case Phase.ResolveMeeples:
      state.meeplePlacingDirection = Direction.None
      state.previousMeepleLocation = Location_None
      break
    case Phase.CheckGoldBars:
      break
    case Phase.GameOver:
      state.activePlayer = PlayerColor.None
      break;
    default:
      return move.phase	// never guard
  }
  state.currentPhase = move.phase
}

export function getChangeCurrentPhasePendingEffect(phase: Phase): PendingEffect {
  return {
    type: PendingEffectType.ChangeCurrentPhase,
    phase: phase
  }
}
