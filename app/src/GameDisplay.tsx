/** @jsxImportSource @emotion/react */
import {css, keyframes} from '@emotion/react'
import GameState from '@gamepark/a-fistful-of-meeples/GameState'
import { usePlayerId } from '@gamepark/react-client'
import {Letterbox} from '@gamepark/react-components'
import MeepleType from '../../rules/src/MeepleType'
import PlayerColor from '../../rules/src/PlayerColor'
import Board from './material/Board'
import Meeple from './material/Meeple'
import MiningBag from './material/MiningBag'
import PlayerInfo from './material/PlayerInfo'
import { letterBoxHeight, letterBoxWidth, meepleHeight, meeplesInHandPosition, meepleWidth, miningBagHeight, miningBagLeft, miningBagTop, miningBagWidth, playerInfoHeight, playerInfoPositions, playerInfoWidth } from './util/Metrics'

type Props = {
  game: GameState
}

export default function GameDisplay({ game }: Props) {
  const playerColor = usePlayerId<PlayerColor>()

  return (
    <Letterbox id="letterbox" css={letterBoxStyle} width={letterBoxWidth} height={letterBoxHeight} top={0}>
      <Board game={game} />
      <MiningBag gold={game.goldCubesInMiningBag} stone={game.stoneCubesInMiningBag} dynamite={game.dynamitesInMiningBag} css={miningBagMetrics} />
      <>
        {game.players.map((playerState, index) =>
          <PlayerInfo css={getPlayerInfoMetrics(index)} playerState={playerState} player={playerColor} gameState={game} key={index} />
        )}
      </>
      <>
        {game.meeplesInHand.map((meeple, index) =>
          (meeple !== MeepleType.None) && <Meeple css={getMeepleStyle(getPositionInHand(index))} type={meeple} draggable={true} key={index} />
        )}
      </>

    </Letterbox>
  )
}


function getPositionInHand(index: number) {
  let result = [...meeplesInHandPosition]
  result[0] += (index % 3) * (meepleWidth + 1)
  result[1] += Math.floor(index / 3) * (meepleHeight + 1)
  return result
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

export function getMeepleStyle(position: Array<number>) {
  return css`
  position: absolute;
  left: ${position[0]}em;
  top: ${position[1]}em;
  width: ${meepleWidth}em;
  height: ${meepleHeight}em;
`
}
