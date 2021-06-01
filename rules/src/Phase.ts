enum Phase {
	PlaceInitialMarqueeTiles,	// game setup
	SelectSourceLocation,	// player must choose where to take meeples from
	PlaceMeeples,	// player must place meeples he has in hand
	ChooseAnotherPlayerShowdownToken,	// player must choose another player to place his showdown token
	ResolveMeeples,	// player must resole all meeples he placed
	BuildMarquee, // player may build a marquee
	UpgradeMarquee, // player may upgrade a marquee
	ChooseToRerollShowdownDice,	// player may reroll his dice during showdown
}

export default Phase