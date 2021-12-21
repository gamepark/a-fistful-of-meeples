/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import PlayerColor from '../../../rules/src/PlayerColor'
import PlayerState from '../../../rules/src/PlayerState'
import GoldBar from './GoldBar'
import Images from './Images'
import StoneCube from './StoneCube'
import GoldCube from './GoldCube'
import GameState, { getPlayerRemainingMarquees, getPlayerScore } from '../../../rules/src/GameState'
import { HTMLAttributes } from 'react'
import { Avatar, GamePoints, PlayerTimer, usePlayer } from '@gamepark/react-client'
import { SpeechBubbleDirection } from '@gamepark/react-client/dist/Avatar'
import { Picture } from '@gamepark/react-components'
import { useTranslation } from 'react-i18next'
import { goldBarRatio } from '../util/Metrics'
import { getPlayerName } from '../../../rules/src/AFistfulOfMeeplesOptions'
import Phase from '../../../rules/src/Phase'
import Marquee from './Marquee'
import { getSize } from '../util/Styles'


type Props = {
  playerState: PlayerState
  gameState: GameState
  buildingMarqueeAnimation: boolean
} & HTMLAttributes<HTMLDivElement>


export default function PlayerInfo({ playerState, gameState, buildingMarqueeAnimation, ...props }: Props) {
  const { t } = useTranslation()
  const playerInfo = usePlayer<PlayerColor>(playerState.color)
  const marquees = getPlayerRemainingMarquees(gameState, playerState.color) - (buildingMarqueeAnimation ? 1 : 0)


  return (
    <div {...props} css={getPlayerInfoStyle(gameState.activePlayer === playerState.color, playerState.color)} >
      {marquees > 0 &&
        <>
        {[...Array(marquees)].map((_, index) =>
          <Marquee owner={playerState.color} upgraded={false} css={getMarqueeStyle(index)} key={index} />
          )}
        </>
      }

      {playerInfo?.avatar ?
        <Avatar playerId={playerState.color} css={avatarStyle} speechBubbleProps={{ direction: SpeechBubbleDirection.BOTTOM_LEFT }} /> :
        <Picture alt={t('Player avatar')} src={Images.avatar} css={[avatarStyle, fallbackAvatarStyle(playerState.color)]} />
      }

      <div css={getItemStyle(2, 46, 90)}>
        <div>{playerInfo?.name ?? getPlayerName(playerState.color, t)}</div>
        <div>
          {playerInfo?.time?.playing && <PlayerTimer playerId={playerState.color} />}
          {gameState.currentPhase === Phase.GameOver && getPlayerScore(gameState, playerState.color)}
          {playerInfo?.gamePointsDelta && < GamePoints playerId={playerState.color} suspense={5} />}
        </div>
      </div>

      <div css={getItemStyle(4, 60, 90)}>
        <StoneCube css={getSize(1.3, 1.3)} />
        {playerState.stones}
        <GoldCube css={getSize(1.5, 1.5)} />
        {playerState.goldPieces}
        <GoldBar css={goldBarStyle} />
        {playerState.goldBars}
      </div>
    </div>
  )
}

function getPlayerColor(playerColor: PlayerColor): number {
  switch (playerColor) {
    case PlayerColor.Black:
      return 0x353437
    case PlayerColor.Green:
      return 0x92b849
    case PlayerColor.Grey:
      return 0xb5a792
    case PlayerColor.Orange:
      return 0xe1822d
  }
}

function getPlayerInfoStyle(isActive: boolean, playerColor: PlayerColor) {
  const color = getPlayerColor(playerColor)
  return css`
  background-color: #${color.toString(16) + (isActive ? 'D0' : '60')};
  border-radius: 4em;
  border: 0.3em solid #${color.toString(16)};
`
}

const avatarStyle = css`
  position: absolute;
  width: 8em;
  height: 8em;
  top: 0.5em;
  left: 0.5em;
`

const fallbackAvatarStyle = (playerColor: PlayerColor) => css`
  border: 0.1em solid #${getPlayerColor(playerColor).toString(16)};
  border-radius: 100%; 
`

export function getMarqueePositionInPlayerInfo(index: number) {
  return [(10 + (index * 0.3)), 1.2 - index * 0.1]
}

function getMarqueeStyle(index: number) {
  const position = getMarqueePositionInPlayerInfo(index)
  return css`
  position: absolute;
  left: ${position[0]}em;
  top: ${position[1]}em;
`
}

const getItemStyle = (left: number, top: number, width: number) => css`
  position: absolute;
  left: ${left}%;
  top: ${top}%;
  width: ${width}%;
  font-size: 3em;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
`



const goldBarStyle = css`
  width: 1.5em;
  height: ${1.5 / goldBarRatio}em;
  transform: rotate(270deg);
`

