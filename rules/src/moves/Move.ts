import PlaceInitialMarqueeTile from './PlaceInitialMarqueeTile'
import SelectSourceLocation from './SelectSourceLocation'
import PlaceMeeple from './PlaceMeeple'
import ChooseAnotherPlayerShowdownToken from './ChooseAnotherPlayerShowdownToken'
import ResolveMeeple from './ResolveMeeple'
import BuildOrUpgradeMarquee from './BuildOrUpgradeMarquee'
import DrawFromBag from './DrawFromBag'
import SendExtraMeeplesToSaloon from './SendExtraMeeplesToSaloon'
import MoveMeeples from './MoveMeeples'
import DynamiteExplosion from './DynamiteExplosion'
import RollShowdownDice from './RollShowdownDice'
import ResolveShowdown from './ResolveShowdown'
import RerollShowdownDice from './RerollShowdownDice'
import CheckGoldBars from './CheckGoldBars'
import MoveType from './MoveType'

/**
 * A "Move" is the combination of all the types of moves that exists in you game
 */
type Move = PlaceInitialMarqueeTile | SelectSourceLocation | PlaceMeeple | RollShowdownDice | ChooseAnotherPlayerShowdownToken | ResolveMeeple | BuildOrUpgradeMarquee
  | DrawFromBag | SendExtraMeeplesToSaloon | MoveMeeples | DynamiteExplosion | RerollShowdownDice | ResolveShowdown | CheckGoldBars

export default Move

export function isPlaceInitialMarqueeTileMove(move: Move): move is PlaceInitialMarqueeTile {
  return move.type === MoveType.PlaceInitialMarqueeTile
}

export function isSelectSourceLocationMove(move: Move): move is SelectSourceLocation {
  return move.type === MoveType.SelectSourceLocation
}

export function isPlaceMeepleMove(move: Move): move is PlaceMeeple {
  return move.type === MoveType.PlaceMeeple
}

export function isResolveMeepleMove(move: Move): move is ResolveMeeple {
  return move.type === MoveType.ResolveMeeple
}

export function isBuildOrUpgradeMarqueeMove(move: Move): move is BuildOrUpgradeMarquee {
  return move.type === MoveType.BuildOrUpgradeMarquee
}

export function isChooseAnotherPlayerShowdownTokenMove(move: Move): move is ChooseAnotherPlayerShowdownToken {
  return move.type === MoveType.ChooseAnotherPlayerShowdownToken
}

export function isRerollShowdownDiceMove(move: Move): move is RerollShowdownDice {
  return move.type === MoveType.RerollShowdownDice
}