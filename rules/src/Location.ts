import GameState, { Location_Showdown0, Location_Showdown1 } from "./GameState";
import MeepleType from "./MeepleType";


export function getNextEmptySpace(space: number, state: GameState): number {
  switch (space) {
    case Location_Showdown0:
      return 0
    case 5:
      return (state.showdowns[1].meeple === MeepleType.None) ? Location_Showdown1 : 6
    case Location_Showdown1:
      return 6
    case 11:
      return (state.showdowns[0].meeple === MeepleType.None) ? Location_Showdown0 : 0
    default:
      return space + 1;
  }
}

export function getPreviousEmptySpace(space: number, state: GameState): number {
  switch (space) {
    case Location_Showdown0:
      return 11
    case 6:
      return (state.showdowns[1].meeple === MeepleType.None) ? Location_Showdown1 : 5
    case Location_Showdown1:
      return 5
    case 0:
      return (state.showdowns[0].meeple === MeepleType.None) ? Location_Showdown0 : 11
    default:
      return space - 1;
  }
}

export function isSpaceEmpty(space: number, state: GameState): boolean {
  switch (space) {
    case Location_Showdown0:
      return state.showdowns[0].meeple === MeepleType.None
    case Location_Showdown1:
      return state.showdowns[1].meeple === MeepleType.None
    default:
      return state.doorways[space] == MeepleType.None
  }
}



