import GameState, { Location_Showdown0, Location_Showdown1, canPayBuildingCost, PendingEffectType, Location_Jail, Location_Saloon, isBuildingLocation } from '../GameState'
import PlayerColor from '../PlayerColor'
import MoveType from './MoveType'
import Phase, { setCurrentPhase } from '../Phase'
import MeepleType from '../MeepleType'
import PlayerState from '../PlayerState'
import { getShowdownHighestShootingSkill, ShowdownResult } from '../Showdown'
import { getDrawFromBagPendingEffect } from './DrawFromBag'

/**
 * Here is a example a of move involving hidden information
 * On the backend side, there is no need to put the card inside the move. We know what it will be (first card on top of the deck)
 */
type ResolveMeeple = {
  type: MoveType.ResolveMeeple
  playerId: PlayerColor
  space: number
}

export default ResolveMeeple

export function resolveMeeple(state: GameState, move: ResolveMeeple) {
  const player = state.players.find(player => player.color === move.playerId)
  if (player === undefined) return console.error('Cannot apply', move, 'on', state, ': could not find player')
  if (!(isBuildingLocation(move.space) || move.space == Location_Showdown0 || move.space == Location_Showdown1)) return console.error('Invalid space ', move.space, ' for resolving meeple')

  switch (move.space) {
    case Location_Showdown0:
    case Location_Showdown1:
      state.pendingEffects.unshift({ type: PendingEffectType.ResolveShowdown })
      switch (getShowdownHighestShootingSkill(state)) {
        case ShowdownResult.Showdown0:
          state.pendingEffects.unshift({ type: PendingEffectType.ChooseToRerollShowdownDice, player: state.showdowns[0].owner })
          break
        case ShowdownResult.Showdown1:
          state.pendingEffects.unshift({ type: PendingEffectType.ChooseToRerollShowdownDice, player: state.showdowns[1].owner })
          break
        case ShowdownResult.None:
          break
      }
      state.pendingEffects.unshift({ type: PendingEffectType.RollShowdownDice, location: Location_Showdown1 })
      state.pendingEffects.unshift({ type: PendingEffectType.RollShowdownDice, location: Location_Showdown0 })
      break
    default:
      const meeple: MeepleType = state.doorways[move.space]
      if (meeple == MeepleType.None) return console.error('No meeple in doorway ', move.space)

      // remove meeple from doorway
      state.doorways[move.space] = MeepleType.None

      switch (meeple) {
        case MeepleType.Builder:
          let owner: PlayerState | undefined
          if (state.marquees[move.space].owner === PlayerColor.None) {
            // no marquee ? current player may build one
            owner = player
          } else if (state.marquees[move.space].upgraded === false) {
            // basic marquee ? owner may want to upgrade it
            owner = state.players.find(player => player.color === state.marquees[move.space].owner)
            if (owner === undefined) return console.error('Cannot apply', move, 'on', state, ': could not find player')
          }
          if (owner != undefined) {
            // if relevant player has enough resources to build or upgrade, let him choose
            if (canPayBuildingCost(owner, move.space)) {
              state.pendingEffects.unshift({
                type: PendingEffectType.BuildOrUpgradeMarquee, location: move.space
              })
            }
          }
          break;
        case MeepleType.Miner:
          if (state.marquees[move.space].owner !== PlayerColor.None) {
            state.pendingEffects.unshift(getDrawFromBagPendingEffect(state.marquees[move.space].owner, state.marquees[move.space].upgraded ? 4 : 2))
          }
          break;
        case MeepleType.Robber:
          {
            const numberOfMiners: number = state.buildings[move.space].filter(meeple => meeple === MeepleType.Miner).length
            if (numberOfMiners > 0) {
              state.pendingEffects.unshift(getDrawFromBagPendingEffect(state.activePlayer, 2 * numberOfMiners))
            }
          }
          break;
        case MeepleType.Deputy:
          {
            const numberOfRobbers: number = state.buildings[move.space].filter(meeple => meeple === MeepleType.Robber).length
            if (numberOfRobbers > 0) {
              state.pendingEffects.unshift({
                type: PendingEffectType.MoveMeeples,
                meeples: MeepleType.Robber,
                sourceLocation: move.space,
                destinationLocation: Location_Jail
              })
              state.pendingEffects.unshift(getDrawFromBagPendingEffect(state.activePlayer, 2 * numberOfRobbers))
            }
          }
          break;
        case MeepleType.Madame:
          {
            const numberOfBuilders: number = state.buildings[move.space].filter(meeple => meeple === MeepleType.Builder).length
            if (numberOfBuilders > 0) {
              state.pendingEffects.unshift({
                type: PendingEffectType.MoveMeeples,
                meeples: MeepleType.Builder,
                sourceLocation: move.space,
                destinationLocation: Location_Saloon
              })
              state.pendingEffects.unshift(getDrawFromBagPendingEffect(state.activePlayer, numberOfBuilders))
            }
          }
          break;
      }

      // move meeple inside the building
      state.buildings[move.space].push(meeple)
      break
  }

  if ((state.showdowns[0].meeple === MeepleType.None || state.showdowns[1].meeple === MeepleType.None) && state.doorways.every(doorway => doorway === MeepleType.None)) {
    // no more meeples to resolve : advance to next phase
    setCurrentPhase(Phase.CheckGoldBars, state)
  }
}

