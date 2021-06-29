import GameState, { Direction, Location_Showdown0, Location_Showdown1, getNextSpace, getPreviousSpace, PendingEffectType } from '../GameState'
import PlayerColor from '../PlayerColor'
import MoveType from './MoveType'
import Phase, { setCurrentPhase } from '../Phase'
import MeepleType from '../MeepleType'

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
  if (!((move.space >= 1 && move.space <= 12) || move.space == Location_Showdown0 || move.space == Location_Showdown1)) return console.error('Invalid space ', move.space, ' for placing meeple')

  let index: number = state.meeplesInHand.indexOf(move.meeple);
  if (index == -1) return console.error('No meeple of type ', move.meeple, ' in hand')

  // remove meeple from hand
  state.meeplesInHand[index] = state.meeplesInHand[state.meeplesInHand.length - 1]
  state.meeplesInHand.pop()

  // update gamestate
  state.previousMeeplePlacingSpace = move.space
  if (state.meeplePlacingDirection === Direction.None) {
    if (getNextSpace(state.meeplesSourceLocation, state) === move.space) {
      state.meeplePlacingDirection = Direction.Clockwise;
    } else if (getPreviousSpace(state.meeplesSourceLocation, state) === move.space) {
      state.meeplePlacingDirection = Direction.CounterClockwise;
    } else {
      return console.error('Unexpected space ', move.space, ' for second meeple')
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

  if (state.meeplesInHand.length == 0) {
    // no more meeples to place, time to resolve
    setCurrentPhase(Phase.ResolveMeeples, state)
  }
}

