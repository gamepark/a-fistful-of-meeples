/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { HTMLAttributes } from 'react'
import Images from './Images'


type Props = {
  gold: number
  stone: number
  dynamite: number
} & HTMLAttributes<HTMLDivElement>


export default function MiningBag(props: Props) {
  return (
    <div css={miningBagStyle} {...props} >
      <div css={goldAmountStyle}>{props.gold}</div>
      <div css={stoneAmountStyle}>{props.stone}</div>
      <div css={dynamiteAmountStyle}>{props.dynamite}</div>
    </div>
  )
}


const miningBagStyle = css`
  background-image: url(${Images.miningBag});
  background-color: #00000000;
  background-size: cover;
  color: white;
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