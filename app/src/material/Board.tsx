/** @jsxImportSource @emotion/react */
import { css, keyframes } from '@emotion/react'
import GameState, { isBuildingLocation, Location_Graveyard, Location_Jail, Location_Saloon, Location_Showdown0, Location_Showdown1 } from '@gamepark/a-fistful-of-meeples/GameState'
import PlayerColor from '@gamepark/a-fistful-of-meeples/PlayerColor'
import { boardHeight, boardLeft, boardTop, boardWidth, goldBarPositions, buildingsPosition, meepleHeight, meepleWidth, dynamitePositions, saloonPosition, graveyardPositions, jailPosition, doorwaysPosition, showdownMeeplePositions, showdownTokenPositions, marqueesPosition, goldBarWidth, goldBarHeight, showdownSelecterPositions, saloonSelecterPosition, jailSelecterPosition, dicePositions, diceWidth, diceHeight, showdownTokenHeight, showdownTokenWidth, meeplesInHandPosition, marqueeWidth, marqueeHeight, phasePosition, phaseWidth, phaseHeight, dynamiteWidth, dynamiteHeight, buildingSelecterDeltaX, buildingSelecterDeltaY, buildingWidth, buildingHeight, doorwayWidth, doorwayHeight, doorwaySelecterDeltaX, doorwaySelecterDeltaY, saloonSelecterWidth, saloonSelecterHeight, jailSelecterHeight, jailSelecterWidth, showdownSelecterWidth, showdownSelecterHeight } from '../util/Metrics'
import Dynamite from './Dynamite'
import GoldBar from './GoldBar'
import Images from './Images'
import Meeple from './Meeple'
import ShowdownToken from './ShowdownToken'
import MeepleType from '../../../rules/src/MeepleType'
import Marquee from './Marquee'
import AFistfulOfMeeples from '../../../rules/src/AFistfulOfMeeples'
import { isBuildOrUpgradeMarqueeMove, isChangeCurrentPhaseMove, isChooseAnotherPlayerShowdownTokenMove, isMoveMeeplesMove, isPlaceInitialMarqueeTileMove, isPlaceMeepleMove, isRerollShowdownDiceMove, isResolveMeepleMove, isSelectSourceLocationMove } from '../../../rules/src/moves/Move'
import MarqueeSelecter from './MarqueeSelecter'
import PlaceInitialMarqueeTile from '../../../rules/src/moves/PlaceInitialMarqueeTile'
import { useAnimation, usePlay, usePlayerId } from '@gamepark/react-client'
import SelectSourceLocation from '../../../rules/src/moves/SelectSourceLocation'
import DoorwaySelecter from './DoorwaySelecter'
import PlaceMeeple, { getPlaceMeepleMove } from '../../../rules/src/moves/PlaceMeeple'
import ShowdownSelecter from './ShowdownSelecter'
import ResolveMeeple from '../../../rules/src/moves/ResolveMeeple'
import YesNoSelecter from '../util/YesNoSelecter'
import BuildOrUpgradeMarquee, { getBuildOrUpgradeMarqueeMove } from '../../../rules/src/moves/BuildOrUpgradeMarquee'
import { useTranslation } from 'react-i18next'
import { getRerollShowdownDiceMove } from '../../../rules/src/moves/RerollShowdownDice'
import { getChooseAnotherPlayerShowdownTokenMove } from '../../../rules/src/moves/ChooseAnotherPlayerShowdownToken'
import Dice from './Dice'
import PlayerSelecter from './PlayerSelecter'
import ChooseAnotherPlayerShowdownToken from '../../../rules/src/moves/ChooseAnotherPlayerShowdownToken'
import ChangeCurrentPhase from '../../../rules/src/moves/ChangeCurrentPhase'
import PhaseIndicator from './PhaseIndicator'
import Phase from '../../../rules/src/Phase'
import GenericSelecter from './GenericSelecter'
import MoveMeeples from '../../../rules/src/moves/MoveMeeples'


type Props = {
  game: GameState
}

export default function Board({ game }: Props) {
  const { t } = useTranslation()
  const currentGame = new AFistfulOfMeeples(game)
  const legalMoves = currentGame.getLegalMoves()
  const play = usePlay()
  const playerColor = usePlayerId<PlayerColor>()
  const buildOrUpgradeMarqueeMove = legalMoves.find(move => isBuildOrUpgradeMarqueeMove(move))
  const rerollShowdownDiceMove = legalMoves.find(move => isRerollShowdownDiceMove(move))
  const chooseAnotherPlayerMoves = legalMoves.filter(move => isChooseAnotherPlayerShowdownTokenMove(move)).map(move => (move as ChooseAnotherPlayerShowdownToken).playerId)
  // animations
  const animation = useAnimation<PlaceInitialMarqueeTile | SelectSourceLocation | PlaceMeeple | ResolveMeeple | BuildOrUpgradeMarquee | ChangeCurrentPhase | MoveMeeples>(animation => animation?.action.cancelled ?? true)
  const placeInitialMarqueeTileAnimation = animation && !animation.action.cancelled && isPlaceInitialMarqueeTileMove(animation.move) ? animation.move : undefined
  const selectSourceLocationAnimation = animation && !animation.action.cancelled && isSelectSourceLocationMove(animation.move) ? animation.move : undefined
  const placeMeepleAnimation = animation && !animation.action.cancelled && isPlaceMeepleMove(animation.move) ? animation.move : undefined
  const resolveMeepleAnimation = animation && !animation.action.cancelled && isResolveMeepleMove(animation.move) ? animation.move : undefined
  const buildOrUpgradeMarqueeAnimation = animation && !animation.action.cancelled && isBuildOrUpgradeMarqueeMove(animation.move) ? animation.move : undefined
  const changeCurrentPhaseAnimation = animation && !animation.action.cancelled && isChangeCurrentPhaseMove(animation.move) ? animation.move : undefined
  const moveMeepleAnimation = animation && !animation.action.cancelled && isMoveMeeplesMove(animation.move) ? animation.move : undefined
  const currentPhase: number = changeCurrentPhaseAnimation ? changeCurrentPhaseAnimation.phase : game.currentPhase

  let popup = undefined
  if (buildOrUpgradeMarqueeMove !== undefined && isBuildOrUpgradeMarqueeMove(buildOrUpgradeMarqueeMove)) {
    const text = (game.marquees[buildOrUpgradeMarqueeMove.space].owner === PlayerColor.None) ? t("DoYouWantToBuildAMarquee") : t("DoYouWantToUpgradeYourMarquee")
    popup = <YesNoSelecter text={text} answered={answer => play(getBuildOrUpgradeMarqueeMove(buildOrUpgradeMarqueeMove.playerId, buildOrUpgradeMarqueeMove.space, answer))} />
  }
  if (rerollShowdownDiceMove !== undefined && isRerollShowdownDiceMove(rerollShowdownDiceMove)) {
    const text = t("DoYouWantToRerollYourShowdownDice")
    popup = <YesNoSelecter text={text} answered={answer => play(getRerollShowdownDiceMove(answer))} />
  }
  if (chooseAnotherPlayerMoves.length > 0) {
    const text = t('ChooseAnotherPlayerToPlaceHisShowdownToken')
    popup = <PlayerSelecter text={text} players={chooseAnotherPlayerMoves} selected={player => play(getChooseAnotherPlayerShowdownTokenMove(player))} />
  }

  return (
    <div css={style}>
      {game.goldBarsInBank > 0 &&
        <>
        {[...Array(game.goldBarsInBank)].map((_, index) =>
          <GoldBar css={getGoldBarStyle(goldBarPositions[index])} key={index} />
          )}
        </>
      }

      {game.dynamitesInJail > 0 &&
        <>
        {[...Array(game.dynamitesInJail)].map((_, index) =>
          <Dynamite css={getDynamiteStyle(dynamitePositions[index])} key={index} />
          )}
        </>
      }

      <>
        {game.marquees.map((marquee, index) => {
          const existingMarquee: boolean = marquee.owner !== PlayerColor.None
          if (buildOrUpgradeMarqueeAnimation && buildOrUpgradeMarqueeAnimation.space === index) {
            return <Marquee owner={buildOrUpgradeMarqueeAnimation.playerId} upgraded={existingMarquee} css={[getMarqueeStyle(marqueesPosition[index], index > 5), getFadeInStyle(animation!.duration)]} key={index} />
          } else if (placeInitialMarqueeTileAnimation && placeInitialMarqueeTileAnimation.location === index) {
            return <Marquee owner={placeInitialMarqueeTileAnimation.playerId} upgraded={existingMarquee} css={[getMarqueeStyle(marqueesPosition[index], index > 5), getFadeInStyle(animation!.duration)]} key={index} />
          } else {
            return (existingMarquee) ? <Marquee owner={marquee.owner} upgraded={marquee.upgraded} css={getMarqueeStyle(marqueesPosition[index], index > 5)} key={index} /> : undefined
          }
        }
        )}
      </>

      <>
        {game.buildings.map((meeples, building) =>
            meeples.map((meeple, index) => {
              const startPosition = getPositionInBuilding(building, index)
              let style = [getMeepleStyle(startPosition)]
              if ((animation && selectSourceLocationAnimation && selectSourceLocationAnimation.location === building))
                style.push(getTransformStyle(startPosition, getPositionInHand(index), animation.duration))
              if ((animation && moveMeepleAnimation && moveMeepleAnimation.source === building && moveMeepleAnimation.meeples === meeple)) {
                switch (moveMeepleAnimation.destination) {
                  case Location_Jail:
                    style.push(getTransformStyle(startPosition, getPositionInJail(game.jail.length), animation.duration))
                    break
                  case Location_Saloon:
                    style.push(getTransformStyle(startPosition, getPositionInSaloon(game.saloon.length), animation.duration))
                    break
                }
              }
              return <Meeple css={style} type={meeple} key={building * 12 + index} />
            })
        )}
      </>

      <>
        {game.doorways.map((meeple, index) => {
          const startPosition = doorwaysPosition[index]
          let style = [getMeepleStyle(startPosition)]
          if ((animation && resolveMeepleAnimation && resolveMeepleAnimation.space === index))
            style.push(getTransformStyle(startPosition, getPositionInBuilding(index, game.buildings[index].length), animation.duration))
          return (meeple !== MeepleType.None) ? <Meeple css={style} type={meeple} key={index} /> : undefined
        }
        )}
      </>

      <>
        {game.jail.map((meeple, index) => {
          const startPosition = getPositionInJail(index)
          let style = [getMeepleStyle(startPosition)]
          if ((animation && selectSourceLocationAnimation && selectSourceLocationAnimation.location === Location_Jail))
            style.push(getTransformStyle(startPosition, getPositionInHand(index), animation.duration))
          return <Meeple css={style} type={meeple} key={index} />
        })}
      </>

      <>
        {game.saloon.map((meeple, index) => {
          const startPosition = getPositionInSaloon(index)
          let style = [getMeepleStyle(startPosition)]
          if ((animation && selectSourceLocationAnimation && selectSourceLocationAnimation.location === Location_Saloon))
            style.push(getTransformStyle(startPosition, getPositionInHand(index), animation.duration))
          return <Meeple css={style} type={meeple} key={index} />
        })}
      </>

      <>
        {game.graveyard.map((meeple, index) =>
          <Meeple css={getMeepleStyle(graveyardPositions[index])} type={meeple} key={index}/>
        )}
      </>

      <>
        { game.showdowns.map((showdown, index) => {
          if (showdown.meeple !== MeepleType.None) {
            const startPosition = showdownMeeplePositions[index]
            let style = [getMeepleStyle(startPosition)]
            if ((animation && moveMeepleAnimation && moveMeepleAnimation.source === ((index === 0) ? Location_Showdown0 : Location_Showdown1))) {
              switch (moveMeepleAnimation.destination) {
                case Location_Graveyard:
                  style.push(getTransformStyle(startPosition, graveyardPositions[game.graveyard.length], animation.duration))
                  break
                case Location_Saloon:
                  style.push(getTransformStyle(startPosition, getPositionInSaloon(game.saloon.length), animation.duration))
                  break
              }
            }
            return <div key={index}>
              <ShowdownToken playercolor={showdown.owner} css={getShowdownTokenStyle(showdownTokenPositions[index])} />
              <Meeple css={style} type={showdown.meeple} />
              {showdown.dice && <Dice value={showdown.dice} css={getDiceStyle(dicePositions[index])} />}
              </div>
          }
          return undefined
        })}
      </>

      <>
        {game.meeplesInHand.map((meeple, index) => {
          if (meeple === MeepleType.None)
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
          return <Meeple css={style} type={meeple} indexInHand={index} draggable={true} key={index} />
        })}
      </>

      <>
        <PhaseIndicator css={phaseIndicatorMetrics} phase={Phase.SelectSourceLocation} currentPhase={currentPhase} animationDuration={animation?.duration} key='PhaseIndicator1' />
        <PhaseIndicator css={phaseIndicatorMetrics} phase={Phase.PlaceMeeples} currentPhase={currentPhase} animationDuration={animation?.duration} key='PhaseIndicator2' />
        <PhaseIndicator css={phaseIndicatorMetrics} phase={Phase.ResolveMeeples} currentPhase={currentPhase} animationDuration={animation?.duration} key='PhaseIndicator3' />
        <PhaseIndicator css={phaseIndicatorMetrics} phase={Phase.CheckGoldBars} currentPhase={currentPhase} animationDuration={animation?.duration} key='PhaseIndicator4' />
      </>

      {(animation === undefined && game.activePlayer === playerColor) &&  // possible moves, only for current player and when no animation is playing
        <>
          {
            legalMoves.filter(move => isPlaceInitialMarqueeTileMove(move)).map((move) => {
              const marqueeSelected = () => {
                play(move)
              }
              return <MarqueeSelecter position={marqueesPosition[(move as PlaceInitialMarqueeTile).location]} flip={(move as PlaceInitialMarqueeTile).location > 5} selected={marqueeSelected} key={(move as PlaceInitialMarqueeTile).location} />
            })
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
            legalMoves.filter((move, index, moves) => isPlaceMeepleMove(move) && moves.findIndex(m => (m as PlaceMeeple).space === move.space) === index).map((move) => {
              const placeMeepleMove = move as PlaceMeeple
              if (isBuildingLocation(placeMeepleMove.space)) {
                const doorwaySelected = (indexInHand?: number) => {
                  if (indexInHand !== undefined)
                    play(getPlaceMeepleMove(placeMeepleMove.playerId, placeMeepleMove.space, indexInHand))
                }
                return <DoorwaySelecter css={getDoorwaySelecterStyle(doorwaysPosition[placeMeepleMove.space])} droppable={true} selected={doorwaySelected} key={placeMeepleMove.space} />
              } else if (placeMeepleMove.space === Location_Showdown0 || placeMeepleMove.space === Location_Showdown1) {
                const showdownSelected = (meeple?: MeepleType) => {
                  if (meeple !== undefined)
                    play(getPlaceMeepleMove(placeMeepleMove.playerId, placeMeepleMove.space, meeple))
                }
                const isShowdown1 = placeMeepleMove.space === Location_Showdown1
                return <ShowdownSelecter css={getShowdownSelecterStyle(showdownSelecterPositions[isShowdown1 ? 1 : 0])} flip={isShowdown1} droppable={true} selected={showdownSelected} key={placeMeepleMove.space} />
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

          { popup }
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
`
}

function getMeepleStyle(position: Array<number>) {
  return css`
  position: absolute;
  left: ${position[0]}em;
  top: ${position[1]}em;
  width: ${meepleWidth}em;
  height: ${meepleHeight}em;
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

function getMarqueeStyle(position: Array<number>, flip: boolean) {
  return css`
  position: absolute;
  left: ${position[0]}em;
  top: ${position[1]}em;
  width: ${marqueeWidth}em;
  height: ${marqueeHeight}em;
  ${flip && 'transform: rotate(180deg);'}
`
}

function getPositionInHand(index: number) {
  let result = [...meeplesInHandPosition]
  result[0] += index * (meepleWidth + 4)
  return result
}

const phaseIndicatorMetrics = css`
position: absolute;
left: ${phasePosition[0]}em;
top: ${phasePosition[1]}em;
width: ${phaseWidth}em;
height: ${phaseHeight}em;
`

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
`

const getDoorwaySelecterStyle = (position: Array<number>) => css`
  position: absolute;
  left: ${position[0] + doorwaySelecterDeltaX}em;
  top: ${position[1] + doorwaySelecterDeltaY}em;
  width: ${doorwayWidth}em;
  height: ${doorwayHeight}em;
`

const getSaloonSelecterStyle = (position: Array<number>) => css`
  position: absolute;
  left: ${position[0]}em;
  top: ${position[1]}em;
  width: ${saloonSelecterWidth}em;
  height: ${saloonSelecterHeight}em;
`

const getJailSelecterStyle = (position: Array<number>) => css`
  position: absolute;
  left: ${position[0]}em;
  top: ${position[1]}em;
  width: ${jailSelecterWidth}em;
  height: ${jailSelecterHeight}em;
`

const getShowdownSelecterStyle = (position: Array<number>) => css`
  position: absolute;
  left: ${position[0]}em;
  top: ${position[1]}em;
  width: ${showdownSelecterWidth}em;
  height: ${showdownSelecterHeight}em;
`

function getTransformStyle(startPosition: Array<number>, endPosition: Array<number>, duration: number) {
  return css`
  transform: translate(${endPosition[0] - startPosition[0]}em, ${endPosition[1] - startPosition[1]}em);
  transition: transform ${duration}s ease-in-out;
`
}
