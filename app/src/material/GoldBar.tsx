/** @jsxImportSource @emotion/react */
import { SerializedStyles } from '@emotion/react'
import { Picture } from '@gamepark/react-components'
import { useTranslation } from 'react-i18next'
import Images from './Images'


type Props = {
  style: SerializedStyles
}


export default function GoldBar(props: Props) {
  const { t } = useTranslation()

  return (
    <Picture src={Images.goldBar} css={props.style} alt={t('GoldBar')} />
  )
}

