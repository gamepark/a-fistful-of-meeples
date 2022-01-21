/** @jsxImportSource @emotion/react */
import { Picture } from '@gamepark/react-components'
import { HTMLAttributes } from 'react'
import { useTranslation } from 'react-i18next'
import { getZIndex, lightOutlineStyle } from '../util/Styles'
import Images from './Images'



export default function Dynamite(props: HTMLAttributes<HTMLImageElement>) {
  const { t } = useTranslation()

  return (
    <Picture {...props} css={[getZIndex(10), lightOutlineStyle]} src={Images.dynamite} alt={t('Dynamite')} />
  )
}

