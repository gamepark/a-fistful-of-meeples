/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import Images from './Images'
import GameState from '../../../rules/src/GameState'
import Phase from '../../../rules/src/Phase'
import { HTMLAttributes } from 'react'
import { Picture } from '@gamepark/react-components'
import { useTranslation } from 'react-i18next'


type Props = {
  phase: Phase
  gameState: GameState
} & HTMLAttributes<HTMLDivElement>


export default function PhaseIndicator(props: Props) {
  const { t } = useTranslation()

  return (
    <div {...props} css={getPhaseStyle(props.gameState.currentPhase === props.phase)} >
      <Picture src={getPhaseImage(props.phase)} draggable={false} css={getInnerPhaseStyle} alt={t(getPhaseName(props.phase))} />
    </div>
  )
}

const getPhaseImage = (phase: Phase) => {
  switch (phase) {
    case Phase.SelectSourceLocation:
      return Images.phase1
    case Phase.PlaceMeeples:
      return Images.phase2
    case Phase.ResolveMeeples:
      return Images.phase3
    case Phase.CheckGoldBars:
      return Images.phase4
    default:
      return ''
  }
}

const getPhaseName = (phase: Phase) => {
  switch (phase) {
    case Phase.SelectSourceLocation:
      return 'Select source location'
    case Phase.PlaceMeeples:
      return 'Place meeples'
    case Phase.ResolveMeeples:
      return 'Resolve meeples'
    case Phase.CheckGoldBars:
      return 'Check gold bars'
    default:
      return ''
  }
}


const getPhaseStyle = (isActive: boolean) => css`
  background-image: url(${isActive ? Images.phaseActive : Images.phase});
  background-color: #00000000;
  background-size: cover;
`

const getInnerPhaseStyle = css`
  width: 100%;
  height: 100%;
`
