import { loadImage } from "@napi-rs/canvas"
import { promises } from "fs"
import { File, FilesSource } from "nft.storage"
import { join } from "path"
import { drawFromMap, generateTile, rows } from "./canvas"
import { storeDirectory, storeImage } from "./ipfs"
import {
  Attr,
  Attributes,
  StandardType,
  TileAttributes,
  TileType,
  Type,
} from "./types"

const allNFT: FilesSource = []

loadImage("./src/assets/Texture.png").then(async (image) => {
  // generate 10000 tile map and save to file
  for (let i = 0; i < 100; i++) {
    const tileMap = generateTile()

    const cols = tileMap[0] % rows
    const type = TileType[cols] as Type

    allData[type]++

    const canvas = drawFromMap(image, tileMap)
    // get the row and col of the tile map
    const attributes = tileMap.reduce(
      (all, item) => {
        const value = TileAttributes[Math.trunc(item / rows)] as Attr

        if (value === "Base") return all

        allData[value]++
        return [...all, { value }]
      },
      [
        {
          trait_type: "Base",
          value: type,
        },
      ] as StandardType[]
    )
    try {
      const pngData = await canvas.encode("png")
      const url = await storeImage(pngData, i.toString())
      console.log(i, url)
      const metadata = {
        name: `SmartLand #${i}`,
        external_url: "https://smartworld.app/nft/3",
        description:
          "SmartLand is a collection of 10000 unique NFTs, it leaves in the 3d Earth on the home page of the website. <a href='smartworld.app'>SmartWorld</a>",
        image: `ipfs://${url}`,
        attributes,
      }
      await savePicture(pngData, `../dist/images/${i}.png`)
      await saveJson(metadata, `../dist/metadata/${i}.json`)
      // Save metadata as file
      const nft = new File(
        [JSON.stringify(metadata, null, 2)],
        `/nft/${i}.json`,
        {
          type: "application/json",
        }
      )
      // @ts-ignore
      allNFT[i] = nft
    } catch (err) {
      console.log(err)
    }
  }
  await saveJson(allData, "./assets/allData.json")
  return await storeDirectory(allNFT)
})

const allData: Attributes = {
  Base: 0,
  Grass: 0,
  Snow: 0,
  Water: 0,
  Sand: 0,
  Effect: 0,
  UnBuildable: 0,
  Tree: 0,
  Charchol: 0,
  Iron: 0,
  Gold: 0,
  Crystal: 0,
  Diamond: 0,
}

const saveJson = async (data: any, url: string) => {
  await promises.writeFile(join(__dirname, url), JSON.stringify(data, null, 2))
}

const savePicture = async (data: Buffer, url: string) => {
  await promises.writeFile(join(__dirname, url), data)
}
