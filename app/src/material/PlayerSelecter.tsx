/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Dialog } from '@gamepark/react-components'
import PlayerColor from '../../../rules/src/PlayerColor'
import { dialogStyle } from '../util/Styles'
import ShowdownToken from './ShowdownToken'


type Props = {
  text: string
  players: PlayerColor[]
  selected: (player: PlayerColor) => void
}


export default function PlayerSelecter({ text, players, selected, ...props }: Props) {
  return (
    <Dialog open={true} css={dialogStyle} {...props} >

      <h3>{text}</h3>
      <p css={buttonLineStyle}>
        {players.map(player =>
          <button css={buttonStyle} onClick={() => selected(player)} key={player}><ShowdownToken playercolor={player} css={showdownTokenStyle} /></button>
        )}
      </p>
    </Dialog>
  )
}

const showdownTokenStyle = css`
  width: 15em;
  height: 15em;
`

const buttonStyle = css`
  background-color: black;
  border: none;
`

const buttonLineStyle = css`
  display: flex;
  justify-content: space-around;
`
