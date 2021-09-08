import { SequentialGame } from '@gamepark/rules-api'
import GameState, { initialiseGameState, Location_Saloon, Location_Jail, PendingEffectType, Location_Showdown0, Location_Showdown1 } from './GameState'
import Move from './moves/Move'
import MoveType from './moves/MoveType'
import PlayerColor from './PlayerColor'
import Phase from './Phase'
import MeepleType from './MeepleType'
import { isGameOptions, AFistfulOfMeeplesOptions } from './AFistfulOfMeeplesOptions'
import { placeInitialMarqueeTile } from './moves/PlaceInitialMarqueeTile'
import { selectSourceLocation } from './moves/SelectSourceLocation'
import { getPlaceMeepleMove, isValidSpaceToPlaceMeeple, placeMeeple } from './moves/PlaceMeeple'
import { chooseAnotherPlayerToPlaceShowdownToken } from './moves/ChooseAnotherPlayerShowdownToken'
import { resolveMeeple } from './moves/ResolveMeeple'
import { buildOrUpgradeMarquee } from './moves/BuildOrUpgradeMarquee'
import { drawFromBag } from './moves/DrawFromBag'
import { sendExtraMeeplesToSaloon } from './moves/SendExtraMeeplesToSaloon'
import { dynamiteExplosion } from './moves/DynamiteExplosion'
import { moveMeeples } from './moves/MoveMeeples'
import { resolveShowdown } from './moves/ResolveShowdown'
import { rerollShowdownDice } from './moves/RerollShowdownDice'
import { checkGoldBars } from './moves/CheckGoldBars'

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
    return this.state.activePlayer == PlayerColor.None
  }

  /**
   * Retrieves the player which must act. It is used to secure the game and prevent players from acting outside their turns.
   * Only required in a SequentialGame.
   * @return The identifier of the player whose turn it is
   */
  getActivePlayer(): PlayerColor | undefined {
    if (this.state.pendingEffects.length > 0) {
      let effect = this.state.pendingEffects[0]
      if (effect.type == PendingEffectType.BuildOrUpgradeMarquee && this.state.marquees[effect.location].owner != PlayerColor.None) {
        return this.state.marquees[effect.location].owner
      }
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
              moves.push({ type: MoveType.ChooseAnotherPlayerShowdownToken, playerId: player.color })
          })
          break

        case PendingEffectType.BuildOrUpgradeMarquee:
          moves.push({ type: MoveType.BuildOrUpgradeMarquee, playerId: this.getActivePlayer()!, space: effect.location, build: true })
          moves.push({ type: MoveType.BuildOrUpgradeMarquee, playerId: this.getActivePlayer()!, space: effect.location, build: false })
          break

        case PendingEffectType.ChooseToRerollShowdownDice:
          moves.push({ type: MoveType.RerollShowdownDice, reroll: true })
          moves.push({ type: MoveType.RerollShowdownDice, reroll: false })
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
          // get meeple types in hand (only once for each meeple type)
          const meeples: MeepleType[] = []
          this.state.meeplesInHand.forEach(meeple => {
            if (!meeples.includes(meeple))
              meeples.push(meeple)
          })

          if (isValidSpaceToPlaceMeeple(Location_Showdown0, this.state))
            meeples.forEach(meeple => moves.push(getPlaceMeepleMove(this.state.activePlayer, Location_Showdown0, meeple)))
          if (isValidSpaceToPlaceMeeple(Location_Showdown1, this.state))
            meeples.forEach(meeple => moves.push(getPlaceMeepleMove(this.state.activePlayer, Location_Showdown1, meeple)))
          for (i = 0; i < 12; ++i) {
            if (isValidSpaceToPlaceMeeple(i, this.state))
              meeples.forEach(meeple => moves.push(getPlaceMeepleMove(this.state.activePlayer, i, meeple)))
          }

          if (moves.length > 0) {
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
    switch (move.type) {
      case MoveType.PlaceInitialMarqueeTile:
        return placeInitialMarqueeTile(this.state, move)

      case MoveType.SelectSourceLocation:
        return selectSourceLocation(this.state, move)

      case MoveType.PlaceMeeple:
        return placeMeeple(this.state, move)

      case MoveType.ChooseAnotherPlayerShowdownToken:
        this.state.pendingEffects.shift()
        return chooseAnotherPlayerToPlaceShowdownToken(this.state, move)

      case MoveType.ResolveMeeple:
        return resolveMeeple(this.state, move)

      case MoveType.BuildOrUpgradeMarquee:
        this.state.pendingEffects.shift()
        return buildOrUpgradeMarquee(this.state, move)

      case MoveType.DrawFromBag:
        this.state.pendingEffects.shift()
        return drawFromBag(this.state, move)

      case MoveType.SendExtraMeeplesToSaloon:
        return sendExtraMeeplesToSaloon(this.state)

      case MoveType.DynamiteExplosion:
        this.state.pendingEffects.shift()
        return dynamiteExplosion(this.state)

      case MoveType.MoveMeeples:
        this.state.pendingEffects.shift()
        return moveMeeples(this.state, move)

      case MoveType.RerollShowdownDice:
        this.state.pendingEffects.shift()
        return rerollShowdownDice(this.state, move)

      case MoveType.ResolveShowdown:
        this.state.pendingEffects.shift()
        return resolveShowdown(this.state)

      case MoveType.CheckGoldBars:
        return checkGoldBars(this.state, move)

      default:
        return move // never guard
    }
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
    if (this.state.pendingEffects.length > 0) {
      const effect = this.state.pendingEffects[0]
      switch (effect.type) {
        case PendingEffectType.DrawFromBag:
          return { type: MoveType.DrawFromBag, playerId: effect.player, content: effect.content }
        case PendingEffectType.DynamiteExplosion:
          return { type: MoveType.DynamiteExplosion }
        case PendingEffectType.MoveMeeples:
          return { type: MoveType.MoveMeeples, meeples: effect.meeples, source: effect.sourceLocation, destination: effect.destinationLocation }
        case PendingEffectType.ResolveShowdown:
          return { type: MoveType.ResolveShowdown }
      }
    } else if (this.state.currentPhase == Phase.CheckGoldBars) {
      return { type: MoveType.CheckGoldBars }
    }
  }

}
