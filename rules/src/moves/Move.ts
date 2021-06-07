import PlaceInitialMarqueeTile from './PlaceInitialMarqueeTile'
import SelectSourceLocation from './SelectSourceLocation'
import PlaceMeeple from './PlaceMeeple'
import ChooseAnotherPlayerShowdownToken from './ChooseAnotherPlayerShowdownToken'
import ResolveMeeple from './ResolveMeeple'
import BuildOrUpgradeMarquee from './BuildOrUpgradeMarquee'
import DrawFromBag from './DrawFromBag'
import SendExtraMeeplesToSaloon from './SendExtraMeeplesToSaloon'
import MoveMeeples from './MoveMeeples'
import DynamiteExplosion from './DynamiteExplosion'
import ResolveShowdown from './ResolveShowdown'
import RerollShowdownDice from './RerollShowdownDice'
import CheckGoldBars from './CheckGoldBars'

/**
 * A "Move" is the combination of all the types of moves that exists in you game
 */
type Move = PlaceInitialMarqueeTile | SelectSourceLocation | PlaceMeeple | ChooseAnotherPlayerShowdownToken | ResolveMeeple | BuildOrUpgradeMarquee
  | DrawFromBag | SendExtraMeeplesToSaloon | MoveMeeples | DynamiteExplosion | RerollShowdownDice | ResolveShowdown | CheckGoldBars

export default Move