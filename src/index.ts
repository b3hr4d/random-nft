import { loadImage } from "@napi-rs/canvas"
import { File } from "nft.storage"
import { saveDirectory, saveMetadata, savePicture } from "./ipfs"
import drawRandomNFT, { allData } from "./NFT"

const allNFT: File[] = []

loadImage("./src/assets/Texture.png").then(async (image) => {
  // generate 10000 tile map and save to file
  for (let i = 0; i < 10; i++) {
    const { canvas, attributes } = drawRandomNFT(
      image,
      [60, 20, 15, 5],
      [30, 20, 20, 10, 10, 7, 5, 2.5, 1]
    )
    try {
      const url = await savePicture(canvas, i, true)

      console.log(i, url)

      const metadata = {
        name: `SmartLand #${i}`,
        external_url: `https://smartworld.app/nft/${i}`,
        description:
          "It leaves in the 3d Earth on the home page of the website.",
        image: `ipfs://${url}`,
        attributes,
      }

      allNFT[i] = await saveMetadata(metadata, i)
    } catch (err) {
      console.log("url: ", err)
    }
  }

  const ipfs = await saveDirectory(allNFT, allData, true)
  console.log(ipfs)
})
