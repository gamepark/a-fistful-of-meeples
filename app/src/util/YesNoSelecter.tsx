/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useTranslation } from 'react-i18next'


type Props = {
  text: string
  answered: (answer: boolean) => void
}


export default function YesNoSelecter(props: Props) {
  const { t } = useTranslation()

  return (
    <table css={popupStyle}>
      <tbody>
        <tr><td colSpan={2}>{props.text}</td></tr>
        <tr>
          <td><button onClick={() => props.answered(true)} > { t('Yes') }</button></td>
          <td><button onClick={() => props.answered(false)} > {t('No')}</button></td>
        </tr>
      </tbody>
    </table>
    )
}

const popupStyle = css`
  position: absolute;
  left: 40%;
  top: 35%;
  width: 10%;
  height: 15%;
  padding: 1em;
  background-color: #6a2e12;
  border-radius: 2em;
  border-style: solid;
  border-color: black;
  text-align: center;
  font-family: 'Oswald', "Roboto Light", serif;
  font-size: 1.5em;
`
