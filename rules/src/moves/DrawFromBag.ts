import GameState, { PendingEffect, PendingEffectType } from '../GameState'
import PlayerColor from '../PlayerColor'
import MiningBagContent from '../MiningBag'
import MoveType from './MoveType'

type DrawFromBag = {
  type: MoveType.DrawFromBag
  playerId: PlayerColor
  content: MiningBagContent[]
}

export default DrawFromBag

export function drawFromBag(state: GameState, move: DrawFromBag) {
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
}

export function getDrawFromBagPendingEffect(player: PlayerColor, amount: number): PendingEffect {
  return {
    type: PendingEffectType.DrawFromBag,
    player: player,
    amount: amount
  }
}
