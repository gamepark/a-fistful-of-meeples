/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useTranslation } from 'react-i18next'
import { useDrop } from 'react-dnd'
import { showdownSelecterHeight, showdownSelecterWidth } from '../util/Metrics'
import Images from './Images'
import { MEEPLE_DRAG_TYPE } from '../util/Types'
import MeepleType from '../../../rules/src/MeepleType'
import { Picture } from '@gamepark/react-components'


type Props = {
  position: Array<number>
  flip: boolean
  droppable: boolean
  selected: (meeple?:MeepleType) => void
}

type DropItem = { meeple: MeepleType }


export default function ShowdownSelecter(props: Props) {
  const { t } = useTranslation()

  if (props.droppable) {
    const [{ isOver }, dropRef] = useDrop({
      accept: MEEPLE_DRAG_TYPE,
      collect: monitor => ({
        isOver: monitor.isOver()
      }),
      drop: (item: DropItem) => {
        props.selected(item.meeple)
      }
    })

    return <Picture ref={dropRef} src={Images.showdownSelecter} css={getShowdownSelecterStyle(props.position[0], props.position[1], props.flip, false, isOver)} alt={t("SelectThisShodownPlace")} />
  } else {
    return <Picture onClick={() => props.selected()} src={Images.showdownSelecter} css={getShowdownSelecterStyle(props.position[0], props.position[1], props.flip, true, false)} alt={t("SelectThisShodownPlace")} />
  }
}

const getShowdownSelecterStyle = (left: number, top: number, flip: boolean, clickable: boolean, isOver: boolean) => css`
  position: absolute;
  left: ${left}%;
  top: ${top}%;
  width: ${showdownSelecterWidth}%;
  height: ${showdownSelecterHeight}%;
  transform: scaleX(${flip ? -1 : 1});
  ${clickable && 'cursor: pointer'}
  ${isOver && 'filter: drop-shadow(0 1em 1em black) drop-shadow(0 0 1em red)'}
`

