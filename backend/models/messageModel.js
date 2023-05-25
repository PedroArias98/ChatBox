const mongoose = require('mongoose')
const CryptoJS = require("crypto-js")
const messageSchema = mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, trim: true },
    isFile: { type: Boolean, default: false },
    isEncrypted: { type: Boolean, default: false },

    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
}, {
    timeStamps: true,

})

messageSchema.pre('save', async function () {

    if (this.isEncrypted) {
        this.content = CryptoJS.AES.encrypt(this.content, '12345').toString()


    }

})



const Message = mongoose.model("Message", messageSchema)

module.exports = Message;


