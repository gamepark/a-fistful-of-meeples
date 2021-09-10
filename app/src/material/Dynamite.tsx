/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Picture } from '@gamepark/react-components'
import { useTranslation } from 'react-i18next'
import { dynamiteHeight, dynamiteWidth } from '../util/Metrics'
import Images from './Images'


type Props = {
  position: Array<number>
}


export default function Dynamite(props: Props) {
  const { t } = useTranslation()

  return (
    <Picture src={Images.dynamite} css={getDynamiteStyle(props.position[0], props.position[1])} alt={t('Dynamite')} />
  )
}


const getDynamiteStyle = (left: number, top: number) => css`
  position: absolute;
  left: ${left}%;
  top: ${top}%;
  width: ${dynamiteWidth}%;
  height: ${dynamiteHeight}%;
`

