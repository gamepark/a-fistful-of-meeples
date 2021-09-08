//import {css, Theme} from '@emotion/react'

export const screenRatio = 16 / 9

export const boardImageWidth = 1758
export const boardImageHeight = 1080
export const boardRatio = boardImageWidth / boardImageHeight
export const boardHeight = 93
export const boardWidth = boardHeight * boardRatio / screenRatio
export const boardLeftMargin = (100 - boardWidth) / 2
export const boardTopMargin = 7

export const goldBarRatio = 51 / 83
export const goldBarWidth = 2.7
export const goldBarHeight = goldBarWidth / goldBarRatio * screenRatio
export const goldBarLeft1 = 1562 / boardImageWidth * 100
export const goldBarLeft2 = 1670 / boardImageWidth * 100
export const goldBarTop1 = 685 / boardImageHeight * 100
export const goldBarTop2 = 794 / boardImageHeight * 100
export const goldBarTop3 = 900 / boardImageHeight * 100

export const goldBarPositions = [
  [goldBarLeft2, goldBarTop3],
  [goldBarLeft1, goldBarTop3],
  [goldBarLeft2, goldBarTop2],
  [goldBarLeft1, goldBarTop2],
  [goldBarLeft2, goldBarTop1],
  [goldBarLeft1, goldBarTop1],
]

export const miningBagRatio = 784 / 764
export const miningBagWidth = 10
export const miningBagHeight = miningBagWidth / miningBagRatio * screenRatio
export const miningBagLeft = -miningBagWidth - 2
export const miningBagTop = 4

export const playerInfoRatio = 64 / 64
export const playerInfoWidth = 8
export const playerInfoHeight = playerInfoWidth / playerInfoRatio * screenRatio
export const playerInfoPositions = [
  [-playerInfoWidth - 2, miningBagTop + miningBagHeight + 4],
  [-playerInfoWidth - 2, miningBagTop + miningBagHeight + playerInfoHeight + 6],
  [-playerInfoWidth - 2, miningBagTop + miningBagHeight + playerInfoHeight * 2 + 8],
  [-playerInfoWidth - 2, miningBagTop + miningBagHeight + playerInfoHeight * 3 + 10],
]

export const goldCubeRatio = 101 / 115
export const goldCubeWidth = 3
export const goldCubeHeight = goldCubeWidth / goldCubeRatio

export const stoneCubeRatio = 103 / 121
export const stoneCubeWidth = 3
export const stoneCubeHeight = stoneCubeWidth / stoneCubeRatio

export const dynamiteRatio = 131 / 147
export const dynamiteWidth = 1.9
export const dynamiteHeight = dynamiteWidth / dynamiteRatio * screenRatio
export const dynamitePositions = [
  [35 / boardImageWidth * 100, 93 / boardImageHeight * 100],
  [95 / boardImageWidth * 100, 93 / boardImageHeight * 100],
  [155 / boardImageWidth * 100, 93 / boardImageHeight * 100]
]

export const marqueeRatio = 484 / 167
export const marqueeWidth = 12.5
export const marqueeHeight = marqueeWidth / marqueeRatio * screenRatio

export const marqueesPosition = [
  [202 / boardImageWidth * 100, 47 / boardImageHeight * 100],
  [431 / boardImageWidth * 100, 47 / boardImageHeight * 100],
  [667 / boardImageWidth * 100, 47 / boardImageHeight * 100],
  [883 / boardImageWidth * 100, 47 / boardImageHeight * 100],
  [1110 / boardImageWidth * 100, 47 / boardImageHeight * 100],
  [1332 / boardImageWidth * 100, 47 / boardImageHeight * 100],
  [1332 / boardImageWidth * 100, 946 / boardImageHeight * 100],
  [1110 / boardImageWidth * 100, 946 / boardImageHeight * 100],
  [883 / boardImageWidth * 100, 946 / boardImageHeight * 100],
  [667 / boardImageWidth * 100, 946 / boardImageHeight * 100],
  [431 / boardImageWidth * 100, 946 / boardImageHeight * 100],
  [202 / boardImageWidth * 100, 946 / boardImageHeight * 100],
]

export const meepleRatio = 286 / 350
export const meepleWidth = 2
export const meepleHeight = meepleWidth / meepleRatio * screenRatio

export const buildingsPosition = [
  [217 / boardImageWidth * 100, 190 / boardImageHeight * 100],
  [446 / boardImageWidth * 100, 190 / boardImageHeight * 100],
  [670 / boardImageWidth * 100, 190 / boardImageHeight * 100],
  [895 / boardImageWidth * 100, 190 / boardImageHeight * 100],
  [1123 / boardImageWidth * 100, 190 / boardImageHeight * 100],
  [1350 / boardImageWidth * 100, 190 / boardImageHeight * 100],
  [1350 / boardImageWidth * 100, 710 / boardImageHeight * 100],
  [1123 / boardImageWidth * 100, 710 / boardImageHeight * 100],
  [895 / boardImageWidth * 100, 710 / boardImageHeight * 100],
  [670 / boardImageWidth * 100, 710 / boardImageHeight * 100],
  [446 / boardImageWidth * 100, 710 / boardImageHeight * 100],
  [217 / boardImageWidth * 100, 710 / boardImageHeight * 100],
]

export const buildingRatio = 251 / 220
export const buildingWidth = 12.5
export const buildingHeight = buildingWidth / buildingRatio * screenRatio
export const buildingSelecterDeltaX = -1
export const buildingSelecterDeltaY = -1.5

export const doorwaysPosition = [
  [295 / boardImageWidth * 100, 395 / boardImageHeight * 100],
  [522 / boardImageWidth * 100, 395 / boardImageHeight * 100],
  [748 / boardImageWidth * 100, 395 / boardImageHeight * 100],
  [972 / boardImageWidth * 100, 395 / boardImageHeight * 100],
  [1200 / boardImageWidth * 100, 395 / boardImageHeight * 100],
  [1425 / boardImageWidth * 100, 395 / boardImageHeight * 100],
  [1425 / boardImageWidth * 100, 630 / boardImageHeight * 100],
  [1200 / boardImageWidth * 100, 630 / boardImageHeight * 100],
  [972 / boardImageWidth * 100, 630 / boardImageHeight * 100],
  [748 / boardImageWidth * 100, 630 / boardImageHeight * 100],
  [522 / boardImageWidth * 100, 630 / boardImageHeight * 100],
  [295 / boardImageWidth * 100, 630 / boardImageHeight * 100],
]

export const doorwayRatio = 66 / 60
export const doorwayWidth = 3.8
export const doorwayHeight = doorwayWidth / doorwayRatio * screenRatio
export const doorwaySelecterDeltaX = -1
export const doorwaySelecterDeltaY = -0.5

export const saloonPosition = [1570 / boardImageWidth * 100, 100 / boardImageHeight * 100]

export const graveyardPositions = [
  [45 / boardImageWidth * 100, 905 / boardImageHeight * 100],
  [110 / boardImageWidth * 100, 890 / boardImageHeight * 100],
  [45 / boardImageWidth * 100, 810 / boardImageHeight * 100],
  [110 / boardImageWidth * 100, 790 / boardImageHeight * 100],
  [45 / boardImageWidth * 100, 700 / boardImageHeight * 100],
  [110 / boardImageWidth * 100, 690 / boardImageHeight * 100],
]

export const jailPosition = [42 / boardImageWidth * 100, 248 / boardImageHeight * 100]

export const showdownMeeplePositions = [
  [258 / boardImageWidth * 100, 550 / boardImageHeight * 100],
  [1458 / boardImageWidth * 100, 550 / boardImageHeight * 100],
]

export const showdownTokenRatio = 236 / 236
export const showdownTokenWidth = 6.5
export const showdownTokenHeight = showdownTokenWidth / showdownTokenRatio * screenRatio

export const showdownTokenPositions = [
  [218 / boardImageWidth * 100, 475 / boardImageHeight * 100],
  [1420 / boardImageWidth * 100, 475 / boardImageHeight * 100],
]

export const showdownSelecterPositions = [
  [200 / boardImageWidth * 100, 380 / boardImageHeight * 100],
  [1406 / boardImageWidth * 100, 380 / boardImageHeight * 100],
]

export const showdownSelecterRatio = 156 / 300
export const showdownSelecterWidth = 8.5
export const showdownSelecterHeight = showdownSelecterWidth / showdownSelecterRatio * screenRatio

export const phaseRatio = 64 / 64
export const phaseWidth = 6
export const phaseHeight = phaseWidth / phaseRatio * screenRatio
export const phasesPositions = [
  [102, 4],
  [102, 4 + phaseHeight + 4],
  [102, 4 + (phaseHeight + 4) * 2],
  [102, 4 + (phaseHeight + 4) * 3],
]

export const meeplesInHandPosition = [ 101, 70 ]
