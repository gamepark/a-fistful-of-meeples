/** @jsxImportSource @emotion/react */
import { css, Global } from '@emotion/react'
import GameState from '@gamepark/a-fistful-of-meeples/GameState'
import {FailuresDialog, FullscreenDialog, Menu, useGame, usePlayer} from '@gamepark/react-client'
import {Header, ImagesLoader, LoadingScreen} from '@gamepark/react-components'
import {useEffect, useState} from 'react'
import {DndProvider} from 'react-dnd-multi-backend'
import HTML5ToTouch from 'react-dnd-multi-backend/dist/cjs/HTML5toTouch'
import PlayerColor from '../../rules/src/PlayerColor'
import GameDisplay from './GameDisplay'
import HeaderText from './HeaderText'
import Cover from './images/Cover.jpg'
import Images from './material/Images'

export default function App() {
  const game = useGame<GameState>()
  const player = usePlayer<PlayerColor>()
  const [isJustDisplayed, setJustDisplayed] = useState(true)
  const [imagesLoading, setImagesLoading] = useState(true)
  useEffect(() => {
    setTimeout(() => setJustDisplayed(false), 2000)
  }, [])
  const loading = !game || imagesLoading || isJustDisplayed
  return (
    <DndProvider options={HTML5ToTouch}>
      <Global styles={globalStyle} />
      {game && <GameDisplay game={game}/>}
      <LoadingScreen display={loading} gameBox={Cover} author="Jonathan “Jonny Pac” Cantin" artist="Mihajlo Dimitrievski – The Mico" publisher="Final Frontier Games" developer="Jagrin" />
      <Header><HeaderText loading={loading} game={game} player={player?.id} /></Header>
      <Menu/>
      <FailuresDialog/>
      <FullscreenDialog />
      <ImagesLoader images={Object.values(Images)} onImagesLoad={() => setImagesLoading(false)} />
    </DndProvider>
  )
}


const globalStyle = css`
  html {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  *, *::before, *::after {
    -webkit-box-sizing: inherit;
    -moz-box-sizing: inherit;
    box-sizing: inherit;
  }

  body {
    margin: 0;
    font-family: 'Oswald', "Roboto Light", serif;
    font-size: 1vh;
    @media (max-aspect-ratio: 16/9) {
      font-size: calc(9vw / 16);
    }
  }

  #root {
    position: absolute;
    height: 100vh;
    width: 100vw;
    user-select: none;
    overflow: hidden;
    background-color: white;
    background-size: cover;
    background-position: center;

    &:before {
      content: '';
      display: block;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.7);
    }
  }
`

