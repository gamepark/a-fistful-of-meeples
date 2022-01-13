import GameState, { Location_Showdown0, Location_Showdown1 } from '../GameState'
import MoveType from './MoveType'

type RollShowdownDice = {
  type: MoveType.RollShowdownDice
  value: number
  location: number
}

export default RollShowdownDice

export function getRollShowdownDiceMove(value: number, location: number): RollShowdownDice {
  return { type: MoveType.RollShowdownDice, value: value, location: location }
}

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

  if (state.tutorial !== undefined)
    state.tutorial++
}
