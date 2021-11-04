/** @jsxImportSource @emotion/react */
import GameState, { PendingEffectType } from '@gamepark/a-fistful-of-meeples/GameState'
import { Animation, Player as PlayerInfo, useAnimation, usePlayers } from '@gamepark/react-client'
import {TFunction, useTranslation} from 'react-i18next'
import { getPlayerName } from '../../rules/src/AFistfulOfMeeplesOptions'
import Move from '../../rules/src/moves/Move'
import MoveType from '../../rules/src/moves/MoveType'
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
  const animation = useAnimation<Move>()

  if (loading) return <>{t('Game loading...')}</>
  if (!game || !player) return null

  return <>{getText(t, game!, player!, players!, animation)}</>
}

function getText(t: TFunction, game: GameState, player: PlayerColor, players: PlayerInfo<PlayerColor>[], animation?: Animation<Move>): string {
  const isActivePlayer: boolean = player === game.activePlayer
  const getName = (playerId: PlayerColor) => players.find(p => p.id === playerId)?.name || getPlayerName(playerId, t)

  if (animation !== undefined) {
    switch (animation.move.type) {
      case MoveType.PlaceInitialMarqueeTile:
        return t('Building initial marquee tile')
      case MoveType.BuildOrUpgradeMarquee:
        return t('Building or upgrading marquee')
      case MoveType.ChangeCurrentPhase:
        return t('Changing current phase')
      default:
        return ''
    }
  }

  if (game.pendingEffects.length > 0) {
    switch (game.pendingEffects[0].type) {
      case PendingEffectType.BuildOrUpgradeMarquee:
        return isActivePlayer ? t('Choose if you want to build or upgrade a marquee') : t('{player} has to choose whether if wants to build or upgrade a marquee', { player: getName(game.activePlayer) })
      case PendingEffectType.ChooseAnotherPlayerShowdownToken:
        return isActivePlayer ? t('Choose another player to place his Showdown token') : t('{player} has to choose another player to place his Showdown token', { player: getName(game.activePlayer) })
      case PendingEffectType.ChooseToRerollShowdownDice:
        return isActivePlayer ? t('You may choose to reroll your Showdown dice') : t('{player} has to choose whether to reroll his showdown dice', { player: getName(game.activePlayer) })
      case PendingEffectType.DrawFromBag:
        return t('Drawing pieces from the Mining Bag...')
      case PendingEffectType.DynamiteExplosion:
        return t('Dynamite explosion !')
      case PendingEffectType.MoveMeeples:
        return t('Moving meeples...')
      case PendingEffectType.ResolveShowdown:
        return t('Resolving Showdown...')
      case PendingEffectType.RollShowdownDice:
        return t('Rolling dices...')
      default:
        return game.pendingEffects[0]
    }
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
    case Phase.GameOver:
      return t('Game is over')
    default:
      return game.currentPhase
  }
}
