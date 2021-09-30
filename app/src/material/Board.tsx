/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import GameState, { isBuildingLocation, Location_Jail, Location_Saloon, Location_Showdown0, Location_Showdown1 } from '@gamepark/a-fistful-of-meeples/GameState'
import PlayerColor from '@gamepark/a-fistful-of-meeples/PlayerColor'
import { boardHeight, boardLeftMargin, boardTopMargin, boardWidth, goldBarPositions, buildingsPosition, meepleHeight, meepleWidth, dynamitePositions, miningBagLeft, miningBagTop, saloonPosition, graveyardPositions, jailPosition, doorwaysPosition, showdownMeeplePositions, showdownTokenPositions, marqueesPosition, playerInfoPositions, goldBarWidth, goldBarHeight, phasesPositions, meeplesInHandPosition, showdownSelecterPositions, saloonSelecterPosition, jailSelecterPosition, dicePositions, diceWidth, diceHeight, showdownTokenHeight, showdownTokenWidth } from '../util/Metrics'
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
import AFistfulOfMeeples from '../../../rules/src/AFistfulOfMeeples'
import { isBuildOrUpgradeMarqueeMove, isChooseAnotherPlayerShowdownTokenMove, isPlaceInitialMarqueeTileMove, isPlaceMeepleMove, isRerollShowdownDiceMove, isResolveMeepleMove, isSelectSourceLocationMove } from '../../../rules/src/moves/Move'
import MarqueeSelecter from './MarqueeSelecter'
import PlaceInitialMarqueeTile from '../../../rules/src/moves/PlaceInitialMarqueeTile'
import { usePlay } from '@gamepark/react-client'
import BuildingSelecter from './BuildingSelecter'
import SelectSourceLocation from '../../../rules/src/moves/SelectSourceLocation'
import DoorwaySelecter from './DoorwaySelecter'
import PlaceMeeple, { getPlaceMeepleMove } from '../../../rules/src/moves/PlaceMeeple'
import ShowdownSelecter from './ShowdownSelecter'
import SaloonSelecter from './SaloonSelecter'
import JailSelecter from './JailSelecter'
import ResolveMeeple from '../../../rules/src/moves/ResolveMeeple'
import YesNoSelecter from '../util/YesNoSelecter'
import { getBuildOrUpgradeMarqueeMove } from '../../../rules/src/moves/BuildOrUpgradeMarquee'
import { useTranslation } from 'react-i18next'
import { getRerollShowdownDiceMove } from '../../../rules/src/moves/RerollShowdownDice'
import { getChooseAnotherPlayerShowdownTokenMove } from '../../../rules/src/moves/ChooseAnotherPlayerShowdownToken'
import Dice from './Dice'
import PlayerSelecter from './PlayerSelecter'
import ChooseAnotherPlayerShowdownToken from '../../../rules/src/moves/ChooseAnotherPlayerShowdownToken'


type Props = {
  game: GameState
  player: PlayerColor | undefined
}

export default function Board({ game, player }: Props) {
  const { t } = useTranslation()
  const currentGame = new AFistfulOfMeeples(game)
  const legalMoves = currentGame.getLegalMoves()
  const play = usePlay()
  const buildOrUpgradeMarqueeMove = legalMoves.find(move => isBuildOrUpgradeMarqueeMove(move))
  const rerollShowdownDiceMove = legalMoves.find(move => isRerollShowdownDiceMove(move))
  const chooseAnotherPlayerMoves = legalMoves.filter(move => isChooseAnotherPlayerShowdownTokenMove(move)).map(move => (move as ChooseAnotherPlayerShowdownToken).playerId)

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
            return <div key={index}>
              <ShowdownToken playercolor={showdown.owner} css={getShowdownTokenStyle(showdownTokenPositions[index])} />
              <Meeple position={showdownMeeplePositions[index]} type={showdown.meeple} />
              {showdown.dice && <Dice value={showdown.dice} css={getDiceStyle(dicePositions[index])} />}
              </div>
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
        { game.meeplesInHand.map((meeple, index) =>
          (meeple !== MeepleType.None) && < Meeple position={getPositionInHand(index)} type={meeple} draggable={true} key={index} />
        )}
      </>

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
            return <BuildingSelecter position={buildingsPosition[location]} selected={locationSelected} key={location} />
          else if (location === Location_Saloon)
            return <SaloonSelecter position={saloonSelecterPosition} selected={locationSelected} key={location} />
          else if (location === Location_Jail)
            return <JailSelecter position={jailSelecterPosition} selected={locationSelected} key={location} />
          return undefined
          })
        }

        {
          legalMoves.filter((move, index, moves) => isPlaceMeepleMove(move) && moves.findIndex(m => (m as PlaceMeeple).space === move.space) === index).map((move) => {
          const placeMeepleMove = move as PlaceMeeple
          if (isBuildingLocation(placeMeepleMove.space)) {
            const doorwaySelected = (meeple?: MeepleType) => {
              if (meeple !== undefined)
                play(getPlaceMeepleMove(placeMeepleMove.playerId, placeMeepleMove.space, meeple))
            }
            return <DoorwaySelecter position={doorwaysPosition[placeMeepleMove.space]} droppable={true} selected={doorwaySelected} key={placeMeepleMove.space} />
          } else if (placeMeepleMove.space === Location_Showdown0 || placeMeepleMove.space === Location_Showdown1) {
            const showdownSelected = (meeple?: MeepleType) => {
              if (meeple !== undefined)
                play(getPlaceMeepleMove(placeMeepleMove.playerId, placeMeepleMove.space, meeple))
            }
            const isShowdown1 = placeMeepleMove.space === Location_Showdown1
            return <ShowdownSelecter position={showdownSelecterPositions[isShowdown1 ? 1 : 0]} flip={isShowdown1} droppable={true} selected={showdownSelected} key={placeMeepleMove.space} />
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
              return <DoorwaySelecter position={doorwaysPosition[space]} droppable={false} selected={locationSelected} key={space} />
            } else if (space === Location_Showdown0 || space === Location_Showdown1) {
              const isShowdown1 = space === Location_Showdown1
              return <ShowdownSelecter position={showdownSelecterPositions[isShowdown1 ? 1 : 0]} flip={isShowdown1} droppable={false} selected={locationSelected} key={space} />
            }
            return undefined
          })
        }

        { popup}

        {
          /*
           * moves implemented : 
          PlaceInitialMarqueeTile,
          SelectSourceLocation,
          PlaceMeeple,
          ResolveMeeple,
          BuildOrUpgradeMarquee,
          RerollShowdownDice,
          ChooseAnotherPlayerShowdownToken,

          * no action required, animation instead :
          DrawFromBag,
          SendExtraMeeplesToSaloon,
          DynamiteExplosion,
          MoveMeeples,
          ChangePhase,
          ResolveShowdown,
          CheckGoldBars,

        */
        }

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

function getDiceStyle(position: Array<number>) {
  return css`
  position: absolute;
  left: ${position[0]}%;
  top: ${position[1]}%;
  width: ${diceWidth}%;
  height: ${diceHeight}%;
`
}

function getShowdownTokenStyle(position: Array<number>) {
  return css`
  position: absolute;
  left: ${position[0]}%;
  top: ${position[1]}%;
  width: ${showdownTokenWidth}%;
  height: ${showdownTokenHeight}%;
`
}