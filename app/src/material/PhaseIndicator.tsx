/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import Images from './Images'
import Phase from '../../../rules/src/Phase'
import { HTMLAttributes } from 'react'
import { Picture } from '@gamepark/react-components'
import { useTranslation } from 'react-i18next'


type Props = {
  phase: Phase
  currentPhase: Phase
  animationDuration?: number
} & HTMLAttributes<HTMLDivElement>


export default function PhaseIndicator({ phase, currentPhase, animationDuration, ...props }: Props) {
  const { t } = useTranslation()

  return (
      <Picture {...props} src={getPhaseImage(phase)} draggable={false} css={getPhaseStyle(currentPhase === phase, animationDuration ?? 0)} alt={t(getPhaseName(phase))} />
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


const getPhaseStyle = (visible: boolean, animationDuration: number) => css`
  background-image: url(${Images.phase});
  background-color: #00000000;
  background-size: cover;
  border: 0.4em solid black;
  opacity: ${visible ? 1 : 0};
  transition: opacity ${animationDuration}s;
`
