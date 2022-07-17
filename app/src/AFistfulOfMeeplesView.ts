import MoveRandomized from '@gamepark/a-fistful-of-meeples/moves/MoveRandomized'
import MoveType from '@gamepark/a-fistful-of-meeples/moves/MoveType'
import {Action, Game, Undo} from '@gamepark/rules-api'
import {getCanUndo, getAutomaticMove, playMove} from '../../rules/src/AFistfulOfMeeples'
import GameState from '../../rules/src/GameState'
import Move from '../../rules/src/moves/Move'
import PlayerColor from '../../rules/src/PlayerColor'

/**
 * Your Board Game rules must extend either "SequentialGame" or "SimultaneousGame".
 * When there is at least on situation during the game where multiple players can act at the same time, it is a "SimultaneousGame"
 * If the game contains information that players does not know (dices, hidden cards...), it must implement "IncompleteInformation".
 * If the game contains information that some players know, but the other players does not, it must implement "SecretInformation" instead.
 * Later on, you can also implement "Competitive", "Undo", "TimeLimit" and "Eliminations" to add further features to the game.
 */
export default class AFistfulOfMeeplesView implements Game<GameState, MoveRandomized>, Undo<GameState, MoveRandomized, PlayerColor> {
  state: GameState
  /**
   * This constructor is called when the game "restarts" from a previously saved state.
   * @param state The state of the game
   */
  constructor(state: GameState) {
    this.state = state
  }

  /**
   * This is the one and only place where you will update the game's state, depending on the move that has been played.
   *
   * @param move The move that should be applied to current state.
   */
  play(move: MoveRandomized): void {
    playMove(this.state, move)
  }

  canUndo(action: Action<Move, PlayerColor>, consecutiveActions: Action<Move, PlayerColor>[]): boolean {
    return getCanUndo(action, consecutiveActions)
  }

  getAutomaticMoves(): MoveRandomized[] {
    const move = getAutomaticMove(this.state)
    if (!move) return []
    if (move.type === MoveType.RollShowdownDice || move.type === MoveType.DrawFromBag) return [] // unpredictable output
    return [move]
  }
}
