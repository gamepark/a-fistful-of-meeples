import { useAnimation } from "@gamepark/react-client"
import { FC, useEffect } from "react"
import { Location_Jail, Location_Showdown0, Location_Showdown1 } from "../../../rules/src/GameState"
import BuildOrUpgradeMarquee from "../../../rules/src/moves/BuildOrUpgradeMarquee"
import { isBuildOrUpgradeMarqueeMove, isDrawFromBagMove, isDynamiteExplosion, isMoveMeeplesMove, isPlaceInitialMarqueeTileMove, isResolveMeepleMove, isSelectSourceLocationMove } from "../../../rules/src/moves/Move"
import PlaceInitialMarqueeTile from "../../../rules/src/moves/PlaceInitialMarqueeTile"
import ResolveMeeple from "../../../rules/src/moves/ResolveMeeple"
import DrawFromBag from "../../../rules/src/moves/DrawFromBag"
import MoveMeeples from "../../../rules/src/moves/MoveMeeples"
import SelectSourceLocation from "../../../rules/src/moves/SelectSourceLocation"
import { AudioLoader } from "./AudioLoader"
import duelSound from "./Duel.mp3"
import marqueeSound from "./Marquee.mp3"
import takeMeeplesSound from "./TakeMeeples.mp3"
import resolveMeepleSound from "./ResolveMeeple.mp3"
import drawFromBagSound from "./DrawFromBag.mp3" // don't call this one Miner
import robberSound from "./Robber.mp3"
import jailSound from "./Jail.mp3"
import explosionSound from "./Explosion.mp3"
import DynamiteExplosion from "../../../rules/src/moves/DynamiteExplosion"

type Props = {
  audioLoader: AudioLoader
}

export const AllAFistfulOfMeeplesSoundsSounds = [duelSound, marqueeSound, takeMeeplesSound, resolveMeepleSound, drawFromBagSound, robberSound, jailSound, explosionSound]

const AFistfulOfMeeplesSounds: FC<Props> = ({ audioLoader }) => {

  const selectMeeplesAnimation = useAnimation<SelectSourceLocation>(animation => isSelectSourceLocationMove(animation.move))
  const resolveMeepleAnimation = useAnimation<ResolveMeeple>(animation => isResolveMeepleMove(animation.move))
  const marqueeAnimation = useAnimation<PlaceInitialMarqueeTile | BuildOrUpgradeMarquee>(animation => isPlaceInitialMarqueeTileMove(animation.move) || isBuildOrUpgradeMarqueeMove(animation.move))
  const drawFromBagAnimation = useAnimation<DrawFromBag>(animation => isDrawFromBagMove(animation.move))
  const moveMeeplesAnimation = useAnimation<MoveMeeples>(animation => isMoveMeeplesMove(animation.move))
  const dynamiteExplosionAnimation = useAnimation<DynamiteExplosion>(animation => isDynamiteExplosion(animation.move))

  useEffect(() => {
    if (resolveMeepleAnimation) {
      if ((resolveMeepleAnimation.move.space === Location_Showdown0 || resolveMeepleAnimation.move.space === Location_Showdown1))
        audioLoader.play(duelSound, false, 0.3)
      else
        audioLoader.play(resolveMeepleSound, false, 0.4)
    }
  }, [audioLoader, resolveMeepleAnimation?.move])

  useEffect(() => {
    if (marqueeAnimation) {
      audioLoader.play(marqueeSound)
    }
  }, [audioLoader, marqueeAnimation?.move])

  useEffect(() => {
    if (drawFromBagAnimation) {
      audioLoader.play(drawFromBagSound)
    }
  }, [audioLoader, drawFromBagAnimation?.move])

  useEffect(() => {
    if (selectMeeplesAnimation) {
      if (selectMeeplesAnimation.move.location === Location_Jail)
        audioLoader.play(robberSound, false, 0.3)
      else
        audioLoader.play(takeMeeplesSound, false, 0.2)
    }
  }, [audioLoader, selectMeeplesAnimation?.move])

  useEffect(() => {
    if (moveMeeplesAnimation) {
      if (moveMeeplesAnimation.move.destination === Location_Jail)
        audioLoader.play(jailSound)
    }
  }, [audioLoader, moveMeeplesAnimation?.move])

  useEffect(() => {
    if (dynamiteExplosionAnimation) {
      audioLoader.play(explosionSound);
    }
  }, [audioLoader, dynamiteExplosionAnimation?.move])

  return null
}


export default AFistfulOfMeeplesSounds