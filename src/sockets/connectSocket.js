import http from 'http'
import { Server } from 'socket.io'


const createConnections = (app) => {

    const server = http.createServer(app);

    const io = new Server(server, {
        cors: {
            origin: '*', 
            methods: ['GET', 'POST'],
        },
    });

    io.on("connection", (socket) => {
        console.log(`Cliente WebSocket conectado con ID: ${socket.id}`);

        socket.on("joinConversation", (conversationId) => {

            socket.join(conversationId); // Crea o únete a una sala por el ID de la conversación
            console.log(`Cliente ${socket.id} se unió a la conversación ${conversationId}`);
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
                }
            }
        });
    });


}
export default createConnections



