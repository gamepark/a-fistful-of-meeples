import { SequentialGame } from '@gamepark/rules-api'
import GameState, { initialiseGameState, Location_Saloon, Location_Jail, Space_None, Space_Showdown1, Space_Showdown2, Direction, getNextSpace, getPreviousSpace } from './GameState'
import Move from './moves/Move'
import MoveType from './moves/MoveType'
import { placeInitialMarqueeTile } from './moves/PlaceInitialMarqueeTile'
import { selectSourceLocation } from './moves/SelectSourceLocation'
import { placeMeeple } from './moves/PlaceMeeple'
import { resolveMeeple } from './moves/ResolveMeeple'
import {isGameOptions, AFistfulOfMeeplesOptions} from './AFistfulOfMeeplesOptions'
import PlayerColor from './PlayerColor'
import Phase from './Phase'
import Meeple from './Meeple'
import { chooseAnotherPlayerToPlaceShowdownToken } from './moves/ChooseAnotherPlayerShowdownToken'

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
    return this.state.activePlayer == PlayerColor.None;
  }

  /**
   * Retrieves the player which must act. It is used to secure the game and prevent players from acting outside their turns.
   * Only required in a SequentialGame.
   * @return The identifier of the player whose turn it is
   */
  getActivePlayer(): PlayerColor | undefined {
    return this.state.activePlayer; // You must return undefined only when game is over, otherwise the game will be blocked.
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
    let i: number;

    switch (this.state.currentPhase) {
      case Phase.PlaceInitialMarqueeTiles:
        [1, 6, 7, 12].forEach(i => {
          if (this.state.marquees[i].owner === PlayerColor.None) {
            moves.push({ type: MoveType.PlaceInitialMarqueeTile, playerId: this.state.activePlayer, location: i })
          }
        })
        break;
      case Phase.SelectSourceLocation:
        for (i = 1; i <= 12; ++i) {
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
        break;
      case Phase.PlaceMeeples:
        if (this.state.previousMeeplePlacingSpace == Space_None) {
          // first meeple to be placed : must be placed next to building they were taken from (or any space if taken from jail or saloon)
          switch (this.state.meeplesSourceLocation) {
            case Location_Saloon:
            case Location_Jail:
              for (i = 1; i <= 12; ++i) {
                this.state.meeplesInHand.forEach(meeple => moves.push({ type: MoveType.PlaceMeeple, playerId: this.state.activePlayer, space: i, meeple: meeple }))
              }
              if (this.state.showdowns[0].meeple == Meeple.None) {
                this.state.meeplesInHand.forEach(meeple => moves.push({ type: MoveType.PlaceMeeple, playerId: this.state.activePlayer, space: Space_Showdown1, meeple: meeple }))
              }
              if (this.state.showdowns[1].meeple == Meeple.None) {
                this.state.meeplesInHand.forEach(meeple => moves.push({ type: MoveType.PlaceMeeple, playerId: this.state.activePlayer, space: Space_Showdown2, meeple: meeple }))
              }
              break;
            default:
              this.state.meeplesInHand.forEach(meeple => moves.push({ type: MoveType.PlaceMeeple, playerId: this.state.activePlayer, space: this.state.meeplesSourceLocation, meeple: meeple }))
              if ((this.state.meeplesSourceLocation == 1 || this.state.meeplesSourceLocation == 12) && this.state.showdowns[0].meeple == Meeple.None) {
                this.state.meeplesInHand.forEach(meeple => moves.push({ type: MoveType.PlaceMeeple, playerId: this.state.activePlayer, space: Space_Showdown1, meeple: meeple }))
              }
              if ((this.state.meeplesSourceLocation == 6 || this.state.meeplesSourceLocation == 7) && this.state.showdowns[1].meeple == Meeple.None) {
                this.state.meeplesInHand.forEach(meeple => moves.push({ type: MoveType.PlaceMeeple, playerId: this.state.activePlayer, space: Space_Showdown2, meeple: meeple }))
              }
              break;
          }
        } else {
          this.state.meeplesInHand.forEach(meeple => {
            if (this.state.meeplePlacingDirection != Direction.Clockwise) {
              moves.push({ type: MoveType.PlaceMeeple, playerId: this.state.activePlayer, space: getPreviousSpace(this.state.previousMeeplePlacingSpace, this.state), meeple: meeple })
            }
            if (this.state.meeplePlacingDirection != Direction.CounterClockwise) {
              moves.push({ type: MoveType.PlaceMeeple, playerId: this.state.activePlayer, space: getNextSpace(this.state.previousMeeplePlacingSpace, this.state), meeple: meeple })
            }
          })
        }
        break;
      case Phase.ChooseAnotherPlayerShowdownToken:
        this.state.players.forEach(player => {
          if (player.color !== this.state.activePlayer)
            moves.push({ type: MoveType.ChooseAnotherPlayerShowdownToken, playerId: player.color })
        })
        break;
      case Phase.ResolveMeeples:
        break;
      case Phase.BuildMarquee:
        break;
      case Phase.UpgradeMarquee:
        break;
      case Phase.ChooseToRerollShowdownDice:
        break;
      default: {
        const n: never = this.state.currentPhase;
        return n;
      }
    }

    return moves;
  }

  /**
   * This is the one and only play where you will update the game's state, depending on the move that has been played.
   *
   * @param move The move that should be applied to current state.
   */
  play(move: Move): void {
    switch (move.type) {
      case MoveType.PlaceInitialMarqueeTile:
        return placeInitialMarqueeTile(this.state, move);
      case MoveType.SelectSourceLocation:
        return selectSourceLocation(this.state, move);
      case MoveType.PlaceMeeple:
        return placeMeeple(this.state, move);
      case MoveType.ChooseAnotherPlayerShowdownToken:
        return chooseAnotherPlayerToPlaceShowdownToken(this.state, move);
      case MoveType.ResolveMeeple:
        return resolveMeeple(this.state, move);
      /*
      case MoveType.BuildMarquee:
        break;
      case MoveType.UpgradeMarquee:
        break;
      case MoveType.ChooseAnotherPlayerToPlaceShowdownToken:
        break;
      case MoveType.RerollShodownDice:
        break;
        */
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
    /**
     * Example:
     * for (const player of this.state.players) {
     *   if (player.mustDraw) {
     *     return {type: MoveType.DrawCard, playerId: player.color}
     *   }
     * }
     */
    return
  }

  endOfGameTriggered(): boolean {
    return this.state.goldBarsInBank == 0 || this.state.graveyard.length >= 6 || (this.state.dynamitesInJail == 0 && this.state.dynamitesInMiningBag == 0);
  }

}