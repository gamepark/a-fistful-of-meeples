/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import GameState from '@gamepark/a-fistful-of-meeples/GameState'
import PlayerColor from '@gamepark/a-fistful-of-meeples/PlayerColor'
import { boardHeight, boardLeftMargin, boardTopMargin, boardWidth, goldBarPositions, buildingsPosition, meepleHeight, meepleWidth, dynamitePositions, miningBagLeft, miningBagTop } from '../util/Styles'
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
