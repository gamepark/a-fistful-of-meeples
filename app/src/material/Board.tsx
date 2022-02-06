/** @jsxImportSource @emotion/react */
import { css, keyframes } from '@emotion/react'
import GameState, { isBuildingLocation, Location_Graveyard, Location_Jail, Location_Saloon, Location_Showdown0, Location_Showdown1 } from '@gamepark/a-fistful-of-meeples/GameState'
import PlayerColor from '@gamepark/a-fistful-of-meeples/PlayerColor'
import { boardHeight, boardLeft, boardTop, boardWidth, goldBarPositions, buildingsPosition, meepleHeight, meepleWidth, dynamitePositions, saloonPosition, graveyardPositions, jailPosition, doorwaysPosition, showdownMeeplePositions, showdownTokenPositions, marqueesPosition, goldBarWidth, goldBarHeight, showdownSelecterPositions, saloonSelecterPosition, jailSelecterPosition, dicePositions, diceWidth, diceHeight, showdownTokenHeight, showdownTokenWidth, meeplesInHandPosition, dynamiteWidth, dynamiteHeight, buildingSelecterDeltaX, buildingSelecterDeltaY, buildingWidth, buildingHeight, doorwayWidth, doorwayHeight, doorwaySelecterDeltaX, doorwaySelecterDeltaY, saloonSelecterWidth, saloonSelecterHeight, jailSelecterHeight, jailSelecterWidth, playerInfoPositions, removedDynamitePositions, getMarqueeSelecterPosition, miningBagLeft, miningBagTop, goldCubeWidth, goldCubeHeight, translate } from '../util/Metrics'
import Dynamite from './Dynamite'
import GoldBar from './GoldBar'
import Images from './Images'
import Meeple, { SelectionStatus } from './Meeple'
import ShowdownToken from './ShowdownToken'
import Marquee from './Marquee'
import AFistfulOfMeeples from '../../../rules/src/AFistfulOfMeeples'
import { isBuildOrUpgradeMarqueeMove, isConvertGoldBar, isMoveMeeplesMove, isPlaceInitialMarqueeTileMove, isPlaceMeepleMove, isResolveMeepleMove, isRollShowdownDiceMove, isSelectSourceLocationMove } from '../../../rules/src/moves/Move'
import MarqueeSelecter from './MarqueeSelecter'
import PlaceInitialMarqueeTile from '../../../rules/src/moves/PlaceInitialMarqueeTile'
import { useAnimation, usePlay, usePlayerId } from '@gamepark/react-client'
import SelectSourceLocation from '../../../rules/src/moves/SelectSourceLocation'
import DoorwaySelecter from './DoorwaySelecter'
import PlaceMeeple, { getPlaceMeepleMove } from '../../../rules/src/moves/PlaceMeeple'
import ShowdownSelecter from './ShowdownSelecter'
import ResolveMeeple from '../../../rules/src/moves/ResolveMeeple'
import BuildOrUpgradeMarquee, { getBuildOrUpgradeMarqueeMove } from '../../../rules/src/moves/BuildOrUpgradeMarquee'
import Dice from './Dice'
import ChangeCurrentPhase from '../../../rules/src/moves/ChangeCurrentPhase'
import GenericSelecter from './GenericSelecter'
import MoveMeeples from '../../../rules/src/moves/MoveMeeples'
import RollShowdownDice from '../../../rules/src/moves/RollShowdownDice'
import { Picture } from '@gamepark/react-components'
import ConvertGoldBar, { getNextGoldBarPrice } from '../../../rules/src/moves/ConvertGoldBar'
import { getPosition, getSize, getTranslateAnimationStyle } from '../util/Styles'
import { useState } from 'react'
import GoldCube from './GoldCube'


type Props = {
  gameState: GameState
  currentGame: AFistfulOfMeeples
}

export default function Board({ gameState, currentGame }: Props) {
  const legalMoves = currentGame.getLegalMoves()
  const play = usePlay()
  const playerColor = usePlayerId<PlayerColor>()
  const buildOrUpgradeMarqueeMove = legalMoves.find(move => isBuildOrUpgradeMarqueeMove(move))
  const [selectedMeepleIndex, setSelectedMeepleIndex] = useState<number>()

  // animations
  const animation = useAnimation<PlaceInitialMarqueeTile | SelectSourceLocation | PlaceMeeple | ResolveMeeple | BuildOrUpgradeMarquee | ChangeCurrentPhase | MoveMeeples | RollShowdownDice | ConvertGoldBar>(animation => animation?.action.cancelled ?? true)
  const placeInitialMarqueeTileAnimation = animation && !animation.action.cancelled && isPlaceInitialMarqueeTileMove(animation.move) ? animation.move : undefined
  const selectSourceLocationAnimation = animation && !animation.action.cancelled && isSelectSourceLocationMove(animation.move) ? animation.move : undefined
  const placeMeepleAnimation = animation && !animation.action.cancelled && isPlaceMeepleMove(animation.move) ? animation.move : undefined
  const resolveMeepleAnimation = animation && !animation.action.cancelled && isResolveMeepleMove(animation.move) ? animation.move : undefined
  const buildOrUpgradeMarqueeAnimation = animation && !animation.action.cancelled && isBuildOrUpgradeMarqueeMove(animation.move) ? animation.move : undefined
  const moveMeepleAnimation = animation && !animation.action.cancelled && isMoveMeeplesMove(animation.move) ? animation.move : undefined
  const rollShowdownDiceAnimation = animation && !animation.action.cancelled && isRollShowdownDiceMove(animation.move) ? animation.move : undefined
  const convertGoldBarAnimation = animation && !animation.action.cancelled && isConvertGoldBar(animation.move) ? animation.move : undefined

  const removedDynamites: number = 3 - gameState.dynamitesInJail - gameState.dynamitesInMiningBag
  let playerInfoPosition: number[] = []
  if (animation && convertGoldBarAnimation) {
    playerInfoPosition = playerInfoPositions[gameState.players.findIndex(state => state.color === gameState.activePlayer)]
  }

  return (
    <div css={style}>
      {gameState.goldBarsInBank > 0 &&  // display gold bars in bank and animate to player panel when converting
        <>
        {[...Array(gameState.goldBarsInBank)].map((_, index) => {
          const startPosition = goldBarPositions[index]
          let style = [getGoldBarStyle(startPosition)]
          if ((animation && convertGoldBarAnimation && index === gameState.goldBarsInBank - 1)) {
            const endPosition = [playerInfoPosition[0] + 23, playerInfoPosition[1] + 4]
            style.push(getConvertGoldBarTransformStyle(startPosition, endPosition, animation.duration))
          }
          return <GoldBar css={style} key={index} />
          })}
        </>
      }

      {animation && convertGoldBarAnimation && // animate gold cubes from player panel to mining bag
        <>
        {[...Array(getNextGoldBarPrice(gameState))].map((_, index) => {
          return <GoldCube key={index} css={[getSize(goldCubeWidth, goldCubeHeight),
            getTranslateAnimationStyle(translate(playerInfoPosition, 5 + index * 2, 5), [miningBagLeft + 3 + index, miningBagTop], animation.duration)]} />
          })}
        </>
      }

      {gameState.dynamitesInJail > 0 &&
        <>
        {[...Array(gameState.dynamitesInJail)].map((_, index) => {
          const startPosition = dynamitePositions[index]
          let style = [getDynamiteStyle(startPosition)]
          if ((animation && selectSourceLocationAnimation && selectSourceLocationAnimation.location === Location_Jail && index === gameState.dynamitesInJail - 1))
            style.push(getTransformStyle(startPosition, [miningBagLeft + 4, miningBagTop], animation.duration))
          return <Dynamite css={style} key={index} />
        })}
        </>
      }

      {removedDynamites > 0 &&
        <>
        {[...Array(removedDynamites)].map((_, index) =>
          <Dynamite css={getDynamiteStyle(removedDynamitePositions[index])} key={index} />
          )}
        </>
      }

      <>
        {gameState.marquees.map((marquee, index) => {
          if (buildOrUpgradeMarqueeAnimation && buildOrUpgradeMarqueeAnimation.space === index) {
            if (marquee.owner === undefined)
              return undefined
            return [
              <Marquee owner={buildOrUpgradeMarqueeAnimation.playerId} upgraded={false} css={getMarqueeStyle(marqueesPosition[index], index)} key={index} />,
              <Marquee owner={buildOrUpgradeMarqueeAnimation.playerId} upgraded={true} css={[getMarqueeStyle(marqueesPosition[index], index), getFadeInStyle(animation!.duration)]} key='animatedMarquee' />
            ]
          } else if (placeInitialMarqueeTileAnimation && placeInitialMarqueeTileAnimation.location === index) {
            return undefined
          } else {
            return (marquee.owner !== undefined) ? <Marquee owner={marquee.owner} upgraded={marquee.upgraded} css={getMarqueeStyle(marqueesPosition[index], index)} key={index} /> : undefined
          }
        }
        )}
      </>

      <>
        {gameState.buildings.map((meeples, building) =>
          meeples.map((meeple, index) => {
            const startPosition = getPositionInBuilding(building, index, gameState.buildings[building].length)
            let style = [getMeepleStyle(startPosition)]
            if ((animation && selectSourceLocationAnimation && selectSourceLocationAnimation.location === building))
              style.push(getTransformStyle(startPosition, getPositionInHand(index), animation.duration))
            if ((animation && moveMeepleAnimation && moveMeepleAnimation.source === building && moveMeepleAnimation.meeples === meeple)) {
              switch (moveMeepleAnimation.destination) {
                case Location_Jail:
                  style.push(getTransformStyle(startPosition, getPositionInJail(gameState.jail.length), animation.duration))
                  break
                case Location_Saloon:
                  style.push(getTransformStyle(startPosition, getPositionInSaloon(gameState.saloon.length, gameState.saloon.length + 1), animation.duration))
                  break
              }
            }
            return <Meeple css={style} type={meeple} key={building * 12 + index} />
          })
        )}
      </>

      <>
        {gameState.doorways.map((meeple, index) => {
          const startPosition = doorwaysPosition[index]
          let style = [getMeepleStyle(startPosition)]
          if ((animation && resolveMeepleAnimation && resolveMeepleAnimation.space === index))
            style.push(getTransformStyle(startPosition, getPositionInBuilding(index, gameState.buildings[index].length, gameState.buildings[index].length), animation.duration))
          return (meeple !== null) ? <Meeple css={style} type={meeple} key={index} /> : undefined
        }
        )}
      </>

      <>
        {gameState.jail.map((meeple, index) => {
          const startPosition = getPositionInJail(index)
          let style = [getMeepleStyle(startPosition)]
          if ((animation && selectSourceLocationAnimation && selectSourceLocationAnimation.location === Location_Jail))
            style.push(getTransformStyle(startPosition, getPositionInHand(index), animation.duration))
          return <Meeple css={style} type={meeple} key={index} />
        })}
      </>

      <>
        {gameState.saloon.map((meeple, index) => {
          const startPosition = getPositionInSaloon(index, gameState.saloon.length)
          let style = [getMeepleStyle(startPosition)]
          if ((animation && selectSourceLocationAnimation && selectSourceLocationAnimation.location === Location_Saloon))
            style.push(getTransformStyle(startPosition, getPositionInHand(index), animation.duration))
          return <Meeple css={style} type={meeple} key={index} />
        })}
      </>

      <>
        {gameState.graveyard.map((meeple, index) =>
          <Meeple css={getMeepleStyle(getPositionInGraveyard(index))} type={meeple} key={index}/>
        )}
      </>

      <>
        {gameState.showdowns.map((showdown, index) => {
          if (showdown.meeple !== undefined) {
            const startPosition = showdownMeeplePositions[index]
            let style = [getMeepleStyle(startPosition)]
            if ((animation && moveMeepleAnimation && moveMeepleAnimation.source === ((index === 0) ? Location_Showdown0 : Location_Showdown1))) {
              switch (moveMeepleAnimation.destination) {
                case Location_Graveyard:
                  style.push(getTranslateAnimationStyle(startPosition, getPositionInGraveyard(gameState.graveyard.length), animation.duration))
                  break
                case Location_Saloon:
                  style.push(getTranslateAnimationStyle(startPosition, getPositionInSaloon(gameState.saloon.length, gameState.saloon.length + 1), animation.duration))
                  break
              }
            } else {
              style.push(getPosition(startPosition))
            }
            return <div key={index}>
              {showdown.owner !== undefined ? <ShowdownToken playercolor={showdown.owner} css={getShowdownTokenStyle(showdownTokenPositions[index])} /> : undefined}
              <Meeple css={style} type={showdown.meeple} />
              {(animation && rollShowdownDiceAnimation && index === (rollShowdownDiceAnimation.location === Location_Showdown0 ? 0 : 1)) ?
                <Picture src={Images.rollingDice} css={getDiceStyle(dicePositions[index])} />
                :
                showdown.dice ? <Dice value={showdown.dice} css={getDiceStyle(dicePositions[index])} /> : undefined
              }
              </div>
          }
          return undefined
        })}
      </>

      <>
        {gameState.meeplesInHand.map((meeple, index) => {
          if (meeple === null)
            return undefined
          const startPosition = getPositionInHand(index)
          let style = [getMeepleStyle(startPosition)]
          if ((animation && placeMeepleAnimation && placeMeepleAnimation.indexInHand === index)) {
            let endPosition: number[]
            switch (placeMeepleAnimation.space) {
              case Location_Showdown0:
                endPosition = showdownMeeplePositions[0]
                break
              case Location_Showdown1:
                endPosition = showdownMeeplePositions[1]
                break
              default:
                endPosition = doorwaysPosition[placeMeepleAnimation.space]
                break
            }
            style.push(getTransformStyle(startPosition, endPosition, animation.duration))
          }
          if (currentGame.getActivePlayer() === playerColor)
            return <Meeple css={style} type={meeple} indexInHand={index} draggable={true} key={index} selectionStatus={(index === selectedMeepleIndex) ? SelectionStatus.Selected : SelectionStatus.Selectable} onSelect={() => setSelectedMeepleIndex(index)} />
          return <Meeple css={style} type={meeple} indexInHand={index} key={index} />
        })}
      </>

      {(animation === undefined && currentGame.getActivePlayer() === playerColor) &&  // possible moves, only for current player and when no animation is playing
        <>
          {
            legalMoves.filter(move => isPlaceInitialMarqueeTileMove(move)).map((move) => {
              const marqueeSelected = () => {
                play(move)
              }
              return <MarqueeSelecter css={getPosition(getMarqueeSelecterPosition((move as PlaceInitialMarqueeTile).location))} flip={(move as PlaceInitialMarqueeTile).location > 5} selected={marqueeSelected} key={(move as PlaceInitialMarqueeTile).location} />
            })
          }

          {
            buildOrUpgradeMarqueeMove !== undefined && isBuildOrUpgradeMarqueeMove(buildOrUpgradeMarqueeMove) &&
              <MarqueeSelecter css={getPosition(getMarqueeSelecterPosition(buildOrUpgradeMarqueeMove.space))} flip={buildOrUpgradeMarqueeMove.space > 5} selected={() => play(getBuildOrUpgradeMarqueeMove(buildOrUpgradeMarqueeMove.playerId, buildOrUpgradeMarqueeMove.space, true))} />
          }

          {
            legalMoves.filter(move => isSelectSourceLocationMove(move)).map((move) => {
              const location = (move as SelectSourceLocation).location
              const locationSelected = () => {
                play(move)
              }
              if (isBuildingLocation(location))
                return <GenericSelecter css={getBuildingSelecterStyle(buildingsPosition[location])} selected={locationSelected} key={location} />
              else if (location === Location_Saloon)
                return <GenericSelecter css={getSaloonSelecterStyle(saloonSelecterPosition)} selected={locationSelected} key={location} />
              else if (location === Location_Jail)
                return <GenericSelecter css={getJailSelecterStyle(jailSelecterPosition)} selected={locationSelected} key={location} />
              return undefined
            })
          }

        {
          selectedMeepleIndex !== undefined && 
            legalMoves.filter((move, index, moves) => isPlaceMeepleMove(move) && moves.findIndex(m => (m as PlaceMeeple).space === move.space) === index).map((move) => {
              const placeMeepleMove = move as PlaceMeeple
              const spaceSelected = () => {
                play(getPlaceMeepleMove(placeMeepleMove.playerId, placeMeepleMove.space, selectedMeepleIndex))
                setSelectedMeepleIndex(undefined)
              }

              if (isBuildingLocation(placeMeepleMove.space)) {
                return <DoorwaySelecter css={getDoorwaySelecterStyle(doorwaysPosition[placeMeepleMove.space])} droppable={true} selected={spaceSelected} key={placeMeepleMove.space} />
              } else if (placeMeepleMove.space === Location_Showdown0 || placeMeepleMove.space === Location_Showdown1) {
                const isShowdown1 = placeMeepleMove.space === Location_Showdown1
                return <ShowdownSelecter css={getShowdownSelecterStyle(showdownSelecterPositions[isShowdown1 ? 1 : 0])} flip={isShowdown1} droppable={true} selected={spaceSelected} key={placeMeepleMove.space} />
              }
              return undefined
            })
          }

          {
            legalMoves.filter(move => isResolveMeepleMove(move)).map(move => {
              const space = (move as ResolveMeeple).space
              const locationSelected = () => {
                play(move)
              }

              if (isBuildingLocation(space)) {
                return <DoorwaySelecter css={getDoorwaySelecterStyle(doorwaysPosition[space])} droppable={false} selected={locationSelected} key={space} />
              } else if (space === Location_Showdown0 || space === Location_Showdown1) {
                const isShowdown1 = space === Location_Showdown1
                return <ShowdownSelecter css={getShowdownSelecterStyle(showdownSelecterPositions[isShowdown1 ? 1 : 0])} flip={isShowdown1} droppable={false} selected={locationSelected} key={space} />
              }
              return undefined
            })
          }
        </>
      }

    </div>
  )
}

const style = css`
  background-image: url(${Images.board});
  background-color: #000000;
  background-size: cover;
  position: absolute;
  width: ${boardWidth}em;
  height: ${boardHeight}em;
  top: ${boardTop}em;
  left: ${boardLeft}em;
`

function getPositionInBuilding(building: number, index: number, numberOfMeeples: number) {
  let result = [...buildingsPosition[building]]
  result[0] += (index % 3) * (meepleWidth + 0.5)
  if (numberOfMeeples < 7)
    result[1] += Math.floor(index / 3) * (meepleHeight + 1)
  else if (numberOfMeeples < 10)
    result[1] += Math.floor(index / 3) * (meepleHeight * 0.75)
  else if (numberOfMeeples < 13)
    result[1] += Math.floor(index / 3) * (meepleHeight * 0.50)
  else
    result[1] += Math.floor(index / 3) * (meepleHeight * 0.40)
  return result
}

function getPositionInSaloon(index: number, numberOfMeeples: number) {
  let result = [...saloonPosition]
  if (numberOfMeeples < 7) {
    result[0] += (index % 2) * (meepleWidth * 1.4) + 1
    result[1] += Math.floor(index / 2) * (meepleHeight + 1) + 1
  } else if (numberOfMeeples < 13) {
    result[0] += (index % 3) * (meepleWidth * 0.9)
    result[1] += Math.floor(index / 3) * (meepleHeight) + 0.5
  } else if (numberOfMeeples < 16) {
    result[0] += (index % 3) * (meepleWidth * 0.9)
    result[1] += Math.floor(index / 3) * (meepleHeight * 0.75)
  } else {
    result[0] += (index % 3) * (meepleWidth * 0.9)
    result[1] += Math.floor(index / 3) * (meepleHeight * 0.50)
  }
  return result
}

function getPositionInJail(index: number) {
  let result = [...jailPosition]
  result[0] += (index % 3) * (meepleWidth * 0.9)
  result[1] += Math.floor(index / 3) * (meepleHeight * 0.85)
  return result
}

function getPositionInGraveyard(index: number): Array<number> {
  return graveyardPositions[(index < 6) ? index : 5]
}

function getGoldBarStyle(position: Array<number>) {
  return css`
  position: absolute;
  left: ${position[0]}em;
  top: ${position[1]}em;
  width: ${goldBarWidth}em;
  height: ${goldBarHeight}em;
`
}

function getDynamiteStyle(position: Array<number>) {
  return css`
  position: absolute;
  left: ${position[0]}em;
  top: ${position[1]}em;
  width: ${dynamiteWidth}em;
  height: ${dynamiteHeight}em;
  z-index: 5;
`
}

function getMeepleStyle(position: Array<number>) {
  return css`
  position: absolute;
  left: ${position[0]}em;
  top: ${position[1]}em;
  width: ${meepleWidth}em;
  height: ${meepleHeight}em;
  z-index: 10;
`
}


function getDiceStyle(position: Array<number>) {
  return css`
  position: absolute;
  left: ${position[0]}em;
  top: ${position[1]}em;
  width: ${diceWidth}em;
  height: ${diceHeight}em;
`
}

function getShowdownTokenStyle(position: Array<number>) {
  return css`
  position: absolute;
  left: ${position[0]}em;
  top: ${position[1]}em;
  width: ${showdownTokenWidth}em;
  height: ${showdownTokenHeight}em;
`
}

function getMarqueeStyle(position: Array<number>, index: number) {
  return css`
  position: absolute;
  left: ${position[0]}em;
  top: ${position[1]}em;
  ${(index > 5) && 'transform: rotate(180deg);'}
`
}

function getPositionInHand(index: number) {
  let result = [...meeplesInHandPosition]
  result[0] += index * (meepleWidth + 4)
  return result
}


function getFadeInStyle(duration: number) {
  return css`
animation: ${fadeIn} ${duration}s ease-in forwards;
`
}

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`


const getBuildingSelecterStyle = (position: Array<number>) => css`
  position: absolute;
  left: ${position[0] + buildingSelecterDeltaX}em;
  top: ${position[1] + buildingSelecterDeltaY}em;
  width: ${buildingWidth}em;
  height: ${buildingHeight}em;
  cursor: pointer;
  z-index: 20;
`

const getDoorwaySelecterStyle = (position: Array<number>) => css`
  position: absolute;
  left: ${position[0] + doorwaySelecterDeltaX}em;
  top: ${position[1] + doorwaySelecterDeltaY}em;
  width: ${doorwayWidth}em;
  height: ${doorwayHeight}em;
  z-index: 20;
`

const getSaloonSelecterStyle = (position: Array<number>) => css`
  position: absolute;
  left: ${position[0]}em;
  top: ${position[1]}em;
  width: ${saloonSelecterWidth}em;
  height: ${saloonSelecterHeight}em;
  z-index: 20;
`

const getJailSelecterStyle = (position: Array<number>) => css`
  position: absolute;
  left: ${position[0]}em;
  top: ${position[1]}em;
  width: ${jailSelecterWidth}em;
  height: ${jailSelecterHeight}em;
  z-index: 20;
`

const getShowdownSelecterStyle = (position: Array<number>) => css`
  position: absolute;
  left: ${position[0]}em;
  top: ${position[1]}em;
  z-index: 20;
`

function getTransformStyle(startPosition: Array<number>, endPosition: Array<number>, duration: number) {
  return css`
  transform: translate(${endPosition[0] - startPosition[0]}em, ${endPosition[1] - startPosition[1]}em);
  transition: transform ${duration}s ease-in-out;
`
}

function getConvertGoldBarTransformStyle(startPosition: Array<number>, endPosition: Array<number>, duration: number) {
  return css`
  transform: translate(${endPosition[0] - startPosition[0]}em, ${endPosition[1] - startPosition[1]}em) rotate(-90deg);
  transition: transform ${duration}s ease-in-out;
`
}

