import { loadImage } from "@napi-rs/canvas"
import { promises } from "fs"
import { File, FilesSource } from "nft.storage"
import { join } from "path"
import { drawFromMap, generateTile, rows } from "./canvas"
import { ipfsDirectory, ipfsImage } from "./ipfs"
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
    let buildable = {
      trait_type: "Build Power",
      value: 0,
    }
    let unBuildable = { trait_type: "UnBuildable", value: 0 }

    const attributes: StandardType[] = [
      {
        trait_type: "Base",
        value: type,
      },
      buildable,
      unBuildable,
    ]

    tileMap.forEach((item) => {
      const value = TileAttributes[Math.trunc(item / rows)] as Attr

      allData[value]++
      switch (value) {
        case "Base":
          buildable.value++
          break
        case "Effect":
          buildable.value++
          break
        case "UnBuildable":
          unBuildable.value++
          break
        default:
          attributes.push({ trait_type: "Resource", value })
          break
      }
    })
    try {
      const pngData = await canvas.encode("png")
      const url = await ipfsImage(pngData, i.toString())

      console.log(i, url)
      const metadata = {
        name: `SmartLand #${i}`,
        external_url: `https://smartworld.app/nft/${i}`,
        description:
          "It leaves in the 3d Earth on the home page of the website.",
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
      console.log("url: ", err)
    }
  }
  await saveJson(allData, "./assets/allData.json")
  const allUrl = await ipfsDirectory(allNFT)
  console.log(allUrl)
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
