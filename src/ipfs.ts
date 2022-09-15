// making metadata for opensea nft and uploading it to IPFS
import { create } from "ipfs-http-client"

const ipfs = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
})

const metadata = {
  name: "My NFT",
  description: "This is my first NFT",
  image: "https://i.imgur.com/3ZQYqXl.png",
  attributes: [
    {
      trait_type: "Background",
      value: "Blue",
    },
    {
      trait_type: "Eyes",
      value: "Happy",
    },
  ],
}

const metadataJson = JSON.stringify(metadata)
const metadataBuffer = Buffer.from(metadataJson)

const metadataCid = async () => await ipfs.add(metadataBuffer)
console.log(metadataCid)
