/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useTranslation } from 'react-i18next'
import { useDrop } from 'react-dnd'
import { doorwayHeight, doorwayWidth, doorwaySelecterDeltaX, doorwaySelecterDeltaY } from '../util/Metrics'
import Images from './Images'
import { MEEPLE_DRAG_TYPE } from '../util/Types'
import MeepleType from '../../../rules/src/MeepleType'
import { Picture } from '@gamepark/react-components'


type Props = {
  position: Array<number>
  droppable: boolean
  selected: (meeple?: MeepleType) => void
}

type DropItem = { meeple: MeepleType }


export default function DoorwaySelecter(props: Props) {
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

    return <Picture ref={dropRef} src={Images.doorwaySelecter} css={getDoorwaySelecterStyle(props.position[0], props.position[1], false, isOver)} alt={t("SelectThisDoorway")} />
  } else {
    return <img src={Images.doorwaySelecter} onClick={() => props.selected()} css={getDoorwaySelecterStyle(props.position[0], props.position[1], true, false)} alt={t("SelectThisDoorway")} />
  }
}

const getDoorwaySelecterStyle = (left: number, top: number, clickable: boolean, isOver: boolean) => css`
  position: absolute;
  left: ${left + doorwaySelecterDeltaX}%;
  top: ${top + doorwaySelecterDeltaY}%;
  width: ${doorwayWidth}%;
  height: ${doorwayHeight}%;
  ${clickable && 'cursor: pointer'}
  ${isOver && 'filter: drop-shadow(0 1em 1em black) drop-shadow(0 0 1em red)'}
`

