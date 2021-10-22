/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import PlayerColor from '../../../rules/src/PlayerColor'
import PlayerState from '../../../rules/src/PlayerState'
import { stoneCubeRatio, goldCubeRatio, goldBarRatio } from '../util/Metrics'
import GoldBar from './GoldBar'
import Images from './Images'
import StoneCube from './StoneCube'
import GoldCube from './GoldCube'
import GameState from '../../../rules/src/GameState'
import { HTMLAttributes } from 'react'
import { Avatar, usePlayer } from '@gamepark/react-client'
import { SpeechBubbleDirection } from '@gamepark/react-client/dist/Avatar'
import { Picture } from '@gamepark/react-components'
import { useTranslation } from 'react-i18next'


type Props = {
  player: PlayerColor | undefined
  playerState: PlayerState
  gameState: GameState
} & HTMLAttributes<HTMLDivElement>


export default function PlayerInfo(props: Props) {
  const { t } = useTranslation()
  const playerInfo = usePlayer<PlayerColor>(props.player)


  return (
    <div {...props} css={getPlayerInfoStyle(props.playerState.color, props.gameState.activePlayer === props.playerState.color)} >
      {playerInfo?.avatar ?
        <Avatar playerId={props.player} css={avatarStyle} speechBubbleProps={{ direction: SpeechBubbleDirection.BOTTOM_LEFT }} /> :
        <Picture alt={t('Player avatar')} src={Images.avatar} css={fallbackAvatarStyle} />
      }

      <div css={getItemStyle(82, 10)}>
        {props.playerState.stones}
      </div>
      <div css={getItemStyle(82 , 40)}>
        {props.playerState.goldPieces}
      </div>
      <div css={getItemStyle(62, 72)}>
        {props.playerState.goldBars}
      </div>
      <StoneCube style={getStoneCubeStyle} />
      <GoldCube style={getGoldCubeStyle} />
      <GoldBar style={getGoldBarStyle} />
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


const getPlayerInfoStyle = (color: PlayerColor, isActive: boolean) => css`
  background-image: url(${getPlayerImage(color)});
  background-color: #00000000;
  background-size: cover;
  position: absolute;
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
  left: 60%;
  top: 5%;
  width: 20%;
  height: ${20 / stoneCubeRatio}%;
`

const getGoldCubeStyle = css`
  position: absolute;
  left: 60%;
  top: 35%;
  width: 20%;
  height: ${20 / goldCubeRatio}%;
`

const getGoldBarStyle = css`
  position: absolute;
  transform: rotate(90deg);
  left: 15%;
  top: 55%;
  width: 30%;
  height: ${30 / goldBarRatio}%;
`

const avatarStyle = css`
  position: absolute;
  width: 50%;
  height: 50%;
  top: 5%;
  left: 5%;
`

const fallbackAvatarStyle = css`
  position: absolute;
  width: 50%;
  height: 50%;
  top: 5%;
  left: 5%;
  border: 0.1em solid white;
  border-radius: 100%; 
`
