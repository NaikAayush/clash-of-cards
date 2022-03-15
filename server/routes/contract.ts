import { ethers, Wallet, utils } from "ethers";
import { Router } from "express";
import { readFileSync, writeFileSync } from "fs";

import ClashOfCards from "../abis/ClashOfCards.json";
import ClashToken from "../abis/ClashToken.json";

let clashTokenAddress = "0x4058aBB6a8Db6950a4C5CFdb01027B9BaAbbCc67";
let clashNFTAddress = "0xF122a37Ee4A62ECDd36F6cAF9dfA7c4AECDe09CF";

const provider: ethers.providers.JsonRpcProvider =
  new ethers.providers.JsonRpcProvider(process.env.alchemyUrl);
const wallet = new Wallet(process.env.privateKey as string, provider);

async function mint(address: string) {
  const iFace = new ethers.utils.Interface(ClashToken.abi);
  const amount = utils.parseEther("100").toString();
  const data = iFace.encodeFunctionData("mint", [address, amount]);
  let tx;
  try {
    tx = await wallet.sendTransaction({
      from: process.env.privateAddress,
      to: clashTokenAddress,
      gasLimit: 220000,
      data: data,
    });
  } catch (error) {
    tx = error;
  }
  return tx;
}

async function mintNFT(address: string) {
  let NFTData = JSON.parse(readFileSync("./data/data_mut.json", "utf-8"));
  const nftArr = NFTData.data.slice(-8);
  NFTData = NFTData.data.slice(0, -8);
  writeFileSync("./data/data_mut.json", JSON.stringify({ data: NFTData }));

  const iFace = new ethers.utils.Interface(ClashOfCards.abi);
  const data = iFace.encodeFunctionData("mintMany", [address, nftArr]);
  let tx;
  try {
    tx = await wallet.sendTransaction({
      from: process.env.privateAddress,
      to: clashNFTAddress,
      gasLimit: 2000000,
      nonce: await provider.getTransactionCount(
        process.env.privateAddress as string,
        "latest"
      ),
      data: data,
    });
  } catch (error) {
    tx = { error: error };
  }
  return tx;
}

async function cancel() {
  let tx;
  try {
    tx = await wallet.sendTransaction({
      from: process.env.privateAddress,
      to: ethers.constants.AddressZero,
      gasLimit: 220000,
      nonce: 0,
      data: "0x",
    });
  } catch (error) {
    tx = { error: error };
  }
  console.log(tx);
  return tx;
}

export const contract = Router();

contract.get("/token/:address", async (req, res) => {
  const address = req.params.address;
  const tx = await mint(address);
  res.send(tx);
});

contract.get("/nft/:address", async (req, res) => {
  const address = req.params.address;
  const tx = await mintNFT(address);
  res.send(tx);
});
