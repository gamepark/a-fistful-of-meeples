/** @jsxImportSource @emotion/react */
import { Picture } from '@gamepark/react-components'
import { HTMLAttributes } from 'react'
import { useTranslation } from 'react-i18next'
import PlayerColor from '../../../rules/src/PlayerColor'
import Images from './Images'


type Props = {
  owner: PlayerColor
  upgraded: boolean
} & HTMLAttributes<HTMLImageElement>


export default function Marquee({ owner, upgraded, ...props }: Props) {
  const { t } = useTranslation()

  return (
    <Picture {...props} src={getMarqueeImage(owner, upgraded)} alt={t(getMarqueeName(owner, upgraded))} />
  )
}

const getMarqueeName = (owner: PlayerColor, upgraded: boolean) => {
  switch (owner) {
    case PlayerColor.Black:
      return upgraded ? 'UpgradedBlackMarquee' : 'BasicBlackMarquee'
    case PlayerColor.Green:
      return upgraded ? 'UpgradedGreenMarquee' : 'BasicGreenMarquee'
    case PlayerColor.Orange:
      return upgraded ? 'UpgradedOrangeMarquee' : 'BasicOrangeMarquee'
    case PlayerColor.Grey:
      return upgraded ? 'UpgradedGreyMarquee' : 'BasicGreyMarquee'
    default:
      return ''
  }
}

const getMarqueeImage = (owner: PlayerColor, upgraded: boolean) => {
  switch (owner) {
    case PlayerColor.Black:
      return upgraded ? Images.upgradedBlackMarquee : Images.basicBlackMarquee
    case PlayerColor.Green:
      return upgraded ? Images.upgradedGreenMarquee : Images.basicGreenMarquee
    case PlayerColor.Orange:
      return upgraded ? Images.upgradedOrangeMarquee : Images.basicOrangeMarquee
    case PlayerColor.Grey:
      return upgraded ? Images.upgradedGreyMarquee : Images.basicGreyMarquee
    default:
      return undefined
  }
}
