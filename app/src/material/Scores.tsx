/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Avatar, SpeechBubbleDirection, usePlayerId, usePlayers } from '@gamepark/react-client'
import { Picture } from '@gamepark/react-components'
import { useTranslation } from 'react-i18next'
import GameState, { getPlayerScore, getPlayerScoreBars, getPlayerScoreMarquees, getPlayerScorePieces } from '../../../rules/src/GameState'
import PlayerColor from '../../../rules/src/PlayerColor'
import { getEndOfGameText } from '../HeaderText'
import { dialogArea, dialogStyle, dialogTitleStyle } from '../util/Styles'
import Images from './Images'
import { getNameForPlayer, getPlayerColor } from './PlayerInfo'


type Props = {
  gameState: GameState
}


export default function Scores({ gameState }: Props) {
  const { t } = useTranslation()
  const players = usePlayers<PlayerColor>()
  const player = usePlayerId<PlayerColor>()

  return (
    <div css={dialogArea}>
      <div css={dialogStyle}>
        <div css={dialogTitleStyle}>{getEndOfGameText(t, players, gameState, player)}</div>
        <table css={scoresStyle}>
          <thead>
            <tr>
              <th css={headerStyle} colSpan={2}>{t('score_name')}</th>
              <th css={headerStyle}>{t('score_pieces')}</th>
              <th css={headerStyle}>{t('score_bars')}</th>
              <th css={headerStyle}>{t('score_marquees')}</th>
              <th css={headerStyle}>{t('score_total')}</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player, index) => {
              const playerState = gameState.players.find(state => state.color === player.id)!
              return <tr key={index} css={rowStyle} >
                <td css={playerStyle}>
                  {player?.avatar ?
                    <Avatar playerId={player.id} css={avatarStyle} speechBubbleProps={{ direction: SpeechBubbleDirection.BOTTOM_LEFT }} /> :
                    <Picture alt={t('FallbackAvatar')} src={Images.avatar} css={[avatarStyle, fallbackAvatarStyle(player.id)]} />
                  }
                </td>
                <td>
                  {getNameForPlayer(player, player.id, t)}
                </td>
                <td css={cellStyle}>{getPlayerScorePieces(playerState)}</td>
                <td css={cellStyle}>{getPlayerScoreBars(playerState)}</td>
                <td css={cellStyle}>{getPlayerScoreMarquees(gameState, player.id)}</td>
                <td css={cellStyle}>{getPlayerScore(gameState, player.id)}</td>
              </tr>
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const avatarStyle = css`
  position: relative;
  width: 3em;
  height: 3em;
`

const fallbackAvatarStyle = (playerColor: PlayerColor) => css`
  border: 0.1em solid #${getPlayerColor(playerColor).toString(16)};
  border-radius: 100%; 
`

const scoresStyle = css`
  font-size: 3em;
  border: 0.05em solid #808080;
  border-radius: 0.2em;
  width: 100%;
  border-collapse: collapse;
  margin-top: 0.5em;
`

const rowStyle = css`
  border: 0.05em solid #808080;
`

const headerStyle = css`
  border: 0.05em solid #808080;
  padding: 0.3em;
`

const playerStyle = css`
  padding: 0.3em;
`

const cellStyle = css`
  border: 0.05em solid #808080;
  text-align: right;
  vertical-align: middle;
  padding: 0.3em;
`
