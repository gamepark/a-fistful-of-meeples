/** @jsxImportSource @emotion/react */
import GameState from '@gamepark/a-fistful-of-meeples/GameState'
import { Player as PlayerInfo, usePlayers } from '@gamepark/react-client'
import {TFunction, useTranslation} from 'react-i18next'
import { getPlayerName } from '../../rules/src/AFistfulOfMeeplesOptions'
import Phase from '../../rules/src/Phase'
import PlayerColor from '../../rules/src/PlayerColor'

type Props = {
  loading: boolean
  game?: GameState
  player?: PlayerColor
}

export default function HeaderText({loading, game, player}: Props) {
  const { t } = useTranslation()
  const players = usePlayers<PlayerColor>()

  if (loading) return <>{t('Game loading...')}</>
  if (!game || !player) return null

  return <>{getText(t, game!, player!, players!)}</>
}

function getText(t: TFunction, game: GameState, player: PlayerColor, players:PlayerInfo<PlayerColor>[]) {
  const isActivePlayer: boolean = player === game.activePlayer
  const getName = (playerId: PlayerColor) => players.find(p => p.id === playerId)?.name || getPlayerName(playerId, t)

  if (game.pendingEffects.length > 0) {
  }
  
  switch (game.currentPhase) {
    case Phase.PlaceInitialMarqueeTiles:
      return isActivePlayer ? t('Select a building to place your initial marquee tile') : t('{player} has to select a building to place his initial marquee tile', { player: getName(game.activePlayer) })
    case Phase.SelectSourceLocation:
      return isActivePlayer ? t('Select a location from which to take meeples') : t('{player} has to select a building for their initial marquee tile', { player: getName(game.activePlayer) })
    case Phase.PlaceMeeples:
      return isActivePlayer ? t('Select a meeple and a location to put it on') : t('{player} has to select a meeple and a location to put it on', { player: getName(game.activePlayer) })
    case Phase.ResolveMeeples:
      return isActivePlayer ? t('Select a meeple to resolve') : t('{player} has to select a meeple to resolve', { player: getName(game.activePlayer) })
    case Phase.CheckGoldBars:
      return t('Checking for gold bars')
  }
  return ''
}
