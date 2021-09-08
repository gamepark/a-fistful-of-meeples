/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useTranslation } from 'react-i18next'
import { buildingHeight, buildingWidth, buildingSelecterDeltaX, buildingSelecterDeltaY } from '../util/Metrics'
import Images from './Images'


type Props = {
  position: Array<number>
  selected: () => void
}


export default function BuildingSelecter(props: Props) {
  const { t } = useTranslation()

  const onSelectMarquee = () => {
    props.selected()
  };

  return (
    <img src={Images.buildingSelecter} onClick={onSelectMarquee} css={getBuildingSelecterStyle(props.position[0], props.position[1])} alt={t("SelectThisBuilding")} />
  )
}

const getBuildingSelecterStyle = (left: number, top: number) => css`
  position: absolute;
  left: ${left + buildingSelecterDeltaX}%;
  top: ${top + buildingSelecterDeltaY}%;
  width: ${buildingWidth}%;
  height: ${buildingHeight}%;
  cursor: pointer;
`

