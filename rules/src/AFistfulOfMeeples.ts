import {Action, Competitive, RandomMove, SequentialGame, TimeLimit, Undo} from '@gamepark/rules-api'
import {AFistfulOfMeeplesOptions, isGameOptions} from './AFistfulOfMeeplesOptions'
import GameState, {
  endOfGameTriggered, getNextPlayer, getPlayerScore, initialiseGameState, Location_Jail, Location_Saloon, Location_Showdown0, Location_Showdown1,
  PendingEffectType
} from './GameState'
import MiningBagContent, {drawCubesFromBag} from './MiningBag'
import {buildOrUpgradeMarquee, getBuildOrUpgradeMarqueeMove} from './moves/BuildOrUpgradeMarquee'
import {changeCurrentPhase, getChangeCurrentPhaseMove} from './moves/ChangeCurrentPhase'
import {chooseAnotherPlayerToPlaceShowdownToken, getChooseAnotherPlayerShowdownTokenMove} from './moves/ChooseAnotherPlayerShowdownToken'
import {canTradeGoldBar, convertGoldBar} from './moves/ConvertGoldBar'
import {drawFromBag, getDrawFromBagMove} from './moves/DrawFromBag'
import {dynamiteExplosion} from './moves/DynamiteExplosion'
import Move, {isDrawFromBagMove, isRollShowdownDiceMove} from './moves/Move'
import {moveMeeples} from './moves/MoveMeeples'
import MoveRandomized from './moves/MoveRandomized'
import MoveType from './moves/MoveType'
import {placeInitialMarqueeTile} from './moves/PlaceInitialMarqueeTile'
import {getPlaceMeepleMove, isValidSpaceToPlaceMeeple, placeMeeple} from './moves/PlaceMeeple'
import {getRerollShowdownDiceMove, rerollShowdownDice} from './moves/RerollShowdownDice'
import {resolveMeeple} from './moves/ResolveMeeple'
import {resolveShowdown} from './moves/ResolveShowdown'
import {getRollShowdownDiceMove, rollShowdownDice} from './moves/RollShowdownDice'
import {selectSourceLocation} from './moves/SelectSourceLocation'
import {sendExtraMeeplesToSaloon} from './moves/SendExtraMeeplesToSaloon'
import Phase from './Phase'
import PlayerColor from './PlayerColor'
import PlayerState from './PlayerState'

export default class AFistfulOfMeeples extends SequentialGame<GameState, Move, PlayerColor>
  implements Undo<GameState, Move, PlayerColor>, TimeLimit<GameState, Move, PlayerColor>, Competitive<GameState, Move, PlayerColor>,
    RandomMove<GameState, Move, MoveRandomized> {
  /**
   * This constructor is called when the game "restarts" from a previously saved state.
   * @param state The state of the game
   */
  constructor(state: GameState)
  /**
   * This constructor is called when a new game is created. If your game has options, or a variable number of players, it will be provided here.
   * @param options The options of the new game
   */
  constructor(options: AFistfulOfMeeplesOptions)
  /**
   * In here you must code the construction of your class. Use a "typeguard" to distinguish a new game from a restored game.
   * @param arg The state of the game, or the options when starting a new game
   */
  constructor(arg: GameState | AFistfulOfMeeplesOptions) {
    if (isGameOptions(arg)) {
      super(initialiseGameState(arg))
    } else {
      super(arg)
    }
  }

  /**
   * @return True when game is over
   */
  isOver(): boolean {
    return this.state.activePlayer === undefined
  }

  /**
   * Retrieves the player which must act. It is used to secure the game and prevent players from acting outside their turns.
   * @return The identifier of the player whose turn it is
   */
  getActivePlayer(): PlayerColor | undefined {
    if (this.state.pendingEffects.length > 0) {
      let effect = this.state.pendingEffects[0]
      if (effect.type === PendingEffectType.BuildOrUpgradeMarquee && this.state.marquees[effect.location].owner !== undefined) {
        return this.state.marquees[effect.location].owner
      }
      if (effect.type === PendingEffectType.ChooseToRerollShowdownDice)
        return effect.player
    }

    return this.state.activePlayer // You must return undefined only when game is over, otherwise the game will be blocked.
  }

  /**
   * Return the exhaustive list of moves that can be played by the active player.
   * This is used for 2 features:
   * - security (preventing unauthorized moves from being played);
   * - "Dummy players": when a player leaves a game, it is replaced by a "Dummy" that plays random moves, allowing the other players to finish the game.
   * In a SimultaneousGame, as multiple players can be active you will be passed a playedId as an argument.
   * If the game allows a very large (or infinite) number of moves, instead of implementing this method, you can implement instead:
   * - isLegal(move: Move):boolean, for security; and
   * - A class that implements "Dummy" to provide a custom Dummy player.
   */
  getLegalMoves(): Move[] {
    const moves: Move[] = []
    let i: number

    if (this.state.pendingEffects.length > 0) {
      let effect = this.state.pendingEffects[0]
      switch (effect.type) {
        case PendingEffectType.ChooseAnotherPlayerShowdownToken:
          this.state.players.forEach(player => {
            if (player.color !== this.state.activePlayer)
              moves.push(getChooseAnotherPlayerShowdownTokenMove(player.color))
          })
          break

        case PendingEffectType.BuildOrUpgradeMarquee:
          moves.push(getBuildOrUpgradeMarqueeMove(this.getActivePlayer()!, effect.location, true))
          moves.push(getBuildOrUpgradeMarqueeMove(this.getActivePlayer()!, effect.location, false))
          break

        case PendingEffectType.ChooseToRerollShowdownDice:
          moves.push(getRerollShowdownDiceMove(true))
          moves.push(getRerollShowdownDiceMove(false))
          break
      }
    } else if (this.state.activePlayer !== undefined) {
      const activePlayer: PlayerColor = this.state.activePlayer

      // no relevant pending effect : allowed moves depend on current phase
      switch (this.state.currentPhase) {

        case Phase.PlaceInitialMarqueeTiles:
          [0, 5, 6, 11].forEach(i => {
            if (this.state.marquees[i].owner === undefined) {
              moves.push({ type: MoveType.PlaceInitialMarqueeTile, playerId: activePlayer, location: i })
            }
          })
          break

        case Phase.SelectSourceLocation:
          for (i = 0; i < 12; ++i) {
            if (this.state.buildings[i].length > 0) {
              moves.push({ type: MoveType.SelectSourceLocation, playerId: activePlayer, location: i })
            }
          }
          if (this.state.saloon.length > 0) {
            moves.push({ type: MoveType.SelectSourceLocation, playerId: activePlayer, location: Location_Saloon })
          }
          if (this.state.jail.length > 0) {
            moves.push({ type: MoveType.SelectSourceLocation, playerId: activePlayer, location: Location_Jail })
          }
          break

        case Phase.PlaceMeeples:
          let validDestinations: number[] = []
          if (isValidSpaceToPlaceMeeple(Location_Showdown0, this.state))
            validDestinations.push(Location_Showdown0)
          if (isValidSpaceToPlaceMeeple(Location_Showdown1, this.state))
            validDestinations.push(Location_Showdown1)
          for (i = 0; i < 12; ++i) {
            if (isValidSpaceToPlaceMeeple(i, this.state))
              validDestinations.push(i)
          }
          if (validDestinations.length === 0) {
            // no valid space : send remaining meeples to saloon
            moves.push({ type: MoveType.SendExtraMeeplesToSaloon })
          } else {
            this.state.meeplesInHand.forEach((meeple, index) => {
              if (meeple !== null) {
                validDestinations.forEach(destination => {
                  moves.push(getPlaceMeepleMove(activePlayer, destination, index))
                })
              }
            })
          }
          break

        case Phase.ResolveMeeples:
          if (this.state.showdowns[0].meeple !== undefined && this.state.showdowns[1].meeple !== undefined) {
            moves.push({ type: MoveType.ResolveMeeple, playerId: activePlayer, space: Location_Showdown0 })
            moves.push({ type: MoveType.ResolveMeeple, playerId: activePlayer, space: Location_Showdown1 })
          }
          for (i = 0; i < 12; ++i) {
            if (this.state.doorways[i] !== null) {
              moves.push({ type: MoveType.ResolveMeeple, playerId: activePlayer, space: i })
            }
          }
          break

        case Phase.CheckGoldBars:
          // just automatic move here
          break

        case Phase.GameOver:
          break;

        default:
          return this.state.currentPhase // never guard

      }
    }
    return moves
  }

  randomize(move: Move): Move & MoveRandomized {
    if (move.type === MoveType.RollShowdownDice) {
      switch (this.state.tutorial) {
        case 2:
          return {...move, value: 1}
        case 3:
          return {...move, value: 4}
        case 4:
          return {...move, value: 6}
        default:
          return {...move, value: Math.floor(Math.random() * 6) + 1}
      }
    } else if (move.type === MoveType.DrawFromBag) {
      switch (this.state.tutorial) {
        case 1:
          return {...move, content: [MiningBagContent.Gold, MiningBagContent.Stone]}
        case 5:
          return {...move, content: [MiningBagContent.Gold, MiningBagContent.Gold, MiningBagContent.Stone]}
        case 6:
          return {...move, content: [MiningBagContent.Gold, MiningBagContent.Stone, MiningBagContent.Stone, MiningBagContent.Stone]}
        case 7:
          return {...move, content: [MiningBagContent.Stone, MiningBagContent.Stone, MiningBagContent.Gold, MiningBagContent.Stone]}
        case 8:
          return {...move, content: [MiningBagContent.Stone, MiningBagContent.Stone, MiningBagContent.Stone, MiningBagContent.Gold]}
        case 9:
          return {...move, content: [MiningBagContent.Gold, MiningBagContent.Dynamite]}
        default:
          return {...move, content: drawCubesFromBag(this.state)}
      }
    }
    return move
  }

  play(move: MoveRandomized): void {
    playMove(this.state, move)
  }

  canUndo(action: Action<Move, PlayerColor>, consecutiveActions: Action<Move, PlayerColor>[]): boolean {
    return getCanUndo(action, consecutiveActions)
  }

  getAutomaticMoves(): Move[] {
    const move = getAutomaticMove(this.state)
    return move ? [move] : []
  }

  giveTime(_playerId: PlayerColor): number {
    if (this.state.pendingEffects.length > 0) {
      let effect = this.state.pendingEffects[0]
      switch (effect.type) {
        case PendingEffectType.BuildOrUpgradeMarquee:
        case PendingEffectType.ChooseToRerollShowdownDice:
          return 15
      }
    }

    switch (this.state.currentPhase) {
      case Phase.PlaceInitialMarqueeTiles:
        return 15
      case Phase.SelectSourceLocation:
        return 90
    }

    return 0
  }

  getPlayer(playerId: PlayerColor): PlayerState {
    const result = this.state.players.find(player => player.color === playerId)
    if (!result) throw new Error(`${playerId} is expected on ${this.state}`)
    return result
  }

  rankPlayers(playerA: PlayerColor, playerB: PlayerColor): number {
    const scoreA = getPlayerScore(this.state, playerA)
    const scoreB = getPlayerScore(this.state, playerB)

    if (scoreA !== scoreB)
      return scoreB - scoreA

    const pA = this.getPlayer(playerA)
    const pB = this.getPlayer(playerB)
    return pB.goldPieces + pB.stones - pA.goldPieces - pA.stones
  }

  getScore(playerId: PlayerColor): number {
    return getPlayerScore(this.state, playerId)
  }
}


export function getCanUndo(action: Action < Move, PlayerColor >, consecutiveActions: Action < Move, PlayerColor > []): boolean {
  if (consecutiveActions.length > 0)
    return false

  return !action.consequences.some(move => isDrawFromBagMove(move) || isRollShowdownDiceMove(move));
}


export function getAutomaticMove(state: GameState): Move | undefined {
  if (state.pendingEffects.length > 0) {
    const effect = state.pendingEffects[0]
    switch (effect.type) {
      case PendingEffectType.DrawFromBag:
        return getDrawFromBagMove(effect.player)
      case PendingEffectType.RollShowdownDice:
        return getRollShowdownDiceMove(effect.location)
      case PendingEffectType.DynamiteExplosion:
        return { type: MoveType.DynamiteExplosion }
      case PendingEffectType.MoveMeeples:
        return { type: MoveType.MoveMeeples, meeples: effect.meeples, source: effect.sourceLocation, destination: effect.destinationLocation }
      case PendingEffectType.ResolveShowdown:
        return { type: MoveType.ResolveShowdown }
    }
  } else switch (state.currentPhase) {
    case Phase.PlaceInitialMarqueeTiles:
      if (state.marquees.filter(marquee => marquee.owner !== undefined).length === state.players.length)
        return getChangeCurrentPhaseMove(Phase.SelectSourceLocation)  // all players have placed their initial marquee, begin first turn of the game
      break

    case Phase.SelectSourceLocation:
      if (state.previousMeepleLocation !== undefined)
        return getChangeCurrentPhaseMove(Phase.PlaceMeeples)  // source location has been chosen, time to place meeples
      break

    case Phase.PlaceMeeples:
      if (state.meeplesInHand.every(meeple => meeple === null)) {
        return getChangeCurrentPhaseMove(Phase.ResolveMeeples)  // no more meeples to place, time to resolve
      }
      break

    case Phase.ResolveMeeples:
      if ((state.showdowns[0].meeple === undefined || state.showdowns[1].meeple === undefined) && state.doorways.every(doorway => doorway === null)) {
        return getChangeCurrentPhaseMove(Phase.CheckGoldBars) // no meeple to resolve : advance to next phase
      }
      break

    case Phase.CheckGoldBars:
      if (state.activePlayer !== undefined) {
        if (canTradeGoldBar(state, state.activePlayer))
          return { type: MoveType.ConvertGoldBar }
        if (getNextPlayer(state, state.activePlayer) === state.startingPlayer && endOfGameTriggered(state))
          return getChangeCurrentPhaseMove(Phase.GameOver)  // game is over : all players have played the same number of turns
      }
      return getChangeCurrentPhaseMove(Phase.SelectSourceLocation)

    case Phase.GameOver:
      break

    default:
      return state.currentPhase
  }
  return
}


export function playMove(state: GameState, move: MoveRandomized): void {
  switch (move.type) {
    case MoveType.PlaceInitialMarqueeTile:
      return placeInitialMarqueeTile(state, move)

    case MoveType.SelectSourceLocation:
      return selectSourceLocation(state, move)

    case MoveType.PlaceMeeple:
      return placeMeeple(state, move)

    case MoveType.ChooseAnotherPlayerShowdownToken:
      state.pendingEffects.shift()
      return chooseAnotherPlayerToPlaceShowdownToken(state, move)

    case MoveType.ResolveMeeple:
      return resolveMeeple(state, move)

    case MoveType.BuildOrUpgradeMarquee:
      state.pendingEffects.shift()
      return buildOrUpgradeMarquee(state, move)

    case MoveType.DrawFromBag:
      state.pendingEffects.shift()
      return drawFromBag(state, move)

    case MoveType.SendExtraMeeplesToSaloon:
      return sendExtraMeeplesToSaloon(state)

    case MoveType.DynamiteExplosion:
      state.pendingEffects.shift()
      return dynamiteExplosion(state)

    case MoveType.MoveMeeples:
      state.pendingEffects.shift()
      return moveMeeples(state, move)

    case MoveType.ChangeCurrentPhase:
      return changeCurrentPhase(state, move)

    case MoveType.RollShowdownDice:
      state.pendingEffects.shift()
      return rollShowdownDice(state, move)

    case MoveType.RerollShowdownDice:
      state.pendingEffects.shift()
      return rerollShowdownDice(state, move)

    case MoveType.ResolveShowdown:
      state.pendingEffects.shift()
      return resolveShowdown(state)

    case MoveType.ConvertGoldBar:
      return convertGoldBar(state, move)

    default:
      return move // never guard
  }
}