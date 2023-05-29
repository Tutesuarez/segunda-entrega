import { messageModel } from "../models/message.model.js"

export default class MessageManager {
  async addMessage(data) {
    let { user, message, socketid } = data
    let result = await messageModel.create({ user, message, socketid })
    return result
  }

  async getMessages() {
    let result = await messageModel.find().lean()
    return result;
  }
}
