import GameState from '../GameState'
import MoveType from './MoveType'

type SendExtraMeeplesToSaloon = {
  type: MoveType.SendExtraMeeplesToSaloon
}

export default SendExtraMeeplesToSaloon

export function sendExtraMeeplesToSaloon(state: GameState): void {
  state.meeplesInHand.filter(meeple => meeple !== null).forEach(meeple => state.saloon.push(meeple!))
  state.meeplesInHand = []
}
