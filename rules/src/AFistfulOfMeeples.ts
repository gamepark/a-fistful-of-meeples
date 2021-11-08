import { SequentialGame } from '@gamepark/rules-api'
import GameState, { initialiseGameState, Location_Saloon, Location_Jail, PendingEffectType, Location_Showdown0, Location_Showdown1, Location_None, getNextPlayer, endOfGameTriggered } from './GameState'
import Move from './moves/Move'
import MoveType from './moves/MoveType'
import PlayerColor from './PlayerColor'
import Phase from './Phase'
import MeepleType from './MeepleType'
import { isGameOptions, AFistfulOfMeeplesOptions } from './AFistfulOfMeeplesOptions'
import { placeInitialMarqueeTile } from './moves/PlaceInitialMarqueeTile'
import { selectSourceLocation } from './moves/SelectSourceLocation'
import { getPlaceMeepleMove, isValidSpaceToPlaceMeeple, placeMeeple } from './moves/PlaceMeeple'
import { chooseAnotherPlayerToPlaceShowdownToken, getChooseAnotherPlayerShowdownTokenMove } from './moves/ChooseAnotherPlayerShowdownToken'
import { resolveMeeple } from './moves/ResolveMeeple'
import { buildOrUpgradeMarquee, getBuildOrUpgradeMarqueeMove } from './moves/BuildOrUpgradeMarquee'
import { drawFromBag } from './moves/DrawFromBag'
import { sendExtraMeeplesToSaloon } from './moves/SendExtraMeeplesToSaloon'
import { dynamiteExplosion } from './moves/DynamiteExplosion'
import { moveMeeples } from './moves/MoveMeeples'
import { resolveShowdown } from './moves/ResolveShowdown'
import { getRerollShowdownDiceMove, rerollShowdownDice } from './moves/RerollShowdownDice'
import { canTradeGoldBar } from './moves/ConvertGoldBar'
import { drawCubesFromBag } from './MiningBag'
import { rollShowdownDice } from './moves/RollShowdownDice'
import { changeCurrentPhase, getChangeCurrentPhaseMove } from './moves/ChangeCurrentPhase'
import { convertGoldBar } from './moves/ConvertGoldBar'

/**
 * Your Board Game rules must extend either "SequentialGame" or "SimultaneousGame".
 * When there is at least on situation during the game where multiple players can act at the same time, it is a "SimultaneousGame"
 * If the game contains information that players does not know (dices, hidden cards...), it must implement "IncompleteInformation".
 * If the game contains information that some players know, but the other players does not, it must implement "SecretInformation" instead.
 * Later on, you can also implement "Competitive", "Undo", "TimeLimit" and "Eliminations" to add further features to the game.
 */
export default class AFistfulOfMeeples extends SequentialGame<GameState, Move, PlayerColor> {
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
    return this.state.activePlayer === PlayerColor.None
  }

  /**
   * Retrieves the player which must act. It is used to secure the game and prevent players from acting outside their turns.
   * Only required in a SequentialGame.
   * @return The identifier of the player whose turn it is
   */
  getActivePlayer(): PlayerColor | undefined {
    if (this.state.pendingEffects.length > 0) {
      let effect = this.state.pendingEffects[0]
      if (effect.type === PendingEffectType.BuildOrUpgradeMarquee && this.state.marquees[effect.location].owner != PlayerColor.None) {
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
    } else {

      // no relevant pending effect : allowed moves depend on current phase
      switch (this.state.currentPhase) {

        case Phase.PlaceInitialMarqueeTiles:
          [0, 5, 6, 11].forEach(i => {
            if (this.state.marquees[i].owner === PlayerColor.None) {
              moves.push({ type: MoveType.PlaceInitialMarqueeTile, playerId: this.state.activePlayer, location: i })
            }
          })
          break

        case Phase.SelectSourceLocation:
          for (i = 0; i < 12; ++i) {
            if (this.state.buildings[i].length > 0) {
              moves.push({ type: MoveType.SelectSourceLocation, playerId: this.state.activePlayer, location: i })
            }
          }
          if (this.state.saloon.length > 0) {
            moves.push({ type: MoveType.SelectSourceLocation, playerId: this.state.activePlayer, location: Location_Saloon })
          }
          if (this.state.jail.length > 0) {
            moves.push({ type: MoveType.SelectSourceLocation, playerId: this.state.activePlayer, location: Location_Jail })
          }
          break

        case Phase.PlaceMeeples:
          if (isValidSpaceToPlaceMeeple(Location_Showdown0, this.state))
            this.state.meeplesInHand.forEach((_, index) => moves.push(getPlaceMeepleMove(this.state.activePlayer, Location_Showdown0, index)))
          if (isValidSpaceToPlaceMeeple(Location_Showdown1, this.state))
            this.state.meeplesInHand.forEach((_, index) => moves.push(getPlaceMeepleMove(this.state.activePlayer, Location_Showdown1, index)))
          for (i = 0; i < 12; ++i) {
            if (isValidSpaceToPlaceMeeple(i, this.state))
              this.state.meeplesInHand.forEach((_, index) => moves.push(getPlaceMeepleMove(this.state.activePlayer, i, index)))
          }

          if (moves.length === 0) {
            // no valid space : send remaining meeples to saloon
            moves.push({ type: MoveType.SendExtraMeeplesToSaloon })
          }
          break

        case Phase.ResolveMeeples:
          if (this.state.showdowns[0].meeple != MeepleType.None && this.state.showdowns[1].meeple != MeepleType.None) {
            moves.push({ type: MoveType.ResolveMeeple, playerId: this.state.activePlayer, space: Location_Showdown0 })
            moves.push({ type: MoveType.ResolveMeeple, playerId: this.state.activePlayer, space: Location_Showdown1 })
          }
          for (i = 0; i < 12; ++i) {
            if (this.state.doorways[i] != MeepleType.None) {
              moves.push({ type: MoveType.ResolveMeeple, playerId: this.state.activePlayer, space: i })
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

  /**
   * This is the one and only place where you will update the game's state, depending on the move that has been played.
   *
   * @param move The move that should be applied to current state.
   */
  play(move: Move): void {
    playMove(this.state, move)
  }

  /**
   * Here you can return the moves that should be automatically played when the game is in a specific state.
   * Here is an example from monopoly: you roll a dice, then move you pawn accordingly.
   * A first solution would be to do both state updates at once, in a "complex move" (RollDiceAndMovePawn).
   * However, this first solution won't allow you to animate step by step what happened: the roll, then the pawn movement.
   * "getAutomaticMove" is the solution to trigger multiple moves in a single action, and still allow for step by step animations.
   * => in that case, "RollDice" could set "pawnMovement = x" somewhere in the game state. Then getAutomaticMove will return "MovePawn" when
   * "pawnMovement" is defined in the state.
   * Of course, you must return nothing once all the consequences triggered by a decision are completed.
   * VERY IMPORTANT: you should never change the game state in here. Indeed, getAutomaticMove will never be called in replays, for example.
   *
   * @return The next automatic consequence that should be played in current game state.
   */
  getAutomaticMove(): void | Move {
    return getPredictableMove(this.state, true)
  }
}


export function getPredictableMove(state: GameState, serverSide: boolean): void | Move {
  if (state.pendingEffects.length > 0) {
    const effect = state.pendingEffects[0]
    switch (effect.type) {
      case PendingEffectType.DrawFromBag:
        if (serverSide)
          return { type: MoveType.DrawFromBag, playerId: effect.player, content: drawCubesFromBag(state, effect.amount) }
        return  // if we are on client side, don't draw cubes. It will be done on server side only
      case PendingEffectType.RollShowdownDice:
        if (serverSide)
          return { type: MoveType.RollShowdownDice, location: effect.location, value: Math.floor(Math.random() * 6) + 1 }
        return  // if we are on client side, don't roll dice. It will be done on server side only
      case PendingEffectType.DynamiteExplosion:
        return { type: MoveType.DynamiteExplosion }
      case PendingEffectType.MoveMeeples:
        return { type: MoveType.MoveMeeples, meeples: effect.meeples, source: effect.sourceLocation, destination: effect.destinationLocation }
      case PendingEffectType.ResolveShowdown:
        return { type: MoveType.ResolveShowdown }
    }
  } else switch (state.currentPhase) {
    case Phase.PlaceInitialMarqueeTiles:
      if (state.marquees.filter(marquee => marquee.owner !== PlayerColor.None).length === state.players.length)
        return getChangeCurrentPhaseMove(Phase.SelectSourceLocation)  // all players have placed their initial marquee, begin first turn of the game
      break

    case Phase.SelectSourceLocation:
      if (state.previousMeepleLocation !== Location_None)
        return getChangeCurrentPhaseMove(Phase.PlaceMeeples)  // source location has been chosen, time to place meeples
      break

    case Phase.PlaceMeeples:
      if (state.meeplesInHand.every(meeple => meeple === MeepleType.None)) {
        return getChangeCurrentPhaseMove(Phase.ResolveMeeples)  // no more meeples to place, time to resolve
      }
      break

    case Phase.ResolveMeeples:
      if ((state.showdowns[0].meeple === MeepleType.None || state.showdowns[1].meeple === MeepleType.None) && state.doorways.every(doorway => doorway === MeepleType.None)) {
        return getChangeCurrentPhaseMove(Phase.CheckGoldBars) // no meeple to resolve : advance to next phase
      }
      break

    case Phase.CheckGoldBars:
      if (canTradeGoldBar(state, state.activePlayer))
        return { type: MoveType.ConvertGoldBar }
      if (getNextPlayer(state, state.activePlayer) === state.startingPlayer && endOfGameTriggered(state))
        return getChangeCurrentPhaseMove(Phase.GameOver)  // game is over : all players have played the same number of turns
      return getChangeCurrentPhaseMove(Phase.SelectSourceLocation)

    case Phase.GameOver:
      break

    default:
      return state.currentPhase
  }
}


export function playMove(state: GameState, move: Move): void {
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