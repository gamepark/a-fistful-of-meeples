import {OptionsSpec} from '@gamepark/rules-api'
import {TFunction} from 'i18next'
import GameState from './GameState'
import PlayerColor, {playerColors} from './PlayerColor'

/**
 * This is the options for each players in the game.
 */
export type AFistfulOfMeeplesPlayerOptions = { id: PlayerColor }

/**
 * This is the type of object that the game receives when a new game is started.
 * The first generic parameter, "{}", can be changed to include game options like variants or expansions.
 */
export type AFistfulOfMeeplesOptions = { players: AFistfulOfMeeplesPlayerOptions[] }

/**
 * Typeguard to help Typescript distinguish between a GameState and new game's options, for you main class constructor.
 * @param arg GameState or Game options
 * @return true if arg is a Game options
 */
export function isGameOptions(arg: GameState | AFistfulOfMeeplesOptions): arg is AFistfulOfMeeplesOptions {
    return typeof (arg as GameState).goldBarsInBank === 'undefined'
}

/**
 * This object describes all the options a game can have, and will be used by GamePark website to create automatically forms for you game
 * (forms for friendly games, or forms for matchmaking preferences, for instance).
 */
export const AFistfulOfMeeplesOptionsDescription: OptionsSpec<AFistfulOfMeeplesOptions> = {
  players: {
    id: {
      label: (t: TFunction) => t('Color'),
      values: playerColors,
      valueSpec: color => ({ label: t => getPlayerName(color, t) })
    }
  }
}

export function getPlayerName(playerId: PlayerColor, t: TFunction): string {
  switch (playerId) {
    case PlayerColor.Orange:
      return t('Orange player')
    case PlayerColor.Green:
      return t('Green player')
    case PlayerColor.Grey:
      return t('Grey player')
    case PlayerColor.Black:
      return t('Black player')
    default:
      return playerId
  }
}