import PlaceMeeple from './PlaceMeeple'
import ResolveMeeple from './ResolveMeeple'
import PlaceInitialMarqueeTile from './PlaceInitialMarqueeTile'
import SelectSourceLocation from './SelectSourceLocation'

/**
 * A "Move" is the combination of all the types of moves that exists in you game
 */
type Move = PlaceInitialMarqueeTile | SelectSourceLocation | PlaceMeeple | ResolveMeeple

export default Move