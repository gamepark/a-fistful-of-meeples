import PlayerState from './PlayerState'
import { initialisePlayerState } from './PlayerState'
import PlayerColor from './PlayerColor'
import Meeple from './Meeple'
import Phase from './Phase'
import { AFistfulOfMeeplesOptions } from './AFistfulOfMeeplesOptions'
import shuffle from 'lodash.shuffle'

export enum MiningBagContent {
    Gold,
    Stone,
    Dynamite
}

type ShowdownPlace = {
    meeple: Meeple
    owner: PlayerColor
}

type Marquee = {
  owner: PlayerColor
  upgraded: boolean
}

export const Location_None: number = 0;
// Locations 1-12 are buildings
export const Location_Saloon: number = 13;
export const Location_Jail: number = 14;

export const Space_None: number = 0;
// Spaces 1-12 are building doorways
export const Space_Showdown1: number = 13;
export const Space_Showdown2: number = 14;

export enum Direction {
    None = 0,
    Clockwise = 1,
    CounterClockwise = -1
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
  doorways: Meeple[][]  // 12 arrays of meeples, one for the doorway of each building
  showdowns: ShowdownPlace[] // 2 showdown places (meeple + owner)
  marquees: Marquee[] // one Marquee for each building, indicating the owner of the marquee and whether it's upgraded or not

  startingPlayer: PlayerColor // which was the first player
  activePlayer: PlayerColor  // None if game is over
  currentPhase: Phase // current phase of the game (see Phase)
  meeplesSourceLocation: number  // Location where meeples where taken from
  meeplesInHand: Meeple[] // Meeples player took from source location, waiting to be placed
  meeplePlacingDirection: Direction // Direction in which meeples are being placed
  previousMeeplePlacingSpace: number // Space where previous meeple was placed

  //PendingEffects
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
    doorways: new Array<Meeple[]>(12),
    showdowns: [{ meeple: Meeple.None, owner: PlayerColor.None, }, { meeple: Meeple.None, owner: PlayerColor.None, }],
    marquees: new Array<Marquee>(12).fill({ owner: PlayerColor.None, upgraded: false }, 0, 12),

    startingPlayer: PlayerColor.Orange,
    activePlayer: PlayerColor.Black,
    currentPhase: Phase.PlaceInitialMarqueeTiles,
    meeplesSourceLocation: Location_None,
    meeplesInHand: [],
    meeplePlacingDirection: Direction.None,
    previousMeeplePlacingSpace: Space_None,
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
    case Space_Showdown1:
      return 1
    case 6:
      return (state.showdowns[1].meeple === Meeple.None) ? Space_Showdown2 : 7
    case Space_Showdown2:
      return 7
    case 12:
      return (state.showdowns[0].meeple === Meeple.None) ? Space_Showdown1 : 1
    default:
      return space + 1;
  }
}

export function getPreviousSpace(space: number, state: GameState): number {
  switch (space) {
    case Space_Showdown1:
      return 12
    case 7:
      return (state.showdowns[1].meeple === Meeple.None) ? Space_Showdown2 : 6
    case Space_Showdown2:
      return 6
    case 1:
      return (state.showdowns[0].meeple === Meeple.None) ? Space_Showdown1 : 12
    default:
      return space - 1;
  }
}
