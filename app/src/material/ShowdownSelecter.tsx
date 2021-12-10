/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useTranslation } from 'react-i18next'
import { useDrop } from 'react-dnd'
import Images from './Images'
import { MEEPLE_DRAG_TYPE } from '../util/Types'
import MeepleType from '../../../rules/src/MeepleType'
import { Picture } from '@gamepark/react-components'
import { HTMLAttributes } from 'react'


type Props = {
  flip: boolean
  droppable: boolean
  selected: (meeple?: MeepleType) => void
} & HTMLAttributes<HTMLImageElement>

type DropItem = { indexInHand: number }


export default function ShowdownSelecter({ flip, droppable, selected, ...props }: Props) {
  const { t } = useTranslation()
  const [{ isOver }, dropRef] = useDrop({
    accept: MEEPLE_DRAG_TYPE,
    collect: monitor => ({
      isOver: monitor.isOver()
    }),
    drop: (item: DropItem) => {
      selected(item.indexInHand)
    }
  })

  if (droppable) {
    return <Picture {...props} ref={dropRef} src={isOver ? Images.showdownSelecterHover : Images.showdownSelecter} css={getShowdownSelecterStyle(flip, false)} alt={t("SelectThisShodownPlace")} />
  } else {
    return <Picture {...props} onClick={() => selected()} src={Images.showdownSelecter} css={getShowdownSelecterStyle(flip, true)} alt={t("SelectThisShodownPlace")} />
  }
}

const getShowdownSelecterStyle = (flip: boolean, clickable: boolean) => css`
  transform: scaleX(${flip ? -1 : 1});
  ${clickable && 'cursor: pointer'}
`
//  ${ isOver && 'filter: drop-shadow(0 1em 1em white) drop-shadow(0 0 2em #30FF30FF);' }

