import PlayerState from './PlayerState'
import { initialisePlayerState } from './PlayerState'
import PlayerColor from './PlayerColor'
import MeepleType from './MeepleType'
import Phase from './Phase'
import { AFistfulOfMeeplesOptions } from './AFistfulOfMeeplesOptions'
import shuffle from 'lodash.shuffle'
import ShowdownPlace from './Showdown'

type Marquee = {
  owner?: PlayerColor
  upgraded: boolean
}

// Locations 0-11 are buildings
export const Location_Showdown0: number = 12;
export const Location_Showdown1: number = 13;
export const Location_Saloon: number = 14;
export const Location_Jail: number = 15;
export const Location_Graveyard: number = 16;

export function isBuildingLocation(location: number): boolean {
  return location >= 0 && location < 12
}

export enum Direction {
    Clockwise = 1,
    CounterClockwise = -1
}

export enum PendingEffectType {
  ChooseAnotherPlayerShowdownToken,	// active player must choose another player to place his showdown token
  BuildOrUpgradeMarquee, // a player may build or upgrade a marquee
  RollShowdownDice, // resolving showdown, players dice must be rolled
  ChooseToRerollShowdownDice, // a player may reroll his showdown dice
  ResolveShowdown,  // dice have been rolled and rerolled, time to resolve showdown !
  DrawFromBag,  // when a meeple is resolved in a building, some players may have to draw from bag
  DynamiteExplosion,  // when a dynamite is drawn from the bag
  MoveMeeples,  // when meeples are sent to another location
}

export type PendingEffect = { type: PendingEffectType.ChooseAnotherPlayerShowdownToken, space: number }
  | { type: PendingEffectType.BuildOrUpgradeMarquee, location: number }
  | { type: PendingEffectType.RollShowdownDice, location: number }
  | { type: PendingEffectType.ChooseToRerollShowdownDice, player: PlayerColor }
  | { type: PendingEffectType.ResolveShowdown }
  | { type: PendingEffectType.DrawFromBag, player: PlayerColor, amount: number }
  | { type: PendingEffectType.DynamiteExplosion }
  | { type: PendingEffectType.MoveMeeples, meeples: MeepleType, sourceLocation: number, destinationLocation: number }

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


type GameState = {
  players: PlayerState[]

  goldBarsInBank: number  // number of remaining gold bars in bank
  dynamitesInJail: number // number of remaining dynamites in jail
  goldCubesInMiningBag: number  // number of gold cubes in bag
  stoneCubesInMiningBag: number // number of stone cubes in bag
  dynamitesInMiningBag: number  // number of dynamite tokens in bag
  saloon: MeepleType[]  // array of meeples in saloon
  jail: MeepleType[]  // array of meeples in jail
  graveyard: MeepleType[] // array of meeples in graveyard
  buildings: MeepleType[][] // 12 arrays of meeples, one for each building
  doorways: (MeepleType | null)[]  // 12 meeple places, one for the doorway of each building
  showdowns: ShowdownPlace[] // 2 showdown places (meeple + owner)
  marquees: Marquee[] // one Marquee for each building, indicating the owner of the marquee and whether it's upgraded or not

  startingPlayer: PlayerColor // which was the first player
  activePlayer?: PlayerColor  // undefined if game is over
  currentPhase: Phase // current phase of the game (see Phase)
  meeplesInHand: (MeepleType | null)[] // Meeples player took from source location, waiting to be placed
  meeplePlacingDirection?: Direction // Direction in which meeples are being placed
  previousMeepleLocation?: number // Space where previous meeple was placed (or location where meeples where taken from)

  pendingEffects: PendingEffect[] // effects which must be resolved before going on with the game. 

  tutorial?: number // used to draw specific 'random' values in tutorial
}

export default GameState

export function createEmptyGameState(): GameState {
  // creates an intial GameState without players, startingPlayer, activePlayer nor meeples
  return {
    players: [],

    goldBarsInBank: 6,
    dynamitesInJail: 3,
    goldCubesInMiningBag: 36,
    stoneCubesInMiningBag: 18,
    dynamitesInMiningBag: 0,
    saloon: [MeepleType.Madame],
    jail: [],
    graveyard: [],
    buildings: new Array<MeepleType[]>(12),
    doorways: new Array<(MeepleType | null)>(12).fill(null),
    showdowns: [{ meeple: undefined, owner: undefined, dice: 0 }, { meeple: undefined, owner: undefined, dice: 0 }],
    marquees: new Array<Marquee>(12).fill({ owner: undefined, upgraded: false }, 0, 12),

    startingPlayer: 0,
    activePlayer: 0,
    currentPhase: Phase.PlaceInitialMarqueeTiles,
    meeplesInHand: [],
    meeplePlacingDirection: undefined,
    previousMeepleLocation: undefined,

    pendingEffects: [],
  }
}

export function initialiseGameState(options: AFistfulOfMeeplesOptions): GameState {
  let gameState: GameState = createEmptyGameState()

  gameState.players = options.players.map(player => initialisePlayerState(player.id))
  gameState.startingPlayer = options.players[0].id
  gameState.activePlayer = options.players[options.players.length - 1].id

 
  let meeples: MeepleType[] = shuffle(new Array<MeepleType>(36).fill(MeepleType.Deputy, 0, 4).fill(MeepleType.Robber, 4, 9).fill(MeepleType.Miner, 9, 15).fill(MeepleType.Builder, 15, 36));
  let i: number;
  for (i = 0; i < 12; ++i) {
    gameState.buildings[i] = meeples.slice(i * 3, i * 3 + 3);
  }
  return gameState;
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

export function getPlayerRemainingMarquees(state: GameState, playerColor: PlayerColor): number {
  return 8 - state.marquees.filter(marquee => marquee.owner === playerColor).length
}


export function endOfGameTriggered(state: GameState): boolean {
  return state.goldBarsInBank == 0 || state.graveyard.length >= 6 || (state.dynamitesInJail == 0 && state.dynamitesInMiningBag == 0)
}

export function getPlayerScore(state: GameState, player: PlayerColor): number {
  const playerState: PlayerState = state.players.find(ps => ps.color === player)!
  // compute score : gold bars, gold pieces and marquees
  return getPlayerScorePieces(playerState) + getPlayerScoreBars(playerState) + getPlayerScoreMarquees(state, player)
}
export function getPlayerScorePieces(playerState: PlayerState): number {
  return playerState.goldPieces
}
export function getPlayerScoreBars(playerState: PlayerState): number {
  return 10 * playerState.goldBars
}
export function getPlayerScoreMarquees(state: GameState, player: PlayerColor): number {
  return state.marquees.map<number>(marquee => marquee.owner == player ? (marquee.upgraded ? 10 : 5) : 0).reduce((previous: number, current: number) => previous + current, 0)
}

