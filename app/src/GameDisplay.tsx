/** @jsxImportSource @emotion/react */
import {css, keyframes} from '@emotion/react'
import GameState from '@gamepark/a-fistful-of-meeples/GameState'
import { useAnimation } from '@gamepark/react-client'
import {Letterbox, Picture} from '@gamepark/react-components'
import MiningBagContent from '../../rules/src/MiningBag'
import DrawFromBag from '../../rules/src/moves/DrawFromBag'
import { isDrawFromBagMove, isDynamiteExplosion } from '../../rules/src/moves/Move'
import RollShowdownDice from '../../rules/src/moves/RollShowdownDice'
import Board from './material/Board'
import Dynamite from './material/Dynamite'
import GoldCube from './material/GoldCube'
import Images from './material/Images'
import MiningBag from './material/MiningBag'
import PlayerInfo from './material/PlayerInfo'
import StoneCube from './material/StoneCube'
import { letterBoxHeight, letterBoxWidth, miningBagHeight, miningBagLeft, miningBagTop, miningBagWidth, playerInfoHeight, playerInfoPositions, playerInfoWidth } from './util/Metrics'

type Props = {
  game: GameState
}

export default function GameDisplay({ game }: Props) {
  const animation = useAnimation<DrawFromBag | RollShowdownDice>(animation => animation?.action.cancelled ?? true)
  const drawFromBagAnimation = animation && !animation.action.cancelled && isDrawFromBagMove(animation.move) ? animation.move : undefined
  const dynamiteExplosionAnimation = animation && !animation.action.cancelled && isDynamiteExplosion(animation.move) ? animation.move : undefined

  return (
    <Letterbox id="letterbox" css={letterBoxStyle} width={letterBoxWidth} height={letterBoxHeight} top={0}>
      <Board game={game} />
      <MiningBag gold={game.goldCubesInMiningBag} stone={game.stoneCubesInMiningBag} dynamite={game.dynamitesInMiningBag} css={miningBagMetrics} />
      <>
        {game.players.map((playerState, index) =>
          <PlayerInfo css={getPlayerInfoMetrics(index)} playerState={playerState} gameState={game} key={index} />
        )}
      </>

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
        })}
        {animation && dynamiteExplosionAnimation &&
          <Picture src={Images.dynamiteExplosion} css={dynamiteExplosionStyle} />
        }
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

const translate = (startPosition: number[], endPosition: number[]) => keyframes`
	0%	{ transform: translate(0, 0); }
	100%	{ transform: translate(${endPosition[0] - startPosition[0]}em, ${endPosition[1] - startPosition[1]}em); }
`

const getCubeStyle = (startPosition: number[], endPosition: number[], animation_duration: number) =>
  css`
  position: absolute;
  left: ${startPosition[0]}em;
  top: ${startPosition[1]}em;
  width: 4em;
  height: 4em;
	animation: ${translate(startPosition, endPosition)} ${animation_duration}s ease-in-out;
`

const dynamiteExplosionStyle = css`
  position: absolute;
  left: 69em;
  top: 47.5em;
  width: 12em;
  height: 12em;
`

