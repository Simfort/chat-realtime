import * as fs from "fs";

export interface IMessage {
  id?: number;
  receiverId: number;
  senderId: number;
  text: string;
  image: string;
  createdAt: Date;
}

export default class Message {
  static findMessage(fn: (val: IMessage, i: number) => void) {
    const messages: { messages: IMessage[] } = JSON.parse(
      fs.readFileSync("dist/lib/messages.json", "utf-8")
    );
    const message = messages.messages.find(fn);
    return message;
  }
  static addMessage(data: IMessage) {
    const messages: { messages: IMessage[] } = JSON.parse(
      fs.readFileSync("dist/lib/messages.json", "utf-8")
    );
    messages.messages.push({ id: Math.random() * 1000000000, ...data });
    fs.writeFileSync("dist/lib/messages.json", JSON.stringify(messages));
    return data;
  }
  static findAllMessage(fn: (val: IMessage, i: number) => void) {
    const messages: { messages: IMessage[] } = JSON.parse(
      fs.readFileSync("dist/lib/messages.json", "utf-8")
    );
    const messageArr = messages.messages.filter(fn);
    return messageArr;
  }
}
