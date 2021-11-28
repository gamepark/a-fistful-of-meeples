/** @jsxImportSource @emotion/react */
import GameState, { getPlayerScore, PendingEffectType } from '@gamepark/a-fistful-of-meeples/GameState'
import { Player as PlayerInfo, useAnimation, usePlayers, Animation } from '@gamepark/react-client'
import {TFunction, useTranslation} from 'react-i18next'
import AFistfulOfMeeples from '../../rules/src/AFistfulOfMeeples'
import { getPlayerName } from '../../rules/src/AFistfulOfMeeplesOptions'
import ConvertGoldBar, { getNextGoldBarPrice } from '../../rules/src/moves/ConvertGoldBar'
import MoveType from '../../rules/src/moves/MoveType'
import Phase from '../../rules/src/Phase'
import PlayerColor from '../../rules/src/PlayerColor'
import PlayerState from '../../rules/src/PlayerState'

type Props = {
  loading: boolean
  game?: GameState
  player?: PlayerColor
}

export default function HeaderText({loading, game, player}: Props) {
  const { t } = useTranslation()
  const players = usePlayers<PlayerColor>()
  const animation = useAnimation<ConvertGoldBar>(animation => animation?.action.cancelled ?? true)

  if (loading) return <>{t('Game loading...')}</>
  if (!game || !player) return null

  return <>{getText(t, game!, player!, players!, animation)}</>
}

function getText(t: TFunction, game: GameState, player: PlayerColor, players: PlayerInfo<PlayerColor>[], animation?: Animation<ConvertGoldBar, any>): string {
  const getName = (playerId: PlayerColor) => players.find(p => p.id === playerId)?.name || getPlayerName(playerId, t)
  const currentGame = new AFistfulOfMeeples(game)
  const isActivePlayer: boolean = player === currentGame.getActivePlayer()

  if (animation !== undefined) {
    switch (animation.move.type) {
      case MoveType.ConvertGoldBar:
        return t('Trading {amount} gold cubes for a gold bar', { amount: getNextGoldBarPrice(game) })
    }
  }

  if (game.pendingEffects.length > 0) {
    switch (game.pendingEffects[0].type) {
      case PendingEffectType.BuildOrUpgradeMarquee:
        return isActivePlayer ? t('Choose if you want to build or upgrade a marquee') : t('{player} has to choose whether if wants to build or upgrade a marquee', { player: getName(game.activePlayer!) })
      case PendingEffectType.ChooseAnotherPlayerShowdownToken:
        return isActivePlayer ? t('Choose another player to place his Showdown token') : t('{player} has to choose another player to place his Showdown token', { player: getName(game.activePlayer!) })
      case PendingEffectType.ChooseToRerollShowdownDice:
        return isActivePlayer ? t('You may choose to reroll your Showdown dice') : t('{player} has to choose whether to reroll his showdown dice', { player: getName(game.activePlayer!) })
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
      return isActivePlayer ? t('Select a building to place your initial marquee tile') : t('{player} has to select a building to place his initial marquee tile', { player: getName(game.activePlayer!) })
    case Phase.SelectSourceLocation:
      return isActivePlayer ? t('Select a location from which to take meeples') : t('{player} has to select a building for their initial marquee tile', { player: getName(game.activePlayer!) })
    case Phase.PlaceMeeples:
      return isActivePlayer ? t('Select a meeple and a location to put it on') : t('{player} has to select a meeple and a location to put it on', { player: getName(game.activePlayer!) })
    case Phase.ResolveMeeples:
      return isActivePlayer ? t('Select a meeple to resolve') : t('{player} has to select a meeple to resolve', { player: getName(game.activePlayer!) })
    case Phase.CheckGoldBars:
      return t('Checking for gold bars')
    case Phase.GameOver:
      return getEndOfGameText(t, players, game, player)
    default:
      return game.currentPhase
  }
}

function getEndOfGameText(t: TFunction, playersInfo: PlayerInfo<PlayerColor>[], game: GameState, playerColor?: PlayerColor) {
  const player = game.players.find(player => player.color === playerColor)
  const getName = (color: PlayerColor) => playersInfo.find(p => p.id === color)?.name || getPlayerName(color, t)
  let highestScore = -1
  let playersWithHighestScore: PlayerState[] = []
  for (const player of game.players) {
    const score = getPlayerScore(game, player.color)
    if (score > highestScore) {
      playersWithHighestScore = [player]
      highestScore = score
    } else if (score === highestScore) {
      playersWithHighestScore.push(player)
    }
  }
  if (playersWithHighestScore.length === 1) {
    return (player === playersWithHighestScore[0]) ?
      t('Victory! You win the game with {score} points', { score: highestScore })
      :
      t('{player} wins the game with {score} points', { player: getName(playersWithHighestScore[0].color), score: highestScore })
  }

  let highestCubes = -1
  let playersWithMostCubes: PlayerState[] = []
  for (const player of playersWithHighestScore) {
    const nCubes = player.goldPieces + player.stones
    if (nCubes > highestCubes) {
      playersWithMostCubes = [player]
      highestCubes = nCubes
    } else if (nCubes === highestCubes)
      playersWithMostCubes.push(player)
  }

  if (playersWithMostCubes.length === 1) {
    if (player === playersWithMostCubes[0]) {
      return t('Victory! You win the game with {score} points and {cubes} remaining gold and stones',
        { score: highestScore, cubes: highestCubes })
    } else {
      return t('{player} wins the game with {score} points and {cubes} remaining gold and stones',
        { player: getName(playersWithMostCubes[0].color), score: highestScore, cubes: highestCubes })
    }
  }

  switch (playersWithMostCubes.length) {
    case game.players.length:
      return t('Perfect tie! All players each have {score} points and {cubes} remaining gold and stones',
        { score: highestScore, cubes: highestCubes })
    case 2:
      return t('Perfect tie! {player1} and {player2} each have {score} points and {cubes} remaining gold and stones',
        {
          player1: getName(playersWithMostCubes[0].color), player2: getName(playersWithMostCubes[1].color),
          score: highestScore, cubes: highestCubes
        })
    case 3:
      return t('Perfect tie! {player1}, {player2} and {player3} each have {score} points and {cubes} remaining gold and stones',
        {
          player1: getName(playersWithMostCubes[0].color), player2: getName(playersWithMostCubes[1].color),
          player3: getName(playersWithMostCubes[2].color), score: highestScore, cubes: highestCubes
        })
  }
  return ''
}
