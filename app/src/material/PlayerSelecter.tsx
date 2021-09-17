/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import PlayerColor from '../../../rules/src/PlayerColor'
import ShowdownToken from './ShowdownToken'


type Props = {
  text: string
  players: PlayerColor[]
  selected: (player: PlayerColor) => void
}


export default function PlayerSelecter(props: Props) {
  return (
    <table css={popupStyle}>
      <tbody>
        <tr><td colSpan={2}>{props.text}</td></tr>
        <tr>
          {props.players.map(player =>
            <td key={player}><a onClick={() => props.selected(player)} ><ShowdownToken playercolor={player} css={showdownTokenStyle} /></a></td>
          )}
        </tr>
      </tbody>
    </table>
  )
}

const popupStyle = css`
  position: absolute;
  left: 40%;
  top: 35%;
  width: 10%;
  height: 15%;
  padding: 1em;
  background-color: #6a2e12;
  border-radius: 2em;
  border-style: solid;
  border-color: black;
  text-align: center;
  font-family: 'Oswald', "Roboto Light", serif;
  font-size: 1.5em;
`

const showdownTokenStyle = css`
  width: 50%;
  height: 50%;
`
