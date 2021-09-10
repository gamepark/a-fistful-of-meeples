/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Picture } from '@gamepark/react-components'
import { useTranslation } from 'react-i18next'
import { saloonSelecterWidth, saloonSelecterHeight } from '../util/Metrics'
import Images from './Images'


type Props = {
  position: Array<number>
  selected: () => void
}


export default function SaloonSelecter(props: Props) {
  const { t } = useTranslation()

  const onSelectBuilding = () => {
    props.selected()
  };

  return (
    <Picture src={Images.buildingSelecter} onClick={onSelectBuilding} css={getBuildingSelecterStyle(props.position[0], props.position[1])} alt={t("SelectSaloon")} />
  )
}

const getBuildingSelecterStyle = (left: number, top: number) => css`
  position: absolute;
  left: ${left}%;
  top: ${top}%;
  width: ${saloonSelecterWidth}%;
  height: ${saloonSelecterHeight}%;
  cursor: pointer;
`

