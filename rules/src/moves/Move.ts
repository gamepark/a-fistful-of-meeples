import PlaceInitialMarqueeTile from './PlaceInitialMarqueeTile'
import SelectSourceLocation from './SelectSourceLocation'
import PlaceMeeple from './PlaceMeeple'
import ChooseAnotherPlayerShowdownToken from './ChooseAnotherPlayerShowdownToken'
import ResolveMeeple from './ResolveMeeple'

/**
 * A "Move" is the combination of all the types of moves that exists in you game
 */
type Move = PlaceInitialMarqueeTile | SelectSourceLocation | PlaceMeeple | ChooseAnotherPlayerShowdownToken | ResolveMeeple

export default Move