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
import { Avatar, GamePoints, Player, PlayerTimer, usePlayer } from '@gamepark/react-client'
import { SpeechBubbleDirection } from '@gamepark/react-client/dist/Avatar'
import { Picture } from '@gamepark/react-components'
import { TFunction, useTranslation } from 'react-i18next'
import { goldBarRatio } from '../util/Metrics'
import { getPlayerName } from '../../../rules/src/AFistfulOfMeeplesOptions'
import Phase from '../../../rules/src/Phase'
import Marquee from './Marquee'
import { getPosition, getSize } from '../util/Styles'


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
          <Marquee owner={playerState.color} upgraded={false} css={getPosition(getMarqueePositionInPlayerInfo(index))} key={index} />
          )}
        </>
      }

      {playerInfo?.avatar ?
        <Avatar playerId={playerState.color} css={avatarStyle} speechBubbleProps={{ direction: SpeechBubbleDirection.BOTTOM_LEFT }} /> :
        <Picture alt={t('FallbackAvatar')} src={Images.avatar} css={[avatarStyle, fallbackAvatarStyle(playerState.color)]} />
      }

      <div css={[getItemStyle(2, 46, 90), infosStyle]}>
        <div>{getNameForPlayer(playerInfo, playerState.color, t)}</div>
        <div>
          {playerInfo?.time?.playing && <PlayerTimer playerId={playerState.color} />}
          {gameState.currentPhase === Phase.GameOver && getPlayerScore(gameState, playerState.color)}
          {playerInfo?.gamePointsDelta && < GamePoints playerId={playerState.color} suspense={5} />}
        </div>
      </div>

      <div css={[getItemStyle(-2, 70, 90), resourceStyle]}>
        {(playerState.stones > 0) && <div css={resourceStyle}><StoneCube css={[spacingStyle, getSize(1.3, 1.3)]} />{playerState.stones}</div>}
        {(playerState.goldPieces > 0) && <div css={resourceStyle}><GoldCube css={[spacingStyle, getSize(1.3, 1.3)]} />{playerState.goldPieces}</div>}
        {(playerState.goldBars > 0) && <div css={resourceStyle}><GoldBar css={[spacingStyle, goldBarStyle]} />{playerState.goldBars}</div>}
      </div>
    </div>
  )
}

export function getPlayerColor(playerColor: PlayerColor): number {
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

export function getNameForPlayer(player: Player<PlayerColor> | undefined, playerColor: PlayerColor, t: TFunction): string {
  return player?.name ?? getPlayerName(playerColor, t)
}

function getPlayerInfoStyle(isActive: boolean, playerColor: PlayerColor) {
  const color = getPlayerColor(playerColor)
  return css`
  background-color: #${color.toString(16) + (isActive ? 'D0' : '60')};
  border-radius: 4em;
  border: ${isActive ? 0.5 : 0.3}em solid #${(isActive ? 0xffd700 : color).toString(16)};
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

const getItemStyle = (left: number, top: number, width: number) => css`
  position: absolute;
  left: ${left}%;
  top: ${top}%;
  width: ${width}%;
  font-size: 3em;
  font-weight: bold;
  text-shadow: 0 0 0.3em black;
`

const infosStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const resourceStyle = css`
  display: flex;
  align-content: center;
`

const goldBarStyle = css`
  width: 1.5em;
  height: ${1.5 / goldBarRatio}em;
  transform: translate(0, -0.6em) rotate(270deg);
`

const spacingStyle = css`
  margin-left: 1em;
  margin-right: 0.5em;
`
