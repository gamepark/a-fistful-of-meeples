/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import PlayerColor from '../../../rules/src/PlayerColor'
import PlayerState from '../../../rules/src/PlayerState'
import GoldBar from './GoldBar'
import Images from './Images'
import StoneCube from './StoneCube'
import GoldCube from './GoldCube'
import GameState, { getPlayerScore } from '../../../rules/src/GameState'
import { HTMLAttributes } from 'react'
import { Avatar, GamePoints, PlayerTimer, usePlayer } from '@gamepark/react-client'
import { SpeechBubbleDirection } from '@gamepark/react-client/dist/Avatar'
import { Picture } from '@gamepark/react-components'
import { useTranslation } from 'react-i18next'
import { goldBarRatio } from '../util/Metrics'
import { getPlayerName } from '../../../rules/src/AFistfulOfMeeplesOptions'
import Phase from '../../../rules/src/Phase'


type Props = {
  playerState: PlayerState
  gameState: GameState
} & HTMLAttributes<HTMLDivElement>


export default function PlayerInfo({ playerState, gameState, ...props }: Props) {
  const { t } = useTranslation()
  const playerInfo = usePlayer<PlayerColor>(playerState.color)


  return (
    <div {...props} css={getPlayerInfoStyle(playerState.color, gameState.activePlayer === playerState.color)} >
      {playerInfo?.avatar ?
        <Avatar playerId={playerState.color} css={avatarStyle} speechBubbleProps={{ direction: SpeechBubbleDirection.BOTTOM_LEFT }} /> :
        <Picture alt={t('Player avatar')} src={Images.avatar} css={[avatarStyle, fallbackAvatarStyle]} />
      }

      <div css={getItemStyle(35, 5)}>
        {playerInfo?.name ?? getPlayerName(playerState.color, t)}
      </div>
      <div css={getItemStyle(35, 35)}>
        {gameState.currentPhase === Phase.GameOver && getPlayerScore(gameState, playerState.color)}
        {playerInfo?.time?.playing && <PlayerTimer playerId={playerState.color} />}
        {playerInfo?.gamePointsDelta && < GamePoints playerId={playerState.color} suspense={5} />}
      </div>

      <div css={getItemStyle(20, 70)}>
        {playerState.stones}
      </div>
      <div css={getItemStyle(50 , 70)}>
        {playerState.goldPieces}
      </div>
      <div css={getItemStyle(85, 70)}>
        {playerState.goldBars}
      </div>
      <StoneCube css={getStoneCubeStyle} />
      <GoldCube css={getGoldCubeStyle} />
      <GoldBar css={getGoldBarStyle} />
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
  ${isActive && 'filter: drop-shadow(0 0.2em 0.2em black) drop-shadow(0 0 0.2em red)'}
`


const getItemStyle = (left: number, top: number) => css`
  position: absolute;
  left: ${left}%;
  top: ${top}%;
  font-size: 3em;
`

const getStoneCubeStyle = css`
  position: absolute;
  left: 5%;
  top: 65%;
  width: 4em;
  height: 4em;
`

const getGoldCubeStyle = css`
  position: absolute;
  left: 35%;
  top: 65%;
  width: 4.5em;
  height: 4.5em;
`

const getGoldBarStyle = css`
  position: absolute;
  left: 65%;
  top: 60%;
  width: 4em;
  height: ${4 / goldBarRatio}em;
  transform: rotate(90deg);
`

const avatarStyle = css`
  position: absolute;
  width: 8em;
  height: 8em;
  top: 5%;
  left: 5%;
`

const fallbackAvatarStyle = css`
  border: 0.1em solid white;
  border-radius: 100%; 
`
