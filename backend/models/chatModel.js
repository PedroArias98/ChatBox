const mongoose = require('mongoose')
const chatModel = mongoose.Schema(
    {
        chatName: { type: String, trim: true },
        isGroupChat: { type: Boolean, default: false },
        users: [{
            type: mongoose.Schema.Types.ObjectId,//id de los usuarios pertenecientes al grupo
            ref: "User",
        },
        ],
        latestMessage: {
            type: mongoose.Schema.Types.ObjectId, //id del ultimo mensaje 
            ref: "Message"

        },
        groupAdmin: {
            type: mongoose.Schema.Types.ObjectId,//id de los usuarios administrador del grupo
            ref: "User",
        },


    }, { timestamps: true }
)

const Chat = mongoose.model("Chat", chatModel)
module.exports = Chat