import { createCanvas } from "@napi-rs/canvas"
import { isRandom } from "./utile"

export const tileHeight = 64,
  tileWidth = 130,
  tileNumber = 6,
  texWidth = 130,
  texHeight = 230,
  rows = 9,
  width = tileWidth * tileNumber,
  height = tileHeight * tileNumber + 40,
  canvas = createCanvas(width, height)

const ctx = canvas.getContext("2d")
ctx.translate(width / 2, 0)

// generate random tile map
export const generateTile = (
  typeChance = [60, 20, 15, 5],
  tileChance = [50, 10, 10, 10, 7, 5, 2.5, 1, 0.5]
) => {
  const randomType = typeChance.reduce(
    (acc, cur, index) => (isRandom(cur) ? index : acc),
    0
  )

  const newTileMap = new Uint8Array(tileNumber * tileNumber)
  for (let i = 0; i < tileNumber * tileNumber; i++) {
    //get a random tile based on tileChance
    const randomTile = tileChance.findIndex((cur) => isRandom(cur))

    newTileMap[i] = (randomTile > 0 ? randomTile : 0) * rows + randomType
  }

  return newTileMap
}

export const drawFromMap = (img: any, tileMap: Uint8Array) => {
  clear()

  tileMap.forEach((t: number, i: number) => {
    const x = Math.trunc(i / tileNumber)
    const y = Math.trunc(i % tileNumber)
    const row = Math.trunc(t / rows)
    const col = Math.trunc(t % rows)
    drawTile(img, x, y, row, col)
  })
  return canvas
}

const clear = () => {
  ctx.clearRect(-width, -height, width * 2, height * 2)
}

const drawTile = (img: any, x: number, y: number, row: number, col: number) => {
  ctx.save()
  ctx.translate(((y - x) * tileWidth) / 2, ((x + y) * tileHeight) / 2)
  ctx.drawImage(
    img,
    row * texWidth,
    col * texHeight,
    texWidth,
    texHeight,
    -tileHeight,
    -tileWidth,
    texWidth,
    texHeight
  )
  ctx.restore()
  return canvas
}