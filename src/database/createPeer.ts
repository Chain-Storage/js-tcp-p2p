import { getModelForClass, prop } from "@typegoose/typegoose";
import mongoose, { connect, connection } from "mongoose";
import dotenv from "dotenv";

class UserClass {
  @prop()
  public PublicIpV4?: string;

  @prop()
  public DeviceIp?: string;

  @prop()
  public hostName?: string;

  @prop()
  public peerHash?: string;
}

export async function createPeer(
  PublicIpV4: string,
  DeviceIp: string,
  hostName: string,
  peerHash: string
) {
  dotenv.config();
  await connect(`${process.env.MONGOURI}`);

  const UserModel = getModelForClass(UserClass);

  let document = await UserModel.create({
    PublicIpV4,
    DeviceIp,
    hostName,
    peerHash,
  });

  mongoose.disconnect();
}

export async function removePeer(DeviceIp: string, hostName: string) {
  dotenv.config();
  await connect(`${process.env.MONGOURI}`);

  const UserModel = getModelForClass(UserClass);

  let document = await UserModel.deleteMany({
    DeviceIp,
    hostName,
  }).exec();

  mongoose.disconnect();
}

export async function getPeers(): Promise<any> {
  dotenv.config();
  await connect(`${process.env.MONGOURI}`);

  const UserModel = getModelForClass(UserClass);

  let document: any = await UserModel.find({}).exec();

  mongoose.disconnect();

  return document;
}
