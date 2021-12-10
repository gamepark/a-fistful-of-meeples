/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Picture } from '@gamepark/react-components'
import { HTMLAttributes } from 'react'
import { useTranslation } from 'react-i18next'
import { marqueeHeight, marqueeWidth } from '../util/Metrics'
import { fullSizeStyle, getSize, hideWhenHoverStyle, showWhenHoverStyle } from '../util/Styles'
import Images from './Images'


type Props = {
  flip: boolean
  selected: () => void
} & HTMLAttributes<HTMLDivElement>


export default function MarqueeSelecter({ flip, selected, ...props }: Props) {
  const { t } = useTranslation()

  const onSelectMarquee = () => {
    selected()
  };

  return (
    <div {...props} css={[getMarqueeSelecterStyle(flip), getSize(marqueeWidth, marqueeHeight)]} onClick={onSelectMarquee} >
      <Picture src={Images.marqueeSelecter} css={[fullSizeStyle, hideWhenHoverStyle]} alt={t("SelectThisMarqueePlace")} />
      <Picture src={Images.marqueeSelecterHover} css={[fullSizeStyle, showWhenHoverStyle] } alt={t("SelectThisMarqueePlace")} />
    </div>
  )
}

const getMarqueeSelecterStyle = (flip: boolean) => css`
  cursor: pointer;
  transform: scaleY(${flip ? -1 : 1});
`

