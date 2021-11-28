enum PlayerColor {
	Orange = 0,
	Green,
	Grey,
	Black
}

export default PlayerColor

export const playerColors = Object.values(PlayerColor).filter(isPlayerColor)

function isPlayerColor(arg: string | PlayerColor): arg is PlayerColor {
	return typeof arg === 'number'
}

