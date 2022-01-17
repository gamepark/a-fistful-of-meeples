/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Draggable, Picture } from '@gamepark/react-components'
import { HTMLAttributes } from 'react'
import { TFunction, useTranslation } from 'react-i18next'
import MeepleType from '../../../rules/src/MeepleType'
import { fullSizeStyle } from '../util/Styles'
import { MEEPLE_DRAG_TYPE } from '../util/Types'
import Images from './Images'

export enum SelectionStatus {
  Selectable,
  Selected
}

type Props = {
  type: MeepleType
  indexInHand?: number
  draggable?: boolean
  selectionStatus?: SelectionStatus
  onSelect?: () => void
} & HTMLAttributes<HTMLDivElement>


export default function Meeple({ type, indexInHand, draggable, selectionStatus, onSelect, ...props }:Props) {
  const { t } = useTranslation()
  const selectionStyle = (selectionStatus === SelectionStatus.Selected) ? selectedMeepleStyle : ((selectionStatus === SelectionStatus.Selectable) ? selectableMeepleStyle : meepleStyle)

  if (draggable === true) {
    return (
      <Draggable
        {...props}
        css={selectionStyle}
        type={MEEPLE_DRAG_TYPE}
        item={{ indexInHand: indexInHand }}
        draggable={true}
        canDrag={true}
        onDragStart={onSelect}
      >

        <Picture src={getMeepleImage(type)} onClick={onSelect} draggable={false} css={fullSizeStyle} alt={getMeepleName(type, t)} />
      </Draggable>
    )
  } else {
    return <Picture {...props} onClick={onSelect} css={selectionStyle} src={getMeepleImage(type)} alt={getMeepleName(type, t)} />
  }
}

const getMeepleName = (type: MeepleType, t: TFunction): string => {
  switch (type) {
    case MeepleType.Builder:
      return t('Builder')
    case MeepleType.Miner:
      return t('Miner')
    case MeepleType.Robber:
      return t('Robber')
    case MeepleType.Deputy:
      return t('Deputy')
    case MeepleType.Madame:
      return t('Madame')
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

const meepleStyle = css`
  filter: drop-shadow(0 0 0.2em white);
`

const selectableMeepleStyle = css`
  filter: drop-shadow(0 0 0.2em #29db06FF) drop-shadow(0 0 0.2em #29db06FF);
`

const selectedMeepleStyle = css`
  filter: drop-shadow(0 0 0.2em #29db06FF) drop-shadow(0 0 0.2em #29db06FF) drop-shadow(0 0 0.2em #00FF00FF) drop-shadow(0 0 0.5em #00FF00FF);
`

