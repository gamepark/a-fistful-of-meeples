/**
 * Enumeration of all the types of Move in you game.
 * Even though it is not strictly required to use a type like that, it helps a lot in practice!
 */
enum MoveType {
  PlaceInitialMarqueeTile,
  SelectSourceLocation,
  PlaceMeeple,
  ChooseAnotherPlayerShowdownToken,
  ResolveMeeple,
  BuildMarquee,
  UpgradeMarquee,
  RerollShodownDice
}


export default MoveType