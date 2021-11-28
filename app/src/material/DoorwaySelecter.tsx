/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useDrop } from 'react-dnd'
import { MEEPLE_DRAG_TYPE } from '../util/Types'
import { HTMLAttributes } from 'react'


type Props = {
  droppable: boolean
  selected: (indexInHand?: number) => void
} & HTMLAttributes<HTMLDivElement>


type DropItem = { indexInHand: number }


export default function DoorwaySelecter({ droppable, selected, ...props }: Props) {
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
    return <div {...props} ref={dropRef} css={getDoorwaySelecterStyle(false, isOver)}  />
  } else {
    return <div {...props} onClick={() => selected()} css={getDoorwaySelecterStyle(true, false)} />
  }
}

const getDoorwaySelecterStyle = (clickable: boolean, isOver: boolean) => css`
  ${clickable && 'cursor: pointer;'}
  ${isOver && 'filter: drop-shadow(0 1em 1em white) drop-shadow(0 0 2em #30FF30FF);'}
  border: 0.4em solid #30FF30FF;
  ${clickable && '&:hover { filter: drop-shadow(0 1em 1em white) drop-shadow(0 0 2em #30FF30FF); }'}
`

