import GameState from './GameState'
import Meeple from './Meeple'
import PlayerColor from './PlayerColor'

type ShowdownPlace = {
  meeple: Meeple
  owner: PlayerColor
  dice: number
}

export default ShowdownPlace

export enum ShowdownResult {
  None,
  Showdown0,
  Showdown1,
}

export function getShootingSkill(meeple: Meeple): number {
  switch (meeple) {
    case Meeple.Deputy:
      return 4
    case Meeple.Robber:
      return 3
    case Meeple.Miner:
      return 2
    case Meeple.Builder:
      return 1
    default:
      console.error('Unexpected meeple type, no shooting skill defined for ', meeple)
      return 0
  }
}

export function getShowdownHighestShootingSkill(state: GameState): ShowdownResult {
  const shootingSkill0 = getShootingSkill(state.showdowns[0].meeple)
  const shootingSkill1 = getShootingSkill(state.showdowns[1].meeple)

  if (shootingSkill0 > shootingSkill1)
    return ShowdownResult.Showdown0
  else if (shootingSkill0 < shootingSkill1)
    return ShowdownResult.Showdown1

  return ShowdownResult.None
}

export function getShowdownWinner(state: GameState): ShowdownResult {
  if (state.showdowns[0].dice > state.showdowns[1].dice)
    return ShowdownResult.Showdown0
  else if (state.showdowns[0].dice < state.showdowns[1].dice)
    return ShowdownResult.Showdown1
  else
    return getShowdownHighestShootingSkill(state)
}
