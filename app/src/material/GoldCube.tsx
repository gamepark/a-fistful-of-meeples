/** @jsxImportSource @emotion/react */
import { SerializedStyles } from '@emotion/utils'
import { Picture } from '@gamepark/react-components'
import { useTranslation } from 'react-i18next'
import Images from './Images'

type Props = {
  style: SerializedStyles
}

export default function GoldeCube(props: Props) {
  const { t } = useTranslation()

  return (
    <Picture src={Images.goldCube} alt={t('GoldCube')} css={props.style} />
  )
}
