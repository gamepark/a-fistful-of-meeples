/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useTranslation } from 'react-i18next'
import { goldBarHeight, goldBarWidth } from '../util/Styles'
import Images from './Images'


type Props = {
  position: Array<number>
}


export default function GoldBar(props: Props) {
  const { t } = useTranslation()

  return (
    <img src={Images.goldBar} css={getGoldBarStyle(props.position[0], props.position[1]) } alt = { t('GoldBar') } />
  )
}


const getGoldBarStyle = (left: number, top: number) => css`
  position: absolute;
  left: ${left}%;
  top: ${top}%;
  width: ${goldBarWidth}%;
  height: ${goldBarHeight}%;
`

