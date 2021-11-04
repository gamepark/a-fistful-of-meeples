/** @jsxImportSource @emotion/react */
import { Picture } from '@gamepark/react-components'
import { HTMLAttributes } from 'react'
import Images from './Images'


type Props = {
  value: number
} & HTMLAttributes<HTMLImageElement>


export default function Dice({ value, ...props }: Props) {
  return <Picture {...props} src={getDiceImage(value)} />
}

function getDiceImage(value: number) {
  switch (value) {
    case 1:
      return Images.dice1
    case 2:
      return Images.dice2
    case 3:
      return Images.dice3
    case 4:
      return Images.dice4
    case 5:
      return Images.dice5
    case 6:
      return Images.dice6
    default:
      return undefined
  }
}
