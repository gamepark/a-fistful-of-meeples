/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useTranslation } from 'react-i18next'
import { useDrop } from 'react-dnd'
import Images from './Images'
import { MEEPLE_DRAG_TYPE } from '../util/Types'
import { Picture } from '@gamepark/react-components'
import { HTMLAttributes } from 'react'
import { showdownSelecterHeight, showdownSelecterWidth } from '../util/Metrics'
import { fullSizeStyle, getSize, hideWhenHoverStyle, showWhenHoverStyle } from '../util/Styles'


type Props = {
  flip: boolean
  droppable: boolean
  selected: () => void
} & HTMLAttributes<HTMLImageElement>


export default function ShowdownSelecter({ flip, droppable, selected, ...props }: Props) {
  const { t } = useTranslation()
  const [{ isOver }, dropRef] = useDrop({
    accept: MEEPLE_DRAG_TYPE,
    collect: monitor => ({
      isOver: monitor.isOver()
    }),
    drop: () => { selected() }
  })

  if (droppable) {
    return <div {...props} css={[getShowdownSelecterStyle(flip), getSize(showdownSelecterWidth, showdownSelecterHeight)]} onClick={selected} ref={dropRef}>
      <Picture src={Images.showdownSelecter} css={[fullSizeStyle, getShowdownSelecterVisibility(!isOver)]} alt={t("SelectThisShowdownPlace")} />
      <Picture src={Images.showdownSelecterHover} css={[fullSizeStyle, getShowdownSelecterVisibility(isOver)]} alt={t("SelectThisShowdownPlace")} />
    </div>
  } else {
    return <div {...props} css={[getShowdownSelecterStyle(flip), getSize(showdownSelecterWidth, showdownSelecterHeight)]} onClick={selected} >
      <Picture src={Images.showdownSelecter} css={[fullSizeStyle, hideWhenHoverStyle]} alt={t("SelectThisShowdownPlace")} />
      <Picture src={Images.showdownSelecterHover} css={[fullSizeStyle, showWhenHoverStyle]} alt={t("SelectThisShowdownPlace")} />
    </div>
  }
}

const getShowdownSelecterStyle = (flip: boolean) => css`
  transform: scaleX(${flip ? -1 : 1});
  cursor: pointer;
`

const getShowdownSelecterVisibility = (visible: boolean) => css`
  opacity: ${visible ? 1 : 0};
  &:hover {
    opacity: ${visible ? 0 : 1};
  }
`

