import GameState, { Location_Showdown0, Location_Showdown1, PendingEffectType } from '../GameState'
import MoveType from './MoveType'
import { getShowdownHighestShootingSkill, ShowdownResult } from '../Showdown'

type RerollShowdownDice = {
  type: MoveType.RerollShowdownDice,
  reroll: boolean
}

export default RerollShowdownDice

export function getRerollShowdownDiceMove(reroll: boolean): RerollShowdownDice {
  return { type: MoveType.RerollShowdownDice, reroll: reroll }
}


export function rerollShowdownDice(state: GameState, move: RerollShowdownDice) {
  if (move.reroll) {
    if (getShowdownHighestShootingSkill(state) == ShowdownResult.Showdown0)
      state.pendingEffects.unshift({ type: PendingEffectType.RollShowdownDice, location: Location_Showdown0 })
    else if (getShowdownHighestShootingSkill(state) == ShowdownResult.Showdown1)
      state.pendingEffects.unshift({ type: PendingEffectType.RollShowdownDice, location: Location_Showdown1 })
    else
      console.error('Could not reroll showdown dice : both meeples are equally skilled (that shall not happen !) ', state.showdowns)
  }
}

