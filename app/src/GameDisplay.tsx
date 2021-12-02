/** @jsxImportSource @emotion/react */
import {css, keyframes} from '@emotion/react'
import GameState from '@gamepark/a-fistful-of-meeples/GameState'
import { useAnimation, usePlay } from '@gamepark/react-client'
import {Letterbox, Picture} from '@gamepark/react-components'
import { useTranslation } from 'react-i18next'
import AFistfulOfMeeples from '../../rules/src/AFistfulOfMeeples'
import MiningBagContent from '../../rules/src/MiningBag'
import { getBuildOrUpgradeMarqueeMove } from '../../rules/src/moves/BuildOrUpgradeMarquee'
import ChooseAnotherPlayerShowdownToken, { getChooseAnotherPlayerShowdownTokenMove } from '../../rules/src/moves/ChooseAnotherPlayerShowdownToken'
import DrawFromBag from '../../rules/src/moves/DrawFromBag'
import DynamiteExplosion from '../../rules/src/moves/DynamiteExplosion'
import { isBuildOrUpgradeMarqueeMove, isChooseAnotherPlayerShowdownTokenMove, isDrawFromBagMove, isDynamiteExplosion, isRerollShowdownDiceMove } from '../../rules/src/moves/Move'
import { getRerollShowdownDiceMove } from '../../rules/src/moves/RerollShowdownDice'
import Board from './material/Board'
import Dynamite from './material/Dynamite'
import GoldCube from './material/GoldCube'
import Images from './material/Images'
import MiningBag from './material/MiningBag'
import PlayerInfo from './material/PlayerInfo'
import PlayerSelecter from './material/PlayerSelecter'
import StoneCube from './material/StoneCube'
import { letterBoxHeight, letterBoxWidth, miningBagHeight, miningBagLeft, miningBagTop, miningBagWidth, playerInfoHeight, playerInfoPositions, playerInfoWidth } from './util/Metrics'
import { getTranslationAnimationStyle } from './util/Styles'
import YesNoSelecter from './util/YesNoSelecter'

type Props = {
  game: GameState
}

export default function GameDisplay({ game }: Props) {
  const { t } = useTranslation()
  const play = usePlay()
  const currentGame = new AFistfulOfMeeples(game)
  const animation = useAnimation<DrawFromBag | DynamiteExplosion>(animation => animation?.action.cancelled ?? true)
  const drawFromBagAnimation = animation && !animation.action.cancelled && isDrawFromBagMove(animation.move) ? animation.move : undefined
  const dynamiteExplosionAnimation = animation && !animation.action.cancelled && isDynamiteExplosion(animation.move) ? animation.move : undefined

  const legalMoves = currentGame.getLegalMoves()
  const buildOrUpgradeMarqueeMove = legalMoves.find(move => isBuildOrUpgradeMarqueeMove(move))
  const rerollShowdownDiceMove = legalMoves.find(move => isRerollShowdownDiceMove(move))
  const chooseAnotherPlayerMoves = legalMoves.filter(move => isChooseAnotherPlayerShowdownTokenMove(move)).map(move => (move as ChooseAnotherPlayerShowdownToken).playerId)

  let popup = undefined
  if (buildOrUpgradeMarqueeMove !== undefined && isBuildOrUpgradeMarqueeMove(buildOrUpgradeMarqueeMove)) {
    const text = (game.marquees[buildOrUpgradeMarqueeMove.space].owner === undefined) ? t("DoYouWantToBuildAMarquee") : t("DoYouWantToUpgradeYourMarquee")
    popup = <YesNoSelecter text={text} answered={answer => play(getBuildOrUpgradeMarqueeMove(buildOrUpgradeMarqueeMove.playerId, buildOrUpgradeMarqueeMove.space, answer))} />
  }
  if (rerollShowdownDiceMove !== undefined) {
    const text = t("DoYouWantToRerollYourShowdownDice")
    popup = <YesNoSelecter text={text} answered={answer => play(getRerollShowdownDiceMove(answer))} />
  }
  if (chooseAnotherPlayerMoves.length > 0) {
    const text = t('ChooseAnotherPlayerShowdownToken')
    popup = <PlayerSelecter text={text} players={chooseAnotherPlayerMoves} selected={player => play(getChooseAnotherPlayerShowdownTokenMove(player))} />
  }


  return (
    <Letterbox id="letterbox" css={letterBoxStyle} width={letterBoxWidth} height={letterBoxHeight} top={0}>
      <MiningBag gold={game.goldCubesInMiningBag} stone={game.stoneCubesInMiningBag} dynamite={game.dynamitesInMiningBag} css={miningBagMetrics} />
      <>
        {game.players.map((playerState, index) =>
          <PlayerInfo css={getPlayerInfoMetrics(index)} playerState={playerState} gameState={game} key={index} />
        )}
      </>
      <Board gameState={game} currentGame={currentGame} />

      <>
        {animation && drawFromBagAnimation && drawFromBagAnimation.content.map((cube, index) => {
          const playerIndex = game.players.findIndex(state => state.color === drawFromBagAnimation.playerId)
          const startPosition = [miningBagLeft + 1 + index * 4, miningBagTop]
          const endPosition = playerInfoPositions[playerIndex]
          const getStyle = (endX: number, endY: number) => getCubeStyle(startPosition, [endX, endY], animation.duration)
          switch (cube) {
            case MiningBagContent.Dynamite:
              return <Dynamite key={100 + index} css={getStyle(72.8, 51.2)} />
            case MiningBagContent.Gold:
              return <GoldCube key={100 + index} css={getStyle(endPosition[0] + 11.5, endPosition[1] + 10.6)} />
            case MiningBagContent.Stone:
              return <StoneCube key={100 + index} css={getStyle(endPosition[0] + 1.7, endPosition[1] + 10.5)} />
          }
          return undefined
        })}

        {animation && dynamiteExplosionAnimation && <Picture src={Images.dynamiteExplosion} css={dynamiteExplosionStyle} />}

        {!animation && popup}

      </>
    </Letterbox>
  )
}



const fadeIn = keyframes`
  from, 50% {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

const letterBoxStyle = css`
  animation: ${fadeIn} 3s ease-in forwards;
`

const miningBagMetrics = css`
position: absolute;
left: ${miningBagLeft}em;
top: ${miningBagTop}em;
width: ${miningBagWidth}em;
height: ${miningBagHeight}em;
`

const getPlayerInfoMetrics = (index: number) => css`
  position: absolute;
  left: ${playerInfoPositions[index][0]}em;
  top: ${playerInfoPositions[index][1]}em;
  width: ${playerInfoWidth}em;
  height: ${playerInfoHeight}em;
`

const getCubeStyle = (startPosition: number[], endPosition: number[], animation_duration: number) =>
  [css`
  position: absolute;
  left: ${startPosition[0]}em;
  top: ${startPosition[1]}em;
  width: 4em; 
  height: 4em;
`, getTranslationAnimationStyle(startPosition, endPosition, animation_duration)]

const dynamiteExplosionStyle = css`
  position: absolute;
  left: 69em;
  top: 47.5em;
  width: 12em;
  height: 12em;
`

