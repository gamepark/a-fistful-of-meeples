import GameState, { Location_Graveyard, Location_Saloon, Location_Showdown0, Location_Showdown1, PendingEffectType } from '../GameState'
import MoveType from './MoveType'
import { getShootingSkill, getShowdownWinner, ShowdownResult } from '../Showdown'
import { getDrawFromBagPendingEffect } from './DrawFromBag'

type ResolveShowdown = {
  type: MoveType.ResolveShowdown,
}

export default ResolveShowdown


export function resolveShowdown(state: GameState): void {
  const meeple0 = state.showdowns[0].meeple
  const meeple1 = state.showdowns[1].meeple
  if (meeple0 === undefined || meeple1 === undefined)
    return console.error('Unable to resolve showdown, meeples are ', meeple0, ' and ', meeple1)

  switch (getShowdownWinner(state)) {
    case ShowdownResult.Showdown0:
      state.pendingEffects.unshift(getDrawFromBagPendingEffect(state.showdowns[0].owner!, getShootingSkill(meeple1)))
      state.pendingEffects.unshift({
        type: PendingEffectType.MoveMeeples,
        meeples: meeple0,
        sourceLocation: Location_Showdown0,
        destinationLocation: Location_Saloon
      })
      state.pendingEffects.unshift({
        type: PendingEffectType.MoveMeeples,
        meeples: state.showdowns[1].meeple!,
        sourceLocation: Location_Showdown1,
        destinationLocation: Location_Graveyard
      })
      break

    case ShowdownResult.Showdown1:
      state.pendingEffects.unshift(getDrawFromBagPendingEffect(state.showdowns[1].owner!, getShootingSkill(meeple0)))
      state.pendingEffects.unshift({
        type: PendingEffectType.MoveMeeples,
        meeples: meeple1,
        sourceLocation: Location_Showdown1,
        destinationLocation: Location_Saloon
      })
      state.pendingEffects.unshift({
        type: PendingEffectType.MoveMeeples,
        meeples: meeple0,
        sourceLocation: Location_Showdown0,
        destinationLocation: Location_Graveyard
      })
      break

    case ShowdownResult.None:
      state.pendingEffects.unshift(getDrawFromBagPendingEffect(state.showdowns[0].owner!, getShootingSkill(meeple1)))
      state.pendingEffects.unshift(getDrawFromBagPendingEffect(state.showdowns[1].owner!, getShootingSkill(meeple0)))
      state.pendingEffects.unshift({
        type: PendingEffectType.MoveMeeples,
        meeples: meeple0,
        sourceLocation: Location_Showdown0,
        destinationLocation: Location_Graveyard
      })
      state.pendingEffects.unshift({
        type: PendingEffectType.MoveMeeples,
        meeples: meeple1,
        sourceLocation: Location_Showdown1,
        destinationLocation: Location_Graveyard
      })
      break
  }
}
