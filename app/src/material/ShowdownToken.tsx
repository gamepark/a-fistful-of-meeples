/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Picture } from '@gamepark/react-components'
import { useTranslation } from 'react-i18next'
import PlayerColor from '../../../rules/src/PlayerColor'
import { showdownTokenHeight, showdownTokenWidth } from '../util/Metrics'
import Images from './Images'


type Props = {
  position: Array<number>
  color: PlayerColor
}


export default function Meeple(props: Props) {
  const { t } = useTranslation()

  return (
    <Picture src={getShowdownTokenImage(props.color)} css={getShowdownTokenStyle(props.position[0], props.position[1])} alt={t(getShowdownTokenName(props.color))} />
  )
}

const getShowdownTokenName = (color: PlayerColor) => {
  switch (color) {
    case PlayerColor.Black:
      return 'BlackShowdownToken'
    case PlayerColor.Green:
      return 'GreenShowdownToken'
    case PlayerColor.Orange:
      return 'OrangeShowdownToken'
    case PlayerColor.Grey:
      return 'GreyShowdownToken'
    default:
      return ''
  }
}

const getShowdownTokenImage = (color: PlayerColor) => {
  switch (color) {
    case PlayerColor.Black:
      return Images.showdownBlack
    case PlayerColor.Green:
      return Images.showdownGreen
    case PlayerColor.Orange:
      return Images.showdownOrange
    case PlayerColor.Grey:
      return Images.showdownGrey
    default:
      return undefined
  }
}

const getShowdownTokenStyle = (left: number, top: number) => css`
  position: absolute;
  left: ${left}%;
  top: ${top}%;
  width: ${showdownTokenWidth}%;
  height: ${showdownTokenHeight}%;
`

