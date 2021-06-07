import GameState from './GameState'

export enum MiningBagContent {
  Gold,
  Stone,
  Dynamite
}

export default MiningBagContent

export function drawCubesFromBag(state: GameState, amount: number): MiningBagContent[] {
  const result: MiningBagContent[] = []
  for (let i: number = 0; i < amount; ++i) {
    const value = Math.floor(Math.random() * (state.goldCubesInMiningBag + state.stoneCubesInMiningBag + state.dynamitesInMiningBag))
    if (value < state.goldCubesInMiningBag) {
      result.push(MiningBagContent.Gold)
      --state.goldCubesInMiningBag
    } else if (value < state.goldCubesInMiningBag + state.stoneCubesInMiningBag) {
      result.push(MiningBagContent.Stone)
      --state.stoneCubesInMiningBag
    } else {
      result.push(MiningBagContent.Dynamite)
      --state.dynamitesInMiningBag
    }
  }
  return result
}