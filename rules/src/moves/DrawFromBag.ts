import GameState, { PendingEffect, PendingEffectType } from '../GameState'
import PlayerColor from '../PlayerColor'
import MiningBagContent from '../MiningBag'
import MoveType from './MoveType'

type DrawFromBag = {
  type: MoveType.DrawFromBag
  playerId: PlayerColor
}

export default DrawFromBag

export type DrawFromBagRandomized = DrawFromBag & {
  content: MiningBagContent[]
}

export function getDrawFromBagMove(playerId: PlayerColor): DrawFromBag {
  return { type: MoveType.DrawFromBag, playerId: playerId }
}

export function drawFromBag(state: GameState, move: DrawFromBagRandomized) {
  const player = state.players.find(player => player.color === move.playerId)
  if (player === undefined) return console.error('Cannot apply', move, 'on', state, ': could not find player')

  move.content.forEach(content => {
    switch (content) {
      case MiningBagContent.Gold:
        ++player.goldPieces
        --state.goldCubesInMiningBag
        break
      case MiningBagContent.Stone:
        ++player.stones
        --state.stoneCubesInMiningBag
        break
      case MiningBagContent.Dynamite:
        --state.dynamitesInMiningBag
        state.pendingEffects.unshift({ type: PendingEffectType.DynamiteExplosion })
        break
    }
  })

  if (state.tutorial !== undefined)
    state.tutorial++
}

export function getDrawFromBagPendingEffect(player: PlayerColor, amount: number): PendingEffect {
  return {
    type: PendingEffectType.DrawFromBag,
    player: player,
    amount: amount
  }
}
