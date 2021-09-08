/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useTranslation } from 'react-i18next'
import { marqueeHeight, marqueeWidth } from '../util/Metrics'
import Images from './Images'


type Props = {
  position: Array<number>
  flip: boolean
  selected: () => void
}


export default function MarqueeSelecter(props: Props) {
  const { t } = useTranslation()

  const onSelectMarquee = () => {
    props.selected()
  };

  return (
    <img src={Images.marqueeSelecter} onClick={onSelectMarquee} css={getMarqueeSelecterStyle(props.position[0], props.position[1], props.flip)} alt={t("SelectThisMarqueePlace")} />
  )
}

const getMarqueeSelecterStyle = (left: number, top: number, flip: boolean) => css`
  position: absolute;
  left: ${left}%;
  top: ${top}%;
  width: ${marqueeWidth}%;
  height: ${marqueeHeight}%;
  cursor: pointer;
  transform: scaleY(${flip ? -1 : 1});
`

