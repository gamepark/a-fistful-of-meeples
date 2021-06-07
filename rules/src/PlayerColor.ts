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

