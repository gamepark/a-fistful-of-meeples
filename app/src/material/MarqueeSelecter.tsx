/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Picture } from '@gamepark/react-components'
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
    <Picture src={Images.marqueeSelecter} onClick={onSelectMarquee} css={getMarqueeSelecterStyle(props.position[0], props.position[1], props.flip)} alt={t("SelectThisMarqueePlace")} />
  )
}

const getMarqueeSelecterStyle = (left: number, top: number, flip: boolean) => css`
  position: absolute;
  left: ${left}em;
  top: ${top}em;
  width: ${marqueeWidth}em;
  height: ${marqueeHeight}em;
  cursor: pointer;
  transform: scaleY(${flip ? -1 : 1});
  &:hover {
    filter: drop-shadow(0 1em 1em white) drop-shadow(0 0 2em #30FF30FF);
  }
`

