import { connectPeer } from "../peers/connectPeer";
import { getPeers } from "../database/createPeer";
import { readFile } from "./readFile";

async function sendMessage() {
  const findPeers: any = await getPeers();
  const peers: any[] = [findPeers];

  let peersIp: string[] = [];

  for (let index = 0; index < findPeers.length; index++) {
    peersIp.push(peers[0][index].DeviceIp);
  }

  let uniqueChars: any[] = [...new Set(peersIp)];
  console.log(uniqueChars);

  const readFiles = readFile();
  console.log((await readFiles).fileData.length / 60000);
  console.log(Math.trunc((await readFiles).fileData.length / 60000) + 1);

  const loopCount: number =
    Math.trunc((await readFiles).fileData.length / 256) + 1;

  const sliceSize = Math.ceil((await readFiles).fileData.length / loopCount);
  const partsArray: any[] = [];

  console.log(loopCount);

  for (let i = 0; i < loopCount; i++) {
    const start = i * sliceSize;
    const end = start + sliceSize;
    partsArray.push((await readFiles).fileData.slice(start, end));
    let elementIp: string = "";

    // Change Configuration Send File by External IpV4
    if (typeof uniqueChars[i] !== "undefined") {
      elementIp = uniqueChars[i];
    } else {
      elementIp = uniqueChars[0];
    }

    console.log("Peers Ip: " + elementIp);

    connectPeer(
      elementIp,
      partsArray[partsArray.length - 1],
      `${(await readFiles).fileHash}-${i + 1}`,
      "sendFile",
      `${(await readFiles).fileName}`
    );

    if (loopCount === 1) {
      continue;
    }
  }

  console.log(partsArray);

  setTimeout(() => {
    process.exit(0);
  }, 20000);
}

sendMessage();
