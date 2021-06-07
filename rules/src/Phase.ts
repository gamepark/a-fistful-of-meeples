import GameState, { Location_None, Direction } from "./GameState";

enum Phase {
	PlaceInitialMarqueeTiles,	// game setup
	SelectSourceLocation,	// player must choose where to take meeples from
	PlaceMeeples,	// player must place meeples he has in hand
	ResolveMeeples,	// player must resole all meeples he placed
	CheckGoldBars,	// player must check if he has to trade his gold cubes for a gold bar
}

export default Phase

export function setCurrentPhase(phase: Phase, state: GameState) : void {
	switch (phase) {
		case Phase.PlaceInitialMarqueeTiles:
			break
		case Phase.SelectSourceLocation:
			break
		case Phase.PlaceMeeples:
			break
		case Phase.ResolveMeeples:
			state.meeplesSourceLocation = Location_None
			state.meeplePlacingDirection = Direction.None
			state.previousMeeplePlacingSpace = Location_None
			break
		case Phase.CheckGoldBars:
			break
		default:
			return phase	// never guard
	}
	state.currentPhase = phase
}
