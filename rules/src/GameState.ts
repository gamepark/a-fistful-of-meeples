import PlayerState from './PlayerState'
import { initialisePlayerState } from './PlayerState'
import PlayerColor from './PlayerColor'
import Meeple from './Meeple'
import Phase from './Phase'
import { AFistfulOfMeeplesOptions } from './AFistfulOfMeeplesOptions'
import shuffle from 'lodash.shuffle'
import MiningBagContent from './MiningBag'
import ShowdownPlace from './Showdown'

type Marquee = {
  owner: PlayerColor
  upgraded: boolean
}

export const Location_None: number = 0;
// Locations 1-12 are buildings
export const Location_Showdown0: number = 13;
export const Location_Showdown1: number = 14;
export const Location_Saloon: number = 15;
export const Location_Jail: number = 16;
export const Location_Graveyard: number = 17;

export enum Direction {
    None = 0,
    Clockwise = 1,
    CounterClockwise = -1
}

export enum PendingEffectType {
  ChooseAnotherPlayerShowdownToken,	// active player must choose another player to place his showdown token
  BuildOrUpgradeMarquee, // a player may build or upgrade a marquee
  ChooseToRerollShowdownDice, // a player may reroll his showdown dice
  ResolveShowdown,  // dice have been rolled and rerolled, time to resolve showdown !
  DrawFromBag,  // when a meeple is resolved in a building, some players may have to draw from bag
  DynamiteExplosion,  // when a dynamite is drawn from the bag
  MoveMeeples,  // when meeples are sent to another location
}

type PendingEffect = { type: PendingEffectType.ChooseAnotherPlayerShowdownToken, space: number }
  | { type: PendingEffectType.BuildOrUpgradeMarquee, location: number }
  | { type: PendingEffectType.ChooseToRerollShowdownDice, player: PlayerColor }
  | { type: PendingEffectType.ResolveShowdown }
  | { type: PendingEffectType.DrawFromBag, player: PlayerColor, content: MiningBagContent[] }
  | { type: PendingEffectType.DynamiteExplosion }
  | { type: PendingEffectType.MoveMeeples, meeples: Meeple, sourceLocation: number, destinationLocation: number }

type BuildingCost = {
  gold: number
  stones: number
}

export const BuildingCosts: BuildingCost[] = [
  { gold: 0, stones: 3 },
  { gold: 1, stones: 2 },
  { gold: 2, stones: 1 },
  { gold: 2, stones: 1 },
  { gold: 1, stones: 2 },
  { gold: 0, stones: 3 },
  { gold: 0, stones: 3 },
  { gold: 1, stones: 2 },
  { gold: 2, stones: 1 },
  { gold: 2, stones: 1 },
  { gold: 1, stones: 2 },
  { gold: 0, stones: 3 },
]

export function canPayBuildingCost(player: PlayerState, space: number): boolean {
  return (player.goldPieces >= BuildingCosts[space].gold && player.stones >= BuildingCosts[space].stones)
}



/**
 * In here, you describe what a GameState will look like at any time during a game.
 */
type GameState = {
  players: PlayerState[]

  goldBarsInBank: number  // number of remaining gold bars in bank
  dynamitesInJail: number // number of remaining dynamites in jail
  goldCubesInMiningBag: number  // number of gold cubes in bag
  stoneCubesInMiningBag: number // number of stone cubes in bag
  dynamitesInMiningBag: number  // number of dynamite tokens in bag
  saloon: Meeple[]  // array of meeples in saloon
  jail: Meeple[]  // array of meeples in jail
  graveyard: Meeple[] // array of meeples in graveyard
  buildings: Meeple[][] // 12 arrays of meeples, one for each building
  doorways: Meeple[]  // 12 meeple places, one for the doorway of each building
  showdowns: ShowdownPlace[] // 2 showdown places (meeple + owner)
  marquees: Marquee[] // one Marquee for each building, indicating the owner of the marquee and whether it's upgraded or not

  startingPlayer: PlayerColor // which was the first player
  activePlayer: PlayerColor  // None if game is over
  currentPhase: Phase // current phase of the game (see Phase)
  meeplesSourceLocation: number  // Location where meeples where taken from
  meeplesInHand: Meeple[] // Meeples player took from source location, waiting to be placed
  meeplePlacingDirection: Direction // Direction in which meeples are being placed
  previousMeeplePlacingSpace: number // Space where previous meeple was placed

  pendingEffects: PendingEffect[] // effects which must be resolved before going on with the game. 
}

export default GameState

export function initialiseGameState(options: AFistfulOfMeeplesOptions): GameState {
  let gameState: GameState = {
    players: options.players.map(player => initialisePlayerState(player)),

    goldBarsInBank: 6,
    dynamitesInJail: 3,
    goldCubesInMiningBag: 36,
    stoneCubesInMiningBag: 18,
    dynamitesInMiningBag: 0,
    saloon: [Meeple.Madame],
    jail: [],
    graveyard: [],
    buildings: new Array<Meeple[]>(12),
    doorways: new Array<Meeple>(12),
    showdowns: [{ meeple: Meeple.None, owner: PlayerColor.None, dice: 0 }, { meeple: Meeple.None, owner: PlayerColor.None, dice: 0 }],
    marquees: new Array<Marquee>(12).fill({ owner: PlayerColor.None, upgraded: false }, 0, 12),

    startingPlayer: PlayerColor.Orange,
    activePlayer: PlayerColor.Black,
    currentPhase: Phase.PlaceInitialMarqueeTiles,
    meeplesSourceLocation: Location_None,
    meeplesInHand: [],
    meeplePlacingDirection: Direction.None,
    previousMeeplePlacingSpace: Location_None,

    pendingEffects: [],
  }

  let meeples: Meeple[] = shuffle(new Array<Meeple>(36).fill(Meeple.Deputy, 0, 4).fill(Meeple.Robber, 4, 9).fill(Meeple.Miner, 9, 15).fill(Meeple.Builder, 15, 36));
  let i: number;
  for (i = 0; i < 12; ++i) {
    gameState.buildings[i] = meeples.slice(i * 3, i * 3 + 3);
  }
  return gameState;
}

export function getNextSpace(space: number, state: GameState): number {
  switch (space) {
    case Location_Showdown0:
      return 1
    case 6:
      return (state.showdowns[1].meeple === Meeple.None) ? Location_Showdown1 : 7
    case Location_Showdown1:
      return 7
    case 12:
      return (state.showdowns[0].meeple === Meeple.None) ? Location_Showdown0 : 1
    default:
      return space + 1;
  }
}

export function getPreviousSpace(space: number, state: GameState): number {
  switch (space) {
    case Location_Showdown0:
      return 12
    case 7:
      return (state.showdowns[1].meeple === Meeple.None) ? Location_Showdown1 : 6
    case Location_Showdown1:
      return 6
    case 1:
      return (state.showdowns[0].meeple === Meeple.None) ? Location_Showdown0 : 12
    default:
      return space - 1;
  }
}

export function isSpaceEmpty(space: number, state: GameState): boolean {
  switch (space) {
    case Location_Showdown0:
      return state.showdowns[0].meeple === Meeple.None
    case Location_Showdown1:
      return state.showdowns[1].meeple === Meeple.None
    default:
      return state.doorways[space] == Meeple.None
  }
}

export function getNextPlayer(state: GameState, playerColor: PlayerColor): PlayerColor {
  const index = state.players.findIndex(player => player.color === playerColor) + 1
  if (index < state.players.length)
    return state.players[index].color
  return state.players[0].color
}

export function getPreviousPlayer(state: GameState, playerColor: PlayerColor): PlayerColor {
  const index = state.players.findIndex(player => player.color === playerColor) - 1
  if (index >= 0)
    return state.players[index].color
  return state.players[state.players.length - 1].color
}

export function endOfGameTriggered(state: GameState): boolean {
  return state.goldBarsInBank == 0 || state.graveyard.length >= 6 || (state.dynamitesInJail == 0 && state.dynamitesInMiningBag == 0)
}

