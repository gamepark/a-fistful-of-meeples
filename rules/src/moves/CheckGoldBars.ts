import GameState, { getNextPlayer } from '../GameState'
import MoveType from './MoveType'

type CheckGoldBars = {
  type: MoveType.CheckGoldBars,
}

export default CheckGoldBars

export function checkGoldBars(state: GameState, move: CheckGoldBars): void {
  const player = state.players.find(player => player.color === state.activePlayer)
  if (player === undefined) return console.error('Cannot apply', move, 'on', state, ': could not find active player')


  if (state.goldBarsInBank > 0) {
    const nextGoldBarPrice: number = 9 - Math.ceil(state.goldBarsInBank * 0.5)
    if (player.goldPieces >= nextGoldBarPrice) {
      player.goldPieces -= nextGoldBarPrice
      state.goldCubesInMiningBag += nextGoldBarPrice
      ++player.goldBars
      --state.goldBarsInBank
      return
    }
  }

  state.activePlayer = getNextPlayer(state, state.activePlayer)
}
