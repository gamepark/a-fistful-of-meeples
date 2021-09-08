/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useTranslation } from 'react-i18next'
import { useDrop } from 'react-dnd'
import { showdownSelecterHeight, showdownSelecterWidth } from '../util/Metrics'
import Images from './Images'
import { MEEPLE_DRAG_TYPE } from '../util/Types'
import MeepleType from '../../../rules/src/MeepleType'


type Props = {
  position: Array<number>
  flip: boolean
  selected: (meeple:MeepleType) => void
}

type DropItem = { meeple: MeepleType }


export default function ShowdownSelecter(props: Props) {
  const { t } = useTranslation()

  const [{ isOver }, dropRef] = useDrop({
    accept: MEEPLE_DRAG_TYPE,
    collect: monitor => ({
      isOver: monitor.isOver()
    }),
    drop: (item: DropItem) => {
      props.selected(item.meeple)
    }
  })
  
  return (
    <img ref={dropRef} src={Images.showdownSelecter} css={getShowdownSelecterStyle(props.position[0], props.position[1], props.flip, isOver)} alt={t("SelectThisShodownPlace")} />
  )
}

const getShowdownSelecterStyle = (left: number, top: number, flip: boolean, isOver: boolean) => css`
  position: absolute;
  left: ${left}%;
  top: ${top}%;
  width: ${showdownSelecterWidth}%;
  height: ${showdownSelecterHeight}%;
  transform: scaleX(${flip ? -1 : 1});
  ${isOver && 'filter: drop-shadow(0 1em 1em black) drop-shadow(0 0 1em red)'}
`

