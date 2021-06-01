import PlayerColor from './PlayerColor'
import Meeple from './Meeple'
import { AFistfulOfMeeplesPlayerOptions } from './AFistfulOfMeeplesOptions'

type PlayerState = {
    color: PlayerColor
    goldBars: number;
    goldPieces:	number;
}

export function initialisePlayerState(playerOptions: AFistfulOfMeeplesPlayerOptions): PlayerState {
    return {
        color: playerOptions.id,
        goldBars: 0,
        goldPieces: 0,
    };
}

export default PlayerState