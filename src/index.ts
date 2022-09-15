import { loadImage } from "@napi-rs/canvas"
import { promises } from "fs"
import jsonfile from "jsonfile"
import { join } from "path"
import { drawFromMap, generateTile, rows } from "./canvas"
import { Attr, Tile, TileAttributes, TileType, Type } from "./types"

loadImage("./src/assets/Texture.png").then(async (image) => {
  // generate 1000 tile map and save to file
  for (let i = 0; i < 100; i++) {
    const tileMap = generateTile()

    const cols = tileMap[0] % rows
    const type = TileType[cols] as Type

    allData[type].count++

    const canvas = drawFromMap(image, tileMap)
    // get the row and col of the tile map
    const attr = tileMap.reduce((all, item) => {
      const att = TileAttributes[Math.trunc(item / rows)] as Attr
      allData[type].attributes[att] = allData[type].attributes[att] + 1
      return { ...all, [att]: (all[att] || 0) + 1 }
    }, {} as { [key: string]: number })

    try {
      const pngData = await canvas.encode("png")
      // Save file
      const metadata = {
        description:
          "Friendly OpenSea Creature that enjoys long swims in the ocean.",
        external_url: "https://openseacreatures.io/3",
        image:
          "https://storage.googleapis.com/opensea-prod.appspot.com/puffs/3.png",
        name: "Smart Land",
        attributes: attr,
      }
      await jsonfile.writeFile(
        join(__dirname, `../dist/metadata/${i}.json`),
        metadata,
        { spaces: 2 }
      )
      await promises.writeFile(
        join(__dirname, `../dist/images/${i}.png`),
        pngData
      )
    } catch (err) {
      console.log(err)
    }
  }
  await jsonfile.writeFile(join(__dirname, `./assets/allData.json`), allData)
})

const allData: Tile = {
  Grass: {
    count: 0,
    attributes: {
      Base: 0,
      Effect: 0,
      UnBuildable: 0,
      Tree: 0,
      Charchol: 0,
      Iron: 0,
      Gold: 0,
      Crystal: 0,
      Diamond: 0,
    },
  },
  Snow: {
    count: 0,
    attributes: {
      Base: 0,
      Effect: 0,
      UnBuildable: 0,
      Tree: 0,
      Charchol: 0,
      Iron: 0,
      Gold: 0,
      Crystal: 0,
      Diamond: 0,
    },
  },
  Water: {
    count: 0,
    attributes: {
      Base: 0,
      Effect: 0,
      UnBuildable: 0,
      Tree: 0,
      Charchol: 0,
      Iron: 0,
      Gold: 0,
      Crystal: 0,
      Diamond: 0,
    },
  },
  Sand: {
    count: 0,
    attributes: {
      Base: 0,
      Effect: 0,
      UnBuildable: 0,
      Tree: 0,
      Charchol: 0,
      Iron: 0,
      Gold: 0,
      Crystal: 0,
      Diamond: 0,
    },
  },
}
