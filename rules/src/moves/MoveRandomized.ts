import DrawFromBag, {DrawFromBagRandomized} from './DrawFromBag'
import Move from './Move'
import RollShowdownDice, {RollShowdownDiceRandomized} from './RollShowdownDice'

type MoveRandomized = Exclude<Move, RollShowdownDice | DrawFromBag> | RollShowdownDiceRandomized | DrawFromBagRandomized

export default MoveRandomized
