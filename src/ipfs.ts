import { File, FilesSource, NFTStorage } from "nft.storage"

const NFT_STORAGE_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEUwRWIxNTFFZTYwQTdCNjgxODg0OEM0N2E5MDFjOTYyRkI4MjA3ODAiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2MzIzNjY4OTg0MiwibmFtZSI6IlNtYXJ0TGFuZCJ9.80TUpP0W3mQbJukiMFuVpm-fRigdDLfZ9sI2QZKAIac"
const client = new NFTStorage({ token: NFT_STORAGE_TOKEN })

export const storeImage = async (image: BlobPart, name: string) => {
  const imageFile = new File([image], `${name}.png`, {
    type: "image/png",
  })

  return await client.storeBlob(imageFile)
}

export const storeDirectory = async (file: FilesSource) => {
  return await client.storeDirectory(file)
}
