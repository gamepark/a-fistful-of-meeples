/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { phaseWidth, phaseHeight } from '../util/Metrics'
import Images from './Images'
import GameState from '../../../rules/src/GameState'
import Phase from '../../../rules/src/Phase'


type Props = {
  phase: Phase
  gameState: GameState
  left: number
  top: number
}


export default function PhaseIndicator(props: Props) {
  return (
    <div css={getPhaseStyle(props.left, props.top, props.phase, props.gameState.currentPhase === props.phase)} >
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
      return undefined
  }
}


const getPhaseStyle = (left: number, top: number, phase: Phase, isActive: boolean) => css`
  background-image: url(${getPhaseImage(phase)});
  background-color: #00000000;
  background-size: cover;
  position: absolute;
  left: ${left}%;
  top: ${top}%;
  width: ${phaseWidth}%;
  height: ${phaseHeight}%;
  ${isActive && 'filter: drop-shadow(0 0.2em 0.2em black) drop-shadow(0 0 0.2em red)'}
`

