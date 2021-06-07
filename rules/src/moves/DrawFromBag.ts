import GameState, { PendingEffectType } from '../GameState'
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
        break
      case MiningBagContent.Stone:
        ++player.stones
        break
      case MiningBagContent.Dynamite:
        state.pendingEffects.unshift({ type: PendingEffectType.DynamiteExplosion })
        break
    }
  })
}
