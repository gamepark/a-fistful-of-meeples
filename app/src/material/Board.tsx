/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import GameState from '@gamepark/a-fistful-of-meeples/GameState'
import PlayerColor from '@gamepark/a-fistful-of-meeples/PlayerColor'
import { boardHeight, boardLeftMargin, boardTopMargin, boardWidth, goldBarPositions, buildingsPosition, meepleHeight, meepleWidth, dynamitePositions, miningBagLeft, miningBagTop, saloonPosition, graveyardPositions, jailPosition, doorwaysPosition, showdownMeeplePositions, showdownTokenPositions, marqueesPosition, playerInfoPositions, goldBarWidth, goldBarHeight, phasesPositions, meeplesInHandPosition } from '../util/Metrics'
import MiningBag from './MiningBag'
import Dynamite from './Dynamite'
import GoldBar from './GoldBar'
import Images from './Images'
import Meeple from './Meeple'
import ShowdownToken from './ShowdownToken'
import MeepleType from '../../../rules/src/MeepleType'
import Phase from '../../../rules/src/Phase'
import Marquee from './Marquee'
import PlayerInfo from './PlayerInfo'
import PhaseIndicator from './PhaseIndicator'

type Props = {
  game: GameState
  player: PlayerColor | undefined
}

export default function Board({ game, player }: Props) {
  return (
    <div css={style}>
      <MiningBag gold={game.goldCubesInMiningBag} stone={game.stoneCubesInMiningBag} dynamite={game.dynamitesInMiningBag} left={miningBagLeft} top={miningBagTop} />

      <>
        {game.players.map((playerState, index) =>
          <PlayerInfo left={playerInfoPositions[index][0]} top={playerInfoPositions[index][1]} playerState={playerState} player={player} gameState={game} key={index}/>
        )}
      </>

      {game.goldBarsInBank > 0 &&
        <>
        {[...Array(game.goldBarsInBank)].map((_, index) =>
          <GoldBar style={getGoldBarStyle(goldBarPositions[index])} key={index} />
          )}
        </>
      }

      {game.dynamitesInJail > 0 &&
        <>
        {[...Array(game.dynamitesInJail)].map((_, index) =>
          <Dynamite position={dynamitePositions[index]} key={index} />
          )}
        </>
      }

      <>
        {game.marquees.map((marquee, index) => {
          return (marquee.owner !== PlayerColor.None) ? <Marquee position={marqueesPosition[index]} owner={marquee.owner} upgraded={marquee.upgraded} flip={index > 5} key={index} /> : undefined
          }
        )}
      </>

      <>
        {game.buildings.map((meeples, building) =>
          meeples.map((meeple, index) =>
            <Meeple position={getPositionInBuilding(building, index)} type={meeple} key={building * 12 + index} />
          )
        )}
      </>

      <>
        {game.doorways.map((meeple, index) => {
          return (meeple !== MeepleType.None) ? <Meeple position={doorwaysPosition[index]} type={meeple} key={index} /> : undefined
        }
        )}
      </>

      <>
        {game.jail.map((meeple, index) =>
          <Meeple position={getPositionInJail(index)} type={meeple} key={index} />
        )}
      </>

      <>
        {game.saloon.map((meeple, index) =>
          <Meeple position={getPositionInSaloon(index)} type={meeple} key={index}/>
        )}
      </>

      <>
        {game.graveyard.map((meeple, index) =>
          <Meeple position={graveyardPositions[index]} type={meeple} key={index}/>
        )}
      </>

      <>
        { game.showdowns.map((showdown, index) => {
          if (showdown.meeple !== MeepleType.None) {
            return <>
              <ShowdownToken position={showdownTokenPositions[index]} color={showdown.owner} key={index} />
              <Meeple position={showdownMeeplePositions[index]} type={showdown.meeple} key={index} />
              </>
          }
          return undefined
        })}
      </>

      <>
        <PhaseIndicator left={phasesPositions[0][0]} top={phasesPositions[0][1]} phase={Phase.SelectSourceLocation} gameState={game} key='PhaseIndicator1' />
        <PhaseIndicator left={phasesPositions[1][0]} top={phasesPositions[1][1]} phase={Phase.PlaceMeeples} gameState={game} key='PhaseIndicator2' />
        <PhaseIndicator left={phasesPositions[2][0]} top={phasesPositions[2][1]} phase={Phase.ResolveMeeples} gameState={game} key='PhaseIndicator3' />
        <PhaseIndicator left={phasesPositions[3][0]} top={phasesPositions[3][1]} phase={Phase.CheckGoldBars} gameState={game} key='PhaseIndicator4' />
      </>

      <>
        {game.meeplesInHand.map((meeple, index) =>
          <Meeple position={getPositionInHand(index)} type={meeple} key={index} />
        )}
      </>


    </div>
  )
}

const style = css`
  background-image: url(${Images.board});
  background-color: #000000;
  background-size: cover;
  position: absolute;
  width: ${boardWidth}%;
  height: ${boardHeight}%;
  top: ${boardTopMargin}%;
  left: ${boardLeftMargin}%;
`

function getPositionInBuilding(building: number, index: number) {
  let result = [...buildingsPosition[building]]
  result[0] += (index % 4) * (meepleWidth + 1)
  result[1] += Math.floor(index / 4) * (meepleHeight + 1)
  return result
}

function getPositionInSaloon(index: number) {
  let result = [...saloonPosition]
  result[0] += (index % 3) * (meepleWidth + 1)
  result[1] += Math.floor(index / 3) * (meepleHeight + 1)
  return result
}

function getPositionInJail(index: number) {
  let result = [...jailPosition]
  result[0] += (index % 3) * (meepleWidth + 1)
  result[1] += Math.floor(index / 3) * (meepleHeight + 1)
  return result
}

function getPositionInHand(index: number) {
  let result = [...meeplesInHandPosition]
  result[0] += (index % 3) * (meepleWidth + 1)
  result[1] += Math.floor(index / 3) * (meepleHeight + 1)
  return result
}


function getGoldBarStyle(position: Array<number>) {
  return css`
  position: absolute;
  left: ${position[0]}%;
  top: ${position[1]}%;
  width: ${goldBarWidth}%;
  height: ${goldBarHeight}%;
`
}

