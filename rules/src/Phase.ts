
enum Phase {
	PlaceInitialMarqueeTiles,	// game setup
	SelectSourceLocation,	// player must choose where to take meeples from
	PlaceMeeples,	// player must place meeples he has in hand
	ResolveMeeples,	// player must resole all meeples he placed
	CheckGoldBars,	// player must check if he has to trade his gold cubes for a gold bar
	GameOver,	// game is over
}

export default Phase

