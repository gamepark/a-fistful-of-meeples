/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useDrop } from 'react-dnd'
import { MEEPLE_DRAG_TYPE } from '../util/Types'
import { HTMLAttributes } from 'react'
import { selecterStyle } from '../util/Styles'


type Props = {
  droppable: boolean
  selected: () => void
} & HTMLAttributes<HTMLDivElement>


export default function DoorwaySelecter({ droppable, selected, ...props }: Props) {
  const [{ isOver }, dropRef] = useDrop({
    accept: MEEPLE_DRAG_TYPE,
    collect: monitor => ({
      isOver: monitor.isOver()
    }),
    drop: () => { selected() }
  })

  if (droppable) {
    return <div {...props} onClick={() => selected()} ref={dropRef} css={[selecterStyle, getDoorwaySelecterStyle(isOver)]}  />
  } else {
    return <div {...props} onClick={() => selected()} css={selecterStyle} />
  }
}

const getDoorwaySelecterStyle = (isOver: boolean) => css`
  ${isOver && 'background-color: #29db0680;'}
`

