import { loadImage } from "@napi-rs/canvas"
import { hexlify } from "ethers/lib/utils"
import { File } from "nft.storage"
import { saveDirectory, saveMetadata, savePicture } from "./ipfs"
import drawRandomNFT, { allData } from "./NFT"

const allNFT: File[] = []

const online = true

loadImage("./src/assets/Texture.png").then(async (image) => {
  // generate 10000 tile map and save to file
  for (let i = 0; i < 100; i++) {
    const { canvas, tileMap, attributes } = drawRandomNFT(
      image,
      [60, 20, 15, 5],
      [30, 20, 20, 10, 10, 7, 5, 2.5, 1]
    )
    try {
      const url = await savePicture(canvas, i, online)

      console.log(i, url)

      const metadata = {
        name: `SmartLand #${i}`,
        external_url: `https://smartworld.app/nft/${i}`,
        description:
          "It leaves in the 3d Earth on the home page of the website.",
        image: `ipfs://${url}`,
        chainData: hexlify(tileMap),
        tileMap,
        attributes,
      }

      allNFT[i] = await saveMetadata(metadata, i)
    } catch (err) {
      console.log("url: ", err)
    }
  }

  const ipfs = await saveDirectory(allNFT, allData, online)

  console.log(ipfs)
})
