import GameState from '../GameState'
import PlayerColor from '../PlayerColor'
import MoveType from './MoveType'

type ConvertGoldBar = {
  type: MoveType.ConvertGoldBar,
}

export default ConvertGoldBar

export function convertGoldBar(state: GameState, move: ConvertGoldBar): void {
  const player = state.players.find(player => player.color === state.activePlayer)
  if (player === undefined) return console.error('Cannot apply', move, 'on', state, ': could not find active player')
  if (!canTradeGoldBar(state, state.activePlayer)) return console.error('Active player cannot convert any gold bar !')

  const nextGoldBarPrice: number = getNextGoldBarPrice(state)
  player.goldPieces -= nextGoldBarPrice
  state.goldCubesInMiningBag += nextGoldBarPrice
  ++player.goldBars
  --state.goldBarsInBank
}

export function canTradeGoldBar(state: GameState, playerColor: PlayerColor): boolean {
  if (state.goldBarsInBank > 0) {
    const player = state.players.find(player => player.color === playerColor)
    if (player === undefined) {
      console.error('Could not find player' + playerColor)
      return false
    }
    return player.goldPieces >= getNextGoldBarPrice(state)
  }
  return false
}

export function getNextGoldBarPrice(state: GameState): number {
  return 9 - Math.ceil(state.goldBarsInBank * 0.5)
}