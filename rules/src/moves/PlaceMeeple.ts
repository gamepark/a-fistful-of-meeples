import GameState, { Direction, Location_Showdown0, Location_Showdown1, PendingEffectType, Location_Saloon, Location_Jail, isBuildingLocation } from '../GameState'
import PlayerColor from '../PlayerColor'
import MoveType from './MoveType'
import MeepleType from '../MeepleType'
import { getNextEmptySpace, getPreviousEmptySpace, isSpaceEmpty } from '../Location'

type PlaceMeeple = {
  type: MoveType.PlaceMeeple
  playerId: PlayerColor
  indexInHand: number
  space: number
}

export default PlaceMeeple

export function getPlaceMeepleMove(player: PlayerColor, space: number, indexInHand: number): PlaceMeeple {
  return { type: MoveType.PlaceMeeple, playerId: player, space: space, indexInHand: indexInHand}
}

export function isValidSpaceToPlaceMeeple(space: number, state: GameState): boolean {
  if (!isSpaceEmpty(space, state))
    return false
  if (state.previousMeepleLocation === undefined) {
    console.error('Undefined previous meeple location')
    return false
  }

  // first meeple to be placed must be placed next to building they were taken from (or any space if taken from jail or saloon)
  // other meeples must follow the current placing direction

  switch (state.previousMeepleLocation) {
    case Location_Saloon:
    case Location_Jail:
      return (isBuildingLocation(space) || space === Location_Showdown0 || space === Location_Showdown1)
    default:
      return (state.meeplePlacingDirection !== Direction.Clockwise && space === getPreviousEmptySpace(state.previousMeepleLocation, state)) ||
        (state.meeplePlacingDirection !== Direction.CounterClockwise && space === getNextEmptySpace(state.previousMeepleLocation, state))
  }
}

function placeOnShowdownSpace(state: GameState, move: PlaceMeeple, showdownIndex: number, meeple: MeepleType) {
  if (state.showdowns[showdownIndex].meeple != undefined) return console.error('There is already a meeple on showdown space ', showdownIndex)

  state.showdowns[showdownIndex].meeple = meeple;
  if (meeple == MeepleType.Madame) {
    // shall Madame be placed on a showdown space, send her to saloon instead
    state.pendingEffects.unshift({
      type: PendingEffectType.MoveMeeples,
      meeples: MeepleType.Madame,
      sourceLocation: move.space,
      destinationLocation: Location_Saloon
    })
  } else {
    if (state.showdowns[1 - showdownIndex].owner != move.playerId) {
      state.showdowns[showdownIndex].owner = move.playerId;
    } else {
      // player already has placed his token on the other showdown space. He must choose another player to control this space
      state.pendingEffects.unshift({ type: PendingEffectType.ChooseAnotherPlayerShowdownToken, space: move.space })
    }
  }
}

export function placeMeeple(state: GameState, move: PlaceMeeple) {
  if (state.players.find(player => player.color === move.playerId) === undefined) return console.error('Cannot apply', move, 'on', state, ': could not find player')
  if (!((move.space >= 0 && move.space < 12) || move.space == Location_Showdown0 || move.space == Location_Showdown1)) return console.error('Invalid space ', move.space, ' for placing meeple')
  if (move.indexInHand < 0 || move.indexInHand >= state.meeplesInHand.length) return console.error('Invalid meeple index ', move.indexInHand, ', no such meeple in hand')
  if (state.meeplesInHand[move.indexInHand] === null) return console.error('Invalid meeple index ', move.indexInHand, ', this index is empty')

  // remove meeple from hand
  const meeple: MeepleType = state.meeplesInHand[move.indexInHand]!
  state.meeplesInHand[move.indexInHand] = null

  // update gamestate
  if (state.meeplePlacingDirection === undefined && (state.previousMeepleLocation !== Location_Saloon && state.previousMeepleLocation !== Location_Jail)) {
    if (getNextEmptySpace(state.previousMeepleLocation!, state) === move.space) {
      state.meeplePlacingDirection = Direction.Clockwise
    } else if (getPreviousEmptySpace(state.previousMeepleLocation!, state) === move.space) {
      state.meeplePlacingDirection = Direction.CounterClockwise
    } else if (isBuildingLocation(state.previousMeepleLocation!)) {
      return console.error('Unexpected space ', move.space, ' to place meeple')
    }
  }

  // place meeple
  switch (move.space) {
    case Location_Showdown0:
      placeOnShowdownSpace(state, move, 0, meeple)
      break
    case Location_Showdown1:
      placeOnShowdownSpace(state, move, 1, meeple)
      break
    default:
      state.doorways[move.space] = meeple
      break
  }
  state.previousMeepleLocation = move.space
}

