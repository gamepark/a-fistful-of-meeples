import PlayerColor from './PlayerColor'

type PlayerState = {
  color: PlayerColor
  goldBars: number
  goldPieces: number
  stones: number
}

export function initialisePlayerState(color: PlayerColor): PlayerState {
  return {
    color: color,
    goldBars: 0,
    goldPieces: 0,
    stones: 0
  };
}

export default PlayerState