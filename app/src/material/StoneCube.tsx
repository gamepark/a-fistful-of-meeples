/** @jsxImportSource @emotion/react */
import { Picture } from '@gamepark/react-components'
import { HTMLAttributes } from 'react'
import { useTranslation } from 'react-i18next'
import { darkOutlineStyle } from '../util/Styles'
import Images from './Images'


export default function StoneCube(props: HTMLAttributes<HTMLDivElement>) {
  const { t } = useTranslation()

  return (
    <Picture {...props} css={darkOutlineStyle} src={Images.stoneCube} alt={t('StoneCube')} />
  )
}
