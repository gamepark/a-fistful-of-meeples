/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react"
import { EmotionJSX } from "@emotion/react/types/jsx-namespace"
import { Tutorial, useActions, useAnimation, useFailures } from "@gamepark/react-client"
import { Picture } from "@gamepark/react-components"
import { TFunction } from "i18next"
import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import GameState from "../../../rules/src/GameState"
import Move from "../../../rules/src/moves/Move"
import PlayerColor from "../../../rules/src/PlayerColor"
import Images from "../material/Images"

type Props = {
  game: GameState
  tutorial: Tutorial
}


export default function TutorialPopup({ game, tutorial }: Props) {
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
      console.log("oppponnents playing")
      tutorial.setOpponentsPlayAutomatically(true)
    }
    setTutorialIndex(tutorialIndex + deltaMessage)
    console.log("tutorial : %d, %d", currentStep, tutorialIndex)
    setTutorialDisplay(true)
  }

  const resetTutorialDisplay = () => {
    setTutorialIndex(0)
    setTutorialDisplay(true)
  }

  const tutorialMessage = (index: number) => {
    let currentStep = actionsNumber
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

  return (
    <>
      <div css={[popupOverlayStyle, displayPopup ? showPopupOverlayStyle : hidePopupOverlayStyle(85, 90)]}
        onClick={() => setTutorialDisplay(false)}>
        <div css={[popupStyle, displayPopup ? popupPosition(currentMessage) : hidePopupStyle]}
          onClick={event => event.stopPropagation()}>
          <div css={closePopupStyle} onClick={() => setTutorialDisplay(false)}>X</div>
          {currentMessage && <h2>{currentMessage.title(t)}</h2>}
          {currentMessage && <p css={textStyle}> { currentMessage.text(t) }</p>}
          {tutorialIndex > 0 && <button css={buttonStyle} onClick={() => moveTutorial(-1)}>{'<<'}</button>}
          <button onClick={() => moveTutorial(1)}>{t('OK')}</button>
        </div>
      </div>
      {
        !displayPopup && tutorialDescription.length > actionsNumber &&
        <button css={resetStyle} onClick={() => resetTutorialDisplay()}>{t('Show Tutorial')}</button>
      }
      {
        currentMessage && currentMessage.arrow &&
        <Picture alt="Arrow pointing toward current tutorial interest" src={Images.tutorial_arrow}
          css={[arrowStyle(currentMessage.arrow.angle, currentMessage.arrow.size ?? 1), displayPopup ? showArrowStyle(currentMessage.arrow.top, currentMessage.arrow.left) : hideArrowStyle]} />
      }

      <div>{game.dynamitesInJail}</div>
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

export const popupStyle = css`
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
  font-family: 'Brush Script MT', cursive;

  &:hover {
    box-shadow: 2em 4em 5em -3em hsla(0, 0%, 0%, .5);
  }

  & > h2 {
    font-size: 5em;
    margin: 0;
  }

  & > p {
    font-size: 4em;
    margin: 2% 0;
  }

  & > button {
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
  font-size: 3.5em;
`

const textStyle = css`
  text-align: justify;
`


const buttonStyle = css`
  margin-right: 1em;
`

const arrowStyle = (angle: number, scale: number) => css`
  position: absolute;
  transform: rotate(${angle}deg) scale(${scale}, ${scale});
  will-change: transform;
  z-index: 102;
  transition-property: top, left, transform;
  transition-duration: 0.5s;
  transition-timing-function: ease;
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

  &:hover {
    cursor: pointer;
    color: #26d9d9;
  }
`


type TutorialStepDescription = {
  title: (t: TFunction) => string,
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
      title: (t: TFunction) => t('tuto.t0.0'),
      text: (t: TFunction) => t('tuto.t0.0.txt'),
      boxTop: 50,
      boxLeft: 45,
      boxWidth: 60
    },
    {
      title: (t: TFunction) => t('tuto.t0.1'),
      text: (t: TFunction) => t('tuto.t0.1.txt'),
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
      title: (t: TFunction) => t('tuto.t0.2'),
      text: (t: TFunction) => t('tuto.t0.2.txt'),
      boxTop: 53,
      boxLeft: 46.5,
      boxWidth: 50,
      arrow: {
        angle: 90,
        top: 44,
        left: 67
      }
    },
    {
      title: (t: TFunction) => t('tuto.t0.3'),
      text: (t: TFunction) => t('tuto.t0.3.txt'),
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
      title: (t: TFunction) => t('tuto.t0.4'),
      text: (t: TFunction) => t('tuto.t0.4.txt'),
      boxTop: 75,
      boxLeft: 34,
      boxWidth: 60,
      arrow: {
        angle: 90,
        top: 72,
        left: 59
      }
    },
    {
      title: (t: TFunction) => t('tuto.t0.5'),
      text: (t: TFunction) => t('tuto.t0.5.txt'),
      boxTop: 80,
      boxLeft: 38,
      boxWidth: 48,
      arrow: {
        angle: 180,
        top: 45,
        left: -5,
        size: 0.5
      }
    },
    {
      title: (t: TFunction) => t('tuto.t0.6'),
      text: (t: TFunction) => t('tuto.t0.6.txt'),
      boxTop: 41,
      boxLeft: 30,
      boxWidth: 60,
      arrow: {
        angle: 0,
        top: 27.5,
        left: 4
      }
    },
    {
      title: (t: TFunction) => t('tuto.t0.7'),
      text: (t: TFunction) => t('tuto.t0.7.txt'),
      boxTop: 41,
      boxLeft: 30,
      boxWidth: 60,
      arrow: {
        angle: 0,
        top: 27.5,
        left: 14.5
      }
    },
    {
      title: (t: TFunction) => t('tuto.t0.8'),
      text: (t: TFunction) => t('tuto.t0.8.txt'),
      boxTop: 41,
      boxLeft: 35,
      boxWidth: 60,
      arrow: {
        angle: 0,
        top: 27.5,
        left: 28
      }
    },
    {
      title: (t: TFunction) => t('tuto.t0.9'),
      text: (t: TFunction) => t('tuto.t0.9.txt'),
      boxTop: 41,
      boxLeft: 35,
      boxWidth: 60,
      arrow: {
        angle: 0,
        top: 27.5,
        left: 17.3
      }
    },
    {
      title: (t: TFunction) => t('tuto.t0.10'),
      text: (t: TFunction) => t('tuto.t0.10.txt'),
      boxTop: 33,
      boxLeft: 60,
      boxWidth: 60,
      arrow: {
        angle: 0,
        top: 20,
        left: 64
      }
    },
    {
      title: (t: TFunction) => t('tuto.t0.11'),
      text: (t: TFunction) => t('tuto.t0.11.txt'),
      boxTop: 51,
      boxLeft: 41.5,
      boxWidth: 60,
      arrow: {
        angle: 0,
        top: 38,
        left: 36
      }
    },
    {
      title: (t: TFunction) => t('tuto.t0.12'),
      text: (t: TFunction) => t('tuto.t0.12.txt'),
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
      title: (t: TFunction) => t('tuto.t0.13'),
      text: (t: TFunction) => t('tuto.t0.13.txt'),
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
      title: (t: TFunction) => t('tuto.t0.14'),
      text: (t: TFunction) => t('tuto.t0.14.txt'),
      boxTop: 50,
      boxLeft: 45,
      boxWidth: 60
    },
    {
      title: (t: TFunction) => t('tuto.t0.15'),
      text: (t: TFunction) => t('tuto.t0.15.txt'),
      opponentActions: 1,
      boxTop: 50,
      boxLeft: 45,
      boxWidth: 60
    },
  ],  // opponent places his initial marquee in 5
  [
    {
      title: (t: TFunction) => t('tuto.t0.16'),
      text: (t: TFunction) => t('tuto.t0.16.txt'),
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
      title: (t: TFunction) => t('tuto.t1.0'),
      text: (t: TFunction) => t('tuto.t1.0.txt'),
      boxTop: 50,
      boxLeft: 50,
      boxWidth: 60
    },
    {
      title: (t: TFunction) => t('tuto.t1.1'),
      text: (t: TFunction) => t('tuto.t1.1.txt'),
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
      title: (t: TFunction) => t('tuto.t1.2'),
      text: (t: TFunction) => t('tuto.t1.2.txt'),
      boxTop: 53,
      boxLeft: 54.5,
      boxWidth: 50,
      arrow: {
        angle: 270,
        top: 47,
        left: 18
      }
    },
  ],  // player places Miner in 0
  [
    {
      title: (t: TFunction) => t('tuto.t1.3'),
      text: (t: TFunction) => t('tuto.t1.3.txt'),
      boxTop: 53,
      boxLeft: 59.5,
      boxWidth: 50,
      arrow: {
        angle: 270,
        top: 47,
        left: 23
      }
    },
  ],  // player places Deputy in showdown 0
  [
    {
      title: (t: TFunction) => t('tuto.t1.4'),
      text: (t: TFunction) => t('tuto.t1.4.txt'),
      boxTop: 50,
      boxLeft: 55,
      boxWidth: 60,
      arrow: {
        angle: 270,
        top: 47,
        left: 14
      }
    },
  ], // player places Builder in 11
  [
    {
      title: (t: TFunction) => t('tuto.t1.5'),
      text: (t: TFunction) => t('tuto.t1.5.txt'),
      boxTop: 50,
      boxLeft: 45,
      boxWidth: 55
    },
    {
      title: (t: TFunction) => t('tuto.t1.6'),
      text: (t: TFunction) => t('tuto.t1.6.txt'),
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
      title: (t: TFunction) => t('tuto.t1.7'),
      text: (t: TFunction) => t('tuto.t1.7.txt'),
      boxTop: 50,
      boxLeft: 50,
      boxWidth: 60
    },
    {
      title: (t: TFunction) => t('tuto.t1.8'),
      text: (t: TFunction) => t('tuto.t1.8.txt'),
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
      title: (t: TFunction) => t('tuto.t1.9'),
      text: (t: TFunction) => t('tuto.t1.9.txt'),
      boxTop: 50,
      boxLeft: 38.2,
      boxWidth: 48
    },
    {
      title: (t: TFunction) => t('tuto.t1.10'),
      text: (t: TFunction) => t('tuto.t1.10.txt'),
      boxTop: 50,
      boxLeft: 40,
      boxWidth: 50
    },
    {
      title: (t: TFunction) => t('tuto.t2.0'),
      text: (t: TFunction) => t('tuto.t2.0.txt'),
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
      title: (t: TFunction) => t('tuto.t2.1'),
      text: (t: TFunction) => t('tuto.t2.1.txt'),
      opponentActions: 1,
      boxTop: 40,
      boxLeft: 38,
      boxWidth: 48
    },
  ],  // opponent resolves showdown
  [
    {
      title: (t: TFunction) => t('tuto.t2.2'),
      text: (t: TFunction) => t('tuto.t2.2.txt'),
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
      title: (t: TFunction) => t('tuto.t2.3'),
      text: (t: TFunction) => t('tuto.t2.3.txt'),
      boxTop: 50,
      boxLeft: 39,
      boxWidth: 65
    },
    {
      title: (t: TFunction) => t('tuto.t3.0'),
      text: (t: TFunction) => t('tuto.t3.0.txt'),
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
      title: (t: TFunction) => t('tuto.t3.1'),
      text: (t: TFunction) => t('tuto.t3.1.txt'),
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
      title: (t: TFunction) => t('tuto.t3.2'),
      text: (t: TFunction) => t('tuto.t3.2.txt'),
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
      title: (t: TFunction) => t('tuto.t3.3'),
      text: (t: TFunction) => t('tuto.t3.3.txt'),
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
      title: (t: TFunction) => t('tuto.t3.4'),
      text: (t: TFunction) => t('tuto.t3.4.txt'),
      boxTop: 50,
      boxLeft: 50,
      boxWidth: 40,
    },  // player place Builder in 0
  ], 
  [
    {
      title: (t: TFunction) => t('tuto.t3.5'),
      text: (t: TFunction) => t('tuto.t3.5.txt'),
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
      title: (t: TFunction) => t('tuto.t3.6'),
      text: (t: TFunction) => t('tuto.t3.6.txt'),
      boxTop: 52,
      boxLeft: 35,
      boxWidth: 60,
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
      title: (t: TFunction) => t('tuto.t3.7'),
      text: (t: TFunction) => t('tuto.t3.7.txt'),
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
      title: (t: TFunction) => t('tuto.t3.8'),
      text: (t: TFunction) => t('tuto.t3.8.txt'),
      boxTop: 50,
      boxLeft: 40,
      boxWidth: 50,
    },  // player builds marquee in 3
  ], 
  [
    {
      title: (t: TFunction) => t('tuto.t3.9'),
      text: (t: TFunction) => t('tuto.t3.9.txt'),
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
      title: (t: TFunction) => t('tuto.t3.10'),
      text: (t: TFunction) => t('tuto.t3.10.txt'),
      boxTop: 50,
      boxLeft: 40,
      boxWidth: 50
    },  // player upgrades marquee in 0
  ], 
  [
    {
      title: (t: TFunction) => t('tuto.t4.0'),
      text: (t: TFunction) => t('tuto.t4.0.txt'),
      boxTop: 50,
      boxLeft: 40,
      boxWidth: 50,
      opponentActions: 3,
    },  // opponent selects Saloon and places Meeples
  ],
  [],
  [],
  [
    {
      title: (t: TFunction) => t('tuto.t4.1'),
      text: (t: TFunction) => t('tuto.t4.1.txt'),
      boxTop: 66,
      boxLeft: 53,
      boxWidth: 60,
      opponentActions: 1,
      arrow: {
        angle: 270,
        top: 60,
        left: 12
      }
    },  // opponent resolves Madame
  ],
  [
    {
      title: (t: TFunction) => t('tuto.t5.0'),
      text: (t: TFunction) => t('tuto.t5.0.txt'),
      boxTop: 30,
      boxLeft: 35,
      boxWidth: 50,
      arrow: {
        angle: 270,
        top: 20,
        left: 0,
        size: 0.5
      },
    },  // player takes Meeples in Prison
  ],
  [
    {
      title: (t: TFunction) => t('tuto.t5.1'),
      text: (t: TFunction) => t('tuto.t5.1.txt'),
      boxTop: 50,
      boxLeft: 40,
      boxWidth: 50
    },
    {
      title: (t: TFunction) => t('tuto.t5.2'),
      text: (t: TFunction) => t('tuto.t5.2.txt'),
      boxTop: 55,
      boxLeft: 45,
      boxWidth: 60,
      arrow: {
        angle: 180,
        top: 54,
        left: 36,
      },
    },  // player places Bandit in 8
  ],
  [
    {
      title: (t: TFunction) => t('tuto.t5.3'),
      text: (t: TFunction) => t('tuto.t5.3.txt'),
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
      title: (t: TFunction) => t('tuto.t5.4'),
      text: (t: TFunction) => t('tuto.t5.4.txt'),
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
      title: (t: TFunction) => t('tuto.t5.5'),
      text: (t: TFunction) => t('tuto.t5.5.txt'),
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
      title: (t: TFunction) => t('tuto.t5.6'),
      text: (t: TFunction) => t('tuto.t5.6.txt'),
      boxTop: 50,
      boxLeft: 40,
      boxWidth: 50
    },
    {
      title: (t: TFunction) => t('tuto.t5.7'),
      text: (t: TFunction) => t('tuto.t5.7.txt'),
      boxTop: 71,
      boxLeft: 30,
      boxWidth: 68,
      arrow: {
        angle: 90,
        top: 72,
        left: 59,
      },
    },
    {
      title: (t: TFunction) => t('tuto.end.0'),
      text: (t: TFunction) => <>{t('tuto.end.0.txt')}<ul><li>{t('tuto.end.0.1.part')}</li><li>{t('tuto.end.0.2.part')}</li><li>{t('tuto.end.0.3.part')}</li></ul></>,
      boxTop: 50,
      boxLeft: 40,
      boxWidth: 60
    },
    {
      title: (t: TFunction) => t('tuto.end.1'),
      text: (t: TFunction) => t('tuto.end.1.txt'),
      boxTop: 50,
      boxLeft: 40,
      boxWidth: 60
    },
    {
      title: (t: TFunction) => t('tuto.end.2'),
      text: (t: TFunction) => t('tuto.end.2.txt'),
      boxTop: 50,
      boxLeft: 40,
      boxWidth: 60
    },
    {
      title: (t: TFunction) => t('tuto.end.3'),
      text: (t: TFunction) => t('tuto.end.3.txt'),
      boxTop: 50,
      boxLeft: 40,
      boxWidth: 60
    },
  ],
]
