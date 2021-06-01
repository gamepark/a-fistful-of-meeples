import GameState, { Direction, Location_None, Space_None, Space_Showdown1, Space_Showdown2, getNextSpace, getPreviousSpace } from '../GameState'
import PlayerColor from '../PlayerColor'
import MoveType from './MoveType'
import Phase from '../Phase'
import Meeple from '../Meeple'

/**
 * Here is a example a of move involving hidden information
 * On the backend side, there is no need to put the card inside the move. We know what it will be (first card on top of the deck)
 */
type PlaceMeeple = {
  type: MoveType.PlaceMeeple
  playerId: PlayerColor
  meeple: Meeple
  space: number
}

export default PlaceMeeple


function placeOnShowdownSpace(state: GameState, move: PlaceMeeple, showdownIndex: number) {
  if (state.showdowns[showdownIndex].meeple != Meeple.None) return console.error('There is already a meeple on showdown space ', showdownIndex)
  if (move.meeple == Meeple.Madame) {
    state.saloon.push(Meeple.Madame)  // shall Madame be placed on a showdown space, send her to saloon instead
  } else {
    state.showdowns[showdownIndex].meeple = move.meeple;
    if (state.showdowns[1 - showdownIndex].owner != move.playerId) {
      state.showdowns[showdownIndex].owner = move.playerId;
    } else {
      // player already has placed his token on the other showdown space. He must choose another player to control this space
      state.currentPhase = Phase.ChooseAnotherPlayerShowdownToken
    }
  }
}

export function placeMeeple(state: GameState, move: PlaceMeeple) {
  if (state.players.find(player => player.color === move.playerId) === undefined) return console.error('Cannot apply', move, 'on', state, ': could not find player')
  if (!((move.space >= 1 && move.space <= 12) || move.space == Space_Showdown1 || move.space == Space_Showdown2)) return console.error('Invalid space ', move.space, ' for placing meeple')

  let index = state.meeplesInHand.indexOf(move.meeple);
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
    case Space_Showdown1:
      placeOnShowdownSpace(state, move, 0)
      break
    case Space_Showdown2:
      placeOnShowdownSpace(state, move, 1)
      break
    default:
      state.doorways[move.space].push(move.meeple)
      break
  }

  if (state.meeplesInHand.length == 0 && state.currentPhase == Phase.PlaceMeeples) {
    // no more meeples to place, time to resolve
    state.currentPhase = Phase.ResolveMeeples
    state.meeplesSourceLocation = Location_None
    state.meeplePlacingDirection = Direction.None
    state.previousMeeplePlacingSpace = Space_None
  }
}

