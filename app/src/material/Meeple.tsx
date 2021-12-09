/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Draggable, Picture } from '@gamepark/react-components'
import { HTMLAttributes } from 'react'
import { useTranslation } from 'react-i18next'
import MeepleType from '../../../rules/src/MeepleType'
import { MEEPLE_DRAG_TYPE } from '../util/Types'
import Images from './Images'


type Props = {
  type: MeepleType
  indexInHand?: number
  draggable?: boolean
} & HTMLAttributes<HTMLDivElement>


export default function Meeple({ type, indexInHand, draggable, ...props }:Props) {
  const { t } = useTranslation()

  if (draggable === true) {
    return (
      <Draggable
        {...props}
        css={meepleStyle} 
        type={MEEPLE_DRAG_TYPE}
        item={{ indexInHand: indexInHand }}
        draggable={true}
        canDrag={true}
      >

        <Picture src={getMeepleImage(type)} draggable={false} css={innerMeepleStyle} alt={t(getMeepleName(type))} />
      </Draggable>
    )
  } else {
    return <Picture {...props} css={meepleStyle} src={getMeepleImage(type)} alt={t(getMeepleName(type))} />
  }
}

const getMeepleName = (type: MeepleType) => {
  switch (type) {
    case MeepleType.Builder:
      return 'Builder'
    case MeepleType.Miner:
      return 'Miner'
    case MeepleType.Robber:
      return 'Robber'
    case MeepleType.Deputy:
      return 'Deputy'
    case MeepleType.Madame:
      return 'Madame'
    default:
      return ''
  }
}

const getMeepleImage = (type: MeepleType) => {
  switch (type) {
    case MeepleType.Builder:
      return Images.builder
    case MeepleType.Miner:
      return Images.miner
    case MeepleType.Robber:
      return Images.robber
    case MeepleType.Deputy:
      return Images.deputy
    case MeepleType.Madame:
      return Images.madame
    default:
      return undefined
  }
}

const innerMeepleStyle = css`
  width: 100%;
  height: 100%;
`

const meepleStyle = css`
  filter: drop-shadow(0 0 0.2em white) drop-shadow(0 0 0.2em white);
`

