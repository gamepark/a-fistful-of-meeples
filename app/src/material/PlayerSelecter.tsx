/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import PlayerColor from '../../../rules/src/PlayerColor'
import { dialogArea, dialogStyle, dialogTitleStyle, getSize } from '../util/Styles'
import ShowdownToken from './ShowdownToken'


type Props = {
  text: string
  players: PlayerColor[]
  selected: (player: PlayerColor) => void
}


export default function PlayerSelecter({ text, players, selected }: Props) {
  return (
    <div css={dialogArea}>
      <div css={dialogStyle}>
        <div css={dialogTitleStyle}>{text}</div>
        <div css={getSize(1, 2)} />
        <div css={buttonLineStyle}>
          {players.map(player =>
            <button css={buttonStyle} onClick={() => selected(player)} key={player}>
              <ShowdownToken playercolor={player} css={showdownTokenStyle} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

const showdownTokenStyle = css`
  width: 8em;
  height: 8em;
`

const buttonStyle = css`
  background-color: black;
  border: none;
`

const buttonLineStyle = css`
  display: flex;
  justify-content: space-around;
`
