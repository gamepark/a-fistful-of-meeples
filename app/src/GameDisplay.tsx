/** @jsxImportSource @emotion/react */
import {css, keyframes} from '@emotion/react'
import GameState from '@gamepark/a-fistful-of-meeples/GameState'
import { usePlayerId } from '@gamepark/react-client'
import {Letterbox} from '@gamepark/react-components'
import PlayerColor from '../../rules/src/PlayerColor'
import Board from './material/Board'

type Props = {
  game: GameState
}

export default function GameDisplay({ game }: Props) {
  const playerColor = usePlayerId<PlayerColor>()

  return (
    <Letterbox css={letterBoxStyle} top={0}>
      <Board game={game} player={playerColor} />
    </Letterbox>
  )
}


const fadeIn = keyframes`
  from, 50% {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

const letterBoxStyle = css`
  animation: ${fadeIn} 3s ease-in forwards;
`

