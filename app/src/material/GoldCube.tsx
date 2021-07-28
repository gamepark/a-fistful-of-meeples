/** @jsxImportSource @emotion/react */
import { SerializedStyles } from '@emotion/utils'
import { useTranslation } from 'react-i18next'
import Images from './Images'

type Props = {
  style: SerializedStyles
}

export default function GoldeCube(props: Props) {
  const { t } = useTranslation()

  return (
    <img src={Images.goldCube} alt={t('GoldCube')} css={props.style} />
  )
}
