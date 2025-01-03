import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import routes from './routes.js'
import { createServer } from 'http'
import { Server } from 'socket.io'

const app = express()

app.use(cors())
app.use(routes)

const server = createServer(app)
const io = new Server(server)

io.on('connection', (socket) => {
    socket.on('message', async (message) => {
        socket.join(message.room)
                console.log(socket.rooms)
        io.to(message.room).emit('message', message)
    })
    socket.on('disconnect', () => {
        console.log('user discon')
    })
})


server.listen(3000, () => console.log('http://localhost:3000'))