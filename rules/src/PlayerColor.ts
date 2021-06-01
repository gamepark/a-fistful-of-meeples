enum PlayerColor {
	None = 0,
	Orange,
	Green,
	Grey,
	Black
}

export default PlayerColor

export const playerColors = Object.values(PlayerColor).filter(isPlayerColor)

function isPlayerColor(arg: string | PlayerColor): arg is PlayerColor {
	return typeof arg === 'number' && arg != PlayerColor.None;
}

export function getNextPlayer(playerColor: PlayerColor): PlayerColor {
	if (playerColor === PlayerColor.Black) {
		return PlayerColor.Orange;
	}
	return playerColor + 1;
}
