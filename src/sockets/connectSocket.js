import http from 'http'
import { Server } from 'socket.io'
import defineModels from '../models/index.js';
import Peer from 'simple-peer';
import wrtc from 'wrtc'
const { Message } = defineModels()
import { MediaStream } from 'wrtc';

const createConnections = (app) => {

    //########### trivia #########################

    let users = []
    let objectUser = {
        content: 'hola',
        socketId: 1,
        username: 'hola',
        Sender: 'server',
        SenderId: 1,
        ConversationId: 1,
    }
    let userName;

    let usernames = []

    const server = http.createServer(app);

    const io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
    });

    io.on("connection", (socket) => {

        console.log(`Cliente WebSocket conectado con ID: ${socket.id}`);

        socket.on("joinConversation", async (conversationId, username, userId) => {

            socket.join(conversationId);
            if (!usernames.some(user => user.username == username)) {
                usernames.push({ username, userId, socketId: socket.id })
            }

            console.log(`${username} se unió a la conversación ${conversationId}`);
            let socketId = socket.id
            objectUser = {
                content: `${username} abandonó esta conversación`,
                socketId,
                username,
                Sender: 'server1',
                SenderId: userId,
                ConversationId: conversationId,
            }
            users.push(objectUser)

            const content = `${username} conectado a este lugar`

            const notice = {
                content: `${username} conectado a este lugar`,
                Sender: 'server',
                SenderId: userId,
                ConversationId: conversationId,
            }
            io.emit('newConversation', notice, username, conversationId);
            io.to(conversationId).emit('message', notice, username);

        });


        // socket.on('connectPeer', isAnfitrion => {
        //     //const userName = usernames.find(user => user.username == socket.id)

        //     io.emit('anfitrionConnect', (isAnfitrion))
        // })
        socket.on('anfitrionSignal', data => {
            io.emit('anfitrionSignal', data);
        });

        socket.on('invitadoSignal', data => {
            io.emit('invitadoSignal', data);
        });

        socket.on('trivia', async (command) => {

            let inicio = 1

            const notice2 = {
                content: `mensaje repetitivo`,
                Sender: 'botesito',
                ConversationId: 23,
                SenderId: 1
            }
            const notice3 = {
                content: `se detuvo la trivia`,
                Sender: 'botesito',
                ConversationId: 23,
                SenderId: 1
            }
            let intervalo
            if (command == '!trivia') {

                function enviarMensajePeriodico() {
                    io.to(23).emit('serverMessage', notice2, 'gerardo');
                }

                intervalo = setInterval(enviarMensajePeriodico, inicio == 2 ? 10000 : 30000);
            }

            if (command == '!stop') {
                console.log('se intentó detener tricia')
                clearInterval(intervalo)
                intervalo = null
                io.to(23).emit('serverMessage', notice3, 'gerardo');
            }

        });

        socket.on('message', async (data, username) => {
            data = JSON.parse(data);
            console.log(`Mensaje recibido de ${data.SenderId} en la conversación ${data.ConversationId}: ${data.content}`);

            const ConversationId = data.ConversationId
            const SenderId = data.SenderId
            const content = data.content
            const Sender = data.Sender

            if (data.id) {
                const exist = await Message.findOne({
                    where: { id: data.id }
                })
                io.to(ConversationId).emit('message', exist, username)
            } else {
                const newMessage = await Message.create({
                    ConversationId,
                    SenderId,
                    content,
                    Sender
                })
                io.to(ConversationId).emit('message', newMessage, username)
            }

            console.log(`Mensaje enviado a la conversación ${data.ConversationId}`);
        });

        socket.on('disconnecting', () => {
            // Abandonar todos los canales cuando el cliente se desconecta

            for (const room of socket.rooms) {
                if (room !== socket.id) {
                    socket.leave(room);
                    const user = users.find(user => user.socketId == socket.id)
                    console.log(`Cliente ${user.username} abandonó la conversación ${room}`);
                    io.emit('message', objectUser, user.username)

                }
            }
        });
    });

    return server
}
export default createConnections



