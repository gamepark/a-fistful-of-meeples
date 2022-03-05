/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import GameState from '@gamepark/a-fistful-of-meeples/GameState'
import {FailuresDialog, FullscreenDialog, Menu, useGame, usePlayer} from '@gamepark/react-client'
import {Header, ImagesLoader, LoadingScreen} from '@gamepark/react-components'
import {useEffect, useState} from 'react'
import {DndProvider} from 'react-dnd-multi-backend'
import HTML5ToTouch from 'react-dnd-multi-backend/dist/cjs/HTML5toTouch'
import PlayerColor from '../../rules/src/PlayerColor'
import GameDisplay from './GameDisplay'
import HeaderText from './HeaderText'
import Images from './material/Images'
import { SoundLoader } from './sounds/SoundLoader'
import { AudioLoader } from './sounds/AudioLoader'
import { AllAFistfulOfMeeplesSoundsSounds } from './sounds/AFistfulOfMeeplesSounds'

export default function App() {
  const game = useGame<GameState>()
  const player = usePlayer<PlayerColor>()
  const [isJustDisplayed, setJustDisplayed] = useState(true)
  const [imagesLoading, setImagesLoading] = useState(true)
  const [audioLoader, setAudioLoader] = useState<AudioLoader>()
  const [isSoundsLoading, setSoundLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => setJustDisplayed(false), 2000)
  }, [])
  const loading = !game || imagesLoading || isJustDisplayed || isSoundsLoading
  return (
    <DndProvider options={HTML5ToTouch}>
      {!loading && game && audioLoader && <GameDisplay game={game} audioLoader={audioLoader}/>}
      <LoadingScreen css={loadingScreenStyle} display={loading} author="Jonathan “Jonny Pac” Cantin" artist="Mihajlo Dimitrievski – The Mico" publisher="Final Frontier Games" developer="Jagrin" />
      <Header><HeaderText loading={loading} game={game} player={player?.id} /></Header>
      <SoundLoader sounds={AllAFistfulOfMeeplesSoundsSounds} onSoundLoad={() => setSoundLoading(false)} onSoundsPrepared={(audioLoader) => setAudioLoader(audioLoader)} />
      <Menu />
      <FailuresDialog/>
      <FullscreenDialog />
      <ImagesLoader images={Object.values(Images)} onImagesLoad={() => setImagesLoading(false)} />
    </DndProvider>
  )
}

const loadingScreenStyle = css`
  font-family: 'Rye', "Roboto Light", serif;
  font-weight: normal;
`
