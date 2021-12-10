/** @jsxImportSource @emotion/react */
import {css, Global} from '@emotion/react'
import AFistfulOfMeeples from '@gamepark/a-fistful-of-meeples/AFistfulOfMeeples'
import {AFistfulOfMeeplesOptionsSpec} from '@gamepark/a-fistful-of-meeples/AFistfulOfMeeplesOptions'
import {GameProvider, setupTranslation} from '@gamepark/react-client'
import {StrictMode} from 'react'
import ReactDOM from 'react-dom'
import AFistfulOfMeeplesView from './AFistfulOfMeeplesView'
import AFistfulOfMeeplesAnimations from './Animations'
import App from './App'
import translations from './translations.json'

setupTranslation(translations, {debug: false})

const style = css`
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
    @media (max-aspect-ratio: 185/100) {
      font-size: ${100 / 185}vw;
    }
  }

  #root {
    position: absolute;
    height: 100vh;
    width: 100vw;
    user-select: none;
    overflow: hidden;
    background-image: url(${process.env.PUBLIC_URL + '/cover-1920.jpg'});
    background-color: white;
    background-size: cover;
    background-position: center;
    color: #eee;

    &:before {
      content: '';
      display: block;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.8);
    }
  }
`

ReactDOM.render(
  <StrictMode>
    <GameProvider game="a-fistful-of-meeples" Rules={AFistfulOfMeeples} RulesView={AFistfulOfMeeplesView} optionsSpec={AFistfulOfMeeplesOptionsSpec}
                  animations={AFistfulOfMeeplesAnimations}>
      <App/>
    </GameProvider>
    <Global styles={style}/>
  </StrictMode>,
  document.getElementById('root')
)
