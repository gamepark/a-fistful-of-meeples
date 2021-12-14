/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Picture } from '@gamepark/react-components'
import { useTranslation } from 'react-i18next'
import Images from '../material/Images'
import { dialogArea, dialogStyle, dialogTitleStyle, getSize } from './Styles'


type Props = {
  text: string
  answered: (answer: boolean) => void
}


export default function YesNoSelecter({ text, answered }: Props) {
  const { t } = useTranslation()

  return (
    <div css={dialogArea} >
      <div css={dialogStyle}>
        <div css={dialogTitleStyle}>{text}</div>
        <div css={getSize(1, 2)} />
        <div css={buttonLineStyle}>
          <button css={buttonStyle} onClick={() => answered(true)} ><Picture src={Images.buttonYes} alt={t('Yes')} /></button>
          <button css={buttonStyle} onClick={() => answered(false)} ><Picture src={Images.buttonNo} alt={t('No')} /></button>
        </div>
      </div>
    </div>
    )
}

const buttonLineStyle = css`
  display: flex;
  justify-content: space-around;
`

const buttonStyle = css`
  border: none;
  background: none;
  &:hover {
    filter: drop-shadow(0 0 1em white);
  }
`
