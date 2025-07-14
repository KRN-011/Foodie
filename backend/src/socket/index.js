import { Server } from "socket.io";

export default function setupSocket(server) {
    const io = new Server(server, {
        cors: { origin: '*' }
    })

    io.on('connection', (socket) => {
        console.log('Socket Connected:', socket.id);

        socket.on('disconnect', () => {
            console.log('Socket Disconnected:', socket.id);
        })
    })

    return io;
}
