import AFistfulOfMeeples from '@gamepark/a-fistful-of-meeples/AFistfulOfMeeples'
import {AFistfulOfMeeplesOptionsDescription} from '@gamepark/a-fistful-of-meeples/AFistfulOfMeeplesOptions'
import {GameProvider, setupTranslation} from '@gamepark/react-client'
import {StrictMode} from 'react'
import ReactDOM from 'react-dom'
import AFistfulOfMeeplesView from './AFistfulOfMeeplesView'
import AFistfulOfMeeplesAnimations from './Animations'
import App from './App'
import translations from './translations.json'

setupTranslation(translations, { debug: false })

ReactDOM.render(
  <StrictMode>
    <GameProvider game="a-fistful-of-meeples" Rules={AFistfulOfMeeples} RulesView={AFistfulOfMeeplesView} optionsSpec={AFistfulOfMeeplesOptionsDescription}
      animations={AFistfulOfMeeplesAnimations}    >
      <App/>
    </GameProvider>
  </StrictMode>,
  document.getElementById('root')
)
