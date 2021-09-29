import GameState, { Location_Jail, Location_Saloon } from '../GameState'
import PlayerColor from '../PlayerColor'
import MoveType from './MoveType'
import Phase from '../Phase'
import { getChangeCurrentPhasePendingEffect } from './ChangeCurrentPhase'

/**
 * Here is a example a of move involving hidden information
 * On the backend side, there is no need to put the card inside the move. We know what it will be (first card on top of the deck)
 */
type SelectSourceLocation = {
  type: MoveType.SelectSourceLocation
  playerId: PlayerColor
  location: number
}

export default SelectSourceLocation

export function selectSourceLocation(state: GameState, move: SelectSourceLocation) {
  if (state.players.find(player => player.color === move.playerId) === undefined) return console.error('Cannot apply', move, 'on', state, ': could not find player')
  if (!((move.location >= 0 && move.location < 12) || move.location == Location_Saloon || move.location == Location_Jail)) return console.error('Invalid location ', move.location, ' for taking meeples')

  switch (move.location) {
    case Location_Saloon:
      state.meeplesInHand = state.saloon;
      state.saloon = []
      break
    case Location_Jail:
      state.meeplesInHand = state.jail
      state.jail = []
      if (state.dynamitesInJail > 0) {
        --state.dynamitesInJail
        ++state.dynamitesInMiningBag
      }
      break
    default:
      state.meeplesInHand = state.buildings[move.location]
      state.buildings[move.location] = []
      break
  }

  if (state.meeplesInHand.length == 0) return console.error('No meeple in source location ', move.location)

  state.previousMeepleLocation = move.location
  state.pendingEffects.push(getChangeCurrentPhasePendingEffect(Phase.PlaceMeeples))
}

