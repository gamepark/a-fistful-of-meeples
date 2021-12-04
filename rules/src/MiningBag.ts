import GameState from './GameState'

export enum MiningBagContent {
  Gold,
  Stone,
  Dynamite
}

export default MiningBagContent

export function drawCubesFromBag(state: GameState, amount: number): MiningBagContent[] {
  let nGold = state.goldCubesInMiningBag
  let nStones = state.stoneCubesInMiningBag
  let nDynamites = state.dynamitesInMiningBag
  const result: MiningBagContent[] = []
  for (let i: number = 0; i < amount; ++i) {
    const value = Math.floor(Math.random() * (nGold + nStones + nDynamites))
    if (value < nGold) {
      result.push(MiningBagContent.Gold)
      --nGold
    } else if (value < nGold + nStones) {
      result.push(MiningBagContent.Stone)
      --nStones
    } else if (value < nGold + nStones + nDynamites) {
      result.push(MiningBagContent.Dynamite)
      --nDynamites
    }
  }
  return result
}
