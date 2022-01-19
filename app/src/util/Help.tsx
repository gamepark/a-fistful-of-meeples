/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Picture } from '@gamepark/react-components'
import { HTMLAttributes, useState } from 'react'
import { useTranslation } from 'react-i18next'
import MeepleType from '../../../rules/src/MeepleType'
import Images from '../material/Images'
import Meeple from '../material/Meeple'
import { helpButtonWidth, helpButtonHeight } from '../util/Metrics'
import { getSize } from '../util/Styles'



export default function Help(props: HTMLAttributes<HTMLImageElement>) {
  const { t } = useTranslation()
  const [showContent, setShowContent] = useState<boolean>(false)

  const toggle = () => setShowContent(!showContent)

  return (
    <>
      <Picture {...props} src={Images.buttonHelp} onClick={toggle} css={[helpButtonStyle, getSize(helpButtonWidth, helpButtonHeight)]} />
      {showContent && <div css={popupStyle}>
        <table css={tableStyle} >
          <tr>
            <th colSpan={2}>{t('help_title')}</th>
            <th><button onClick={toggle} css={closeButtonStyle}>X</button></th>
          </tr>
          <tr>
            <td><Meeple type={MeepleType.Builder} css={getSize(2.5, 3)} /></td>
            <td>{t('help_builder')}</td>
          </tr>
          <tr>
            <td><Meeple type={MeepleType.Miner} css={getSize(2.5, 3)} /></td>
            <td>{t('help_miner')}</td>
          </tr>
          <tr>
            <td><Meeple type={MeepleType.Robber} css={getSize(2.5, 3)} /></td>
            <td>{t('help_robber')}</td>
          </tr>
          <tr>
            <td><Meeple type={MeepleType.Deputy} css={getSize(2.5, 3)} /></td>
            <td>{t('help_deputy')}</td>
          </tr>
          <tr>
            <td><Meeple type={MeepleType.Madame} css={getSize(2.5, 3)} /></td>
            <td>{t('help_madame')}</td>
          </tr>
          <tr><td colSpan={2}>{t('help_end')}</td></tr>
          <tr><td colSpan={2}>{t('help_points')}</td></tr>
        </table>
      </div>}
    </>
  )
}

const helpButtonStyle = css`
  background: none;
  border: none;
  cursor: pointer;
  &:hover {
    filter: drop-shadow(0 0 0.3em #e0c020) drop-shadow(0 0 0.3em #e0c020);
  }
`

const popupStyle = css`
  position: absolute;
  max-width: 90%;
  top: 8%;
  right: 7%;
  color: #d0d0d0;
  background-color: #000000;
  border-radius: 1em;
  border: solid 0.2em #e0c020;
  z-index: 90;
  font-family: Georgia, serif;
  font-size: 3em;
`

const closeButtonStyle = css`
  color: #e0c020;
  border-color: #e0c020;
  border-radius: 0.2em;
  background-color: #000000;
  font-size: 1em;
  cursor: pointer;
  &:hover {
    filter: drop-shadow(0 0 0.1em #e0c020) drop-shadow(0 0 0.1em #e0c020);  
  }
`
const tableStyle = css`
  width: 100%;
  height: 100%;
  padding: 1%;
`