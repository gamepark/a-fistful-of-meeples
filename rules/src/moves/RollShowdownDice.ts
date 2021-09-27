import GameState, { Location_Showdown0, Location_Showdown1 } from '../GameState'
import MoveType from './MoveType'

type RollShowdownDice = {
  type: MoveType.RollShowdownDice
  value: number
  location: number
}

export default RollShowdownDice

export function rollShowdownDice(state: GameState, move: RollShowdownDice) {
  switch (move.location) {
    case Location_Showdown0:
      state.showdowns[0].dice = move.value
      break;
    case Location_Showdown1:
      state.showdowns[1].dice = move.value
      break;
    default:
      return console.error('Invalid location ', move.location, ' for rolling showdown dice')
  }
}
