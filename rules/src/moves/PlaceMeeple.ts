import GameState, { Direction, Location_Showdown0, Location_Showdown1, PendingEffectType, Location_Saloon, Location_Jail, isBuildingLocation } from '../GameState'
import PlayerColor from '../PlayerColor'
import MoveType from './MoveType'
import MeepleType from '../MeepleType'
import { getNextEmptySpace, getPreviousEmptySpace, isSpaceEmpty } from '../Location'

/**
 * Here is a example a of move involving hidden information
 * On the backend side, there is no need to put the card inside the move. We know what it will be (first card on top of the deck)
 */
type PlaceMeeple = {
  type: MoveType.PlaceMeeple
  playerId: PlayerColor
  meeple: MeepleType
  space: number
}

export default PlaceMeeple

export function getPlaceMeepleMove(player: PlayerColor, space: number, meeple: MeepleType): PlaceMeeple {
  return { type: MoveType.PlaceMeeple, playerId: player, space: space, meeple: meeple }
}

export function isValidSpaceToPlaceMeeple(space: number, state: GameState): boolean {
  if (!isSpaceEmpty(space, state))
    return false

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

function placeOnShowdownSpace(state: GameState, move: PlaceMeeple, showdownIndex: number) {
  if (state.showdowns[showdownIndex].meeple != MeepleType.None) return console.error('There is already a meeple on showdown space ', showdownIndex)
  if (move.meeple == MeepleType.Madame) {
    state.saloon.push(MeepleType.Madame)  // shall Madame be placed on a showdown space, send her to saloon instead
  } else {
    state.showdowns[showdownIndex].meeple = move.meeple;
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

  let index: number = state.meeplesInHand.indexOf(move.meeple);
  if (index == -1) return console.error('No meeple of type ', move.meeple, ' in hand')

  // remove meeple from hand
  state.meeplesInHand[index] = MeepleType.None

  // update gamestate
  if (state.meeplePlacingDirection === Direction.None) {
    if (getNextEmptySpace(state.previousMeepleLocation, state) === move.space) {
      state.meeplePlacingDirection = Direction.Clockwise;
    } else if (getPreviousEmptySpace(state.previousMeepleLocation, state) === move.space) {
      state.meeplePlacingDirection = Direction.CounterClockwise;
    } else if (isBuildingLocation(state.previousMeepleLocation)) {
      return console.error('Unexpected space ', move.space, ' to place meeple')
    }
  }

  // place meeple
  switch (move.space) {
    case Location_Showdown0:
      placeOnShowdownSpace(state, move, 0)
      break
    case Location_Showdown1:
      placeOnShowdownSpace(state, move, 1)
      break
    default:
      state.doorways[move.space] = move.meeple
      break
  }
  state.previousMeepleLocation = move.space
}

