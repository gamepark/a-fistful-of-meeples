import {OptionsSpec} from '@gamepark/rules-api'
import {TFunction} from 'i18next'
import GameState from './GameState'
import PlayerColor, {playerColors} from './PlayerColor'

export type AFistfulOfMeeplesPlayerOptions = { id: PlayerColor }

export type AFistfulOfMeeplesOptions = { players: AFistfulOfMeeplesPlayerOptions[] }

export function isGameOptions(arg: GameState | AFistfulOfMeeplesOptions): arg is AFistfulOfMeeplesOptions {
    return typeof (arg as GameState).goldBarsInBank === 'undefined'
}

export const AFistfulOfMeeplesOptionsSpec: OptionsSpec<AFistfulOfMeeplesOptions> = {
  players: {
    id: {
      label: (t: TFunction) => t('PlayerColors'),
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
  }
}