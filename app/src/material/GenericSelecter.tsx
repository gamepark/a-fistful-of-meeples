/** @jsxImportSource @emotion/react */
import { HTMLAttributes } from 'react'
import { selecterStyle } from '../util/Styles';


type Props = {
  selected: () => void
} & HTMLAttributes<HTMLDivElement>


export default function GenericSelecter({ selected, ...props }: Props) {
  const onSelect = () => {
    selected()
  };

  return (
    <div {...props} onClick={onSelect} css={selecterStyle} />
  )
}

