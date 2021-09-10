//import { isSafari } from 'react-device-detect'
import { isSafari } from 'react-device-detect'
import board from '../images/Board.jpg'
import miningBag from '../images/MiningBagWithCubes.png'
import goldBar from '../images/GoldBar.png'
import goldCube from '../images/GoldCube.png'
import stoneCube from '../images/StoneCube.png'
import dynamite from '../images/Dynamite.png'
import builder from '../images/Builder.png'
import miner from '../images/MineWorker.png'  // this one is not named "Miner.png" because some ad-blockers prevent that name from displaying !
import robber from '../images/Robber.png'
import deputy from '../images/Deputy.png'
import madame from '../images/Madame.png'
import showdownBlack from '../images/ShowdownBlack.png'
import showdownGreen from '../images/ShowdownGreen.png'
import showdownOrange from '../images/ShowdownOrange.png'
import showdownGrey from '../images/ShowdownGrey.png'
import basicBlackMarquee from '../images/BasicBlackMarquee.png'
import basicGreenMarquee from '../images/BasicGreenMarquee.png'
import basicOrangeMarquee from '../images/BasicOrangeMarquee.png'
import basicGreyMarquee from '../images/BasicGreyMarquee.png'
import upgradedBlackMarquee from '../images/UpgradedBlackMarquee.png'
import upgradedGreenMarquee from '../images/UpgradedGreenMarquee.png'
import upgradedOrangeMarquee from '../images/UpgradedOrangeMarquee.png'
import upgradedGreyMarquee from '../images/UpgradedGreyMarquee.png'
import marqueeSelecter from '../images/MarqueeSelecter.png'
import buildingSelecter from '../images/BuildingSelecter.png'
import saloonSelecter from '../images/SaloonSelecter.png'
import jailSelecter from '../images/JailSelecter.png'
import doorwaySelecter from '../images/DoorwaySelecter.png'
import showdownSelecter from '../images/ShowdownSelecter.png'
import playerBlack from '../images/Black.jpg'
import playerGreen from '../images/Green.jpg'
import playerOrange from '../images/Orange.jpg'
import playerGrey from '../images/Grey.jpg'
import phase1 from '../images/Phase1.jpg'
import phase2 from '../images/Phase2.jpg'
import phase3 from '../images/Phase3.jpg'
import phase4 from '../images/Phase4.jpg'

const Images = {
  board,
  miningBag,
  goldBar,
  goldCube,
  stoneCube,
  dynamite,
  builder,
  miner,
  robber,
  deputy,
  madame,
  showdownBlack,
  showdownGreen,
  showdownOrange,
  showdownGrey,
  basicBlackMarquee,
  basicGreenMarquee,
  basicOrangeMarquee,
  basicGreyMarquee,
  upgradedBlackMarquee,
  upgradedGreenMarquee,
  upgradedOrangeMarquee,
  upgradedGreyMarquee,
  marqueeSelecter,
  buildingSelecter,
  saloonSelecter,
  jailSelecter,
  doorwaySelecter,
  showdownSelecter,
  playerBlack,
  playerGreen,
  playerOrange,
  playerGrey,
  phase1,
  phase2,
  phase3,
  phase4,
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