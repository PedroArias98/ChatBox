const express = require("express")
const dotenv = require("dotenv")
const colors = require("colors")

const cors = require("cors")

const userRoutes = require("./routes/userRoutes")
const chatRoutes = require("./routes/chatRoutes")
const messageRoutes = require("./routes/messageRoutes")


const { notFound, errorHandler } = require("./middleware/errorMiddleware")
const { chats } = require("./data/data")

const { users } = require("./data/data")

const connectDB = require("./config/db")
dotenv.config()
const app = express()

//CORS configuracion API
const corsOptions = {
    origin: ["https://chat-6ij5bomgq-pedroarias98s-projects.vercel.app", "https://chat-box-snowy-xi.vercel.app"], // Permite solicitudes desde localhost:3000
    methods: ["GET", "POST"], // Métodos permitidos
    allowedHeaders: ['Content-Type'], // Encabezados permitidos
    credentials: true,
};
app.use(cors(corsOptions));

connectDB();

app.get('/', (req, res) => {
    res.send("API is running succesfuly")
})



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

const PORT = process.env.PORT || 8080;

//const server = app.listen(5000, console.log(`"SERVER STARTED AT PORT ${PORT}"`.yellow.bold))

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`.yellow.bold);
});
//CORS configuracion socket.io
const io = require('socket.io')(server, {
    cors: {
        origin: ["https://chat-6ij5bomgq-pedroarias98s-projects.vercel.app", "https://chat-box-snowy-xi.vercel.app"], // Asegúrate de que esta URL es correcta
        methods: ["GET", "POST"],
        credentials: true,
    },
})





io.on("connection", (socket) => {
    console.log('connectd to socket.io')

    socket.on('setup', (userData) => {
        socket.join(userData._id)
        console.log("la data del ususario es :" + userData._id)
        socket.emit("connected")

    })

    socket.on('join chat', (room) => {
        socket.join(room)
        console.log("User Joined Room: " + room)
    })

    socket.on('typing', (room) => socket.in(room).emit("typing"))
    socket.on('stop typing', (room) => socket.in(room).emit("stop typing"))


    socket.on('new message', (newMessageReceived) => {
        var chat = newMessageReceived.chat
        if (!chat.users) {
            return console.log("chat.users not defined")
        }

        chat.users.forEach(user => {
            if (user._id == newMessageReceived.sender._id) {
                return
            }
            socket.in(user._id).emit("message received", newMessageReceived)
        })
    })



    socket.off("setup", () => {
        console.log("USER DISCONNECTED")
        socket.leave(userData._id)
    })

    //VIDEO CALLS
    socket.emit('me', socket.id)
    console.log("El id del socket es: " + socket.id)
    socket.on('disconnect', () => {
        socket.broadcast.emit("callended")
    })

    socket.on("calluser", ({ userToCall, signalData, from, name }) => {
        io.to(userToCall).emit("calluser", { signal: signalData, from, name })

    })

    socket.on("answercall", (data) => {
        io.to(data.to).emit("callaccepted", data.signal)
    })

})
