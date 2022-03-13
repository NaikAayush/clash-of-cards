import pinataClient, { PinataClient, PinataPinResponse } from "@pinata/sdk";

import "dotenv/config";
import { ReadStream } from "fs";

const pinata = pinataClient(
  process.env.PINATA_API_KEY as string,
  process.env.PINATA_SECRET_KEY as string
);

pinata
  .testAuthentication()
  .then((result) => {
    console.log(result);
  })
  .catch((err) => {
    console.log(err);
  });

export async function pinFileToIPFS(file: ReadStream) {
  return await pinata.pinFileToIPFS(file);
}
