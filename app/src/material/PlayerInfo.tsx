/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import PlayerColor from '../../../rules/src/PlayerColor'
import PlayerState from '../../../rules/src/PlayerState'
import { playerInfoWidth, playerInfoHeight, stoneCubeRatio, goldCubeRatio, goldBarRatio } from '../util/Metrics'
import GoldBar from './GoldBar'
import Images from './Images'
import StoneCube from './StoneCube'
import GoldCube from './GoldCube'
import GameState from '../../../rules/src/GameState'


type Props = {
  player: PlayerColor | undefined
  playerState: PlayerState
  gameState: GameState
  left: number
  top: number
}


export default function PlayerInfo(props: Props) {
  return (
    <div css={getPlayerInfoStyle(props.left, props.top, props.playerState.color, props.gameState.activePlayer === props.playerState.color)} >
      <div css={getItemStyle(32, 10)}>
        {props.playerState.stones}
      </div>
      <div css={getItemStyle(82 , 10)}>
        {props.playerState.goldPieces}
      </div>
      <div css={getItemStyle(62, 42)}>
        {props.playerState.goldBars}
      </div>
      <StoneCube style={getStoneCubeStyle} />
      <GoldCube style={getGoldCubeStyle} />
      <GoldBar style={getGoldBarStyle} />
      { (props.gameState.startingPlayer === props.playerState.color) && 'S'}
    </div>
  )
}

const getPlayerImage = (color: PlayerColor) => {
  switch (color) {
    case PlayerColor.Black:
      return Images.playerBlack
    case PlayerColor.Green:
      return Images.playerGreen
    case PlayerColor.Orange:
      return Images.playerOrange
    case PlayerColor.Grey:
      return Images.playerGrey
    default:
      return undefined
  }
}


const getPlayerInfoStyle = (left: number, top: number, color: PlayerColor, isActive: boolean) => css`
  background-image: url(${getPlayerImage(color)});
  background-color: #00000000;
  background-size: cover;
  position: absolute;
  left: ${left}%;
  top: ${top}%;
  width: ${playerInfoWidth}%;
  height: ${playerInfoHeight}%;
  ${isActive && 'filter: drop-shadow(0 0.2em 0.2em black) drop-shadow(0 0 0.2em red)'}
`


const getItemStyle = (left: number, top: number) => css`
  position: absolute;
  left: ${left}%;
  top: ${top}%;
  font-size: 1rem;
`

const getStoneCubeStyle = css`
  position: absolute;
  left: 5%;
  top: 5%;
  width: 20%;
  height: ${20 / stoneCubeRatio}%;
`

const getGoldCubeStyle = css`
  position: absolute;
  left: 55%;
  top: 5%;
  width: 20%;
  height: ${20 / goldCubeRatio}%;
`

const getGoldBarStyle = css`
  position: absolute;
  transform: rotate(90deg);
  left: 15%;
  top: 25%;
  width: 30%;
  height: ${30 / goldBarRatio}%;
`
