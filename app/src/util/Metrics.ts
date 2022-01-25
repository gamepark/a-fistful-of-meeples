//import {css, Theme} from '@emotion/react'

export function translate(position: number[], deltaX: number, deltaY: number) {
  return [position[0] + deltaX, position[1] + deltaY]
}

export const letterBoxWidth = 185
export const letterBoxHeight = 100
export const letterBoxRatio = letterBoxWidth / letterBoxHeight

export const boardImageWidth = 1716
export const boardImageHeight = 1074
export const boardRatio = boardImageWidth / boardImageHeight
export const boardHeight = 93
export const boardWidth = boardHeight * boardRatio
export const boardLeft = 0
export const boardTop = 7

export const miningBagRatio = 784 / 764
export const miningBagAreaWidth = 25
export const miningBagWidth = 15
export const miningBagHeight = miningBagWidth / miningBagRatio
export const miningBagLeft = boardWidth + 1
export const miningBagTop = boardTop + 1

export const helpButtonWidth = 8
export const helpButtonHeight = 8
export const helpButtonRight = 1
export const helpButtonTop = miningBagTop + miningBagHeight - helpButtonHeight

export const playerInfoWidth = 34
export const playerInfoHeight = 18
export const playerInfoPositions = [
  [boardWidth + 1, miningBagTop + miningBagHeight + 1],
  [boardWidth + 1, miningBagTop + miningBagHeight + playerInfoHeight + 2],
  [boardWidth + 1, miningBagTop + miningBagHeight + playerInfoHeight * 2 + 3],
  [boardWidth + 1, miningBagTop + miningBagHeight + playerInfoHeight * 3 + 4],
]

export const dialogLeft = 29
export const dialogTop = 40
export const dialogWidth = 91.2
export const dialogHeight = 26.5

export const goldCubeRatio = 128 / 128
export const goldCubeWidth = 3
export const goldCubeHeight = goldCubeWidth / goldCubeRatio

export const stoneCubeRatio = 128 / 128
export const stoneCubeWidth = 3
export const stoneCubeHeight = stoneCubeWidth / stoneCubeRatio

export const goldBarRatio = 64 / 104
export const goldBarWidth = 4.5
export const goldBarHeight = goldBarWidth / goldBarRatio
export const goldBarLeft1 = 1545 / boardImageWidth * boardWidth
export const goldBarLeft2 = 1653 / boardImageWidth * boardWidth
export const goldBarTop1 = 686 / boardImageHeight * boardHeight
export const goldBarTop2 = 790 / boardImageHeight * boardHeight
export const goldBarTop3 = 895 / boardImageHeight * boardHeight

export const goldBarPositions = [
  [goldBarLeft2, goldBarTop3],
  [goldBarLeft1, goldBarTop3],
  [goldBarLeft2, goldBarTop2],
  [goldBarLeft1, goldBarTop2],
  [goldBarLeft2, goldBarTop1],
  [goldBarLeft1, goldBarTop1],
]

export const dynamiteRatio = 128 / 128
export const dynamiteWidth = 3.5
export const dynamiteHeight = dynamiteWidth / dynamiteRatio
export const dynamitePositions = [
  [18 / boardImageWidth * boardWidth, 88 / boardImageHeight * boardHeight],
  [78 / boardImageWidth * boardWidth, 88 / boardImageHeight * boardHeight],
  [138 / boardImageWidth * boardWidth, 88 / boardImageHeight * boardHeight]
]
export const removedDynamitePositions = [
  [820 / boardImageWidth * boardWidth, 565 / boardImageHeight * boardHeight],
  [800 / boardImageWidth * boardWidth, 480 / boardImageHeight * boardHeight],
  [897 / boardImageWidth * boardWidth, 500 / boardImageHeight * boardHeight],
]

export const marqueeRatio = 484 / 167
export const marqueeWidth = 18.5
export const marqueeHeight = marqueeWidth / marqueeRatio
const upMarqueesY = 48, bottomMarqueesY = 946

export const marqueesPosition = [
  [190 / boardImageWidth * boardWidth, upMarqueesY / boardImageHeight * boardHeight],
  [416 / boardImageWidth * boardWidth, upMarqueesY / boardImageHeight * boardHeight],
  [641 / boardImageWidth * boardWidth, upMarqueesY / boardImageHeight * boardHeight],
  [867 / boardImageWidth * boardWidth, upMarqueesY / boardImageHeight * boardHeight],
  [1093 / boardImageWidth * boardWidth, upMarqueesY / boardImageHeight * boardHeight],
  [1320 / boardImageWidth * boardWidth, upMarqueesY / boardImageHeight * boardHeight],
  [1320 / boardImageWidth * boardWidth, bottomMarqueesY / boardImageHeight * boardHeight],
  [1093 / boardImageWidth * boardWidth, bottomMarqueesY / boardImageHeight * boardHeight],
  [867 / boardImageWidth * boardWidth, bottomMarqueesY / boardImageHeight * boardHeight],
  [641 / boardImageWidth * boardWidth, bottomMarqueesY / boardImageHeight * boardHeight],
  [416 / boardImageWidth * boardWidth, bottomMarqueesY / boardImageHeight * boardHeight],
  [190 / boardImageWidth * boardWidth, bottomMarqueesY / boardImageHeight * boardHeight],
]

export const marqueeSelecterRatio = 445 / 171
export const marqueeSelecterWidth = 19.6
export const marqueeSelecterHeight = marqueeSelecterWidth / marqueeSelecterRatio
export function getMarqueeSelecterPosition(index: number) {
  const marqueePosition = marqueesPosition[index]
  return [marqueePosition[0] - 0.6, marqueePosition[1] - 0.6]
}

export const meepleRatio = 286 / 350
export const meepleWidth = 5
export const meepleHeight = meepleWidth / meepleRatio

export const buildingsPosition = [
  [201 / boardImageWidth * boardWidth, 185 / boardImageHeight * boardHeight],
  [427 / boardImageWidth * boardWidth, 185 / boardImageHeight * boardHeight],
  [652 / boardImageWidth * boardWidth, 185 / boardImageHeight * boardHeight],
  [878 / boardImageWidth * boardWidth, 185 / boardImageHeight * boardHeight],
  [1105 / boardImageWidth * boardWidth, 185 / boardImageHeight * boardHeight],
  [1332 / boardImageWidth * boardWidth, 185 / boardImageHeight * boardHeight],
  [1332 / boardImageWidth * boardWidth, 703 / boardImageHeight * boardHeight],
  [1105 / boardImageWidth * boardWidth, 703 / boardImageHeight * boardHeight],
  [878 / boardImageWidth * boardWidth, 703 / boardImageHeight * boardHeight],
  [652 / boardImageWidth * boardWidth, 703 / boardImageHeight * boardHeight],
  [427 / boardImageWidth * boardWidth, 703 / boardImageHeight * boardHeight],
  [201 / boardImageWidth * boardWidth, 703 / boardImageHeight * boardHeight],
]

export const buildingRatio = 251 / 245
export const buildingWidth = 18.5
export const buildingHeight = buildingWidth / buildingRatio
export const buildingSelecterDeltaX = -1
export const buildingSelecterDeltaY = -1.3

export const doorwaysPosition = [
  [270 / boardImageWidth * boardWidth, 380 / boardImageHeight * boardHeight],
  [494 / boardImageWidth * boardWidth, 380 / boardImageHeight * boardHeight],
  [719 / boardImageWidth * boardWidth, 380 / boardImageHeight * boardHeight],
  [945 / boardImageWidth * boardWidth, 380 / boardImageHeight * boardHeight],
  [1174 / boardImageWidth * boardWidth, 380 / boardImageHeight * boardHeight],
  [1400 / boardImageWidth * boardWidth, 380 / boardImageHeight * boardHeight],
  [1400 / boardImageWidth * boardWidth, 614 / boardImageHeight * boardHeight],
  [1174 / boardImageWidth * boardWidth, 614 / boardImageHeight * boardHeight],
  [945 / boardImageWidth * boardWidth, 614 / boardImageHeight * boardHeight],
  [719 / boardImageWidth * boardWidth, 614 / boardImageHeight * boardHeight],
  [494 / boardImageWidth * boardWidth, 614 / boardImageHeight * boardHeight],
  [270 / boardImageWidth * boardWidth, 614 / boardImageHeight * boardHeight],
]

export const doorwayRatio = 300 / 320
export const doorwayWidth = 6
export const doorwayHeight = doorwayWidth / doorwayRatio
export const doorwaySelecterDeltaX = -0.6
export const doorwaySelecterDeltaY = 0

export const saloonPosition = [1542 / boardImageWidth * boardWidth, 86 / boardImageHeight * boardHeight]
export const saloonSelecterPosition = [1540 / boardImageWidth * boardWidth, 80 / boardImageHeight * boardHeight]
export const saloonSelecterRatio = 169 / 301
export const saloonSelecterWidth = 14.5
export const saloonSelecterHeight = saloonSelecterWidth / saloonSelecterRatio

export const graveyardPositions = [
  [16 / boardImageWidth * boardWidth, 885 / boardImageHeight * boardHeight],
  [82 / boardImageWidth * boardWidth, 870 / boardImageHeight * boardHeight],
  [18 / boardImageWidth * boardWidth, 790 / boardImageHeight * boardHeight],
  [82 / boardImageWidth * boardWidth, 771 / boardImageHeight * boardHeight],
  [18 / boardImageWidth * boardWidth, 681 / boardImageHeight * boardHeight],
  [82 / boardImageWidth * boardWidth, 667 / boardImageHeight * boardHeight],
]

export const jailPosition = [16 / boardImageWidth * boardWidth, 230 / boardImageHeight * boardHeight]
export const jailSelecterPosition = [8 / boardImageWidth * boardWidth, 82 / boardImageHeight * boardHeight]
export const jailSelecterRatio = 177 / 287
export const jailSelecterWidth = 15
export const jailSelecterHeight = jailSelecterWidth / jailSelecterRatio

export const showdownTokenRatio = 236 / 236
export const showdownTokenWidth = 10
export const showdownTokenHeight = showdownTokenWidth / showdownTokenRatio
export const showdownTokenPositions = [
  [202 / boardImageWidth * boardWidth, 475 / boardImageHeight * boardHeight],
  [1406 / boardImageWidth * boardWidth, 475 / boardImageHeight * boardHeight],
]

export const showdownMeeplePositions = [
  [230 / boardImageWidth * boardWidth, 480 / boardImageHeight * boardHeight],
  [1435 / boardImageWidth * boardWidth, 480 / boardImageHeight * boardHeight],
]

export const showdownSelecterPositions = [
  [188 / boardImageWidth * boardWidth, 385 / boardImageHeight * boardHeight],
  [1394 / boardImageWidth * boardWidth, 385 / boardImageHeight * boardHeight],
]
export const showdownSelecterRatio = 142 / 302
export const showdownSelecterWidth = 12.2
export const showdownSelecterHeight = showdownSelecterWidth / showdownSelecterRatio

export const diceRatio = 64 / 64
export const diceWidth = 4
export const diceHeight = diceWidth / diceRatio

export const dicePositions = [
  [275 / boardImageWidth * boardWidth, 560 / boardImageHeight * boardHeight],
  [1400 / boardImageWidth * boardWidth, 560 / boardImageHeight * boardHeight],
]

export const meeplesInHandPosition = [32, 44]
