import GameState from '../GameState'
import MoveType from './MoveType'
import MeepleType from '../MeepleType'

type SendExtraMeeplesToSaloon = {
  type: MoveType.SendExtraMeeplesToSaloon
}

export default SendExtraMeeplesToSaloon

export function sendExtraMeeplesToSaloon(state: GameState): void {
  state.meeplesInHand.filter(meeple => meeple !== MeepleType.None).forEach(meeple => state.saloon.push(meeple))
  state.meeplesInHand = []
}
