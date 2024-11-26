const asyncHandler = require("express-async-handler")
const Message = require("../models/messageModel")
const User = require("../models/userModel")
const Chat = require("../models/chatModel")
const CryptoJS = require('crypto-js')
const sendMessage = asyncHandler(async (req, res) => {
    const { content, chatId, isFile, isEncrypted } = req.body;
    if (!content || !chatId) {
        console.log("Invalid data passed into request")
        return res.sendStatus(400)
    }
    var newMessage = {
        sender: req.user._id,
        content: content,
        isFile: isFile,
        chat: chatId,
        isEncrypted: isEncrypted
    }

    try {
        var message = await Message.create(newMessage)
        message = await message.populate("sender", "name pic")
        message = await message.populate("chat")
        message = await User.populate(message, {
            path: 'chat.users',
            select: 'name pic email'
        })

        await Chat.findByIdAndUpdate(req.body.chatId, {
            latestMessage: message,

        })
        res.json(message)

    } catch (error) {
        res.status(400)
        throw new Error(error.message)

    }

})

const allMessages = asyncHandler(async (req, res) => {
    try {
        const msgs = await Message.find({ chat: req.params.chatId })
            .populate("sender", "name pic email")
            .populate("chat")

        //TODO: Arreglar encriptacion

        // .exec((err, messages) => {
        //     if (err) {
        //         console.log('ha ocurrido un error')
        //     }
        //     else {
        //         messages.forEach((message) => {
        //             if (message.isEncrypted) {
        //                 var encrypted = message.content.toString()
        //                 var decryptedBytes = CryptoJS.AES.decrypt(encrypted.toString(), '12345');
        //                 var decryptedPlaintext = decryptedBytes.toString(CryptoJS.enc.Utf8);


        //                 message.content = decryptedPlaintext;

        //             }
        //         })

        //     }

        //     res.json(messages)

        // })


        // Object.keys(messages).forEach(function (key, index) {
        //     if (messages[key].isEncrypted) {
        //         const decryptedBytes = CryptoJS.AES.decrypt(messages[key].content, '12345')
        //         messages[key].content = decryptedBytes.toString(CryptoJS.enc.Utf8)
        //         console.log(messages[key].content)
        //         messages[key].content = CryptoJS.AES.decrypt(messages[key].content, key).toString(CryptoJS.enc.Utf8)
        //     }
        // })

        // const response = { msj: [messages] };
        // const decryptionPromises = response.msj.map(async (message) => {
        //     if (message.isEncrypted) {
        //         const decryptedBytes = CryptoJS.AES.decrypt(message, '12345');
        //         const decryptedPlaintext = decryptedBytes.toString(CryptoJS.enc.Utf8);
        //         message.content = decryptedPlaintext;
        //         message.isEncrypted = false; 

        //     }

        //     await Promise.all(decryptionPromises)



        // });




        res.json(msgs)

    } catch (error) {
        res.status(400)
        throw new Error(error.messag)
    }
})

module.exports = { sendMessage, allMessages }