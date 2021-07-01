/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import GameState from '@gamepark/a-fistful-of-meeples/GameState'
import PlayerColor from '@gamepark/a-fistful-of-meeples/PlayerColor'
import { boardHeight, boardLeftMargin, boardTopMargin, boardWidth, goldBarPositions, buildingsPosition, meepleHeight, meepleWidth, dynamitePositions, miningBagLeft, miningBagTop, saloonPosition, graveyardPositions, jailPosition, doorwaysPosition } from '../util/Styles'
import MiningBag from './MiningBag'
import Dynamite from './Dynamite'
import GoldBar from './GoldBar'
import Images from './Images'
import Meeple from './Meeple'

type Props = {
  game: GameState
  player: PlayerColor | undefined
}

export default function Board({ game, player }: Props) {
  return (
    <div css={style}>
      {JSON.stringify(player)}

      <MiningBag gold={game.goldCubesInMiningBag} stone={game.stoneCubesInMiningBag} dynamite={game.dynamitesInMiningBag} left={miningBagLeft} top={miningBagTop} />

      {game.goldBarsInBank > 0 &&
        <>
        {[...Array(game.goldBarsInBank)].map((_, index) =>
          <GoldBar position={goldBarPositions[index]} />
          )}
        </>
      }

      {game.dynamitesInJail > 0 &&
        <>
        {[...Array(game.dynamitesInJail)].map((_, index) =>
          <Dynamite position={dynamitePositions[index]} />
          )}
        </>
      }

      <>
        {game.buildings.map((meeples, building) =>
          meeples.map((meeple, index) =>
            <Meeple position={getPositionInBuilding(building, index)} type={meeple} />
          )
        )}
      </>

      <>
        {game.doorways.map((meeple, index) =>
          <Meeple position={doorwaysPosition[index]} type={meeple} />
        )}
      </>

      <>
        {game.jail.map((meeple, index) =>
          <Meeple position={getPositionInJail(index)} type={meeple} />
        )}
      </>

      <>
        {game.saloon.map((meeple, index) =>
          <Meeple position={getPositionInSaloon(index)} type={meeple} />
        )}
      </>

      <>
        {game.graveyard.map((meeple, index) =>
          <Meeple position={graveyardPositions[index]} type={meeple} />
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
