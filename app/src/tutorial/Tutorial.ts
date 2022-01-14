import { TutorialDescription } from "@gamepark/react-client";
import GameState, { createEmptyGameState, Location_Jail, Location_Saloon, Location_Showdown0, Location_Showdown1 } from "../../../rules/src/GameState";
import MeepleType from "../../../rules/src/MeepleType";
import { getBuildOrUpgradeMarqueeMove } from "../../../rules/src/moves/BuildOrUpgradeMarquee";
import Move from "../../../rules/src/moves/Move";
import { getPlaceInitialMarqueeTileMove } from "../../../rules/src/moves/PlaceInitialMarqueeTile";
import { getPlaceMeepleMove } from "../../../rules/src/moves/PlaceMeeple";
import { getRerollShowdownDiceMove } from "../../../rules/src/moves/RerollShowdownDice";
import { getResolveMeepleMove } from "../../../rules/src/moves/ResolveMeeple";
import { getSelectSourceLocationMove } from "../../../rules/src/moves/SelectSourceLocation";
import PlayerColor from "../../../rules/src/PlayerColor";
import { initialisePlayerState } from "../../../rules/src/PlayerState";


function getTutorialGameState() {
  let gameState = createEmptyGameState()
  gameState.players = [initialisePlayerState(PlayerColor.Orange), initialisePlayerState(PlayerColor.Green)]
  gameState.startingPlayer = PlayerColor.Orange
  gameState.activePlayer = PlayerColor.Green
  gameState.buildings = [
    [MeepleType.Builder, MeepleType.Builder, MeepleType.Builder],
    [MeepleType.Builder, MeepleType.Miner, MeepleType.Deputy],
    [MeepleType.Robber, MeepleType.Deputy, MeepleType.Robber],
    [MeepleType.Robber, MeepleType.Builder, MeepleType.Robber],
    [MeepleType.Deputy, MeepleType.Builder, MeepleType.Builder],
    [MeepleType.Builder, MeepleType.Builder, MeepleType.Miner],
    [MeepleType.Robber, MeepleType.Builder, MeepleType.Builder],
    [MeepleType.Builder, MeepleType.Builder, MeepleType.Miner],
    [MeepleType.Miner, MeepleType.Miner, MeepleType.Deputy],
    [MeepleType.Builder, MeepleType.Builder, MeepleType.Miner],
    [MeepleType.Builder, MeepleType.Builder, MeepleType.Builder],
    [MeepleType.Builder, MeepleType.Builder, MeepleType.Builder]
  ]
  gameState.tutorial = 1
  return gameState
}

const AFistfulOfMeeplesTutorial: TutorialDescription<GameState, Move, PlayerColor> = {
  setupTutorial: () => [ getTutorialGameState(), [PlayerColor.Orange, PlayerColor.Green]],
  expectedMoves: () => [
    // initial marquees
    getPlaceInitialMarqueeTileMove(PlayerColor.Green, 5),
    getPlaceInitialMarqueeTileMove(PlayerColor.Orange, 0),
    getSelectSourceLocationMove(PlayerColor.Orange, 1),
    getPlaceMeepleMove(PlayerColor.Orange, 0, 1),
    getPlaceMeepleMove(PlayerColor.Orange, Location_Showdown0, 2),
    getPlaceMeepleMove(PlayerColor.Orange, 11, 0),
    getResolveMeepleMove(PlayerColor.Orange, 0),
    getResolveMeepleMove(PlayerColor.Orange, 11),
    getSelectSourceLocationMove(PlayerColor.Green, 3),
    getPlaceMeepleMove(PlayerColor.Green, 4, 2),
    getPlaceMeepleMove(PlayerColor.Green, 5, 1),
    getPlaceMeepleMove(PlayerColor.Green, Location_Showdown1, 0),
    getResolveMeepleMove(PlayerColor.Green, 4),
    getResolveMeepleMove(PlayerColor.Green, 5),
    getResolveMeepleMove(PlayerColor.Green, Location_Showdown1),
    getRerollShowdownDiceMove(true),
    getSelectSourceLocationMove(PlayerColor.Orange, 4),
    [ getPlaceMeepleMove(PlayerColor.Orange, 3, 1), getPlaceMeepleMove(PlayerColor.Orange, 3, 2) ],
    getPlaceMeepleMove(PlayerColor.Orange, 2, 0),
    getPlaceMeepleMove(PlayerColor.Orange, 1, 3),
    [getPlaceMeepleMove(PlayerColor.Orange, 0, 1), getPlaceMeepleMove(PlayerColor.Orange, 0, 2)],
    getResolveMeepleMove(PlayerColor.Orange, 2),
    getResolveMeepleMove(PlayerColor.Orange, 1),
    getResolveMeepleMove(PlayerColor.Orange, 3),
    getBuildOrUpgradeMarqueeMove(PlayerColor.Orange, 3, true),
    getResolveMeepleMove(PlayerColor.Orange, 0),
    getBuildOrUpgradeMarqueeMove(PlayerColor.Orange, 0, true),
    getSelectSourceLocationMove(PlayerColor.Green, Location_Saloon),
    getPlaceMeepleMove(PlayerColor.Green, 11, 0),
    getPlaceMeepleMove(PlayerColor.Green, Location_Showdown0, 1),
    getResolveMeepleMove(PlayerColor.Green, 11),
    getSelectSourceLocationMove(PlayerColor.Orange, Location_Jail),
    [getPlaceMeepleMove(PlayerColor.Orange, 8, 0), getPlaceMeepleMove(PlayerColor.Orange, 8, 1)],
    [getPlaceMeepleMove(PlayerColor.Orange, 9, 0), getPlaceMeepleMove(PlayerColor.Orange, 9, 1)],
    getResolveMeepleMove(PlayerColor.Orange, 8),
    getResolveMeepleMove(PlayerColor.Orange, 9),
  ]
}

export default AFistfulOfMeeplesTutorial