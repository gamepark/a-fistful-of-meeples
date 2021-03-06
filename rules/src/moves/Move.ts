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
import ConvertGoldBar from './ConvertGoldBar'
import MoveType from './MoveType'
import ChangeCurrentPhase from './ChangeCurrentPhase'

type Move = PlaceInitialMarqueeTile | SelectSourceLocation | PlaceMeeple | RollShowdownDice | ChooseAnotherPlayerShowdownToken | ResolveMeeple | BuildOrUpgradeMarquee
  | DrawFromBag | SendExtraMeeplesToSaloon | MoveMeeples | ChangeCurrentPhase | DynamiteExplosion | RerollShowdownDice | ResolveShowdown | ConvertGoldBar

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

export function isChangeCurrentPhaseMove(move: Move): move is ChangeCurrentPhase {
  return move.type === MoveType.ChangeCurrentPhase
}

export function isMoveMeeplesMove(move: Move): move is MoveMeeples {
  return move.type === MoveType.MoveMeeples
}

export function isDrawFromBagMove(move: Move): move is DrawFromBag {
  return move.type === MoveType.DrawFromBag
}

export function isDynamiteExplosion(move: Move): move is DynamiteExplosion {
  return move.type === MoveType.DynamiteExplosion
}

export function isRollShowdownDiceMove(move: Move): move is RollShowdownDice {
  return move.type === MoveType.RollShowdownDice
}

export function isRerollShowdownDiceMove(move: Move): move is RerollShowdownDice {
  return move.type === MoveType.RerollShowdownDice
}

export function isConvertGoldBar(move: Move): move is ConvertGoldBar {
  return move.type === MoveType.ConvertGoldBar
}