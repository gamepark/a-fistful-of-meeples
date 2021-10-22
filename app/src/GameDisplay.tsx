/** @jsxImportSource @emotion/react */
import {css, keyframes} from '@emotion/react'
import GameState from '@gamepark/a-fistful-of-meeples/GameState'
import { usePlayerId } from '@gamepark/react-client'
import {Letterbox} from '@gamepark/react-components'
import MeepleType from '../../rules/src/MeepleType'
import Phase from '../../rules/src/Phase'
import PlayerColor from '../../rules/src/PlayerColor'
import Board from './material/Board'
import Meeple from './material/Meeple'
import MiningBag from './material/MiningBag'
import PhaseIndicator from './material/PhaseIndicator'
import PlayerInfo from './material/PlayerInfo'
import { meepleHeight, meeplesInHandPosition, meepleWidth, miningBagHeight, miningBagLeft, miningBagTop, miningBagWidth, phaseHeight, phasesPositions, phaseWidth, playerInfoHeight, playerInfoPositions, playerInfoWidth } from './util/Metrics'

type Props = {
  game: GameState
}

export default function GameDisplay({ game }: Props) {
  const playerColor = usePlayerId<PlayerColor>()

  return (
    <Letterbox css={letterBoxStyle} top={0} left={0}>
      <Board game={game} />
      <MiningBag gold={game.goldCubesInMiningBag} stone={game.stoneCubesInMiningBag} dynamite={game.dynamitesInMiningBag} css={miningBagMetrics} />
      <>
        {game.players.map((playerState, index) =>
          <PlayerInfo css={getPlayerInfoMetrics(index)} playerState={playerState} player={playerColor} gameState={game} key={index} />
        )}
      </>
      <>
        <PhaseIndicator css={getPhaseIndicatorMetrics(0)} phase={Phase.SelectSourceLocation} gameState={game} key='PhaseIndicator1' />
        <PhaseIndicator css={getPhaseIndicatorMetrics(1)} phase={Phase.PlaceMeeples} gameState={game} key='PhaseIndicator2' />
        <PhaseIndicator css={getPhaseIndicatorMetrics(2)} phase={Phase.ResolveMeeples} gameState={game} key='PhaseIndicator3' />
        <PhaseIndicator css={getPhaseIndicatorMetrics(3)} phase={Phase.CheckGoldBars} gameState={game} key='PhaseIndicator4' />
      </>
      <>
        {game.meeplesInHand.map((meeple, index) =>
          (meeple !== MeepleType.None) && <Meeple position={getPositionInHand(index)} type={meeple} draggable={true} key={index} />
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
left: ${miningBagLeft}%;
top: ${miningBagTop}%;
width: ${miningBagWidth}%;
height: ${miningBagHeight}%;
`

const getPlayerInfoMetrics = (index: number) => css`
  position: absolute;
  left: ${playerInfoPositions[index][0]}%;
  top: ${playerInfoPositions[index][1]}%;
  width: ${playerInfoWidth}%;
  height: ${playerInfoHeight}%;
  font-size: 1rem;
`

const getPhaseIndicatorMetrics = (index: number) => css`
position: absolute;
left: ${phasesPositions[index][0]}%;
top: ${phasesPositions[index][1]}%;
width: ${phaseWidth}%;
height: ${phaseHeight}%;
`