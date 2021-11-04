/** @jsxImportSource @emotion/react */
import { Picture } from '@gamepark/react-components'
import { HTMLAttributes } from 'react'
import { useTranslation } from 'react-i18next'
import Images from './Images'



export default function Dynamite(props: HTMLAttributes<HTMLImageElement>) {
  const { t } = useTranslation()

  return (
    <Picture {...props} src={Images.dynamite} alt={t('Dynamite')} />
  )
}

