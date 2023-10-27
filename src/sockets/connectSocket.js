import http from 'http'
import { Server } from 'socket.io'


const createConnections = (app) => {

    const server = http.createServer(app);

    const io = new Server(server, {
        cors: {
            origin: '*', // Reemplaza esto con el origen de tu aplicación web
            methods: ['GET', 'POST'],
        },
    });

    io.on("connection", (socket) => {
        console.log(`Cliente WebSocket conectado con ID: ${socket.id}`);

        socket.on("joinConversation", (conversationId, username, userId) => {

            socket.join(conversationId); // Crea o únete a una sala por el ID de la conversación
            console.log(`Cliente ${username} se unió a la conversación ${conversationId}`);

            const notice = {
                content: `${username} ahora está conectado a esta conversacion`,
                Sender:'server',
                SenderId:userId,
                conversationId: conversationId,
                connect: true,
                type:'userConnected'
            }
            io.to(conversationId).emit('userConnected', notice );
        });

        socket.on('message', (data) => {
            data = JSON.parse(data);
            console.log(`Mensaje recibido de ${data.senderId} en la conversación ${data.conversationId}: ${data.content}`);

            // Envía el mensaje solo a la sala específica

            io.to(data.conversationId).emit('message', data, data.senderId)

            // También puedes agregar mensajes de depuración aquí para verificar si se está enviando a la sala correcta
            console.log(`Mensaje enviado a la conversación ${data.conversationId}`);
        });

        socket.on('disconnecting', () => {
            // Abandonar todos los canales cuando el cliente se desconecta
            
            for (const room of socket.rooms) {
                if (room !== socket.id) {
                    socket.leave(room);
                    console.log(`Cliente ${socket.id} abandonó la conversación ${room}`);
                    const notice = {
                        content: ` se desconectó`,
                        Sender: 'server',
                        SenderId:1,
                        conversationId: room,
                        connect: false
                    }
                    io.to(room).emit('message', notice)
                }
            }
        });
    });

    return server
}
export default createConnections



