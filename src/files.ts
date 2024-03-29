import { Canvas } from "@napi-rs/canvas"
import { writeFile } from "fs/promises"
import { writeFileSync } from "jsonfile"
import { File, FilesSource, NFTStorage } from "nft.storage"
import { join } from "path"
import { Attributes, MetaData } from "./types"

const NFT_STORAGE_TOKEN = process.env.NFT_STORAGE_TOKEN || ""

const client = new NFTStorage({ token: NFT_STORAGE_TOKEN })

const getPath = (path: string) => join(__dirname, path)

export async function savePicture(
  canvas: Canvas,
  name: number,
  ipfs?: boolean
) {
  const pngData = await canvas.encode("png")

  const imageFile = new File([pngData], `${name}.png`, {
    type: "image/png",
  })

  await writeFile(getPath(`../dist/images/${name}.png`), pngData)
  return ipfs ? await client.storeBlob(imageFile) : ""
}

export async function saveMetadata(metadata: MetaData, name: number | string) {
  const stringMeta = JSON.stringify(metadata, null, 2)

  await writeFile(getPath(`../dist/metadata/${name}.json`), stringMeta)

  return new File([stringMeta], `/${name}.json`, {
    type: "application/json",
  })
}

export const saveDirectory = async (
  file: FilesSource,
  allData: Attributes,
  ipfs?: boolean
) => {
  await writeFile(
    getPath("../dist/allData.json"),
    JSON.stringify(allData, null, 2)
  )

  return ipfs ? await client.storeDirectory(file) : ""
}

export const fileSync = (allMeta: { [key: string]: [string, string] }) => {
  writeFileSync(getPath("../dist/allMeta.json"), allMeta, { spaces: 2 })
}
