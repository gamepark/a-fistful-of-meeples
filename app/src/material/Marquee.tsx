/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Picture } from '@gamepark/react-components'
import { useTranslation } from 'react-i18next'
import PlayerColor from '../../../rules/src/PlayerColor'
import { marqueeHeight, marqueeWidth } from '../util/Metrics'
import Images from './Images'


type Props = {
  position: Array<number>
  owner: PlayerColor
  upgraded: boolean
  flip: boolean
}


export default function Marquee(props: Props) {
  const { t } = useTranslation()

  return (
    <Picture src={getMarqueeImage(props.owner, props.upgraded)} css={getMarqueeStyle(props.position[0], props.position[1], props.flip)} alt={t(getMarqueeName(props.owner, props.upgraded))} />
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

const getMarqueeStyle = (left: number, top: number, flip: boolean) => css`
  position: absolute;
  left: ${left}%;
  top: ${top}%;
  width: ${marqueeWidth}%;
  height: ${marqueeHeight}%;
  ${flip ? 'transform: rotate(180deg);' : ''}
`


