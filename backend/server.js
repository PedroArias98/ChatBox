const express = require("express")
const dotenv = require("dotenv")
const colors = require("colors")
const userRoutes = require("./routes/userRoutes")
const chatRoutes = require("./routes/chatRoutes")
const messageRoutes = require("./routes/messageRoutes")


const { notFound, errorHandler } = require("./middleware/errorMiddleware")
const { chats } = require("./data/data")

const { users } = require("./data/data")

const connectDB = require("./config/db")
dotenv.config()
const app = express()

connectDB();

app.get('/', (req, res) => {
    res.send("API is running succesfuly")
})

// app.get("/api/chat", (req, res) => {
//     res.send(chats)
// })

app.get('/api/chat/:id', (req, res) => {

    const singleChat = chats.find((c) => c._id === req.params.id)
    res.send(singleChat)
})

app.use(express.json()) // para aceptar JSON

app.use('/api/user', userRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/message', messageRoutes)

app.use(notFound)
app.use(errorHandler)


app.post("/api/login/user/", (req, res) => {

    res.send(users)
})

const PORT = process.env.PORT || 5000

app.listen(5000, console.log(`"SERVER STARTED AT PORT ${PORT}"`.yellow.bold))

