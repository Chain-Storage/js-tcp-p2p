import net from "net";
import fs from "fs";

import { peers } from "./peers/peerIp";
import { createPeer, removePeer } from "./database/createPeer";
import { createFile, getFileDb } from "./database/files";

async function main() {
  const peresFunction = await peers();
  console.log(peresFunction);

  const server = net.createServer((socket: net.Socket) => {
    // get client's IP address
    const clientIp = socket.remoteAddress;
    console.log(`client connected from ${clientIp}`);

    // 'connection' listener
    let data: any = "";
    socket.on("data", async (chunk: any) => {
      console.log(`Received data from peer: ${chunk}`);
      const obj = JSON.parse(chunk);

      if (obj.type === "sendFile") {
        console.log(obj.fileName);
        createFile(obj.data, obj.fileName, "utf8", obj.fileHash);

        socket.end();
      } else if (obj.type === "getFile") {
        const fileData: any = await getFileDb(obj.fileHash);
        console.log(fileData[1]);
        let jsonString = JSON.stringify(fileData);
        let chunks = [];
        let chunkSize = 256;

        for (let i = 0; i < jsonString.length; i += chunkSize) {
          chunks.push(jsonString.slice(i, i + chunkSize));
        }

        for (let i = 0; i < chunks.length; i++) {
          socket.write(chunks[i]);
        }

        socket.end();
      }
    });

    socket.on("end", () => {
      console.log("peer disconnected");
    });

    socket.on("error", (err) => {
      console.log(err);
    });
  });

  process.on("SIGINT", async function () {
    console.log("Delete to databse");

    await removePeer(peresFunction.DeviceIp, peresFunction.hostName);

    server.close(function () {
      process.exit();
    });
  });

  server.listen(
    {
      host: peresFunction.DeviceIp,
      port: peresFunction.port,
      path: `${__dirname}/files`,
    },
    () => {
      createPeer(
        peresFunction.PublicIpV4,
        peresFunction.DeviceIp,
        peresFunction.hostName,
        peresFunction.peerHash
      );
      console.log("server bound");
    }
  );
}

main();
