/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Picture } from '@gamepark/react-components'
import { HTMLAttributes, useState } from 'react'
import { miningBagWidth, miningBagHeight, miningBagAreaWidth } from '../util/Metrics'
import { getSize } from '../util/Styles'
import Dynamite from './Dynamite'
import GoldCube from './GoldCube'
import Images from './Images'
import StoneCube from './StoneCube'


type Props = {
  gold: number
  stone: number
  dynamite: number
} & HTMLAttributes<HTMLDivElement>


export default function MiningBag({ gold, stone, dynamite, ...props }: Props) {
  const [showContent, setShowContent] = useState<boolean>(false)

  return (
    <div onClick={() => setShowContent(!showContent)} css={[mainStyle, getSize(miningBagAreaWidth, miningBagHeight)]} {...props} >
      <Picture src={Images.miningBag} onClick={() => setShowContent(!showContent)} css={[getSize(miningBagWidth, miningBagHeight), miningBagStyle]} />
      <div css={getPanelStyle(showContent)} >
        <div css={itemStyle}><GoldCube css={[marginStyle, getSize(1.5, 1.5)]} />{gold}</div>
        <div css={itemStyle}><StoneCube css={[marginStyle, getSize(1.5, 1.5)]}/>{stone}</div>
        <div css={itemStyle}><Dynamite css={[marginStyle, getSize(1.5, 1.5)]}/>{dynamite}</div>
      </div>
    </div>
  )
}

const mainStyle = css`
  display: flex;
`

const miningBagStyle = css`
  filter: drop-shadow(0 0 0.4em white);
`

function getPanelStyle(isOpen: boolean) {
  return css`
  border: 0.4em solid #606060;
  border-radius: 1em;
  background: black;

  transition: transform 1s;
  transform: scaleX(${isOpen ? 1 : 0});
  transform-origin: left;
  display: flex;
  flex-direction: column;
  padding: 0.5em 1em 0.5em 1em;
  margin-left: 0.5em;
`
}

const itemStyle = css`
  display: flex;
  flex-direction: row;
  justify-content: 
  align-items: center;
  font-size: 2.6em;
  font-weight: bold;
  text-shadow: 0 0 0.3em black;
`

const marginStyle = css`
  margin: 0 0.5em 0 0;
`