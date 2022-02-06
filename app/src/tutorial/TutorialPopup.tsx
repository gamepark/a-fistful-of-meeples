/** @jsxImportSource @emotion/react */

import { css, keyframes } from "@emotion/react"
import { EmotionJSX } from "@emotion/react/types/jsx-namespace"
import { Tutorial, useActions, useAnimation, useFailures } from "@gamepark/react-client"
import { Picture } from "@gamepark/react-components"
import { TFunction } from "i18next"
import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import MeepleType from "../../../rules/src/MeepleType"
import Move from "../../../rules/src/moves/Move"
import PlayerColor from "../../../rules/src/PlayerColor"
import GoldCube from "../material/GoldCube"
import Images from "../material/Images"
import Meeple from "../material/Meeple"
import StoneCube from "../material/StoneCube"
import { getSize } from "../util/Styles"

type Props = {
  tutorial: Tutorial
}


export default function TutorialPopup({ tutorial }: Props) {
  const { t } = useTranslation()
  const [failures] = useFailures()
  const actions = useActions<Move, PlayerColor>()
  const animation = useAnimation<Move>()
  const actionsNumber = actions !== undefined ? actions.filter(action => !action.delayed).length : 0

  const previousActionNumber = useRef(actionsNumber)
  const [tutorialIndex, setTutorialIndex] = useState(0)
  const [tutorialDisplay, setTutorialDisplay] = useState(tutorialDescription.length > actionsNumber)
  const moveTutorial = (deltaMessage: number) => {
    let currentStep = actionsNumber;
    if (tutorialDescription[currentStep] && tutorialDescription[currentStep][tutorialIndex] && tutorialDescription[currentStep][tutorialIndex].opponentActions) {
      tutorial.playNextMoves(tutorialDescription[currentStep][tutorialIndex].opponentActions)
    }
    if (currentStep === tutorialDescription.length - 1 && tutorialIndex === tutorialDescription[currentStep].length - 1) {
      tutorial.setOpponentsPlayAutomatically(true)
    }
    setTutorialIndex(tutorialIndex + deltaMessage)
    setTutorialDisplay(true)
  }

  const resetTutorialDisplay = () => {
    setTutorialIndex(0)
    setTutorialDisplay(true)
  }

  const showTutorial = () => {
    if (tutorialDescription[actionsNumber] && !tutorialDescription[actionsNumber][tutorialIndex]) {
      setTutorialIndex(0)
    }
    setTutorialDisplay(true)
  }

  const tutorialMessage = (index: number) => {
    let currentStep = actionsNumber
    if (currentStep >= tutorialDescription.length)
      return undefined
    while (!tutorialDescription[currentStep]) {
      currentStep--
    }
    return tutorialDescription[currentStep][index]
  }

  useEffect(() => {
    if (previousActionNumber.current > actionsNumber) {
      setTutorialDisplay(false)
    } else if (tutorialDescription[actionsNumber]) {
      resetTutorialDisplay()
    }
    previousActionNumber.current = actionsNumber
  }, [actionsNumber])

  useEffect(() => {
    if (failures.length) {
      setTutorialIndex(tutorialDescription[actionsNumber].length - 1)
      setTutorialDisplay(true)
    }
  }, [actionsNumber, failures])

  const currentMessage = tutorialMessage(tutorialIndex)
  const displayPopup = tutorialDisplay && !animation && currentMessage && !failures.length

  if (actionsNumber >= tutorialDescription.length)
    tutorial.setOpponentsPlayAutomatically(true)

  return (
    <>
      <div css={[popupOverlayStyle, displayPopup ? showPopupOverlayStyle : hidePopupOverlayStyle(85, 90)]}
        onClick={() => setTutorialDisplay(false)}>
        <div css={[popupStyle, displayPopup ? popupPosition(currentMessage) : hidePopupStyle]}
          onClick={event => event.stopPropagation()}>
          <div css={closePopupStyle} onClick={() => setTutorialDisplay(false)}>X</div>
          {currentMessage && <h2>{currentMessage.title(t)}</h2>}
          {currentMessage && <p css={textStyle}> { currentMessage.text(t) }</p>}
          {tutorialIndex > 0 && <button css={[buttonStyle, backButtonStyle]} onClick={() => moveTutorial(-1)}>{'<<'}</button>}
          <button css={[buttonStyle, getSize(4, 1.6)]} onClick={() => moveTutorial(1)}>{t('OK')}</button>
        </div>
      </div>
      {
        !displayPopup && tutorialDescription.length > actionsNumber &&
        <button css={[buttonStyle, resetStyle]} onClick={showTutorial}>{t('Show Tutorial')}</button>
      }
      {
        currentMessage && currentMessage.arrow &&
        <Picture alt="Arrow pointing toward current tutorial interest" src={Images.tutorial_arrow}
          css={[arrowStyle(currentMessage.arrow.angle, currentMessage.arrow.size ?? 1), displayPopup ? showArrowStyle(currentMessage.arrow.top, currentMessage.arrow.left) : hideArrowStyle]} />
      }
    </>
  )
}

export function resetTutorial() {
  localStorage.removeItem('a-fistful-of-meeples')
  window.location.reload()
}


const popupOverlayStyle = css`
  position: absolute;
  right: 0;
  bottom: 0;
  background-color: transparent
  z-index: 99;
  transition: all .5s ease;
`
const showPopupOverlayStyle = css`
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
`
const hidePopupOverlayStyle = (boxTop: number, boxLeft: number) => css`
  top: ${boxTop}%;
  left: ${boxLeft}%;
  width: 0;
  height: 0;
  overflow: hidden;
`

const popupStyle = css`
  position: absolute;
  text-align: center;
  max-height: 70%;
  z-index: 102;
  background-color: #582900;
  color: #e0c060;
  border: solid 1em #e0c020;
  box-sizing: border-box;
  align-self: center;
  padding: 2%;
  margin: 0 2%;
  outline: none;
  box-shadow: 1em 2em 2.5em -1.5em hsla(0, 0%, 0%, 0.2);
  border-radius: 40em 3em 40em 3em/3em 40em 3em 40em;

  &:hover {
    box-shadow: 2em 4em 5em -3em hsla(0, 0%, 0%, .5);
  }

  & > h2 {
    font-family: 'Rye', "Roboto Light", serif;
    font-size: 5em;
    font-weight: normal;
    margin: 0;
  }

  & > p {
    font-size: 4em;
    margin: 2% 0;
  }

  & > button {
    font-family: 'Rye', "Roboto Light", serif;
    font-size: 4em;
  }
`

const hidePopupStyle = css`
  top: 85%;
  left: 90%;
  width: 0;
  height: 0;
  margin: 0;
  padding: 0;
  border: solid 0 #FFF;
  font-size: 0;
`

const popupPosition = ({ boxWidth, boxTop, boxLeft, arrow }: TutorialStepDescription) => css`
  transition-property: width, top, left, transform;
  transition-duration: 0.5s;
  transition-timing-function: ease;
  width: ${boxWidth}%;
  top: ${boxTop}%;
  left: ${boxLeft}%;
  transform: translate(-50%, ${!arrow || arrow.angle % 180 !== 0 ? '-50%' : arrow.angle % 360 === 0 ? '0%' : '-100%'});
`

const resetStyle = css`
  position: absolute;
  text-align: center;
  bottom: 10%;
  right: 1%;
  font-size: 3em;
`

const textStyle = css`
  text-align: justify;
`

const buttonStyle = css`
  color: #e0c060;
  background-color: #482000;
  border: solid 0.1em #e0c020;
  border-radius: 0.2em;
  padding-bottom: 0.2em;
  font-family: 'Rye', "Roboto Light", serif;
  font-weight: normal;
  &:hover {
    filter: drop-shadow(0 0 0.02em white) drop-shadow(0 0 0.02em white);
}
`


const backButtonStyle = css`
  margin-right: 1em;
`

const meepleStyle = css`
  margin: 0.2em;
  vertical-align: -0.5em;
`

const cubeStyle = css`
  vertical-align: -0.2em;
`

const arrowAnimation = (angle: number, scale: number) => keyframes`
  0% { filter: none; transform: rotate(${angle}deg) scale(${scale}, ${scale}); }
  50% { filter: drop-shadow(0 0 1em white) drop-shadow(0 0 1em black) drop-shadow(0 0 1em white); transform: rotate(${angle}deg) scale(${scale * 1.05}, ${scale * 1.05}); }
  100% { filter: none; transform: rotate(${angle}deg) scale(${scale}, ${scale}); }
`

const arrowStyle = (angle: number, scale: number) => css`
  position: absolute;
  will-change: transform;
  z-index: 102;
  transition-property: top, left, transform;
  transition-duration: 0.5s;
  transition-timing-function: ease;
  animation: ${arrowAnimation(angle, scale)} 3s linear infinite forwards;
`

const showArrowStyle = (top: number, left: number) => css`
  top: ${top}%;
  left: ${left}%;
  width: 20%;
`

const hideArrowStyle = css`
  top: 90%;
  left: 90%;
  width: 0;
`

const closePopupStyle = css`
  position: relative;
  float: right;
  text-align: center;
  margin-top: -2%;
  margin-right: -0%;
  font-size: 4em;
  font-family: 'Rye', "Roboto Light", serif;

  &:hover {
    cursor: pointer;
    color: #26d9d9;
  }
`


type TutorialStepDescription = {
  title: (t: TFunction) => string | EmotionJSX.Element,
  text: (t: TFunction) => string | EmotionJSX.Element,
  opponentActions?: number,
  boxTop: number
  boxLeft: number
  boxWidth: number
  arrow?: {
    angle: number
    top: number
    left: number
    size?: number
  }
}

const tutorialDescription: TutorialStepDescription[][] = [
  [
    {
      title: (t: TFunction) => <>{t('tuto.welcome')}<br />{t('Name')}</>,
      text: (t: TFunction) => t('tuto.welcome.txt'),
      boxTop: 50,
      boxLeft: 45,
      boxWidth: 60
    },
    {
      title: (t: TFunction) => t('tuto.goal'),
      text: (t: TFunction) => t('tuto.goal.txt'),
      boxTop: 50,
      boxLeft: 45,
      boxWidth: 60
    },
    {
      title: (t: TFunction) => t('tuto.players'),
      text: (t: TFunction) => t('tuto.players.txt'),
      boxTop: 34,
      boxLeft: 41.5,
      boxWidth: 60,
      arrow: {
        angle: 90,
        top: 25,
        left: 67
      }
    },
    {
      title: (t: TFunction) => t('tuto.marquee'),
      text: (t: TFunction) => t('tuto.marquee.txt'),
      opponentActions: 1,
      boxTop: 35,
      boxLeft: 51,
      boxWidth: 60,
      arrow: {
        angle: 90,
        top: 21,
        left: 74.5,
        size: 0.5
      }
    },
  ],  // opponent places his initial marquee in 5
  [
    {
      title: (t: TFunction) => t('tuto.setup'),
      text: (t: TFunction) => t('tuto.setup.txt'),
      boxTop: 33,
      boxLeft: 30,
      boxWidth: 60,
      arrow: {
        angle: 0,
        top: 20,
        left: 4
      }
    },
  ],  // player builds his initial marquee in 0
  [
    {
      title: (t: TFunction) => t('tuto.howtoplay'),
      text: (t: TFunction) => t('tuto.howtoplay.txt'),
      boxTop: 50,
      boxLeft: 45,
      boxWidth: 60
    },
    {
      title: (t: TFunction) => t('tuto.selectmeeples'),
      text: (t: TFunction) => t('tuto.selectmeeples.txt'),
      boxTop: 50,
      boxLeft: 40,
      boxWidth: 60,
      arrow: {
        angle: 0,
        top: 38,
        left: 15
      }
    },
  ], // player picks meeples in 1
  [
    {
      title: (t: TFunction) => t('tuto.placemeeples'),
      text: (t: TFunction) => t('tuto.placemeeples.txt'),
      boxTop: 50,
      boxLeft: 45,
      boxWidth: 60
    },
    {
      title: (t: TFunction) => t('tuto.t1.placeminer'),
      text: (t: TFunction) => <>{t('tuto.t1.placeminer.0.txt')}<Meeple css={[meepleStyle, getSize(1.25, 1.5)]} type={MeepleType.Miner} />{t('tuto.t1.placeminer.1.txt')}</>,
      boxTop: 42,
      boxLeft: 45,
      boxWidth: 50,
      arrow: {
        angle: 270,
        top: 36,
        left: 8.5
      }
    },
  ],  // player places Miner in 0
  [
    {
      title: (t: TFunction) => t('tuto.t1.placedeputy'),
      text: (t: TFunction) => <>{t('tuto.t1.placedeputy.0.txt')}<Meeple css={[meepleStyle, getSize(1.25, 1.5)]} type={MeepleType.Deputy} />{t('tuto.t1.placedeputy.1.txt')}</>,
      boxTop: 55,
      boxLeft: 49,
      boxWidth: 65,
      arrow: {
        angle: 270,
        top: 46,
        left: 7,
        size: 0.5
      }
    },
  ],  // player places Deputy in showdown 0
  [
    {
      title: (t: TFunction) => t('tuto.t1.placebuilder'),
      text: (t: TFunction) => <>{t('tuto.t1.placebuilder.0.txt')}<Meeple css={[meepleStyle, getSize(1.25, 1.5)]} type={MeepleType.Builder} />{t('tuto.t1.placebuilder.1.txt')}</>,
      boxTop: 60,
      boxLeft: 46.5,
      boxWidth: 60,
      arrow: {
        angle: 270,
        top: 56,
        left: 7,
        size: 0.5
      }
    },
  ], // player places Builder in 11
  [
    {
      title: (t: TFunction) => t('tuto.resolvemeeples'),
      text: (t: TFunction) => t('tuto.resolvemeeples.txt'),
      boxTop: 50,
      boxLeft: 45,
      boxWidth: 60
    },
    {
      title: (t: TFunction) => t('tuto.t1.resolveminer'),
      text: (t: TFunction) => t('tuto.t1.resolveminer.txt'),
      boxTop: 40,
      boxLeft: 51,
      boxWidth: 60,
      arrow: {
        angle: 270,
        top: 35.5,
        left: 9
      }
    },
  ],  // player resolves Miner in 0
  [
    {
      title: (t: TFunction) => t('tuto.pieces'),
      text: (t: TFunction) => t('tuto.pieces.txt'),
      boxTop: 50,
      boxLeft: 50,
      boxWidth: 60
    },
    {
      title: (t: TFunction) => t('tuto.bag'),
      text: (t: TFunction) => t('tuto.bag.txt'),
      boxTop: 34,
      boxLeft: 65,
      boxWidth: 60,
      arrow: {
        angle: 0,
        top: 21,
        left: 76
      }
    },
    {
      title: (t: TFunction) => t('tuto.miner'),
      text: (t: TFunction) => t('tuto.miner.txt'),
      boxTop: 50,
      boxLeft: 50,
      boxWidth: 60
    },
    {
      title: (t: TFunction) => t('tuto.builder'),
      text: (t: TFunction) => t('tuto.builder.txt'),
      boxTop: 50,
      boxLeft: 50,
      boxWidth: 60
    },
    {
      title: (t: TFunction) => t('tuto.marqueecost'),
      text: (t: TFunction) => <>
        {t('tuto.marqueecost.0.txt')}
        <StoneCube css={[cubeStyle, getSize(1, 1)]} />
        <StoneCube css={[cubeStyle, getSize(1, 1)]} />
        <StoneCube css={[cubeStyle, getSize(1, 1)]} />
        {t('tuto.marqueecost.1.txt')}
      </>,
      boxTop: 60,
      boxLeft: 48,
      boxWidth: 55,
      arrow: {
        angle: 270,
        top: 55.5,
        left: 9
      }
    },
    {
      title: (t: TFunction) => t('tuto.resources'),
      text: (t: TFunction) => t('tuto.resources.txt'),
      boxTop: 39.5,
      boxLeft: 43,
      boxWidth: 60,
      arrow: {
        angle: 90,
        top: 31,
        left: 68.5
      }
    },
    {
      title: (t: TFunction) => t('tuto.t1.resolvebuilder'),
      text: (t: TFunction) => t('tuto.t1.resolvebuilder.txt'),
      boxTop: 60,
      boxLeft: 50.5,
      boxWidth: 60,
      arrow: {
        angle: 270,
        top: 55.5,
        left: 9
      }
    },
  ],  // player resolves Builder in 11
  [
    {
      title: (t: TFunction) => t('tuto.t1.resolvedeputy'),
      text: (t: TFunction) => t('tuto.t1.resolvedeputy.txt'),
      boxTop: 55,
      boxLeft: 50.5,
      boxWidth: 60,
      arrow: {
        angle: 270,
        top: 46,
        left: 9
      }
    },
    {
      title: (t: TFunction) => t('tuto.t1.end'),
      text: (t: TFunction) => t('tuto.t1.end.txt'),
      opponentActions: 6,
      boxTop: 50,
      boxLeft: 40,
      boxWidth: 50
    },
  ],  // opponent takes meeples, places meeples and resolves first 2 meeples
  [],
  [],
  [],
  [],
  [],
  [
    {
      title: (t: TFunction) => t('tuto.showdown.0'),
      text: (t: TFunction) => t('tuto.showdown.0.txt'),
      boxTop: 40,
      boxLeft: 38,
      boxWidth: 48
    },
    {
      title: (t: TFunction) => t('tuto.showdown.1'),
      text: (t: TFunction) => t('tuto.showdown.1.txt'),
      opponentActions: 1,
      boxTop: 40,
      boxLeft: 38,
      boxWidth: 48
    },
  ],  // opponent resolves showdown
  [
    {
      title: (t: TFunction) => t('tuto.showdown.2'),
      text: (t: TFunction) => t('tuto.showdown.2.txt'),
      opponentActions: 1,
      boxTop: 50,
      boxLeft: 38,
      boxWidth: 48
    },
    {
      title: (t: TFunction) => t('tuto.shootingskill'),
      text: (t: TFunction) => <>{t('tuto.shootingskill.0.txt')}
        <Meeple css={[meepleStyle, getSize(1.25, 1.5)]} type={MeepleType.Deputy} />
        {t('tuto.shootingskill.1.txt')}
        <Meeple css={[meepleStyle, getSize(1.25, 1.5)]} type={MeepleType.Robber} />
        {t('tuto.shootingskill.2.txt')}
        <Meeple css={[meepleStyle, getSize(1.25, 1.5)]} type={MeepleType.Miner} />
        {t('tuto.shootingskill.3.txt')}
        <Meeple css={[meepleStyle, getSize(1.25, 1.5)]} type={MeepleType.Builder} />
        {t('tuto.shootingskill.4.txt')}</>,
      boxTop: 80,
      boxLeft: 38,
      boxWidth: 48,
      arrow: {
        angle: 180,
        top: 45,
        left: -5,
        size: 0.5
      }
    },  // player rerolls showdown dice
  ],
  [
    {
      title: (t: TFunction) => t('tuto.showdownresolution'),
      text: (t: TFunction) => t('tuto.showdownresolution.txt'),
      boxTop: 75,
      boxLeft: 43,
      boxWidth: 60,
      arrow: {
        angle: 270,
        top: 70,
        left: 1
      }
    },
    {
      title: (t: TFunction) => t('tuto.showdownpieces'),
      text: (t: TFunction) => t('tuto.showdownpieces.txt'),
      boxTop: 60,
      boxLeft: 43,
      boxWidth: 60,
      arrow: {
        angle: 270,
        top: 53,
        left: 1.5
      }
    },
    {
      title: (t: TFunction) => t('tuto.t3.selectmeeples'),
      text: (t: TFunction) => t('tuto.t3.selectmeeples.txt'),
      boxTop: 51,
      boxLeft: 50,
      boxWidth: 60,
      arrow: {
        angle: 0,
        top: 38.2,
        left: 46.5,
      }
    },
  ],  // player picks meeples in 4
  [
    {
      title: (t: TFunction) => t('tuto.t3.placebuilder1'),
      text: (t: TFunction) => <>
        {t('tuto.t3.placebuilder1.0.txt')}
        <Meeple css={[meepleStyle, getSize(1.25, 1.5)]} type={MeepleType.Builder} />
        {t('tuto.t3.placebuilder1.1.txt')}
      </>,
      boxTop: 58,
      boxLeft: 56,
      boxWidth: 48,
      arrow: {
        angle: 0,
        top: 45,
        left: 35.5
      }
    },  // player place Builder in 3
  ], 
  [
    {
      title: (t: TFunction) => t('tuto.t3.placedeputy'),
      text: (t: TFunction) => <>
        {t('tuto.t3.placedeputy.0.txt')}
        <Meeple css={[meepleStyle, getSize(1.25, 1.5)]} type={MeepleType.Deputy} />
        {t('tuto.t3.placedeputy.1.txt')}
      </>,
      boxTop: 63,
      boxLeft: 30,
      boxWidth: 48,
      arrow: {
        angle: 0,
        top: 53,
        left: 8.7,
        size: 0.5
      }
    },  // player place Deputy in 2
  ], 
  [
    {
      title: (t: TFunction) => t('tuto.t3.placerobber'),
      text: (t: TFunction) => <>
        {t('tuto.t3.placerobber.0.txt')}
        <Meeple css={[meepleStyle, getSize(1.25, 1.5)]} type={MeepleType.Robber} />
        {t('tuto.t3.placerobber.1.txt')}
      </>,
      boxTop: 63,
      boxLeft: 30,
      boxWidth: 48,
      arrow: {
        angle: 0,
        top: 53,
        left: 23.5,
        size: 0.5
      }
    },  // player place Robber in 1
  ], 
  [
    {
      title: (t: TFunction) => t('tuto.t3.placebuilder2'),
      text: (t: TFunction) => t('tuto.t3.placebuilder2.txt'),
      boxTop: 50,
      boxLeft: 50,
      boxWidth: 40,
    },  // player place Builder in 0
  ], 
  [
    {
      title: (t: TFunction) => t('tuto.t3.resolvedeputy'),
      text: (t: TFunction) => t('tuto.t3.resolvedeputy.txt'),
      boxTop: 52,
      boxLeft: 35,
      boxWidth: 60,
      arrow: {
        angle: 0,
        top: 42,
        left: 25,
        size: 0.5
      }
    },  // player resolves Deputy in 2
  ], 
  [
    {
      title: (t: TFunction) => t('tuto.jail'),
      text: (t: TFunction) => t('tuto.jail.txt'),
      boxTop: 28,
      boxLeft: 42.5,
      boxWidth: 60,
      arrow: {
        angle: 270,
        top: 20,
        left: 1.5
      }
    },
    {
      title: (t: TFunction) => t('tuto.t3.resolverobber'),
      text: (t: TFunction) => <>
        {t('tuto.t3.resolverobber.0.txt')}
        <Meeple css={[meepleStyle, getSize(1.25, 1.5)]} type={MeepleType.Miner} />
        {t('tuto.t3.resolverobber.1.txt')}
      </>,
      boxTop: 52,
      boxLeft: 40,
      boxWidth: 80,
      arrow: {
        angle: 0,
        top: 42,
        left: 14.5,
        size: 0.5
      }
    },  // player resolves Robber in 1
  ], 
  [
    {
      title: (t: TFunction) => t('tuto.t3.resolvebuilder1'),
      text: (t: TFunction) => t('tuto.t3.resolvebuilder1.txt'),
      boxTop: 52,
      boxLeft: 35,
      boxWidth: 60,
      arrow: {
        angle: 0,
        top: 42,
        left: 35.5,
        size: 0.5
      }
    },  // player resolves Builder in 3
  ], 
  [
    {
      title: (t: TFunction) => t('tuto.t3.buildmarquee'),
      text: (t: TFunction) => <>
        {t('tuto.t3.buildmarquee.0.txt')}
        <StoneCube css={[cubeStyle, getSize(1, 1)]} />
        <GoldCube css={[cubeStyle, getSize(1, 1)]} />
        <GoldCube css={[cubeStyle, getSize(1, 1)]} />
        {t('tuto.t3.buildmarquee.1.txt')}
      </>,
      boxTop: 28,
      boxLeft: 40,
      boxWidth: 50,
      arrow: {
        angle: 0,
        top: 17.5,
        left: 35.5,
        size: 0.5
      }
    },  // player builds marquee in 3
  ], 
  [
    {
      title: (t: TFunction) => t('tuto.t3.resolvebuilder2'),
      text: (t: TFunction) => t('tuto.t3.resolvebuilder2.txt'),
      boxTop: 52,
      boxLeft: 25,
      boxWidth: 50,
      arrow: {
        angle: 0,
        top: 42,
        left: 4,
        size: 0.5
      }
    },  // player resolves Builder in 0
  ],
  [
    {
      title: (t: TFunction) => t('tuto.t3.upgrademarquee'),
      text: (t: TFunction) => t('tuto.t3.upgrademarquee.txt'),
      boxTop: 50,
      boxLeft: 40,
      boxWidth: 50
    },  // player upgrades marquee in 0
  ], 
  [
    {
      title: (t: TFunction) => t('tuto.locationsaloon'),
      text: (t: TFunction) => t('tuto.locationsaloon.txt'),
      boxTop: 28,
      boxLeft: 34,
      boxWidth: 60,
      arrow: {
        angle: 90,
        top: 20,
        left: 59
      }
    },
    {
      title: (t: TFunction) => t('tuto.locationjail'),
      text: (t: TFunction) => t('tuto.locationjail.txt'),
      boxTop: 28,
      boxLeft: 42.5,
      boxWidth: 60,
      opponentActions: 1,
      arrow: {
        angle: 270,
        top: 20,
        left: 1.5
      }
    },  // opponent selects Saloon
  ],
  [
    {
      title: (t: TFunction) => t('tuto.t4.selectmeeples'),
      text: (t: TFunction) => t('tuto.t4.selectmeeples.txt'),
      boxTop: 60,
      boxLeft: 55,
      boxWidth: 60,
      opponentActions: 2,
    },  // opponent places Meeples
  ],
  [],
  [
    {
      title: (t: TFunction) => t('tuto.t4.resolvemadame'),
      text: (t: TFunction) => t('tuto.t4.resolvemadame.txt'),
      boxTop: 60,
      boxLeft: 51,
      boxWidth: 60,
      opponentActions: 1,
      arrow: {
        angle: 270,
        top: 56,
        left: 10
      }
    },  // opponent resolves Madame
  ],
  [
    {
      title: (t: TFunction) => t('tuto.t5.selectmeeples'),
      text: (t: TFunction) => t('tuto.t5.selectmeeples.txt'),
      boxTop: 30,
      boxLeft: 35,
      boxWidth: 50,
      arrow: {
        angle: 270,
        top: 20,
        left: 0,
        size: 0.5
      },
    },  // player takes Meeples in Jail
  ],
  [
    {
      title: (t: TFunction) => t('tuto.t5.escape'),
      text: (t: TFunction) => t('tuto.t5.escape.txt'),
      boxTop: 33,
      boxLeft: 40,
      boxWidth: 60,
      arrow: {
        angle: 270,
        top: 9,
        left: 0,
        size: 0.5
      }
    },
    {
      title: (t: TFunction) => t('tuto.t5.placerobber1'),
      text: (t: TFunction) => t('tuto.t5.placerobber1.txt'),
      boxTop: 55,
      boxLeft: 40,
      boxWidth: 70,
      arrow: {
        angle: 180,
        top: 54,
        left: 36,
      },
    },  // player places Bandit in 8
  ],
  [
    {
      title: (t: TFunction) => t('tuto.t5.placerobber2'),
      text: (t: TFunction) => t('tuto.t5.placerobber2.txt'),
      boxTop: 55,
      boxLeft: 45,
      boxWidth: 60,
      arrow: {
        angle: 180,
        top: 54,
        left: 25,
      },
    },  // player places Bandit in 9
  ],
  [
    {
      title: (t: TFunction) => t('tuto.t5.resolverobber1'),
      text: (t: TFunction) => t('tuto.t5.resolverobber1.txt'),
      boxTop: 48,
      boxLeft: 45,
      boxWidth: 60,
      arrow: {
        angle: 180,
        top: 47,
        left: 35.5,
      },
    },  // player resolves Bandit in 8
  ],
  [
    {
      title: (t: TFunction) => t('tuto.t5.resolverobber2'),
      text: (t: TFunction) => t('tuto.t5.resolverobber2.txt'),
      boxTop: 48,
      boxLeft: 45,
      boxWidth: 60,
      arrow: {
        angle: 180,
        top: 47,
        left: 25,
      },
    },  // player resolves Bandit in 9
  ],
  [
    {
      title: (t: TFunction) => t('tuto.t5.dynamite.0'),
      text: (t: TFunction) => t('tuto.t5.dynamite.0.txt'),
      boxTop: 50,
      boxLeft: 40,
      boxWidth: 50
    },
    {
      title: (t: TFunction) => t('tuto.t5.dynamite.1'),
      text: (t: TFunction) => t('tuto.t5.dynamite.1.txt'),
      boxTop: 50,
      boxLeft: 40,
      boxWidth: 50,
      arrow: {
        angle: 180,
        top: 46,
        left: 29.3,
        size: 0.5
      },
    },
    {
      title: (t: TFunction) => t('tuto.t5.goldbar'),
      text: (t: TFunction) => t('tuto.t5.goldbar.txt'),
      boxTop: 74,
      boxLeft: 30,
      boxWidth: 68,
      arrow: {
        angle: 90,
        top: 72,
        left: 59,
      },
    },
    {
      title: (t: TFunction) => t('tuto.end.trigger'),
      text: (t: TFunction) => <>
        {t('tuto.end.trigger.0.txt')}
        <ul>
          <li>{t('tuto.end.trigger.1.txt')}</li>
          <li>{t('tuto.end.trigger.2.txt')}</li>
          <li>{t('tuto.end.trigger.3.txt')}</li>
        </ul>
      </>,
      boxTop: 50,
      boxLeft: 40,
      boxWidth: 60
    },
    {
      title: (t: TFunction) => t('tuto.end.score'),
      text: (t: TFunction) => <>
        {t('tuto.end.score.0.txt')}
        <ul>
          <li>{t('tuto.end.score.1.txt')}</li>
          <li>{t('tuto.end.score.2.txt')}</li>
          <li>{t('tuto.end.score.3.txt')}</li>
          <li>{t('tuto.end.score.4.txt')}</li>
        </ul>
      </>,
      boxTop: 50,
      boxLeft: 40,
      boxWidth: 60
    },
    {
      title: (t: TFunction) => t('tuto.end.victory'),
      text: (t: TFunction) => t('tuto.end.victory.txt'),
      boxTop: 50,
      boxLeft: 40,
      boxWidth: 60
    },
    {
      title: (t: TFunction) => t('tuto.help'),
      text: (t: TFunction) => t('tuto.help.txt'),
      boxTop: 30,
      boxLeft: 70,
      boxWidth: 60,
      arrow: {
        angle: 0,
        top: 19,
        left: 87.5,
        size: 0.5
      }
    },
    {
      title: (t: TFunction) => t('tuto.end.uptoyou'),
      text: (t: TFunction) => t('tuto.end.uptoyou.txt'),
      boxTop: 50,
      boxLeft: 40,
      boxWidth: 60
    },
  ],
]
