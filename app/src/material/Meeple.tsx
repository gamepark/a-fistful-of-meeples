/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Draggable } from '@gamepark/react-components'
import { useTranslation } from 'react-i18next'
import MeepleType from '../../../rules/src/MeepleType'
import { meepleHeight, meepleWidth } from '../util/Metrics'
import { MEEPLE_DRAG_TYPE } from '../util/Types'
import Images from './Images'


type Props = {
  position: Array<number>
  type: MeepleType
  draggable?: boolean
}


export default function Meeple(props: Props) {
  const { t } = useTranslation()

  if (props.draggable === true) {
    return (
      <Draggable
        type={MEEPLE_DRAG_TYPE}
        item={{ meeple: props.type }}
        draggable={true}
        canDrag={true}
        css={getMainMeepleStyle(props.position[0], props.position[1])}
      >

        <img src={getMeepleImage(props.type)} draggable={false} css={getInnerMeepleStyle} alt={t(getMeepleName(props.type))} />
      </Draggable>
    )
  } else {
    return <img src={getMeepleImage(props.type)} css={getMainMeepleStyle(props.position[0], props.position[1])} alt={t(getMeepleName(props.type))} />
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

const getMainMeepleStyle = (left: number, top: number) => css`
  position: absolute;
  left: ${left}%;
  top: ${top}%;
  width: ${meepleWidth}%;
  height: ${meepleHeight}%;
`

const getInnerMeepleStyle = css`
  width: 100%;
  height: 100%;
`

