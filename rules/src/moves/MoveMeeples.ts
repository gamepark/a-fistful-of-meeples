import GameState, { Location_Graveyard, Location_Jail, Location_Saloon, Location_Showdown0, Location_Showdown1 } from '../GameState'
import MeepleType from '../MeepleType'
import PlayerColor from '../PlayerColor'
import MoveType from './MoveType'

type MoveMeeples = {
  type: MoveType.MoveMeeples,
  meeples: MeepleType,
  source: number,
  destination: number
}

export default MoveMeeples

export function moveMeeples(state: GameState, move: MoveMeeples): void {
  let numberOfMeeples: number

  if (move.meeples === MeepleType.None)
    return console.error('Moving meeple of type "None" from ' + move.source + ' to ' + move.destination)

  switch (move.source) {
    case Location_Showdown0:
      numberOfMeeples = 1
      state.showdowns[0] = { meeple: MeepleType.None, owner: PlayerColor.None, dice: 0 }
      break;
    case Location_Showdown1:
      numberOfMeeples = 1
      state.showdowns[1] = { meeple: MeepleType.None, owner: PlayerColor.None, dice: 0 }
      break;
    default:
      numberOfMeeples = state.buildings[move.source].filter(meeple => meeple === move.meeples).length
      state.buildings[move.source] = state.buildings[move.source].filter(meeple => meeple !== move.meeples)
      break;
  }

  switch (move.destination) {
    case Location_Jail:
      for (let i: number = 0; i < numberOfMeeples; ++i)
        state.jail.push(move.meeples)
      break;

    case Location_Saloon:
      for (let i: number = 0; i < numberOfMeeples; ++i)
        state.saloon.push(move.meeples)
      break;

    case Location_Graveyard:
      for (let i: number = 0; i < numberOfMeeples; ++i) {
        if (state.graveyard.length < 6) {
          state.graveyard.push(move.meeples)
        }
      }
      break

    default:
      return console.error('Unexpected meeples destination in ', move)
  }
}
