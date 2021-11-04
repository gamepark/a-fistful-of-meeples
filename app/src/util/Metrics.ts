//import {css, Theme} from '@emotion/react'

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
export const miningBagWidth = 15
export const miningBagHeight = miningBagWidth / miningBagRatio
export const miningBagLeft = boardWidth + 1
export const miningBagTop = boardTop + 1

export const playerInfoRatio = 64 / 32
export const playerInfoWidth = 32
export const playerInfoHeight = playerInfoWidth / playerInfoRatio
export const playerInfoPositions = [
  [boardWidth + 1, miningBagTop + miningBagHeight + 2],
  [boardWidth + 1, miningBagTop + miningBagHeight + playerInfoHeight + 4],
  [boardWidth + 1, miningBagTop + miningBagHeight + playerInfoHeight * 2 + 6],
  [boardWidth + 1, miningBagTop + miningBagHeight + playerInfoHeight * 3 + 8],
]

export const phaseWidth = 15
export const phaseHeight = 15
export const phasePosition = [0.6, 33]

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

export const marqueeRatio = 484 / 167
export const marqueeWidth = 20
export const marqueeHeight = marqueeWidth / marqueeRatio

export const marqueesPosition = [
  [180 / boardImageWidth * boardWidth, 43 / boardImageHeight * boardHeight],
  [406 / boardImageWidth * boardWidth, 43 / boardImageHeight * boardHeight],
  [632 / boardImageWidth * boardWidth, 43 / boardImageHeight * boardHeight],
  [858 / boardImageWidth * boardWidth, 43 / boardImageHeight * boardHeight],
  [1084 / boardImageWidth * boardWidth, 43 / boardImageHeight * boardHeight],
  [1310 / boardImageWidth * boardWidth, 43 / boardImageHeight * boardHeight],
  [1310 / boardImageWidth * boardWidth, 943 / boardImageHeight * boardHeight],
  [1084 / boardImageWidth * boardWidth, 943 / boardImageHeight * boardHeight],
  [858 / boardImageWidth * boardWidth, 943 / boardImageHeight * boardHeight],
  [632 / boardImageWidth * boardWidth, 943 / boardImageHeight * boardHeight],
  [406 / boardImageWidth * boardWidth, 943 / boardImageHeight * boardHeight],
  [180 / boardImageWidth * boardWidth, 943 / boardImageHeight * boardHeight],
]

export const meepleRatio = 286 / 350
export const meepleWidth = 3.5
export const meepleHeight = meepleWidth / meepleRatio

export const buildingsPosition = [
  [203 / boardImageWidth * boardWidth, 190 / boardImageHeight * boardHeight],
  [430 / boardImageWidth * boardWidth, 190 / boardImageHeight * boardHeight],
  [650 / boardImageWidth * boardWidth, 190 / boardImageHeight * boardHeight],
  [877 / boardImageWidth * boardWidth, 190 / boardImageHeight * boardHeight],
  [1105 / boardImageWidth * boardWidth, 190 / boardImageHeight * boardHeight],
  [1332 / boardImageWidth * boardWidth, 190 / boardImageHeight * boardHeight],
  [1332 / boardImageWidth * boardWidth, 710 / boardImageHeight * boardHeight],
  [1105 / boardImageWidth * boardWidth, 710 / boardImageHeight * boardHeight],
  [877 / boardImageWidth * boardWidth, 710 / boardImageHeight * boardHeight],
  [652 / boardImageWidth * boardWidth, 710 / boardImageHeight * boardHeight],
  [430 / boardImageWidth * boardWidth, 710 / boardImageHeight * boardHeight],
  [203 / boardImageWidth * boardWidth, 710 / boardImageHeight * boardHeight],
]

export const buildingRatio = 251 / 245
export const buildingWidth = 18.5
export const buildingHeight = buildingWidth / buildingRatio
export const buildingSelecterDeltaX = -1
export const buildingSelecterDeltaY = -1.8

export const doorwaysPosition = [
  [272 / boardImageWidth * boardWidth, 395 / boardImageHeight * boardHeight],
  [498 / boardImageWidth * boardWidth, 395 / boardImageHeight * boardHeight],
  [724 / boardImageWidth * boardWidth, 395 / boardImageHeight * boardHeight],
  [950 / boardImageWidth * boardWidth, 395 / boardImageHeight * boardHeight],
  [1180 / boardImageWidth * boardWidth, 395 / boardImageHeight * boardHeight],
  [1406 / boardImageWidth * boardWidth, 395 / boardImageHeight * boardHeight],
  [1406 / boardImageWidth * boardWidth, 630 / boardImageHeight * boardHeight],
  [1180 / boardImageWidth * boardWidth, 630 / boardImageHeight * boardHeight],
  [950 / boardImageWidth * boardWidth, 630 / boardImageHeight * boardHeight],
  [724 / boardImageWidth * boardWidth, 630 / boardImageHeight * boardHeight],
  [498 / boardImageWidth * boardWidth, 630 / boardImageHeight * boardHeight],
  [272 / boardImageWidth * boardWidth, 630 / boardImageHeight * boardHeight],
]

export const doorwayRatio = 66 / 67
export const doorwayWidth = 5.8
export const doorwayHeight = doorwayWidth / doorwayRatio
export const doorwaySelecterDeltaX = -1
export const doorwaySelecterDeltaY = -1

export const saloonPosition = [1550 / boardImageWidth * boardWidth, 90 / boardImageHeight * boardHeight]
export const saloonSelecterPosition = [1540 / boardImageWidth * boardWidth, 80 / boardImageHeight * boardHeight]
export const saloonSelecterRatio = 169 / 301
export const saloonSelecterWidth = 14.5
export const saloonSelecterHeight = saloonSelecterWidth / saloonSelecterRatio

export const graveyardPositions = [
  [25 / boardImageWidth * boardWidth, 902 / boardImageHeight * boardHeight],
  [90 / boardImageWidth * boardWidth, 885 / boardImageHeight * boardHeight],
  [25 / boardImageWidth * boardWidth, 804 / boardImageHeight * boardHeight],
  [90 / boardImageWidth * boardWidth, 787 / boardImageHeight * boardHeight],
  [25 / boardImageWidth * boardWidth, 706 / boardImageHeight * boardHeight],
  [90 / boardImageWidth * boardWidth, 689 / boardImageHeight * boardHeight],
]

export const jailPosition = [20 / boardImageWidth * boardWidth, 240 / boardImageHeight * boardHeight]
export const jailSelecterPosition = [8 / boardImageWidth * boardWidth, 80 / boardImageHeight * boardHeight]
export const jailSelecterRatio = 177 / 287
export const jailSelecterWidth = 15
export const jailSelecterHeight = jailSelecterWidth / jailSelecterRatio

export const showdownTokenRatio = 236 / 236
export const showdownTokenWidth = 6.5
export const showdownTokenHeight = showdownTokenWidth / showdownTokenRatio
export const showdownTokenPositions = [
  [218 / boardImageWidth * boardWidth, 475 / boardImageHeight * boardHeight],
  [1434 / boardImageWidth * boardWidth, 475 / boardImageHeight * boardHeight],
]

export const showdownMeeplePositions = [
  [234 / boardImageWidth * boardWidth, 535 / boardImageHeight * boardHeight],
  [1450 / boardImageWidth * boardWidth, 535 / boardImageHeight * boardHeight],
]

export const showdownSelecterPositions = [
  [180 / boardImageWidth * boardWidth, 375 / boardImageHeight * boardHeight],
  [1384 / boardImageWidth * boardWidth, 375 / boardImageHeight * boardHeight],
]
export const showdownSelecterRatio = 156 / 316
export const showdownSelecterWidth = 13.5
export const showdownSelecterHeight = showdownSelecterWidth / showdownSelecterRatio

export const diceRatio = 64 / 64
export const diceWidth = 4
export const diceHeight = diceWidth / diceRatio

export const dicePositions = [
  [275 / boardImageWidth * boardWidth, 560 / boardImageHeight * boardHeight],
  [1400 / boardImageWidth * boardWidth, 560 / boardImageHeight * boardHeight],
]

export const meeplesInHandPosition = [30, 47]
