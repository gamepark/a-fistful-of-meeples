import GameState from '../GameState'
import MoveType from './MoveType'

type DynamiteExplosion = {
  type: MoveType.DynamiteExplosion,
}

export default DynamiteExplosion

export function dynamiteExplosion(state: GameState): void {
  state.players.forEach(player => {
    const loss = player.stones >> 1
    state.stoneCubesInMiningBag += loss
    player.stones -= loss
  })
}
