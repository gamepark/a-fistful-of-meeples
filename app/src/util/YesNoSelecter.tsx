/** @jsxImportSource @emotion/react */
//import { css } from '@emotion/react'
import { css } from '@emotion/react'
import { Dialog, Picture } from '@gamepark/react-components'
import { useTranslation } from 'react-i18next'
import Images from '../material/Images'


type Props = {
  text: string
  answered: (answer: boolean) => void
}


export default function YesNoSelecter({ text, answered, ...props }: Props) {
  const { t } = useTranslation()

  return (
    <Dialog open={true} css={dialogStyle} {...props} >
      <h3>{text}</h3>
      <p css={buttonLineStyle}>
        <button css={buttonStyle} onClick={() => answered(true)} ><Picture src={Images.buttonYes} alt={t('Yes')} /></button>
        <button css={buttonStyle} onClick={() => answered(false)} ><Picture src={Images.buttonNo} alt={t('No')} /></button>
      </p>
    </Dialog>

    )
}

const dialogStyle = css`
  border-color: lightgreen;
  background: black;
  color: white;
`
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
