import GameState, { getNextPlayer } from '../GameState'
import Phase from '../Phase'
import MoveType from './MoveType'

type ChangeCurrentPhase = {
  type: MoveType.ChangeCurrentPhase,
  phase: Phase
}

export default ChangeCurrentPhase

export function getChangeCurrentPhaseMove(phase: Phase): ChangeCurrentPhase {
  return {
    type: MoveType.ChangeCurrentPhase,
    phase: phase
  }
}

export function changeCurrentPhase(state: GameState, move: ChangeCurrentPhase): void {
  switch (move.phase) {
    case Phase.PlaceInitialMarqueeTiles:
      break
    case Phase.SelectSourceLocation:
      if (state.currentPhase !== Phase.PlaceInitialMarqueeTiles)
        state.activePlayer = getNextPlayer(state, state.activePlayer!)
      break
    case Phase.PlaceMeeples:
      break
    case Phase.ResolveMeeples:
      state.meeplePlacingDirection = undefined
      state.previousMeepleLocation = undefined
      state.meeplesInHand = []
      break
    case Phase.CheckGoldBars:
      break
    case Phase.GameOver:
      state.activePlayer = undefined
      break;
    default:
      return move.phase	// never guard
  }
  state.currentPhase = move.phase
}
