import GameState, { Location_Showdown0, Location_Showdown1 } from '../GameState'
import MoveType from './MoveType'

type RollShowdownDice = {
  type: MoveType.RollShowdownDice
  location: number
}

export default RollShowdownDice

export type RollShowdownDiceRandomized = RollShowdownDice & {
  value: number
}

export function getRollShowdownDiceMove(location: number): RollShowdownDice {
  return { type: MoveType.RollShowdownDice, location: location }
}

export function rollShowdownDice(state: GameState, move: RollShowdownDiceRandomized) {
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
