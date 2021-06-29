/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { miningBagHeight, miningBagWidth } from '../util/Styles'
import Images from './Images'


type Props = {
  gold: number
  stone: number
  dynamite: number
  left: number
  top: number
}


export default function MiningBag(props: Props) {
  return (
    <div css={getMiningBagStyle(props.left, props.top)} >
      <div css={goldAmountStyle}>{props.gold}</div>
      <div css={stoneAmountStyle}>{props.stone}</div>
      <div css={dynamiteAmountStyle}>{props.dynamite}</div>
    </div>
  )
}


const getMiningBagStyle = (left: number, top: number) => css`
  background-image: url(${Images.miningBag});
  background-color: #00000000;
  background-size: cover;
  position: absolute;
  left: ${left}%;
  top: ${top}%;
  width: ${miningBagWidth}%;
  height: ${miningBagHeight}%;
`

const goldAmountStyle = css`
  position: absolute;
  left: 55%;
  top: 22%;
  font-size: 1rem;
`

const stoneAmountStyle = css`
  position: absolute;
  left: 60%;
  top: 47%;
  font-size: 1rem;
`

const dynamiteAmountStyle = css`
  position: absolute;
  left: 65%;
  top: 72%;
  font-size: 1rem;
`