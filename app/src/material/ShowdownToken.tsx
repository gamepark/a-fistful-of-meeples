/** @jsxImportSource @emotion/react */
import { Picture } from '@gamepark/react-components'
import { TFunction } from 'i18next'
import { HTMLAttributes } from 'react'
import { useTranslation } from 'react-i18next'
import PlayerColor from '../../../rules/src/PlayerColor'
import Images from './Images'


type Props = {
  playercolor: PlayerColor
} & HTMLAttributes<HTMLPictureElement>


export default function ShowdownToken(props: Props) {
  const { t } = useTranslation()

  return (
    <Picture src={getShowdownTokenImage(props.playercolor)} alt={getShowdownTokenName(props.playercolor, t)} {...props} />
  )
}

const getShowdownTokenName = (color: PlayerColor, t: TFunction):string => {
  switch (color) {
    case PlayerColor.Black:
      return t('BlackShowdownToken')
    case PlayerColor.Green:
      return t('GreenShowdownToken')
    case PlayerColor.Orange:
      return t('OrangeShowdownToken')
    case PlayerColor.Grey:
      return t('GreyShowdownToken')
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

