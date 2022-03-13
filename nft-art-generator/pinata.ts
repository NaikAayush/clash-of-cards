import pinataClient, { PinataClient, PinataPinResponse } from "@pinata/sdk";

import "dotenv/config";
import { ReadStream } from "fs";

const pinata = pinataClient(
  process.env.PINATA_API_KEY as string,
  process.env.PINATA_SECRET_KEY as string
);

async function init() {
  await pinata
    .testAuthentication()
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
    });
}

init();

export async function pinFileToIPFS(file: ReadStream, metadata: any) {
  return await pinata.pinFileToIPFS(file, { pinataMetadata: metadata });
}
