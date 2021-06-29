//import { isSafari } from 'react-device-detect'
import { isSafari } from 'react-device-detect'
import board from '../images/Board.jpg'
import miningBag from '../images/MiningBagWithCubes.png'
import goldBar from '../images/GoldBar.png'
import dynamite from '../images/Dynamite.png'
import builder from '../images/Builder.png'
import miner from '../images/MineWorker.png'  // this one is not named "Miner.png" because some ad-blockers prevent that name from displaying !
import robber from '../images/Robber.png'
import deputy from '../images/Deputy.png'
import madame from '../images/Madame.png'

const Images = {
  board,
  miningBag,
  goldBar,
  dynamite,
  builder,
  miner,
  robber,
  deputy,
  madame
}

if (!isSafari) {
  for (const image in Images) {
    const match = Images[image].match(/(.*)\.(jpg|png)$/)
    if (match) {
      Images[image] = match[1] + '.webp'
    }
  }
}

export default Images