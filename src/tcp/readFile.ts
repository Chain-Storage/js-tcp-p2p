import path from "path";
import fs from "fs";
import crypto from "crypto";

import { IreadFile } from "../@interfaces/readFileInterface";

export async function readFile(): Promise<IreadFile> {
  const filePath = path.join(process.argv[2]);
  const fileName = path.basename(process.argv[2]);

  const buffer = fs.readFileSync(filePath);

  const fileHash = crypto
    .createHash("sha256")
    .update("Ec" + fileName)
    .digest("hex") as string;

  function mySplit(a: Buffer, delimiter: number): number[][] {
    const result = [];
    let currentToken = [];

    for (let i: number = 0; i < a.length; i++) {
      if (a[i] === delimiter) {
        if (currentToken.length !== 0) result.push(currentToken);
        currentToken = [];
      } else {
        currentToken.push(a[i]);
      }
    }
    if (currentToken.length !== 0) result.push(currentToken);

    return result;
  }

  const fileData: number[] = mySplit(buffer, -1)[0];

  console.log(fileData, fileHash, fileName);

  return {
    fileData,
    fileHash,
    fileName,
  };
}
