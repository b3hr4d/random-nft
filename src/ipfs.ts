import { Canvas } from "@napi-rs/canvas"
import { writeFile } from "fs/promises"
import { File, FilesSource, NFTStorage } from "nft.storage"
import { join } from "path"
import { Attributes, MetaData } from "./types"

const NFT_STORAGE_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEUwRWIxNTFFZTYwQTdCNjgxODg0OEM0N2E5MDFjOTYyRkI4MjA3ODAiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2MzIzNjY4OTg0MiwibmFtZSI6IlNtYXJ0TGFuZCJ9.80TUpP0W3mQbJukiMFuVpm-fRigdDLfZ9sI2QZKAIac"
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
    getPath("./assets/allData.json"),
    JSON.stringify(allData, null, 2)
  )

  return ipfs ? await client.storeDirectory(file) : ""
}
