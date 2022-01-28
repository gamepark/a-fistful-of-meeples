/** @jsxImportSource @emotion/react */
import GameState, { getPlayerScore, PendingEffectType } from '@gamepark/a-fistful-of-meeples/GameState'
import { Player as PlayerInfo, useAnimation, usePlayers, Animation, useTutorial, useActions } from '@gamepark/react-client'
import {TFunction, useTranslation} from 'react-i18next'
import AFistfulOfMeeples from '../../rules/src/AFistfulOfMeeples'
import BuildOrUpgradeMarquee from '../../rules/src/moves/BuildOrUpgradeMarquee'
import ConvertGoldBar, { getNextGoldBarPrice } from '../../rules/src/moves/ConvertGoldBar'
import Move from '../../rules/src/moves/Move'
import MoveMeeples from '../../rules/src/moves/MoveMeeples'
import MoveType from '../../rules/src/moves/MoveType'
import PlaceInitialMarqueeTile from '../../rules/src/moves/PlaceInitialMarqueeTile'
import Phase from '../../rules/src/Phase'
import PlayerColor from '../../rules/src/PlayerColor'
import PlayerState from '../../rules/src/PlayerState'
import { getNameForPlayer } from './material/PlayerInfo'

type Props = {
  loading: boolean
  game?: GameState
  player?: PlayerColor
}

export default function HeaderText({loading, game, player}: Props) {
  const { t } = useTranslation()
  const players = usePlayers<PlayerColor>()
  const animation = useAnimation<ConvertGoldBar | PlaceInitialMarqueeTile | MoveMeeples | BuildOrUpgradeMarquee>(animation => animation?.action.cancelled ?? true)
  const tutorial = useTutorial()
  const actions = useActions<Move, PlayerColor>()
  const nActions = actions !== undefined ? actions.filter(action => !action.delayed).length : 0


  if (loading) return <>{t('Game loading...')}</>
  if (!game || !player) return null

  if (tutorial && !animation && player === PlayerColor.Orange) {
    const tutorialText = getTutorialText(t, game, nActions)
    if (tutorialText) {
      return <>{tutorialText}</>
    }
  }

  return <>{getText(t, game!, player!, players!, animation)}</>
}

function getText(t: TFunction, game: GameState, player: PlayerColor, players: PlayerInfo<PlayerColor>[], animation?: Animation<any, any>): string {
  const getName = (playerId: PlayerColor) => getNameForPlayer(players.find(p => p.id === playerId), playerId, t)
  const currentGame = new AFistfulOfMeeples(game)
  const activePlayer = currentGame.getActivePlayer()
  const isActivePlayer: boolean = player === activePlayer

  if (animation !== undefined) {
    switch (animation.move.type) {
      case MoveType.PlaceInitialMarqueeTile:
        return isActivePlayer ? t('PlayerBuildingMarquee') : t('OtherPlayerBuildingMarquee', { player: getName(activePlayer!) })
      case MoveType.ConvertGoldBar:
        return t('TradingGoldCubesForGoldBar', { amount: getNextGoldBarPrice(game) })
      case MoveType.MoveMeeples:
        return t('MovingMeeples')
      case MoveType.BuildOrUpgradeMarquee:
        return (game.marquees[(animation.move as BuildOrUpgradeMarquee).space].owner === undefined) ? t('BuildingMarquee') : t('UpgradingMarquee')
    }
  }

  if (game.pendingEffects.length > 0) {
    switch (game.pendingEffects[0].type) {
      case PendingEffectType.BuildOrUpgradeMarquee:
        if (game.marquees[game.pendingEffects[0].location].owner === undefined)
          return isActivePlayer ? t('ChooseBuildMarquee') : t('OtherChooseBuildMarquee', { player: getName(activePlayer!) })
        return isActivePlayer ? t('ChooseUpgradeMarquee') : t('OtherChooseUpgradeMarquee', { player: getName(activePlayer!) })
      case PendingEffectType.ChooseAnotherPlayerShowdownToken:
        return isActivePlayer ? t('ChooseAnotherPlayerShowdownToken') : t('OtherChooseAnotherPlayerShowdownToken', { player: getName(activePlayer!) })
      case PendingEffectType.ChooseToRerollShowdownDice:
        return isActivePlayer ? t('ChooseToRerollShowdownDice') : t('OtherChooseToRerollShowdownDice', { player: getName(activePlayer!) })
      case PendingEffectType.DrawFromBag:
        return t('DrawingPiecesFromBag')
      case PendingEffectType.DynamiteExplosion:
        return t('DynamiteExplosion')
      case PendingEffectType.MoveMeeples:
        return t('')
      case PendingEffectType.ResolveShowdown:
        return t('')
      case PendingEffectType.RollShowdownDice:
        return t('RollingDices')
      default:
        return game.pendingEffects[0]
    }
  }
  
  switch (game.currentPhase) {
    case Phase.PlaceInitialMarqueeTiles:
      return isActivePlayer ? t('SelectInitialMarqueePlace') : t('OtherSelectInitialMarqueePlace', { player: getName(activePlayer!) })
    case Phase.SelectSourceLocation:
      return isActivePlayer ? t('SelectSourceLocation') : t('OtherSelectSourceLocation', { player: getName(activePlayer!) })
    case Phase.PlaceMeeples:
      return isActivePlayer ? t('PlaceMeeple') : t('OtherPlaceMeeple', { player: getName(activePlayer!) })
    case Phase.ResolveMeeples:
      return isActivePlayer ? t('ResolveMeeple') : t('OtherResolveMeeple', { player: getName(activePlayer!) })
    case Phase.CheckGoldBars:
      return ''
    case Phase.GameOver:
      return getEndOfGameText(t, players, game, player)
    default:
      return game.currentPhase
  }
}

export function getEndOfGameText(t: TFunction, playersInfo: PlayerInfo<PlayerColor>[], game: GameState, playerColor?: PlayerColor) {
  const player = game.players.find(player => player.color === playerColor)
  const getName = (playerId: PlayerColor) => getNameForPlayer(playersInfo.find(p => p.id === playerId), playerId, t)
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
      t('VictoryPoints', { score: highestScore })
      :
      t('OtherVictoryPoints', { player: getName(playersWithHighestScore[0].color), score: highestScore })
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
      return t('VictoryPointsCubes',
        { score: highestScore, cubes: highestCubes })
    } else {
      return t('OtherVictoryPointsCubes',
        { player: getName(playersWithMostCubes[0].color), score: highestScore, cubes: highestCubes })
    }
  }

  switch (playersWithMostCubes.length) {
    case game.players.length:
      return t('TieAll',
        { score: highestScore, cubes: highestCubes })
    case 2:
      return t('Tie2',
        {
          player1: getName(playersWithMostCubes[0].color), player2: getName(playersWithMostCubes[1].color),
          score: highestScore, cubes: highestCubes
        })
    case 3:
      return t('Tie3',
        {
          player1: getName(playersWithMostCubes[0].color), player2: getName(playersWithMostCubes[1].color),
          player3: getName(playersWithMostCubes[2].color), score: highestScore, cubes: highestCubes
        })
  }
  return ''
}

function getTutorialText(t: TFunction, _game: GameState, nActions: number): string {
  switch (nActions) {
    case 0 :
      return t('tuto.welcome') + ' ' + t('Name')
    case 1:
      return t('tuto.hdr.1')
    case 2:
      return t('tuto.hdr.2')
    case 3:
      return t('tuto.hdr.3')
    case 4:
      return t('tuto.hdr.4')
    case 5:
      return t('tuto.hdr.5')
    case 6:
      return t('tuto.hdr.6')
    case 7:
      return t('tuto.hdr.7')
    case 8:
      return t('tuto.hdr.8')
    case 14:
      return t('tuto.hdr.14')
    case 15:
      return t('tuto.hdr.15')
    case 16:
      return t('tuto.hdr.16')
    case 17:
      return t('tuto.hdr.17')
    case 18:
      return t('tuto.hdr.18')
    case 19:
      return t('tuto.hdr.19')
    case 20:
      return t('tuto.hdr.20')
    case 21:
      return t('tuto.hdr.21')
    case 22:
      return t('tuto.hdr.22')
    case 23:
      return t('tuto.hdr.23')
    case 24:
      return t('tuto.hdr.24')
    case 25:
      return t('tuto.hdr.25')
    case 26:
      return t('tuto.hdr.26')
    case 27:
      return t('tuto.hdr.27')
    case 30:
      return t('tuto.hdr.30')
    case 31:
      return t('tuto.hdr.31')
    case 32:
      return t('tuto.hdr.32')
    case 33:
      return t('tuto.hdr.33')
    case 34:
      return t('tuto.hdr.34')
    case 35:
      return t('tuto.hdr.35')
    case 36:
      return t('tuto.hdr.36')
  }
  return ''
}

