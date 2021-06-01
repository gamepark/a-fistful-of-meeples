/** @jsxImportSource @emotion/react */
import GameState from '@gamepark/a-fistful-of-meeples/GameState'
import {useTranslation} from 'react-i18next'

type Props = {
  loading: boolean
  game?: GameState
}

export default function HeaderText({loading, game}: Props) {
  const {t} = useTranslation()
  if (loading) return <>{t('Game loading...')}</>
  return <>Loaded! Now what? Your player id is {game?.players[0].color}</>
}