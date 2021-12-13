/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { HTMLAttributes } from 'react'


type Props = {
  selected: () => void
} & HTMLAttributes<HTMLDivElement>


export default function GenericSelecter({ selected, ...props }: Props) {
  const onSelect = () => {
    selected()
  };

  return (
    <div {...props} onClick={onSelect} css={genericSelecterStyle} />
  )
}

const genericSelecterStyle = css`
  cursor: pointer;
  background-color: #FFFFFF20;
  border: 0.4em solid #30FF30FF;
  &:hover {
    background-color: #29db0680;
  }
`

