import GameState from '../GameState'
import MoveType from './MoveType'
import Phase, { setCurrentPhase } from '../Phase'

type SendExtraMeeplesToSaloon = {
  type: MoveType.SendExtraMeeplesToSaloon
}

export default SendExtraMeeplesToSaloon

export function sendExtraMeeplesToSaloon(state: GameState): void {
  state.meeplesInHand.forEach(meeple => state.saloon.push(meeple))
  state.meeplesInHand = []
  setCurrentPhase(Phase.ResolveMeeples, state)
}
