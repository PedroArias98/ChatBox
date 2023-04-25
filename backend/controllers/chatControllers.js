const asyncHandler = require("express-async-handler")
const Chat = require("../models/chatModel")
const User = require("../models/userModel")

const accessChat = asyncHandler(async (req, res) => {
    const { userId } = req.body
    if (!userId) {
        console.log("User id param not sent with the request")
        return res.sendStatus(400)
    }

    var isChat = await Chat.find({
        isGroupChat: false, //que no sea chat grupal y que coincidan los usuarios
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } }

        ],
    }).populate("users", "-password")
        .populate("latestMessage")

    isChat = await User.populate(isChat, {
        path: 'latestMessage.sender',
        select: "name pic email"
    })

    if (isChat.length > 0) { //si el chat existe, se regresa
        res.send(isChat[0])
    }
    else { //si el chat no existe, se crea
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId]
        }

        try {
            const createdChat = await Chat.create(chatData)
            const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
                "users",
                "-password")
            res.status(200).json(FullChat)

        } catch (error) {
            res.status(400)
            throw new Error(error.message)
        }

    }
})

const fetchChats = asyncHandler(async (req, res) => {

    try {
        Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updateAt: -1 })
            .then(async (results) => {
                results = await User.populate(results, {
                    path: "latestMessage.sender",
                    select: "name pic email",
                })
                res.status(200).send(results)
            })
    }
    catch (error) {
        res.status(400)
        throw new Error(error.message)

    }
})


const createGroupChat = asyncHandler(async (req, res) => {
    if (!req.body.users || !req.body.name) {
        return res.status(400).send({ messae: "Favor de ingresar todos los campos" })

    }
    var users = JSON.parse(req.body.users)
    if (users.lngth < 2) {
        return res
            .status(400)
            .send("Se requiere mas de un usuario para crear un grupo")
    }

    users.push(req.user)
    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user
        })

        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")

        res.status(200).json(fullGroupChat)
    }
    catch (error) {
        res.status(400)
        throw new Error(error)

    }
})




const renameGroup = asyncHandler(async (req, res) => {
    const { chatId, chatName } = req.body
    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        {
            chatName,
        }, {
        new: true, // se debe agregar para que no retorne el nombre antiguo del chat
    }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password")

    if (!updatedChat) {
        res.status(404)
        throw new Error("No se ha encontrado el Chat")
    }
    else {
        res.json(updatedChat)
    }
})

const addToGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body
    const added = await Chat.findByIdAndUpdate(
        chatId, {
        $push: { users: userId },

    },
        {
            new: true
        })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")

    if (!added) {
        res.status(404)
        throw new Error("No se ha podido agregar al usuario")

    }
    else {
        res.json(added)
    }
})

const removeFromGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body

    const removed = await Chat.findByIdAndUpdate(
        chatId, {
        $pull: { users: userId },

    },
        {
            new: true
        })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")

    if (!removed) {
        res.status(404)
        throw new Error("No se ha podido agregar al usuario")

    }
    else {
        res.json(removed)
    }
})

module.exports = { accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup }