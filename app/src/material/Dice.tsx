/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { HTMLAttributes } from 'react'


type Props = {
  value: number
} & HTMLAttributes<HTMLDivElement>


export default function Dice(props: Props) {
  return <div {...props} css={diceStyle}>{props.value}</div>
}

const diceStyle = css`
  padding: 1em;
  background-color: #6a2e12;
  border-radius: 2em;
  border-style: solid;
  border-color: black;
  text-align: center;
  font-family: 'Oswald', "Roboto Light", serif;
  font-size: 1.5em;
`