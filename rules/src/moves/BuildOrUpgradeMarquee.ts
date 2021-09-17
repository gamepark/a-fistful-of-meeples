import GameState, { BuildingCosts, canPayBuildingCost } from '../GameState'
import PlayerColor from '../PlayerColor'
import MoveType from './MoveType'

type BuildOrUpgradeMarquee = {
  type: MoveType.BuildOrUpgradeMarquee
  playerId: PlayerColor
  space: number
  build: boolean
}

export default BuildOrUpgradeMarquee

export function getBuildOrUpgradeMarqueeMove(player: PlayerColor, space: number, build: boolean): BuildOrUpgradeMarquee {
  return { type: MoveType.BuildOrUpgradeMarquee,  playerId: player, space: space, build: build}
}

export function buildOrUpgradeMarquee(state: GameState, move: BuildOrUpgradeMarquee) {
  const player = state.players.find(player => player.color === move.playerId)
  if (player === undefined) return console.error('Cannot apply', move, 'on', state, ': could not find player')
  if (move.space < 1 || move.space > 12) return console.error('Invalid space ', move.space, ' to build or upgrade marquee')
  if (state.marquees[move.space].owner != PlayerColor.None && state.marquees[move.space].owner != move.playerId) return console.error('Player ', move.playerId, ' cannot upgrade a marquee belonging to ', state.marquees[move.space].owner)

  if (move.build) {
    if (!canPayBuildingCost(player, move.space)) return console.error('Player ', player, ' doesn\'t have enough resources to build or upgrade marquee in ', move.space)

    // pay resources
    player.goldPieces -= BuildingCosts[move.space].gold
    state.goldCubesInMiningBag += BuildingCosts[move.space].gold
    player.stones -= BuildingCosts[move.space].stones
    state.stoneCubesInMiningBag += BuildingCosts[move.space].stones

    if (state.marquees[move.space].owner == PlayerColor.None) {
      // build marquee
      state.marquees[move.space].owner = player.color
    } else {
      // upgrademarquee
      state.marquees[move.space].upgraded = true
    }
  }
}

