import { ethers, Wallet, utils } from "ethers";
import { Router } from "express";
import { readFileSync, writeFileSync } from "fs";
import cron from "node-cron";

import ClashOfCards from "../abis/ClashOfCards.json";
import ClashToken from "../abis/ClashToken.json";
import ClashMatchMaker from "../abis/ClashMatchMaking.json";

const clashTokenAddress = "0x31fF5086cb3d0c62f7049Ff0164b1a41e3C64627";
const clashNFTAddress = "0x8E4E2F6bf09fF635C6522b0633B03C7CB4548270";
const clashMatchMakingAddress = "0xfB8c33bc1A701951D9D484D4F7BFC25e3FF7F965";

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

export const contract = Router();

contract.get("/token/:address", async (req, res) => {
  try {
    const address = req.params.address;
    const tx = await mint(address);
    res.send(tx);
  } catch (error) {
    res.send(error);
  }
});

contract.get("/nft/:address", async (req, res) => {
  try {
    const address = req.params.address;
    const tx = await mintNFT(address);
    res.send(tx);
  } catch (error) {
    res.send(error);
  }
});

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function makeMatches() {
  const contract = new ethers.utils.Interface(ClashMatchMaker.abi);
  const data = contract.encodeFunctionData("pairOpponents");

  for (; true; ) {
    try {
      console.log("Making matches");
      const tx = await wallet.sendTransaction({
        from: process.env.privateAddress,
        to: clashMatchMakingAddress,
        data: data,
        gasLimit: 420000,
      });
      const resp = await tx.wait();
      console.log("Made matches", resp);
    } catch (error) {
      console.log("match making failed with error", error);
    }

    sleep(5000);
  }
}

makeMatches();
