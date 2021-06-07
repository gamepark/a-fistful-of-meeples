import GameState, { Location_Graveyard, Location_Saloon, Location_Showdown0, Location_Showdown1, PendingEffectType } from '../GameState'
import MoveType from './MoveType'
import { getShootingSkill, getShowdownWinner, ShowdownResult } from '../Showdown'
import { drawCubesFromBag } from '../MiningBag'

type ResolveShowdown = {
  type: MoveType.ResolveShowdown,
}

export default ResolveShowdown


export function resolveShowdown(state: GameState): void {
  switch (getShowdownWinner(state)) {
    case ShowdownResult.Showdown0:
      state.pendingEffects.unshift({
        type: PendingEffectType.DrawFromBag,
        player: state.showdowns[0].owner,
        content: drawCubesFromBag(state, getShootingSkill(state.showdowns[1].meeple))
      })
      state.pendingEffects.unshift({
        type: PendingEffectType.MoveMeeples,
        meeples: state.showdowns[0].meeple,
        sourceLocation: Location_Showdown0,
        destinationLocation: Location_Saloon
      })
      state.pendingEffects.unshift({
        type: PendingEffectType.MoveMeeples,
        meeples: state.showdowns[1].meeple,
        sourceLocation: Location_Showdown1,
        destinationLocation: Location_Graveyard
      })
      break

    case ShowdownResult.Showdown1:
      state.pendingEffects.unshift({
        type: PendingEffectType.DrawFromBag,
        player: state.showdowns[1].owner,
        content: drawCubesFromBag(state, getShootingSkill(state.showdowns[0].meeple))
      })
      state.pendingEffects.unshift({
        type: PendingEffectType.MoveMeeples,
        meeples: state.showdowns[1].meeple,
        sourceLocation: Location_Showdown1,
        destinationLocation: Location_Saloon
      })
      state.pendingEffects.unshift({
        type: PendingEffectType.MoveMeeples,
        meeples: state.showdowns[0].meeple,
        sourceLocation: Location_Showdown0,
        destinationLocation: Location_Graveyard
      })
      break

    case ShowdownResult.None:
      state.pendingEffects.unshift({
        type: PendingEffectType.DrawFromBag,
        player: state.showdowns[0].owner,
        content: drawCubesFromBag(state, getShootingSkill(state.showdowns[1].meeple))
      })
      state.pendingEffects.unshift({
        type: PendingEffectType.DrawFromBag,
        player: state.showdowns[1].owner,
        content: drawCubesFromBag(state, getShootingSkill(state.showdowns[0].meeple))
      })
      state.pendingEffects.unshift({
        type: PendingEffectType.MoveMeeples,
        meeples: state.showdowns[0].meeple,
        sourceLocation: Location_Showdown0,
        destinationLocation: Location_Graveyard
      })
      state.pendingEffects.unshift({
        type: PendingEffectType.MoveMeeples,
        meeples: state.showdowns[1].meeple,
        sourceLocation: Location_Showdown1,
        destinationLocation: Location_Graveyard
      })
      break
  }
}
